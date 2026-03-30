import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateImage } from "@/lib/generate-image";

export const maxDuration = 60;

const ALLOWED_DIRS = ["blog"];

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

    const result = await generateImage(prompt, directory);

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("[generate-image] Beklenmeyen hata:", err);
    return NextResponse.json(
      { error: "Görsel oluşturulurken bir hata oluştu." },
      { status: 500 }
    );
  }
}
