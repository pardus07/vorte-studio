import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AdminPortalDetail from "@/components/admin/AdminPortalDetail";

export const dynamic = "force-dynamic";

export default async function AdminPortalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let portalUser = null;
  try {
    portalUser = await prisma.portalUser.findUnique({
      where: { id },
      include: {
        proposal: {
          include: {
            contract: true,
            payments: { orderBy: { stage: "asc" } },
          },
        },
        messages: { orderBy: { createdAt: "asc" } },
        files: { orderBy: { createdAt: "desc" } },
      },
    });
  } catch {
    portalUser = null;
  }

  if (!portalUser) notFound();

  // Müşteri mesajlarını okundu yap
  try {
    await prisma.portalMessage.updateMany({
      where: { portalUserId: id, senderType: "CUSTOMER", isRead: false },
      data: { isRead: true },
    });
  } catch {
    // sessiz hata
  }

  const data = {
    user: {
      id: portalUser.id,
      name: portalUser.name,
      email: portalUser.email,
      phone: portalUser.phone,
      firmName: portalUser.firmName,
      isActive: portalUser.isActive,
      lastLoginAt: portalUser.lastLoginAt?.toISOString() || null,
      createdAt: portalUser.createdAt.toISOString(),
    },
    proposal: {
      id: portalUser.proposal.id,
      token: portalUser.proposal.token,
      status: portalUser.proposal.status,
      totalPrice: portalUser.proposal.totalPrice,
      siteType: portalUser.proposal.siteType,
      timeline: portalUser.proposal.timeline,
    },
    contract: portalUser.proposal.contract
      ? {
          id: portalUser.proposal.contract.id,
          status: portalUser.proposal.contract.status,
          signedAt: portalUser.proposal.contract.signedAt?.toISOString() || null,
        }
      : null,
    payments: portalUser.proposal.payments.map((p) => ({
      id: p.id,
      stage: p.stage,
      label: p.label,
      amount: p.amount,
      status: p.status,
      paidAt: p.paidAt?.toISOString() || null,
    })),
    messages: portalUser.messages.map((m) => ({
      id: m.id,
      content: m.content,
      senderType: m.senderType,
      isRead: m.isRead,
      createdAt: m.createdAt.toISOString(),
    })),
    files: portalUser.files.map((f) => ({
      id: f.id,
      fileName: f.fileName,
      filePath: f.filePath,
      fileSize: f.fileSize,
      fileType: f.fileType,
      uploadedBy: f.uploadedBy,
      createdAt: f.createdAt.toISOString(),
    })),
  };

  return <AdminPortalDetail data={data} />;
}
