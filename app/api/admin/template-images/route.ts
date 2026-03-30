import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateImage } from "@/lib/generate-image";
import { getTemplateImageSlots } from "@/lib/templates/template-image-config";

export const maxDuration = 60;

/**
 * GET /api/admin/template-images?templateId=dis-klinikleri
 * Belirli sablonun mevcut gorsellerini dondurur.
 */
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const templateId = request.nextUrl.searchParams.get("templateId");

  try {
    if (templateId) {
      const images = await prisma.templateImage.findMany({
        where: { templateId },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ templateId, images });
    } else {
      const images = await prisma.templateImage.findMany({
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ images });
    }
  } catch {
    return NextResponse.json({ error: "Veritabanı hatası" }, { status: 500 });
  }
}

/**
 * POST /api/admin/template-images
 * Sablon icin gorsel uretir ve kaydeder.
 * Body: { templateId, slot, prompt }
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  try {
    const { templateId, slot, prompt } = await request.json();

    if (!templateId || !slot || !prompt) {
      return NextResponse.json(
        { error: "templateId, slot ve prompt zorunlu." },
        { status: 400 }
      );
    }

    // Sablon config'ini kontrol et
    const config = getTemplateImageSlots(templateId);
    if (!config) {
      return NextResponse.json(
        { error: `Gecersiz sablon: ${templateId}` },
        { status: 400 }
      );
    }

    const slotConfig = config.imageSlots.find((s) => s.slot === slot);
    if (!slotConfig) {
      return NextResponse.json(
        { error: `Gecersiz slot: ${slot}. Mevcut slotlar: ${config.imageSlots.map((s) => s.slot).join(", ")}` },
        { status: 400 }
      );
    }

    // Gorsel uret — config'teki boyut ve oran bilgileriyle
    const result = await generateImage(prompt, "templates", {
      aspectRatio: slotConfig.aspectRatio,
      imageSize: slotConfig.imageSize,
    });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // DB'ye kaydet (upsert — ayni slot varsa guncelle)
    const record = await prisma.templateImage.upsert({
      where: {
        templateId_slot: { templateId, slot },
      },
      create: {
        templateId,
        slot,
        url: result.url,
        prompt,
      },
      update: {
        url: result.url,
        prompt,
      },
    });

    return NextResponse.json({
      success: true,
      image: record,
      model: result.model,
      filename: result.filename,
    });
  } catch (err) {
    console.error("[template-images] Beklenmeyen hata:", err);
    return NextResponse.json(
      { error: "Gorsel olusturulurken bir hata olustu." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/template-images?templateId=dis-klinikleri&slot=hero
 * Belirli sablonun belirli slot gorselini siler.
 */
export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const templateId = request.nextUrl.searchParams.get("templateId");
  const slot = request.nextUrl.searchParams.get("slot");

  if (!templateId || !slot) {
    return NextResponse.json(
      { error: "templateId ve slot parametreleri zorunlu." },
      { status: 400 }
    );
  }

  try {
    await prisma.templateImage.delete({
      where: {
        templateId_slot: { templateId, slot },
      },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gorsel bulunamadi veya silinemedi." },
      { status: 404 }
    );
  }
}
