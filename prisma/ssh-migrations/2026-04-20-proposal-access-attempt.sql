-- ═══════════════════════════════════════════════════════════════════════
-- FAZ B — Madde 2.4: Proposal Access Attempt (IDOR koruması audit izi)
-- + FAZ A retroaktif _prisma_migrations düzeltmesi
-- ═══════════════════════════════════════════════════════════════════════
--
-- Tablo    : ProposalAccessAttempt
-- Amaç     : /teklif/{token} erişim doğrulama denemelerinin DB-backed logu
--            (phone son 4 / email tam / disabled bypass — hepsi kaydedilir)
--
-- Retroaktif: FAZ A'nın EmailVerificationAttempt migration kaydı atlanmıştı
--             (2026-04-20 SSH SQL'inde INSERT yoktu). DB canlı kontrolünde
--             _prisma_migrations'ta YOK ama tablo VAR. Bu migration hem
--             FAZ B yeni kaydı hem FAZ A retroaktif kaydı atar.
--
-- Pattern  : Sprint 3.6d standardı — checksum=0000 out-of-band (drift bypass)
-- Hedef    : Production PostgreSQL (vortestudio DB, fo0wsks800084gsockckos8k)
-- Not      : `prisma migrate deploy` CALISMAZ — SSH üzerinden psql.
--
-- ───── Çalıştırma (Coolify VPS) ─────
--
--   docker cp 2026-04-20-proposal-access-attempt.sql \
--     fo0wsks800084gsockckos8k:/tmp/mig.sql
--   docker exec -it fo0wsks800084gsockckos8k \
--     psql -U vorte -d vortestudio -f /tmp/mig.sql
--
-- ───── Özellikler ─────
--
--  • IF NOT EXISTS + WHERE NOT EXISTS guard'ları — idempotent
--  • BEGIN/COMMIT tek transaction — kısmi başarı olmaz
--  • FK yok — proposal silinse bile audit izi kalır (KVKK m.5/2-f)
--  • PII minimum: ham input değeri saklanmaz, sadece matched bool
--  • İki migration kaydı aynı transaction'da atılır — atomicity garanti
--
-- ═══════════════════════════════════════════════════════════════════════

BEGIN;

-- ── 1) ProposalAccessAttempt tablosu ──
CREATE TABLE IF NOT EXISTS "ProposalAccessAttempt" (
  "id"          TEXT NOT NULL,
  "proposalId"  TEXT NOT NULL,
  "kind"        TEXT NOT NULL,           -- 'phone' | 'email' | 'disabled'
  "matched"     BOOLEAN NOT NULL,
  "ip"          TEXT,
  "userAgent"   TEXT,
  "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ProposalAccessAttempt_pkey" PRIMARY KEY ("id")
);

-- ── 2) Indexler (rate limit sorguları + cleanup job) ──
CREATE INDEX IF NOT EXISTS "ProposalAccessAttempt_proposalId_attemptedAt_idx"
  ON "ProposalAccessAttempt" ("proposalId", "attemptedAt");

CREATE INDEX IF NOT EXISTS "ProposalAccessAttempt_attemptedAt_idx"
  ON "ProposalAccessAttempt" ("attemptedAt");

-- ── 3) Prisma migration kaydı: FAZ A RETROAKTİF ──
-- FAZ A (2026-04-20) SSH SQL'inde bu INSERT atlanmıştı. Tablo canlıda var
-- ama Prisma migrations'ta kayıt yok → drift. Geriye dönük düzeltme.
-- Timestamp UTC — redeploy bitiş zamanı (16:06:22 UTC) referans alındı.
INSERT INTO "_prisma_migrations" (
  id, checksum, finished_at, migration_name, logs, rolled_back_at,
  started_at, applied_steps_count
)
SELECT
  gen_random_uuid()::text,
  '0000000000000000000000000000000000000000000000000000000000000000',
  NOW(),
  '20260420160622_add_email_verification_attempt',
  NULL,
  NULL,
  NOW(),
  1
WHERE NOT EXISTS (
  SELECT 1 FROM "_prisma_migrations"
  WHERE migration_name = '20260420160622_add_email_verification_attempt'
);

-- ── 4) Prisma migration kaydı: FAZ B YENİ ──
INSERT INTO "_prisma_migrations" (
  id, checksum, finished_at, migration_name, logs, rolled_back_at,
  started_at, applied_steps_count
)
SELECT
  gen_random_uuid()::text,
  '0000000000000000000000000000000000000000000000000000000000000000',
  NOW(),
  '20260420205229_add_proposal_access_attempt',
  NULL,
  NULL,
  NOW(),
  1
WHERE NOT EXISTS (
  SELECT 1 FROM "_prisma_migrations"
  WHERE migration_name = '20260420205229_add_proposal_access_attempt'
);

COMMIT;

-- ───── Doğrulama sorguları (COMMIT sonrası manuel çalıştır) ─────
--
-- Tablo şeması (beklenen 7 kolon):
--   \d "ProposalAccessAttempt"
--
-- Index listesi (beklenen 3 satır: pkey + 2 index):
--   SELECT indexname FROM pg_indexes
--    WHERE tablename = 'ProposalAccessAttempt';
--
-- Satır sayısı (beklenen 0):
--   SELECT COUNT(*) FROM "ProposalAccessAttempt";
--
-- Migration kayıtları (beklenen 2 satır — FAZ A retroaktif + FAZ B yeni):
--   SELECT migration_name, applied_steps_count
--     FROM "_prisma_migrations"
--    WHERE migration_name LIKE '%verification_attempt'
--       OR migration_name LIKE '%proposal_access%'
--    ORDER BY started_at DESC;
--
-- ═══════════════════════════════════════════════════════════════════════
