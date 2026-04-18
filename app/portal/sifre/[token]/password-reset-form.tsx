"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { completePortalPasswordReset } from "@/actions/password-reset";

export default function PasswordResetForm({
  token,
  email,
}: {
  token: string;
  email: string;
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Şifre en az 8 karakter olmalı");
      return;
    }
    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor");
      return;
    }

    startTransition(async () => {
      const res = await completePortalPasswordReset(token, password);
      if (res.success) {
        setDone(true);
        setTimeout(() => router.push("/portal/giris"), 2500);
      } else {
        setError(res.error || "Bir hata oluştu");
      }
    });
  }

  if (done) {
    return (
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
          Şifreniz güncellendi
        </h2>
        <p className="text-sm text-white/50">
          Giriş sayfasına yönlendiriliyorsunuz...
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/[0.07] bg-bg2 p-8"
    >
      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {email && (
        <div className="mb-6 rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3">
          <p className="text-[11px] uppercase tracking-wider text-white/40">
            Hesap
          </p>
          <p className="mt-0.5 text-sm font-medium text-white/80">{email}</p>
        </div>
      )}

      <div className="mb-4">
        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/50">
          Yeni Şifre
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          autoFocus
          className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-accent/40 focus:bg-white/[0.05]"
          placeholder="En az 8 karakter"
        />
      </div>

      <div className="mb-6">
        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/50">
          Şifre (Tekrar)
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
          className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-accent/40 focus:bg-white/[0.05]"
          placeholder="Aynı şifreyi tekrar girin"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition-all hover:shadow-xl hover:shadow-accent/30 disabled:opacity-50"
      >
        {isPending ? "Güncelleniyor..." : "Şifreyi Güncelle"}
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
  );
}
