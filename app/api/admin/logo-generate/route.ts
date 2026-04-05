import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateImage } from "@/lib/generate-image";
import { generateLogoPrompt } from "@/lib/logo-prompt";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const body = await req.json();
    const { logoProjectId, revisionFeedback } = body as {
      logoProjectId: string;
      revisionFeedback?: string;
    };

    if (!logoProjectId) {
      return NextResponse.json({ error: "logoProjectId gerekli" }, { status: 400 });
    }

    // Logo projesini bul
    const project = await prisma.logoProject.findUnique({
      where: { id: logoProjectId },
      include: { variants: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Logo projesi bulunamadı" }, { status: 404 });
    }

    // Prompt oluştur
    const prompt = generateLogoPrompt({
      firmName: project.firmName,
      sector: project.sector,
      style: project.style,
      brandColors: project.brandColors,
      includeText: project.includeText,
      notes: project.notes,
      revisionFeedback,
    });

    // Durumu güncelle
    await prisma.logoProject.update({
      where: { id: logoProjectId },
      data: { status: "GENERATING" },
    });

    // Görsel üret — logo 1:1, 1K
    const result = await generateImage(prompt, `logos/${logoProjectId}`, {
      aspectRatio: "1:1",
      imageSize: "1K",
    });

    if ("error" in result) {
      await prisma.logoProject.update({
        where: { id: logoProjectId },
        data: { status: "REVIEW" },
      });
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // Varyant kaydet
    const variant = await prisma.logoVariant.create({
      data: {
        logoProjectId,
        url: result.url,
        prompt,
        model: result.model,
      },
    });

    // Proje durumunu güncelle
    await prisma.logoProject.update({
      where: { id: logoProjectId },
      data: { status: "REVIEW" },
    });

    return NextResponse.json({
      success: true,
      variant: {
        id: variant.id,
        url: variant.url,
        model: variant.model,
        createdAt: variant.createdAt,
      },
    });
  } catch (err) {
    console.error("[logo-generate] Hata:", err);
    return NextResponse.json({ error: "Logo üretim hatası" }, { status: 500 });
  }
}
