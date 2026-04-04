import type { PricingItem } from "@/lib/pricing-constants";

/**
 * Chatbot başvurusundan otomatik fiyat hesaplar.
 *
 * Formül:
 * totalPrice = (baseHours + featureHours) × hourlyRate × urgencyMultiplier + contentCost + hostingCost + tokenCost
 *
 * Tüm değerler PricingConfig tablosundan okunur (admin panelden değiştirilebilir).
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
  totalPrice: number; // TL
  estimatedHours: number;
  tokenCost: number; // TL
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

export function calculatePrice(
  data: SubmissionData,
  configs: PricingItem[]
): PriceResult {
  const breakdown: PriceResult["breakdown"] = [];

  // 1. İşçilik saatlik ücreti
  const hourlyRate = getValue(configs, "labor_hourly_rate") || 1250;

  // 2. Base hours (site türüne göre)
  const baseKey = data.siteType ? `base_${data.siteType}` : "base_tanitim";
  const baseHours = getValue(configs, baseKey) || getValue(configs, "base_tanitim") || 16;
  breakdown.push({ label: "Temel Paket", hours: baseHours, cost: baseHours * hourlyRate });

  // 3. Feature hours (her özellik için ek saat)
  let featureHours = 0;
  for (const feat of data.features) {
    const featKey = `feature_${feat.replace(/-/g, "_")}`;
    const hours = getValue(configs, featKey);
    if (hours > 0) {
      featureHours += hours;
      breakdown.push({ label: feat, hours, cost: hours * hourlyRate });
    }
  }

  // 4. Sayfa sayısı çarpanı
  let pageMultiplier = 1;
  if (data.pageCount === "5-10") pageMultiplier = 1.3;
  else if (data.pageCount === "10+") pageMultiplier = 1.6;
  else if (data.pageCount === "siz-karar-verin") pageMultiplier = 1.2;

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
  const urgencyKey = data.timeline ? `urgency_${data.timeline.replace(/-/g, "_")}` : "urgency_esnek";
  const urgencyMultiplier = getValue(configs, urgencyKey) || 1;

  const laborCost = totalHoursRaw * hourlyRate * urgencyMultiplier;
  if (urgencyMultiplier > 1) {
    breakdown.push({
      label: `Aciliyet çarpanı (${data.timeline})`,
      cost: Math.round(totalHoursRaw * hourlyRate * (urgencyMultiplier - 1)),
    });
  }

  // 6. İçerik üretim maliyeti
  let contentCost = 0;
  if (data.contentStatus) {
    const contentKey = `content_${data.contentStatus.replace(/-/g, "_")}`;
    contentCost = getValue(configs, contentKey);
    if (contentCost > 0) {
      breakdown.push({ label: "İçerik Üretim", cost: contentCost });
    }
  }

  // 7. Hosting maliyeti (yıllık kurulum)
  let hostingCost = 0;
  if (data.hostingStatus === "yok" || data.hostingStatus === "bilmiyor") {
    hostingCost = getValue(configs, "hosting_setup") || 0;
    if (hostingCost > 0) {
      breakdown.push({ label: "Hosting Kurulum", cost: hostingCost });
    }
  }

  // 8. Token maliyeti (AI serbest soru başına)
  const tokenPerQuestion = getValue(configs, "token_per_question") || 0.15;
  const tokenCost = Math.round(data.freeQuestionCount * tokenPerQuestion * 100) / 100;
  if (tokenCost > 0) {
    breakdown.push({ label: `AI Token (${data.freeQuestionCount} soru)`, cost: tokenCost });
  }

  // Toplam
  const totalPrice = Math.round(laborCost + contentCost + hostingCost + tokenCost);
  const estimatedHours = Math.round(totalHoursRaw * urgencyMultiplier * 10) / 10;

  return {
    totalPrice,
    estimatedHours,
    tokenCost,
    breakdown,
  };
}

/**
 * Fiyat aralığı formatla (müşteriye gösterilecek)
 * Min-Max aralığı: -%10 / +%20
 */
export function formatPriceRange(totalPrice: number): string {
  const min = Math.round(totalPrice * 0.9);
  const max = Math.round(totalPrice * 1.2);
  return `${min.toLocaleString("tr-TR")} - ${max.toLocaleString("tr-TR")} TL`;
}

/**
 * Admin'e gösterilecek detaylı fiyat özeti
 */
export function formatPriceBreakdown(result: PriceResult): string {
  const lines = result.breakdown.map((b) => {
    const hoursStr = b.hours ? ` (${b.hours} saat)` : "";
    return `• ${b.label}${hoursStr}: ${b.cost.toLocaleString("tr-TR")} TL`;
  });
  lines.push("─".repeat(30));
  lines.push(`TOPLAM: ${result.totalPrice.toLocaleString("tr-TR")} TL`);
  lines.push(`Tahmini Süre: ${result.estimatedHours} saat`);
  if (result.tokenCost > 0) {
    lines.push(`AI Token Maliyeti: ${result.tokenCost.toLocaleString("tr-TR")} TL`);
  }
  return lines.join("\n");
}
