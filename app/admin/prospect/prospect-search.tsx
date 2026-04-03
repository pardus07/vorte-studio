"use client";

import { useState, useEffect } from "react";
import { addRawProspectToLead, getExistingLeadNames, auditSingleWebsite, resolveGoogleMapsLink, addManualLead } from "@/actions/prospect";
import { createScraperJob, checkScraperJob, getScraperResults } from "@/actions/scraper";
import { isGSM, formatWANumber } from "@/lib/phone-utils";
import { cities, sectors, getDistricts, type District } from "@/lib/turkey-data";

type Prospect = {
  id: string; name: string; phone: string | null; website: string | null;
  address: string | null; googleRating: number | null; googleReviews: number | null;
  googleMapsUrl: string | null; mobileScore: number | null; sslValid: boolean;
  hasWebsite: boolean; score: number; issue: string | null; addedToLeads: boolean;
};

const filters = ["Tümü", "Sitesi olmayanlar", "Sitesi olanlar"];

function mapsUrl(name: string, address: string | null) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${address || ""}`)}`;
}

function calcScore(item: { website?: string | null; mobileScore?: number | null; sslValid?: boolean; reviewsCount?: number | null; phone?: string | null }): number {
  let score = 0;
  if (!item.website) score += 40;
  if (item.mobileScore !== null && item.mobileScore !== undefined) {
    if (item.mobileScore < 50) score += 25;
    else if (item.mobileScore < 70) score += 15;
  }
  if (item.sslValid === false) score += 15;
  if (item.reviewsCount && item.reviewsCount >= 50) score += 10;
  if (item.phone) score += 5;
  return Math.min(score, 100);
}

function calcIssue(item: { website?: string | null; mobileScore?: number | null; sslValid?: boolean }): string {
  if (!item.website) return "Site yok";
  if (item.mobileScore !== null && item.mobileScore !== undefined) {
    if (item.mobileScore < 50) return `Mobil ${item.mobileScore}/100`;
    if (item.mobileScore < 70) return `Yavaş site (${item.mobileScore}/100)`;
  }
  if (item.sslValid === false) return "SSL yok";
  return "Düşük öncelik";
}

