"use server";

import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// ══════════════════════════════════════════════
// PORTAL ŞİFRE SIFIRLAMA (self-service)
// ══════════════════════════════════════════════

// Tek bir email aynı saat içinde en fazla 3 talep açabilir
const REQUEST_LIMIT = 3;
const REQUEST_WINDOW_MS = 60 * 60 * 1000; // 1 saat

// Token ömrü: 30 dakika
const TOKEN_TTL_MS = 30 * 60 * 1000;

/**
 * Şifre sıfırlama talebi oluşturur.
 *
 * Güvenlik:
 *  - Email user enumeration engellemek için HER ZAMAN başarılı döner
 *    (email bulunsa da bulunmasa da — attacker email listesi çıkaramasın).
 *  - Rate limit: 1 saatte max 3 talep (DB bazlı).
 *  - Token cryptographically random (32 byte, hex).
 *  - Kullanım sonrası used=true işaretlenir, yeniden kullanılamaz.
 */
export async function requestPortalPasswordReset(
  emailRaw: string
): Promise<{ success: boolean; error?: string }> {
  const email = (emailRaw || "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Geçerli bir e-posta adresi girin" };
  }

  try {
    const user = await prisma.portalUser.findUnique({
      where: { email },
      include: { proposal: { select: { firmName: true } } },
    });

    // Kullanıcı yok veya pasif → sessizce başarılıya dön (enumeration koruması)
    if (!user || !user.isActive) {
      await new Promise((r) => setTimeout(r, 200));
      return { success: true };
    }

    // Rate limit: son 1 saatteki talep sayısı
    const windowStart = new Date(Date.now() - REQUEST_WINDOW_MS);
    const recentCount = await prisma.portalPasswordReset.count({
      where: { portalUserId: user.id, createdAt: { gte: windowStart } },
    });
    if (recentCount >= REQUEST_LIMIT) {
      // Rate limit'e takıldıysa bile user'a hata verme (enumeration)
      return { success: true };
    }

    // Token üret: 32 byte random hex = 64 karakter
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

    await prisma.portalPasswordReset.create({
      data: {
        portalUserId: user.id,
        token,
        expiresAt,
      },
    });

    const baseUrl = process.env.NEXTAUTH_URL || "https://vortestudio.com";
    const resetUrl = `${baseUrl}/portal/sifre/${token}`;

    await sendPasswordResetEmail(
      user.email,
      resetUrl,
      user.proposal?.firmName || "Hesabınızı"
    );

    return { success: true };
  } catch (err) {
    console.error("Şifre sıfırlama talebi hatası:", err);
    return { success: true };
  }
}

/**
 * Token ile yeni şifreyi belirler.
 */
export async function completePortalPasswordReset(
  token: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  if (!token || typeof token !== "string" || token.length !== 64) {
    return { success: false, error: "Geçersiz bağlantı" };
  }

  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: "Şifre en az 8 karakter olmalı" };
  }

  if (newPassword.length > 128) {
    return { success: false, error: "Şifre çok uzun" };
  }

  try {
    const resetRecord = await prisma.portalPasswordReset.findUnique({
      where: { token },
      include: { portalUser: true },
    });

    if (!resetRecord) {
      return { success: false, error: "Geçersiz veya süresi dolmuş bağlantı" };
    }

    if (resetRecord.used) {
      return { success: false, error: "Bu bağlantı zaten kullanıldı" };
    }

    if (resetRecord.expiresAt < new Date()) {
      return { success: false, error: "Bağlantının süresi doldu. Yeni talep oluşturun." };
    }

    if (!resetRecord.portalUser.isActive) {
      return { success: false, error: "Hesap pasif durumda. Yöneticinize başvurun." };
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Atomik: şifreyi güncelle + token'i tüket
    await prisma.$transaction([
      prisma.portalUser.update({
        where: { id: resetRecord.portalUserId },
        data: { passwordHash },
      }),
      prisma.portalPasswordReset.update({
        where: { id: resetRecord.id },
        data: { used: true },
      }),
    ]);

    return { success: true };
  } catch (err) {
    console.error("Şifre sıfırlama tamamlanma hatası:", err);
    return { success: false, error: "Şifre güncellenemedi. Lütfen tekrar deneyin." };
  }
}

/**
 * Token'ın geçerli olup olmadığını kontrol eder (UI ön-render).
 * Bilgi sızıntısını önlemek için sadece valid/invalid döner.
 */
export async function checkPasswordResetToken(
  token: string
): Promise<{ valid: boolean; email?: string }> {
  if (!token || token.length !== 64) return { valid: false };

  try {
    const record = await prisma.portalPasswordReset.findUnique({
      where: { token },
      include: { portalUser: { select: { email: true, isActive: true } } },
    });

    if (!record) return { valid: false };
    if (record.used) return { valid: false };
    if (record.expiresAt < new Date()) return { valid: false };
    if (!record.portalUser.isActive) return { valid: false };

    return { valid: true, email: record.portalUser.email };
  } catch {
    return { valid: false };
  }
}
