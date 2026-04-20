"use client";

// FAZ B — Madde 2.4: /teklif/{token} IDOR gate — client-side doğrulama UI'ı.
//
// Props:
//   • token    — URL'deki proposal token (Server Action'a geçirilir)
//   • kind     — "phone" veya "email" (server-side hesaplanmış, güvenilir)
//   • firmName — salt gösterim için (müşteriye doğru yerde olduğunu anlatır)
//
// Davranış:
//   1. İnput (son 4 hane / tam email) + submit
//   2. useTransition ile verifyProposalAccess Server Action çağrısı
//   3. success → router.refresh() (page.tsx cookie'yi okuyup render eder)
//   4. fail → error mesajı + remainingAttempts (varsa)
//   5. rate_limit/locked → countdown timer + buton disabled
//
// UX:
//   • autoFocus input
//   • phone: inputMode numeric, autoComplete off (şifre yöneticisi yakalamasın)
//   • email: type="email", autoComplete="email"
//   • Enter tuşu ile submit

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { verifyProposalAccess } from "@/actions/proposals";
import type { AccessKind } from "@/lib/proposal-access-rate-limit";

interface VerifyGateProps {
  token: string;
  kind: Exclude<AccessKind, "disabled">; // disabled mode'da bu component render edilmez
  firmName: string;
}

export default function VerifyGate({ token, kind, firmName }: VerifyGateProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [retryAfterSeconds, setRetryAfterSeconds] = useState<number>(0);
  const [locked, setLocked] = useState(false);
  const [pending, startTransition] = useTransition();

  // ── Rate limit countdown ──
  // retryAfterSeconds > 0 iken saniyede bir azalt. 0'a düştüğünde buton
  // yeniden aktif olur (error mesajı silinmez — müşteri tekrar submit
  // edince yeni bir deneme başlar).
  useEffect(() => {
    if (retryAfterSeconds <= 0) return;
    const tick = setInterval(() => {
      setRetryAfterSeconds((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(tick);
  }, [retryAfterSeconds]);

  // Mount'ta input'a focus
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pending) return;
    if (retryAfterSeconds > 0) return;
    if (!input.trim()) {
      setError(
        kind === "phone"
          ? "Telefon numaranızın son 4 hanesini giriniz"
          : "E-posta adresinizi giriniz"
      );
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await verifyProposalAccess(token, input);
      if (result.success) {
        // Cookie set edildi — sayfayı yeniden render et, server cookie okuyup
        // ProposalView'ı render edecek
        router.refresh();
        return;
      }

      setError(result.error);
      if (typeof result.remainingAttempts === "number") {
        setRemainingAttempts(result.remainingAttempts);
      }
      if (typeof result.retryAfterSeconds === "number") {
        setRetryAfterSeconds(result.retryAfterSeconds);
      }
      if (result.locked) {
        setLocked(true);
      }
    });
  };

  const isPhoneMode = kind === "phone";
  const buttonDisabled = pending || retryAfterSeconds > 0;

  // Countdown formatı: "mm:ss" veya "ss sn"
  const countdownLabel =
    retryAfterSeconds > 59
      ? `${Math.floor(retryAfterSeconds / 60)}:${String(
          retryAfterSeconds % 60
        ).padStart(2, "0")}`
      : `${retryAfterSeconds} sn`;

  return (
    <main className="min-h-screen bg-[#080808] text-white flex items-center justify-center p-6 font-[DM_Sans,sans-serif]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Marka rozeti */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-xs tracking-[0.3em] text-white/50 uppercase">
            <span className="w-8 h-px bg-white/20" />
            Vorte Studio
            <span className="w-8 h-px bg-white/20" />
          </div>
        </div>

        {/* Ana kart */}
        <div className="bg-[#0f0f10] border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-start gap-3 mb-6">
            {/* Kilit ikonu */}
            <div className="shrink-0 w-10 h-10 rounded-full bg-[#FF4500]/10 border border-[#FF4500]/30 flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FF4500"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold font-[Syne,sans-serif]">
                Özel Teklifiniz
              </h1>
              <p className="text-sm text-white/60 mt-1">{firmName}</p>
            </div>
          </div>

          <p className="text-sm text-white/70 leading-relaxed mb-6">
            {isPhoneMode ? (
              <>
                Teklifinizi görüntülemek için kayıtlı{" "}
                <span className="text-white font-medium">
                  telefon numaranızın son 4 hanesini
                </span>{" "}
                giriniz.
              </>
            ) : (
              <>
                Teklifinizi görüntülemek için kayıtlı{" "}
                <span className="text-white font-medium">e-posta adresinizi</span>{" "}
                giriniz.
              </>
            )}
          </p>

          <form onSubmit={onSubmit} noValidate>
            <label htmlFor="verify-input" className="sr-only">
              {isPhoneMode ? "Telefon son 4 hane" : "E-posta adresi"}
            </label>
            <input
              ref={inputRef}
              id="verify-input"
              type={isPhoneMode ? "tel" : "email"}
              inputMode={isPhoneMode ? "numeric" : "email"}
              autoComplete={isPhoneMode ? "off" : "email"}
              placeholder={
                isPhoneMode ? "• • • •" : "ornek@firmaniz.com"
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={buttonDisabled}
              className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-lg tracking-wider placeholder:text-white/20 focus:outline-none focus:border-[#FF4500]/60 focus:ring-2 focus:ring-[#FF4500]/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
              aria-invalid={!!error}
              aria-describedby={error ? "verify-error" : undefined}
            />

            <button
              type="submit"
              disabled={buttonDisabled}
              className="mt-4 w-full bg-[#FF4500] hover:bg-[#FF4500]/90 active:bg-[#e03e00] disabled:bg-[#FF4500]/40 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-5 py-3 transition-colors"
            >
              {pending
                ? "Kontrol ediliyor…"
                : retryAfterSeconds > 0
                ? `Tekrar denemek için bekleyiniz (${countdownLabel})`
                : "Teklifimi Görüntüle"}
            </button>
          </form>

          {/* Hata / bilgi mesajı */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                id="verify-error"
                role="alert"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`mt-4 rounded-lg px-4 py-3 text-sm border ${
                  locked
                    ? "bg-red-500/10 border-red-500/30 text-red-200"
                    : "bg-amber-500/10 border-amber-500/30 text-amber-100"
                }`}
              >
                <p>{error}</p>
                {typeof remainingAttempts === "number" &&
                  !locked &&
                  retryAfterSeconds === 0 && (
                    <p className="mt-1 text-xs opacity-80">
                      Kalan deneme: {remainingAttempts}
                    </p>
                  )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Yardım bandı */}
        <p className="text-center text-xs text-white/40 mt-6 leading-relaxed">
          Teklifinizi görüntüleyemiyorsanız bizimle iletişime geçin:{" "}
          <a
            href="mailto:info@vortestudio.com"
            className="text-white/60 hover:text-white underline underline-offset-2"
          >
            info@vortestudio.com
          </a>
        </p>

        {/* Güvenlik açıklaması */}
        <p className="text-center text-[10px] text-white/30 mt-3 leading-relaxed max-w-sm mx-auto">
          Teklif linkiniz size özeldir. Güvenliğiniz için ek bir doğrulama
          adımı uyguluyoruz; bu bilgiler saklanmaz.
        </p>
      </motion.div>
    </main>
  );
}
