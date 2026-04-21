-- ═══════════════════════════════════════════════════════════════════════
-- FAZ C — Madde 3.5: Client Acquisition Source Tracking
-- ═══════════════════════════════════════════════════════════════════════
--
-- Tablo    : Client (mevcut — 3 yeni kolon + FK eklenecek)
-- Amaç     : Müşteri edinim kanalını ve orijinal lead bağlantısını izlemek.
--            Pazarlama ROI, attribution analizi, lead→client conversion.
--
-- Yeni alanlar:
--   • acquisitionSource  TEXT          — enum benzeri (lib/constants.ts)
--                                         MAPS_SCRAPER | SITE_FORM |
--                                         LINKEDIN | REFERRAL | MANUAL |
--                                         MANUAL_ADMIN | PROPOSAL_PAYMENT |
--                                         MAINTENANCE
--   • acquisitionDate    TIMESTAMP(3)  — lead yaratıldığı tarih
--                                         (createdAt != edinim tarihi;
--                                          lead görüşmeye aylar sonra
--                                          dönüşebilir)
--   • originalLeadId     TEXT          — Lead.id FK (nullable)
--
-- FK "Client_originalLeadId_fkey":
--   ON DELETE SET NULL  — Lead silinirse Client kaybolmaz, sadece
--                          originalLeadId null'a düşer. Kaynak bilgisi
--                          acquisitionSource/acquisitionDate'te kalır.
--   ON UPDATE CASCADE   — Lead.id değişmez pratikte; güvenlik için.
--
-- Backfill NOTU:
--   Mevcut 2 Client satırı için acquisitionSource/Date NULL kalacak —
--   3.5 öncesi elle eklendikleri için kaynak bilinmiyor. İleride manuel
--   set edilebilir. Yeni akışlarda (KODLA aşaması) her client.create
--   çağrısı bu alanı doldurur.
--
-- Pattern  : Sprint 3.6d standardı — checksum=0000 out-of-band.
-- Hedef    : Production PostgreSQL (vortestudio, fo0wsks800084gsockckos8k)
-- Not      : `prisma migrate deploy` CALISMAZ — SSH üzerinden psql.
--
-- ───── Çalıştırma (Coolify VPS) ─────
--
--   docker cp 2026-04-21-client-acquisition-tracking.sql \
--     fo0wsks800084gsockckos8k:/tmp/mig.sql
--   docker exec -it fo0wsks800084gsockckos8k \
--     psql -U vorte -d vortestudio -f /tmp/mig.sql
--
-- ───── Özellikler ─────
--
--  • BEGIN/COMMIT tek transaction — kısmi başarı olmaz
--  • ADD COLUMN IF NOT EXISTS (3 kolon) — idempotent
--  • FK constraint: PostgreSQL'de ADD CONSTRAINT IF NOT EXISTS yok,
--    DO block ile pg_constraint sorgusu yapılır
--  • Index'ler IF NOT EXISTS — idempotent
--
-- ═══════════════════════════════════════════════════════════════════════

BEGIN;

-- ── 1) Yeni kolonlar ──
ALTER TABLE "Client"
  ADD COLUMN IF NOT EXISTS "acquisitionSource" TEXT;
ALTER TABLE "Client"
  ADD COLUMN IF NOT EXISTS "acquisitionDate" TIMESTAMP(3);
ALTER TABLE "Client"
  ADD COLUMN IF NOT EXISTS "originalLeadId" TEXT;

-- ── 2) FK constraint (idempotent guard) ──
-- PostgreSQL 15- ADD CONSTRAINT IF NOT EXISTS desteklemiyor, manuel kontrol.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'Client_originalLeadId_fkey'
  ) THEN
    ALTER TABLE "Client"
      ADD CONSTRAINT "Client_originalLeadId_fkey"
      FOREIGN KEY ("originalLeadId")
      REFERENCES "Lead" ("id")
      ON DELETE SET NULL
      ON UPDATE CASCADE;
  END IF;
END $$;

-- ── 3) Query performance index'leri ──
-- ROI raporu: GROUP BY acquisitionSource
CREATE INDEX IF NOT EXISTS "Client_acquisitionSource_idx"
  ON "Client" ("acquisitionSource");

-- Zaman serisi chart: range + order by
CREATE INDEX IF NOT EXISTS "Client_acquisitionDate_idx"
  ON "Client" ("acquisitionDate");

-- FK reverse lookup: lead → client join (originalLeadId tekil zorunlu değil
-- ama büyük tabloda join hızlandırır)
CREATE INDEX IF NOT EXISTS "Client_originalLeadId_idx"
  ON "Client" ("originalLeadId");

-- ── 4) Prisma migration kaydı ──
INSERT INTO "_prisma_migrations" (
  id, checksum, finished_at, migration_name, logs, rolled_back_at,
  started_at, applied_steps_count
)
SELECT
  gen_random_uuid()::text,
  '0000000000000000000000000000000000000000000000000000000000000000',
  NOW(),
  '20260421080001_add_client_acquisition_tracking',
  NULL,
  NULL,
  NOW(),
  1
WHERE NOT EXISTS (
  SELECT 1 FROM "_prisma_migrations"
  WHERE migration_name = '20260421080001_add_client_acquisition_tracking'
);

COMMIT;

-- ───── Doğrulama sorguları (COMMIT sonrası manuel çalıştır) ─────
--
-- Yeni kolonlar (11 eski → 14 kolon):
--   \d "Client"
--
-- FK kontrolü (confdeltype='n' = SET NULL, confupdtype='c' = CASCADE):
--   SELECT conname, confdeltype, confupdtype FROM pg_constraint
--    WHERE conname = 'Client_originalLeadId_fkey';
--
-- Index kontrolü (pkey + 3 yeni = 4 index):
--   SELECT indexname FROM pg_indexes
--    WHERE tablename = 'Client' ORDER BY indexname;
--
-- Mevcut 2 satır NULL mı (beklenen 2):
--   SELECT COUNT(*) FROM "Client" WHERE "acquisitionSource" IS NULL;
--
-- Migration kaydı:
--   SELECT migration_name FROM "_prisma_migrations"
--    WHERE migration_name LIKE '%client_acquisition%';
--
-- ═══════════════════════════════════════════════════════════════════════
