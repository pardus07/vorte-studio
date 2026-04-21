// FAZ B — Madde 2.4: Proposal access rate limit + HMAC cookie helpers.
//
// /teklif/{token} public URL için IDOR koruma gate'inin backbone'u:
//   1. DB-backed rate limit — ProposalAccessAttempt (FAZ A pattern)
//   2. HMAC-SHA256 imzalı cookie — başarılı verify sonrası set edilir
//   3. Cookie TTL 24 saat, per-proposal ayrı cookie (çoklu teklif destek)
//
// Mantık (rate limit):
//   • Son 1 saat içinde 5+ başarısız deneme → 1 saat kilit (lock-out)
//   • Son 15 dk içinde 5+ toplam deneme → pencere dolana kadar blok
//   • Kind ayrımı yok — phone/email aynı bütçeyi paylaşır
//   • Fail-open: DB hatası production'ı kilitlemez
//
// Cookie format:
//   proposal_access_<proposalId> = <base64url(payload)>.<base64url(hmac)>
//   payload = <proposalId>|<issuedAtUnixSec>
//   hmac    = HMAC-SHA256(AUTH_SECRET, payload)
//
// Verify aşamaları:
//   1. Cookie parse → payload + signature split
//   2. timingSafeEqual HMAC check (constant-time karşılaştırma)
//   3. issuedAt + MAX_AGE > now (TTL)
//   4. payload proposalId = çağrıdaki expectedProposalId

import { createHmac, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";

// ── Rate limit sabitleri ──
const WINDOW_MS = 15 * 60 * 1000;   // 15 dk pencere
const MAX_ATTEMPTS = 5;             // pencere başına maks deneme
const LOCK_MS = 60 * 60 * 1000;     // 1 saat kilit
const USER_AGENT_MAX = 500;         // UA truncate uzunluğu

// ── Cookie sabitleri ──
export const PROPOSAL_ACCESS_COOKIE_PREFIX = "proposal_access_";
export const PROPOSAL_ACCESS_COOKIE_MAX_AGE_SECONDS = 24 * 60 * 60; // 24 saat
const COOKIE_SEPARATOR = ".";

// ── Tipler ──
export type AccessKind = "phone" | "email" | "disabled";

export type AccessRateLimitDecision =
  | { allowed: true; remaining: number }
  | {
      allowed: false;
      reason: "rate_limit" | "locked";
      retryAfterSeconds: number;
      message: string;
    };

// ════════════════════════════════════════════════════════════════════════
// Rate limit
// ════════════════════════════════════════════════════════════════════════

/**
 * checkAccessRateLimit — izin kontrolü. DB'ye YAZMAZ, sadece OKUR.
 *
 * Proposal-başına bütçe: bir saldırgan farklı proposal token'larını paralel
 * deneyemez (her biri kendi sayacına sahip). Bu istenen davranış — gerçek
 * saldırgan zaten tek proposal'a odaklanır.
 *
 * Sıralama: önce "locked" (ağır blok), sonra "rate_limit" (hafif blok).
 */
export async function checkAccessRateLimit(
  proposalId: string
): Promise<AccessRateLimitDecision> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - WINDOW_MS);
  const lockWindowStart = new Date(now.getTime() - LOCK_MS);

  try {
    // 1) Lock kontrolü: son 1 saat başarısız denemeleri ters sırala.
    const recentFailures = await prisma.proposalAccessAttempt.findMany({
      where: {
        proposalId,
        attemptedAt: { gte: lockWindowStart },
        matched: false,
      },
      orderBy: { attemptedAt: "desc" },
      take: MAX_ATTEMPTS,
      select: { attemptedAt: true },
    });

    if (recentFailures.length >= MAX_ATTEMPTS) {
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
    const windowAttempts = await prisma.proposalAccessAttempt.findMany({
      where: {
        proposalId,
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
    // Fail-open: DB hatası tüm müşterileri kilitlemez
    console.error("[proposal-access-rate-limit] check hatası (fail-open):", err);
    return { allowed: true, remaining: MAX_ATTEMPTS };
  }
}

/**
 * recordAccessAttempt — bir denemeyi DB'ye yazar.
 *
 * Başarı/başarısız her durumda çağrılmalı — başarılı deneme de buget'a
 * sayılır, aksi halde saldırgan doğru bilgiye ulaştığında sayaç sıfırlanır
 * ve brute force süreklilik kazanır.
 *
 * PII minimum: ham input değeri saklanmaz (matched bool yeter). UA truncate
 * edilir. Try/catch: audit yazımı başarısız olursa ana akış durmasın.
 */
export async function recordAccessAttempt(params: {
  proposalId: string;
  kind: AccessKind;
  matched: boolean;
  ip?: string | null;
  userAgent?: string | null;
}): Promise<void> {
  try {
    await prisma.proposalAccessAttempt.create({
      data: {
        proposalId: params.proposalId,
        kind: params.kind,
        matched: params.matched,
        ip: params.ip || null,
        userAgent: params.userAgent
          ? params.userAgent.slice(0, USER_AGENT_MAX)
          : null,
      },
    });
  } catch (err) {
    console.error("[proposal-access-rate-limit] record hatası (kritik değil):", err);
  }
}

// ════════════════════════════════════════════════════════════════════════
// HMAC-SHA256 cookie signing (AUTH_SECRET reuse)
// ════════════════════════════════════════════════════════════════════════

/**
 * getAuthSecret — NextAuth AUTH_SECRET env'ini ödünç alır (Q2-a kararı).
 * Bu sayede hiçbir yeni secret yönetimi gerekmiyor, rotation NextAuth ile
 * senkron. Eksikse throw — deployment'ta fail-fast.
 *
 * Not: NextAuth v5 beta geçişinde resmi isim AUTH_SECRET oldu ama eski
 * deployment'larda hala NEXTAUTH_SECRET set olabilir. Her iki ismi de
 * kabul ediyoruz — NextAuth kütüphanesi de dahili olarak böyle yapıyor.
 */
function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "AUTH_SECRET (or NEXTAUTH_SECRET) environment variable missing or too short (min 16 chars)"
    );
  }
  return secret;
}

