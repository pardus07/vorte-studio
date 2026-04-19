"use client";

import { useState, useEffect, useRef } from "react";
import { addRawProspectToLead, getExistingLeadNames, auditSingleWebsite, resolveGoogleMapsLink, addManualLead } from "@/actions/prospect";
import { createScraperJob, checkScraperJob, getScraperResults } from "@/actions/scraper";
import { isGSM, formatWANumber } from "@/lib/phone-utils";
import { cities, sectors, getDistricts, type District } from "@/lib/turkey-data";

type Prospect = {
  id: string; name: string; phone: string | null; website: string | null;
  address: string | null; googleRating: number | null; googleReviews: number | null;
  googleMapsUrl: string | null; mobileScore: number | null; sslValid: boolean;
  hasWebsite: boolean; score: number; issue: string | null; addedToLeads: boolean;
  waPhone?: string | null; // Manuel eklenen WhatsApp numarası
  sector?: string | null;  // Arama anındaki sektör snapshot'ı (stale state bug fix)
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

// ── Polling parametreleri ──
// Scraper bir mahalle için max 300sn (max_time) çalışıyor, biz 180sn bekliyoruz.
// Yoğun mahallelerde (Beşevler, Görükle vb.) 60sn yetmiyordu — sessizce skip ediyorduk.
const POLLING_INTERVAL_MS = 2000;
const POLLING_MAX_ATTEMPTS = 90;     // 2sn × 90 = 180sn (3 dakika)

// Mahalle/ilçe araması sırasında aynı işletme birden fazla mahallede döner.
// Option 1: title (lowercase+trim) + telefonun sadece rakamları.
// Aynı şube farklı formatla gelse bile tek sayılır; farklı şubeler ayrı kalır.
function dedupeKey(title: string, phone: string | null): string {
  const normalizedTitle = title.toLowerCase().trim();
  const normalizedPhone = (phone ?? "").replace(/\D/g, "");
  return `${normalizedTitle}|${normalizedPhone}`;
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
  const [progress, setProgress] = useState({ current: 0, total: 0, currentName: "", waitedSec: 0 });
  // Atlanan mahalleler — polling timeout veya scraper hatası
  const [skippedNeighborhoods, setSkippedNeighborhoods] = useState<string[]>([]);
  const [notification, setNotification] = useState<{ msg: string; type: "info" | "success" | "error" } | null>(null);
  const [existingLeads, setExistingLeads] = useState<Set<string>>(new Set());
  // Ref: async arama loop'u içinde stale closure'a takılmadan güncel lead listesini oku
  const existingLeadsRef = useRef<Set<string>>(new Set());
  useEffect(() => { existingLeadsRef.current = existingLeads; }, [existingLeads]);
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
    // WA numarası varsa onu phone olarak kullan (GSM), yoksa scraper'dan gelen sabit numara
    const phoneToSave = (quickResult.waPhone && isGSM(quickResult.waPhone))
      ? quickResult.waPhone
      : quickResult.phone;
    const result = await addManualLead({
      name: quickResult.name,
      phone: phoneToSave,
      website: quickResult.website,
      address: quickResult.address,
      googleRating: quickResult.googleRating,
      googleReviews: quickResult.googleReviews,
      googleMapsUrl: quickResult.googleMapsUrl,
    });
    if (result.success) {
      setQuickResult((prev) => prev ? { ...prev, addedToLeads: true } : null);
      setExistingLeads((prev) => new Set([...prev, quickResult.name]));
      existingLeadsRef.current = new Set([...existingLeadsRef.current, quickResult.name]);
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
    getExistingLeadNames().then((names) => {
      const set = new Set(names);
      setExistingLeads(set);
      existingLeadsRef.current = set;
    });
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

    // Arama anındaki sektörü snapshot al — sonradan dropdown değişse bile bu kullanılır
    const searchSector = sector;

    setSearching(true);
    setQuery(`${searchSector} in ${city} ${selectedDistrict}`);
    setProgress({ current: 0, total: queries.length, currentName: "", waitedSec: 0 });
    setSkippedNeighborhoods([]); // önceki aramadan kalan skip listesini temizle

    const allResults: Prospect[] = [];
    const seenNames = new Set<string>();
    const skipped: string[] = [];
    const leadNames = await getExistingLeadNames();
    const leadSet = new Set(leadNames);
    setExistingLeads(leadSet);
    existingLeadsRef.current = leadSet; // ref'i de ilk veriyle doldur

    for (let i = 0; i < queries.length; i++) {
      const q = queries[i];
      const neighborhoodLabel = q.split(" in ")[1] || q;
      setProgress({ current: i + 1, total: queries.length, currentName: neighborhoodLabel, waitedSec: 0 });

      const job = await createScraperJob(q);
      if (!job.success || !job.jobId) {
        showNotif(`${neighborhoodLabel}: ${job.error || "Scraper hatası"}`, "error");
        skipped.push(neighborhoodLabel);
        setSkippedNeighborhoods([...skipped]);
        continue;
      }

      // Polling — 180 saniyeye kadar bekle, her tick'te progress'e yansıt
      let done = false;
      let attempts = 0;
      while (!done && attempts < POLLING_MAX_ATTEMPTS) {
        attempts++;
        await new Promise((r) => setTimeout(r, POLLING_INTERVAL_MS));
        // Progress'e bekleme süresini yaz — kullanıcı "ne kadar sürdü" görür
        setProgress((prev) => ({ ...prev, waitedSec: attempts * (POLLING_INTERVAL_MS / 1000) }));
        const status = await checkScraperJob(job.jobId!);
        if (!status.success) break;
        if (status.status === "ok" || status.status === "completed" || status.status === "done") {
          done = true;
          const results = await getScraperResults(job.jobId!);
          if (results.success && results.results) {
            for (const r of results.results) {
              // Normalized duplikat eleme — aynı şube farklı format gelse bile tek sayılır
              const key = dedupeKey(r.title, r.phone || null);
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
                score, issue,
                // Ref'i kullan — kullanıcı arama sırasında eklediği kayıtları da bilir
                addedToLeads: existingLeadsRef.current.has(r.title),
                sector: searchSector, // ← arama anındaki sektör
              });
            }
          }
        }
      }

      // Polling timeout — scraper bitiremedi, sessizce geçme; kayda al ve bildir
      if (!done) {
        skipped.push(neighborhoodLabel);
        setSkippedNeighborhoods([...skipped]);
        showNotif(`${neighborhoodLabel}: scraper ${POLLING_MAX_ATTEMPTS * POLLING_INTERVAL_MS / 1000}sn içinde yetişemedi, atlandı.`, "error");
      }

      // Her mahalle sonrası sonuçları göster — kullanıcının eklediği kartları koru
      const sorted = [...allResults].sort((a, b) => b.score - a.score);
      setProspects((prev) => {
        // Önceki render'da addedToLeads=true olan isimleri topla
        const prevAdded = new Set(prev.filter((p) => p.addedToLeads).map((p) => p.name));
        const merged = sorted.map((p) =>
          prevAdded.has(p.name) || existingLeadsRef.current.has(p.name)
            ? { ...p, addedToLeads: true }
            : p
        );
        saveToStorage(merged, `${searchSector} in ${city} ${selectedDistrict}`);
        return merged;
      });
    }

    setSearching(false);
    setProgress({ current: 0, total: 0, currentName: "", waitedSec: 0 });
    // Sonuç + atlanan mahalle özeti
    if (skipped.length > 0) {
      showNotif(
        `${allResults.length} işletme bulundu. ${skipped.length} mahalle atlandı — tekrar denemek için aşağıdaki listeyi gör.`,
        "info"
      );
    } else {
      showNotif(`${allResults.length} işletme bulundu!`, "success");
    }

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
          saveToStorage(updated, `${searchSector} in ${city} ${selectedDistrict}`);
          return updated;
        });
      }).catch(() => {});
    }
  }

  async function handleAddToLeads(id: string) {
    const prospect = prospects.find((p) => p.id === id);
    if (!prospect) return;
    // Client-side exact-name pre-check — UX optimizasyonu (sunucuya
    // gitmeden bariz duplicate'leri eler). Sprint 3.6a: asıl 3-seviye
    // kontrol server'da (googleMapsUrl → phone → name+sector).
    if (existingLeads.has(prospect.name)) {
      showNotif(`${prospect.name} zaten Soğuk Lead olarak ekli.`, "info");
      setProspects((prev) => prev.map((p) => (p.id === id ? { ...p, addedToLeads: true } : p)));
      return;
    }
    const result = await addRawProspectToLead({
      name: prospect.name, phone: prospect.phone, website: prospect.website,
      address: prospect.address, googleRating: prospect.googleRating,
      googleReviews: prospect.googleReviews,
      googleMapsUrl: prospect.googleMapsUrl,
      score: prospect.score,
      issue: prospect.issue, hasWebsite: prospect.hasWebsite, mobileScore: prospect.mobileScore,
      sector: prospect.sector ?? sector, // arama anındaki sektör (yoksa live state — eski localStorage için)
    });
    if (result.success) {
      setProspects((prev) => prev.map((p) => (p.id === id ? { ...p, addedToLeads: true } : p)));
      setExistingLeads((prev) => new Set([...prev, prospect.name]));
      existingLeadsRef.current = new Set([...existingLeadsRef.current, prospect.name]);
      showNotif(`${prospect.name} Soğuk Lead olarak eklendi.`, "success");
    } else if (result.error === "duplicate") {
      // Sprint 3.6a: message içinde eşleşme sebebi var ("eşleşme: telefon")
      showNotif(result.message || `${prospect.name} zaten ekli.`, "info");
      setProspects((prev) => prev.map((p) => (p.id === id ? { ...p, addedToLeads: true } : p)));
    } else {
      showNotif(result.error || "Eklenemedi.", "error");
    }
  }

  async function handleAddAll() {
    const toAdd = filtered.filter((p) => !p.addedToLeads);
    if (toAdd.length === 0) { showNotif("Eklenecek yeni prospect yok.", "info"); return; }
    // Sprint 3.6a: duplicate sebeplerini kırılım olarak göster
    let added = 0, skipped = 0;
    const skipReasons: Record<string, number> = {};
    for (const prospect of toAdd) {
      if (existingLeads.has(prospect.name)) {
        skipped++;
        skipReasons.name = (skipReasons.name || 0) + 1;
        setProspects((prev) => prev.map((p) => (p.id === prospect.id ? { ...p, addedToLeads: true } : p)));
        continue;
      }
      const result = await addRawProspectToLead({
        name: prospect.name, phone: prospect.phone, website: prospect.website,
        address: prospect.address, googleRating: prospect.googleRating,
        googleReviews: prospect.googleReviews,
        googleMapsUrl: prospect.googleMapsUrl,
        score: prospect.score,
        issue: prospect.issue, hasWebsite: prospect.hasWebsite, mobileScore: prospect.mobileScore,
        sector: prospect.sector ?? sector, // arama anındaki sektör snapshot
      });
      if (result.success) {
        added++;
        setExistingLeads((prev) => new Set([...prev, prospect.name]));
        existingLeadsRef.current = new Set([...existingLeadsRef.current, prospect.name]);
        setProspects((prev) => prev.map((p) => (p.id === prospect.id ? { ...p, addedToLeads: true } : p)));
      } else if (result.error === "duplicate") {
        skipped++;
        const reasonKey = (result as { matchReason?: string }).matchReason || "name";
        skipReasons[reasonKey] = (skipReasons[reasonKey] || 0) + 1;
        setProspects((prev) => prev.map((p) => (p.id === prospect.id ? { ...p, addedToLeads: true } : p)));
      }
    }
    // Kırılım mesajı: "3 eklendi, 2 atlandı (telefon: 1, Google Maps: 1)"
    const reasonParts = Object.entries(skipReasons)
      .filter(([, n]) => n > 0)
      .map(([k, n]) => {
        const label = k === "GOOGLE_MAPS_URL" ? "Google Maps"
                    : k === "PHONE"           ? "telefon"
                    : k === "NAME_SECTOR"     ? "isim+sektör"
                    : "isim";
        return `${label}: ${n}`;
      });
    const summary = skipped > 0
      ? `${added} eklendi, ${skipped} atlandı${reasonParts.length ? ` (${reasonParts.join(", ")})` : ""}.`
      : `${added} prospect Soğuk Lead olarak eklendi.`;
    showNotif(summary, "success");
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
                      {!isGSM(quickResult.phone) && <span className="ml-1 text-[9px] text-admin-muted">(sabit)</span>}
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

                {/* WA Numarası — scraper'dan GSM gelmediyse manuel input */}
                {!isGSM(quickResult.phone) && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-admin-muted">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      WA No:
                    </div>
                    <input
                      type="text"
                      value={quickResult.waPhone || ""}
                      onChange={(e) => setQuickResult((prev) => prev ? { ...prev, waPhone: e.target.value } : null)}
                      placeholder="05XX XXX XX XX"
                      className="w-40 rounded-lg border border-admin-border bg-admin-bg4 px-2.5 py-1.5 text-[12px] font-mono text-admin-text placeholder:text-admin-muted2 focus:border-[#25D366] focus:outline-none"
                    />
                    {quickResult.waPhone && isGSM(quickResult.waPhone) && (
                      <a href={`https://wa.me/${formatWANumber(quickResult.waPhone)}`} target="_blank" rel="noopener noreferrer"
                        className="rounded-lg bg-[#25D366] px-3 py-1.5 text-[11px] font-medium text-white hover:brightness-110 transition-colors">
                        WA Gönder
                      </a>
                    )}
                    {quickResult.waPhone && !isGSM(quickResult.waPhone) && quickResult.waPhone.length > 3 && (
                      <span className="text-[10px] text-admin-red">Geçerli GSM numarası girin</span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                {/* GSM varsa (scraper'dan veya WA input'tan) WA butonu göster */}
                {(isGSM(quickResult.phone) || isGSM(quickResult.waPhone)) && (
                  <a href={`https://wa.me/${formatWANumber(isGSM(quickResult.waPhone) ? quickResult.waPhone! : quickResult.phone!)}`} target="_blank" rel="noopener noreferrer"
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
              <span>
                {progress.currentName}
                {progress.waitedSec > 0 && (
                  <span className="ml-2 text-admin-amber">
                    · scraper bekleniyor {progress.waitedSec}sn / {POLLING_MAX_ATTEMPTS * POLLING_INTERVAL_MS / 1000}sn
                  </span>
                )}
              </span>
              <span>{progress.current}/{progress.total} mahalle tarandı</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-admin-bg4">
              <div className="h-full rounded-full bg-admin-accent transition-all" style={{ width: `${(progress.current / progress.total) * 100}%` }} />
            </div>
          </div>
        )}

        {/* Atlanan mahalleler — polling timeout veya scraper hatası */}
        {skippedNeighborhoods.length > 0 && (
          <div className="mt-3 rounded-lg border border-admin-amber/30 bg-admin-amber-dim p-3">
            <div className="mb-1 flex items-center justify-between">
              <div className="text-[11px] font-medium text-admin-amber">
                ⚠️ {skippedNeighborhoods.length} mahalle atlandı (scraper yetişemedi)
              </div>
              <button
                onClick={() => setSkippedNeighborhoods([])}
                className="text-[10px] text-admin-muted hover:text-admin-text transition-colors"
              >
                Kapat
              </button>
            </div>
            <div className="text-[10.5px] text-admin-muted leading-relaxed">
              {skippedNeighborhoods.join(" · ")}
            </div>
            <div className="mt-1.5 text-[10px] text-admin-muted2">
              Tekrar denemek için bu mahalleleri seçip yeniden Ara'ya basın — mevcut liste korunur.
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
