"use client";

import { useState, useTransition } from "react";
import { markSubmissionRead, markAllSubmissionsRead } from "@/actions/chat-submissions";

interface Submission {
  id: string;
  slug: string;
  firmName: string;
  contactName: string | null;
  contactPhone: string | null;
  siteType: string | null;
  features: string[];
  pageCount: string | null;
  contentStatus: string | null;
  hostingStatus: string | null;
  domainStatus: string | null;
  timeline: string | null;
  message: string | null;
  sector: string | null;
  city: string | null;
  completedSteps: number;
  score: string;
  calculatedPrice: number | null;
  estimatedHours: number | null;
  tokenCost: number | null;
  freeQuestions: Array<{
    question: string;
    answer: string;
    step: number;
    timestamp: string;
  }>;
  isRead: boolean;
  createdAt: string;
  lead: { id: string; name: string; phone: string | null; status: string } | null;
}

interface Props {
  initialData: Submission[];
}

// ── Score badge renkleri ──
const SCORE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  hot: { bg: "bg-red-500/15", text: "text-red-400", label: "Sıcak" },
  warm: { bg: "bg-amber-500/15", text: "text-amber-400", label: "Ilık" },
  cold: { bg: "bg-blue-500/15", text: "text-blue-400", label: "Soğuk" },
};

// ── Timeline etiketleri ──
const TIMELINE_LABELS: Record<string, string> = {
  acil: "Acil (2 hafta)",
  "1-ay": "1 ay içinde",
  "2-3-ay": "2-3 ay içinde",
  esnek: "Esnek",
};

// ── Site türü etiketleri ──
const SITE_TYPE_LABELS: Record<string, string> = {
  tanitim: "Tanıtım Sitesi",
  "e-ticaret": "E-Ticaret",
  portfoy: "Portföy",
  randevu: "Randevu Sistemi",
  katalog: "Katalog",
  belirsiz: "Belirsiz",
};

