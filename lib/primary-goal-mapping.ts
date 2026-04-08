/**
 * Birincil Hedef → AI Prompt Alanı Eşleştirmesi
 *
 * Chatbot'ta tek bir soru ("Bu siteyle birincil hedefiniz ne?") soruyoruz
 * ama arka planda iki ayrı alanı (`businessGoals` + `seoExpectations`) dolduruyoruz.
 *
 * Bu sayede:
 * - Kullanıcıya az soru sorulur (form yorgunluğu ↓)
 * - AI prompt'u tam dolar (eksik bilgi uyarısı yok)
 * - Paket önerisi de bu sinyalden faydalanabilir
 *
 * Mapping: lib/prompt-generator.ts içindeki SEO_LABELS sözlüğüyle uyumludur:
 *   - "ilk-sayfa" → temel SEO + Google ilk sayfa
 *   - "yerel-seo" → Google My Business + yerel optimizasyon
 *   - "tam-seo"   → blog stratejisi + içerik pazarlama
 */

export type PrimaryGoal =
  | "satis"          // Online satış / e-ticaret odaklı gelir
  | "lead"           // Lead/teklif toplama (B2B, hizmet işletmeleri)
  | "marka"          // Marka tanınırlığı / prestij (kurumsal)
  | "yerel"          // Yerel müşteri çekmek (mahalle/şehir esnafı)
  | "icerik";        // İçerik / blog / eğitim odaklı

export interface PrimaryGoalMapping {
  /** Kullanıcıya gösterilen buton etiketi (emoji + açıklama) */
  label: string;
  /** ChatSubmission.businessGoals alanına yazılacak doğal dil cümle */
  businessGoals: string;
  /** ChatSubmission.seoExpectations alanına yazılacak SEO seviye anahtarı */
  seoExpectations: "ilk-sayfa" | "yerel-seo" | "tam-seo";
}

export const PRIMARY_GOAL_OPTIONS: Record<PrimaryGoal, PrimaryGoalMapping> = {
  satis: {
    label: "🛒 Ürün / hizmet satmak (online satış)",
    businessGoals:
      "Online satış ve e-ticaret üzerinden gelir üretmek. Ürün/hizmet kataloğunu vitrinleyip ödeme/sipariş akışıyla satışa dönüştürmek.",
    seoExpectations: "tam-seo",
  },
  lead: {
    label: "📞 Müşteri / teklif toplamak",
    businessGoals:
      "Web sitesi üzerinden potansiyel müşteri (lead) ve teklif talebi toplamak. İletişim formu, WhatsApp ve teklif butonlarıyla satış ekibini beslemek.",
    seoExpectations: "ilk-sayfa",
  },
  marka: {
    label: "🏆 Marka prestiji / tanınırlık",
    businessGoals:
      "Kurumsal marka algısını güçlendirmek, profesyonel bir vitrin oluşturmak. Müşteri güveni ve referans için modern, prestijli bir kurumsal kimlik sunmak.",
    seoExpectations: "ilk-sayfa",
  },
  yerel: {
    label: "📍 Yerel müşteri çekmek (şehir/bölge)",
    businessGoals:
      "Bulunduğu şehir/bölgedeki yerel müşterilerin Google'da ararken siteyi bulmasını sağlamak. Harita, telefon ve yol tarifi gibi yerel iletişim kanallarını öne çıkarmak.",
    seoExpectations: "yerel-seo",
  },
  icerik: {
    label: "📚 Bilgi / içerik paylaşmak (blog odaklı)",
    businessGoals:
      "Sektör otoritesi kurmak için düzenli blog ve eğitici içerik yayınlamak. Organik trafikle uzmanlık alanında akılda kalıcı olmak.",
    seoExpectations: "tam-seo",
  },
};

/** Chatbot button listesini üret (UI tarafı) */
export function getPrimaryGoalButtons() {
  return (Object.keys(PRIMARY_GOAL_OPTIONS) as PrimaryGoal[]).map((value) => ({
    value,
    label: PRIMARY_GOAL_OPTIONS[value].label,
  }));
}

/** Seçilen hedeften (businessGoals + seoExpectations) çift değer çıkar */
export function resolvePrimaryGoal(
  goal: string,
): { businessGoals: string; seoExpectations: string } | null {
  const mapping = PRIMARY_GOAL_OPTIONS[goal as PrimaryGoal];
  if (!mapping) return null;
  return {
    businessGoals: mapping.businessGoals,
    seoExpectations: mapping.seoExpectations,
  };
}
