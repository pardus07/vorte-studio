"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function PortalLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("portal", {
        email: email.toLowerCase(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("E-posta veya şifre hatalı");
      } else {
        router.push("/portal/dashboard");
      }
    } catch {
      setError("Giriş yapılamadı. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      {/* Arkaplan efektleri */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 30%, rgba(255,69,0,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-lg font-extrabold text-white shadow-lg shadow-accent/20">
            V
          </div>
          <h1 className="text-xl font-bold text-white">
            VORTE<span className="text-accent">.</span>PORTAL
          </h1>
          <p className="mt-2 text-sm text-white/40">
            Projenizi takip edin
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/[0.07] bg-bg2 p-8"
        >
          {error && (
            <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label className="mb-2 block text-xs font-medium text-white/50 uppercase tracking-wider">
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

          <div className="mb-8">
            <label className="mb-2 block text-xs font-medium text-white/50 uppercase tracking-wider">
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-accent/40 focus:bg-white/[0.05]"
              placeholder="••••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition-all hover:shadow-xl hover:shadow-accent/30 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Giriş yapılıyor...
              </span>
            ) : (
              "Giriş Yap"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-white/20">
          Giriş bilgileriniz sözleşme sonrası e-posta ile gönderilmiştir.
        </p>
      </div>
    </div>
  );
}
