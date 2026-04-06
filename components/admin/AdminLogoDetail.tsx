"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateLogoProject, deleteLogoVariant } from "@/actions/logo";

interface LogoVariantItem {
  id: string;
  url: string;
  prompt: string | null;
  model: string | null;
  isApproved: boolean;
  feedback: string | null;
  feedbackAt: string | null;
  createdAt: string;
}

interface LogoProjectDetail {
  id: string;
  firmName: string;
  firmSlug: string | null;
  sector: string | null;
  style: string | null;
  brandColors: string | null;
  includeText: boolean;
  notes: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  accentColor: string | null;
  fontDisplay: string | null;
  fontBody: string | null;
  brandGuidelines: string | null;
  approvedLogoUrl: string | null;
  brandManifestUrl: string | null;
  approvedAt: string | null;
  status: string;
  createdAt: string;
  portalUser: { email: string; name: string; firmName: string };
  variants: LogoVariantItem[];
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  DRAFT: { label: "Taslak", color: "text-admin-muted", bg: "bg-white/5" },
  GENERATING: { label: "Üretiliyor...", color: "text-admin-amber", bg: "bg-admin-amber-dim" },
  REVIEW: { label: "İncelemede", color: "text-admin-blue", bg: "bg-admin-blue-dim" },
  APPROVED: { label: "Onaylandı", color: "text-admin-green", bg: "bg-admin-green-dim" },
};

