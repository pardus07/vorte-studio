"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { updateLeadStatus, convertLeadToClient, deleteLeadAction, addWaTemplateToLead, markWaSent, updateLeadSector, bulkUpdateLeadsSector, type LeadStatus } from "@/actions/leads";
import { isGSM, formatWANumber } from "@/lib/phone-utils";
import { generateWaMessage, buildDemoLink, buildWaUrl, detectIssue, extractCity } from "@/lib/wa-templates";
import { getTemplateName } from "@/lib/template-selector";
import { sectors } from "@/lib/turkey-data";
import LeadFormModal from "./lead-form-modal";
import LeadDetailModal from "./lead-detail-modal";

type Lead = {
  id: string; name: string; company: string; source: string;
  status: string; budget: string; sector: string; phone: string | null;
  email: string | null; website: string | null; address: string | null;
  notes: string | null; googleMapsUrl: string | null; updatedAt: string;
  hasWebsite: boolean; mobileScore: number | null; sslValid: boolean;
  waTemplate: string | null; waTemplateSector: string | null;
  waTemplateSlug: string | null; waSentAt: string | null;
  // Sprint 3.5 — attribution (hepsi opsiyonel, eski lead'lerde boş)
  sourceDetail?: string | null;
  sourceUrl?: string | null;
  referrer?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
};

// Sprint 3.5 — UTM medium → renk haritası (minimal, 4 bucket).
// organic=gri, paid=turuncu, referral=mavi, direct=koyu gri.
function traceBucket(lead: {
  utmMedium?: string | null;
  utmSource?: string | null;
  referrer?: string | null;
}): { label: string; cls: string } {
  const m = (lead.utmMedium || "").toLowerCase();
  if (m === "cpc" || m === "ppc" || m === "paid" || m === "ads") {
    return { label: "paid", cls: "bg-admin-accent/15 text-admin-accent" };
  }
  if (m === "referral" || (lead.referrer && !lead.utmMedium)) {
    return { label: "referral", cls: "bg-admin-blue/15 text-admin-blue" };
  }
  if (m === "organic" || m === "seo") {
    return { label: "organic", cls: "bg-white/5 text-admin-muted" };
  }
  // UTM yoksa ve referrer da yoksa → direct
  if (!lead.utmSource && !lead.referrer) {
    return { label: "direct", cls: "bg-white/5 text-admin-muted/70" };
  }
  return { label: "organic", cls: "bg-white/5 text-admin-muted" };
}

const columns = [
  { key: "COLD", label: "Soğuk Lead", icon: "🔵" },
  { key: "TEMPLATE_ADDED", label: "Şablon Eklendi", icon: "📝" },
  { key: "WA_SENT", label: "WA Gönderildi", icon: "📲" },
  { key: "CONTACTED", label: "İletişim Kuruldu", icon: "📞" },
  { key: "QUOTED", label: "Teklif Gönderildi", icon: "📄" },
  { key: "CONTRACTED", label: "Sözleşme İmzalandı", icon: "📑" },
  { key: "WON", label: "Tamamlandı", icon: "✅" },
  { key: "LOST", label: "Kapandı", icon: "❌" },
];

const sourceLabels: Record<string, { label: string; color: string }> = {
  MAPS_SCRAPER: { label: "Maps", color: "bg-admin-accent-dim text-admin-accent" },
  SITE_FORM: { label: "Form", color: "bg-admin-blue-dim text-admin-blue" },
  LINKEDIN: { label: "LinkedIn", color: "bg-admin-purple-dim text-admin-purple" },
  REFERRAL: { label: "Referans", color: "bg-admin-green-dim text-admin-green" },
  MANUAL: { label: "Manuel", color: "bg-admin-amber-dim text-admin-amber" },
};

const statusOptions = columns.map((c) => ({ value: c.key, label: c.label }));

