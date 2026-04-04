"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { calculatePrice, formatPriceRange } from "@/lib/pricing-calculator";
import type { PricingItem } from "@/lib/pricing-constants";

// ── Teklif oluştur (submission'dan) ──
export async function createProposalFromSubmission(
  submissionId: string,
  pricingConfigs: PricingItem[]
) {
  try {
    const submission = await prisma.chatSubmission.findUnique({
      where: { id: submissionId },
    });
    if (!submission) return { success: false, error: "Başvuru bulunamadı" };

    // Fiyat hesapla
    const priceResult = calculatePrice(
      {
        siteType: submission.siteType,
        features: submission.features as string[],
        pageCount: submission.pageCount,
        contentStatus: submission.contentStatus,
        hostingStatus: submission.hostingStatus,
        hostingProvider: submission.hostingProvider,
        timeline: submission.timeline,
        freeQuestionCount: (submission.freeQuestions as unknown[]).length,
      },
      pricingConfigs
    );

    // Ödeme planı
    const total = priceResult.totalPrice;
    const pay1 = Math.round(total * 0.4);
    const pay2 = Math.round(total * 0.3);
    const pay3 = total - pay1 - pay2;

    const paymentPlan = [
      { label: "Peşinat", percent: 40, amount: pay1, description: "Sözleşme imzalandığında" },
      { label: "Ara Ödeme", percent: 30, amount: pay2, description: "Onay sonrası iş başlatılır" },
      { label: "Final", percent: 30, amount: pay3, description: "İş teslimi ve canlıya alma" },
    ];

    // Geçerlilik: 30 gün
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);

    const proposal = await prisma.proposal.create({
      data: {
        submissionId: submission.id,
        leadId: submission.leadId,
        firmName: submission.firmName,
        contactName: submission.contactName,
        contactPhone: submission.contactPhone,
        contactEmail: submission.contactEmail,
        sector: submission.sector,
        city: submission.city,
        siteType: submission.siteType,
        features: submission.features as unknown as string[],
        pageCount: submission.pageCount,
        contentStatus: submission.contentStatus,
        hostingStatus: submission.hostingStatus,
        hostingProvider: submission.hostingProvider,
        domainStatus: submission.domainStatus,
        domainName: submission.domainName,
        timeline: submission.timeline,
        items: priceResult.breakdown,
        totalPrice: priceResult.totalPrice,
        estimatedHours: priceResult.estimatedHours,
        paymentPlan,
        validUntil,
      },
    });

    // Lead varsa pipeline'da QUOTED'a taşı
    if (submission.leadId) {
      await prisma.lead.update({
        where: { id: submission.leadId },
        data: { status: "QUOTED" },
      });
    }

    revalidatePath("/admin/chat-submissions");
    revalidatePath("/admin/leads");
    revalidatePath("/admin/proposals");

    return { success: true, proposalId: proposal.id, token: proposal.token };
  } catch (error) {
    console.error("Proposal oluşturma hatası:", error);
    return { success: false, error: "Teklif oluşturulamadı" };
  }
}

// ── Teklifleri listele ──
export async function getProposals() {
  try {
    const proposals = await prisma.proposal.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        submission: {
          select: { slug: true, score: true },
        },
      },
    });
    return proposals.map((p) => ({
      id: p.id,
      token: p.token,
      firmName: p.firmName,
      contactName: p.contactName,
      contactPhone: p.contactPhone,
      contactEmail: p.contactEmail,
      sector: p.sector,
      city: p.city,
      siteType: p.siteType,
      totalPrice: p.totalPrice,
      estimatedHours: p.estimatedHours,
      status: p.status,
      validUntil: p.validUntil.toISOString(),
      viewedAt: p.viewedAt?.toISOString() || null,
      acceptedAt: p.acceptedAt?.toISOString() || null,
      sentAt: p.sentAt?.toISOString() || null,
      createdAt: p.createdAt.toISOString(),
      score: p.submission?.score || null,
      slug: p.submission?.slug || null,
    }));
  } catch {
    return [];
  }
}

