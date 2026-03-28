// Google PageSpeed Insights API — mobil performans + SSL kontrolü

export type PageSpeedResult = {
  mobileScore: number | null;
  sslValid: boolean;
};

export async function auditWebsite(url: string): Promise<PageSpeedResult> {
  const key = process.env.PAGESPEED_API_KEY;
  if (!key) return { mobileScore: null, sslValid: false };

  // URL'yi normalize et
  const fullUrl = url.startsWith("http") ? url : `https://${url}`;

  try {
    const endpoint = new URL(
      "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
    );
    endpoint.searchParams.set("url", fullUrl);
    endpoint.searchParams.set("strategy", "mobile");
    endpoint.searchParams.set("key", key);
    endpoint.searchParams.set("category", "performance");

    const res = await fetch(endpoint.toString(), {
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      console.error(`PageSpeed API hata: ${res.status} — ${url}`);
      return { mobileScore: null, sslValid: false };
    }

    const data = await res.json();

    const mobileScore = Math.round(
      (data.lighthouseResult?.categories?.performance?.score ?? 0) * 100
    );

    // SSL kontrolü — HTTPS ise geçerli say
    const sslValid = fullUrl.startsWith("https://");

    return { mobileScore, sslValid };
  } catch (err) {
    console.error(`PageSpeed audit başarısız: ${url}`, err);
    return { mobileScore: null, sslValid: false };
  }
}

// Paralel audit — max 5 eş zamanlı (rate limit koruması)
export async function auditWebsites(
  websites: { name: string; website: string }[]
): Promise<Map<string, PageSpeedResult>> {
  const results = new Map<string, PageSpeedResult>();
  const BATCH_SIZE = 5;

  for (let i = 0; i < websites.length; i += BATCH_SIZE) {
    const batch = websites.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(async (item) => {
        const result = await auditWebsite(item.website);
        return { name: item.name, result };
      })
    );
    for (const { name, result } of batchResults) {
      results.set(name, result);
    }
  }

  return results;
}
