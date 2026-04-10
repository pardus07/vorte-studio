"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Phone,
  Clock,
  Timer,
  PhoneMissed,
  Play,
  Pause,
  MessageSquare,
  Tag,
  Eye,
  EyeOff,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
  Volume2,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

interface VoiceCall {
  id: string;
  callerNumber: string;
  status: "completed" | "missed" | "failed";
  durationSeconds: number;
  topics: string[];
  summary: string | null;
  sentiment: "positive" | "neutral" | "negative" | null;
  isRead: boolean;
  startedAt: string;
  createdAt: string;
  transcript: TranscriptMessage[] | null;
  notes: string | null;
  audioUrl: string | null;
}

interface TranscriptMessage {
  role: "assistant" | "caller";
  text: string;
  timestamp: string;
}

interface CallsResponse {
  calls: VoiceCall[];
  total: number;
  stats: {
    todayCalls: number;
    totalDuration: number;
    avgDuration: number;
    missedCalls: number;
  };
}

// ── Constants ──────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: "", label: "Tümü" },
  { value: "completed", label: "Tamamlandı" },
  { value: "missed", label: "Cevapsız" },
  { value: "failed", label: "Başarısız" },
];

const STATUS_STYLES: Record<string, { label: string; cls: string }> = {
  completed: {
    label: "Tamamlandı",
    cls: "bg-green-500/15 text-green-400 border-green-500/20",
  },
  missed: {
    label: "Cevapsız",
    cls: "bg-red-500/15 text-red-400 border-red-500/20",
  },
  failed: {
    label: "Başarısız",
    cls: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
  },
};

const TOPIC_COLORS: Record<string, string> = {
  paket: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  teklif: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  hosting: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  domain: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  tasarım: "bg-pink-500/15 text-pink-400 border-pink-500/20",
  destek: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  fiyat: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  genel: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
};

const SENTIMENT_MAP: Record<
  string,
  { emoji: string; label: string; color: string }
> = {
  positive: { emoji: "\ud83d\ude0a", label: "Pozitif", color: "text-green-400" },
  neutral: { emoji: "\ud83d\ude10", label: "Nötr", color: "text-zinc-400" },
  negative: { emoji: "\ud83d\ude1f", label: "Negatif", color: "text-red-400" },
};

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m > 0) return `${m}dk ${s}sn`;
  return `${s}sn`;
}

