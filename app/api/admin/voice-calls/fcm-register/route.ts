import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const registerSchema = z.object({
  token: z.string().min(10),
  platform: z.enum(["android", "ios", "web"]).default("android"),
});

/**
 * POST /api/admin/voice-calls/fcm-register
 * Android app'ten FCM device token kaydı.
 * x-voice-ai-source veya x-server-api-key ile auth yapılır.
 */
export async function POST(req: NextRequest) {
  try {
    const serverKey = req.headers.get("x-server-api-key");
    const voiceAiSource = req.headers.get("x-voice-ai-source");
    const isAuthorized =
      serverKey === process.env.VORTE_INTERNAL_API_KEY ||
      voiceAiSource === "vorte-voice-ai";

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Yetkisiz erişim" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { token, platform } = parsed.data;

    // Upsert: aynı token varsa güncelle, yoksa oluştur
    await prisma.deviceToken.upsert({
      where: { token },
      update: {
        active: true,
        platform,
        updatedAt: new Date(),
      },
      create: {
        token,
        platform,
        active: true,
      },
    });

    console.log(
      `[FCM Register] Token kaydedildi: ${token.substring(0, 20)}... (${platform})`
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[FCM Register] Hata:", error);
    return NextResponse.json(
      { error: "Token kayıt hatası" },
      { status: 500 }
    );
  }
}
