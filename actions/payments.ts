"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { activatePortalAccount } from "./portal";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) return false;
  return (session.user as { role?: string }).role === "admin";
}

// ── Yeni proje için varsayılan milestone'lar ──
const DEFAULT_MILESTONES = [
  { title: "Discovery & Planlama", description: "Brief analizi, kapsam netleştirme" },
  { title: "Tasarım Onayı", description: "Mockup ve revizyon turları" },
  { title: "Frontend Geliştirme", description: "Sayfaların kodlanması" },
  { title: "Backend Entegrasyon", description: "API, form, ödeme entegrasyonları" },
  { title: "Test & Yayın", description: "QA ve canlıya alma" },
];

// ── Proposal siteType → ProjectType mapping ──
function mapSiteTypeToProjectType(siteType: string | null): "WEBSITE" | "ECOMMERCE" | "MOBILE_APP" | "REDESIGN" | "CUSTOM" {
  if (!siteType) return "WEBSITE";
  const t = siteType.toLowerCase();
  if (t.includes("ticaret") || t === "e-ticaret") return "ECOMMERCE";
  if (t.includes("mobil")) return "MOBILE_APP";
  if (t.includes("redesign") || t.includes("yeniden")) return "REDESIGN";
  return "WEBSITE";
}

/**
 * Peşinat ödemesi alındığında Client + Project'i otomatik oluştur.
 * Idempotent: zaten varsa yenisini oluşturmaz.
 */
async function ensureProjectFromProposal(proposalId: string): Promise<void> {
  const proposal = await prisma.proposal.findUnique({
    where: { id: proposalId },
    include: { contract: true },
  });
  if (!proposal) return;

  // Bu proposal için Project zaten oluşturulmuş mu? (notes alanından lookup)
  const existingProject = await prisma.project.findFirst({
    where: { notes: { contains: `proposalId:${proposalId}` } },
  });
  if (existingProject) return;

  const email = (proposal.contactEmail || proposal.contract?.signerEmail || "").toLowerCase();
  const phone = proposal.contactPhone || undefined;

  // Client'ı bul veya oluştur (email öncelikli, yoksa firma adı + telefon)
  let client = email
    ? await prisma.client.findFirst({ where: { email } })
    : null;

  if (!client) {
    client = await prisma.client.create({
      data: {
        name: proposal.contactName || proposal.firmName,
        company: proposal.firmName,
        email: email || null,
        phone,
        sector: proposal.sector,
        status: "ACTIVE",
      },
    });
  } else if (client.status !== "ACTIVE") {
    // Mevcut Client varsa ACTIVE'e çek
    await prisma.client.update({
      where: { id: client.id },
      data: { status: "ACTIVE" },
    });
  }

  // Tahmini deadline: timeline'dan ay sayısı çıkar (ör: "1 ay" → 30 gün)
  let deadline: Date | null = null;
  if (proposal.timeline) {
    const monthMatch = proposal.timeline.match(/(\d+)\s*ay/i);
    if (monthMatch) {
      const months = parseInt(monthMatch[1], 10);
      deadline = new Date();
      deadline.setMonth(deadline.getMonth() + months);
    }
  }

  // KDV dahil toplam tutarı budget olarak yaz
  const budget = Math.round(proposal.totalPrice * 1.2);

  const project = await prisma.project.create({
    data: {
      title: proposal.firmName,
      clientId: client.id,
      type: mapSiteTypeToProjectType(proposal.siteType),
      status: "DISCOVERY",
      budget,
      startDate: new Date(),
      deadline,
      progress: 0,
      techStack: ["Next.js", "Prisma", "Tailwind"],
      notes: `proposalId:${proposalId}`,
      milestones: {
        create: DEFAULT_MILESTONES.map((m) => ({
          title: m.title,
          description: m.description,
          completed: false,
        })),
      },
    },
  });

  // Aktivite logu
  try {
    await prisma.activity.create({
      data: {
        clientId: client.id,
        projectId: project.id,
        type: "PROJECT_CREATED",
        description: `Sözleşme imzalandı ve peşinat alındı, proje açıldı: ${proposal.firmName}`,
      },
    });
  } catch {
    // Activity şeması farklıysa sessizce geç
  }
}

// ── Teklif ödemelerini getir ──
export async function getProposalPayments(proposalId: string) {
  if (!(await requireAdmin())) return [];
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
  if (!(await requireAdmin())) return { success: false, error: "Yetkisiz" };
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

    // ── PEŞİNAT ÖDENDİ İSE: Portal aktivasyonu + Project oluşturma ──
    // Sadece stage 1 (peşinat) için ve sadece ilk ödendiği anda yapılacak.
    // activatePortalAccount ve ensureProjectFromProposal idempotent — tekrar çağrılırsa bozulmaz.
    let portalActivated = false;
    let projectCreated = false;
    if (payment.stage === 1) {
      try {
        const result = await activatePortalAccount(payment.proposalId);
        portalActivated = !!result.success && !result.alreadyActive;
      } catch (err) {
        console.error("Portal aktivasyon hatasi:", err);
      }
      try {
        await ensureProjectFromProposal(payment.proposalId);
        projectCreated = true;
      } catch (err) {
        console.error("Proje olusturma hatasi:", err);
      }
    }

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
    revalidatePath("/admin/portal");
    revalidatePath("/admin/projects");

    return { success: true, allPaid, portalActivated, projectCreated };
  } catch (error) {
    console.error("Odeme guncelleme hatasi:", error);
    return { success: false, error: "Odeme guncellenemedi" };
  }
}

// ── Ödemeyi geri al (iptal) ──
export async function revertPayment(paymentId: string) {
  if (!(await requireAdmin())) return { success: false, error: "Yetkisiz" };
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
  if (!(await requireAdmin())) return [];
  try {
    const proposals = await prisma.proposal.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        contract: { select: { id: true, status: true, signedAt: true, signerName: true } },
        payments: { orderBy: { stage: "asc" } },
        // Workflow logo step'i için — admin teklif kartlarındaki NextStepBadge
        portalUser: {
          include: { logoProject: { select: { status: true } } },
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
      // Sözleşme bilgisi
      contractId: p.contract?.id || null,
      contractStatus: p.contract?.status || null,
      contractSignedAt: p.contract?.signedAt?.toISOString() || null,
      contractSignerName: p.contract?.signerName || null,
      // Logo durumu — workflow step 6 (Ara Ödeme) için
      logoStatus: p.portalUser?.logoProject?.status || null,
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
