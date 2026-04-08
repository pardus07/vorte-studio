-- Chatbot başvurusu için paket önerisi alanı (starter/profesyonel/eticaret/kurumsal)
-- package-suggester.ts saf fonksiyonu üretiyor, route handler kaydediyor.
-- Müşteriye fiyat olarak değil, yalnızca paket adı olarak gösteriliyor.
-- Production: SSH ile container'a bağlan ve aşağıyı çalıştır:
--   docker exec -i vorte-postgres psql -U postgres -d vorte < 20260408_add_suggested_package.sql

ALTER TABLE "ChatSubmission"
  ADD COLUMN IF NOT EXISTS "suggestedPackage" TEXT;
