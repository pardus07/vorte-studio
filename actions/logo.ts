"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { copyFile, mkdir } from "fs/promises";
import { join } from "path";

// ── Yardımcı: admin oturumu ──
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") return false;
  return true;
}

// ── Yardımcı: portal oturumu ──
async function getPortalUser() {
  const session = await auth();
  if (!session?.user || session.user.role !== "portal" || !session.user.portalUserId) return null;
  return {
    id: session.user.portalUserId,
    email: session.user.email || "",
    name: session.user.name || "",
    firmName: session.user.firmName || "",
  };
}

// ══════════════════════════════════════════════
// ADMIN ACTIONS
// ══════════════════════════════════════════════

/** Logo projesi oluştur (admin) */
export async function createLogoProject(portalUserId: string, data: {
  sector?: string;
  style?: string;
  brandColors?: string;
  includeText?: boolean;
  notes?: string;
}) {
  if (!(await requireAdmin())) throw new Error("Yetkisiz");

  const portalUser = await prisma.portalUser.findUnique({
    where: { id: portalUserId },
  });
  if (!portalUser) throw new Error("Portal kullanıcısı bulunamadı");

  // Mevcut proje var mı kontrol et
  const existing = await prisma.logoProject.findUnique({
    where: { portalUserId },
  });
  if (existing) throw new Error("Bu müşteri için zaten logo projesi var");

  const project = await prisma.logoProject.create({
    data: {
      portalUserId,
      firmName: portalUser.firmName,
      sector: data.sector || null,
      style: data.style || "modern",
      brandColors: data.brandColors || null,
      includeText: data.includeText ?? true,
      notes: data.notes || null,
    },
  });

  revalidatePath("/admin/logo");
  return project;
}

/** Logo projelerini listele (admin) */
export async function getLogoProjects() {
  if (!(await requireAdmin())) throw new Error("Yetkisiz");

  return prisma.logoProject.findMany({
    include: {
      portalUser: { select: { email: true, name: true } },
      variants: { orderBy: { createdAt: "desc" } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

/** Logo projesi detay (admin) */
export async function getLogoProjectDetail(id: string) {
  if (!(await requireAdmin())) throw new Error("Yetkisiz");

  return prisma.logoProject.findUnique({
    where: { id },
    include: {
      portalUser: { select: { email: true, name: true, firmName: true } },
      variants: { orderBy: { createdAt: "desc" } },
    },
  });
}

/** Logo projesi güncelle (admin — marka kiti, notlar vb.) */
export async function updateLogoProject(id: string, data: {
  sector?: string;
  style?: string;
  brandColors?: string;
  includeText?: boolean;
  notes?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontDisplay?: string;
  fontBody?: string;
  brandGuidelines?: string;
}) {
  if (!(await requireAdmin())) throw new Error("Yetkisiz");

  const project = await prisma.logoProject.update({
    where: { id },
    data,
  });

  revalidatePath(`/admin/logo/${id}`);
  revalidatePath("/admin/logo");
  return project;
}

/** Logo varyantını sil (admin) */
export async function deleteLogoVariant(variantId: string) {
  if (!(await requireAdmin())) throw new Error("Yetkisiz");

  const variant = await prisma.logoVariant.delete({
    where: { id: variantId },
  });

  revalidatePath(`/admin/logo/${variant.logoProjectId}`);
  return { success: true };
}

// ══════════════════════════════════════════════
// PORTAL ACTIONS (müşteri tarafı)
// ══════════════════════════════════════════════

/** Müşterinin logo projesini getir (portal) */
export async function getPortalLogoProject() {
  const user = await getPortalUser();
  if (!user) return null;

  let project = null;
  try {
    project = await prisma.logoProject.findUnique({
      where: { portalUserId: user.id },
      include: {
        variants: { orderBy: { createdAt: "desc" } },
      },
    });
  } catch {
    project = null;
  }

  return project;
}

/** Logo varyantına geri bildirim yaz (portal) */
export async function submitLogoFeedback(variantId: string, feedback: string) {
  const user = await getPortalUser();
  if (!user) throw new Error("Yetkisiz");

  // Varyantın bu müşteriye ait olduğunu doğrula
  const variant = await prisma.logoVariant.findUnique({
    where: { id: variantId },
    include: { logoProject: true },
  });

  if (!variant || variant.logoProject.portalUserId !== user.id) {
    throw new Error("Yetkisiz");
  }

  await prisma.logoVariant.update({
    where: { id: variantId },
    data: {
      feedback,
      feedbackAt: new Date(),
    },
  });

  revalidatePath("/portal/logo");
  return { success: true };
}

/** Logo varyantını onayla (portal) */
export async function approveLogoVariant(variantId: string) {
  const user = await getPortalUser();
  if (!user) throw new Error("Yetkisiz");

  const variant = await prisma.logoVariant.findUnique({
    where: { id: variantId },
    include: { logoProject: true },
  });

  if (!variant || variant.logoProject.portalUserId !== user.id) {
    throw new Error("Yetkisiz");
  }

  // Önceki onayları kaldır
  await prisma.logoVariant.updateMany({
    where: { logoProjectId: variant.logoProjectId, isApproved: true },
    data: { isApproved: false },
  });

  // Bu varyantı onayla
  await prisma.logoVariant.update({
    where: { id: variantId },
    data: { isApproved: true },
  });

  // Onaylanan logoyu approved.png olarak kopyala
  const approvedUrl = variant.url;

  // Dosyayı kopyala
  try {
    const srcPath = join(process.cwd(), "public", variant.url.replace("/api/uploads/", "uploads/"));
    const destDir = join(process.cwd(), "public", "uploads", "logos", variant.logoProjectId);
    await mkdir(destDir, { recursive: true });
    const destPath = join(destDir, "approved.png");
    await copyFile(srcPath, destPath);

    const finalUrl = `/api/uploads/logos/${variant.logoProjectId}/approved.png`;

    // Proje durumunu güncelle
    await prisma.logoProject.update({
      where: { id: variant.logoProjectId },
      data: {
        status: "APPROVED",
        approvedLogoUrl: finalUrl,
        approvedAt: new Date(),
      },
    });
  } catch {
    // Dosya kopyalama başarısız olursa orijinal URL'yi kullan
    await prisma.logoProject.update({
      where: { id: variant.logoProjectId },
      data: {
        status: "APPROVED",
        approvedLogoUrl: approvedUrl,
        approvedAt: new Date(),
      },
    });
  }

  revalidatePath("/portal/logo");
  revalidatePath(`/admin/logo/${variant.logoProjectId}`);
  return { success: true };
}
