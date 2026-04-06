"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { sendPortalCredentials } from "@/lib/email";

// ── Yardımcı: portal oturumunu doğrula ──
async function getPortalUser() {
  const session = await auth();
  if (!session?.user) return null;
  const user = session.user;
  if (user.role !== "portal" || !user.portalUserId) return null;
  return {
    id: user.portalUserId,
    email: user.email || "",
    name: user.name || "",
    firmName: user.firmName || "",
    proposalId: user.proposalId || "",
  };
}

// ── Yardımcı: admin oturumunu doğrula ──
async function requireAdmin() {
  const session = await auth();
  if (!session?.user) return false;
  return session.user.role === "admin";
}

// ── Rastgele şifre oluştur ──
function generatePassword(length = 10): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ══════════════════════════════════════════════
// PORTAL HESAP YÖNETİMİ
// ══════════════════════════════════════════════

/**
 * Sözleşme imzalandığında portal hesabı oluştur
 *
 * @param proposalId - Teklif ID
 * @param options.activateImmediately - true ise hesap aktif olarak açılır ve
 *   credentials maili anında atılır. false ise hesap pasif (isActive=false)
 *   olarak açılır, mail atılmaz — peşinat ödendikten sonra
 *   `activatePortalAccount` ile aktif edilir. Default: true (geriye dönük uyum)
 */
export async function createPortalAccount(
  proposalId: string,
  options: { activateImmediately?: boolean } = {}
) {
  const activateImmediately = options.activateImmediately ?? true;
  try {
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: { contract: true, portalUser: true },
    });
    if (!proposal) return { success: false, error: "Teklif bulunamadı" };
    if (proposal.portalUser) {
      return { success: true, existing: true, email: proposal.portalUser.email };
    }

    const email = (proposal.contactEmail || proposal.contract?.signerEmail || "").toLowerCase();
    if (!email) return { success: false, error: "Müşteri e-posta adresi bulunamadı" };

    // Aynı email ile başka hesap var mı kontrol et
    const existing = await prisma.portalUser.findUnique({ where: { email } });
    if (existing) {
      return { success: true, existing: true, email };
    }

    const password = generatePassword();
    const passwordHash = await bcrypt.hash(password, 12);

    const portalUser = await prisma.portalUser.create({
      data: {
        email,
        passwordHash,
        name: proposal.contactName || proposal.firmName,
        phone: proposal.contactPhone,
        proposalId: proposal.id,
        firmName: proposal.firmName,
        isActive: activateImmediately,
      },
    });

    // Sadece anında aktivasyon istenirse maili gönder
    if (activateImmediately) {
      await sendPortalCredentials(email, password, proposal.firmName);
    }

    revalidatePath("/admin/portal");

    return {
      success: true,
      email: portalUser.email,
      password: activateImmediately ? password : undefined,
      pendingActivation: !activateImmediately,
    };
  } catch (error) {
    console.error("Portal hesap oluşturma hatası:", error);
    return { success: false, error: "Portal hesabı oluşturulamadı" };
  }
}

/**
 * Portal hesabını aktive et — peşinat ödendiğinde çağrılır.
 * isActive=true yapar, yeni şifre üretir (eski hash erişilemez olduğu için)
 * ve credentials mailini atar.
 */
export async function activatePortalAccount(proposalId: string) {
  try {
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: { portalUser: true },
    });
    if (!proposal) return { success: false, error: "Teklif bulunamadı" };
    if (!proposal.portalUser) {
      return { success: false, error: "Portal hesabı henüz oluşturulmamış" };
    }
    if (proposal.portalUser.isActive) {
      return { success: true, alreadyActive: true };
    }

    // Yeni şifre üret — eski hash bcrypt nedeniyle geri okunamaz
    const newPassword = generatePassword();
    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.portalUser.update({
      where: { id: proposal.portalUser.id },
      data: { isActive: true, passwordHash },
    });

    // Hoş geldin / giriş bilgileri maili
    await sendPortalCredentials(
      proposal.portalUser.email,
      newPassword,
      proposal.firmName
    );

    revalidatePath("/admin/portal");
    revalidatePath("/admin/proposals");

    return { success: true, email: proposal.portalUser.email };
  } catch (error) {
    console.error("Portal aktivasyon hatası:", error);
    return { success: false, error: "Portal hesabı aktive edilemedi" };
  }
}