// ── Public: Token ile teklif getir ──
export async function getProposalByToken(token: string) {
  try {
    const proposal = await prisma.proposal.findUnique({
      where: { token },
    });
    if (!proposal) return null;

    // İlk görüntülemede viewedAt kaydet + Lead güncelle
    if (!proposal.viewedAt && proposal.status === "SENT") {
      await prisma.proposal.update({
        where: { id: proposal.id },
        data: {
          viewedAt: new Date(),
          status: "VIEWED",
        },
      });

      // Lead pipeline'ı güncelle (QUOTED kalır, viewedAt kaydedilir)
      // VIEWED ayrı bir sütun değil, QUOTED altında takip edilir
    }

    return {
      id: proposal.id,
      token: proposal.token,
      firmName: proposal.firmName,
      contactName: proposal.contactName,
      contactPhone: proposal.contactPhone,
      contactEmail: proposal.contactEmail,
      sector: proposal.sector,
      city: proposal.city,
      siteType: proposal.siteType,
      features: proposal.features as string[],
      pageCount: proposal.pageCount,
      contentStatus: proposal.contentStatus,
      hostingStatus: proposal.hostingStatus,
      hostingProvider: proposal.hostingProvider,
      domainStatus: proposal.domainStatus,
      domainName: proposal.domainName,
      timeline: proposal.timeline,
      items: proposal.items as Array<{ label: string; hours?: number; cost: number }>,
      totalPrice: proposal.totalPrice,
      estimatedHours: proposal.estimatedHours,
      paymentPlan: proposal.paymentPlan as Array<{ label: string; percent: number; amount: number; description: string }>,
      status: proposal.status,
      validUntil: proposal.validUntil.toISOString(),
      viewedAt: proposal.viewedAt?.toISOString() || null,
      acceptedAt: proposal.acceptedAt?.toISOString() || null,
      createdAt: proposal.createdAt.toISOString(),
    };
  } catch {
    return null;
  }
}

// ── Teklif durumu güncelle + Lead pipeline entegrasyonu ──
export async function updateProposalStatus(
  proposalId: string,
  status: "SENT" | "ACCEPTED" | "REJECTED"
) {
  try {
    const updateData: Record<string, unknown> = { status };

    if (status === "SENT") updateData.sentAt = new Date();
    if (status === "ACCEPTED") updateData.acceptedAt = new Date();
    if (status === "REJECTED") updateData.rejectedAt = new Date();

    const proposal = await prisma.proposal.update({
      where: { id: proposalId },
      data: updateData,
    });

    // Lead pipeline entegrasyonu
    if (proposal.leadId) {
      let leadStatus: string | null = null;
      if (status === "SENT") leadStatus = "QUOTED";
      if (status === "ACCEPTED") leadStatus = "WON";
      if (status === "REJECTED") leadStatus = "LOST";

      if (leadStatus) {
        await prisma.lead.update({
          where: { id: proposal.leadId },
          data: { status: leadStatus as "QUOTED" | "WON" | "LOST" },
        });
      }
    }

    revalidatePath("/admin/proposals");
    revalidatePath("/admin/leads");
    return { success: true };
  } catch {
    return { success: false, error: "Durum güncellenemedi" };
  }
}

// ── Müşteri teklifi kabul etti (public) ──
export async function acceptProposal(token: string) {
  try {
    const proposal = await prisma.proposal.findUnique({
      where: { token },
    });
    if (!proposal) return { success: false, error: "Teklif bulunamadı" };

    // Süresi dolmuş mu?
    if (new Date() > proposal.validUntil) {
      await prisma.proposal.update({
        where: { id: proposal.id },
        data: { status: "EXPIRED" },
      });
      return { success: false, error: "Teklifin süresi dolmuş" };
    }

    // Zaten kabul/red edilmiş mi?
    if (proposal.status === "ACCEPTED" || proposal.status === "REJECTED") {
      return { success: false, error: "Bu teklif zaten işlem görmüş" };
    }

    await prisma.proposal.update({
      where: { id: proposal.id },
      data: { status: "ACCEPTED", acceptedAt: new Date() },
    });

    // Lead → WON
    if (proposal.leadId) {
      await prisma.lead.update({
        where: { id: proposal.leadId },
        data: { status: "WON" },
      });
    }

    revalidatePath("/admin/proposals");
    revalidatePath("/admin/leads");
    return { success: true };
  } catch {
    return { success: false, error: "İşlem başarısız" };
  }
}

// ── Müşteri teklifi reddetti (public) ──
export async function rejectProposal(token: string) {
  try {
    const proposal = await prisma.proposal.findUnique({
      where: { token },
    });
    if (!proposal) return { success: false, error: "Teklif bulunamadı" };

    if (proposal.status === "ACCEPTED" || proposal.status === "REJECTED") {
      return { success: false, error: "Bu teklif zaten işlem görmüş" };
    }

    await prisma.proposal.update({
      where: { id: proposal.id },
      data: { status: "REJECTED", rejectedAt: new Date() },
    });

    // Lead → LOST
    if (proposal.leadId) {
      await prisma.lead.update({
        where: { id: proposal.leadId },
        data: { status: "LOST" },
      });
    }

    revalidatePath("/admin/proposals");
    revalidatePath("/admin/leads");
    return { success: true };
  } catch {
    return { success: false, error: "İşlem başarısız" };
  }
}
