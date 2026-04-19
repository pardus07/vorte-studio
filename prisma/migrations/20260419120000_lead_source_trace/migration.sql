-- Sprint 3.5 — Lead Source Trace
-- Attribution & ROI ölçümü için kampanya/UTM/referrer izleme.
-- Tümü nullable: geriye dönük uyum bozulmaz.

ALTER TABLE "Lead" ADD COLUMN "sourceDetail" TEXT;
ALTER TABLE "Lead" ADD COLUMN "sourceUrl"    TEXT;
ALTER TABLE "Lead" ADD COLUMN "referrer"     TEXT;
ALTER TABLE "Lead" ADD COLUMN "utmSource"    TEXT;
ALTER TABLE "Lead" ADD COLUMN "utmMedium"    TEXT;
ALTER TABLE "Lead" ADD COLUMN "utmCampaign"  TEXT;
