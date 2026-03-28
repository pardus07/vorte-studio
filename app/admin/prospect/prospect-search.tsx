"use client";

import { useState, useEffect } from "react";
import { addRawProspectToLead, getExistingLeadNames, calculateScore, getIssueLabel } from "@/actions/prospect";
import { createScraperJob, checkScraperJob, getScraperResults } from "@/actions/scraper";
import { auditWebsites } from "@/lib/pagespeed";
import { cities, sectors } from "@/lib/turkey-data";

type Prospect = {
  id: string;
  name: string;
  phone: string | null;
  website: string | null;
  address: string | null;
  googleRating: number | null;
  googleReviews: number | null;
  googleMapsUrl: string | null;
  mobileScore: number | null;
  sslValid: boolean;
  hasWebsite: boolean;
  score: number;
  issue: string | null;
  addedToLeads: boolean;
};

const STORAGE_KEY = "vorte_prospect_results";
const STORAGE_QUERY_KEY = "vorte_prospect_query";

function saveToStorage(prospects: Prospect[], query: string) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prospects));
    localStorage.setItem(STORAGE_QUERY_KEY, query);
  } catch { /* storage full or unavailable */ }
}

function loadFromStorage(): { prospects: Prospect[]; query: string } | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const query = localStorage.getItem(STORAGE_QUERY_KEY) || "";
    if (data) return { prospects: JSON.parse(data), query };
  } catch { /* parse error */ }
  return null;
}

function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_QUERY_KEY);
  } catch { /* ignore */ }
}

const filters = ["Tümü", "Sitesi olmayanlar", "Sitesi olanlar"];

