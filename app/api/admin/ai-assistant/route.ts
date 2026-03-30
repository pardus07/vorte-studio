import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { GoogleGenAI } from "@google/genai";
import { agentFunctionDeclarations, TOOL_META } from "@/lib/ai-tools";
import { resolveToolCall, executeApprovedToolCall } from "@/lib/ai-executor";
import { buildSystemPrompt } from "@/lib/ai-prompt";
import { getPageContext } from "@/lib/ai-context";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "GEMINI_API_KEY tanımlanmamış" }, { status: 500 });

  try {
    const { messages, pageContext, approvedToolCall } = await req.json();

    // Handle approved tool execution — sonucu Gemini'ye besle, döngüyü devam ettir
    if (approvedToolCall) {
      const { toolName, args } = approvedToolCall;
      let toolResult: Record<string, unknown>;
      let imageUrl: string | undefined;

      // Tool'u çalıştır
      if (toolName === "generate_image") {
        const res = await fetch(new URL("/api/admin/generate-image", req.url), {
          method: "POST",
          headers: { "Content-Type": "application/json", cookie: req.headers.get("cookie") || "" },
          body: JSON.stringify({ prompt: args.prompt, filename: `blog-${Date.now()}`, directory: "blog" }),
        });
        const data = await res.json();
        if (data.error) return NextResponse.json({ reply: `Görsel üretim hatası: ${data.error}` });
        imageUrl = data.url;
        toolResult = { url: data.url, filename: data.filename, model: data.model };
      } else {
        const result = await executeApprovedToolCall(toolName, args);
        if (result.error) return NextResponse.json({ reply: `Hata: ${result.error}` });
        toolResult = (result.data as Record<string, unknown>) || { ok: true };
      }

      // Sonucu Gemini'ye besle — konuşma döngüsünü devam ettir
      const context = getPageContext(pageContext || "/admin/dashboard");
      const systemPrompt = buildSystemPrompt(context.title);
      const ai = new GoogleGenAI({ apiKey });

      // Geçmiş mesajları al
      const history = (messages || [])
        .filter((m: { role: string; content: string }) => m.role === "user" || m.role === "assistant")
        .map((m: { role: string; content: string }) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }],
        }));

      while (history.length > 0 && history[0].role !== "user") {
        history.shift();
      }

      const trimmedHistory = history.length > 30 ? history.slice(-30) : history;

      const chat = ai.chats.create({
        model: "gemini-2.5-flash",
        history: trimmedHistory,
        config: {
          systemInstruction: systemPrompt,
          tools: [{ functionDeclarations: agentFunctionDeclarations }],
        },
      });

      // Tool sonucunu Gemini'ye gönder
      let response = await chat.sendMessage({
        message: {
          functionResponse: {
            name: toolName,
            response: toolResult,
          },
        },
      });

      const executedTools: string[] = [toolName];

      // Gemini'nin devam tool çağrılarını işle (max 5)
      for (let step = 0; step < 5; step++) {
        const functionCalls = response.functionCalls;
        if (!functionCalls || functionCalls.length === 0) break;

        const call = functionCalls[0];
        const nextToolName = call.name!;
        const nextArgs = (call.args || {}) as Record<string, unknown>;
        const meta = TOOL_META[nextToolName];

        // Level 2-3: yeni pending approval dön
        if (meta && meta.level >= 2) {
          const replyText = response.text || "";
          return NextResponse.json({
            reply: replyText || `${meta.description} işlemi için onay bekleniyor...`,
            imageUrl,
            pendingApproval: {
              toolName: nextToolName,
              args: nextArgs,
              level: meta.level,
              summary: meta.description,
            },
          });
        }

        // Level 1: otomatik çalıştır
        const result = await resolveToolCall(nextToolName, nextArgs);
        executedTools.push(nextToolName);

        response = await chat.sendMessage({
          message: {
            functionResponse: {
              name: nextToolName,
              response: result.data
                ? (result.data as Record<string, unknown>)
                : result.error
                  ? { error: result.error }
                  : { ok: true },
            },
          },
        });
      }

      const reply = response.text || "İşlem tamamlandı.";
      return NextResponse.json({ reply, imageUrl, executedTools });
    }

    // ─── Normal chat flow ───

    const context = getPageContext(pageContext || "/admin/dashboard");
    const systemPrompt = buildSystemPrompt(context.title);
    const ai = new GoogleGenAI({ apiKey });

    const history = (messages || [])
      .filter((m: { role: string; content: string }) => m.role === "user" || m.role === "assistant")
      .map((m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

    while (history.length > 0 && history[0].role !== "user") {
      history.shift();
    }

    const trimmedHistory = history.length > 30 ? history.slice(-30) : history;

    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      history: trimmedHistory.slice(0, -1),
      config: {
        systemInstruction: systemPrompt,
        tools: [{ functionDeclarations: agentFunctionDeclarations }],
      },
    });

    const lastMessage =
      trimmedHistory[trimmedHistory.length - 1]?.parts[0]?.text ||
      messages[messages.length - 1]?.content;

    let response = await chat.sendMessage({ message: lastMessage });
    const executedTools: string[] = [];

    // Multi-step tool calling loop (max 5)
    for (let step = 0; step < 5; step++) {
      const functionCalls = response.functionCalls;
      if (!functionCalls || functionCalls.length === 0) break;

      const call = functionCalls[0];
      const toolName = call.name!;
      const args = (call.args || {}) as Record<string, unknown>;
      const meta = TOOL_META[toolName];

      // Level 2-3: return pending approval
      if (meta && meta.level >= 2) {
        const replyText = response.text || "";
        return NextResponse.json({
          reply: replyText || `${meta.description} işlemi için onay bekleniyor...`,
          pendingApproval: {
            toolName,
            args,
            level: meta.level,
            summary: meta.description,
          },
        });
      }

      // Level 1: auto-execute
      let toolResultData: Record<string, unknown>;

      if (toolName === "generate_image") {
        // generate_image özel: API route üzerinden çalıştır
        const imgRes = await fetch(new URL("/api/admin/generate-image", req.url), {
          method: "POST",
          headers: { "Content-Type": "application/json", cookie: req.headers.get("cookie") || "" },
          body: JSON.stringify({ prompt: args.prompt, filename: `blog-${Date.now()}`, directory: (args.directory as string) || "blog" }),
        });
        const imgData = await imgRes.json();
        if (imgData.error) {
          toolResultData = { error: imgData.error };
        } else {
          toolResultData = { url: imgData.url, filename: imgData.filename, model: imgData.model };
        }
      } else {
        const result = await resolveToolCall(toolName, args);
        toolResultData = result.data
          ? (result.data as Record<string, unknown>)
          : result.error
            ? { error: result.error }
            : { ok: true };
      }

      executedTools.push(toolName);

      response = await chat.sendMessage({
        message: {
          functionResponse: {
            name: toolName,
            response: toolResultData,
          },
        },
      });
    }

    const reply = response.text || "Bir yanıt oluşturulamadı.";
    return NextResponse.json({ reply, executedTools });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("[ai-assistant] Error:", errMsg, error);
    return NextResponse.json({
      error: `AI hatası: ${errMsg.substring(0, 200)}`,
    }, { status: 500 });
  }
}
