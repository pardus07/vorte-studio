import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import path from "path";
import { readFile } from "fs/promises";
import { existsSync } from "fs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  const { id } = await params;
  try {
    const callLog = await prisma.callLog.findUnique({
      where: { id },
      select: { audioUrl: true },
    });
    if (!callLog) return NextResponse.json({ error: "Bulunamadi" }, { status: 404 });
    if (!callLog.audioUrl) return NextResponse.json({ error: "Ses kaydi yok" }, { status: 404 });

    let filePath: string;
    if (callLog.audioUrl.startsWith("/uploads/")) {
      filePath = path.join(process.cwd(), "public", callLog.audioUrl);
    } else if (path.isAbsolute(callLog.audioUrl)) {
      filePath = callLog.audioUrl;
    } else {
      filePath = path.join(process.cwd(), callLog.audioUrl);
    }

    if (!existsSync(filePath)) return NextResponse.json({ error: "Dosya bulunamadi" }, { status: 404 });

    const data = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = ext === ".ogg" ? "audio/ogg" : ext === ".mp3" ? "audio/mpeg" : ext === ".wav" ? "audio/wav" : "application/octet-stream";

    return new NextResponse(data, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(data.length),
      },
    });
  } catch (error) {
    console.error("[voice-calls] audio error:", error);
    return NextResponse.json({ error: "Ses dosyasi okunamadi" }, { status: 500 });
  }
}
