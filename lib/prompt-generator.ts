/**
 * Chatbot başvurusundan admin'e yönelik özet ve teklif taslağı oluşturur.
 * AI kullanmaz — deterministic metin üretimi.
 */

import { formatPriceRange } from "@/lib/pricing-calculator";
import type { PricingItem } from "@/lib/pricing-constants";
import { calculatePrice } from "@/lib/pricing-calculator";

// ── Site türü etiketleri ──
const SITE_TYPE_MAP: Record<string, string> = {
  tanitim: "Tanıtım Sitesi",
  "e-ticaret": "E-Ticaret Sitesi",
  portfoy: "Portföy Sitesi",
  randevu: "Randevu Sistemi",
  katalog: "Katalog Sitesi",
  belirsiz: "Henüz belirlenmedi",
};

// ── Timeline etiketleri ──
const TIMELINE_MAP: Record<string, string> = {
  acil: "Acil (2 hafta içinde)",
  "1-ay": "1 ay içinde",
  "2-3-ay": "2-3 ay içinde",
  esnek: "Esnek zamanlama",
};

// ── Özellik etiketleri ──
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
  "fiyat-listesi": "Fiyat / Hizmet Listesi",
  "ekip-tanitim": "Ekip / Kadro Tanıtımı",
  "portfoy-referans": "Proje Portföyü / Referanslar",
  "online-siparis": "Online Sipariş / Paket Servis",
  "teklif-formu": "Teklif İsteme Formu",
  "sss": "SSS (Sıkça Sorulan Sorular)",
  "once-sonra": "Önce / Sonra Galerisi",
  "video-galeri": "Video Galeri",
  "bolge-harita": "Hizmet Bölgeleri Haritası",
  "kampanya": "Kampanya / İndirim Sistemi",
  "rezervasyon": "Rezervasyon Sistemi",
  "e-bulten": "E-Bülten Abonelik",
};

// ── Sayfa sayısı etiketleri ──
const PAGE_COUNT_MAP: Record<string, string> = {
  "1-5": "1-5 sayfa",
  "5-10": "5-10 sayfa",
  "10+": "10+ sayfa",
  "siz-karar-verin": "Siz karar verin",
};

// ── Content status etiketleri ──
const CONTENT_MAP: Record<string, string> = {
  hazir: "İçerik hazır (logo, fotoğraf, metin mevcut)",
  "logo-var": "Logo var, fotoğraf ve metin gerekli",
  "hicbir-sey-yok": "İçerik üretimi tamamen gerekli",
  "mevcut-site": "Mevcut siteden alınabilir",
};

interface SubmissionSummaryInput {
  firmName: string;
  contactName: string | null;
  contactPhone: string | null;
  siteType: string | null;
  features: string[];
  pageCount: string | null;
  contentStatus: string | null;
  hostingStatus: string | null;
  hostingProvider: string | null;
  domainStatus: string | null;
  timeline: string | null;
  message: string | null;
  sector: string | null;
  city: string | null;
  score: string;
  freeQuestions: Array<{ question: string; answer: string }>;
}

/**
 * Admin için kısa özet metni (dashboard kartında görünür)
 */
export function generateShortSummary(data: SubmissionSummaryInput): string {
  const parts: string[] = [];

  parts.push(data.firmName);

  if (data.siteType) {
    parts.push(SITE_TYPE_MAP[data.siteType] || data.siteType);
  }

  if (data.timeline) {
    parts.push(TIMELINE_MAP[data.timeline] || data.timeline);
  }

  if (data.features.length > 0) {
    parts.push(`${data.features.length} özellik`);
  }

  return parts.join(" · ");
}

/**
 * Admin için detaylı teklif taslağı (WhatsApp veya e-posta ile gönderilebilir)
 */
