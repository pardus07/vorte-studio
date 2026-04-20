import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { logLeadStatusChange } from "@/lib/lead-history";

export const dynamic = "force-dynamic";

/**
 * KVKK Lead Opt-Out Endpoint
 *
 * `/demo/[slug]?ref=<leadId>` sayfasındaki DemoDisclaimer'daki "Verimi Sil"
 * butonunun hedefi. Firma sahibi KVKK m.7 silme talebini bu endpoint'e POST eder.
 *
 * Etki:
 *  1. Lead.status → 'OPTED_OUT' (demo sayfası artık 404 döner — D4 gate)
 *  2. LeadOptOutLog'a delil kaydı yazılır (KVKK m.13 başvuru delili, 10 yıl)
 *  3. LeadStatusHistory'e "opt_out" reason ile audit log
 *
 * NOT: Lead kaydı SİLİNMEZ — sadece status değişir. FK ON DELETE RESTRICT
 * nedeniyle LeadOptOutLog varsa Lead'i silmek DB seviyesinde engellenir.
 * 10 yıllık yasal saklama süresi sonunda silme yapılabilir.
 *
 * Rate limit: 3 deneme/saat/leadId (IP değil — farklı IP'den tekrar deneme
 * olsa bile leadId bazında koruma). Meşru kullanım: 1 firma kendi sayfasını
 * bir kez siler.
 */

const optOutSchema = z.object({
  leadId: z.string().trim().min(1, "leadId zorunlu").max(64),
  reason: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Geçersiz JSON gövdesi" },
      { status: 400 }
    );
  }

  const parsed = optOutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Geçersiz istek",
        details: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  const { leadId, reason } = parsed.data;

  // Rate limit: 3/saat/leadId — IP değil çünkü saldırgan farklı IP'den
  // aynı leadId'yi hedefleyebilir. leadId bazında sabit korumaya ihtiyaç var.
  const limitResult = rateLimit({
    key: `leadOptOut:${leadId}`,
    limit: 3,
    windowMs: 60 * 60 * 1000,
  });
  if (!limitResult.success) {
    return rateLimitResponse(limitResult.resetSeconds);
  }

  try {
    // İstemci meta bilgileri — delil için
    const xff = req.headers.get("x-forwarded-for") || "";
    const ip =
      xff.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      null;
    const userAgent = req.headers.get("user-agent") || null;

    // Lead var mı? (status ve name de lazım — idempotency + firmName için)
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: { id: true, name: true, status: true },
    });

    if (!lead) {
      return NextResponse.json(
        { success: false, error: "Kayıt bulunamadı" },
        { status: 404 }
      );
    }

    // Idempotency: zaten OPTED_OUT ise yeni log yazmadan başarı döndür.
    // Log spam'ı önler (kullanıcı F5 bassa ya da modal'ı iki kez submit etse).
    if (lead.status === "OPTED_OUT") {
      return NextResponse.json({
        success: true,
        message: "Veriniz zaten iletişim listemizden çıkarılmıştı.",
        alreadyOptedOut: true,
      });
    }

    const previousStatus = lead.status;

    // Paralel transaction: lead status güncelle + delil kaydı yaz
    await prisma.$transaction([
      prisma.lead.update({
        where: { id: leadId },
        data: { status: "OPTED_OUT" },
      }),
      prisma.leadOptOutLog.create({
        data: {
          leadId,
          firmName: lead.name,
          ip,
          userAgent,
          reason: reason && reason.trim().length > 0 ? reason.trim() : null,
        },
      }),
    ]);

    // Audit: status history'e opt_out kaydı (transaction dışında — helper
    // zaten hata yutar, history yazımı başarısız olsa ana akış kesilmez)
    await logLeadStatusChange({
      leadId,
      fromStatus: previousStatus,
      toStatus: "OPTED_OUT",
      reason: "opt_out",
      changedBy: "public:opt-out-endpoint",
    });

    return NextResponse.json({
      success: true,
      message:
        "Veri silme talebiniz alındı. İletişim listemizden çıkarıldınız.",
    });
  } catch (err) {
    console.error("[lead-opt-out] hata:", err);
    return NextResponse.json(
      { success: false, error: "İşlem başarısız — lütfen tekrar deneyin" },
      { status: 500 }
    );
  }
}
