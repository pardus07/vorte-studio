"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import {
  canRequestRevision,
  MAX_DESIGN_REVISIONS,
} from "@/lib/design-preview-rules";

// ── Yardımcı: portal oturumunu doğrula ──
async function getPortalUser() {
  const session = await auth();
  const user = session?.user;
  if (!user || user.role !== "portal" || !user.portalUserId) return null;
  return {
    id: user.portalUserId,
    name: user.name || "",
    firmName: user.firmName || "",
  };
}

// ── Yardımcı: admin oturumunu doğrula ──
async function requireAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === "admin";
}

// ══════════════════════════════════════════════════════════════
// PORTAL TARAFI — Müşteri aksiyonları
// ══════════════════════════════════════════════════════════════

/**
 * Müşterinin tasarım önizleme verilerini getirir.
 * Dashboard + /portal/tasarim sayfası bu fonksiyonu kullanır.
 *
 * Dönüş: staging URL, onay zamanı, revizyon geçmişi ve kural sonucu.
 * Kural sonucu UI'daki buton state'ini ve mesajı doğrudan sürer —
 * tek doğruluk kaynağı `lib/design-preview-rules.ts`.
 */
export async function getDesignPreview() {
  const user = await getPortalUser();
  if (!user) return { success: false as const, error: "Yetkisiz" };

  const portalUser = await prisma.portalUser.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      firmName: true,
      stagingUrl: true,
      designApprovedAt: true,
      designRevisions: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          note: true,
          stagingUrlAtTime: true,
          createdAt: true,
        },
      },
    },
  });

  if (!portalUser) {
    return { success: false as const, error: "Portal hesabı bulunamadı" };
  }

  const usedRevisions = portalUser.designRevisions.length;
  const isApproved = Boolean(portalUser.designApprovedAt);
  const rule = canRequestRevision(usedRevisions, isApproved);

  return {
    success: true as const,
    data: {
      firmName: portalUser.firmName,
      stagingUrl: portalUser.stagingUrl,
      designApprovedAt: portalUser.designApprovedAt?.toISOString() || null,
      maxRevisions: MAX_DESIGN_REVISIONS,
      rule,
      revisions: portalUser.designRevisions.map((r) => ({
        id: r.id,
        note: r.note,
        stagingUrlAtTime: r.stagingUrlAtTime,
        createdAt: r.createdAt.toISOString(),
      })),
    },
  };
}

/**
 * Müşteri tasarımı onaylar.
 *
 * Idempotent değil — zaten onaylıysa hata döner. İkinci onay hem anlamsız
 * hem de `designApprovedAt`'i güncellerse audit trail bozulur.
 */
export async function approveDesign() {
  const user = await getPortalUser();
  if (!user) return { success: false as const, error: "Yetkisiz" };

  const portalUser = await prisma.portalUser.findUnique({
    where: { id: user.id },
    select: { designApprovedAt: true, stagingUrl: true },
  });
  if (!portalUser) return { success: false as const, error: "Hesap bulunamadı" };
  if (portalUser.designApprovedAt) {
    return { success: false as const, error: "Tasarım zaten onaylanmış" };
  }
  if (!portalUser.stagingUrl) {
    return {
      success: false as const,
      error: "Henüz önizlenecek bir tasarım paylaşılmadı",
    };
  }

  await prisma.portalUser.update({
    where: { id: user.id },
    data: { designApprovedAt: new Date() },
  });

  // Admin tarafı ve portal dashboard'u yenile
  revalidatePath("/portal/tasarim");
  revalidatePath("/portal/dashboard");
  revalidatePath("/admin/portal");

  return { success: true as const };
}

/**
 * Müşteri revizyon ister.
 *
 * Kural: `canRequestRevision` — onaylı değilse ve 3 hak dolmadıysa izin verir.
 * Append-only: eski DesignRevision kayıtları dokunulmaz, yeni bir row eklenir.
 * Sayım her zaman `count()` ile yapılır — counter field yok, race yok.
 */