function mapsUrl(name: string, address: string | null) {
  const q = encodeURIComponent(`${name} ${address || ""}`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function ScoreBadge({ score }: { score: number }) {
  const grade = score >= 70 ? "A" : score >= 40 ? "B" : "C";
  const colors = {
    A: "bg-admin-green-dim text-admin-green border-admin-green/30",
    B: "bg-admin-amber-dim text-admin-amber border-admin-amber/30",
    C: "bg-admin-bg4 text-admin-muted border-admin-border",
  };
  return (
    <div className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-bold ${colors[grade]}`}>
      {score}
    </div>
  );
}

export default function ProspectSearch({
  initialProspects,
  batchInfo,
}: {
  initialProspects: Prospect[];
  batchInfo: { query: string; totalFound: number };
}) {
  const [city, setCity] = useState("Antalya");
  const [sector, setSector] = useState("Diş Klinikleri");
  const [filter, setFilter] = useState("Tümü");
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const [notification, setNotification] = useState<{ msg: string; type: "info" | "success" | "error" } | null>(null);
  const [existingLeads, setExistingLeads] = useState<Set<string>>(new Set());

  // Sayfa yüklenince localStorage'dan sonuçları geri yükle + lead isimlerini al
  useEffect(() => {
    const saved = loadFromStorage();
    if (saved && saved.prospects.length > 0) {
      setProspects(saved.prospects);
      setQuery(saved.query);
    } else if (initialProspects.length > 0) {
      setProspects(initialProspects);
      setQuery(batchInfo.query);
    }
    getExistingLeadNames().then((names) => setExistingLeads(new Set(names)));
  }, []);

  function showNotification(msg: string, type: "info" | "success" | "error" = "info") {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 5000);
  }

  async function handleSearch() {
    setSearching(true);
    const searchQuery = `${sector} in ${city}`;
    setQuery(searchQuery);

    const job = await createScraperJob(searchQuery);

    if (!job.success || !job.jobId) {
      setSearching(false);
      showNotification(job.error || "Scraper servisine bağlanılamadı.", "error");
      return;
    }

    showNotification("Arama başlatıldı, sonuçlar bekleniyor...", "info");

    let attempts = 0;
    const maxAttempts = 30;
    const pollInterval = 2000;

    const poll = setInterval(async () => {
      attempts++;
      const status = await checkScraperJob(job.jobId!);

      if (!status.success || attempts >= maxAttempts) {
        clearInterval(poll);
        setSearching(false);
        if (attempts >= maxAttempts) {
          showNotification("Arama zaman aşımına uğradı. Daha sonra tekrar deneyin.", "error");
        }
        return;
      }

      if (status.status === "ok" || status.status === "completed" || status.status === "done") {
        clearInterval(poll);
        const results = await getScraperResults(job.jobId!);

        if (results.success && results.results && results.results.length > 0) {
          const leadNames = await getExistingLeadNames();
          const leadSet = new Set(leadNames);
          setExistingLeads(leadSet);

          const rawProspects: Prospect[] = results.results.map((r, i) => ({
            id: `sr-${Date.now()}-${i}`,
            name: r.title,
            phone: r.phone || null,
            website: r.website || null,
            address: r.address || null,
            googleRating: r.rating || null,
            googleReviews: r.reviews || null,
            googleMapsUrl: r.place_url || null,
            mobileScore: null,
            sslValid: true,
            hasWebsite: !!r.website,
            score: r.website ? 10 : 45,
            issue: r.website ? "Analiz ediliyor..." : "Site yok",
            addedToLeads: leadSet.has(r.title),
          }));

          setProspects(rawProspects);
          saveToStorage(rawProspects, searchQuery);
          setSearching(false);

          const withSite = rawProspects.filter((p) => p.website);
          if (withSite.length > 0) {
            showNotification(`${rawProspects.length} işletme bulundu! ${withSite.length} site analiz ediliyor...`, "success");

            const auditResults = await auditWebsites(
              withSite.map((p) => ({ name: p.name, website: p.website! }))
            );

            const scoredProspects = await Promise.all(
              rawProspects.map(async (p) => {
                const audit = auditResults.get(p.name);
                const mobileScore = audit?.mobileScore ?? null;
                const sslValid = audit?.sslValid ?? true;

                const score = await calculateScore({
                  website: p.website,
                  mobileScore,
                  sslValid,
                  reviewsCount: p.googleReviews,
                  phone: p.phone,
                });
                const issue = await getIssueLabel({
                  website: p.website,
                  mobileScore,
                  sslValid,
                });

                return { ...p, mobileScore, sslValid, score, issue };
              })
            );

            scoredProspects.sort((a, b) => b.score - a.score);
            setProspects(scoredProspects);
            saveToStorage(scoredProspects, searchQuery);
            showNotification(`${scoredProspects.length} işletme analiz edildi.`, "success");
          } else {
            showNotification(`${rawProspects.length} işletme bulundu!`, "success");
          }
        } else {
          showNotification("Sonuç bulunamadı.", "info");
          setSearching(false);
        }
      }
    }, pollInterval);
  }

  async function handleAddToLeads(id: string) {
    const prospect = prospects.find((p) => p.id === id);
    if (!prospect) return;

    if (existingLeads.has(prospect.name)) {
      showNotification(`${prospect.name} zaten Soğuk Lead olarak ekli.`, "info");
      setProspects((prev) => prev.map((p) => (p.id === id ? { ...p, addedToLeads: true } : p)));
      return;
    }

    const result = await addRawProspectToLead({
      name: prospect.name, phone: prospect.phone, website: prospect.website,
      address: prospect.address, googleRating: prospect.googleRating,
      googleReviews: prospect.googleReviews, score: prospect.score,
      issue: prospect.issue, hasWebsite: prospect.hasWebsite, mobileScore: prospect.mobileScore,
    });

    if (result.success) {
      setProspects((prev) => prev.map((p) => (p.id === id ? { ...p, addedToLeads: true } : p)));
      setExistingLeads((prev) => new Set([...prev, prospect.name]));
      showNotification(`${prospect.name} Soğuk Lead olarak eklendi.`, "success");
    } else if (result.error === "duplicate") {
      showNotification(result.message || `${prospect.name} zaten ekli.`, "info");
      setProspects((prev) => prev.map((p) => (p.id === id ? { ...p, addedToLeads: true } : p)));
    } else {
      showNotification(result.error || "Eklenemedi.", "error");
    }
  }

  async function handleAddAll() {
    const toAdd = filtered.filter((p) => !p.addedToLeads);
    if (toAdd.length === 0) { showNotification("Eklenecek yeni prospect yok.", "info"); return; }

    let added = 0, skipped = 0;
    for (const prospect of toAdd) {
      if (existingLeads.has(prospect.name)) {
        skipped++;
        setProspects((prev) => prev.map((p) => (p.id === prospect.id ? { ...p, addedToLeads: true } : p)));
        continue;
      }
      const result = await addRawProspectToLead({
        name: prospect.name, phone: prospect.phone, website: prospect.website,
        address: prospect.address, googleRating: prospect.googleRating,
        googleReviews: prospect.googleReviews, score: prospect.score,
        issue: prospect.issue, hasWebsite: prospect.hasWebsite, mobileScore: prospect.mobileScore,
      });
      if (result.success) {
        added++;
        setExistingLeads((prev) => new Set([...prev, prospect.name]));
        setProspects((prev) => prev.map((p) => (p.id === prospect.id ? { ...p, addedToLeads: true } : p)));
      }
    }
    showNotification(skipped > 0 ? `${added} eklendi, ${skipped} zaten mevcut.` : `${added} prospect Soğuk Lead olarak eklendi.`, "success");
  }

  function handleClear() { setProspects([]); setQuery(""); clearStorage(); }

  const filtered = prospects.filter((p) => {
    if (filter === "Sitesi olmayanlar") return !p.hasWebsite;
    if (filter === "Sitesi olanlar") return p.hasWebsite;
    return true;
  });

  const notifColors = {
    info: "border-admin-blue bg-admin-blue-dim text-admin-blue",
    success: "border-admin-green bg-admin-green-dim text-admin-green",
    error: "border-admin-red bg-admin-red-dim text-admin-red",
  };

  return (
    <div className="space-y-4">
      {notification && (
        <div className={`rounded-lg border px-4 py-2.5 text-[12px] font-medium transition-all ${notifColors[notification.type]}`}>{notification.msg}</div>
      )}

      <div className="rounded-xl border border-admin-border bg-admin-bg2 p-4">
        <div className="mb-3 text-[12px] font-medium text-admin-muted">Google Maps&apos;ten işletme ara — gosom/google-maps-scraper</div>
        <div className="flex flex-wrap gap-3">
          <div className="flex-1" style={{ minWidth: 160 }}>
            <label className="mb-1 block text-[11px] font-medium text-admin-muted">Şehir / İlçe</label>
            <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full rounded-lg border border-admin-border bg-admin-bg3 px-3 py-2 text-[12px] text-admin-text focus:border-admin-accent focus:outline-none">
              {cities.map((c) => (<option key={c}>{c}</option>))}
            </select>
          </div>
          <div className="flex-1" style={{ minWidth: 160 }}>
            <label className="mb-1 block text-[11px] font-medium text-admin-muted">Sektör</label>
            <select value={sector} onChange={(e) => setSector(e.target.value)} className="w-full rounded-lg border border-admin-border bg-admin-bg3 px-3 py-2 text-[12px] text-admin-text focus:border-admin-accent focus:outline-none">
              {sectors.map((s) => (<option key={s}>{s}</option>))}
            </select>
          </div>
          <div className="flex-1" style={{ minWidth: 140 }}>
            <label className="mb-1 block text-[11px] font-medium text-admin-muted">Filtre</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full rounded-lg border border-admin-border bg-admin-bg3 px-3 py-2 text-[12px] text-admin-text focus:border-admin-accent focus:outline-none">
              {filters.map((f) => (<option key={f}>{f}</option>))}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button onClick={handleSearch} disabled={searching} className="rounded-lg bg-admin-accent px-5 py-2 text-[12px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50">
              {searching ? "Aranıyor..." : "🔍 Ara"}
            </button>
            {prospects.length > 0 && (
              <button onClick={handleClear} className="rounded-lg border border-admin-border px-4 py-2 text-[12px] font-medium text-admin-muted hover:bg-admin-bg3 hover:text-admin-text transition-colors">Temizle</button>
            )}
          </div>
        </div>
      </div>

      {prospects.length > 0 && (
        <div className="rounded-xl border border-admin-border bg-admin-bg2">
          <div className="flex items-center justify-between border-b border-admin-border px-4 py-3">
            <div className="text-[13px] font-medium">Sonuçlar — {query}</div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-admin-muted">{filtered.length} işletme</span>
              <button onClick={handleAddAll} className="rounded bg-admin-green px-2.5 py-1 text-[10px] font-medium text-white hover:brightness-110 transition-colors">Tümünü Listeye Ekle</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px]">
              <thead>
                <tr className="border-b border-admin-border text-left text-[11px] font-medium text-admin-muted">
                  <th className="px-4 py-2.5">Skor</th><th className="px-4 py-2.5">İşletme</th><th className="px-4 py-2.5">Telefon</th>
                  <th className="px-4 py-2.5">Website</th><th className="px-4 py-2.5">★ Yorum</th><th className="px-4 py-2.5">Sorun</th><th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-admin-bg3">
                    <td className="px-4 py-2.5"><ScoreBadge score={p.score} /></td>
                    <td className="px-4 py-2.5">
                      <a href={p.googleMapsUrl || mapsUrl(p.name, p.address)} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-admin-accent transition-colors">{p.name}</a>
                      <div className="text-[11px] text-admin-muted">📍 {p.address}</div>
                    </td>
                    <td className="px-4 py-2.5" style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11 }}>
                      {p.phone || <span className="text-admin-muted2">—</span>}
                    </td>
                    <td className="px-4 py-2.5">
                      {!p.hasWebsite ? (
                        <span className="rounded-full bg-admin-red-dim px-2 py-0.5 text-[10px] font-medium text-admin-red">Site yok</span>
                      ) : p.mobileScore !== null && p.mobileScore < 50 ? (
                        <span className="rounded-full bg-admin-red-dim px-2 py-0.5 text-[10px] font-medium text-admin-red">Mobil {p.mobileScore}/100</span>
                      ) : p.mobileScore !== null && p.mobileScore < 70 ? (
                        <span className="rounded-full bg-admin-amber-dim px-2 py-0.5 text-[10px] font-medium text-admin-amber">Mobil {p.mobileScore}/100</span>
                      ) : !p.sslValid ? (
                        <span className="rounded-full bg-admin-amber-dim px-2 py-0.5 text-[10px] font-medium text-admin-amber">SSL yok</span>
                      ) : p.mobileScore !== null ? (
                        <span className="rounded-full bg-admin-green-dim px-2 py-0.5 text-[10px] font-medium text-admin-green">Mobil {p.mobileScore}/100</span>
                      ) : p.issue === "Analiz ediliyor..." ? (
                        <span className="rounded-full bg-admin-bg4 px-2 py-0.5 text-[10px] font-medium text-admin-muted">Analiz...</span>
                      ) : (
                        <span className="rounded-full bg-admin-green-dim px-2 py-0.5 text-[10px] font-medium text-admin-green">İyi</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {p.googleRating && (<div><span className="text-admin-amber">★ {p.googleRating}</span><span className="ml-1 text-admin-muted">({p.googleReviews})</span></div>)}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`text-[11px] font-medium ${p.score >= 70 ? "text-admin-green" : p.score >= 40 ? "text-admin-amber" : "text-admin-muted"}`}>{p.issue}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex gap-1.5">
                        {p.phone && (
                          <a href={`https://wa.me/90${p.phone.replace(/\D/g, "").slice(-10)}`} target="_blank" rel="noopener noreferrer" className="rounded bg-admin-green px-2 py-1 text-[10px] font-medium text-white hover:brightness-110 transition-colors">WA</a>
                        )}
                        {p.addedToLeads ? (
                          <span className="rounded bg-admin-bg4 px-2 py-1 text-[10px] text-admin-muted">Eklendi ✓</span>
                        ) : (
                          <button onClick={() => handleAddToLeads(p.id)} className="rounded bg-admin-accent px-2 py-1 text-[10px] font-medium text-white hover:brightness-110 transition-colors">Lead Ekle</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {prospects.length === 0 && !searching && (
        <div className="rounded-xl border border-admin-border bg-admin-bg2 px-6 py-16 text-center">
          <div className="text-[32px] mb-3">🔍</div>
          <div className="text-[13px] font-medium text-admin-text mb-1">Arama yapın</div>
          <div className="text-[12px] text-admin-muted">Şehir ve sektör seçip &quot;Ara&quot; butonuna basın. Google Maps&apos;ten işletmeler listelenecek.</div>
        </div>
      )}
    </div>
  );
}
