import type { PricingItem } from "@/lib/pricing-constants";

/**
 * Chatbot başvurusundan otomatik fiyat hesaplar.
 *
 * Formül:
 * totalPrice = (baseHours + featureHours) × hourlyRate × urgencyMultiplier + contentCost + tokenCost
 */

interface SubmissionData {
  siteType: string | null;
  features: string[];
  pageCount: string | null;
  contentStatus: string | null;
  hostingStatus: string | null;
  timeline: string | null;
  freeQuestionCount: number;
}

interface PriceResult {
  totalPrice: number;
  estimatedHours: number;
  tokenCost: number;
  breakdown: {
    label: string;
    hours?: number;
    cost: number;
  }[];
}

// Helper: PricingConfig listesinden key ile değer bul
function getValue(configs: PricingItem[], key: string): number {
  const item = configs.find((c) => c.key === key && c.isActive);
  return item?.value ?? 0;
}

// Chatbot feature value → Türkçe label mapping
const FEATURE_LABEL_MAP: Record<string, string> = {
  "online-randevu": "Online Randevu Sistemi",
  "urun-katalogu": "Ürün Kataloğu / Admin Paneli",
  whatsapp: "WhatsApp Entegrasyonu",
  harita: "Google Harita",
  galeri: "Fotoğraf Galerisi",
  blog: "Blog Sistemi",
  yorumlar: "Müşteri Yorumları",
  "sosyal-medya": "Sosyal Medya Entegrasyonu",
  "online-odeme": "Online Ödeme Sistemi",
  "cok-dilli": "Çok Dilli Site",
  "canli-destek": "Canlı Destek",
  seo: "SEO Optimizasyonu",
};

// Chatbot feature value → DB key mapping
const FEATURE_KEY_MAP: Record<string, string> = {
  "online-randevu": "feature_randevu",
  "urun-katalogu": "feature_admin",
  whatsapp: "feature_whatsapp",
  harita: "feature_harita",
  galeri: "feature_galeri",
  blog: "feature_blog",
  yorumlar: "feature_yorumlar",
  "sosyal-medya": "feature_sosyalmedya",
  "online-odeme": "feature_odeme",
  "cok-dilli": "feature_cokdil",
  "canli-destek": "feature_canlidestek",
  seo: "feature_seo",
};

// Site türü → base key mapping
const BASE_KEY_MAP: Record<string, string> = {
  tanitim: "base_tanitim_kucuk",
  "e-ticaret": "base_eticaret",
  portfoy: "base_portfoy",
  randevu: "base_randevu",
  katalog: "base_katalog",
  belirsiz: "base_tanitim_orta",
};

// Content status → DB key mapping
const CONTENT_KEY_MAP: Record<string, string> = {
  hazir: "content_hazir",
  "logo-var": "content_logo_var",
  "hicbir-sey-yok": "content_hicbir_sey",
  "mevcut-site": "content_mevcut_site",
};

// Urgency → DB key mapping
const URGENCY_KEY_MAP: Record<string, string> = {
  acil: "urgency_acil",
  "1-ay": "urgency_1ay",
  "2-3-ay": "urgency_2_3ay",
  esnek: "urgency_esnek",
};

export function calculatePrice(
  data: SubmissionData,
  configs: PricingItem[]
): PriceResult {
  const breakdown: PriceResult["breakdown"] = [];

  // 1. Saatlik ücret: günlük / günlük saat
  const dailyRate = getValue(configs, "labor_daily_rate") || 10000;
  const dailyHours = getValue(configs, "labor_daily_hours") || 8;
  const hourlyRate = dailyRate / dailyHours;

  // 2. Base hours
  const baseKey = data.siteType ? BASE_KEY_MAP[data.siteType] || "base_tanitim_kucuk" : "base_tanitim_kucuk";

  // Sayfa sayısına göre tanıtım sitesi key'ini ayarla
  let finalBaseKey = baseKey;
  if (data.siteType === "tanitim" && data.pageCount) {
    if (data.pageCount === "5-10") finalBaseKey = "base_tanitim_orta";
    else if (data.pageCount === "10+") finalBaseKey = "base_tanitim_buyuk";
  }

  const baseHours = getValue(configs, finalBaseKey) || 3;
  breakdown.push({ label: "Temel Paket", hours: baseHours, cost: baseHours * hourlyRate });

  // 3. Feature hours
  let featureHours = 0;
  for (const feat of data.features) {
    const dbKey = FEATURE_KEY_MAP[feat];
    if (!dbKey) continue;
    const hours = getValue(configs, dbKey);
    if (hours > 0) {
      featureHours += hours;
      breakdown.push({ label: FEATURE_LABEL_MAP[feat] || feat, hours, cost: hours * hourlyRate });
    }
  }

  // 4. Sayfa çarpanı (tanıtım dışı siteler için)
  let pageMultiplier = 1;
  if (data.siteType !== "tanitim") {
    if (data.pageCount === "5-10") pageMultiplier = 1.3;
    else if (data.pageCount === "10+") pageMultiplier = 1.6;
    else if (data.pageCount === "siz-karar-verin") pageMultiplier = 1.2;
  }

  const totalHoursRaw = (baseHours + featureHours) * pageMultiplier;

  if (pageMultiplier > 1) {
    const extraHours = totalHoursRaw - (baseHours + featureHours);
    breakdown.push({
      label: `Sayfa çarpanı (${data.pageCount})`,
      hours: Math.round(extraHours * 10) / 10,
      cost: Math.round(extraHours * hourlyRate),
    });
  }

  // 5. Aciliyet çarpanı
  const urgencyKey = data.timeline ? URGENCY_KEY_MAP[data.timeline] || "urgency_esnek" : "urgency_esnek";
  const urgencyMultiplier = getValue(configs, urgencyKey) || 1;
  const laborCost = totalHoursRaw * hourlyRate * urgencyMultiplier;

  if (urgencyMultiplier > 1) {
    breakdown.push({
      label: `Aciliyet (${data.timeline})`,
      cost: Math.round(totalHoursRaw * hourlyRate * (urgencyMultiplier - 1)),
    });
  }

  // 6. İçerik maliyeti
  let contentCost = 0;
  if (data.contentStatus) {
    const contentKey = CONTENT_KEY_MAP[data.contentStatus];
    if (contentKey) contentCost = getValue(configs, contentKey);
    if (contentCost > 0) {
      breakdown.push({ label: "İçerik Üretim", cost: contentCost });
    }
  }

  // 7. Token maliyeti (site türüne göre sabit)
  let tokenCost = 0;
  if (data.siteType) {
    const tokenKey = `token_${data.siteType === "e-ticaret" ? "eticaret" : data.siteType}`;
    tokenCost = getValue(configs, tokenKey);
    if (tokenCost > 0) {
      breakdown.push({ label: "AI/Claude Token", cost: tokenCost });
    }
  }

  // Toplam
  const totalPrice = Math.round(laborCost + contentCost + tokenCost);
  const estimatedHours = Math.round(totalHoursRaw * 10) / 10;

  return {
    totalPrice,
    estimatedHours,
    tokenCost,
    breakdown,
  };
}

/**
 * Fiyat aralığı: -%10 / +%20
 */
export function formatPriceRange(totalPrice: number): string {
  const min = Math.round(totalPrice * 0.9);
  const max = Math.round(totalPrice * 1.2);
  return `${min.toLocaleString("tr-TR")} - ${max.toLocaleString("tr-TR")} TL`;
}