export default function AdminLogoDetail({ project }: { project: LogoProjectDetail }) {
  const router = useRouter();
  const [tab, setTab] = useState<"variants" | "brandkit">("variants");
  const [generating, setGenerating] = useState(false);
  const [revisionNote, setRevisionNote] = useState("");

  // Marka kiti state
  const [primaryColor, setPrimaryColor] = useState(project.primaryColor || "");
  const [secondaryColor, setSecondaryColor] = useState(project.secondaryColor || "");
  const [accentColor, setAccentColor] = useState(project.accentColor || "");
  const [fontDisplay, setFontDisplay] = useState(project.fontDisplay || "");
  const [fontBody, setFontBody] = useState(project.fontBody || "");
  const [brandGuidelines, setBrandGuidelines] = useState(project.brandGuidelines || "");
  const [saving, setSaving] = useState(false);

  const st = STATUS_MAP[project.status] || STATUS_MAP.DRAFT;

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/logo-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logoProjectId: project.id,
          revisionFeedback: revisionNote || undefined,
        }),
      });
      if (res.ok) {
        setRevisionNote("");
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Logo üretim hatası");
      }
    } catch {
      alert("Logo üretim hatası");
    } finally {
      setGenerating(false);
    }
  }

  async function handleDeleteVariant(variantId: string) {
    if (!confirm("Bu varyantı silmek istediğinize emin misiniz?")) return;
    try {
      await deleteLogoVariant(variantId);
      router.refresh();
    } catch {
      alert("Silme hatası");
    }
  }

  async function handleSaveBrandKit() {
    setSaving(true);
    try {
      await updateLogoProject(project.id, {
        primaryColor: primaryColor || undefined,
        secondaryColor: secondaryColor || undefined,
        accentColor: accentColor || undefined,
        fontDisplay: fontDisplay || undefined,
        fontBody: fontBody || undefined,
        brandGuidelines: brandGuidelines || undefined,
      });
      router.refresh();
    } catch {
      alert("Kaydetme hatası");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Breadcrumb + Header */}
      <div className="mb-6">
        <button onClick={() => router.push("/admin/logo")} className="mb-3 flex items-center gap-1 text-xs text-admin-muted hover:text-admin-text transition-colors">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          Logo Projeleri
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-admin-text">{project.firmName}</h1>
            <p className="mt-1 text-sm text-admin-muted">{project.portalUser.name} · {project.portalUser.email}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${st.color} ${st.bg}`}>
            {st.label}
          </span>
        </div>
      </div>

      {/* Onaylı logo + brand asset bundle */}
      {project.approvedLogoUrl && project.firmSlug && (
        <div className="mb-6 rounded-2xl border border-admin-green/20 bg-admin-green-dim p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-admin-green">Onaylanmış Marka Kiti</p>
              <p className="mt-0.5 text-xs text-admin-muted">
                Slug: <span className="font-mono text-admin-text">{project.firmSlug}</span>
              </p>
            </div>
            {project.brandManifestUrl && (
              <a
                href={project.brandManifestUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-admin-green/30 px-3 py-1.5 text-[11px] font-medium text-admin-green hover:bg-admin-green/10 transition-colors"
              >
                manifest.json
              </a>
            )}
          </div>

          {/* Asset grid: 5 standart varyant */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {[
              { key: "primary-1024.png", label: "Master 1024", bg: "bg-white" },
              { key: "primary-512.png", label: "Square 512", bg: "bg-white" },
              { key: "horizontal-1200x400.png", label: "Header", bg: "bg-white" },
              { key: "favicon-64.png", label: "Favicon", bg: "bg-white" },
              { key: "light-on-dark-1024.png", label: "Dark", bg: "bg-[#0a0a0a]" },
            ].map((asset) => (
              <a
                key={asset.key}
                href={`/api/uploads/brand/${project.firmSlug}/${asset.key}`}
                target="_blank"
                rel="noreferrer"
                className="group rounded-xl border border-admin-border bg-admin-bg2 p-2 transition-colors hover:border-admin-accent/30"
              >
                <div className={`mb-2 flex h-20 items-center justify-center rounded-lg ${asset.bg}`}>
                  <img
                    src={`/api/uploads/brand/${project.firmSlug}/${asset.key}`}
                    alt={asset.label}
                    className="max-h-16 max-w-full object-contain"
                  />
                </div>
                <p className="text-center text-[10px] font-medium text-admin-muted group-hover:text-admin-text">
                  {asset.label}
                </p>
              </a>
            ))}
          </div>

          <p className="mt-3 text-[10px] text-admin-muted/60">
            Bu varyantlar sharp ile post-process edilmiştir. Site oluşturulurken{" "}
            <code className="font-mono text-admin-text">getBrandAssetsBySlug(&quot;{project.firmSlug}&quot;)</code> ile çekilebilir.
          </p>
        </div>
      )}

      {/* Legacy fallback: brandManifestUrl yok ama eski approved.png varsa */}
      {project.approvedLogoUrl && !project.firmSlug && (
        <div className="mb-6 flex items-center gap-4 rounded-2xl border border-admin-amber/20 bg-admin-amber-dim p-4">
          <img src={project.approvedLogoUrl} alt="Onaylı logo" className="h-16 w-16 rounded-xl bg-white object-contain p-1" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-admin-amber">Eski Format Onaylı Logo</p>
            <p className="mt-0.5 text-xs text-admin-muted">
              Brand kit henüz oluşturulmamış. Yeniden onaylama yapılırsa otomatik üretilir.
            </p>
          </div>
        </div>
      )}

      {/* Logo üret */}
      <div className="mb-6 rounded-2xl border border-admin-border bg-admin-bg2 p-5">
        <h2 className="mb-3 text-sm font-semibold text-admin-text">Logo Üret</h2>
        <div className="mb-3">
          <textarea
            value={revisionNote}
            onChange={(e) => setRevisionNote(e.target.value)}
            placeholder="Revizyon notu (opsiyonel) — müşteri geri bildirimi veya ek talimat..."
            rows={2}
            className="w-full resize-none rounded-xl border border-admin-border bg-admin-bg3 px-4 py-2.5 text-sm text-admin-text placeholder-admin-muted2 outline-none focus:border-admin-accent/40"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 rounded-xl bg-admin-accent px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {generating ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Üretiliyor...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
                Logo Üret (AI)
              </>
            )}
          </button>
          <span className="text-xs text-admin-muted">1:1 · 1024x1024 · Gemini</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded-xl bg-admin-bg2 p-1">
        {(["variants", "brandkit"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === t ? "bg-admin-bg3 text-admin-text" : "text-admin-muted hover:text-admin-text"
            }`}
          >
            {t === "variants" ? `Varyantlar (${project.variants.length})` : "Marka Kiti"}
          </button>
        ))}
      </div>

      {/* Varyantlar */}
      {tab === "variants" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {project.variants.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-admin-border bg-admin-bg2 py-16">
              <p className="text-sm text-admin-muted">Henüz logo üretilmedi</p>
              <p className="mt-1 text-xs text-admin-muted2">Yukarıdaki butona tıklayarak logo üretin</p>
            </div>
          ) : (
            project.variants.map((v, i) => (
              <div key={v.id} className={`rounded-2xl border ${v.isApproved ? "border-admin-green/30 bg-admin-green-dim" : "border-admin-border bg-admin-bg2"} p-4`}>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs text-admin-muted">Varyant {project.variants.length - i}</span>
                  <div className="flex items-center gap-2">
                    {v.isApproved && (
                      <span className="rounded-full bg-admin-green/20 px-2 py-0.5 text-[10px] font-bold text-admin-green">ONAYLI</span>
                    )}
                    <button
                      onClick={() => handleDeleteVariant(v.id)}
                      className="text-admin-muted2 hover:text-admin-red transition-colors"
                      title="Sil"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                    </button>
                  </div>
                </div>

                {/* Görsel */}
                <div className="mb-3 flex items-center justify-center rounded-xl bg-white p-4">
                  <img src={v.url} alt={`Varyant ${project.variants.length - i}`} className="h-40 w-40 object-contain" />
                </div>

                {/* Model bilgisi */}
                <p className="text-[10px] text-admin-muted2">{v.model || "Bilinmeyen model"} · {new Date(v.createdAt).toLocaleDateString("tr-TR")}</p>

                {/* Müşteri geri bildirimi */}
                {v.feedback && (
                  <div className="mt-3 rounded-lg bg-admin-bg3 px-3 py-2">
                    <p className="text-[10px] font-medium text-admin-muted uppercase tracking-wider">Müşteri Geri Bildirimi</p>
                    <p className="mt-1 text-xs text-admin-text">{v.feedback}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Marka Kiti */}
      {tab === "brandkit" && (
        <div className="rounded-2xl border border-admin-border bg-admin-bg2 p-6">
          <h3 className="mb-4 text-sm font-semibold text-admin-text uppercase tracking-wider">Renk Paleti</h3>
          <div className="mb-6 grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1.5 block text-xs text-admin-muted">Ana Renk</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor || "#000000"}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-10 w-10 cursor-pointer rounded-lg border border-admin-border"
                />
                <input
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  placeholder="#000000"
                  className="flex-1 rounded-lg border border-admin-border bg-admin-bg3 px-3 py-2 text-sm text-admin-text outline-none"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-admin-muted">İkincil Renk</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={secondaryColor || "#666666"}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="h-10 w-10 cursor-pointer rounded-lg border border-admin-border"
                />
                <input
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  placeholder="#666666"
                  className="flex-1 rounded-lg border border-admin-border bg-admin-bg3 px-3 py-2 text-sm text-admin-text outline-none"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-admin-muted">Aksent Renk</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor || "#ff4500"}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="h-10 w-10 cursor-pointer rounded-lg border border-admin-border"
                />
                <input
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  placeholder="#ff4500"
                  className="flex-1 rounded-lg border border-admin-border bg-admin-bg3 px-3 py-2 text-sm text-admin-text outline-none"
                />
              </div>
            </div>
          </div>

          {/* Renk önizleme */}
          {(primaryColor || secondaryColor || accentColor) && (
            <div className="mb-6 flex gap-2">
              {primaryColor && <div className="h-12 flex-1 rounded-lg" style={{ backgroundColor: primaryColor }} />}
              {secondaryColor && <div className="h-12 flex-1 rounded-lg" style={{ backgroundColor: secondaryColor }} />}
              {accentColor && <div className="h-12 flex-1 rounded-lg" style={{ backgroundColor: accentColor }} />}
            </div>
          )}

          <h3 className="mb-4 text-sm font-semibold text-admin-text uppercase tracking-wider">Tipografi</h3>
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs text-admin-muted">Başlık Fontu</label>
              <input
                value={fontDisplay}
                onChange={(e) => setFontDisplay(e.target.value)}
                placeholder="ör: Syne, Montserrat, Inter"
                className="w-full rounded-lg border border-admin-border bg-admin-bg3 px-3 py-2 text-sm text-admin-text outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-admin-muted">Gövde Fontu</label>
              <input
                value={fontBody}
                onChange={(e) => setFontBody(e.target.value)}
                placeholder="ör: DM Sans, Inter, Geist"
                className="w-full rounded-lg border border-admin-border bg-admin-bg3 px-3 py-2 text-sm text-admin-text outline-none"
              />
            </div>
          </div>

          <h3 className="mb-4 text-sm font-semibold text-admin-text uppercase tracking-wider">Kullanım Kuralları</h3>
          <textarea
            value={brandGuidelines}
            onChange={(e) => setBrandGuidelines(e.target.value)}
            placeholder="Logo kullanım kuralları, minimum boyutlar, yasaklı kullanımlar..."
            rows={4}
            className="mb-4 w-full resize-none rounded-lg border border-admin-border bg-admin-bg3 px-3 py-2 text-sm text-admin-text outline-none"
          />

          <button
            onClick={handleSaveBrandKit}
            disabled={saving}
            className="rounded-xl bg-admin-accent px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Kaydediliyor..." : "Marka Kitini Kaydet"}
          </button>
        </div>
      )}
    </div>
  );
}