// ══════════════════════════════════════════════
// PORTAL DASHBOARD VERİLERİ
// ══════════════════════════════════════════════

/** Portal kullanıcısının dashboard verilerini getir */
export async function getPortalDashboard() {
  const user = await getPortalUser();
  if (!user) return null;

  try {
    const [proposal, messages, files] = await Promise.all([
      prisma.proposal.findUnique({
        where: { id: user.proposalId },
        include: {
          contract: true,
          payments: { orderBy: { stage: "asc" } },
        },
      }),
      prisma.portalMessage.findMany({
        where: { portalUserId: user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.portalFile.findMany({
        where: { portalUserId: user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    if (!proposal) return null;

    // Unread mesaj sayısı
    const unreadCount = await prisma.portalMessage.count({
      where: { portalUserId: user.id, senderType: "ADMIN", isRead: false },
    });

    return {
      user: { id: user.id, name: user.name, email: user.email, firmName: user.firmName },
      proposal: {
        id: proposal.id,
        token: proposal.token,
        firmName: proposal.firmName,
        status: proposal.status,
        totalPrice: proposal.totalPrice,
        siteType: proposal.siteType,
        features: proposal.features as string[],
        timeline: proposal.timeline,
        createdAt: proposal.createdAt.toISOString(),
      },
      contract: proposal.contract
        ? {
            id: proposal.contract.id,
            status: proposal.contract.status,
            signedAt: proposal.contract.signedAt?.toISOString() || null,
          }
        : null,
      payments: proposal.payments.map((p) => ({
        id: p.id,
        stage: p.stage,
        label: p.label,
        amount: p.amount,
        status: p.status,
        paidAt: p.paidAt?.toISOString() || null,
      })),
      recentMessages: messages.map((m) => ({
        id: m.id,
        content: m.content,
        senderType: m.senderType,
        isRead: m.isRead,
        createdAt: m.createdAt.toISOString(),
      })),
      recentFiles: files.map((f) => ({
        id: f.id,
        fileName: f.fileName,
        fileSize: f.fileSize,
        uploadedBy: f.uploadedBy,
        createdAt: f.createdAt.toISOString(),
      })),
      unreadCount,
    };
  } catch (error) {
    console.error("Portal dashboard hatası:", error);
    return null;
  }
}

// ══════════════════════════════════════════════
// MESAJLAŞMA
// ══════════════════════════════════════════════

/** Müşteri mesaj gönder */
export async function sendPortalMessage(content: string) {
  const user = await getPortalUser();
  if (!user) return { success: false, error: "Oturum bulunamadı" };
  if (!content.trim()) return { success: false, error: "Mesaj boş olamaz" };

  try {
    const message = await prisma.portalMessage.create({
      data: {
        portalUserId: user.id,
        content: content.trim(),
        senderType: "CUSTOMER",
      },
    });

    revalidatePath("/portal/mesajlar");
    revalidatePath("/admin/portal");

    return { success: true, messageId: message.id };
  } catch (error) {
    console.error("Mesaj gönderme hatası:", error);
    return { success: false, error: "Mesaj gönderilemedi" };
  }
}

/** Admin mesaj gönder */
export async function sendAdminMessage(portalUserId: string, content: string) {
  const isAdmin = await requireAdmin();
  if (!isAdmin) return { success: false, error: "Yetkisiz" };
  if (!content.trim()) return { success: false, error: "Mesaj boş olamaz" };

  try {
    const message = await prisma.portalMessage.create({
      data: {
        portalUserId,
        content: content.trim(),
        senderType: "ADMIN",
      },
    });

    revalidatePath("/portal/mesajlar");
    revalidatePath(`/admin/portal/${portalUserId}`);

    return { success: true, messageId: message.id };
  } catch (error) {
    console.error("Admin mesaj gönderme hatası:", error);
    return { success: false, error: "Mesaj gönderilemedi" };
  }
}

/** Mesajları getir (portal tarafı) */
export async function getPortalMessages() {
  const user = await getPortalUser();
  if (!user) return [];

  try {
    const messages = await prisma.portalMessage.findMany({
      where: { portalUserId: user.id },
      orderBy: { createdAt: "asc" },
    });

    // Okunmamış admin mesajlarını okundu yap
    await prisma.portalMessage.updateMany({
      where: { portalUserId: user.id, senderType: "ADMIN", isRead: false },
      data: { isRead: true },
    });

    return messages.map((m) => ({
      id: m.id,
      content: m.content,
      senderType: m.senderType,
      isRead: m.isRead,
      createdAt: m.createdAt.toISOString(),
    }));
  } catch {
    return [];
  }
}

/** Mesajları getir (admin tarafı) */
export async function getAdminMessages(portalUserId: string) {
  const isAdmin = await requireAdmin();
  if (!isAdmin) return [];

  try {
    const messages = await prisma.portalMessage.findMany({
      where: { portalUserId },
      orderBy: { createdAt: "asc" },
    });

    // Okunmamış müşteri mesajlarını okundu yap
    await prisma.portalMessage.updateMany({
      where: { portalUserId, senderType: "CUSTOMER", isRead: false },
      data: { isRead: true },
    });

    return messages.map((m) => ({
      id: m.id,
      content: m.content,
      senderType: m.senderType,
      isRead: m.isRead,
      createdAt: m.createdAt.toISOString(),
    }));
  } catch {
    return [];
  }
}

// ══════════════════════════════════════════════
// DOSYA YÖNETİMİ
// ══════════════════════════════════════════════

/** Portal dosyalarını getir */
export async function getPortalFiles() {
  const user = await getPortalUser();
  if (!user) return [];

  try {
    const files = await prisma.portalFile.findMany({
      where: { portalUserId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return files.map((f) => ({
      id: f.id,
      fileName: f.fileName,
      filePath: f.filePath,
      fileSize: f.fileSize,
      fileType: f.fileType,
      uploadedBy: f.uploadedBy,
      description: f.description,
      createdAt: f.createdAt.toISOString(),
    }));
  } catch {
    return [];
  }
}

// ══════════════════════════════════════════════
// MİLESTONE ONAYI
// ══════════════════════════════════════════════

/** Milestone onayla (müşteri tarafı) */
export async function approveMilestone(milestoneId: string) {
  const user = await getPortalUser();
  if (!user) return { success: false, error: "Oturum bulunamadı" };

  try {
    await prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        approvedAt: new Date(),
        approvedBy: user.name,
      },
    });

    revalidatePath("/portal/kilometre-taslari");
    revalidatePath("/admin/portal");

    return { success: true };
  } catch (error) {
    console.error("Milestone onay hatası:", error);
    return { success: false, error: "Onay kaydedilemedi" };
  }
}

// ══════════════════════════════════════════════
// ADMIN: PORTAL YÖNETİMİ
// ══════════════════════════════════════════════

/** Tüm portal kullanıcılarını getir (admin) */
export async function getPortalUsers() {
  const isAdmin = await requireAdmin();
  if (!isAdmin) return [];

  try {
    const users = await prisma.portalUser.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        proposal: {
          include: {
            contract: true,
            payments: true,
          },
        },
        messages: {
          where: { senderType: "CUSTOMER", isRead: false },
          select: { id: true },
        },
      },
    });

    return users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      phone: u.phone,
      firmName: u.firmName,
      isActive: u.isActive,
      lastLoginAt: u.lastLoginAt?.toISOString() || null,
      createdAt: u.createdAt.toISOString(),
      unreadMessages: u.messages.length,
      proposalStatus: u.proposal.status,
      contractStatus: u.proposal.contract?.status || null,
      totalPrice: u.proposal.totalPrice,
      paidAmount: u.proposal.payments
        .filter((p) => p.status === "PAID")
        .reduce((sum, p) => sum + p.amount, 0),
    }));
  } catch {
    return [];
  }
}

/** Hafif lookup — logo modal vb. dropdown'lar için (admin) */
export async function getPortalUsersLite() {
  const isAdmin = await requireAdmin();
  if (!isAdmin) return [];

  try {
    const users = await prisma.portalUser.findMany({
      where: { isActive: true }, // sadece aktif (peşinatı ödenmiş) müşteriler
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        firmName: true,
        logoProject: { select: { id: true } },
      },
    });
    return users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      firmName: u.firmName,
      hasLogoProject: !!u.logoProject,
    }));
  } catch {
    return [];
  }
}

/** Yeni mesaj sayısını getir (admin polling) */
export async function getPortalUnreadCount() {
  const isAdmin = await requireAdmin();
  if (!isAdmin) return 0;

  try {
    return await prisma.portalMessage.count({
      where: { senderType: "CUSTOMER", isRead: false },
    });
  } catch {
    return 0;
  }
}
