/**
 * In-memory token bucket rate limiter.
 *
 * Coolify single-node deployment için tasarlandı. State process belleğinde
 * tutulur — restart'ta sıfırlanır (saldırgan da yeniden başlamalı). Multi
 * replica için Redis'e taşınmalı.
 *
 * Token bucket algoritması:
 * - Her IP+endpoint kombinasyonu için bir "kova" (bucket) tutulur
 * - Kova başlangıçta `limit` token ile dolu
 * - Her istek 1 token tüketir
 * - Token'lar windowMs / limit hızıyla yeniden dolar
 * - Sıfır token kalırsa istek reddedilir
 *
 * Avantaj: Burst trafiğe izin verir (kullanıcı 5 saniyede 3 mesaj atabilir),
 * uzun vadede limiti korur.
 */

import { NextResponse } from "next/server";

interface Bucket {
  tokens: number;
  lastRefill: number; // epoch ms
}

// Global Map — process boyu yaşar
const buckets = new Map<string, Bucket>();

// Bellek sızıntısı koruması: 30dk hareket etmeyen kayıtları temizle
const STALE_MS = 30 * 60 * 1000;
let lastSweep = Date.now();
const SWEEP_INTERVAL_MS = 10 * 60 * 1000; // 10 dakikada bir

function sweepStaleEntries() {
  const now = Date.now();
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  for (const [key, bucket] of buckets.entries()) {
    if (now - bucket.lastRefill > STALE_MS) {
      buckets.delete(key);
    }
  }
}

export interface RateLimitConfig {
  /** Eşsiz anahtar — genelde "ip:endpoint" formatı */
  key: string;
  /** Penceredeki maksimum istek sayısı (kova kapasitesi) */
  limit: number;
  /** Yenileme penceresi (ms) — `limit` token bu sürede yenilenir */
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  /** Kalan token sayısı */
  remaining: number;
  /** Limit yenilenene kadar saniye (Retry-After header için) */
  resetSeconds: number;
}

/**
 * Token bucket kontrolü. Her çağrıda 1 token tüketir.
 * Token yoksa success=false döner ve istek reddedilmelidir.
 */
export function rateLimit(config: RateLimitConfig): RateLimitResult {
  sweepStaleEntries();

  const now = Date.now();
  const refillRate = config.limit / config.windowMs; // token / ms

  let bucket = buckets.get(config.key);

  if (!bucket) {
    // İlk istek: kova dolu başlar
    bucket = { tokens: config.limit, lastRefill: now };
    buckets.set(config.key, bucket);
  } else {
    // Geçen süreye göre token yenile
    const elapsed = now - bucket.lastRefill;
    const refilled = elapsed * refillRate;
    bucket.tokens = Math.min(config.limit, bucket.tokens + refilled);
    bucket.lastRefill = now;
  }

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    return {
      success: true,
      remaining: Math.floor(bucket.tokens),
      resetSeconds: Math.ceil((1 - bucket.tokens) / refillRate / 1000),
    };
  }

  // Token yok — bir token dolması için gereken süre
  const msUntilToken = (1 - bucket.tokens) / refillRate;
  return {
    success: false,
    remaining: 0,
    resetSeconds: Math.ceil(msUntilToken / 1000),
  };
}

/**
 * Request'ten client IP'sini çıkarır.
 *
 * Coolify/Traefik arkasında çalıştığı için x-forwarded-for güvenilirdir
 * (proxy bunu overwrite eder, client kendisi set edemez). İlk IP'yi alırız
 * çünkü chain'de ilk değer gerçek client'tır.
 */
export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    return xff.split(",")[0]?.trim() || "unknown";
  }
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

/**
 * Standart 429 yanıtı oluşturur. Retry-After header + Türkçe mesaj.
 */
export function rateLimitResponse(resetSeconds: number): NextResponse {
  const minutes = Math.ceil(resetSeconds / 60);
  const message =
    minutes >= 1
      ? `Çok fazla istek gönderdiniz. Lütfen ${minutes} dakika sonra tekrar deneyin.`
      : `Çok fazla istek gönderdiniz. Lütfen birkaç saniye sonra tekrar deneyin.`;

  return NextResponse.json(
    { success: false, error: message, code: "RATE_LIMITED" },
    {
      status: 429,
      headers: {
        "Retry-After": String(resetSeconds),
        "X-RateLimit-Reset": String(Math.ceil(Date.now() / 1000) + resetSeconds),
      },
    }
  );
}

/**
 * Yardımcı: tek satırda IP-bazlı limit + 429 dönüş kontrolü.
 *
 * Kullanım:
 *   const limited = await checkRateLimit(req, "chat-submit", 3, 60 * 60 * 1000);
 *   if (limited) return limited;
 */
export function checkRateLimit(
  req: Request,
  endpoint: string,
  limit: number,
  windowMs: number
): NextResponse | null {
  const ip = getClientIp(req);
  const result = rateLimit({
    key: `${ip}:${endpoint}`,
    limit,
    windowMs,
  });
  if (!result.success) {
    return rateLimitResponse(result.resetSeconds);
  }
  return null;
}

/**
 * Brute force tracking için sayaç (token bucket DEĞİL — sadece counter).
 *
 * Login gibi başarısız denemelerin sayılması gereken durumlarda kullanılır.
 * Token bucket'ten farkı: token bucket her istekte 1 düşer, bu sayaç sadece
 * `recordFailure` çağrıldığında artar. Başarılı login sayacı sıfırlar.
 */
const failureCounters = new Map<string, { count: number; firstFailureAt: number }>();

export interface FailureCheckResult {
  blocked: boolean;
  remainingAttempts: number;
  unlockSeconds: number;
}

export function checkFailureCount(
  key: string,
  maxFailures: number,
  windowMs: number
): FailureCheckResult {
  const now = Date.now();
  const record = failureCounters.get(key);

  if (!record) {
    return { blocked: false, remainingAttempts: maxFailures, unlockSeconds: 0 };
  }

  // Pencere dolduysa sayacı sıfırla
  if (now - record.firstFailureAt > windowMs) {
    failureCounters.delete(key);
    return { blocked: false, remainingAttempts: maxFailures, unlockSeconds: 0 };
  }

  if (record.count >= maxFailures) {
    return {
      blocked: true,
      remainingAttempts: 0,
      unlockSeconds: Math.ceil((windowMs - (now - record.firstFailureAt)) / 1000),
    };
  }

  return {
    blocked: false,
    remainingAttempts: maxFailures - record.count,
    unlockSeconds: 0,
  };
}

export function recordFailure(key: string): void {
  const now = Date.now();
  const record = failureCounters.get(key);
  if (!record) {
    failureCounters.set(key, { count: 1, firstFailureAt: now });
  } else {
    record.count += 1;
  }
}

export function resetFailures(key: string): void {
  failureCounters.delete(key);
}