// base64 → base64url (URL/cookie güvenli; +/= karakterleri kaldırılır)
function base64url(input: string | Buffer): string {
  const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input;
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// base64url → Buffer (padding eklenir)
function base64urlToBuffer(input: string): Buffer {
  const padLen = (4 - (input.length % 4)) % 4;
  const padded = input
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(input.length + padLen, "=");
  return Buffer.from(padded, "base64");
}

/**
 * buildAccessCookieName — proposal başına benzersiz cookie ismi.
 * Farklı tekliflerin cookie'leri çakışmaz; müşteri bir gün içinde iki
 * farklı teklife bakabilir.
 */
export function buildAccessCookieName(proposalId: string): string {
  return `${PROPOSAL_ACCESS_COOKIE_PREFIX}${proposalId}`;
}

/**
 * signAccessCookie — başarılı verify sonrası imzalı cookie değeri üretir.
 *
 * Format: <base64url(payload)>.<base64url(hmac)>
 *   payload = <proposalId>|<issuedAtUnixSec>
 *   hmac    = HMAC-SHA256(AUTH_SECRET, payload)
 *
 * Neden unix saniye? 2038'e kadar 32-bit int güvenli, string serializasyon
 * kısa, parseInt hızlı. Millisaniye gerekmiyor (TTL 24 saat).
 */
export function signAccessCookie(proposalId: string): string {
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload = `${proposalId}|${issuedAt}`;
  const secret = getAuthSecret();
  const hmac = createHmac("sha256", secret).update(payload).digest();
  return `${base64url(payload)}${COOKIE_SEPARATOR}${base64url(hmac)}`;
}

/**
 * verifyAccessCookie — cookie değerini doğrular.
 *
 * Aşamalar:
 *   1. Format kontrolü (2 parça, . ile ayrılmış)
 *   2. HMAC timingSafeEqual karşılaştırması (constant-time)
 *   3. TTL kontrolü (issuedAt + MAX_AGE > now)
 *   4. payload proposalId = expectedProposalId mi? (cookie hırsızlığı
 *      proposal A → proposal B için kullanılamaz)
 *
 * Herhangi bir aşamada başarısızsa false. Hata loglanmaz — cookie yok/eski/
 * invalid olabilir, bu güvenlik olayı değil normal akış.
 *
 * timingSafeEqual kullanımı: saldırganın byte-by-byte timing attack yaparak
 * HMAC tahmin etmesini engeller. == veya Buffer.equals güvensiz.
 */
export function verifyAccessCookie(
  cookieValue: string | undefined,
  expectedProposalId: string
): boolean {
  if (!cookieValue) return false;

  const parts = cookieValue.split(COOKIE_SEPARATOR);
  if (parts.length !== 2) return false;

  const [payloadB64, sigB64] = parts;
  if (!payloadB64 || !sigB64) return false;

  try {
    const payload = base64urlToBuffer(payloadB64).toString("utf8");
    const providedSig = base64urlToBuffer(sigB64);

    // HMAC doğrulama (constant-time)
    const secret = getAuthSecret();
    const expectedSig = createHmac("sha256", secret).update(payload).digest();

    if (providedSig.length !== expectedSig.length) return false;
    if (!timingSafeEqual(providedSig, expectedSig)) return false;

    // Payload parse
    const sepIdx = payload.indexOf("|");
    if (sepIdx <= 0) return false;
    const cookieProposalId = payload.slice(0, sepIdx);
    const issuedAtStr = payload.slice(sepIdx + 1);

    if (!cookieProposalId || !issuedAtStr) return false;
    if (cookieProposalId !== expectedProposalId) return false;

    const issuedAt = parseInt(issuedAtStr, 10);
    if (!Number.isFinite(issuedAt) || issuedAt <= 0) return false;

    // TTL
    const expiresAt = issuedAt + PROPOSAL_ACCESS_COOKIE_MAX_AGE_SECONDS;
    const now = Math.floor(Date.now() / 1000);
    if (expiresAt <= now) return false;

    return true;
  } catch {
    // base64 parse / secret missing / vs → cookie geçersiz
    return false;
  }
}

// ════════════════════════════════════════════════════════════════════════
// Helpers (verify akışı + UI tarafı input normalizasyonu)
// ════════════════════════════════════════════════════════════════════════

/**
 * extractClientContext — Server Action içinden istek IP + UA çıkarımı.
 * FAZ A (email-verification-rate-limit) pattern'inin kopyası — import
 * cycle önlemek için re-export yerine ayrı implementasyon.
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
    console.error("[proposal-access-rate-limit] header okuma hatası:", err);
    return { ip: null, userAgent: null };
  }
}

/**
 * determineAccessKind — Proposal iletişim bilgilerinden aktif modu belirler.
 *
 * Q1-C dinamik davranış:
 *   • contactPhone dolu (>=4 hane) → "phone" (son 4 hane sorulur)
 *   • contactPhone boş/kısa ama contactEmail dolu → "email" (tam email)
 *   • ikisi de yoksa → "disabled" (gate bypass, ProposalView banner uyarır)
 *
 * Tutarlı karar: Server Component (page.tsx) render sırasında bir kez
 * karar verir ve gate'e kind prop olarak geçer. Server Action verify
 * sırasında DB'den Proposal'ı tekrar çeker ve aynı kararı tekrar hesaplar
 * — böylece client malicious kind göndersin, sunucu reddeder.
 */
export function determineAccessKind(params: {
  contactPhone: string | null | undefined;
  contactEmail: string | null | undefined;
}): AccessKind {
  const phoneDigits = params.contactPhone?.replace(/\D/g, "") ?? "";
  const email = params.contactEmail?.trim() ?? "";
  if (phoneDigits.length >= 4) return "phone";
  if (email.length > 3 && email.includes("@")) return "email";
  return "disabled";
}

/**
 * normalizePhoneLast4 — user input'undan son 4 hane çıkarır.
 * "1234", "0555 123 45 67", "+905551234567" hepsi kabul edilir.
 * 4 haneden az ise null döner.
 */
export function normalizePhoneLast4(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (digits.length < 4) return null;
  return digits.slice(-4);
}

/**
 * extractPhoneLast4 — DB'deki contactPhone alanından son 4 hane.
 * Karşılaştırma için normalize etmek şart (örn. "+90 555 123 4567" ≠ "4567").
 */
export function extractPhoneLast4(contactPhone: string): string | null {
  return normalizePhoneLast4(contactPhone);
}

/**
 * normalizeEmail — Lowercase + trim.
 * Email karşılaştırması case-insensitive olmalı — kullanıcı "Ali@Domain.com"
 * girer, DB'de "ali@domain.com" kayıtlı olur, bu eşit sayılır.
 */
export function normalizeEmail(input: string): string {
  return input.trim().toLowerCase();
}
