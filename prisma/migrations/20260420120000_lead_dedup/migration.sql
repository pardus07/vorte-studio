-- Sprint 3.6a — Lead Dedup
-- 1) LeadDuplicateLog tablosu: reddedilen duplicate'lerin audit log'u.
-- 2) Lead tablosuna partial unique index'ler: DB-level savunma,
--    kod bypass etse bile aynı googleMapsUrl/phone MAPS_SCRAPER
--    source'unda iki kez girilemez.
--
-- Not: IF NOT EXISTS + FK için DO-block → idempotent,
-- tekrar çalıştırılsa bozulmaz.

CREATE TABLE IF NOT EXISTS "LeadDuplicateLog" (
    "id"                     TEXT         NOT NULL,
    "attemptedName"          TEXT         NOT NULL,
    "attemptedPhone"         TEXT,
    "attemptedGoogleMapsUrl" TEXT,
    "attemptedSector"        TEXT,
    "matchedLeadId"          TEXT         NOT NULL,
    "matchReason"            TEXT         NOT NULL,  -- GOOGLE_MAPS_URL | PHONE | NAME_SECTOR
    "duplicateSource"        TEXT         NOT NULL,  -- MAPS_SCRAPER | MANUAL_ADMIN
    "createdAt"              TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LeadDuplicateLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "LeadDuplicateLog_matchedLeadId_idx"
    ON "LeadDuplicateLog"("matchedLeadId");

CREATE INDEX IF NOT EXISTS "LeadDuplicateLog_createdAt_idx"
    ON "LeadDuplicateLog"("createdAt");

-- FK: matchedLeadId → Lead.id, lead silinirse log da gider
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'LeadDuplicateLog_matchedLeadId_fkey'
  ) THEN
    ALTER TABLE "LeadDuplicateLog"
      ADD CONSTRAINT "LeadDuplicateLog_matchedLeadId_fkey"
      FOREIGN KEY ("matchedLeadId") REFERENCES "Lead"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- Lead tablosunda DB-level uniqueness — sadece MAPS_SCRAPER kaynaklıları
-- kapsar ki SITE_FORM/MANUAL farklı kişilerde aynı telefon olabilir
-- (örn: aile firmaları).
CREATE UNIQUE INDEX IF NOT EXISTS "Lead_googleMapsUrl_scraper_uq"
    ON "Lead"("googleMapsUrl")
    WHERE "source" = 'MAPS_SCRAPER' AND "googleMapsUrl" IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "Lead_phone_scraper_uq"
    ON "Lead"("phone")
    WHERE "source" = 'MAPS_SCRAPER' AND "phone" IS NOT NULL;
