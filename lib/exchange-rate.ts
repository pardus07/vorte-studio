/**
 * USD/TRY döviz kuru — Frankfurter API (ECB verisi, ücretsiz, API key gereksiz)
 * Yedek: open.er-api.com
 */

const PRIMARY_URL = "https://api.frankfurter.dev/v1/latest?from=USD&to=TRY";
const FALLBACK_URL = "https://open.er-api.com/v6/latest/USD";

// 1 saat cache (server-side in-memory)
let cache: { rate: number; date: string; fetchedAt: number } | null = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 saat

export async function getUsdTryRate(): Promise<{ rate: number; date: string }> {
  // Cache kontrol
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL) {
    return { rate: cache.rate, date: cache.date };
  }

  // Primary: Frankfurter
  try {
    const res = await fetch(PRIMARY_URL, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const data = await res.json();
      const rate = data.rates?.TRY;
      const date = data.date || new Date().toISOString().slice(0, 10);
      if (rate && typeof rate === "number") {
        cache = { rate, date, fetchedAt: Date.now() };
        return { rate, date };
      }
    }
  } catch {
    // Fallback'e düş
  }

  // Fallback: open.er-api
  try {
    const res = await fetch(FALLBACK_URL, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const data = await res.json();
      const rate = data.rates?.TRY;
      const date = data.date || new Date().toISOString().slice(0, 10);
      if (rate && typeof rate === "number") {
        cache = { rate, date, fetchedAt: Date.now() };
        return { rate, date };
      }
    }
  } catch {
    // Her iki API de başarısız
  }

  // Son çare: cache varsa onu dön, yoksa sabit değer
  if (cache) return { rate: cache.rate, date: cache.date };
  return { rate: 38.0, date: "fallback" };
}
