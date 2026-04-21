-- ═══════════════════════════════════════════════════════════════════════
-- FAZ C — Madde 3.3: PricingConfig Temporal Versioning + KDV Seed
-- ═══════════════════════════════════════════════════════════════════════
--
-- Tablo    : PricingConfig (mevcut — extend edilecek)
-- Amaç     : Hardcoded 0.20 KDV oranını DB'den okunan temporal config'e
--            taşımak. Aynı `key` için birden fazla kayıt (farklı dönem)
--            saklanabilsin diye UNIQUE(key) → UNIQUE(key, effectiveFrom).
--
-- SEÇENEK A: Mevcut PricingConfig modeli genişletilir (yeni tablo açılmaz).
--            51 mevcut satır korunur, 4 yeni kolon + yeni unique index +
--            1 seed satır (KDV 2023-07-10 sonrası 0.20).
--
-- Pattern  : Sprint 3.6d standardı — checksum=0000 out-of-band.
-- Hedef    : Production PostgreSQL (vortestudio, fo0wsks800084gsockckos8k)
-- Not      : `prisma migrate deploy` CALISMAZ — SSH üzerinden psql.
--
-- ───── Pre-flight manuel doğrulama (ÇALIŞTIRMADAN ÖNCE) ─────
--
--   docker exec -it fo0wsks800084gsockckos8k \
--     psql -U vorte -d vortestudio -c \
--     'SELECT key, COUNT(*) FROM "PricingConfig" GROUP BY key HAVING COUNT(*) > 1;'
--
--   Beklenen: "0 rows" (hiç duplicate key yok)
--   Olası: birkaç duplicate → migration durdurulur (RAISE EXCEPTION).
--
-- ───── Çalıştırma (Coolify VPS) ─────
--
--   docker cp 2026-04-21-pricing-config-temporal.sql \
--     fo0wsks800084gsockckos8k:/tmp/mig.sql
--   docker exec -it fo0wsks800084gsockckos8k \
--     psql -U vorte -d vortestudio -f /tmp/mig.sql
--
-- ───── Özellikler ─────
--
--  • BEGIN/COMMIT tek transaction — kısmi başarı olmaz
--  • Pre-flight DO block: duplicate key varsa RAISE EXCEPTION → rollback
--  • IF NOT EXISTS / IF EXISTS guard'ları — idempotent
--  • UNIQUE(key) → UNIQUE(key, effectiveFrom) geçişi atomik
--  • Mevcut 51 satıra effectiveFrom = '2018-01-01' atanır
--    (proje başlangıcı öncesine itilir — hiçbir contract bundan eski değil)
--  • KDV seed: effectiveFrom='2018-01-01' (mevcut satırlarla simetrik;
--    Türkiye KDV tarihçesi %18 → %20 proje için irrelevant, 2018-2023
--    arası sözleşme yok, proje 2026'da başladı)
--
-- ═══════════════════════════════════════════════════════════════════════

BEGIN;

-- ── 0) Pre-flight: duplicate key yoksa devam ──
-- Eğer aynı key ile birden fazla satır varsa, UNIQUE(key) DROP sonrası
-- UNIQUE(key, effectiveFrom) INSERT'te de patlar çünkü hepsi aynı
-- effectiveFrom alır. Burada erken kes.
DO $$
DECLARE
  dup_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO dup_count FROM (
    SELECT key FROM "PricingConfig"
    GROUP BY key HAVING COUNT(*) > 1
  ) d;

  IF dup_count > 0 THEN
    RAISE EXCEPTION 'Pre-flight FAIL: PricingConfig icinde % duplicate key var — migration iptal', dup_count;
  END IF;
END $$;

-- ── 1) Yeni kolonlar ──
-- effectiveFrom: satırın geçerli olduğu dönem başlangıcı.
--   Mevcut 51 satır için '2018-01-01' — proje başlangıcından önce
--   (hiçbir contract.createdAt bundan eski değil, tümünü kapsar).
ALTER TABLE "PricingConfig"
  ADD COLUMN IF NOT EXISTS "effectiveFrom" TIMESTAMP(3) NOT NULL
    DEFAULT '2018-01-01 00:00:00'::timestamp;

-- effectiveTo: NULL = hâlâ aktif. Tarih atandığında o satır arşivlenir.
ALTER TABLE "PricingConfig"
  ADD COLUMN IF NOT EXISTS "effectiveTo" TIMESTAMP(3);

-- description: KDV resmî dayanak vb. serbest metin.
ALTER TABLE "PricingConfig"
  ADD COLUMN IF NOT EXISTS "description" TEXT;

-- createdAt: şema'da yoktu, geriye dönük ekleniyor.
ALTER TABLE "PricingConfig"
  ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL
    DEFAULT CURRENT_TIMESTAMP;