export async function requestDesignRevision(note: string) {
  const user = await getPortalUser();
  if (!user) return { success: false as const, error: "Yetkisiz" };

  const trimmed = note.trim();
  if (trimmed.length < 5) {
    return {
      success: false as const,
      error: "Lütfen revizyon talebinizi en az birkaç cümle ile açıklayın",
    };
  }
  if (trimmed.length > 2000) {
    return {
      success: false as const,
      error: "Revizyon notu en fazla 2000 karakter olabilir",
    };
  }

  const portalUser = await prisma.portalUser.findUnique({
    where: { id: user.id },
    select: { designApprovedAt: true, stagingUrl: true },
  });
  if (!portalUser) return { success: false as const, error: "Hesap bulunamadı" };

  const usedRevisions = await prisma.designRevision.count({
    where: { portalUserId: user.id },
  });
  const rule = canRequestRevision(
    usedRevisions,
    Boolean(portalUser.designApprovedAt)
  );
  if (!rule.allowed) {
    return { success: false as const, error: rule.reason || "Revizyon talebi reddedildi" };
  }

  await prisma.designRevision.create({
    data: {
      portalUserId: user.id,
      note: trimmed,
      stagingUrlAtTime: portalUser.stagingUrl,
    },
  });

  revalidatePath("/portal/tasarim");
  revalidatePath("/portal/dashboard");
  revalidatePath("/admin/portal");

  return {
    success: true as const,
    remainingRevisions: rule.remainingRevisions - 1,
  };
}

// ══════════════════════════════════════════════════════════════
// ADMIN TARAFI — Staging URL yönetimi
// ══════════════════════════════════════════════════════════════

/**
 * Admin staging URL'i günceller (ekler veya değiştirir).
 *
 * URL değişse bile geçmişteki DesignRevision kayıtları bozulmaz çünkü her
 * revizyon kendi `stagingUrlAtTime` snapshot'ını taşıyor. Admin yeni bir
 * sürüm deploy edip URL'i günceller → eski revizyon notları "hangi sürüme
 * yazılmıştı" bilgisini koruyor.
 *
 * Boş string veya null → URL temizlenir (müşteri tasarım sayfasında
 * "henüz hazır değil" state'i görür).
 */
export async function setStagingUrl(portalUserId: string, url: string | null) {
  if (!(await requireAdmin())) {
    return { success: false as const, error: "Yetkisiz" };
  }

  const cleaned = url?.trim() || null;

  // Basit URL validasyonu — boş olabilir, ama doluysa http/https olmalı
  if (cleaned && !/^https?:\/\/.+/i.test(cleaned)) {
    return {
      success: false as const,
      error: "URL http:// veya https:// ile başlamalı",
    };
  }

  await prisma.portalUser.update({
    where: { id: portalUserId },
    data: { stagingUrl: cleaned },
  });

  revalidatePath("/admin/portal");
  revalidatePath("/portal/tasarim");

  return { success: true as const };
}

/**
 * Admin tarafından tasarım onayını geri alır.
 *
 * Nadir bir acil durum kapısı — müşteri onayladı ama bir hata fark edildi,
 * yeniden revizyon açılması gerekiyor. Onay geri alındığında revizyon geçmişi
 * silinmez; müşteri kalan hakkıyla devam edebilir.
 */
export async function resetDesignApproval(portalUserId: string) {
  if (!(await requireAdmin())) {
    return { success: false as const, error: "Yetkisiz" };
  }

  await prisma.portalUser.update({
    where: { id: portalUserId },
    data: { designApprovedAt: null },
  });

  revalidatePath("/admin/portal");
  revalidatePath("/portal/tasarim");
  revalidatePath("/portal/dashboard");

  return { success: true as const };
}

/**
 * Admin için: belirli bir portal kullanıcısının tasarım önizleme özetini getirir.
 * AdminPortalDetail kartı bu veriyi kullanır.
 */
export async function getAdminDesignPreview(portalUserId: string) {
  if (!(await requireAdmin())) {
    return { success: false as const, error: "Yetkisiz" };
  }

  const portalUser = await prisma.portalUser.findUnique({
    where: { id: portalUserId },
    select: {
      id: true,
      firmName: true,
      stagingUrl: true,
      designApprovedAt: true,
      designRevisions: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          note: true,
          stagingUrlAtTime: true,
          createdAt: true,
        },
      },
    },
  });

  if (!portalUser) {
    return { success: false as const, error: "Portal hesabı bulunamadı" };
  }

  return {
    success: true as const,
    data: {
      firmName: portalUser.firmName,
      stagingUrl: portalUser.stagingUrl,
      designApprovedAt: portalUser.designApprovedAt?.toISOString() || null,
      usedRevisions: portalUser.designRevisions.length,
      maxRevisions: MAX_DESIGN_REVISIONS,
      revisions: portalUser.designRevisions.map((r) => ({
        id: r.id,
        note: r.note,
        stagingUrlAtTime: r.stagingUrlAtTime,
        createdAt: r.createdAt.toISOString(),
      })),
    },
  };
}
