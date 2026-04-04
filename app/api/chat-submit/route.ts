import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      slug,
      firmName,
      contactName,
      contactPhone,
      siteType,
      features,
      pageCount,
      contentStatus,
      hostingStatus,
      hostingProvider,
      domainStatus,
      domainName,
      timeline,
      message,
      sector,
      city,
      completedSteps,
      freeQuestions,
      leadId,
    } = body;

    if (!slug || !firmName) {
      return NextResponse.json(
        { success: false, error: "slug ve firmName zorunlu" },
        { status: 400 }
      );
    }

    // Lead skoru hesapla
    let score = "cold";
    if (contactPhone && timeline) {
      if (timeline === "acil" || timeline === "1-ay") {
        score = "hot";
      } else if (timeline === "2-3-ay") {
        score = "warm";
      }
    }

    // ChatSubmission oluştur
    const submission = await prisma.chatSubmission.create({
      data: {
        slug,
        firmName,
        contactName: contactName || null,
        contactPhone: contactPhone || null,
        siteType: siteType || null,
        features: features || [],
        pageCount: pageCount || null,
        contentStatus: contentStatus || null,
        hostingStatus: hostingStatus || null,
        hostingProvider: hostingProvider || null,
        domainStatus: domainStatus || null,
        domainName: domainName || null,
        timeline: timeline || null,
        message: message || null,
        sector: sector || null,
        city: city || null,
        completedSteps: completedSteps || 0,
        score,
        freeQuestions: freeQuestions || [],
        leadId: leadId || null,
      },
    });

    // Otomatik Lead oluştur (telefon varsa ve leadId yoksa)
    if (contactPhone && !leadId) {
      try {
        const newLead = await prisma.lead.create({
          data: {
            name: contactName || firmName,
            phone: contactPhone,
            sector: sector || null,
            source: "SITE_FORM",
            status: "CONTACTED",
            notes: [
              siteType ? `Site türü: ${siteType}` : "",
              timeline ? `Zaman: ${timeline}` : "",
              message ? `Not: ${message}` : "",
            ]
              .filter(Boolean)
              .join("\n"),
          },
        });

        // ChatSubmission'a lead bağla
        await prisma.chatSubmission.update({
          where: { id: submission.id },
          data: { leadId: newLead.id },
        });
      } catch {
        // Lead oluşturulamazsa sessiz devam et
      }
    }

    return NextResponse.json({ success: true, id: submission.id });
  } catch (err) {
    console.error("Chat submit hatası:", err);
    return NextResponse.json(
      { success: false, error: "Başvuru kaydedilemedi" },
      { status: 500 }
    );
  }
}