export default function SubmissionsDashboard({ initialData }: Props) {
  const [items, setItems] = useState(initialData);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "hot" | "warm" | "cold" | "unread">("all");
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  // Filtre
  const filtered = items.filter((s) => {
    if (filter === "unread" && s.isRead) return false;
    if (filter === "hot" && s.score !== "hot") return false;
    if (filter === "warm" && s.score !== "warm") return false;
    if (filter === "cold" && s.score !== "cold") return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.firmName.toLowerCase().includes(q) ||
        (s.contactName?.toLowerCase().includes(q) ?? false) ||
        (s.contactPhone?.includes(q) ?? false) ||
        (s.sector?.toLowerCase().includes(q) ?? false) ||
        (s.city?.toLowerCase().includes(q) ?? false)
      );
    }
    return true;
  });

  const selected = items.find((s) => s.id === selectedId);

  // İstatistikler
  const stats = {
    total: items.length,
    unread: items.filter((s) => !s.isRead).length,
    hot: items.filter((s) => s.score === "hot").length,
    warm: items.filter((s) => s.score === "warm").length,
    cold: items.filter((s) => s.score === "cold").length,
    withPhone: items.filter((s) => s.contactPhone).length,
  };

  // Okundu işaretle
  function handleMarkRead(id: string) {
    startTransition(async () => {
      const res = await markSubmissionRead(id);
      if (res.success) {
        setItems((prev) => prev.map((s) => (s.id === id ? { ...s, isRead: true } : s)));
      }
    });
  }

  // Hepsini okundu yap
  function handleMarkAllRead() {
    startTransition(async () => {
      const res = await markAllSubmissionsRead();
      if (res.success) {
        setItems((prev) => prev.map((s) => ({ ...s, isRead: true })));
      }
    });
  }

  // Tarih formatla
  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="space-y-4">
      {/* ── İstatistik kartları ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { label: "Toplam", value: stats.total, color: "text-admin-text" },
          { label: "Okunmamış", value: stats.unread, color: "text-admin-accent" },
          { label: "Sıcak", value: stats.hot, color: "text-red-400" },
          { label: "Ilık", value: stats.warm, color: "text-amber-400" },
          { label: "Soğuk", value: stats.cold, color: "text-blue-400" },
          { label: "Telefonlu", value: stats.withPhone, color: "text-emerald-400" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-admin-border bg-admin-bg2 p-3"
          >
            <div className="text-[11px] uppercase tracking-wider text-admin-muted">
              {s.label}
            </div>
            <div className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Arama */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-muted"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx={11} cy={11} r={8} />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Firma, kişi, sektör veya şehir ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-admin-border bg-admin-bg2 py-2 pl-10 pr-4 text-sm text-admin-text placeholder-admin-muted outline-none transition-colors focus:border-admin-accent focus:ring-1 focus:ring-admin-accent/30"
          />
        </div>

        {/* Filtre butonları */}
        <div className="flex gap-1 rounded-lg border border-admin-border bg-admin-bg p-1">
          {(
            [
              { key: "all", label: "Tümü" },
              { key: "unread", label: "Okunmamış" },
              { key: "hot", label: "Sıcak" },
              { key: "warm", label: "Ilık" },
              { key: "cold", label: "Soğuk" },
            ] as const
          ).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f.key
                  ? "bg-admin-accent text-white"
                  : "text-admin-muted hover:text-admin-text"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Tümünü okundu yap */}
        {stats.unread > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={isPending}
            className="flex items-center gap-1.5 rounded-lg border border-admin-border bg-admin-bg2 px-3 py-2 text-xs text-admin-muted transition-colors hover:text-admin-text disabled:opacity-50"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Tümünü Okundu Yap
          </button>
        )}
      </div>

      {/* ── Ana içerik — Liste + Detay ── */}
      <div className="flex gap-4">
        {/* Sol — Liste */}
        <div className="w-full space-y-2 lg:w-1/2">
          {filtered.length === 0 && (
            <div className="rounded-xl border border-admin-border bg-admin-bg2 p-12 text-center">
              <p className="text-sm text-admin-muted">
                {search ? `"${search}" için sonuç bulunamadı.` : "Henüz başvuru yok."}
              </p>
            </div>
          )}

          {filtered.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedId(s.id);
                if (!s.isRead) handleMarkRead(s.id);
              }}
              className={`w-full rounded-xl border p-4 text-left transition-all ${
                selectedId === s.id
                  ? "border-admin-accent bg-admin-accent/5"
                  : "border-admin-border bg-admin-bg2 hover:border-admin-border/80 hover:bg-admin-bg"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {!s.isRead && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-admin-accent" />
                    )}
                    <span className="truncate text-sm font-medium text-admin-text">
                      {s.firmName}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-admin-muted">
                    {s.contactName && <span>{s.contactName}</span>}
                    {s.sector && <span>· {s.sector}</span>}
                    {s.city && <span>· {s.city}</span>}
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  {/* Score badge */}
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      SCORE_STYLES[s.score]?.bg || ""
                    } ${SCORE_STYLES[s.score]?.text || ""}`}
                  >
                    {SCORE_STYLES[s.score]?.label || s.score}
                  </span>
                  <span className="text-[10px] text-admin-muted">
                    {formatDate(s.createdAt)}
                  </span>
                </div>
              </div>

              {/* Alt bilgi çubuğu */}
              <div className="mt-2 flex items-center gap-3 text-[11px] text-admin-muted">
                {s.siteType && (
                  <span>{SITE_TYPE_LABELS[s.siteType] || s.siteType}</span>
                )}
                {s.timeline && (
                  <span>· {TIMELINE_LABELS[s.timeline] || s.timeline}</span>
                )}
                {s.contactPhone && (
                  <span className="ml-auto flex items-center gap-1 text-emerald-400">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {s.contactPhone}
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-admin-border">
                  <div
                    className={`h-full rounded-full transition-all ${
                      s.completedSteps >= 10
                        ? "bg-emerald-500"
                        : s.completedSteps >= 5
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${(s.completedSteps / 10) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-admin-muted">
                  {s.completedSteps}/10
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Sağ — Detay */}
        <div className="hidden lg:block lg:w-1/2">
          {selected ? (
            <div className="sticky top-6 space-y-4 rounded-xl border border-admin-border bg-admin-bg2 p-5">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-admin-text">
                    {selected.firmName}
                  </h2>
                  <div className="mt-1 text-xs text-admin-muted">
                    {formatDate(selected.createdAt)}
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    SCORE_STYLES[selected.score]?.bg || ""
                  } ${SCORE_STYLES[selected.score]?.text || ""}`}
                >
                  {SCORE_STYLES[selected.score]?.label || selected.score}
                </span>
              </div>

              {/* İletişim bilgileri */}
              {(selected.contactName || selected.contactPhone) && (
                <div className="rounded-lg border border-admin-border bg-admin-bg p-3">
                  <div className="text-[11px] uppercase tracking-wider text-admin-muted">
                    İletişim
                  </div>
                  <div className="mt-2 space-y-1 text-sm text-admin-text">
                    {selected.contactName && (
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-admin-muted" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {selected.contactName}
                      </div>
                    )}
                    {selected.contactPhone && (
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <a
                          href={`https://wa.me/90${selected.contactPhone.replace(/\D/g, "").replace(/^0/, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 underline-offset-2 hover:underline"
                        >
                          {selected.contactPhone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Proje detayları */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Site Türü", value: selected.siteType ? SITE_TYPE_LABELS[selected.siteType] || selected.siteType : null },
                  { label: "Sayfa Sayısı", value: selected.pageCount },
                  { label: "İçerik Durumu", value: selected.contentStatus },
                  { label: "Hosting", value: selected.hostingStatus },
                  { label: "Domain", value: selected.domainStatus },
                  { label: "Zamanlama", value: selected.timeline ? TIMELINE_LABELS[selected.timeline] || selected.timeline : null },
                  { label: "Sektör", value: selected.sector },
                  { label: "Şehir", value: selected.city },
                ].map(
                  (field) =>
                    field.value && (
                      <div key={field.label} className="rounded-lg border border-admin-border bg-admin-bg p-2.5">
                        <div className="text-[10px] uppercase tracking-wider text-admin-muted">
                          {field.label}
                        </div>
                        <div className="mt-0.5 text-sm text-admin-text">
                          {field.value}
                        </div>
                      </div>
                    )
                )}
              </div>

              {/* Özellikler */}
              {selected.features && selected.features.length > 0 && (
                <div>
                  <div className="mb-2 text-[11px] uppercase tracking-wider text-admin-muted">
                    Seçilen Özellikler
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.features.map((f) => (
                      <span
                        key={f}
                        className="rounded-full bg-admin-accent/10 px-2.5 py-1 text-[11px] text-admin-accent"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Mesaj */}
              {selected.message && (
                <div className="rounded-lg border border-admin-border bg-admin-bg p-3">
                  <div className="text-[10px] uppercase tracking-wider text-admin-muted">
                    Ek Not
                  </div>
                  <div className="mt-1.5 text-sm text-admin-text">
                    {selected.message}
                  </div>
                </div>
              )}

              {/* Serbest sorular */}
              {selected.freeQuestions && selected.freeQuestions.length > 0 && (
                <div>
                  <div className="mb-2 text-[11px] uppercase tracking-wider text-admin-muted">
                    Serbest Sorular ({selected.freeQuestions.length})
                  </div>
                  <div className="space-y-2">
                    {selected.freeQuestions.map((fq, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-admin-border bg-admin-bg p-3 text-sm"
                      >
                        <div className="font-medium text-admin-text">
                          S: {fq.question}
                        </div>
                        <div className="mt-1 text-admin-muted">
                          C: {fq.answer}
                        </div>
                        <div className="mt-1 text-[10px] text-admin-muted">
                          Adım {fq.step} · {new Date(fq.timestamp).toLocaleString("tr-TR")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lead bağlantısı */}
              {selected.lead && (
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                  <div className="flex items-center gap-2 text-xs text-emerald-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Lead ile bağlantılı: {selected.lead.name}
                    <a
                      href={`/admin/leads`}
                      className="ml-auto text-xs underline underline-offset-2"
                    >
                      Lead&apos;e Git
                    </a>
                  </div>
                </div>
              )}

              {/* Slug */}
              <div className="text-[10px] text-admin-muted">
                Slug: <code className="rounded bg-admin-bg px-1 py-0.5">{selected.slug}</code>
              </div>
            </div>
          ) : (
            <div className="flex h-[400px] items-center justify-center rounded-xl border border-admin-border bg-admin-bg2">
              <div className="text-center text-admin-muted">
                <svg className="mx-auto mb-3 h-12 w-12 opacity-30" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-sm">Detayları görmek için bir başvuru seçin</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
