-- 12 yeni özellik için PricingConfig kayıtları
-- Mevcut 0-saat özelliklerin düzeltilmesi

-- 1. Mevcut 0-saat özellikleri düzelt (WhatsApp, Harita, Sosyal Medya)
UPDATE "PricingConfig" SET "value" = 0.5 WHERE "key" = 'feature_whatsapp';
UPDATE "PricingConfig" SET "value" = 0.5 WHERE "key" = 'feature_harita';
UPDATE "PricingConfig" SET "value" = 0.5 WHERE "key" = 'feature_sosyalmedya';

-- 2. Yeni 12 özellik ekle
INSERT INTO "PricingConfig" ("id", "category", "key", "label", "value", "unit", "sortOrder", "updatedAt")
VALUES
  (gen_random_uuid()::text, 'feature', 'feature_fiyat_listesi', 'Fiyat / Hizmet Listesi', 2, 'saat', 32, NOW()),
  (gen_random_uuid()::text, 'feature', 'feature_ekip', 'Ekip / Kadro Tanıtımı', 3, 'saat', 33, NOW()),
  (gen_random_uuid()::text, 'feature', 'feature_portfoy_referans', 'Proje Portföyü / Referanslar', 4, 'saat', 34, NOW()),
  (gen_random_uuid()::text, 'feature', 'feature_siparis', 'Online Sipariş / Paket Servis', 10, 'saat', 35, NOW()),
  (gen_random_uuid()::text, 'feature', 'feature_teklif_formu', 'Teklif İsteme Formu', 2, 'saat', 36, NOW()),
  (gen_random_uuid()::text, 'feature', 'feature_sss', 'SSS (Sıkça Sorulan Sorular)', 1, 'saat', 37, NOW()),
  (gen_random_uuid()::text, 'feature', 'feature_once_sonra', 'Önce / Sonra Galerisi', 3, 'saat', 38, NOW()),
  (gen_random_uuid()::text, 'feature', 'feature_video', 'Video Galeri', 2, 'saat', 39, NOW()),
  (gen_random_uuid()::text, 'feature', 'feature_bolge_harita', 'Hizmet Bölgeleri Haritası', 2, 'saat', 40, NOW()),
  (gen_random_uuid()::text, 'feature', 'feature_kampanya', 'Kampanya / İndirim Sistemi', 4, 'saat', 41, NOW()),
  (gen_random_uuid()::text, 'feature', 'feature_rezervasyon', 'Rezervasyon Sistemi', 8, 'saat', 42, NOW()),
  (gen_random_uuid()::text, 'feature', 'feature_bulten', 'E-Bülten Abonelik', 2, 'saat', 43, NOW());
