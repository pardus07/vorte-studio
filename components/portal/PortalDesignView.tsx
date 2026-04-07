"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { approveDesign, requestDesignRevision } from "@/actions/design-preview";
import type { RevisionRuleResult } from "@/lib/design-preview-rules";

interface RevisionItem {
  id: string;
  note: string;
  stagingUrlAtTime: string | null;
  createdAt: string;
}

interface DesignViewData {
  firmName: string;
  stagingUrl: string | null;
  designApprovedAt: string | null;
  maxRevisions: number;
  rule: RevisionRuleResult;
  revisions: RevisionItem[];
}

export default function PortalDesignView({ data }: { data: DesignViewData }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [iframeFailed, setIframeFailed] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isApproved = Boolean(data.designApprovedAt);
  const hasStagingUrl = Boolean(data.stagingUrl);
  const approvedDate = data.designApprovedAt
    ? new Date(data.designApprovedAt).toLocaleString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  function handleApprove() {
    if (
      !confirm(
        "Tasarımı onaylıyorsunuz. Bu işlemden sonra yeni revizyon talep edemeyeceksiniz ve üretim aşamasına geçilecek. Emin misiniz?"
      )
    )
      return;

    setMsg(null);
    startTransition(async () => {
      const res = await approveDesign();
      if (res.success) {
        setMsg({ type: "ok", text: "Tasarım onaylandı. Üretim aşamasına geçiliyor." });
        router.refresh();
      } else {
        setMsg({ type: "err", text: res.error || "Bir hata oluştu" });
      }
    });
  }

  function handleRevisionSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (note.trim().length < 5) {
      setMsg({ type: "err", text: "Lütfen revizyon talebinizi en az birkaç cümle ile açıklayın" });
      return;
    }
    setMsg(null);
    startTransition(async () => {
      const res = await requestDesignRevision(note);
      if (res.success) {
        setMsg({
          type: "ok",
          text: `Revizyon talebiniz iletildi. Kalan hak: ${res.remainingRevisions}`,
        });
        setNote("");
        router.refresh();
      } else {
        setMsg({ type: "err", text: res.error || "Bir hata oluştu" });
      }
    });
  }

  return (
    <div className="max-w-5xl">
      {/* Başlık */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tasarım Önizleme</h1>
        <p className="mt-1 text-sm text-white/50">
          {data.firmName} için hazırlanan web sitesi tasarımını buradan inceleyebilir, revizyon
          talep edebilir veya onaylayabilirsiniz.
        </p>
      </div>

      {/* Staging URL yok */}
      {!hasStagingUrl && (
        <div className="rounded-2xl border border-white/[0.07] bg-bg2 p-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
            <svg className="h-6 w-6 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <p className="text-sm font-semibold">Tasarım henüz hazır değil</p>
          <p className="mt-1 text-xs text-white/50">
            Ekibimiz tasarımınız üzerinde çalışıyor. Hazır olduğunda burada görüntüleyebileceksiniz.
          </p>
        </div>
      )}

      {/* Staging URL var */}
      {hasStagingUrl && (
        <>
          {/* Durum bandı */}
          <div
            className={`mb-4 rounded-xl border px-4 py-3 ${
              isApproved
                ? "border-green-500/30 bg-green-500/5"
                : "border-accent/30 bg-accent/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`h-2 w-2 rounded-full ${isApproved ? "bg-green-500" : "bg-accent"}`} />
              <p className="text-sm font-medium">
                {isApproved ? (
                  <>
                    Tasarım onaylandı · <span className="text-white/60">{approvedDate}</span>
                  </>
                ) : (
                  <>
                    İnceleme Aşaması · Revizyon hakkı:{" "}
                    <span className="text-accent">
                      {data.rule.remainingRevisions} / {data.maxRevisions}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Iframe + fallback link */}
          <div className="mb-6 overflow-hidden rounded-2xl border border-white/[0.07] bg-bg2">
            <div className="flex items-center justify-between border-b border-white/[0.07] bg-black/20 px-4 py-2.5">
              <p className="text-xs text-white/50 truncate">{data.stagingUrl}</p>
              <a
                href={data.stagingUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/20"
              >
                Yeni sekmede aç
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>

            {!iframeFailed ? (
              <iframe
                src={data.stagingUrl!}
                className="h-[600px] w-full bg-white"
                title="Tasarım Önizleme"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                onError={() => setIframeFailed(true)}
                onLoad={(e) => {
                  // Bazı siteler X-Frame-Options ile yasaklar — iframe boş kalırsa tespit et.
                  try {
                    const iframe = e.currentTarget;
                    if (!iframe.contentWindow || !iframe.contentDocument?.body?.innerHTML) {
                      setIframeFailed(true);
                    }
                  } catch {
                    // Cross-origin erişim hatası normal — iframe çalışıyor demektir
                  }
                }}
              />
            ) : (
              <div className="flex h-[300px] flex-col items-center justify-center gap-3 p-8 text-center">
                <svg className="h-10 w-10 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-sm text-white/60">
                  Bu siteyi iframe içinde gösteremiyoruz (güvenlik politikası).
                </p>
                <a
                  href={data.stagingUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90"
                >
                  Tasarımı Yeni Sekmede Aç →
                </a>
              </div>
            )}
          </div>

          {/* Onaylı değilse: revizyon formu + onay butonu */}
          {!isApproved && (
            <div className="grid gap-4 md:grid-cols-2">
              {/* Revizyon formu */}
              <div className="rounded-2xl border border-white/[0.07] bg-bg2 p-5">
                <h2 className="text-sm font-semibold">Revizyon İste</h2>
                <p className="mt-1 text-xs text-white/50">
                  Kalan hak: {data.rule.remainingRevisions} / {data.maxRevisions}
                </p>

                {data.rule.allowed ? (
                  <form onSubmit={handleRevisionSubmit} className="mt-4">
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Değişmesini istediğiniz bölümleri ve değişiklikleri detaylı yazın (en az birkaç cümle)…"
                      rows={6}
                      maxLength={2000}
                      disabled={isPending}
                      className="w-full rounded-xl border border-white/[0.07] bg-bg px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-accent/40 disabled:opacity-50"
                    />
                    <div className="mt-1 flex items-center justify-between">
                      <p className="text-[11px] text-white/30">{note.length} / 2000</p>
                    </div>
                    <button
                      type="submit"
                      disabled={isPending || note.trim().length < 5}
                      className="mt-3 w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-40"
                    >
                      {isPending ? "Gönderiliyor…" : "Revizyon Talebini Gönder"}
                    </button>
                  </form>
                ) : (
                  <p className="mt-4 rounded-xl bg-amber-500/5 border border-amber-500/20 p-3 text-xs text-amber-400">
                    {data.rule.reason}
                  </p>
                )}
              </div>

              {/* Onay kartı */}
              <div className="rounded-2xl border border-green-500/20 bg-green-500/[0.03] p-5">
                <h2 className="text-sm font-semibold text-green-400">Tasarımı Onayla</h2>
                <p className="mt-1 text-xs text-white/60">
                  Tasarımdan memnunsanız onaylayarak üretim aşamasına geçebilirsiniz. Onay sonrası
                  yeni revizyon talep edilemez.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-white/60">
                  <li className="flex items-start gap-2">
                    <svg className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Üretim aşaması başlar
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Ara ödeme fazı devreye girer
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Yeni revizyon talep edilemez
                  </li>
                </ul>
                <button
                  onClick={handleApprove}
                  disabled={isPending}
                  className="mt-5 w-full rounded-xl border border-green-500/40 bg-green-500/10 px-4 py-2.5 text-sm font-medium text-green-400 hover:bg-green-500/20 disabled:opacity-40"
                >
                  {isPending ? "İşleniyor…" : "Tasarımı Onayla"}
                </button>
              </div>
            </div>
          )}

          {/* Mesaj */}
          {msg && (
            <div
              className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
                msg.type === "ok"
                  ? "border-green-500/30 bg-green-500/5 text-green-400"
                  : "border-red-500/30 bg-red-500/5 text-red-400"
              }`}
            >
              {msg.text}
            </div>
          )}

          {/* Revizyon geçmişi */}
          {data.revisions.length > 0 && (
            <div className="mt-6 rounded-2xl border border-white/[0.07] bg-bg2 p-5">
              <h2 className="mb-4 text-sm font-semibold">
                Revizyon Geçmişi ({data.revisions.length})
              </h2>
              <div className="space-y-3">
                {data.revisions.map((r, idx) => (
                  <div key={r.id} className="rounded-xl bg-white/[0.02] p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-semibold text-accent">
                        Revizyon #{data.revisions.length - idx}
                      </span>
                      <span className="text-xs text-white/40">
                        {new Date(r.createdAt).toLocaleString("tr-TR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-white/80 whitespace-pre-wrap">{r.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