export default function KanbanBoard({ leads: initial }: { leads: Lead[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [leads, setLeads] = useState(initial);
  const [notification, setNotification] = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);
  const [converting, setConverting] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [templating, setTemplating] = useState<string | null>(null);
  const [waSending, setWaSending] = useState<string | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [detailLead, setDetailLead] = useState<Lead | null>(null);
  const [previewLead, setPreviewLead] = useState<Lead | null>(null);

  // Sektör seçici modal state
  const [sectorPickLead, setSectorPickLead] = useState<Lead | null>(null);
  const [selectedSector, setSelectedSector] = useState("");
  const [sectorSearch, setSectorSearch] = useState("");

  // Toplu sektör atama — multi-select state
  const [bulkSelection, setBulkSelection] = useState<Set<string>>(new Set());
  const [bulkSectorOpen, setBulkSectorOpen] = useState(false);
  const [bulkSelectedSector, setBulkSelectedSector] = useState("");
  const [bulkSectorSearch, setBulkSectorSearch] = useState("");
  const [bulkLoading, setBulkLoading] = useState(false);

  // URL'de ?new=1 varsa otomatik olarak yeni lead modal'ını aç
  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setShowNewModal(true);
      router.replace("/admin/leads", { scroll: false });
    }
  }, [searchParams, router]);

  // ── WA şablon auto-regenerate (preview modal açılınca) ──
  // TEMPLATE_ADDED statüsündeki bir lead için modalı açtığında,
  // `Lead.waTemplate` DB'de eski kod döneminde üretilmiş olabilir
  // (ör: KVKK disclosure bloğu eski versiyon). Taze üretip farklıysa
  // DB + state'i sessizce güncelle. WA_SENT ve sonrası dokunulmaz —
  // gönderilmiş mesajın birebir kopyası delil değeri taşır.
  useEffect(() => {
    if (!previewLead) return;
    if (previewLead.status !== "TEMPLATE_ADDED") return;
    if (!previewLead.waTemplateSector || !previewLead.phone) return;

    const freshMsg = generateWaMessage({
      firma: previewLead.name,
      sektor: previewLead.waTemplateSector,
      sehir: extractCity(previewLead.address),
      sorun: detectIssue({
        hasWebsite: previewLead.hasWebsite,
        mobileScore: previewLead.mobileScore,
        sslValid: previewLead.sslValid,
        website: previewLead.website,
      }),
      link: buildDemoLink(previewLead.id, previewLead.waTemplateSector),
      phone: formatWANumber(previewLead.phone),
    });

    if (freshMsg === previewLead.waTemplate) return; // değişiklik yok

    const slug =
      previewLead.waTemplateSlug || getTemplateName(previewLead.waTemplateSector);
    const leadId = previewLead.id;
    const sector = previewLead.waTemplateSector;

    addWaTemplateToLead(leadId, freshMsg, sector, slug).then((result) => {
      if (!result.success) return;
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, waTemplate: freshMsg } : l))
      );
      setPreviewLead((prev) =>
        prev && prev.id === leadId ? { ...prev, waTemplate: freshMsg } : prev
      );
      showNotif("Şablon güncel KVKK metniyle yenilendi.", "info");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewLead?.id]);

  function showNotif(msg: string, type: "success" | "error" | "info" = "info") {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  }

  async function changeStatus(id: string, newStatus: string) {
    const old = [...leads];
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
    try {
      await updateLeadStatus(id, newStatus as LeadStatus);
    } catch {
      setLeads(old);
      showNotif("Durum güncellenemedi.", "error");
    }
  }

  async function handleConvert(lead: Lead) {
    setConverting(lead.id);
    const result = await convertLeadToClient(lead.id);
    setConverting(null);
    if (result.success) {
      setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status: "WON" } : l)));
      showNotif(`${result.clientName} CRM'e eklendi!`, "success");
    } else {
      showNotif(result.error || "CRM'e taşınamadı.", "error");
    }
  }

  async function handleDelete(lead: Lead) {
    if (!confirm(`"${lead.name}" silinecek. Emin misin?`)) return;
    setDeleting(lead.id);
    const result = await deleteLeadAction(lead.id);
    setDeleting(null);
    if (result.success) {
      setLeads((prev) => prev.filter((l) => l.id !== lead.id));
      showNotif(`${lead.name} silindi.`, "success");
    } else {
      showNotif(result.error || "Silinemedi.", "error");
    }
  }

  // ── Şablon Ekle butonuna tıklandı ──
  function handleTemplateClick(lead: Lead) {
    if (!isGSM(lead.phone)) {
      showNotif("GSM numarası yok — WA şablonu için GSM gerekli. Lead detayından numara ekleyin.", "error");
      return;
    }
    if (!lead.sector) {
      // Sektör yok — sektör seçici aç
      setSectorPickLead(lead);
      setSelectedSector("");
      setSectorSearch("");
      return;
    }
    // Her şey tamam — şablon oluştur
    handleAddTemplate(lead, lead.sector);
  }

  // ── Sektör seçildi, şablonu oluştur ──
  async function handleSectorConfirm() {
    if (!sectorPickLead || !selectedSector) return;

    // Önce sektörü DB'ye kaydet
    const sectorResult = await updateLeadSector(sectorPickLead.id, selectedSector);
    if (!sectorResult.success) {
      showNotif("Sektör kaydedilemedi.", "error");
      return;
    }

    // Lead'i güncelle
    const updatedLead = { ...sectorPickLead, sector: selectedSector };
    setLeads((prev) => prev.map((l) => l.id === updatedLead.id ? { ...l, sector: selectedSector } : l));

    setSectorPickLead(null);

    // Şablonu oluştur
    await handleAddTemplate(updatedLead, selectedSector);
  }

  // ── Toplu seçim toggle (checkbox) ──
  function toggleBulkSelection(id: string) {
    setBulkSelection((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // ── Toplu sektör atama onayı ──
  async function handleBulkSectorConfirm() {
    if (!bulkSelectedSector || bulkSelection.size === 0) return;
    setBulkLoading(true);
    const ids = Array.from(bulkSelection);
    const result = await bulkUpdateLeadsSector(ids, bulkSelectedSector);
    setBulkLoading(false);
    if (!result.success) {
      showNotif(result.error || "Toplu güncelleme başarısız.", "error");
      return;
    }
    // UI'ı güncelle
    setLeads((prev) => prev.map((l) => (bulkSelection.has(l.id) ? { ...l, sector: bulkSelectedSector } : l)));
    showNotif(`${result.count ?? ids.length} lead'e "${bulkSelectedSector}" sektörü atandı.`, "success");
    // Reset state
    setBulkSelection(new Set());
    setBulkSectorOpen(false);
    setBulkSelectedSector("");
    setBulkSectorSearch("");
  }

  // ── Şablon Ekle (asıl işlem) ──
  async function handleAddTemplate(lead: Lead, sector: string) {
    setTemplating(lead.id);

    const slug = getTemplateName(sector);
    const city = extractCity(lead.address);
    const sorun = detectIssue({ hasWebsite: lead.hasWebsite, mobileScore: lead.mobileScore, sslValid: lead.sslValid, website: lead.website });
    const demoLink = buildDemoLink(lead.id, sector);

    const message = generateWaMessage({
      firma: lead.name,
      sektor: sector,
      sehir: city,
      sorun: sorun,
      link: demoLink,
      phone: formatWANumber(lead.phone!),
    });

    const result = await addWaTemplateToLead(lead.id, message, sector, slug);
    setTemplating(null);

    if (result.success) {
      setLeads((prev) =>
        prev.map((l) =>
          l.id === lead.id
            ? { ...l, status: "TEMPLATE_ADDED", sector, waTemplate: message, waTemplateSector: sector, waTemplateSlug: slug }
            : l
        )
      );
      showNotif(`${lead.name} için ${sector} şablonu hazırlandı!`, "success");
    } else {
      showNotif(result.error || "Şablon eklenemedi.", "error");
    }
  }

  // ── WA Gönder ──
  async function handleWaSend(lead: Lead) {
    if (!lead.waTemplate || !lead.phone) return;

    const waUrl = buildWaUrl(formatWANumber(lead.phone), lead.waTemplate);
    window.open(waUrl, "_blank");

    setWaSending(lead.id);
    const result = await markWaSent(lead.id);
    setWaSending(null);

    if (result.success) {
      setLeads((prev) =>
        prev.map((l) =>
          l.id === lead.id
            ? { ...l, status: "WA_SENT", waSentAt: new Date().toISOString() }
            : l
        )
      );
      showNotif(`${lead.name}'e WhatsApp mesajı gönderildi!`, "success");
    }
  }

  function openWhatsApp(phone: string | null) {
    if (!phone || !isGSM(phone)) return;
    window.open(`https://wa.me/${formatWANumber(phone)}`, "_blank");
  }

  const notifColors = {
    info: "border-admin-blue bg-admin-blue-dim text-admin-blue",
    success: "border-admin-green bg-admin-green-dim text-admin-green",
    error: "border-admin-red bg-admin-red-dim text-admin-red",
  };

  // Sektör arama filtresi
  const filteredSectors = sectorSearch
    ? sectors.filter((s) => s.toLowerCase().includes(sectorSearch.toLowerCase()))
    : sectors;

  // Toplu sektör modal için ayrı arama filtresi
  const filteredBulkSectors = bulkSectorSearch
    ? sectors.filter((s) => s.toLowerCase().includes(bulkSectorSearch.toLowerCase()))
    : sectors;

  return (
    <div className="space-y-4">
      {notification && (
        <div className={`rounded-lg border px-4 py-2.5 text-[12px] font-medium ${notifColors[notification.type]}`}>{notification.msg}</div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-admin-muted">{leads.length} lead</span>
          {bulkSelection.size > 0 && (
            <span className="rounded-full bg-admin-purple/15 px-2.5 py-0.5 text-[11px] font-medium text-admin-purple">
              {bulkSelection.size} seçili
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {bulkSelection.size > 0 && (
            <>
              <button
                onClick={() => setBulkSectorOpen(true)}
                className="rounded-lg bg-admin-purple px-4 py-2 text-[12px] font-medium text-white hover:brightness-110 transition-colors"
              >
                Toplu Sektör Ata ({bulkSelection.size})
              </button>
              <button
                onClick={() => setBulkSelection(new Set())}
                className="rounded-lg border border-admin-border px-3 py-2 text-[12px] text-admin-muted hover:text-admin-text transition-colors"
              >
                Seçimi Temizle
              </button>
            </>
          )}
          <button onClick={() => setShowNewModal(true)} className="rounded-lg bg-admin-accent px-4 py-2 text-[12px] font-medium text-white hover:brightness-110 transition-colors">
            + Yeni Lead
          </button>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2" style={{ minWidth: "max-content" }}>
        {columns.map((col) => {
          const colLeads = leads.filter((l) => l.status === col.key);
          return (
            <div key={col.key} className="flex w-64 shrink-0 flex-col rounded-xl border border-admin-border bg-admin-bg2 max-h-[calc(100vh-200px)]">
              {/* Sütun başlığı */}
              <div className="border-b border-admin-border px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{col.icon}</span>
                  <span className="text-[12px] font-medium">{col.label}</span>
                  <span className="ml-auto rounded-full bg-admin-bg4 px-1.5 py-0.5 text-[10px] font-medium text-admin-muted">{colLeads.length}</span>
                </div>
              </div>

              {/* Kartlar */}
              <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-2" style={{ minHeight: 120 }}>
                {colLeads.map((lead) => {
                  const daysAgo = Math.floor((Date.now() - new Date(lead.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
                  const needsFollowup = daysAgo >= 3 && col.key !== "WON" && col.key !== "LOST";
                  const src = sourceLabels[lead.source] || sourceLabels.MANUAL;
                  const canConvert = col.key === "QUOTED" || col.key === "CONTRACTED" || col.key === "WON";
                  const isCold = col.key === "COLD";
                  const isTemplateAdded = col.key === "TEMPLATE_ADDED";
                  const isWaSent = col.key === "WA_SENT";

                  const isSelected = bulkSelection.has(lead.id);
                  return (
                    <div key={lead.id} className="rounded-lg border bg-admin-bg3 p-3 transition-all"
                      style={{
                        borderColor: isSelected
                          ? "var(--color-admin-purple)"
                          : needsFollowup
                          ? "var(--color-admin-amber)"
                          : "var(--color-admin-border)",
                        boxShadow: isSelected ? "0 0 0 1px var(--color-admin-purple)" : undefined,
                      }}>
                      {/* Başlık — tıklanabilir + multi-select checkbox */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex min-w-0 items-start gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleBulkSelection(lead.id)}
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 cursor-pointer accent-admin-purple"
                            title="Toplu sektör ata için seç"
                          />
                          <button onClick={() => setDetailLead(lead)} className="text-left text-[12px] font-medium hover:text-admin-accent transition-colors">
                            {lead.name}
                          </button>
                        </div>
                        <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-medium ${src.color}`}>{src.label}</span>
                      </div>

                      {/* Sprint 3.5 — Attribution rozetleri (varsa göster).
                          Hover tooltip'te utmMedium/utmCampaign/referrer/sourceUrl. */}
                      {(lead.sourceDetail || lead.utmSource) && (() => {
                        const bucket = traceBucket(lead);
                        const tooltip = [
                          lead.utmMedium ? `medium: ${lead.utmMedium}` : null,
                          lead.utmCampaign ? `campaign: ${lead.utmCampaign}` : null,
                          lead.referrer ? `ref: ${lead.referrer}` : null,
                          lead.sourceUrl ? `url: ${lead.sourceUrl}` : null,
                        ].filter(Boolean).join("\n") || "bilgi yok";
                        return (
                          <div className="mt-1 flex flex-wrap items-center gap-1" title={tooltip}>
                            {lead.sourceDetail && (
                              <span className={`rounded px-1.5 py-0.5 text-[9px] font-medium ${bucket.cls}`}>
                                {lead.sourceDetail.length > 24 ? lead.sourceDetail.slice(0, 24) + "…" : lead.sourceDetail}
                              </span>
                            )}
                            {lead.utmSource && (
                              <span className={`rounded px-1.5 py-0.5 text-[9px] font-medium ${bucket.cls}`}>
                                utm:{lead.utmSource}
                              </span>
                            )}
                          </div>
                        );
                      })()}

                      {/* Firma (sadece farklıysa) */}
                      {lead.company && lead.company !== lead.name && (
                        <div className="mt-0.5 text-[10px] text-admin-muted">{lead.company}</div>
                      )}

                      {/* Sektör */}
                      {lead.sector ? (
                        <div className="mt-1 flex items-center gap-1">
                          <span className="text-[10px] text-admin-muted">{lead.sector}</span>
                          {lead.waTemplateSlug && (
                            <span className="rounded bg-admin-accent/10 px-1 py-0.5 text-[8px] font-medium text-admin-accent">
                              {lead.waTemplateSlug}
                            </span>
                          )}
                        </div>
                      ) : isCold ? (
                        <div className="mt-1 text-[9px] text-admin-amber">⚠ Sektör belirlenmemiş</div>
                      ) : null}

                      {/* WA Sent tarih (WA_SENT sütununda) */}
                      {isWaSent && lead.waSentAt && (
                        <div className="mt-1 text-[9px] text-admin-green">
                          ✓ Gönderildi: {new Date(lead.waSentAt).toLocaleDateString("tr-TR")}
                        </div>
                      )}

                      {/* Bütçe + Takip uyarısı */}
                      <div className="mt-2 flex items-center justify-between">
                        {lead.budget && lead.budget !== "—" ? (
                          <span className="text-[11px] font-medium text-admin-accent">{lead.budget}</span>
                        ) : <span />}
                        {needsFollowup && <span className="text-[9px] text-admin-amber">{daysAgo} gün</span>}
                      </div>

                      {/* Durum dropdown */}
                      <select value={lead.status} onChange={(e) => changeStatus(lead.id, e.target.value)}
                        className="mt-2 w-full rounded border border-admin-border bg-admin-bg4 px-2 py-1 text-[10px] text-admin-muted focus:border-admin-accent focus:outline-none">
                        {statusOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                      </select>

                      {/* Aksiyonlar */}
                      <div className="mt-2 flex flex-col gap-1.5">
                        {/* Satır 1: Şablon Ekle / WA Gönder / Normal WA */}
                        <div className="flex gap-1.5">
                          {/* COLD → Şablon Ekle butonu — HER ZAMAN GÖRÜNÜR */}
                          {isCold && (
                            <button
                              onClick={() => handleTemplateClick(lead)}
                              disabled={templating === lead.id}
                              className="flex-1 rounded bg-admin-purple/80 px-2 py-1.5 text-[9px] font-medium text-white hover:bg-admin-purple transition-colors disabled:opacity-50"
                            >
                              {templating === lead.id ? "Hazırlanıyor..." : "📝 Şablon Ekle"}
                            </button>
                          )}

                          {/* COLD → Normal WA butonu (sektörsüz ama GSM varsa) */}
                          {isCold && isGSM(lead.phone) && (
                            <button onClick={() => openWhatsApp(lead.phone)} className="rounded bg-[#25D366] px-2 py-1.5 text-[9px] font-medium text-white hover:brightness-110" title="Şablonsuz WA">WA</button>
                          )}

                          {/* TEMPLATE_ADDED → WA Gönder butonu */}
                          {isTemplateAdded && lead.waTemplate && (
                            <>
                              <button
                                onClick={() => handleWaSend(lead)}
                                disabled={waSending === lead.id}
                                className="flex-1 rounded bg-[#25D366] px-2 py-1.5 text-[9px] font-bold text-white hover:brightness-110 transition-colors disabled:opacity-50"
                              >
                                {waSending === lead.id ? "Gönderiliyor..." : "📲 WA Gönder"}
                              </button>
                              <button
                                onClick={() => setPreviewLead(lead)}
                                className="rounded border border-admin-border bg-admin-bg4 px-2 py-1.5 text-[9px] text-admin-muted hover:text-admin-text transition-colors"
                                title="Şablonu önizle"
                              >
                                👁
                              </button>
                            </>
                          )}

                          {/* Normal WA butonu (diğer sütunlarda) */}
                          {!isCold && !isTemplateAdded && isGSM(lead.phone) && (
                            <button onClick={() => openWhatsApp(lead.phone)} className="rounded bg-[#25D366] px-2 py-1 text-[9px] font-medium text-white hover:brightness-110">WA</button>
                          )}

                          {canConvert && (
                            <button onClick={() => handleConvert(lead)} disabled={converting === lead.id}
                              className="rounded bg-admin-accent px-2 py-1 text-[9px] font-medium text-white hover:brightness-110 disabled:opacity-50">
                              {converting === lead.id ? "..." : "CRM'e Taşı"}
                            </button>
                          )}
                        </div>

                        {/* Satır 2: Sil */}
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleDelete(lead)}
                            disabled={deleting === lead.id}
                            className="rounded px-2 py-0.5 text-[9px] font-medium text-admin-red hover:bg-admin-red-dim disabled:opacity-50"
                          >
                            {deleting === lead.id ? "..." : "Sil"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Boş sütun */}
                {colLeads.length === 0 && (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-admin-border py-8">
                    <span className="text-[20px] opacity-30">{col.icon}</span>
                    <span className="mt-1 text-[10px] text-admin-muted2">Henüz lead yok</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Modaller ── */}
      {showNewModal && <LeadFormModal onClose={() => { setShowNewModal(false); router.refresh(); }} />}
      {detailLead && (
        <LeadDetailModal
          lead={detailLead}
          onClose={() => setDetailLead(null)}
          onStatusChange={(id, status) => { changeStatus(id, status); setDetailLead(null); }}
          onConvert={(lead) => handleConvert(lead)}
        />
      )}

      {/* ── Sektör Seçici Modal ── */}
      {sectorPickLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setSectorPickLead(null)}>
          <div className="mx-4 w-full max-w-md rounded-2xl border border-admin-border bg-admin-bg2 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="border-b border-admin-border px-5 py-4">
              <h3 className="text-[14px] font-semibold text-admin-text">Sektör Seçin</h3>
              <p className="mt-1 text-[11px] text-admin-muted">
                <span className="font-medium text-admin-accent">{sectorPickLead.name}</span> için sektör belirleyin — şablon buna göre hazırlanacak
              </p>
            </div>

            {/* Arama */}
            <div className="border-b border-admin-border px-5 py-3">
              <input
                type="text"
                placeholder="Sektör ara..."
                value={sectorSearch}
                onChange={(e) => setSectorSearch(e.target.value)}
                autoFocus
                className="w-full rounded-lg border border-admin-border bg-admin-bg3 px-3 py-2 text-[12px] text-admin-text placeholder:text-admin-muted2 focus:border-admin-accent focus:outline-none"
              />
            </div>

            {/* Liste */}
            <div className="max-h-[300px] overflow-y-auto p-2">
              {filteredSectors.length === 0 ? (
                <div className="py-6 text-center text-[12px] text-admin-muted">Sonuç bulunamadı</div>
              ) : (
                filteredSectors.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSector(s)}
                    className={`w-full rounded-lg px-3 py-2 text-left text-[12px] transition-colors ${
                      selectedSector === s
                        ? "bg-admin-accent/15 font-medium text-admin-accent"
                        : "text-admin-text hover:bg-admin-bg3"
                    }`}
                  >
                    {s}
                    {selectedSector === s && <span className="ml-2">✓</span>}
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-2 border-t border-admin-border px-5 py-4">
              <button
                onClick={handleSectorConfirm}
                disabled={!selectedSector}
                className="flex-1 rounded-lg bg-admin-purple py-2.5 text-[12px] font-semibold text-white transition-colors hover:brightness-110 disabled:opacity-40"
              >
                {selectedSector ? `${selectedSector} — Şablon Hazırla` : "Sektör seçin"}
              </button>
              <button
                onClick={() => setSectorPickLead(null)}
                className="rounded-lg border border-admin-border px-4 py-2.5 text-[12px] text-admin-muted hover:text-admin-text transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toplu Sektör Atama Modal ── */}
      {bulkSectorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => !bulkLoading && setBulkSectorOpen(false)}>
          <div className="mx-4 w-full max-w-md rounded-2xl border border-admin-border bg-admin-bg2 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="border-b border-admin-border px-5 py-4">
              <h3 className="text-[14px] font-semibold text-admin-text">Toplu Sektör Ata</h3>
              <p className="mt-1 text-[11px] text-admin-muted">
                <span className="font-medium text-admin-purple">{bulkSelection.size} lead</span> için sektör belirleyin — hepsine aynı sektör atanacak
              </p>
            </div>

            {/* Arama */}
            <div className="border-b border-admin-border px-5 py-3">
              <input
                type="text"
                placeholder="Sektör ara..."
                value={bulkSectorSearch}
                onChange={(e) => setBulkSectorSearch(e.target.value)}
                autoFocus
                className="w-full rounded-lg border border-admin-border bg-admin-bg3 px-3 py-2 text-[12px] text-admin-text placeholder:text-admin-muted2 focus:border-admin-purple focus:outline-none"
              />
            </div>

            {/* Liste */}
            <div className="max-h-[300px] overflow-y-auto p-2">
              {filteredBulkSectors.length === 0 ? (
                <div className="py-6 text-center text-[12px] text-admin-muted">Sonuç bulunamadı</div>
              ) : (
                filteredBulkSectors.map((s) => (
                  <button
                    key={s}
                    onClick={() => setBulkSelectedSector(s)}
                    className={`w-full rounded-lg px-3 py-2 text-left text-[12px] transition-colors ${
                      bulkSelectedSector === s
                        ? "bg-admin-purple/15 font-medium text-admin-purple"
                        : "text-admin-text hover:bg-admin-bg3"
                    }`}
                  >
                    {s}
                    {bulkSelectedSector === s && <span className="ml-2">✓</span>}
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-2 border-t border-admin-border px-5 py-4">
              <button
                onClick={handleBulkSectorConfirm}
                disabled={!bulkSelectedSector || bulkLoading}
                className="flex-1 rounded-lg bg-admin-purple py-2.5 text-[12px] font-semibold text-white transition-colors hover:brightness-110 disabled:opacity-40"
              >
                {bulkLoading
                  ? "Güncelleniyor..."
                  : bulkSelectedSector
                  ? `${bulkSelection.size} lead'e "${bulkSelectedSector}" ata`
                  : "Sektör seçin"}
              </button>
              <button
                onClick={() => setBulkSectorOpen(false)}
                disabled={bulkLoading}
                className="rounded-lg border border-admin-border px-4 py-2.5 text-[12px] text-admin-muted hover:text-admin-text transition-colors disabled:opacity-40"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Şablon Önizleme Modal ── */}
      {previewLead && previewLead.waTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setPreviewLead(null)}>
          <div className="mx-4 w-full max-w-lg rounded-2xl border border-admin-border bg-admin-bg2 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-admin-border px-5 py-4">
              <div>
                <h3 className="text-[14px] font-semibold text-admin-text">WhatsApp Şablon Önizleme</h3>
                <p className="mt-0.5 text-[11px] text-admin-muted">{previewLead.name} — {previewLead.waTemplateSector}</p>
              </div>
              <button onClick={() => setPreviewLead(null)} className="flex h-7 w-7 items-center justify-center rounded-lg text-admin-muted hover:bg-admin-bg3 hover:text-admin-text">✕</button>
            </div>

            {/* Mesaj içeriği — WA tarzı baloncuk */}
            <div className="p-5">
              <div className="rounded-xl bg-[#005C4B] p-4">
                <pre className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-white/90">
                  {previewLead.waTemplate}
                </pre>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-2 border-t border-admin-border px-5 py-4">
              <button
                onClick={() => {
                  handleWaSend(previewLead);
                  setPreviewLead(null);
                }}
                className="flex-1 rounded-lg bg-[#25D366] py-2.5 text-[12px] font-bold text-white hover:brightness-110 transition-colors"
              >
                📲 WhatsApp ile Gönder
              </button>
              <button
                onClick={() => setPreviewLead(null)}
                className="rounded-lg border border-admin-border px-4 py-2.5 text-[12px] text-admin-muted hover:text-admin-text transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
