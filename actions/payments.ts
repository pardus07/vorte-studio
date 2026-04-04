"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ── Teklif ödemelerini getir ──
export async function getProposalPayments(proposalId: string) {
  try {
    const payments = await prisma.proposalPayment.findMany({
      where: { proposalId },
      orderBy: { stage: "asc" },
    });
    return payments.map((p) => ({
      id: p.id,
      stage: p.stage,
      label: p.label,
      amount: p.amount,
      paidAt: p.paidAt?.toISOString() || null,
      status: p.status,
      notes: p.notes,
    }));
  } catch {
    return [];
  }
}

// ── Ödeme yapıldı olarak işaretle ──
export async function markPaymentPaid(paymentId: string, notes?: string) {
  try {
    const payment = await prisma.proposalPayment.update({
      where: { id: paymentId },
      data: {
        status: "PAID",
        paidAt: new Date(),
        notes: notes || null,
      },
      include: { proposal: true },
    });

    // Tüm ödemeler yapıldı mı kontrol et
    const allPayments = await prisma.proposalPayment.findMany({
      where: { proposalId: payment.proposalId },
    });

    const allPaid = allPayments.every((p) => p.status === "PAID");

    if (allPaid && payment.proposal.leadId) {
      // Tüm ödemeler yapıldı → Lead WON
      try {
        await prisma.lead.update({
          where: { id: payment.proposal.leadId },
          data: { status: "WON" },
        });
      } catch {
        // Lead bulunamazsa sessizce devam et
      }
    }

    revalidatePath("/admin/proposals");
    revalidatePath("/admin/leads");

    return { success: true, allPaid };
  } catch (error) {
    console.error("Odeme guncelleme hatasi:", error);
    return { success: false, error: "Odeme guncellenemedi" };
  }
}

// ── Ödemeyi geri al (iptal) ──
export async function revertPayment(paymentId: string) {
  try {
    await prisma.proposalPayment.update({
      where: { id: paymentId },
      data: {
        status: "PENDING",
        paidAt: null,
        notes: null,
      },
    });

    revalidatePath("/admin/proposals");
    return { success: true };
  } catch (error) {
    console.error("Odeme iptal hatasi:", error);
    return { success: false, error: "Odeme iptal edilemedi" };
  }
}

// ── Tüm teklifleri ödeme bilgileriyle getir ──
export async function getProposalsWithPayments() {
  try {
    const proposals = await prisma.proposal.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        contract: { select: { status: true, signedAt: true, signerName: true } },
        payments: { orderBy: { stage: "asc" } },
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
      // Sözleşme bilgisi
      contractStatus: p.contract?.status || null,
      contractSignedAt: p.contract?.signedAt?.toISOString() || null,
      contractSignerName: p.contract?.signerName || null,
      // Ödeme bilgileri
      payments: p.payments.map((pay) => ({
        id: pay.id,
        stage: pay.stage,
        label: pay.label,
        amount: pay.amount,
        paidAt: pay.paidAt?.toISOString() || null,
        status: pay.status,
        notes: pay.notes,
      })),
    }));
  } catch {
    return [];
  }
}
