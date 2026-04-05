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

// ── Claude Code Site Geliştirme Prompt Input ──
interface ClaudeCodePromptInput {
  firmName: string;
  contactName: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  siteType: string | null;
  features: string[];
  pageCount: string | null;
  contentStatus: string | null;
  hostingStatus: string | null;
  hostingProvider: string | null;
  domainStatus: string | null;
  domainName: string | null;
  timeline: string | null;
  message: string | null;
  sector: string | null;
  city: string | null;
  businessGoals: string | null;
  targetAudience: string | null;
  referenceUrls: string[];
  brandColors: string | null;
  seoExpectations: string | null;
  existingSiteUrl: string | null;
  logoStatus: string | null;
  socialMediaLinks: string | null;
  liveSupportType: string | null;
  paymentProvider: string | null;
  freeQuestions: Array<{ question: string; answer: string }>;
}

// ── SEO beklentisi etiketleri ──
const SEO_LABELS: Record<string, string> = {
  "ilk-sayfa": "Google ilk sayfa hedefi — temel SEO optimizasyonu",
  "yerel-seo": "Yerel SEO — Google Harita, yerel arama sonuçları",
  "tam-seo": "Tam SEO paketi — teknik SEO + içerik + backlink stratejisi",
  "bilmiyor": "Müşteri karar veremedi — temel SEO yeterli",
  "gerek-yok": "SEO istemiyor — minimum meta etiketleri yeterli",
};

/**
 * Claude Code prompt için zorunlu alan kontrolü.
 * Eksik alanları döndürür. Boş dizi = prompt oluşturulabilir.
 */
export function checkPromptReadiness(data: ClaudeCodePromptInput): {
  ready: boolean;
  missing: string[];
  completionPercent: number;
} {
  const checks: { field: string; label: string; ok: boolean }[] = [
    { field: "firmName", label: "Firma adı", ok: !!data.firmName },
    { field: "sector", label: "Sektör", ok: !!data.sector },
    { field: "siteType", label: "Site türü", ok: !!data.siteType },
    { field: "features", label: "İstenen özellikler", ok: data.features.length > 0 },
    { field: "businessGoals", label: "İş hedefleri", ok: !!data.businessGoals },
    { field: "targetAudience", label: "Hedef kitle", ok: !!data.targetAudience },
    { field: "brandColors", label: "Marka renkleri / stil", ok: !!data.brandColors },
    { field: "seoExpectations", label: "SEO beklentisi", ok: !!data.seoExpectations },
  ];

  const missing = checks.filter((c) => !c.ok).map((c) => c.label);
  const completed = checks.filter((c) => c.ok).length;

  return {
    ready: missing.length === 0,
    missing,
    completionPercent: Math.round((completed / checks.length) * 100),
  };
}

/**
 * Claude Code için detaylı site geliştirme prompt'u oluşturur.
 * Bu prompt doğrudan Claude Code'a verilecek — site yapısı, tasarım, özellikler içerir.
 */
