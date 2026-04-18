"use client";

import { useEffect, useState } from "react";

type ProspectDisclaimerProps = {
  firmName: string;
  /** Sayfanın slug'ı — opt-out endpoint'ine gönderilir */
  slug?: string;
};

/**
 * /p/[slug] sayfaları için hukuki + satış odaklı disclaimer bantı.
 *
 * İki katman:
 *  1. Satış mesajı: "tasarım önizlemesidir — resmi siteniz değil"
 *  2. KVKK şeridi (alt satır): veri sorumlusu + m.11 hakları + opt-out butonu
 *
 * SSR davranışı: Initial state `dismissed=false` — Googlebot JS'siz baksa
 * bile ilk HTML'de görür → "deceptive page" tespiti önlenir.
 */
export default function ProspectDisclaimer({
  firmName,
  slug,
}: ProspectDisclaimerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [showOptOut, setShowOptOut] = useState(false);
  const [optOutState, setOptOutState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [optOutReason, setOptOutReason] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("vorte-prospect-disclaimer-dismissed");
    if (stored === "true") setDismissed(true);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("vorte-prospect-disclaimer-dismissed", "true");
    setDismissed(true);
  };

  const handleOptOut = async () => {
    if (!slug) {
      setOptOutState("error");
      return;
    }
    setOptOutState("submitting");
    try {
      const res = await fetch("/api/prospect/opt-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, reason: optOutReason || undefined }),
      });
      if (res.ok) {
        setOptOutState("success");
        // 3 sn sonra ana sayfaya yönlendir
        setTimeout(() => {
          window.location.href = "https://vortestudio.com";
        }, 3000);
      } else {
        setOptOutState("error");
      }
    } catch {
      setOptOutState("error");
    }
  };

  if (dismissed) return null;

  return (
    <>
      <div
        role="alert"
        aria-label="Tasarım önizlemesi ve KVKK bildirimi"
        className="sticky top-0 z-[100] w-full border-b border-amber-300/60 bg-gradient-to-r from-amber-50 via-amber-100 to-amber-50 shadow-sm backdrop-blur-sm"
        style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
      >
        <div className="mx-auto max-w-6xl px-4 py-2.5 sm:px-6">
          {/* Üst şerit: Satış / önizleme bildirimi */}
          <div className="flex items-start gap-3 sm:items-center sm:gap-4">
            <div className="flex-shrink-0 text-xl sm:text-2xl" aria-hidden="true">
              👋
            </div>
            <p className="flex-1 text-[13px] leading-snug text-amber-950 sm:text-sm">
              <span className="font-semibold">Merhaba {firmName}!</span>{" "}
              Bu sayfa Vorte Studio&apos;nun size özel hazırladığı bir{" "}
              <strong className="font-semibold">tasarım önizlemesidir</strong> —{" "}
              <strong className="font-semibold underline decoration-amber-600 decoration-2 underline-offset-2">
                firmanızın resmi web sitesi değildir
              </strong>
              . Böyle bir siteyi 7 günde sizin için yapabiliriz.
            </p>
            <a
              href="#iletisim"
              className="hidden flex-shrink-0 rounded-full bg-amber-950 px-4 py-2 text-xs font-semibold text-amber-50 transition-all hover:bg-amber-900 sm:inline-block"
            >
              Ücretsiz Teklif Al
            </a>
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Bildirimi kapat"
              className="flex-shrink-0 rounded-full p-1.5 text-amber-900 transition-colors hover:bg-amber-200 hover:text-amber-950"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Alt şerit: KVKK — sarı-amber zeminde gri-açık ton */}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-amber-300/50 pt-2 text-[11px] text-amber-900/85 sm:text-xs">
            <span aria-hidden="true">🔒</span>
            <span>
              <strong>KVKK:</strong> İşletme bilgileriniz Google
              Haritalar&apos;daki halka açık kayıtlardan alınmıştır. Veri
              sorumlusu: <strong>Vorte Studio (İbrahim Yaşar)</strong>. Hukuki
              dayanak: KVKK m.5/2-f (meşru menfaat).
            </span>
            <span className="flex items-center gap-2">
              <a
                href="/kvkk#prospect"
                className="underline decoration-amber-600/60 underline-offset-2 hover:text-amber-950 hover:decoration-amber-700"
              >
                Aydınlatma Metni
              </a>
              <span aria-hidden="true">·</span>
              {slug ? (
                <button
                  type="button"
                  onClick={() => setShowOptOut(true)}
                  className="underline decoration-red-500/60 underline-offset-2 hover:text-red-800 hover:decoration-red-700"
                >
                  Verimi Sil
                </button>
              ) : (
                <a
                  href="mailto:info@vortestudio.com?subject=Verimi%20Sil"
                  className="underline decoration-red-500/60 underline-offset-2 hover:text-red-800"
                >
                  Verimi Sil
                </a>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Opt-out onay modal */}
      {showOptOut && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="opt-out-title"
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && optOutState !== "submitting") {
              setShowOptOut(false);
            }
          }}
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            {optOutState === "success" ? (
              <>
                <div className="mb-3 text-4xl">✅</div>
                <h2
                  id="opt-out-title"
                  className="mb-2 text-lg font-bold text-emerald-900"
                >
                  Talebiniz Alındı
                </h2>
                <p className="text-sm leading-relaxed text-gray-700">
                  Sayfanız kaldırıldı ve iletişim listemizden çıkarıldınız. Bir
                  kopyası hukuki delil amacıyla 10 yıl saklanır (KVKK m.13).
                  Birazdan ana sayfaya yönlendirileceksiniz.
                </p>
              </>
            ) : (
              <>
                <h2
                  id="opt-out-title"
                  className="mb-2 text-lg font-bold text-gray-900"
                >
                  Verinizi Silmek İster misiniz?
                </h2>
                <p className="mb-4 text-sm leading-relaxed text-gray-600">
                  <strong>{firmName}</strong> adına oluşturulan bu tasarım
                  önizleme sayfası kaldırılacak ve Vorte Studio iletişim
                  listesinden çıkarılacaksınız. Bu işlem geri alınamaz.
                </p>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Neden? (isteğe bağlı — geri bildirim için)
                </label>
                <textarea
                  value={optOutReason}
                  onChange={(e) => setOptOutReason(e.target.value.slice(0, 500))}
                  rows={3}
                  placeholder="Örn: Zaten web sitemiz var / ilgilenmiyorum / başka..."
                  className="mb-4 w-full resize-none rounded-lg border border-gray-300 p-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  disabled={optOutState === "submitting"}
                />
                {optOutState === "error" && (
                  <div className="mb-3 rounded-lg bg-red-50 p-2.5 text-xs text-red-800">
                    İşlem başarısız oldu. Lütfen tekrar deneyin veya{" "}
                    <a href="mailto:info@vortestudio.com" className="underline">
                      info@vortestudio.com
                    </a>{" "}
                    adresine yazın.
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowOptOut(false)}
                    disabled={optOutState === "submitting"}
                    className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="button"
                    onClick={handleOptOut}
                    disabled={optOutState === "submitting"}
                    className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {optOutState === "submitting" ? "Siliniyor..." : "Evet, Sil"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
