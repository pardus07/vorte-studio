// Sprint 3.5 — Client-side UTM & referrer yakalama
// Lead kaydı oluşturulurken attribution zincirini korumak için kullanılır.
// SSR güvenli: window yoksa boş obje döner.

export type LeadTrace = {
  sourceDetail?: string | null;
  sourceUrl?: string | null;
  referrer?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
};

/**
 * getLeadTrace — mevcut sayfanın URL/referrer/UTM bilgisini çıkarır.
 * @param sourceDetail Opsiyonel override (ör: "chat:firinlar-ankara")
 */
export function getLeadTrace(sourceDetail?: string): LeadTrace {
  if (typeof window === "undefined") {
    return sourceDetail ? { sourceDetail } : {};
  }

  const loc = window.location;
  const params = new URLSearchParams(loc.search);

  // Uzun query string'i kırp — DB'de 1KB+ URL tutmaya gerek yok.
  const truncate = (s: string | null, n = 500) =>
    s ? (s.length > n ? s.slice(0, n) : s) : null;

  return {
    sourceDetail: sourceDetail || null,
    sourceUrl: truncate(loc.pathname + loc.search),
    referrer: truncate(document.referrer || null),
    utmSource: truncate(params.get("utm_source"), 100),
    utmMedium: truncate(params.get("utm_medium"), 100),
    utmCampaign: truncate(params.get("utm_campaign"), 200),
  };
}
