-- Migration: LogoProject brand asset bundle support
-- Date: 2026-04-06
-- Production'da SSH ile manuel calistir:
--   ssh root@188.132.198.81
--   docker exec -i vorte-studio-db psql -U vorte -d vorte_studio < this_file.sql

-- 1. firmSlug: ASCII slug, brand asset klasoru icin (orn. "vorte-tekstil")
ALTER TABLE "LogoProject"
  ADD COLUMN IF NOT EXISTS "firmSlug" TEXT;

-- 2. brandManifestUrl: Post-process sonrasi manifest.json yolu
ALTER TABLE "LogoProject"
  ADD COLUMN IF NOT EXISTS "brandManifestUrl" TEXT;

-- 3. firmSlug unique index (NULL'lar tekrar edebilir, sadece dolu olanlar unique)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'LogoProject_firmSlug_key'
  ) THEN
    CREATE UNIQUE INDEX "LogoProject_firmSlug_key" ON "LogoProject"("firmSlug");
  END IF;
END $$;

-- Verify
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'LogoProject'
  AND column_name IN ('firmSlug', 'brandManifestUrl');
