"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await signIn("admin", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });

    if (result?.error) {
      setError("E-posta veya sifre hatali.");
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-admin-bg font-[family-name:var(--font-geist)]">
      <div className="w-full max-w-sm space-y-8 px-6">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-admin-accent text-xl font-bold text-white">
            V
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-admin-text">
            VORTE<span className="text-admin-accent">.</span>STUDIO
          </h1>
          <p className="mt-1 text-xs text-admin-muted">
            Admin paneline giris yap
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-medium text-admin-muted"
            >
              E-posta
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-admin-border bg-admin-bg2 px-3 py-2.5 text-sm text-admin-text placeholder:text-admin-muted2 focus:border-admin-accent focus:outline-none focus:ring-1 focus:ring-admin-accent"
              placeholder="admin@vorte.com.tr"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-medium text-admin-muted"
            >
              Sifre
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-admin-border bg-admin-bg2 px-3 py-2.5 text-sm text-admin-text placeholder:text-admin-muted2 focus:border-admin-accent focus:outline-none focus:ring-1 focus:ring-admin-accent"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-admin-red-dim px-3 py-2 text-xs text-admin-red">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-admin-accent px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Giris yapiliyor..." : "Giris Yap"}
          </button>
        </form>
      </div>
    </div>
  );
}