export function generateClaudeCodePrompt(data: ClaudeCodePromptInput): string {
  const featureList = data.features.map((f) => FEATURE_LABEL_MAP[f] || f);
  const siteTypeLabel = data.siteType ? SITE_TYPE_MAP[data.siteType] || data.siteType : "Web Sitesi";
  const seoLabel = data.seoExpectations ? SEO_LABELS[data.seoExpectations] || data.seoExpectations : "Temel SEO";

  // Sektöre göre önerilen sayfalar
  const sectorPages = generateSectorPages(data.siteType, data.sector, data.features);

  const lines: string[] = [];

  lines.push("╔══════════════════════════════════════════════════════════════╗");
  lines.push("║         VORTE STUDIO — CLAUDE CODE SITE GELİŞTİRME BRİEF'İ        ║");
  lines.push("╚══════════════════════════════════════════════════════════════╝");
  lines.push("");

  // ── Proje Özeti ──
  lines.push("═══ 1. PROJE ÖZETİ ═══");
  lines.push(`Proje: ${data.firmName} — ${siteTypeLabel}`);
  lines.push(`Sektör: ${data.sector || "Belirtilmedi"}`);
  lines.push(`Konum: ${data.city || "Belirtilmedi"}`);
  if (data.domainName) lines.push(`Domain: ${data.domainName}`);
  if (data.timeline) lines.push(`Teslim Süresi: ${TIMELINE_MAP[data.timeline] || data.timeline}`);
  lines.push("");

  // ── İletişim Bilgileri ──
  lines.push("═══ İLETİŞİM BİLGİLERİ ═══");
  if (data.contactName) lines.push(`Kişi: ${data.contactName}`);
  if (data.contactPhone) lines.push(`Telefon: ${data.contactPhone}`);
  if (data.contactEmail) lines.push(`E-posta: ${data.contactEmail}`);
  lines.push("(Bu bilgiler sitenin footer ve iletişim sayfasında kullanılacak)");
  lines.push("");

  // ── Teknik Altyapı ──
  lines.push("═══ 2. TEKNİK ALTYAPI ═══");
  lines.push("Framework: Next.js 16 (App Router) + React 19");
  lines.push("Styling: Tailwind CSS v4 (@theme ile config)");
  lines.push("ORM: Prisma 7.x (PostgreSQL)");
  lines.push("Auth: NextAuth v5 (gerekiyorsa)");
  lines.push("Animasyon: Framer Motion 11");
  lines.push("Deploy: Docker → Coolify (VPS)");
  lines.push(`Hosting: ${data.hostingStatus || "Belirtilmedi"}${data.hostingProvider ? ` (${data.hostingProvider})` : ""}`);
  lines.push(`output: 'standalone' (next.config.ts zorunlu)`);
  lines.push("");

  // ── Tasarım Gereksinimleri ──
  lines.push("═══ 3. TASARIM GEREKSİNİMLERİ ═══");
  if (data.brandColors) {
    lines.push(`Müşteri Stil Tercihi: ${data.brandColors}`);
    lines.push("");
    lines.push("Renk paleti (müşteri tercihine göre oluştur):");
    lines.push(`  - Müşterinin belirttiği renkler ve stil: ${data.brandColors}`);
    lines.push("  - Bu renklere uygun Primary, Secondary, Background, Text ve Accent/CTA renkleri belirle");
    lines.push("  - globals.css @theme bloğunda tanımla");
  } else {
    lines.push("Müşteri renk tercihi belirtmedi — sektöre uygun profesyonel palet seç.");
  }
  lines.push("");

  if (data.referenceUrls.length > 0) {
    lines.push("Referans Siteler (müşterinin beğendiği):");
    for (const url of data.referenceUrls) {
      lines.push(`  → ${url}`);
    }
    lines.push("  Bu sitelerin genel stilini, layout'unu ve UX yaklaşımını incele.");
    lines.push("");
  }

  lines.push("Tipografi:");
  lines.push("  - Display/Başlık: Modern sans-serif (Syne, Inter, Montserrat gibi)");
  lines.push("  - Body: Okunabilir sans-serif (DM Sans, Inter, Geist gibi)");
  lines.push("  - Sektöre uygun font seçimi yap");
  lines.push("");
  lines.push("Genel Stil:");
  lines.push("  - Mobil öncelikli (mobile-first responsive)");
  lines.push("  - Accessibility (WCAG AA minimum)");
  lines.push("  - Smooth scroll + sayfa geçiş animasyonları");
  lines.push("  - Loading state'ler + skeleton UI");
  lines.push("");

  // ── Hedef Kitle & İş Hedefleri ──
  lines.push("═══ 4. HEDEF KİTLE & İŞ HEDEFLERİ ═══");
  if (data.businessGoals) {
    lines.push(`İş Hedefleri: ${data.businessGoals}`);
  }
  if (data.targetAudience) {
    lines.push(`Hedef Kitle: ${data.targetAudience}`);
  }
  lines.push("");
  lines.push("Bu bilgilere göre:");
  lines.push("  - CTA butonlarını hedef kitleye yönelik tasarla");
  lines.push("  - İçerik tonunu sektöre uygun belirle");
  lines.push("  - Dönüşüm odaklı yerleşim kullan");
  lines.push("");

  // ── Sayfa Yapısı ──
  lines.push("═══ 5. SAYFA YAPISI ═══");
  if (data.pageCount) {
    lines.push(`Planlanan Sayfa: ${PAGE_COUNT_MAP[data.pageCount] || data.pageCount}`);
  }
  lines.push("");
  lines.push("Zorunlu Sayfalar:");
  for (const page of sectorPages) {
    lines.push(`  📄 ${page}`);
  }
  lines.push("");

  // ── Özellikler ve Entegrasyonlar ──
  lines.push("═══ 6. ÖZELLİKLER & ENTEGRASYONLAR ═══");
  if (featureList.length > 0) {
    for (const f of featureList) {
      lines.push(`  ✅ ${f}`);
    }
  } else {
    lines.push("  Özellik belirtilmedi — temel tanıtım sitesi yap.");
  }
  lines.push("");

  // Özellik detayları
  if (data.features.includes("urun-katalogu")) {
    lines.push("  📦 Ürün Kataloğu Detay:");
    lines.push("    - Admin panel ile ürün CRUD");
    lines.push("    - Kategori/alt kategori yapısı");
    lines.push("    - Ürün görselleri (çoklu)");
    lines.push("    - Fiyat gösterimi (opsiyonel)");
    lines.push("    - Filtreleme + arama");
    lines.push("");
  }
  if (data.features.includes("online-odeme")) {
    lines.push("  💳 Online Ödeme Detay:");
    lines.push("    - Sepet sistemi");
    lines.push("    - Ödeme entegrasyonu (Iyzico/PayTR)");
    lines.push("    - Sipariş takibi");
    lines.push("    - Fatura oluşturma");
    lines.push("");
  }
  if (data.features.includes("cok-dilli")) {
    lines.push("  🌍 Çok Dilli Site Detay:");
    lines.push("    - next-intl veya custom i18n");
    lines.push("    - Dil seçici (header'da)");
    lines.push("    - SEO-friendly URL yapısı (/en/, /tr/)");
    lines.push("    - Admin panelden çeviri yönetimi");
    lines.push("");
  }
  if (data.features.includes("blog")) {
    lines.push("  📝 Blog Sistemi Detay:");
    lines.push("    - Admin panelden yazı ekleme (rich text editor)");
    lines.push("    - Kategori + etiket sistemi");
    lines.push("    - SEO meta verileri");
    lines.push("    - Sosyal medya paylaşım butonları");
    lines.push("");
  }
  if (data.features.includes("kampanya")) {
    lines.push("  🎯 Kampanya Sistemi Detay:");
    lines.push("    - Başlangıç/bitiş tarihli kampanyalar");
    lines.push("    - İndirim kuponu sistemi");
    lines.push("    - Anasayfada kampanya banner'ı");
    lines.push("    - Admin panelden kampanya yönetimi");
    lines.push("");
  }
  if (data.features.includes("e-bulten")) {
    lines.push("  📧 E-Bülten Detay:");
    lines.push("    - Abone formu (footer veya popup)");
    lines.push("    - Abone listesi yönetimi");
    lines.push("    - KVKK onay checkbox'ı");
    lines.push("");
  }

  // ── SEO ──
  lines.push("═══ 7. SEO GEREKSİNİMLERİ ═══");
  lines.push(`Beklenti: ${seoLabel}`);
  lines.push("");
  lines.push("Minimum SEO checklist:");
  lines.push("  - Her sayfada unique title + meta description");
  lines.push("  - Open Graph + Twitter Card meta'ları");
  lines.push("  - Semantic HTML (h1-h6 hiyerarşisi)");
  lines.push("  - Schema.org yapılandırılmış veri (LocalBusiness / Organization)");
  lines.push("  - sitemap.xml + robots.txt");
  lines.push("  - Resim alt text'leri");
  lines.push("  - Core Web Vitals optimizasyonu");
  if (data.seoExpectations === "yerel-seo") {
    lines.push("  - Google My Business entegrasyonu");
    lines.push("  - Yerel anahtar kelime optimizasyonu");
    lines.push("  - NAP tutarlılığı (İsim, Adres, Telefon)");
  }
  if (data.seoExpectations === "tam-seo") {
    lines.push("  - Blog içerik stratejisi");
    lines.push("  - İç linkleme yapısı");
    lines.push("  - Sayfa hızı optimizasyonu (<3sn LCP)");
    lines.push("  - Canonical URL'ler");
    lines.push("  - Hreflang (çok dilli ise)");
  }
  lines.push("");

  // ── İçerik Durumu ──
  lines.push("═══ 8. İÇERİK DURUMU ═══");
  lines.push(`Durum: ${data.contentStatus ? CONTENT_MAP[data.contentStatus] || data.contentStatus : "Belirtilmedi"}`);
  lines.push("");
  if (data.contentStatus === "hicbir-sey-yok") {
    lines.push("⚠️ İçerik tamamen üretilecek:");
    lines.push("  - Placeholder metin kullan, müşteriden içerik gelecek");
    lines.push("  - Görsel alanları belirle, stok görsel kullan");
    lines.push("  - Logo alanı için placeholder bırak");
  } else if (data.contentStatus === "mevcut-site") {
    lines.push("📋 Mevcut siteden içerik alınacak:");
    if (data.existingSiteUrl) {
      lines.push(`  - Mevcut site: ${data.existingSiteUrl}`);
    }
    lines.push("  - Mevcut siteyi incele, içerikleri taşı");
    lines.push("  - Görsel kalitesini kontrol et, düşükse placeholder kullan");
  }
  lines.push("");

  // ── Logo Durumu ──
  if (data.logoStatus) {
    lines.push("═══ LOGO DURUMU ═══");
    if (data.logoStatus === "var") {
      lines.push("✅ Müşterinin logosu mevcut — müşteriden alınacak");
    } else if (data.logoStatus === "yok") {
      lines.push("🎨 Logo YOK — AI ile üretilecek (Gemini)");
      lines.push("  - Site yapılırken logo alanına placeholder koy");
      lines.push("  - Logo üretildikten sonra entegre edilecek");
    } else if (data.logoStatus === "tasarimci") {
      lines.push("👨‍🎨 Müşteri tasarımcıya yaptıracak — placeholder bırak");
    }
    lines.push("");
  }

  // ── Sosyal Medya ──
  if (data.socialMediaLinks) {
    lines.push("═══ SOSYAL MEDYA HESAPLARI ═══");
    lines.push(data.socialMediaLinks);
    lines.push("  - Bu hesapları header/footer'daki sosyal medya ikonlarına bağla");
    lines.push("");
  }

  // ── Canlı Destek ──
  if (data.liveSupportType) {
    lines.push("═══ CANLI DESTEK ═══");
    const lsLabels: Record<string, string> = {
      whatsapp: "WhatsApp — floating button + chat widget",
      tawkto: "Tawk.to — ücretsiz canlı destek widget'ı entegre et",
      crisp: "Crisp — canlı destek widget'ı entegre et",
      kararsiz: "Karar verilmedi — WhatsApp floating button ile başla",
    };
    lines.push(`Tercih: ${lsLabels[data.liveSupportType] || data.liveSupportType}`);
    lines.push("");
  }

  // ── Ödeme Altyapısı ──
  if (data.paymentProvider) {
    lines.push("═══ ÖDEME ALTYAPISI ═══");
    const ppLabels: Record<string, string> = {
      iyzico: "Iyzico — API entegrasyonu",
      paytr: "PayTR — API entegrasyonu",
      baska: "Farklı sağlayıcı — müşteriden detay alınacak",
      kararsiz: "Karar verilmedi — Iyzico varsayılan olarak hazırla",
    };
    lines.push(`Tercih: ${ppLabels[data.paymentProvider] || data.paymentProvider}`);
    lines.push("");
  }

  // ── Müşteri Notları ──
  if (data.message) {
    lines.push("═══ 9. MÜŞTERİ EK NOTLARI ═══");
    lines.push(data.message);
    lines.push("");
  }

  // ── Serbest Sorular ──
  if (data.freeQuestions.length > 0) {
    lines.push(`═══${data.message ? " 10" : " 9"}. MÜŞTERİ SORU-CEVAP ═══`);
    for (const fq of data.freeQuestions) {
      lines.push(`  S: ${fq.question}`);
      lines.push(`  C: ${fq.answer}`);
      lines.push("");
    }
  }

  // CTA metni sektöre göre belirle
  const ctaText = getCTAText(data.siteType);

  // ── Son Notlar ──
  lines.push("═══ ÖNEMLİ KURALLAR ═══");
  lines.push("1. Tüm UI metinleri Türkçe olacak (ş, ç, ö, ü, ğ, ı, İ doğru kullanılmalı)");
  lines.push("2. Slug ve dosya adlarında Türkçe karakter YASAK (sadece a-z, 0-9, tire)");
  lines.push(`3. Ana CTA buton metni: "${ctaText}"`);
  lines.push("4. WhatsApp floating button zorunlu");
  lines.push("5. KVKK uyumlu çerez bildirimi + gizlilik politikası sayfası");
  lines.push("6. Responsive: mobil, tablet, desktop");
  lines.push("7. Performans: Lighthouse 90+ hedefi");
  lines.push("");
  lines.push("──────────────────────────────────────────────────────");
  lines.push(`Bu brief ${new Date().toLocaleDateString("tr-TR")} tarihinde Vorte Studio tarafından oluşturulmuştur.`);
  lines.push(`Müşteri: ${data.firmName} | İletişim: ${data.contactName || "-"} | ${data.contactEmail || "-"}`);

  return lines.join("\n");
}

