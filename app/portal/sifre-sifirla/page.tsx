"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { requestPortalPasswordReset } from "@/actions/password-reset";

export default function PasswordResetRequestPage() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const res = await requestPortalPasswordReset(email);
      if (res.success) {
        setDone(true);
      } else {
        setError(res.error || "Bir hata oluştu");
      }
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(255,69,0,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="relative w-full max-w-sm">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-lg font-extrabold text-white shadow-lg shadow-accent/20">
            V
          </div>
          <h1 className="text-xl font-bold text-white">
            VORTE<span className="text-accent">.</span>PORTAL
          </h1>
          <p className="mt-2 text-sm text-white/40">Şifre sıfırlama</p>
        </div>

        {done ? (
          <div className="rounded-2xl border border-white/[0.07] bg-bg2 p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
              <svg
                className="h-6 w-6 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-base font-semibold text-white">
              Talep alındı
            </h2>
            <p className="text-sm text-white/50 leading-relaxed">
              Eğer bu e-posta sistemimizde kayıtlıysa, şifre sıfırlama bağlantısı
              kısa süre içinde gelecektir. Bağlantı 30 dakika geçerlidir.
            </p>
            <Link
              href="/portal/giris"
              className="mt-6 inline-block text-sm font-medium text-accent hover:underline"
            >
              ← Giriş sayfasına dön
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-white/[0.07] bg-bg2 p-8"
          >
            {error && (
              <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <p className="mb-6 text-xs leading-relaxed text-white/40">
              Hesabınıza bağlı e-posta adresini girin. Şifre sıfırlama bağlantısı
              e-postanıza gönderilecektir.
            </p>

            <div className="mb-6">
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/50">
                E-posta
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-accent/40 focus:bg-white/[0.05]"
                placeholder="ornek@firma.com"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition-all hover:shadow-xl hover:shadow-accent/30 disabled:opacity-50"
            >
              {isPending ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
            </button>

            <div className="mt-6 text-center">
              <Link
                href="/portal/giris"
                className="text-xs text-white/40 hover:text-white/60"
              >
                ← Giriş sayfasına dön
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