function ScoreBadge({ score }: { score: number }) {
  const grade = score >= 70 ? "A" : score >= 40 ? "B" : "C";
  const colors = {
    A: "bg-admin-green-dim text-admin-green border-admin-green/30",
    B: "bg-admin-amber-dim text-admin-amber border-admin-amber/30",
    C: "bg-admin-bg4 text-admin-muted border-admin-border",
  };
  return <div className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-bold ${colors[grade]}`}>{score}</div>;
}

const STORAGE_KEY = "vorte_prospect_results";
const STORAGE_QUERY_KEY = "vorte_prospect_query";
function saveToStorage(prospects: Prospect[], query: string) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prospects)); localStorage.setItem(STORAGE_QUERY_KEY, query); } catch {} }
function loadFromStorage(): { prospects: Prospect[]; query: string } | null { try { const d = localStorage.getItem(STORAGE_KEY); const q = localStorage.getItem(STORAGE_QUERY_KEY) || ""; if (d) return { prospects: JSON.parse(d), query: q }; } catch {} return null; }
function clearStorage() { try { localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(STORAGE_QUERY_KEY); } catch {} }

export default function ProspectSearch({
  initialProspects, batchInfo,
}: {
  initialProspects: Prospect[];
  batchInfo: { query: string; totalFound: number };
}) {
  const [city, setCity] = useState("Antalya");
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<Record<string, boolean>>({});
  const [neighborhoodSearch, setNeighborhoodSearch] = useState("");
  const [sector, setSector] = useState("Fırınlar");
  const [filter, setFilter] = useState("Tümü");
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const [progress, setProgress] = useState({ current: 0, total: 0, currentName: "" });
  const [notification, setNotification] = useState<{ msg: string; type: "info" | "success" | "error" } | null>(null);
  const [existingLeads, setExistingLeads] = useState<Set<string>>(new Set());
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  // ── Hızlı Arama (Link veya İsim) ──
  const [quickSearch, setQuickSearch] = useState("");
  const [quickSearching, setQuickSearching] = useState(false);
  const [quickResult, setQuickResult] = useState<Prospect | null>(null);

  async function handleQuickSearch() {
    if (!quickSearch.trim()) return;
    setQuickSearching(true);
    setQuickResult(null);

    // 1. Link veya isim çözümle
    const resolved = await resolveGoogleMapsLink(quickSearch.trim());
    if (!resolved.success || !resolved.query) {
      showNotif(resolved.error || "Arama başarısız.", "error");
      setQuickSearching(false);
      return;
    }

    // 2. Scraper'a gönder
    const job = await createScraperJob(resolved.query);
    if (!job.success || !job.jobId) {
      showNotif(job.error || "Scraper hatası.", "error");
      setQuickSearching(false);
      return;
    }

    // 3. Polling — sonuç bekle
    let done = false;
    let attempts = 0;
    while (!done && attempts < 30) {
      attempts++;
      await new Promise((r) => setTimeout(r, 2000));
      const status = await checkScraperJob(job.jobId!);
      if (!status.success) break;
      if (status.status === "ok" || status.status === "completed" || status.status === "done") {
        done = true;
        const results = await getScraperResults(job.jobId!);
        if (results.success && results.results && results.results.length > 0) {
          // En iyi eşleşmeyi bul (isim benzerliği veya ilk sonuç)
          const queryLower = resolved.query.toLowerCase();
          const best = results.results.find(
            (r) => r.title.toLowerCase().includes(queryLower) || queryLower.includes(r.title.toLowerCase().split("|")[0].trim())
          ) || results.results[0];

          const score = calcScore({ website: best.website || null, reviewsCount: best.reviews, phone: best.phone || null });
          const issue = calcIssue({ website: best.website || null });

          setQuickResult({
            id: `quick-${Date.now()}`,
            name: best.title,
            phone: best.phone || null,
            website: best.website || null,
            address: best.address || null,
            googleRating: best.rating || null,
            googleReviews: best.reviews || null,
            googleMapsUrl: best.place_url || null,
            mobileScore: null,
            sslValid: true,
            hasWebsite: !!best.website,
            score,
            issue,
            addedToLeads: existingLeads.has(best.title),
          });
          showNotif(`"${best.title}" bulundu!`, "success");
        } else {
          showNotif("Sonuç bulunamadı. Farklı bir isim veya link deneyin.", "info");
        }
      }
    }

    if (!done) {
      showNotif("Arama zaman aşımına uğradı.", "error");
    }

    setQuickSearching(false);
  }

  async function handleQuickAddToLead() {
    if (!quickResult) return;
    const result = await addManualLead({
      name: quickResult.name,
      phone: quickResult.phone,
      website: quickResult.website,
      address: quickResult.address,
      googleRating: quickResult.googleRating,
      googleReviews: quickResult.googleReviews,
      googleMapsUrl: quickResult.googleMapsUrl,
    });
    if (result.success) {
      setQuickResult((prev) => prev ? { ...prev, addedToLeads: true } : null);
      setExistingLeads((prev) => new Set([...prev, quickResult.name]));
      showNotif(`${quickResult.name} Soğuk Lead olarak eklendi!`, "success");
    } else if (result.error === "duplicate") {
      setQuickResult((prev) => prev ? { ...prev, addedToLeads: true } : null);
      showNotif(result.message || "Bu firma zaten ekli.", "info");
    } else {
      showNotif(result.error || "Eklenemedi.", "error");
    }
  }

  // localStorage'dan yükle
  useEffect(() => {
    const saved = loadFromStorage();
    if (saved && saved.prospects.length > 0) { setProspects(saved.prospects); setQuery(saved.query); }
    else if (initialProspects.length > 0) { setProspects(initialProspects); setQuery(batchInfo.query); }
    getExistingLeadNames().then((names) => setExistingLeads(new Set(names)));
  }, []);

  // İl değişince ilçeleri yükle
  useEffect(() => {
    setLoadingDistricts(true);
    setSelectedDistrict("");
    setSelectedNeighborhoods({});
    getDistricts(city).then((d) => { setDistricts(d); setLoadingDistricts(false); if (d.length > 0) setSelectedDistrict(d[0].name); });
  }, [city]);

  function showNotif(msg: string, type: "info" | "success" | "error" = "info") {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 5000);
  }

  const currentDistrict = districts.find((d) => d.name === selectedDistrict);
  const filteredNeighborhoods = (currentDistrict?.neighborhoods || []).filter((n) =>
    !neighborhoodSearch || n.toLowerCase().includes(neighborhoodSearch.toLowerCase())
  );
  const selectedCount = Object.values(selectedNeighborhoods).filter(Boolean).length;

  function toggleAllNeighborhoods(checked: boolean) {
    const newState: Record<string, boolean> = {};
    filteredNeighborhoods.forEach((n) => { newState[n] = checked; });
    setSelectedNeighborhoods(checked ? { ...selectedNeighborhoods, ...newState } : {});
  }

  // ── ANA ARAMA FONKSİYONU ──
  async function handleSearch() {
    const neighborhoods = Object.entries(selectedNeighborhoods).filter(([, v]) => v).map(([k]) => k);

    // Mahalle seçilmemişse sadece ilçe bazında ara
    const queries: string[] = [];
    if (neighborhoods.length > 0) {
      neighborhoods.forEach((n) => { queries.push(`${sector} in ${city} ${selectedDistrict} ${n}`); });
    } else {
      queries.push(`${sector} in ${city}${selectedDistrict ? ` ${selectedDistrict}` : ""}`);
    }

    setSearching(true);
    setQuery(`${sector} in ${city} ${selectedDistrict}`);
    setProgress({ current: 0, total: queries.length, currentName: "" });

    const allResults: Prospect[] = [];
    const seenNames = new Set<string>();
    const leadNames = await getExistingLeadNames();
    const leadSet = new Set(leadNames);
    setExistingLeads(leadSet);

    for (let i = 0; i < queries.length; i++) {
      const q = queries[i];
      setProgress({ current: i + 1, total: queries.length, currentName: q.split(" in ")[1] || q });

      const job = await createScraperJob(q);
      if (!job.success || !job.jobId) {
        showNotif(job.error || "Scraper hatası.", "error");
        continue;
      }

      // Polling
      let done = false;
      let attempts = 0;
      while (!done && attempts < 30) {
        attempts++;
        await new Promise((r) => setTimeout(r, 2000));
        const status = await checkScraperJob(job.jobId!);
        if (!status.success) break;
        if (status.status === "ok" || status.status === "completed" || status.status === "done") {
          done = true;
          const results = await getScraperResults(job.jobId!);
          if (results.success && results.results) {
            for (const r of results.results) {
              // Duplikat eleme (isim + telefon)
              const key = `${r.title}|${r.phone}`;
              if (seenNames.has(key)) continue;
              seenNames.add(key);

              const score = calcScore({ website: r.website || null, reviewsCount: r.reviews, phone: r.phone || null });
              const issue = calcIssue({ website: r.website || null });

              allResults.push({
                id: `sr-${Date.now()}-${allResults.length}`,
                name: r.title, phone: r.phone || null, website: r.website || null,
                address: r.address || null, googleRating: r.rating || null,
                googleReviews: r.reviews || null, googleMapsUrl: r.place_url || null,
                mobileScore: null, sslValid: true, hasWebsite: !!r.website,
                score, issue, addedToLeads: leadSet.has(r.title),
              });
            }
          }
        }
      }

      // Her mahalle sonrası sonuçları göster
      const sorted = [...allResults].sort((a, b) => b.score - a.score);
      setProspects(sorted);
      saveToStorage(sorted, `${sector} in ${city} ${selectedDistrict}`);
    }

    setSearching(false);
    setProgress({ current: 0, total: 0, currentName: "" });
    showNotif(`${allResults.length} işletme bulundu!`, "success");

    // PageSpeed audit (arka planda)
    const withSite = allResults.filter((p) => p.website);
    for (const prospect of withSite) {
      auditSingleWebsite(prospect.website!).then((audit) => {
        const mobileScore = audit.mobileScore;
        const sslValid = audit.sslValid;
        const score = calcScore({ website: prospect.website, mobileScore, sslValid, reviewsCount: prospect.googleReviews, phone: prospect.phone });
        const issue = calcIssue({ website: prospect.website, mobileScore, sslValid });
        setProspects((prev) => {
          const updated = prev.map((p) => p.id === prospect.id ? { ...p, mobileScore, sslValid, score, issue } : p);
          updated.sort((a, b) => b.score - a.score);
          saveToStorage(updated, `${sector} in ${city} ${selectedDistrict}`);
          return updated;
        });
      }).catch(() => {});
    }
  }

  async function handleAddToLeads(id: string) {
    const prospect = prospects.find((p) => p.id === id);
    if (!prospect) return;
    if (existingLeads.has(prospect.name)) {
      showNotif(`${prospect.name} zaten Soğuk Lead olarak ekli.`, "info");
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
      showNotif(`${prospect.name} Soğuk Lead olarak eklendi.`, "success");
    } else if (result.error === "duplicate") {
      showNotif(result.message || `${prospect.name} zaten ekli.`, "info");
      setProspects((prev) => prev.map((p) => (p.id === id ? { ...p, addedToLeads: true } : p)));
    } else {
      showNotif(result.error || "Eklenemedi.", "error");
    }
  }

  async function handleAddAll() {
    const toAdd = filtered.filter((p) => !p.addedToLeads);
    if (toAdd.length === 0) { showNotif("Eklenecek yeni prospect yok.", "info"); return; }
    let added = 0, skipped = 0;
    for (const prospect of toAdd) {
      if (existingLeads.has(prospect.name)) { skipped++; setProspects((prev) => prev.map((p) => (p.id === prospect.id ? { ...p, addedToLeads: true } : p))); continue; }
      const result = await addRawProspectToLead({
        name: prospect.name, phone: prospect.phone, website: prospect.website,
        address: prospect.address, googleRating: prospect.googleRating,
        googleReviews: prospect.googleReviews, score: prospect.score,
        issue: prospect.issue, hasWebsite: prospect.hasWebsite, mobileScore: prospect.mobileScore,
      });
      if (result.success) { added++; setExistingLeads((prev) => new Set([...prev, prospect.name])); setProspects((prev) => prev.map((p) => (p.id === prospect.id ? { ...p, addedToLeads: true } : p))); }
    }
    showNotif(skipped > 0 ? `${added} eklendi, ${skipped} zaten mevcut.` : `${added} prospect Soğuk Lead olarak eklendi.`, "success");
  }

  function handleClear() { setProspects([]); setQuery(""); clearStorage(); }

  const filtered = prospects.filter((p) => {
    if (filter === "Sitesi olmayanlar") return !p.hasWebsite;
    if (filter === "Sitesi olanlar") return p.hasWebsite;
    return true;
  });

  const notifColors = { info: "border-admin-blue bg-admin-blue-dim text-admin-blue", success: "border-admin-green bg-admin-green-dim text-admin-green", error: "border-admin-red bg-admin-red-dim text-admin-red" };

  return (
    <div className="space-y-4">
      {notification && <div className={`rounded-lg border px-4 py-2.5 text-[12px] font-medium transition-all ${notifColors[notification.type]}`}>{notification.msg}</div>}

      {/* Hızlı Firma Arama */}
      <div className="rounded-xl border border-admin-accent/30 bg-admin-bg2 p-4">
        <div className="mb-3 text-[12px] font-medium text-admin-muted">Hızlı Firma Arama — Google Maps linki veya firma adı ile</div>
        <div className="flex gap-2">
          <input
            value={quickSearch}
            onChange={(e) => setQuickSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !quickSearching) handleQuickSearch(); }}
            placeholder="Google Maps linki yapıştırın veya firma adı yazın..."
            className="flex-1 rounded-lg border border-admin-border bg-admin-bg3 px-4 py-2.5 text-[13px] text-admin-text placeholder:text-admin-muted2 focus:border-admin-accent focus:outline-none"
          />
          <button
            onClick={handleQuickSearch}
            disabled={quickSearching || !quickSearch.trim()}
            className="shrink-0 rounded-lg bg-admin-accent px-5 py-2.5 text-[12px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {quickSearching ? "Arıyor..." : "🔍 Araştır"}
          </button>
        </div>

        {/* Hızlı Arama Sonucu */}
        {quickResult && (
          <div className="mt-3 rounded-lg border border-admin-border bg-admin-bg3 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-semibold text-admin-text">{quickResult.name}</span>
                  {quickResult.googleRating && (
                    <span className="text-[11px] text-admin-amber">★ {quickResult.googleRating} ({quickResult.googleReviews})</span>
                  )}
                </div>
                {quickResult.address && (
                  <div className="mt-1 text-[12px] text-admin-muted">📍 {quickResult.address}</div>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {quickResult.phone && (
                    <span className="rounded-lg bg-admin-bg4 px-2.5 py-1 text-[11px] font-mono text-admin-text">
                      📞 {quickResult.phone}
                    </span>
                  )}
                  {quickResult.website && (
                    <a href={quickResult.website.startsWith("http") ? quickResult.website : `https://${quickResult.website}`} target="_blank" rel="noopener noreferrer"
                      className="rounded-lg bg-admin-bg4 px-2.5 py-1 text-[11px] text-admin-accent hover:underline">
                      🌐 {quickResult.website}
                    </a>
                  )}
                  {quickResult.googleMapsUrl && (
                    <a href={quickResult.googleMapsUrl} target="_blank" rel="noopener noreferrer"
                      className="rounded-lg bg-admin-bg4 px-2.5 py-1 text-[11px] text-admin-blue hover:underline">
                      📍 Haritada Gör
                    </a>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {isGSM(quickResult.phone) && (
                  <a href={`https://wa.me/${formatWANumber(quickResult.phone!)}`} target="_blank" rel="noopener noreferrer"
                    className="rounded-lg bg-[#25D366] px-3 py-1.5 text-[11px] font-medium text-white hover:brightness-110 transition-colors">
                    WhatsApp
                  </a>
                )}
                {quickResult.addedToLeads ? (
                  <span className="rounded-lg bg-admin-bg4 px-3 py-1.5 text-[11px] text-admin-muted">Eklendi ✓</span>
                ) : (
                  <button
                    onClick={handleQuickAddToLead}
                    className="rounded-lg bg-admin-accent px-3 py-1.5 text-[11px] font-medium text-white hover:brightness-110 transition-colors">
                    Soğuk Lead Ekle
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Arama Formu */}
      <div className="rounded-xl border border-admin-border bg-admin-bg2 p-4">
        <div className="mb-3 text-[12px] font-medium text-admin-muted">Google Maps&apos;ten işletme ara — İl / İlçe / Mahalle bazlı</div>
        <div className="flex flex-wrap gap-3">
          {/* İl */}
          <div style={{ minWidth: 140 }}>
            <label className="mb-1 block text-[11px] font-medium text-admin-muted">İl</label>
            <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full rounded-lg border border-admin-border bg-admin-bg3 px-3 py-2 text-[12px] text-admin-text focus:border-admin-accent focus:outline-none">
              {cities.map((c) => (<option key={c}>{c}</option>))}
            </select>
          </div>
          {/* İlçe */}
          <div style={{ minWidth: 140 }}>
            <label className="mb-1 block text-[11px] font-medium text-admin-muted">İlçe</label>
            <select value={selectedDistrict} onChange={(e) => { setSelectedDistrict(e.target.value); setSelectedNeighborhoods({}); }}
              disabled={loadingDistricts} className="w-full rounded-lg border border-admin-border bg-admin-bg3 px-3 py-2 text-[12px] text-admin-text focus:border-admin-accent focus:outline-none disabled:opacity-50">
              {loadingDistricts ? <option>Yükleniyor...</option> : districts.map((d) => (<option key={d.name}>{d.name}</option>))}
            </select>
          </div>
          {/* Sektör */}
          <div style={{ minWidth: 140 }}>
            <label className="mb-1 block text-[11px] font-medium text-admin-muted">Sektör</label>
            <select value={sector} onChange={(e) => setSector(e.target.value)} className="w-full rounded-lg border border-admin-border bg-admin-bg3 px-3 py-2 text-[12px] text-admin-text focus:border-admin-accent focus:outline-none">
              {sectors.map((s) => (<option key={s}>{s}</option>))}
            </select>
          </div>
          {/* Filtre */}
          <div style={{ minWidth: 120 }}>
            <label className="mb-1 block text-[11px] font-medium text-admin-muted">Filtre</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full rounded-lg border border-admin-border bg-admin-bg3 px-3 py-2 text-[12px] text-admin-text focus:border-admin-accent focus:outline-none">
              {filters.map((f) => (<option key={f}>{f}</option>))}
            </select>
          </div>
          {/* Butonlar */}
          <div className="flex items-end gap-2">
            <button onClick={handleSearch} disabled={searching} className="rounded-lg bg-admin-accent px-5 py-2 text-[12px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50">
              {searching ? "Aranıyor..." : "🔍 Ara"}
            </button>
            {prospects.length > 0 && <button onClick={handleClear} className="rounded-lg border border-admin-border px-4 py-2 text-[12px] font-medium text-admin-muted hover:bg-admin-bg3 hover:text-admin-text transition-colors">Temizle</button>}
          </div>
        </div>

        {/* Mahalle Seçim Paneli */}
        {currentDistrict && currentDistrict.neighborhoods.length > 0 && (
          <div className="mt-3 rounded-lg border border-admin-border bg-admin-bg3 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-medium text-admin-muted">
                Mahalleler ({selectedCount} seçili / {currentDistrict.neighborhoods.length} toplam)
              </span>
              <div className="flex gap-2">
                <button onClick={() => toggleAllNeighborhoods(true)} className="text-[10px] text-admin-accent hover:underline">Tümünü Seç</button>
                <button onClick={() => toggleAllNeighborhoods(false)} className="text-[10px] text-admin-muted hover:underline">Kaldır</button>
              </div>
            </div>
            <input value={neighborhoodSearch} onChange={(e) => setNeighborhoodSearch(e.target.value)}
              placeholder="Mahalle ara..." className="mb-2 w-full rounded border border-admin-border bg-admin-bg4 px-2 py-1 text-[11px] text-admin-text focus:border-admin-accent focus:outline-none" />
            <div className="grid max-h-40 grid-cols-2 gap-1 overflow-y-auto md:grid-cols-3 lg:grid-cols-4">
              {filteredNeighborhoods.map((n) => (
                <label key={n} className="flex cursor-pointer items-center gap-1.5 rounded px-1.5 py-1 text-[11px] hover:bg-admin-bg4">
                  <input type="checkbox" checked={!!selectedNeighborhoods[n]}
                    onChange={(e) => setSelectedNeighborhoods((prev) => ({ ...prev, [n]: e.target.checked }))} className="accent-admin-accent" />
                  {n}
                </label>
              ))}
            </div>
            {selectedCount === 0 && <p className="mt-1 text-[10px] text-admin-muted">Mahalle seçmezseniz tüm ilçe aranır.</p>}
          </div>
        )}

        {/* Progress */}
        {searching && progress.total > 1 && (
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-[11px] text-admin-muted">
              <span>{progress.currentName}</span>
              <span>{progress.current}/{progress.total} mahalle tarandı</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-admin-bg4">
              <div className="h-full rounded-full bg-admin-accent transition-all" style={{ width: `${(progress.current / progress.total) * 100}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Sonuçlar */}
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
                  <th className="px-4 py-2.5">Website</th><th className="px-4 py-2.5">Mobil Skor</th><th className="px-4 py-2.5">★ Yorum</th><th className="px-4 py-2.5">Sorun</th><th className="px-4 py-2.5"></th>
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
                    <td className="px-4 py-2.5" style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11 }}>{p.phone || <span className="text-admin-muted2">—</span>}</td>
                    <td className="px-4 py-2.5">
                      {!p.hasWebsite ? <span className="rounded-full bg-admin-red-dim px-2 py-0.5 text-[10px] font-medium text-admin-red">Site yok</span>
                        : !p.sslValid ? <span className="rounded-full bg-admin-amber-dim px-2 py-0.5 text-[10px] font-medium text-admin-amber">SSL yok</span>
                        : <span className="rounded-full bg-admin-green-dim px-2 py-0.5 text-[10px] font-medium text-admin-green">İyi</span>}
                    </td>
                    <td className="px-4 py-2.5">
                      {!p.hasWebsite ? <span className="text-admin-muted2">—</span>
                        : p.mobileScore !== null ? (
                          <div className="flex items-center gap-1.5">
                            <div className="h-1.5 w-12 overflow-hidden rounded-full bg-admin-bg4">
                              <div className="h-full rounded-full" style={{ width: `${p.mobileScore}%`, background: p.mobileScore < 50 ? "var(--color-admin-red)" : p.mobileScore < 70 ? "var(--color-admin-amber)" : "var(--color-admin-green)" }} />
                            </div>
                            <span className={`text-[11px] font-bold ${p.mobileScore < 50 ? "text-admin-red" : p.mobileScore < 70 ? "text-admin-amber" : "text-admin-green"}`}>{p.mobileScore}</span>
                          </div>
                        ) : p.issue === "Analiz ediliyor..." ? <span className="text-[10px] text-admin-muted">Analiz...</span> : <span className="text-admin-muted2">—</span>}
                    </td>
                    <td className="px-4 py-2.5">{p.googleRating && <div><span className="text-admin-amber">★ {p.googleRating}</span><span className="ml-1 text-admin-muted">({p.googleReviews})</span></div>}</td>
                    <td className="px-4 py-2.5"><span className={`text-[11px] font-medium ${p.score >= 70 ? "text-admin-green" : p.score >= 40 ? "text-admin-amber" : "text-admin-muted"}`}>{p.issue}</span></td>
                    <td className="px-4 py-2.5">
                      <div className="flex gap-1.5">
                        {isGSM(p.phone) && <a href={`https://wa.me/${formatWANumber(p.phone!)}`} target="_blank" rel="noopener noreferrer" className="rounded bg-admin-green px-2 py-1 text-[10px] font-medium text-white hover:brightness-110 transition-colors">WA</a>}
                        {p.addedToLeads ? <span className="rounded bg-admin-bg4 px-2 py-1 text-[10px] text-admin-muted">Eklendi ✓</span>
                          : <button onClick={() => handleAddToLeads(p.id)} className="rounded bg-admin-accent px-2 py-1 text-[10px] font-medium text-white hover:brightness-110 transition-colors">Lead Ekle</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Boş durum */}
      {prospects.length === 0 && !searching && (
        <div className="rounded-xl border border-admin-border bg-admin-bg2 px-6 py-16 text-center">
          <div className="text-[32px] mb-3">🔍</div>
          <div className="text-[13px] font-medium text-admin-text mb-1">Arama yapın</div>
          <div className="text-[12px] text-admin-muted">İl, ilçe ve sektör seçip &quot;Ara&quot; butonuna basın. Mahalle seçerseniz daha hedefli sonuçlar alırsınız.</div>
        </div>
      )}
    </div>
  );
}
