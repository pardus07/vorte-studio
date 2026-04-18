"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { calculatePrice, formatPriceRange } from "@/lib/pricing-calculator";
import type { PricingItem } from "@/lib/pricing-constants";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) return false;
  return (session.user as { role?: string }).role === "admin";
}

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

    // Ödeme planı (KDV dahil toplam üzerinden)
    const kdvRate = 0.20;
    const totalWithKdv = Math.round(priceResult.totalPrice * (1 + kdvRate));
    const pay1 = Math.round(totalWithKdv * 0.4);
    const pay2 = Math.round(totalWithKdv * 0.3);
    const pay3 = totalWithKdv - pay1 - pay2;

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
        brandColors: submission.brandColors,
        businessGoals: submission.businessGoals,
        targetAudience: submission.targetAudience,
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

    // Otomatik EXPIRED transition — süresi dolmuş ama status hâlâ aktif ise
    // bir kere DB'ye yaz. ACCEPTED teklifler dokunulmaz (zaten kabul edildi).
    const now = new Date();
    const expired = proposal.validUntil < now;
    if (
      expired &&
      (proposal.status === "SENT" || proposal.status === "VIEWED" || proposal.status === "DRAFT")
    ) {
      await prisma.proposal.update({
        where: { id: proposal.id },
        data: { status: "EXPIRED" },
      });
      proposal.status = "EXPIRED";
    }

    // İlk görüntülemede viewedAt kaydet + Lead güncelle (expired değilse)
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
      brandColors: proposal.brandColors,
      businessGoals: proposal.businessGoals,
      targetAudience: proposal.targetAudience,
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

// ── Teklif sil ──
export async function deleteProposal(proposalId: string) {
  try {
    await prisma.proposal.delete({
      where: { id: proposalId },
    });
    revalidatePath("/admin/proposals");
    return { success: true };
  } catch {
    return { success: false, error: "Teklif silinemedi" };
  }
}

// ── Benzer sektör portföy projeleri getir ──
export async function getSimilarPortfolioItems(category: string | null) {
  try {
    if (!category) return [];
    const items = await prisma.portfolioItem.findMany({
      where: {
        isPublished: true,
        category: { contains: category, mode: "insensitive" },
      },
      take: 3,
      orderBy: { order: "asc" },
      select: {
        id: true,
        title: true,
        slug: true,
        thumbnail: true,
        liveUrl: true,
        category: true,
      },
    });
    return items;
  } catch {
    return [];
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

// ── Teklif geçerlilik süresini uzat (Admin) ──
//
// Süresi dolmuş veya dolmak üzere olan bir teklifin validUntil tarihini
// now + 14 gün olarak yeniden ayarlar ve status EXPIRED ise VIEWED/SENT'e
// geri döndürür (hiç görülmediyse SENT, görülmüşse VIEWED).
//
// Müşteri teklif linkini geç gördüyse admin elle DB'ye müdahale etmek
// zorunda kalmasın diye eklendi. ACCEPTED/REJECTED tekliflerin süresi
// uzatılamaz — onlar zaten işlem görmüş.
export async function extendProposalValidity(proposalId: string, days = 14) {
  const isAdmin = await requireAdmin();
  if (!isAdmin) return { success: false, error: "Yetkisiz" };
  if (days < 1 || days > 90) return { success: false, error: "Süre 1-90 gün arasında olmalı" };

  try {
    const proposal = await prisma.proposal.findUnique({ where: { id: proposalId } });
    if (!proposal) return { success: false, error: "Teklif bulunamadı" };
    if (proposal.status === "ACCEPTED" || proposal.status === "REJECTED") {
      return { success: false, error: "Bu teklif zaten işlem görmüş, süresi uzatılamaz" };
    }

    const newValidUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    const newStatus =
      proposal.status === "EXPIRED"
        ? proposal.viewedAt
          ? "VIEWED"
          : "SENT"
        : proposal.status;

    await prisma.proposal.update({
      where: { id: proposalId },
      data: {
        validUntil: newValidUntil,
        status: newStatus,
      },
    });

    revalidatePath("/admin/proposals");
    revalidatePath(`/admin/proposals/${proposalId}`);
    revalidatePath(`/teklif/${proposal.token}`);
    return {
      success: true,
      validUntil: newValidUntil.toISOString(),
    };
  } catch (error) {
    console.error("Teklif süresi uzatma hatası:", error);
    return { success: false, error: "Süre uzatılamadı" };
  }
}
