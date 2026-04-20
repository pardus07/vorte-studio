// FAZ A — Madde 1.5: Email verification rate limit helper.
//
// verifyContractEmail Server Action'ı (actions/contracts.ts) için brute
// force koruması. DB-backed rate limit: in-memory map'ten farklı olarak
// edge/serverless restart'larında state kaybolmaz, coğrafi dağıtıkta
// senkron kalır.
//
// Mantık:
//   1. Son 1 saat içinde 5+ başarısız deneme → 1 saat kilit (lock-out)
//   2. Son 15 dk içinde 5+ toplam deneme → pencere dolana kadar blok
//   3. Aksi halde izin, kalan deneme sayısını döner
//
// recordAttempt her iki akışta da çağrılmalı (success=true/false) — başarılı
// deneme de rate limit penceresine sayılır, aksi halde saldırgan doğru kodu
// bildiğinde limit'e sayılmaz ve bu brute force'u teşvik eder.
//
// Fail-open: DB hatasında rate limit'i bypass ederiz. Gerekçe: 2. katman
// (VerificationCode 10 dk expire + tek kullanımlık) brute force'u zaten
// kısıtlıyor. Tam DB outage'da fail-closed gitmek mevcut müşterileri de
// kilitler — operasyonel risk > güvenlik kazancı.

import { prisma } from "@/lib/prisma";

const WINDOW_MS = 15 * 60 * 1000;   // 15 dk pencere
const MAX_ATTEMPTS = 5;             // pencere başına maks deneme
const LOCK_MS = 60 * 60 * 1000;     // 1 saat kilit (5 yanlıştan sonra)
const USER_AGENT_MAX = 500;         // UA truncate uzunluğu

export type RateLimitDecision =
  | { allowed: true; remaining: number }
  | {
      allowed: false;
      reason: "rate_limit" | "locked";
      retryAfterSeconds: number;
      message: string;
    };

/**
 * checkRateLimit — izin kontrolü. DB'ye YAZMAZ, sadece OKUR.
 *
 * Sıralama önemli: önce "locked" kontrolü (daha ağır blok), sonra pencere
 * sayacı. Lock penceresi 1 saat, window 15 dk.
 */
export async function checkRateLimit(
  email: string
): Promise<RateLimitDecision> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - WINDOW_MS);
  const lockWindowStart = new Date(now.getTime() - LOCK_MS);

  try {
    // 1) Lock kontrolü: son 1 saat başarısız denemeleri ters sırala.
    //    5. en son başarısızdan itibaren 1 saat geçmediyse kilitli.
    const recentFailures = await prisma.emailVerificationAttempt.findMany({
      where: {
        email,
        attemptedAt: { gte: lockWindowStart },
        success: false,
      },
      orderBy: { attemptedAt: "desc" },
      take: MAX_ATTEMPTS,
      select: { attemptedAt: true },
    });

    if (recentFailures.length >= MAX_ATTEMPTS) {
      // En eski (dizinin son elemanı) başarısız + LOCK_MS = kilit biter
      const oldestFailure = recentFailures[recentFailures.length - 1];
      const lockExpiresAt = new Date(
        oldestFailure.attemptedAt.getTime() + LOCK_MS
      );
      if (lockExpiresAt > now) {
        const retryAfterSeconds = Math.max(
          Math.ceil((lockExpiresAt.getTime() - now.getTime()) / 1000),
          1
        );
        const minutes = Math.ceil(retryAfterSeconds / 60);
        return {
          allowed: false,
          reason: "locked",
          retryAfterSeconds,
          message: `Çok fazla yanlış deneme. Güvenlik nedeniyle ${minutes} dakika bekleyin.`,
        };
      }
    }

    // 2) Pencere kontrolü: son 15 dk toplam deneme (başarılı+başarısız).
    //    Limiti aştıysa en eski deneme + WINDOW_MS'ye kadar blok.
    const windowAttempts = await prisma.emailVerificationAttempt.findMany({
      where: {
        email,
        attemptedAt: { gte: windowStart },
      },
      orderBy: { attemptedAt: "asc" },
      take: MAX_ATTEMPTS + 1,
      select: { attemptedAt: true },
    });

    if (windowAttempts.length >= MAX_ATTEMPTS) {
      const oldestInWindow = windowAttempts[0];
      const windowEndsAt = new Date(
        oldestInWindow.attemptedAt.getTime() + WINDOW_MS
      );
      const retryAfterSeconds = Math.max(
        Math.ceil((windowEndsAt.getTime() - now.getTime()) / 1000),
        1
      );
      const minutes = Math.ceil(retryAfterSeconds / 60);
      return {
        allowed: false,
        reason: "rate_limit",
        retryAfterSeconds,
        message: `Çok fazla deneme yaptınız. ${minutes} dakika sonra tekrar deneyin.`,
      };
    }

    return {
      allowed: true,
      remaining: MAX_ATTEMPTS - windowAttempts.length,
    };
  } catch (err) {
    // Fail-open: DB hatası production'ı kilitlemez
    console.error("[email-rate-limit] check hatası (fail-open):", err);
    return { allowed: true, remaining: MAX_ATTEMPTS };
  }
}

/**
 * recordAttempt — bir doğrulama denemesini DB'ye yazar.
 *
 * success/failure her iki durumda da çağrılmalı. UA truncate edilir,
 * IP zaten kısa. Try/catch sarmalı: log yazımı ana akışı durdurmaz.
 */
export async function recordAttempt(params: {
  email: string;
  success: boolean;
  ip?: string | null;
  userAgent?: string | null;
}): Promise<void> {
  try {
    await prisma.emailVerificationAttempt.create({
      data: {
        email: params.email,
        success: params.success,
        ip: params.ip || null,
        userAgent: params.userAgent
          ? params.userAgent.slice(0, USER_AGENT_MAX)
          : null,
      },
    });
  } catch (err) {
    console.error("[email-rate-limit] record hatası (kritik değil):", err);
  }
}

/**
 * extractClientContext — Server Action içinden istek IP + UA çıkarımı.
 *
 * Next.js 16: headers() async. Server Action'ın başında bir kez çağrılır,
 * sonuç hem checkRateLimit (rate limit için değil ama ileride lazım olursa)
 * hem recordAttempt'e geçirilir.
 */
export async function extractClientContext(): Promise<{
  ip: string | null;
  userAgent: string | null;
}> {
  try {
    const { headers } = await import("next/headers");
    const h = await headers();
    // x-forwarded-for virgül ayrılmış liste — ilk değer asıl client IP
    const xff = h.get("x-forwarded-for");
    const ip =
      (xff ? xff.split(",")[0].trim() : null) ||
      h.get("x-real-ip") ||
      null;
    const userAgent = h.get("user-agent") || null;
    return { ip, userAgent };
  } catch (err) {
    console.error("[email-rate-limit] header okuma hatası:", err);
    return { ip: null, userAgent: null };
  }
}
