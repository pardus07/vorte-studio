import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { GoogleGenAI } from "@google/genai";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export const maxDuration = 60;

const ALLOWED_DIRS = ["blog"];

const MODELS = [
  { name: "Nano Banana 2", id: "gemini-3.1-flash-image-preview" },
  { name: "Nano Banana Pro", id: "gemini-3-pro-image-preview" },
  { name: "Imagen 4", id: "imagen-4.0-generate-001" },
];

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  try {
    const { prompt, directory = "blog" } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt gerekli." },
        { status: 400 }
      );
    }

    if (!ALLOWED_DIRS.includes(directory)) {
      return NextResponse.json(
        { error: `Geçersiz klasör. İzin verilenler: ${ALLOWED_DIRS.join(", ")}` },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY tanımlı değil." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    let imageBytes: Uint8Array | null = null;
    let usedModel = "";

    // Model cascade: sırayla dene
    for (const model of MODELS) {
      try {
        if (model.id.startsWith("imagen")) {
          // Imagen API — farklı çağrı yapısı
          const response = await ai.models.generateImages({
            model: model.id,
            prompt,
            config: {
              numberOfImages: 1,
            },
          });

          const image = response.generatedImages?.[0];
          if (image?.image?.imageBytes) {
            imageBytes = image.image.imageBytes as unknown as Uint8Array;
            usedModel = model.name;
            break;
          }
        } else {
          // Gemini image generation
          const response = await ai.models.generateContent({
            model: model.id,
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }],
              },
            ],
            config: {
              responseModalities: ["IMAGE", "TEXT"],
            },
          });

          const parts = response.candidates?.[0]?.content?.parts || [];
          const imagePart = parts.find(
            (p) => p.inlineData && typeof p.inlineData === "object"
          );

          if (imagePart?.inlineData?.data) {
            const base64 = imagePart.inlineData.data;
            imageBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
            usedModel = model.name;
            break;
          }
        }
      } catch (err) {
        console.warn(`[generate-image] ${model.name} basarisiz, sonraki deneniyor:`, err);
        continue;
      }
    }

    if (!imageBytes) {
      return NextResponse.json(
        { error: "Tüm modeller başarısız oldu. Lütfen tekrar deneyin." },
        { status: 500 }
      );
    }

    // Dosyayı kaydet
    const timestamp = Date.now();
    const filename = `ai-${timestamp}.png`;
    const uploadDir = join(process.cwd(), "public", "uploads", directory);
    await mkdir(uploadDir, { recursive: true });

    const filepath = join(uploadDir, filename);
    await writeFile(filepath, Buffer.from(imageBytes));

    const size = imageBytes.length;
    const url = `/api/uploads/${directory}/${filename}`;

    console.log(`[generate-image] Basarili — model: ${usedModel}, dosya: ${filename}, boyut: ${size}`);

    return NextResponse.json({
      url,
      filename,
      size,
      model: usedModel,
    });
  } catch (err) {
    console.error("[generate-image] Beklenmeyen hata:", err);
    return NextResponse.json(
      { error: "Görsel oluşturulurken bir hata olustu." },
      { status: 500 }
    );
  }
}
