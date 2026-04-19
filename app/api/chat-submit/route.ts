import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculatePrice } from "@/lib/pricing-calculator";
import { suggestPackage } from "@/lib/package-suggester";
import { checkRateLimit } from "@/lib/rate-limit";
import { KVKK_VERSION } from "@/lib/kvkk-constants";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // Rate limit: 3 lead/saat/IP — chatbot intake DB yazar, agresif limit
  const limited = checkRateLimit(req, "chat-submit", 3, 60 * 60 * 1000);
  if (limited) return limited;

  try {
    const body = await req.json();

    const {
      slug,
      firmName,
      contactName,
      contactPhone,
      contactEmail,
      siteType,
      features,
      pageCount,
      contentStatus,
      hostingStatus,
      hostingProvider,
      domainStatus,
      domainName,
      timeline,
      businessGoals,
      targetAudience,
      referenceUrls,
      brandColors,
      seoExpectations,
      existingSiteUrl,
      logoStatus,
      socialMediaLinks,
      liveSupportType,
      paymentProvider,
      message,
      sector,
      city,
      completedSteps,
      freeQuestions,
      leadId,
      kvkkAcceptedAt,
      // Sprint 3.5 — attribution verisi (istemci getLeadTrace() ile gönderir)
      trace,
      // kvkkVersion body'den gelir ama GÜVENMİYORUZ — server-side
      // KVKK_VERSION constant'ı kullanılıyor (aşağıda).
    } = body;

    // Trace alanları için güvenli okuyucu — tip garantisi yoksa null'a düş.
    const t = (trace && typeof trace === "object" ? trace : {}) as Record<string, unknown>;
    const traceField = (k: string, max = 500) => {
      const v = t[k];
      return typeof v === "string" && v.length > 0 ? v.slice(0, max) : null;
    };

    if (!slug || !firmName) {
      return NextResponse.json(
        { success: false, error: "slug ve firmName zorunlu" },
        { status: 400 }
      );
    }

    // ── KVKK açık rıza zorunlu (6698 m.10) ──
    // UI bypass edilirse bile DB'ye onaysız kayıt yazılamaz.
    // Delil zincirinin bozulmaması için:
    //   1) Tarih server-side pencerede olmalı (istemci clock tampering önlemi)
    //   2) Version SABİT server-side constant'tan okunur — istemci göndermeye
    //      çalışsa bile yoksayılır (submission.create'te kvkkVersion: KVKK_VERSION)
    if (!kvkkAcceptedAt) {
      return NextResponse.json(
        { success: false, error: "KVKK açık rıza onayı zorunlu" },
        { status: 400 }
      );
    }
    const kvkkDate = new Date(kvkkAcceptedAt);
    if (isNaN(kvkkDate.getTime())) {
      return NextResponse.json(
        { success: false, error: "KVKK onay tarihi geçersiz" },
        { status: 400 }
      );
    }
    // Clock skew toleransı: istemci saati ±5dk kayabilir, kabul ediyoruz.
    // Bunun dışı → istemci tarihi manipüle ediyor, delil bozulur.
    const nowMs = Date.now();
    const driftMs = Math.abs(kvkkDate.getTime() - nowMs);
    if (driftMs > 5 * 60 * 1000) {
      return NextResponse.json(
        {
          success: false,
          error: "KVKK onay tarihi geçerli zaman penceresinde değil",
        },
        { status: 400 }
      );
    }

    // ── İstemci IP + User-Agent (Traefik/Coolify uyumlu) ──
    // x-forwarded-for'un ilk parçası gerçek istemci; sonraki değerler proxy chain.
    const xff = req.headers.get("x-forwarded-for") || "";
    const kvkkAcceptIp =
      xff.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      null;
    const kvkkAcceptUserAgent = req.headers.get("user-agent") || null;

    // Lead skoru hesapla
    let score = "cold";
    if (contactPhone && timeline) {
      if (timeline === "acil" || timeline === "1-ay") {
        score = "hot";
      } else if (timeline === "2-3-ay") {
        score = "warm";
      }
    }

    // Fiyat hesapla (PricingConfig DB'den oku)
    let calculatedPrice: number | null = null;
    let estimatedHours: number | null = null;
    let tokenCost: number | null = null;

    try {
      const configs = await prisma.pricingConfig.findMany({
        where: { isActive: true },
      });
      const pricingItems = configs.map((c) => ({
        id: c.id,
        category: c.category,
        key: c.key,
        label: c.label,
        value: c.value,
        unit: c.unit,
        sortOrder: c.sortOrder,
        isActive: c.isActive,
      }));

      const freeQArr = Array.isArray(freeQuestions) ? freeQuestions : [];
      const result = calculatePrice(
        {
          siteType: siteType || null,
          features: features || [],
          pageCount: pageCount || null,
          contentStatus: contentStatus || null,
          hostingStatus: hostingStatus || null,
          hostingProvider: hostingProvider || null,
          timeline: timeline || null,
          freeQuestionCount: freeQArr.length,
        },
        pricingItems
      );

      calculatedPrice = result.totalPrice;
      estimatedHours = result.estimatedHours;
      tokenCost = result.tokenCost;
    } catch {
      // Fiyat hesaplanamazsa sessiz devam et
    }

    // Paket önerisi (saf fonksiyon — DB gerektirmez, hata fırlatmaz)
    const suggestion = suggestPackage({
      siteType: siteType || null,
      features: features || [],
      pageCount: pageCount || null,
      contentStatus: contentStatus || null,
    });

    // ChatSubmission oluştur
    const submission = await prisma.chatSubmission.create({
      data: {
        slug,
        firmName,
        contactName: contactName || null,
        contactPhone: contactPhone || null,
        contactEmail: contactEmail || null,
        siteType: siteType || null,
        features: features || [],
        pageCount: pageCount || null,
        contentStatus: contentStatus || null,
        hostingStatus: hostingStatus || null,
        hostingProvider: hostingProvider || null,
        domainStatus: domainStatus || null,
        domainName: domainName || null,
        timeline: timeline || null,
        businessGoals: businessGoals || null,
        targetAudience: targetAudience || null,
        referenceUrls: referenceUrls || [],
        brandColors: brandColors || null,
        seoExpectations: seoExpectations || null,
        existingSiteUrl: existingSiteUrl || null,
        logoStatus: logoStatus || null,
        socialMediaLinks: socialMediaLinks || null,
        liveSupportType: liveSupportType || null,
        paymentProvider: paymentProvider || null,
        message: message || null,
        sector: sector || null,
        city: city || null,
        completedSteps: completedSteps || 0,
        score,
        calculatedPrice,
        estimatedHours,
        tokenCost,
        suggestedPackage: suggestion.slug,
        freeQuestions: freeQuestions || [],
        leadId: leadId || null,
        kvkkAcceptedAt: kvkkDate,
        // TRUST BOUNDARY: İstemciden gelen kvkkVersion'ı YOKSAY.
        // Delil niteliği için server-side constant'ı kullan — böylece
        // istemci "v99-fake" yazıp fake delil oluşturamaz.
        kvkkVersion: KVKK_VERSION,
        kvkkAcceptIp,
        kvkkAcceptUserAgent,
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
            // Sprint 3.5 — attribution: sourceDetail chat slug'ına sabitlenir,
            // UTM/referrer varsa istemciden gelen trace kullanılır.
            sourceDetail: traceField("sourceDetail", 200) || `chat:${slug}`,
            sourceUrl: traceField("sourceUrl"),
            referrer: traceField("referrer"),
            utmSource: traceField("utmSource", 100),
            utmMedium: traceField("utmMedium", 100),
            utmCampaign: traceField("utmCampaign", 200),
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

    return NextResponse.json({
      success: true,
      id: submission.id,
      suggestedPackage: suggestion,
    });
  } catch (err) {
    console.error("Chat submit hatası:", err);
    return NextResponse.json(
      { success: false, error: "Başvuru kaydedilemedi" },
      { status: 500 }
    );
  }
}
