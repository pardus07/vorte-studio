/**
 * Chatbot başvurusundan en uygun Vorte Studio paketini önerir.
 *
 * Saf fonksiyon — hem client (chat-form bitiş mesajı) hem server
 * (chat-submit route, DB kaydı) tarafından kullanılır.
 *
 * Fiyat HESAPLAMAZ — sadece hangi paketin uygun olduğunu söyler.
 * Kesin fiyat her zaman görüşmede verilir.
 *
 * Paketler ve anasayfadaki fiyat çıpaları (Pricing.tsx):
 *   - Starter:      9.990 ₺'den başlayarak
 *   - Profesyonel: 24.990 ₺'den başlayarak (En Popüler)
 *   - E-Ticaret:   59.990 ₺'den başlayarak
 *   - Kurumsal:    Projenize özel fiyat
 */

export type PackageSlug = "starter" | "profesyonel" | "eticaret" | "kurumsal";

export interface PackageInfo {
  slug: PackageSlug;
  name: string;
  reason: string;
}

interface SuggestionInput {
  siteType: string | null;
  features: string[];
  pageCount: string | null;
  contentStatus: string | null;
}

// Kurumsal paketin tetiklendiği "enterprise" sinyalleri
const ENTERPRISE_FEATURES = new Set([
  "cok-dilli",
  "canli-destek",
  "rezervasyon",
  "online-odeme",
  "bolge-harita",
]);

// Profesyonel paketi zorunlu kılan "admin/CMS ihtiyacı" sinyalleri
const PROFESSIONAL_FEATURES = new Set([
  "urun-katalogu",
  "blog",
  "ekip-tanitim",
  "portfoy-referans",
  "teklif-formu",
  "kampanya",
  "e-bulten",
]);

export function suggestPackage(data: SuggestionInput): PackageInfo {
  const features = data.features || [];
  const featureCount = features.length;

  // 1) E-Ticaret her zaman ayrı bir paket — en net kural
  if (data.siteType === "eticaret") {
    return {
      slug: "eticaret",
      name: "E-Ticaret",
      reason: "Online satış ve ürün yönetimi gereksinimi",
    };
  }

  // 2) Kurumsal sinyali: 3+ enterprise feature VEYA çok yüksek feature sayısı
  const enterpriseHits = features.filter((f) => ENTERPRISE_FEATURES.has(f)).length;
  if (enterpriseHits >= 3 || featureCount >= 16) {
    return {
      slug: "kurumsal",
      name: "Kurumsal",
      reason: "Çoklu dil, canlı destek ve özel entegrasyon gereksinimleri",
    };
  }

  // 3) Profesyonel sinyali: admin paneli gerektiren özellikler, geniş kapsam,
  //    veya tanıtım dışı site türleri (randevu/portföy/katalog/menu hepsi
  //    yönetim paneli gerektirir)
  const professionalHits = features.filter((f) => PROFESSIONAL_FEATURES.has(f)).length;
  const isLargeScale = data.pageCount === "10+";
  const needsAdminPanel =
    professionalHits >= 2 ||
    featureCount >= 8 ||
    ["randevu", "portfoy", "katalog", "menu"].includes(data.siteType || "");

  if (needsAdminPanel || isLargeScale) {
    return {
      slug: "profesyonel",
      name: "Profesyonel",
      reason: isLargeScale
        ? "Geniş kapsam ve yönetim paneli ihtiyacı"
        : "Admin paneli ve içerik yönetimi gereksinimi",
    };
  }

  // 4) Starter: küçük tanıtım sitesi, az özellik
  if (data.siteType === "tanitim" && data.pageCount === "1-5" && featureCount <= 6) {
    return {
      slug: "starter",
      name: "Starter",
      reason: "Kompakt tanıtım sitesi ihtiyacı",
    };
  }

  // 5) Varsayılan: orta seçenek Profesyonel (güvenli — downgrade değil)
  return {
    slug: "profesyonel",
    name: "Profesyonel",
    reason: "Orta ölçekli proje kapsamı",
  };
}

// Paket adı → anasayfa fiyat çıpası etiketi (UI gösterimi için)
export function getPackagePriceLabel(slug: PackageSlug): string {
  switch (slug) {
    case "starter":
      return "9.990 ₺'den başlayarak";
    case "profesyonel":
      return "24.990 ₺'den başlayarak";
    case "eticaret":
      return "59.990 ₺'den başlayarak";
    case "kurumsal":
      return "Projenize özel fiyatlandırma";
  }
}