function formatDurationLong(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}sa ${m}dk`;
  return `${m}dk`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const months = [
    "Oca", "Şub", "Mar", "Nis", "May", "Haz",
    "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara",
  ];
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const mins = String(d.getMinutes()).padStart(2, "0");
  return `${day} ${month} ${year} ${hours}:${mins}`;
}

// ── Component ──────────────────────────────────────────────────────────────

export default function AdminVoiceCallsPage() {
  const [calls, setCalls] = useState<VoiceCall[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState({
    todayCalls: 0,
    totalDuration: 0,
    avgDuration: 0,
    missedCalls: 0,
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Detail modal
  const [selectedCall, setSelectedCall] = useState<VoiceCall | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const limit = 20;

  // ── Fetch calls ──

  const fetchCalls = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);

    try {
      const res = await fetch(`/api/admin/voice-calls?${params}`);
      if (!res.ok) throw new Error("Fetch failed");
      const data: CallsResponse = await res.json();
      setCalls(data.calls || []);
      setTotal(data.total || 0);
      setStats(
        data.stats || {
          todayCalls: 0,
          totalDuration: 0,
          avgDuration: 0,
          missedCalls: 0,
        }
      );
    } catch {
      setError("Sesli aramalar yüklenemedi");
    }
    setLoading(false);
  }, [page, dateFrom, dateTo, search, statusFilter]);

  useEffect(() => {
    fetchCalls();
  }, [fetchCalls]);

  // ── Handlers ──

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCalls();
  };

  const clearFilters = () => {
    setSearch("");
    setDateFrom("");
    setDateTo("");
    setStatusFilter("");
    setPage(1);
  };

  const openDetail = (call: VoiceCall) => {
    setSelectedCall(call);
    setAdminNote(call.notes || "");
    setIsPlaying(false);

    if (!call.isRead) {
      setCalls((prev) =>
        prev.map((c) => (c.id === call.id ? { ...c, isRead: true } : c))
      );
      fetch(`/api/admin/voice-calls/${call.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      }).catch(() => {});
    }
  };

  const closeDetail = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setSelectedCall(null);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const saveNote = async () => {
    if (!selectedCall) return;
    setSavingNote(true);
    try {
      await fetch(`/api/admin/voice-calls/${selectedCall.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: adminNote }),
      });
      setCalls((prev) =>
        prev.map((c) =>
          c.id === selectedCall.id ? { ...c, notes: adminNote } : c
        )
      );
      setSelectedCall({ ...selectedCall, notes: adminNote });
    } catch {
      // silent
    }
    setSavingNote(false);
  };

  const toggleReadStatus = async () => {
    if (!selectedCall) return;
    const newStatus = !selectedCall.isRead;
    setSelectedCall({ ...selectedCall, isRead: newStatus });
    setCalls((prev) =>
      prev.map((c) =>
        c.id === selectedCall.id ? { ...c, isRead: newStatus } : c
      )
    );
    try {
      await fetch(`/api/admin/voice-calls/${selectedCall.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: newStatus }),
      });
    } catch {
      setSelectedCall({ ...selectedCall, isRead: !newStatus });
      setCalls((prev) =>
        prev.map((c) =>
          c.id === selectedCall.id ? { ...c, isRead: !newStatus } : c
        )
      );
    }
  };

  const totalPages = Math.ceil(total / limit);
  const hasFilters = search || dateFrom || dateTo || statusFilter;

  // ── KPI Cards ──

  const kpiCards = [
    {
      label: "Bugünkü Aramalar",
      value: stats.todayCalls,
      icon: Phone,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Toplam Konuşma Süresi",
      value: formatDurationLong(stats.totalDuration),
      icon: Clock,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Ortalama Süre",
      value: formatDuration(stats.avgDuration),
      icon: Timer,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      label: "Cevapsız Aramalar",
      value: stats.missedCalls,
      icon: PhoneMissed,
      color: "text-red-400",
      bg: "bg-red-500/10",
    },
  ];

  // ── Render ──

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-admin-text">
          Sesli Aramalar
        </h1>
        <p className="mt-1 text-[13px] text-admin-muted">
          {total} arama kaydı bulunuyor
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="rounded-2xl border border-admin-border bg-admin-bg2 p-5"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${kpi.bg}`}
                >
                  <Icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
                <div>
                  <p className="text-[13px] text-admin-muted">{kpi.label}</p>
                  <p className="text-xl font-bold tracking-tight text-admin-text">
                    {kpi.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters Section */}
      <div className="rounded-2xl border border-admin-border bg-admin-bg2 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          {/* Date range */}
          <div className="flex items-center gap-2">
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-admin-muted">
                Başlangıç
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-admin-border bg-admin-bg px-3 py-2 text-sm text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-accent/30 focus:border-admin-accent"
              />
            </div>
            <span className="mt-6 text-sm text-admin-muted">&mdash;</span>
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-admin-muted">
                Bitiş
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-admin-border bg-admin-bg px-3 py-2 text-sm text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-accent/30 focus:border-admin-accent"
              />
            </div>
          </div>

          {/* Number search */}
          <form onSubmit={handleSearch} className="flex flex-1 gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Numara ara..."
                className="w-full rounded-xl border border-admin-border bg-admin-bg py-2 pl-9 pr-3 text-sm text-admin-text placeholder:text-admin-muted focus:outline-none focus:ring-2 focus:ring-admin-accent/30 focus:border-admin-accent"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-admin-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-admin-accent/90 active:scale-[0.98]"
            >
              <Search className="h-3.5 w-3.5" />
              Ara
            </button>
          </form>

          {/* Status pill tabs */}
          <div className="flex items-center gap-1 rounded-xl bg-admin-bg p-1">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setStatusFilter(opt.value);
                  setPage(1);
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  statusFilter === opt.value
                    ? "bg-admin-bg2 text-admin-text shadow-sm"
                    : "text-admin-muted hover:text-admin-text"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Clear filters */}
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-admin-muted transition hover:bg-admin-bg hover:text-admin-text"
            >
              <X className="h-3.5 w-3.5" />
              Temizle
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-admin-border bg-admin-bg2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-admin-border border-t-admin-accent" />
            <p className="mt-3 text-[13px] text-admin-muted">
              Aramalar yükleniyor...
            </p>
          </div>
        ) : calls.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-admin-bg">
              <Phone className="h-6 w-6 text-admin-muted" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-admin-text">
              {hasFilters ? "Sonuç bulunamadı" : "Henüz arama yok"}
            </h3>
            <p className="mt-1 text-[13px] text-admin-muted">
              {hasFilters
                ? "Filtreleri değiştirmeyi veya temizlemeyi deneyin."
                : "Sesli arama geldiğinde burada listelenecek."}
            </p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 rounded-xl border border-admin-border px-4 py-2 text-xs font-medium text-admin-muted transition hover:bg-admin-bg hover:text-admin-text"
              >
                Filtreleri Temizle
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-admin-border bg-admin-bg/50">
                  <tr>
                    <th className="px-5 py-3.5 text-[12px] font-semibold uppercase tracking-wider text-admin-muted">
                      Tarih / Saat
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-semibold uppercase tracking-wider text-admin-muted">
                      Arayan Numara
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-semibold uppercase tracking-wider text-admin-muted">
                      Süre
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-semibold uppercase tracking-wider text-admin-muted">
                      Konular
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-semibold uppercase tracking-wider text-admin-muted">
                      Durum
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-semibold uppercase tracking-wider text-admin-muted">
                      Özet
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-semibold uppercase tracking-wider text-admin-muted">
                      İşlem
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-admin-border">
                  {calls.map((call) => {
                    const statusInfo = STATUS_STYLES[call.status] || {
                      label: call.status,
                      cls: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
                    };
                    return (
                      <tr
                        key={call.id}
                        className={`transition-colors hover:bg-admin-bg/40 ${
                          !call.isRead
                            ? "border-l-2 border-l-admin-accent bg-admin-accent/5"
                            : "border-l-2 border-l-transparent"
                        }`}
                      >
                        <td className="whitespace-nowrap px-5 py-3.5 text-[13px] text-admin-muted">
                          {formatDate(call.startedAt)}
                        </td>
                        <td className="px-5 py-3.5 text-[13px] font-medium text-admin-text">
                          {call.callerNumber}
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5 text-[13px] text-admin-muted">
                          {call.status === "missed"
                            ? "—"
                            : formatDuration(call.durationSeconds)}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex flex-wrap gap-1">
                            {call.topics.map((topic) => (
                              <span
                                key={topic}
                                className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                                  TOPIC_COLORS[topic.toLowerCase()] ||
                                  "bg-zinc-500/15 text-zinc-400 border-zinc-500/20"
                                }`}
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusInfo.cls}`}
                          >
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="max-w-[200px] truncate px-5 py-3.5 text-[13px] text-admin-muted">
                          {call.summary || "—"}
                        </td>
                        <td className="px-5 py-3.5">
                          <button
                            onClick={() => openDetail(call)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-admin-border bg-admin-bg px-3 py-1.5 text-xs font-medium text-admin-muted transition-all hover:bg-admin-bg3 hover:text-admin-text"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            Detay
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-admin-border px-5 py-4">
                <p className="text-[13px] text-admin-muted">
                  Sayfa{" "}
                  <span className="font-medium text-admin-text">{page}</span> /{" "}
                  {totalPages} &middot; Toplam{" "}
                  <span className="font-medium text-admin-text">{total}</span>{" "}
                  arama
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(1)}
                    disabled={page <= 1}
                    className="rounded-xl border border-admin-border bg-admin-bg px-2.5 py-1.5 text-xs font-medium text-admin-muted transition-all hover:bg-admin-bg3 disabled:opacity-40"
                  >
                    İlk
                  </button>
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                    className="rounded-xl border border-admin-border bg-admin-bg p-1.5 text-admin-muted transition-all hover:bg-admin-bg3 disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {Array.from(
                    { length: Math.min(totalPages, 5) },
                    (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`min-w-[36px] rounded-xl border px-3 py-1.5 text-xs font-medium transition-all ${
                            page === pageNum
                              ? "border-admin-accent bg-admin-accent/10 text-admin-accent"
                              : "border-admin-border bg-admin-bg text-admin-muted hover:bg-admin-bg3"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                    className="rounded-xl border border-admin-border bg-admin-bg p-1.5 text-admin-muted transition-all hover:bg-admin-bg3 disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setPage(totalPages)}
                    disabled={page >= totalPages}
                    className="rounded-xl border border-admin-border bg-admin-bg px-2.5 py-1.5 text-xs font-medium text-admin-muted transition-all hover:bg-admin-bg3 disabled:opacity-40"
                  >
                    Son
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Detail Modal ────────────────────────────────────────────────── */}
      {selectedCall && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4 pt-10"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDetail();
          }}
        >
          <div className="w-full max-w-2xl rounded-2xl border border-admin-border bg-admin-bg2 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-admin-border px-6 py-5">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-admin-text">
                  Arama Detayı
                </h2>
                <p className="mt-0.5 text-[13px] text-admin-muted">
                  {selectedCall.callerNumber} &middot;{" "}
                  {formatDate(selectedCall.startedAt)}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={toggleReadStatus}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-admin-muted transition-colors hover:bg-admin-bg3 hover:text-admin-text"
                  title={
                    selectedCall.isRead
                      ? "Okunmadı işaretle"
                      : "Okundu işaretle"
                  }
                >
                  {selectedCall.isRead ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={closeDetail}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-admin-muted transition-colors hover:bg-admin-bg3 hover:text-admin-text"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-5">
              {/* Audio Player */}
              {selectedCall.status === "completed" && (
                <div className="rounded-xl border border-admin-border bg-admin-bg p-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={togglePlay}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-admin-accent text-white shadow-md transition-all hover:bg-admin-accent/90 active:scale-95"
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="ml-0.5 h-4 w-4" />
                      )}
                    </button>
                    <div className="flex-1">
                      <audio
                        ref={audioRef}
                        src={`/api/admin/voice-calls/${selectedCall.id}/audio`}
                        onEnded={() => setIsPlaying(false)}
                        onPause={() => setIsPlaying(false)}
                        onPlay={() => setIsPlaying(true)}
                        controls
                        className="w-full"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 rounded-lg bg-admin-bg2 px-2.5 py-1 text-[13px] font-medium text-admin-muted">
                      <Volume2 className="h-3.5 w-3.5" />
                      {formatDuration(selectedCall.durationSeconds)}
                    </div>
                  </div>
                </div>
              )}

              {/* Transcript */}
              {selectedCall.transcript &&
                selectedCall.transcript.length > 0 && (
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-admin-muted">
                      <MessageSquare className="h-4 w-4" />
                      Transkript
                    </h3>
                    <div className="space-y-2.5 rounded-xl border border-admin-border bg-admin-bg p-4">
                      {selectedCall.transcript.map((msg, i) => (
                        <div
                          key={i}
                          className={`flex ${
                            msg.role === "caller"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                              msg.role === "caller"
                                ? "rounded-br-md bg-admin-accent/10 text-admin-text"
                                : "rounded-bl-md bg-admin-bg2 text-admin-text ring-1 ring-admin-border"
                            }`}
                          >
                            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-admin-muted">
                              {msg.role === "assistant"
                                ? "Vorte Asistan"
                                : "Arayan"}
                            </p>
                            <p className="text-sm leading-relaxed">
                              {msg.text}
                            </p>
                            <p className="mt-1.5 text-right text-[10px] text-admin-muted">
                              {msg.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* AI Summary */}
              {selectedCall.summary && (
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
                  <h3 className="mb-1.5 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-blue-400">
                    <FileText className="h-3.5 w-3.5" />
                    AI Özet
                  </h3>
                  <p className="text-sm leading-relaxed text-blue-300">
                    {selectedCall.summary}
                  </p>
                </div>
              )}

              {/* Topics & Sentiment */}
              {(selectedCall.topics.length > 0 || selectedCall.sentiment) && (
                <div className="flex flex-wrap items-center gap-4">
                  {selectedCall.topics.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-admin-muted" />
                      <div className="flex flex-wrap gap-1.5">
                        {selectedCall.topics.map((topic) => (
                          <span
                            key={topic}
                            className={`inline-block rounded-full border px-2.5 py-1 text-xs font-medium ${
                              TOPIC_COLORS[topic.toLowerCase()] ||
                              "bg-zinc-500/15 text-zinc-400 border-zinc-500/20"
                            }`}
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedCall.sentiment && (
                    <div className="flex items-center gap-1.5 rounded-full bg-admin-bg px-3 py-1">
                      <span className="text-[12px] font-medium text-admin-muted">
                        Duygu:
                      </span>
                      <span
                        className={`text-[13px] font-semibold ${
                          SENTIMENT_MAP[selectedCall.sentiment]?.color || ""
                        }`}
                      >
                        {SENTIMENT_MAP[selectedCall.sentiment]?.emoji}{" "}
                        {SENTIMENT_MAP[selectedCall.sentiment]?.label}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Admin Note */}
              <div>
                <h3 className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-admin-muted">
                  Admin Notu
                </h3>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Bu arama hakkında not ekleyin..."
                  rows={3}
                  className="w-full rounded-xl border border-admin-border bg-admin-bg px-4 py-3 text-sm text-admin-text placeholder:text-admin-muted focus:outline-none focus:ring-2 focus:ring-admin-accent/30 focus:border-admin-accent"
                />
                <div className="mt-2.5 flex justify-end">
                  <button
                    onClick={saveNote}
                    disabled={savingNote}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-admin-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-admin-accent/90 active:scale-[0.98] disabled:opacity-50"
                  >
                    {savingNote ? "Kaydediliyor..." : "Notu Kaydet"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
