-- ═══════════════════════════════════════════════════════════════════════
-- FAZ A — Madde 1.5: Email Verification Rate Limit Migration
-- ═══════════════════════════════════════════════════════════════════════
--
-- Tablo: EmailVerificationAttempt
-- Amaç : verifyContractEmail Server Action için DB-backed rate limit
--        (brute force koruması + denetim izi)
--
-- Hedef : Production PostgreSQL
-- Not   : CLAUDE.md kuralı — `prisma migrate deploy` CALISMAZ,
--         bu SQL'i SSH üzerinden doğrudan psql'de çalıştır.
--
-- ───── Çalıştırma (Coolify VPS) ─────
--
--   # 1) Container ID'yi bul (vortestudio PostgreSQL container):
--   docker ps --filter "name=postgres" --format "table {{.ID}}\t{{.Names}}"
--
--   # 2) SQL'i container'a kopyala ve çalıştır:
--   docker cp 2026-04-20-email-verification-attempt.sql \
--     <container-id>:/tmp/mig.sql
--   docker exec -it <container-id> \
--     psql -U postgres -d vortestudio -f /tmp/mig.sql
--
--   # 3) Doğrulama:
--   docker exec -it <container-id> \
--     psql -U postgres -d vortestudio -c "\d \"EmailVerificationAttempt\""
--
-- ───── Özellikler ─────
--
--  • IF NOT EXISTS guard'ları — idempotent, tekrar çalıştırılabilir
--  • BEGIN/COMMIT tek transaction — kısmi başarı olmaz
--  • İki index: (email, attemptedAt) rate limit window + (attemptedAt) cleanup
--  • FK yok — contract silinse bile denetim izi kalır (KVKK m.5/2-f)
--
-- ═══════════════════════════════════════════════════════════════════════

BEGIN;

CREATE TABLE IF NOT EXISTS "EmailVerificationAttempt" (
  "id"          TEXT NOT NULL,
  "email"       TEXT NOT NULL,
  "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "ip"          TEXT,
  "userAgent"   TEXT,
  "success"     BOOLEAN NOT NULL,

  CONSTRAINT "EmailVerificationAttempt_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "EmailVerificationAttempt_email_attemptedAt_idx"
  ON "EmailVerificationAttempt" ("email", "attemptedAt");

CREATE INDEX IF NOT EXISTS "EmailVerificationAttempt_attemptedAt_idx"
  ON "EmailVerificationAttempt" ("attemptedAt");

COMMIT;

-- ───── Doğrulama sorguları ─────
--
-- Tablo şeması kontrolü:
--   \d "EmailVerificationAttempt"
--
-- Index listesi:
--   \di "EmailVerificationAttempt*"
--
-- İlk rate limit logları (canlıda test sonrası):
--   SELECT email, success, "attemptedAt", ip
--     FROM "EmailVerificationAttempt"
--    ORDER BY "attemptedAt" DESC
--    LIMIT 10;
--
-- ═══════════════════════════════════════════════════════════════════════
