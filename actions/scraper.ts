"use server";

const SCRAPER_URL = process.env.SCRAPER_URL || "http://localhost:8081";

type ScraperJob = {
  id: string;
  status: string;
};

type ScraperResult = {
  title: string;
  phone: string;
  website: string;
  address: string;
  rating: number;
  reviews: number;
  place_url: string;
};

// Yeni arama işi oluştur
export async function createScraperJob(query: string, language: string = "tr") {
  try {
    const res = await fetch(`${SCRAPER_URL}/api/v1/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        queries: [query],
        language,
        max_depth: 1,
        email_extraction: false,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Scraper API hatası:", res.status, text);
      return { success: false, error: `Scraper hatası: ${res.status}` };
    }

    const data = await res.json();
    return { success: true, jobId: data.id || data.job_id };
  } catch (err) {
    console.error("Scraper bağlantı hatası:", err);
    return {
      success: false,
      error: "Scraper servisine bağlanılamadı. Servisin çalıştığından emin olun.",
    };
  }
}

// İş durumunu kontrol et
export async function checkScraperJob(jobId: string) {
  try {
    const res = await fetch(`${SCRAPER_URL}/api/v1/jobs/${jobId}`);
    if (!res.ok) return { success: false, error: "İş bulunamadı." };

    const data = await res.json();
    return {
      success: true,
      status: data.status,
      totalFound: data.total || 0,
    };
  } catch {
    return { success: false, error: "Scraper bağlantı hatası." };
  }
}

// Sonuçları al
export async function getScraperResults(jobId: string): Promise<{
  success: boolean;
  results?: ScraperResult[];
  error?: string;
}> {
  try {
    const res = await fetch(`${SCRAPER_URL}/api/v1/jobs/${jobId}/download`);
    if (!res.ok) return { success: false, error: "Sonuçlar henüz hazır değil." };

    const text = await res.text();

    // CSV parse — basit satır-tabanlı
    const lines = text.trim().split("\n");
    if (lines.length <= 1) return { success: true, results: [] };

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const results: ScraperResult[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",");
      const row: Record<string, string> = {};
      headers.forEach((h, j) => {
        row[h] = values[j]?.trim() || "";
      });

      results.push({
        title: row.title || row.name || "",
        phone: row.phone || "",
        website: row.website || "",
        address: row.address || row.full_address || "",
        rating: parseFloat(row.rating || row.google_rating || "0") || 0,
        reviews: parseInt(row.reviews || row.reviews_count || "0") || 0,
        place_url: row.place_url || row.google_maps_url || "",
      });
    }

    return { success: true, results };
  } catch (err) {
    console.error("Scraper sonuç hatası:", err);
    return { success: false, error: "Sonuçlar alınamadı." };
  }
}

// Scraper sağlık kontrolü
export async function checkScraperHealth() {
  try {
    const res = await fetch(`${SCRAPER_URL}/api/v1/jobs`, {
      method: "GET",
      signal: AbortSignal.timeout(3000),
    });
    return { available: res.ok };
  } catch {
    return { available: false };
  }
}
