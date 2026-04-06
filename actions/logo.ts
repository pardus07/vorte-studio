"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { readFile } from "fs/promises";
import { join } from "path";
import { uniqueSlug } from "@/lib/slug";
import { processLogoToBrandAssets } from "@/lib/brand-processor";

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
  brandColors?: string;       // serbest metin (legacy / fallback)
  primaryColor?: string;      // #hex
  secondaryColor?: string;    // #hex
  accentColor?: string;       // #hex
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

  // Cakisma-aware slug uret
  const allSlugs = await prisma.logoProject.findMany({
    select: { firmSlug: true },
    where: { firmSlug: { not: null } },
  });
  const slug = uniqueSlug(
    portalUser.firmName,
    allSlugs.map((s) => s.firmSlug as string)
  );

  const project = await prisma.logoProject.create({
    data: {
      portalUserId,
      firmName: portalUser.firmName,
      firmSlug: slug,
      sector: data.sector || null,
      style: data.style || "modern",
      brandColors: data.brandColors || null,
      primaryColor: data.primaryColor || null,
      secondaryColor: data.secondaryColor || null,
      accentColor: data.accentColor || null,
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

/** Logo varyantını onayla (portal)
 *
 * Onay sirasinda brand-processor cagrilir:
 *   1. Master PNG buffer'i diskten oku
 *   2. sharp ile standart olculere donusturup transparent BG uygula
 *   3. public/uploads/brand/{slug}/ altina butun varyantlari yaz
 *   4. manifest.json olustur
 *   5. LogoProject.brandManifestUrl + approvedLogoUrl guncelle
 */
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

  const project = variant.logoProject;

  // Slug yoksa (legacy projeler icin) simdi olustur
  let firmSlug = project.firmSlug;
  if (!firmSlug) {
    const { uniqueSlug } = await import("@/lib/slug");
    const allSlugs = await prisma.logoProject.findMany({
      select: { firmSlug: true },
      where: { firmSlug: { not: null } },
    });
    firmSlug = uniqueSlug(
      project.firmName,
      allSlugs.map((s) => s.firmSlug as string)
    );
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

  // Master PNG'yi diskten oku ve brand-processor ile islet
  const fallbackUrl = variant.url;
  let primaryUrl = fallbackUrl;
  let manifestUrl: string | null = null;

  try {
    // variant.url ornegi: "/api/uploads/logos/{projectId}/ai-1234.png"
    // Disk path: public/uploads/logos/{projectId}/ai-1234.png
    const relPath = variant.url.replace("/api/uploads/", "uploads/");
    const srcPath = join(process.cwd(), "public", relPath);
    const masterPng = await readFile(srcPath);

    const manifest = await processLogoToBrandAssets(masterPng, {
      firmName: project.firmName,
      firmSlug,
      portalUserId: project.portalUserId,
      logoProjectId: project.id,
      colors: {
        primary: project.primaryColor,
        secondary: project.secondaryColor,
        accent: project.accentColor,
      },
      fonts: {
        display: project.fontDisplay,
        body: project.fontBody,
      },
    });

    primaryUrl = manifest.assets.primary.url;
    manifestUrl = `/api/uploads/brand/${firmSlug}/manifest.json`;
  } catch (err) {
    console.error("[approveLogoVariant] brand-processor hatasi, fallback URL kullaniliyor:", err);
    // İşleme basarisiz olursa orijinal URL ile devam — workflow durmasin
  }

  // Proje durumunu güncelle
  await prisma.logoProject.update({
    where: { id: variant.logoProjectId },
    data: {
      status: "APPROVED",
      firmSlug,
      approvedLogoUrl: primaryUrl,
      brandManifestUrl: manifestUrl,
      approvedAt: new Date(),
    },
  });

  revalidatePath("/portal/logo");
  revalidatePath(`/admin/logo/${variant.logoProjectId}`);
  return { success: true };
}
