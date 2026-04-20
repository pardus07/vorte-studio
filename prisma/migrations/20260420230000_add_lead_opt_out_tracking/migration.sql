-- Sprint 3.6d — Lead Opt-Out + Tracking
-- 1) LeadStatus enum'a OPTED_OUT degeri: KVKK m.7 talebinde lead silinmez,
--    status=OPTED_OUT'a gecirilir ve 10 yil saklanir (LeadOptOutLog audit ile).
-- 2) Lead.viewCount: /demo/[slug]?ref=<leadId> her ziyarette atomic increment.
-- 3) LeadOptOutLog tablosu: KVKK m.13 delil tutma. ON DELETE RESTRICT ->
--    log varsa lead silinemez (hukuki delil korumasi).
--
-- Not: IF NOT EXISTS + FK icin DO-block -> idempotent, tekrar calistirilsa bozulmaz.
-- Bu migration production DB'ye SSH ile uygulandi (2026-04-20), _prisma_migrations
-- kaydi elle yazildi (checksum=0000..., out-of-band pattern). Dosya takim referansi
-- ve fresh dev ortamlari icin tutulur.

-- 1) Enum'a yeni deger ekle (psql'de transaction disi blok olarak calistirilir)
ALTER TYPE "LeadStatus" ADD VALUE IF NOT EXISTS 'OPTED_OUT';

-- 2) LeadOptOutLog tablosu
CREATE TABLE IF NOT EXISTS "LeadOptOutLog" (
    "id"         TEXT         NOT NULL,
    "leadId"     TEXT         NOT NULL,
    "firmName"   TEXT         NOT NULL,
    "ip"         TEXT,
    "userAgent"  TEXT,
    "reason"     TEXT,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LeadOptOutLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "LeadOptOutLog_leadId_idx"
    ON "LeadOptOutLog"("leadId");

CREATE INDEX IF NOT EXISTS "LeadOptOutLog_createdAt_idx"
    ON "LeadOptOutLog"("createdAt");

-- 3) Lead tablosuna viewCount kolonu
ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "viewCount" INTEGER NOT NULL DEFAULT 0;

-- 4) FK: leadId -> Lead.id, ON DELETE RESTRICT (KVKK delil koruma)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'LeadOptOutLog_leadId_fkey'
  ) THEN
    ALTER TABLE "LeadOptOutLog"
      ADD CONSTRAINT "LeadOptOutLog_leadId_fkey"
      FOREIGN KEY ("leadId") REFERENCES "Lead"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;
