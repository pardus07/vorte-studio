import { GoogleGenAI } from "@google/genai";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const MODELS = [
  { name: "Nano Banana 2", id: "gemini-3.1-flash-image-preview" },
  { name: "Nano Banana Pro", id: "gemini-3-pro-image-preview" },
  { name: "Imagen 4", id: "imagen-4.0-generate-001" },
];

export interface ImageGenOptions {
  aspectRatio?: string;  // "1:1" | "4:3" | "16:9" | "3:4" | "9:16"
  imageSize?: string;    // "1K" | "2K" | "4K"
}

export async function generateImage(
  prompt: string,
  directory = "blog",
  options?: ImageGenOptions
): Promise<{
  url: string;
  filename: string;
  size: number;
  model: string;
} | { error: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return { error: "GEMINI_API_KEY tanımlı değil." };

  const ai = new GoogleGenAI({ apiKey });
  let imageBytes: Uint8Array | null = null;
  let usedModel = "";

  for (const model of MODELS) {
    try {
      if (model.id.startsWith("imagen")) {
        const response = await ai.models.generateImages({
          model: model.id,
          prompt,
          config: {
            numberOfImages: 1,
            ...(options?.aspectRatio && { aspectRatio: options.aspectRatio }),
            ...(options?.imageSize && { imageSize: options.imageSize }),
          },
        });
        const image = response.generatedImages?.[0];
        if (image?.image?.imageBytes) {
          imageBytes = image.image.imageBytes as unknown as Uint8Array;
          usedModel = model.name;
          break;
        }
      } else {
        const response = await ai.models.generateContent({
          model: model.id,
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: {
            responseModalities: ["IMAGE", "TEXT"],
            ...(options?.aspectRatio || options?.imageSize
              ? {
                  imageConfig: {
                    ...(options?.aspectRatio && { aspectRatio: options.aspectRatio }),
                    ...(options?.imageSize && { imageSize: options.imageSize }),
                  },
                }
              : {}),
          },
        });
        const parts = response.candidates?.[0]?.content?.parts || [];
        const imagePart = parts.find((p) => p.inlineData && typeof p.inlineData === "object");
        if (imagePart?.inlineData?.data) {
          const base64 = imagePart.inlineData.data;
          imageBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
          usedModel = model.name;
          break;
        }
      }
    } catch (err) {
      console.warn(`[generate-image] ${model.name} başarısız, sonraki deneniyor:`, err);
      continue;
    }
  }

  if (!imageBytes) return { error: "Tüm modeller başarısız oldu." };

  const timestamp = Date.now();
  const filename = `ai-${timestamp}.png`;
  const uploadDir = join(process.cwd(), "public", "uploads", directory);
  await mkdir(uploadDir, { recursive: true });
  await writeFile(join(uploadDir, filename), Buffer.from(imageBytes));

  const url = `/api/uploads/${directory}/${filename}`;
  console.log(`[generate-image] Başarılı — model: ${usedModel}, dosya: ${filename}`);

  return { url, filename, size: imageBytes.length, model: usedModel };
}
