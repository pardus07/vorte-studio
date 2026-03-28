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
export async function createScraperJob(query: string, lang: string = "tr") {
  try {
    const res = await fetch(`${SCRAPER_URL}/api/v1/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: query,
        keywords: [query],
        lang,
        depth: 1,
        max_time: 300,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Scraper API hatası:", res.status, text);
      return { success: false, error: `Scraper hatası: ${res.status}` };
    }

    const data = await res.json();
    return { success: true, jobId: data.id || data.ID || data.job_id };
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
      status: data.Status || data.status,
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

    // CSV parse — tırnakları ve JSON içeren sütunları destekler
    const rows = parseCSV(text);
    if (rows.length <= 1) return { success: true, results: [] };

    const headers = rows[0].map((h) => h.trim().toLowerCase());
    const results: ScraperResult[] = [];

    for (let i = 1; i < rows.length; i++) {
      const row: Record<string, string> = {};
      headers.forEach((h, j) => {
        row[h] = rows[i][j]?.trim() || "";
      });

      results.push({
        title: row.title || row.name || "",
        phone: row.phone || "",
        website: row.website || "",
        address: row.address || row.complete_address || "",
        rating: parseFloat(row.review_rating || row.rating || "0") || 0,
        reviews: parseInt(row.review_count || row.reviews || "0") || 0,
        place_url: row.link || row.place_url || "",
      });
    }

    return { success: true, results };
  } catch (err) {
    console.error("Scraper sonuç hatası:", err);
    return { success: false, error: "Sonuçlar alınamadı." };
  }
}

// CSV parser — tırnak içindeki virgülleri ve JSON'ı doğru işler
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  const lines = text.split("\n");

  for (const line of lines) {
    if (!line.trim()) continue;
    const cells: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === "," && !inQuotes) {
        cells.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
    cells.push(current);
    rows.push(cells);
  }
  return rows;
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