-- ── 2) UNIQUE(key) → UNIQUE(key, effectiveFrom) geçişi ──
-- Prisma `@unique`'i UNIQUE INDEX olarak kuruyor (CONSTRAINT değil).
-- Dolayısıyla önce DROP CONSTRAINT (belt-and-suspenders, named-constraint
-- varsa), sonra DROP INDEX. İkisi de IF EXISTS ile güvenli.
ALTER TABLE "PricingConfig"
  DROP CONSTRAINT IF EXISTS "PricingConfig_key_key";
DROP INDEX IF EXISTS "PricingConfig_key_key";

CREATE UNIQUE INDEX IF NOT EXISTS "PricingConfig_key_effectiveFrom_key"
  ON "PricingConfig" ("key", "effectiveFrom");

-- ── 3) Sorgu indexleri ──
-- Temporal lookup: key + asOf (effectiveFrom <= asOf AND (effectiveTo IS NULL OR effectiveTo > asOf))
CREATE INDEX IF NOT EXISTS "PricingConfig_key_effectiveFrom_effectiveTo_idx"
  ON "PricingConfig" ("key", "effectiveFrom", "effectiveTo");

-- Admin UI kategori listesi
CREATE INDEX IF NOT EXISTS "PricingConfig_category_effectiveFrom_idx"
  ON "PricingConfig" ("category", "effectiveFrom");

-- ── 4) KDV seed ──
-- Türkiye KDV %20. Tarihsel %18 (2018-öncesi) veya %18→%20 geçişi
-- (2023-07-10) proje için irrelevant — Vorte Studio 2026'da başladı,
-- bu tarihlerden eski sözleşme yok. Mevcut 51 satırla simetrik
-- effectiveFrom='2018-01-01' (proje-öncesi sabit nokta).
-- İleride KDV değişirse yeni satır eklenir, bu satır effectiveTo
-- ile kapatılır (temporal versioning pattern).
INSERT INTO "PricingConfig" (
  id, category, key, label, value, unit, "sortOrder", "isActive",
  "effectiveFrom", "effectiveTo", description, "createdAt", "updatedAt"
)
SELECT
  'kdv_rate_2018',                              -- deterministik id (tarihle tutarlı)
  'tax',
  'kdv_rate',
  'KDV Oranı',
  0.20,
  'carpan',
  0,
  true,
  '2018-01-01 00:00:00'::timestamp,
  NULL,
  'Turkiye KDV %20. Proje baslangic-oncesi sabit seed. Ileride degisirse effectiveTo set et + yeni satir ekle.',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (
  SELECT 1 FROM "PricingConfig"
  WHERE key = 'kdv_rate' AND "effectiveFrom" = '2018-01-01 00:00:00'::timestamp
);

-- ── 5) Prisma migration kaydı ──
INSERT INTO "_prisma_migrations" (
  id, checksum, finished_at, migration_name, logs, rolled_back_at,
  started_at, applied_steps_count
)
SELECT
  gen_random_uuid()::text,
  '0000000000000000000000000000000000000000000000000000000000000000',
  NOW(),
  '20260421080000_extend_pricing_config_temporal',
  NULL,
  NULL,
  NOW(),
  1
WHERE NOT EXISTS (
  SELECT 1 FROM "_prisma_migrations"
  WHERE migration_name = '20260421080000_extend_pricing_config_temporal'
);

COMMIT;

-- ───── Doğrulama sorguları (COMMIT sonrası manuel çalıştır) ─────
--
-- Yeni kolonlar (beklenen 4 ek kolon):
--   \d "PricingConfig"
--
-- 51 mevcut + 1 yeni = 52 satır:
--   SELECT COUNT(*) FROM "PricingConfig";
--
-- KDV seed (beklenen: id='kdv_rate_2018', value=0.20, effectiveFrom='2018-01-01'):
--   SELECT id, key, value, "effectiveFrom", "effectiveTo"
--     FROM "PricingConfig" WHERE key = 'kdv_rate';
--
-- Backfill simetri kontrolü (beklenen 52 = 51 mevcut + 1 KDV):
--   SELECT COUNT(*) FROM "PricingConfig"
--     WHERE "effectiveFrom" = '2018-01-01 00:00:00'::timestamp;
--
-- UNIQUE index (yeni):
--   SELECT indexname FROM pg_indexes
--    WHERE tablename = 'PricingConfig' AND indexdef LIKE '%UNIQUE%';
--
-- Migration kaydı:
--   SELECT migration_name FROM "_prisma_migrations"
--    WHERE migration_name LIKE '%pricing_config_temporal%';
--
-- ═══════════════════════════════════════════════════════════════════════
