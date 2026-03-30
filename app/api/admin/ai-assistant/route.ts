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

    // Handle approved tool execution
    if (approvedToolCall) {
      const { toolName, args } = approvedToolCall;

      // Special handling for generate_image
      if (toolName === "generate_image") {
        const res = await fetch(new URL("/api/admin/generate-image", req.url), {
          method: "POST",
          headers: { "Content-Type": "application/json", cookie: req.headers.get("cookie") || "" },
          body: JSON.stringify({ prompt: args.prompt, filename: `blog-${Date.now()}`, directory: "blog" }),
        });
        const data = await res.json();
        if (data.error) return NextResponse.json({ reply: `Görsel üretim hatası: ${data.error}` });
        return NextResponse.json({ reply: `Görsel üretildi: ${data.url}`, imageUrl: data.url });
      }

      const result = await executeApprovedToolCall(toolName, args);
      if (result.error) return NextResponse.json({ reply: `Hata: ${result.error}` });
      return NextResponse.json({ reply: "İşlem tamamlandı.", data: result.data });
    }

    // Build context
    const context = getPageContext(pageContext || "/admin/dashboard");
    const systemPrompt = buildSystemPrompt(context.title);

    // Initialize Gemini
    const ai = new GoogleGenAI({ apiKey });

    // Build conversation history for Gemini
    const history = (messages || [])
      .filter((m: { role: string; content: string }) => m.role === "user" || m.role === "assistant")
      .map((m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

    // Ensure first message is "user"
    while (history.length > 0 && history[0].role !== "user") {
      history.shift();
    }

    // Limit history
    const trimmedHistory = history.length > 30 ? history.slice(-30) : history;

    // Create chat
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      history: trimmedHistory.slice(0, -1),
      config: {
        systemInstruction: systemPrompt,
        tools: [{ functionDeclarations: agentFunctionDeclarations }],
      },
    });

    // Send last message
    const lastMessage =
      trimmedHistory[trimmedHistory.length - 1]?.parts[0]?.text ||
      messages[messages.length - 1]?.content;

    let response = await chat.sendMessage({ message: lastMessage });
    let executedTools: string[] = [];

    // Multi-step tool calling loop (max 5 iterations)
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
      const result = await resolveToolCall(toolName, args);
      executedTools.push(toolName);

      // Send result back to Gemini
      response = await chat.sendMessage({
        message: {
          functionResponse: {
            name: toolName,
            response: result.data
              ? (result.data as Record<string, unknown>)
              : result.error
                ? { error: result.error }
                : { ok: true },
          },
        },
      });
    }

    const reply = response.text || "Bir yanıt oluşturulamadı.";
    return NextResponse.json({ reply, executedTools });
  } catch (error) {
    console.error("[ai-assistant] Error:", error);
    return NextResponse.json({ error: "AI servisi geçici olarak kullanılamıyor." }, { status: 500 });
  }
}
