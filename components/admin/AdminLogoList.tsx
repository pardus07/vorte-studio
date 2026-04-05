"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createLogoProject } from "@/actions/logo";

interface LogoProjectItem {
  id: string;
  firmName: string;
  sector: string | null;
  style: string | null;
  status: string;
  approvedLogoUrl: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  portalUser: { email: string; name: string };
  variants: { id: string; url: string }[];
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Taslak", color: "text-admin-muted" },
  GENERATING: { label: "Üretiliyor", color: "text-admin-amber" },
  REVIEW: { label: "İncelemede", color: "text-admin-blue" },
  APPROVED: { label: "Onaylandı", color: "text-admin-green" },
};

const STYLE_LABELS: Record<string, string> = {
  minimal: "Minimal",
  modern: "Modern",
  vintage: "Vintage",
  playful: "Eğlenceli",
  luxury: "Lüks",
  tech: "Teknolojik",
};

export default function AdminLogoList({ projects }: { projects: LogoProjectItem[] }) {
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const filtered = projects.filter(
    (p) =>
      p.firmName.toLowerCase().includes(search.toLowerCase()) ||
      p.portalUser.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-admin-text">Logo & Marka</h1>
          <p className="mt-1 text-sm text-admin-muted">
            {projects.length} proje
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-xl bg-admin-accent px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Yeni Logo Projesi
        </button>
      </div>

      {/* Arama */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Firma veya kişi ara..."
          className="w-full rounded-xl border border-admin-border bg-admin-bg2 px-4 py-2.5 text-sm text-admin-text placeholder-admin-muted2 outline-none focus:border-admin-accent/40"
        />
      </div>

      {/* Proje kartları */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-admin-border bg-admin-bg2 py-20">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.03]">
            <svg className="h-8 w-8 text-admin-muted2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
          </div>
          <p className="text-sm text-admin-muted">Henüz logo projesi yok</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const st = STATUS_MAP[p.status] || STATUS_MAP.DRAFT;
            return (
              <Link
                key={p.id}
                href={`/admin/logo/${p.id}`}
                className="group rounded-2xl border border-admin-border bg-admin-bg2 p-5 transition-colors hover:border-admin-accent/30"
              >
                {/* Logo önizleme */}
                <div className="mb-4 flex h-32 items-center justify-center rounded-xl bg-admin-bg3">
                  {p.approvedLogoUrl ? (
                    <img src={p.approvedLogoUrl} alt={p.firmName} className="h-24 w-24 rounded-lg object-contain" />
                  ) : p.variants.length > 0 ? (
                    <img src={p.variants[0].url} alt={p.firmName} className="h-24 w-24 rounded-lg object-contain opacity-60" />
                  ) : (
                    <svg className="h-12 w-12 text-admin-muted2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
                    </svg>
                  )}
                </div>

                {/* Bilgi */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-admin-text group-hover:text-admin-accent transition-colors">
                      {p.firmName}
                    </h3>
                    <p className="mt-0.5 text-xs text-admin-muted">{p.portalUser.name}</p>
                  </div>
                  <span className={`text-xs font-medium ${st.color}`}>{st.label}</span>
                </div>

                <div className="mt-3 flex items-center gap-3 text-xs text-admin-muted2">
                  {p.style && <span>{STYLE_LABELS[p.style] || p.style}</span>}
                  <span>{p.variants.length} varyant</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Yeni proje oluşturma modal */}
      {showCreate && (
        <CreateLogoModal onClose={() => setShowCreate(false)} />
      )}
    </div>
  );
}

// ── Yeni Logo Projesi Modal ──
function CreateLogoModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [portalUserId, setPortalUserId] = useState("");
  const [sector, setSector] = useState("");
  const [style, setStyle] = useState("modern");
  const [brandColors, setBrandColors] = useState("");
  const [includeText, setIncludeText] = useState(true);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate() {
    if (!portalUserId.trim()) {
      setError("Portal kullanıcı ID gerekli");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const project = await createLogoProject(portalUserId.trim(), {
        sector: sector || undefined,
        style: style || undefined,
        brandColors: brandColors || undefined,
        includeText,
        notes: notes || undefined,
      });
      router.push(`/admin/logo/${project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Oluşturma hatası");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl border border-admin-border bg-admin-bg p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-6 text-lg font-bold text-admin-text">Yeni Logo Projesi</h2>

        {error && (
          <div className="mb-4 rounded-xl bg-admin-red-dim border border-admin-red/20 px-4 py-2.5 text-sm text-admin-red">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-admin-muted uppercase tracking-wider">Portal Kullanıcı ID *</label>
            <input
              value={portalUserId}
              onChange={(e) => setPortalUserId(e.target.value)}
              placeholder="Portal kullanıcısının ID'si"
              className="w-full rounded-xl border border-admin-border bg-admin-bg2 px-4 py-2.5 text-sm text-admin-text outline-none focus:border-admin-accent/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-admin-muted uppercase tracking-wider">Sektör</label>
              <input
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                placeholder="ör: Sağlık, Teknoloji"
                className="w-full rounded-xl border border-admin-border bg-admin-bg2 px-4 py-2.5 text-sm text-admin-text outline-none focus:border-admin-accent/40"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-admin-muted uppercase tracking-wider">Stil</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full rounded-xl border border-admin-border bg-admin-bg2 px-4 py-2.5 text-sm text-admin-text outline-none focus:border-admin-accent/40"
              >
                <option value="minimal">Minimal</option>
                <option value="modern">Modern</option>
                <option value="vintage">Vintage</option>
                <option value="playful">Eğlenceli</option>
                <option value="luxury">Lüks</option>
                <option value="tech">Teknolojik</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-admin-muted uppercase tracking-wider">Marka Renkleri</label>
            <input
              value={brandColors}
              onChange={(e) => setBrandColors(e.target.value)}
              placeholder="ör: Lacivert ve altın sarısı"
              className="w-full rounded-xl border border-admin-border bg-admin-bg2 px-4 py-2.5 text-sm text-admin-text outline-none focus:border-admin-accent/40"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="includeText"
              checked={includeText}
              onChange={(e) => setIncludeText(e.target.checked)}
              className="h-4 w-4 rounded border-admin-border accent-admin-accent"
            />
            <label htmlFor="includeText" className="text-sm text-admin-text">Logoda firma adı bulunsun</label>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-admin-muted uppercase tracking-wider">Ek Notlar</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="AI'ya iletilecek ek talimatlar..."
              rows={3}
              className="w-full resize-none rounded-xl border border-admin-border bg-admin-bg2 px-4 py-2.5 text-sm text-admin-text outline-none focus:border-admin-accent/40"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm text-admin-muted hover:text-admin-text transition-colors">
            İptal
          </button>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="rounded-xl bg-admin-accent px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Oluşturuluyor..." : "Oluştur"}
          </button>
        </div>
      </div>
    </div>
  );
}
