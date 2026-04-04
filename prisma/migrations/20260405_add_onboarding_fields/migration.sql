-- AlterTable: ChatSubmission onboarding alanları
ALTER TABLE "ChatSubmission" ADD COLUMN IF NOT EXISTS "businessGoals" TEXT;
ALTER TABLE "ChatSubmission" ADD COLUMN IF NOT EXISTS "targetAudience" TEXT;
ALTER TABLE "ChatSubmission" ADD COLUMN IF NOT EXISTS "referenceUrls" JSONB DEFAULT '[]';
ALTER TABLE "ChatSubmission" ADD COLUMN IF NOT EXISTS "brandColors" TEXT;
ALTER TABLE "ChatSubmission" ADD COLUMN IF NOT EXISTS "seoExpectations" TEXT;
