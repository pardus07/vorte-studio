// ═══════════════════════════════════════════════════════════════════════
// FAZ C — Madde 3.3: PricingConfig Temporal Lookup Helper
// ═══════════════════════════════════════════════════════════════════════
//
// Hardcoded KDV 0.20 vb. değerleri DB'den dönem-farkında okumak için.
// Sözleşme anındaki oranı korur — bugün %22 olsa bile dün imzalanan
// contract %20 ile görünmeli (temporal audit integrity).
//
// Cache stratejisi: In-process Map, 5dk TTL.
// - Coolify tek instance çalıştığı için Next.js fetch cache / unstable_cache
//   yerine plain Map yeterli (dağıtık cache overhead olmadan).
// - Cache key: `${key}:${asOf?.toISOString().slice(0,10) || 'now'}`
//   → aynı gün aynı key için tek DB hit
// - 5dk TTL: admin pricing güncelleyip beklemeden görmek için
//   (admin UI `invalidatePricingCache(key)` çağırabilir — revalidatePath'le
//   aynı mantık)
//
// Fallback hiyerarşisi:
//   kdv_rate missing  → 0.20 + console.error (hayati, default sessiz olmasın)
//   diğer key missing → throw Error (yakalanmayan bug, visible fail)
//
// Kullanım:
//   const kdv = await getPricingValue("kdv_rate", contract.createdAt);
//   const hourly = await getPricingValue("hourly_rate"); // şu an
//
// ═══════════════════════════════════════════════════════════════════════

import { prisma } from "@/lib/prisma";

type CacheEntry = {
  value: number;
  expiresAt: number;
};

const cache = new Map<string, CacheEntry>();
const TTL_MS = 5 * 60 * 1000; // 5 dakika

// Emergency fallback'ler — DB query tamamen fail ederse bile sistem çalışsın.
// Sadece kritik key'ler için tanımla; diğerleri throw eder.
const EMERGENCY_FALLBACKS: Record<string, number> = {
  kdv_rate: 0.2,
};

/**
 * PricingConfig'ten temporal-aware değer okur.
 *
 * @param key       PricingConfig.key (ör: "kdv_rate", "base_tanitim")
 * @param asOf      Hangi tarihteki değer? undefined → şu an
 * @returns         DB'deki value (ya da fallback)
 */
export async function getPricingValue(
  key: string,
  asOf?: Date
): Promise<number> {
  const asOfDate = asOf ?? new Date();
  const cacheKey = `${key}:${asOfDate.toISOString().slice(0, 10)}`;

  // Cache hit?
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  try {
    // Temporal lookup:
    //   effectiveFrom <= asOf
    //   AND (effectiveTo IS NULL OR effectiveTo > asOf)
    //   ORDER BY effectiveFrom DESC (en güncel matching kayıt)
    const row = await prisma.pricingConfig.findFirst({
      where: {
        key,
        isActive: true,
        effectiveFrom: { lte: asOfDate },
        OR: [{ effectiveTo: null }, { effectiveTo: { gt: asOfDate } }],
      },
      orderBy: { effectiveFrom: "desc" },
      select: { value: true },
    });

    if (row) {
      cache.set(cacheKey, {
        value: row.value,
        expiresAt: Date.now() + TTL_MS,
      });
      return row.value;
    }

    // DB'de yok — fallback var mı?
    if (key in EMERGENCY_FALLBACKS) {
      console.error(
        `[pricing-config] '${key}' için asOf=${asOfDate.toISOString()} DB'de bulunamadı — emergency fallback kullanılıyor.`
      );
      return EMERGENCY_FALLBACKS[key];
    }

    throw new Error(
      `Pricing config missing: '${key}' (asOf=${asOfDate.toISOString()})`
    );
  } catch (err) {
    // DB down vb. — son savunma
    if (key in EMERGENCY_FALLBACKS) {
      console.error(
        `[pricing-config] '${key}' DB hatası — emergency fallback:`,
        err
      );
      return EMERGENCY_FALLBACKS[key];
    }
    throw err;
  }
}

/**
 * Cache'i temizler. Admin pricing update'inden sonra çağrılmalı.
 *
 * @param key  undefined → tüm cache, tanımlıysa sadece o key'in entry'leri
 */
export function invalidatePricingCache(key?: string): void {
  if (!key) {
    cache.clear();
    return;
  }
  // key:YYYY-MM-DD formatında cache key'leri → prefix ile filtrele
  const prefix = `${key}:`;
  for (const k of cache.keys()) {
    if (k.startsWith(prefix)) {
      cache.delete(k);
    }
  }
}

/**
 * Test/debug için — cache state'ini okur.
 */
export function getPricingCacheSize(): number {
  return cache.size;
}