export function generateProposalDraft(
  data: SubmissionSummaryInput,
  pricingConfigs: PricingItem[]
): string {
  // Fiyat hesapla
  const priceResult = calculatePrice(
    {
      siteType: data.siteType,
      features: data.features,
      pageCount: data.pageCount,
      contentStatus: data.contentStatus,
      hostingStatus: data.hostingStatus,
      hostingProvider: data.hostingProvider,
      timeline: data.timeline,
      freeQuestionCount: data.freeQuestions.length,
    },
    pricingConfigs
  );

  const lines: string[] = [];

  lines.push("═══════════════════════════════");
  lines.push(`TEKLİF TASLAĞI — ${data.firmName}`);
  lines.push("═══════════════════════════════");
  lines.push("");

  // İletişim
  if (data.contactName || data.contactPhone) {
    lines.push("📞 İLETİŞİM");
    if (data.contactName) lines.push(`   Kişi: ${data.contactName}`);
    if (data.contactPhone) lines.push(`   Telefon: ${data.contactPhone}`);
    if (data.sector) lines.push(`   Sektör: ${data.sector}`);
    if (data.city) lines.push(`   Şehir: ${data.city}`);
    lines.push("");
  }

  // Proje detayları
  lines.push("📋 PROJE DETAYLARI");
  if (data.siteType) lines.push(`   Tür: ${SITE_TYPE_MAP[data.siteType] || data.siteType}`);
  if (data.pageCount) lines.push(`   Sayfa: ${data.pageCount}`);
  if (data.contentStatus) lines.push(`   İçerik: ${CONTENT_MAP[data.contentStatus] || data.contentStatus}`);
  if (data.hostingStatus) lines.push(`   Hosting: ${data.hostingStatus}`);
  if (data.domainStatus) lines.push(`   Domain: ${data.domainStatus}`);
  if (data.timeline) lines.push(`   Zamanlama: ${TIMELINE_MAP[data.timeline] || data.timeline}`);
  lines.push("");

  // Özellikler
  if (data.features.length > 0) {
    lines.push("🧩 İSTENEN ÖZELLİKLER");
    for (const f of data.features) {
      lines.push(`   ✓ ${FEATURE_LABEL_MAP[f] || f}`);
    }
    lines.push("");
  }

  // Fiyat aralığı
  lines.push("💰 TAHMİNİ FİYAT ARALIĞI");
  lines.push(`   ${formatPriceRange(priceResult.totalPrice)}`);
  lines.push(`   Tahmini süre: ${priceResult.estimatedHours} saat`);
  lines.push("");

  // Kırılım
  lines.push("📊 FİYAT KIRILIMI");
  for (const b of priceResult.breakdown) {
    const hoursStr = b.hours ? ` (${b.hours} saat)` : "";
    lines.push(`   • ${b.label}${hoursStr}: ${b.cost.toLocaleString("tr-TR")} TL`);
  }
  lines.push(`   ───────────────────`);
  lines.push(`   TOPLAM: ${priceResult.totalPrice.toLocaleString("tr-TR")} TL`);
  lines.push("");

  // Ek not
  if (data.message) {
    lines.push("💬 MÜŞTERİ NOTU");
    lines.push(`   "${data.message}"`);
    lines.push("");
  }

  // Serbest sorular
  if (data.freeQuestions.length > 0) {
    lines.push(`❓ SERBEST SORULAR (${data.freeQuestions.length})`);
    for (const fq of data.freeQuestions) {
      lines.push(`   S: ${fq.question}`);
      lines.push(`   C: ${fq.answer}`);
      lines.push("");
    }
  }

  // Lead skoru
  const scoreLabel = data.score === "hot" ? "🔥 SICAK" : data.score === "warm" ? "🟡 ILIK" : "❄️ SOĞUK";
  lines.push(`📈 LEAD SKORU: ${scoreLabel}`);
  lines.push("");
  lines.push("───────────────────────────────");
  lines.push("Bu taslak chatbot başvurusundan otomatik oluşturulmuştur.");
  lines.push("Fiyatlar PricingConfig ayarlarına göre hesaplanmıştır.");

  return lines.join("\n");
}

/**
 * WhatsApp ile müşteriye gönderilecek kısa takip mesajı
 */
export function generateFollowUpMessage(data: {
  contactName: string;
  firmName: string;
  siteType: string | null;
}): string {
  const name = data.contactName || "Sayın Yetkili";
  const siteStr = data.siteType ? SITE_TYPE_MAP[data.siteType] || data.siteType : "web sitesi";

  return `${name}, merhaba!

${data.firmName} için ${siteStr.toLowerCase()} talebinizi aldık.

Teklifiniz 24 saat içinde hazır olacak. Bu sürede sorularınız olursa bize buradan yazabilirsiniz.

Vorte Studio`;
}
