-- CreateTable: ChatSubmission (Chatbot başvuruları)
CREATE TABLE "ChatSubmission" (
    "id" TEXT NOT NULL,
    "leadId" TEXT,
    "slug" TEXT NOT NULL,
    "firmName" TEXT NOT NULL,
    "contactName" TEXT,
    "contactPhone" TEXT,
    "siteType" TEXT,
    "features" JSONB NOT NULL DEFAULT '[]',
    "pageCount" TEXT,
    "contentStatus" TEXT,
    "hostingStatus" TEXT,
    "hostingProvider" TEXT,
    "domainStatus" TEXT,
    "domainName" TEXT,
    "timeline" TEXT,
    "message" TEXT,
    "sector" TEXT,
    "city" TEXT,
    "completedSteps" INTEGER NOT NULL DEFAULT 0,
    "score" TEXT NOT NULL DEFAULT 'cold',
    "calculatedPrice" DOUBLE PRECISION,
    "estimatedHours" DOUBLE PRECISION,
    "tokenCost" DOUBLE PRECISION,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable: PricingConfig (Fiyat ayarları)
CREATE TABLE "PricingConfig" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PricingConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PricingConfig_key_key" ON "PricingConfig"("key");

-- AddForeignKey
ALTER TABLE "ChatSubmission" ADD CONSTRAINT "ChatSubmission_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Seed: Varsayılan fiyat ayarları
-- İşçilik
INSERT INTO "PricingConfig" ("id", "category", "key", "label", "value", "unit", "sortOrder", "updatedAt")
VALUES
  (gen_random_uuid()::text, 'labor', 'labor_daily_rate', 'Günlük Ücret', 10000, 'tl', 1, NOW()),
  (gen_random_uuid()::text, 'labor', 'labor_daily_hours', 'Günlük Çalışma Saati', 8, 'saat', 2, NOW()),

-- Taban süreler (site türüne göre saat)
  (gen_random_uuid()::text, 'base', 'base_tanitim_kucuk', 'Tanıtım Sitesi (1-5 sayfa)', 16, 'saat', 10, NOW()),
  (gen_random_uuid()::text, 'base', 'base_tanitim_orta', 'Tanıtım Sitesi (5-10 sayfa)', 24, 'saat', 11, NOW()),
  (gen_random_uuid()::text, 'base', 'base_tanitim_buyuk', 'Tanıtım Sitesi (10+ sayfa)', 36, 'saat', 12, NOW()),
  (gen_random_uuid()::text, 'base', 'base_katalog', 'Katalog Sitesi', 32, 'saat', 13, NOW()),
  (gen_random_uuid()::text, 'base', 'base_portfoy', 'Portföy Sitesi', 24, 'saat', 14, NOW()),
  (gen_random_uuid()::text, 'base', 'base_randevu', 'Randevu Sistemi', 40, 'saat', 15, NOW()),
  (gen_random_uuid()::text, 'base', 'base_eticaret', 'E-Ticaret Sitesi', 56, 'saat', 16, NOW()),

-- Özellik ekleri (ek saat)
  (gen_random_uuid()::text, 'feature', 'feature_randevu', 'Online Randevu', 6, 'saat', 20, NOW()),
  (gen_random_uuid()::text, 'feature', 'feature_odeme', 'Online Ödeme', 8, 'saat', 21, NOW()),
  (gen_random_uuid()::text, 'feature', 'feature_cokdil', 'Çok Dilli (TR/EN)', 8, 'saat', 22, NOW()),
  (gen_random_uuid()::text, 'feature', 'feature_blog', 'Blog Modülü', 4, 'saat', 23, NOW()),
  (gen_random_uuid()::text, 'feature', 'feature_canlidestek', 'Canlı Destek', 2, 'saat', 24, NOW()),
  (gen_random_uuid()::text, 'feature', 'feature_galeri', 'Fotoğraf Galerisi', 3, 'saat', 25, NOW()),
  (gen_random_uuid()::text, 'feature', 'feature_yorumlar', 'Müşteri Yorumları', 2, 'saat', 26, NOW()),
  (gen_random_uuid()::text, 'feature', 'feature_seo', 'SEO Optimizasyon', 4, 'saat', 27, NOW()),
  (gen_random_uuid()::text, 'feature', 'feature_admin', 'Admin Paneli', 8, 'saat', 28, NOW()),
  (gen_random_uuid()::text, 'feature', 'feature_whatsapp', 'WhatsApp Butonu', 0, 'saat', 29, NOW()),
  (gen_random_uuid()::text, 'feature', 'feature_harita', 'Google Harita', 0, 'saat', 30, NOW()),
  (gen_random_uuid()::text, 'feature', 'feature_sosyalmedya', 'Sosyal Medya Bağlantısı', 0, 'saat', 31, NOW()),

-- İçerik üretimi (TL)
  (gen_random_uuid()::text, 'content', 'content_hazir', 'Her Şey Hazır', 0, 'tl', 40, NOW()),
  (gen_random_uuid()::text, 'content', 'content_logo_var', 'Logo Var, Fotoğraf Lazım', 3000, 'tl', 41, NOW()),
  (gen_random_uuid()::text, 'content', 'content_hicbir_sey', 'Hiçbir Şey Yok (Logo+Foto+Metin)', 6000, 'tl', 42, NOW()),
  (gen_random_uuid()::text, 'content', 'content_mevcut_site', 'Mevcut Siteden Aktar', 1500, 'tl', 43, NOW()),

-- Hosting paketleri (yıllık TL)
  (gen_random_uuid()::text, 'hosting', 'hosting_starter', 'Vorte Starter (1vCPU, 1GB RAM)', 3000, 'tl', 50, NOW()),
  (gen_random_uuid()::text, 'hosting', 'hosting_business', 'Vorte Business (2vCPU, 2GB RAM)', 5000, 'tl', 51, NOW()),
  (gen_random_uuid()::text, 'hosting', 'hosting_pro', 'Vorte Pro (4vCPU, 4GB RAM)', 8000, 'tl', 52, NOW()),
  (gen_random_uuid()::text, 'hosting', 'hosting_musteri', 'Müşterinin Kendi Hostingi', 0, 'tl', 53, NOW()),

-- Aciliyet çarpanları
  (gen_random_uuid()::text, 'urgency', 'urgency_acil', 'Acil (2 hafta)', 1.5, 'carpan', 60, NOW()),
  (gen_random_uuid()::text, 'urgency', 'urgency_1ay', '1 Ay İçinde', 1.2, 'carpan', 61, NOW()),
  (gen_random_uuid()::text, 'urgency', 'urgency_2_3ay', '2-3 Ay İçinde', 1.0, 'carpan', 62, NOW()),
  (gen_random_uuid()::text, 'urgency', 'urgency_esnek', 'Esnek / Acelem Yok', 1.0, 'carpan', 63, NOW()),

-- AI Token maliyeti
  (gen_random_uuid()::text, 'token', 'token_dolar_kuru', 'Dolar Kuru', 33, 'tl', 70, NOW()),
  (gen_random_uuid()::text, 'token', 'token_tanitim', 'Tanıtım Sitesi Token Maliyeti', 500, 'tl', 71, NOW()),
  (gen_random_uuid()::text, 'token', 'token_katalog', 'Katalog Sitesi Token Maliyeti', 1500, 'tl', 72, NOW()),
  (gen_random_uuid()::text, 'token', 'token_portfoy', 'Portföy Sitesi Token Maliyeti', 1000, 'tl', 73, NOW()),
  (gen_random_uuid()::text, 'token', 'token_randevu', 'Randevu Sistemi Token Maliyeti', 1800, 'tl', 74, NOW()),
  (gen_random_uuid()::text, 'token', 'token_eticaret', 'E-Ticaret Sitesi Token Maliyeti', 2500, 'tl', 75, NOW());