/**
 * Site türüne göre CTA buton metni belirler
 */
function getCTAText(siteType: string | null): string {
  switch (siteType) {
    case "e-ticaret": return "Sipariş Ver";
    case "randevu": return "Randevu Al";
    case "katalog": return "Fiyat İste";
    case "portfoy": return "Proje Teklifi Al";
    default: return "İletişime Geç";
  }
}

/**
 * Sektör ve site türüne göre önerilen sayfa listesi oluşturur
 */
function generateSectorPages(
  siteType: string | null,
  sector: string | null,
  features: string[]
): string[] {
  const pages: string[] = [];

  // Tüm sitelerde ortak
  pages.push("Ana Sayfa (hero + hizmetler/ürünler + referanslar + CTA)");
  pages.push("Hakkımızda / Kurumsal");
  pages.push("İletişim (form + harita + WhatsApp)");

  // Site türüne göre
  if (siteType === "e-ticaret") {
    pages.push("Ürünler / Mağaza (kategori + liste + detay)");
    pages.push("Sepet + Ödeme sayfası");
    pages.push("Hesabım (sipariş takibi)");
  }
  if (siteType === "katalog") {
    pages.push("Ürün Kataloğu (kategori + detay)");
  }
  if (siteType === "randevu") {
    pages.push("Randevu Al sayfası");
  }

  // Özellik bazlı sayfalar
  if (features.includes("blog")) pages.push("Blog (liste + detay)");
  if (features.includes("galeri") || features.includes("video-galeri")) pages.push("Galeri / Portfolyo");
  if (features.includes("fiyat-listesi")) pages.push("Fiyat / Hizmet Listesi");
  if (features.includes("sss")) pages.push("Sıkça Sorulan Sorular (SSS)");
  if (features.includes("ekip-tanitim")) pages.push("Ekibimiz");
  if (features.includes("portfoy-referans")) pages.push("Referanslar / Projelerimiz");
  if (features.includes("once-sonra")) pages.push("Önce / Sonra Galerisi");
  if (features.includes("bolge-harita")) pages.push("Hizmet Bölgeleri");
  if (features.includes("kampanya")) pages.push("Kampanyalar / İndirimler");
  if (features.includes("e-bulten")) pages.push("— Footer'da e-bülten abonelik formu —");

  // Zorunlu yasal sayfalar
  pages.push("Gizlilik Politikası");
  pages.push("KVKK Aydınlatma Metni");

  return pages;
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
