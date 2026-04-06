"use client";

import { useEffect, useState } from "react";

type ProspectDisclaimerProps = {
  firmName: string;
};

/**
 * /p/[slug] sayfaları için hukuki + satış odaklı disclaimer bantı.
 *
 * Amaç:
 * 1. Google Search Console "aldatıcı sayfalar" tespitini çürütmek
 *    (brand impersonation / social engineering patern'i)
 * 2. Firma sahibine sayfanın bir tasarım önizlemesi olduğunu açıkça belirtmek
 *
 * Kritik SSR davranışı:
 * - Initial state `false` — SSR'da bant HER ZAMAN render edilir
 * - Googlebot JS çalıştırmazsa: initial HTML'de bantı görür ✅
 * - Googlebot JS çalıştırırsa: localStorage boş → bantı yine görür ✅
 * - Kullanıcı dismiss ederse: sadece o tarayıcıda saklanır
 */
export default function ProspectDisclaimer({ firmName }: ProspectDisclaimerProps) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Client hydration sonrası localStorage kontrol
    const stored = localStorage.getItem("vorte-prospect-disclaimer-dismissed");
    if (stored === "true") {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("vorte-prospect-disclaimer-dismissed", "true");
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div
      role="alert"
      aria-label="Tasarım önizlemesi bildirimi"
      className="sticky top-0 z-[100] w-full border-b border-amber-300/60 bg-gradient-to-r from-amber-50 via-amber-100 to-amber-50 shadow-sm backdrop-blur-sm"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <div className="mx-auto flex max-w-6xl items-start gap-3 px-4 py-3 sm:items-center sm:gap-4 sm:px-6">
        {/* İkon */}
        <div className="flex-shrink-0 text-xl sm:text-2xl" aria-hidden="true">
          👋
        </div>

        {/* Metin — B+A hibrit */}
        <p className="flex-1 text-[13px] leading-snug text-amber-950 sm:text-sm">
          <span className="font-semibold">Merhaba {firmName}!</span>{" "}
          Bu sayfa Vorte Studio&apos;nun size özel hazırladığı bir{" "}
          <strong className="font-semibold">tasarım önizlemesidir</strong> —{" "}
          <strong className="font-semibold underline decoration-amber-600 decoration-2 underline-offset-2">
            firmanızın resmi web sitesi değildir
          </strong>
          . Firma bilgileri Google Haritalar gibi halka açık kaynaklardan
          alınmıştır. Böyle bir siteyi 7 günde sizin için yapabiliriz.
        </p>

        {/* CTA */}
        <a
          href="#iletisim"
          className="hidden flex-shrink-0 rounded-full bg-amber-950 px-4 py-2 text-xs font-semibold text-amber-50 transition-all hover:bg-amber-900 sm:inline-block"
        >
          Ücretsiz Teklif Al
        </a>

        {/* Kapat butonu */}
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
    </div>
  );
}
