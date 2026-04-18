import { checkPasswordResetToken } from "@/actions/password-reset";
import PasswordResetForm from "./password-reset-form";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PasswordResetTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  let tokenInfo: { valid: boolean; email?: string } = { valid: false };
  try {
    tokenInfo = await checkPasswordResetToken(token);
  } catch {
    tokenInfo = { valid: false };
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
          <p className="mt-2 text-sm text-white/40">Yeni şifre belirle</p>
        </div>

        {tokenInfo.valid ? (
          <PasswordResetForm token={token} email={tokenInfo.email || ""} />
        ) : (
          <div className="rounded-2xl border border-white/[0.07] bg-bg2 p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
              <svg
                className="h-6 w-6 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-base font-semibold text-white">
              Bağlantı geçersiz
            </h2>
            <p className="text-sm leading-relaxed text-white/50">
              Bu şifre sıfırlama bağlantısı geçersiz, süresi dolmuş ya da daha önce
              kullanılmış olabilir. Lütfen yeni bir talep oluşturun.
            </p>
            <Link
              href="/portal/sifre-sifirla"
              className="mt-6 inline-block text-sm font-medium text-accent hover:underline"
            >
              Yeni Talep Oluştur →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
