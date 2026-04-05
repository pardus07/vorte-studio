"use client";

import { useState } from "react";
import { submitLogoFeedback, approveLogoVariant } from "@/actions/logo";
import { useRouter } from "next/navigation";

interface LogoVariantItem {
  id: string;
  url: string;
  isApproved: boolean;
  feedback: string | null;
  feedbackAt: string | null;
  createdAt: string;
}

interface LogoProjectData {
  id: string;
  firmName: string;
  status: string;
  approvedLogoUrl: string | null;
  approvedAt: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  accentColor: string | null;
  fontDisplay: string | null;
  fontBody: string | null;
  variants: LogoVariantItem[];
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Hazırlanıyor", color: "text-white/40" },
  GENERATING: { label: "Üretiliyor...", color: "text-amber-400" },
  REVIEW: { label: "Geri bildiriminizi bekliyoruz", color: "text-blue-400" },
  APPROVED: { label: "Onaylandı", color: "text-green-400" },
};

export default function PortalLogoView({ project }: { project: LogoProjectData | null }) {
  const router = useRouter();
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [approving, setApproving] = useState<string | null>(null);

  if (!project) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
            <svg className="h-5 w-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold">Logo & Marka</h1>
            <p className="text-xs text-white/40">Logo tasarım süreci</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.1] bg-bg2 py-20">
          <p className="text-sm text-white/30">Logo projesi henüz oluşturulmadı</p>
          <p className="mt-1 text-xs text-white/15">Vorte Studio ekibi logo projenizi başlattığında burada göreceksiniz</p>
        </div>
      </div>
    );
  }

  const st = STATUS_MAP[project.status] || STATUS_MAP.DRAFT;

  async function handleFeedback(variantId: string) {
    const text = feedbackMap[variantId];
    if (!text?.trim()) return;
    setSubmitting(variantId);
    try {
      await submitLogoFeedback(variantId, text.trim());
      setFeedbackMap((prev) => ({ ...prev, [variantId]: "" }));
      router.refresh();
    } catch {
      alert("Geri bildirim gönderilemedi");
    } finally {
      setSubmitting(null);
    }
  }

  async function handleApprove(variantId: string) {
    if (!confirm("Bu logoyu onaylamak istediğinize emin misiniz? Onayladıktan sonra bu logo projenizde kullanılacaktır.")) return;
    setApproving(variantId);
    try {
      await approveLogoVariant(variantId);
      router.refresh();
    } catch {
      alert("Onay işlemi başarısız");
    } finally {
      setApproving(null);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
          <svg className="h-5 w-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
          </svg>
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-bold">Logo & Marka</h1>
          <p className="text-xs text-white/40">{project.firmName}</p>
        </div>
        <span className={`text-xs font-medium ${st.color}`}>{st.label}</span>
      </div>

      {/* Onaylanmış logo */}
      {project.approvedLogoUrl && (
        <div className="mb-6 rounded-2xl border border-green-500/20 bg-green-500/[0.04] p-6 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1">
            <svg className="h-4 w-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>
            <span className="text-xs font-semibold text-green-400">Onaylanmış Logo</span>
          </div>
          <div className="flex justify-center">
            <div className="rounded-2xl bg-white p-6">
              <img src={project.approvedLogoUrl} alt="Onaylı logo" className="h-40 w-40 object-contain" />
            </div>
          </div>
        </div>
      )}

      {/* Marka kiti özet */}
      {(project.primaryColor || project.secondaryColor || project.accentColor) && (
        <div className="mb-6 rounded-2xl border border-white/[0.07] bg-bg2 p-5">
          <h2 className="mb-3 text-xs font-semibold text-white/50 uppercase tracking-wider">Marka Renkleri</h2>
          <div className="flex gap-3">
            {project.primaryColor && (
              <div className="text-center">
                <div className="h-12 w-12 rounded-xl border border-white/10" style={{ backgroundColor: project.primaryColor }} />
                <p className="mt-1 text-[10px] text-white/30">{project.primaryColor}</p>
              </div>
            )}
            {project.secondaryColor && (
              <div className="text-center">
                <div className="h-12 w-12 rounded-xl border border-white/10" style={{ backgroundColor: project.secondaryColor }} />
                <p className="mt-1 text-[10px] text-white/30">{project.secondaryColor}</p>
              </div>
            )}
            {project.accentColor && (
              <div className="text-center">
                <div className="h-12 w-12 rounded-xl border border-white/10" style={{ backgroundColor: project.accentColor }} />
                <p className="mt-1 text-[10px] text-white/30">{project.accentColor}</p>
              </div>
            )}
          </div>
          {(project.fontDisplay || project.fontBody) && (
            <div className="mt-4 flex gap-6">
              {project.fontDisplay && (
                <div>
                  <p className="text-[10px] text-white/30">Başlık</p>
                  <p className="text-sm font-semibold">{project.fontDisplay}</p>
                </div>
              )}
              {project.fontBody && (
                <div>
                  <p className="text-[10px] text-white/30">Gövde</p>
                  <p className="text-sm">{project.fontBody}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Logo varyantları */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
          Logo Alternatifleri ({project.variants.length})
        </h2>
      </div>

      {project.variants.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.1] bg-bg2 py-16">
          <p className="text-sm text-white/30">Logo alternatifleri hazırlanıyor</p>
          <p className="mt-1 text-xs text-white/15">Ekibimiz logo tasarımlarını tamamladığında burada göreceksiniz</p>
        </div>
      ) : (
        <div className="space-y-4">
          {project.variants.map((v, i) => (
            <div key={v.id} className={`rounded-2xl border ${v.isApproved ? "border-green-500/30 bg-green-500/[0.03]" : "border-white/[0.07] bg-bg2"} p-5`}>
              <div className="flex gap-5">
                {/* Görsel */}
                <div className="flex-shrink-0 rounded-xl bg-white p-4">
                  <img src={v.url} alt={`Alternatif ${project.variants.length - i}`} className="h-32 w-32 object-contain" />
                </div>

                {/* Bilgi + aksiyonlar */}
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="text-sm font-semibold">Alternatif {project.variants.length - i}</h3>
                    {v.isApproved && (
                      <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-bold text-green-400">ONAYLI</span>
                    )}
                  </div>
                  <p className="text-xs text-white/30">{new Date(v.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</p>

                  {/* Önceki geri bildirim */}
                  {v.feedback && (
                    <div className="mt-3 rounded-lg bg-white/[0.03] px-3 py-2">
                      <p className="text-[10px] text-white/40">Geri bildiriminiz:</p>
                      <p className="mt-0.5 text-xs text-white/70">{v.feedback}</p>
                    </div>
                  )}

                  {/* Aksiyonlar */}
                  {!v.isApproved && project.status !== "APPROVED" && (
                    <div className="mt-3 space-y-2">
                      <div className="flex gap-2">
                        <input
                          value={feedbackMap[v.id] || ""}
                          onChange={(e) => setFeedbackMap((prev) => ({ ...prev, [v.id]: e.target.value }))}
                          placeholder="Geri bildirim yazın..."
                          className="flex-1 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-xs text-white placeholder-white/20 outline-none focus:border-accent/30"
                        />
                        <button
                          onClick={() => handleFeedback(v.id)}
                          disabled={submitting === v.id || !feedbackMap[v.id]?.trim()}
                          className="rounded-lg bg-white/[0.06] px-3 py-2 text-xs text-white/60 transition-colors hover:bg-white/[0.1] disabled:opacity-30"
                        >
                          {submitting === v.id ? "..." : "Gönder"}
                        </button>
                      </div>
                      <button
                        onClick={() => handleApprove(v.id)}
                        disabled={approving === v.id}
                        className="flex items-center gap-1.5 rounded-lg bg-green-500/10 px-4 py-2 text-xs font-semibold text-green-400 transition-colors hover:bg-green-500/20 disabled:opacity-50"
                      >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4" /></svg>
                        {approving === v.id ? "Onaylanıyor..." : "Bu Logoyu Onayla"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
