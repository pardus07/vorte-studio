"use client";

import { signOut } from "next-auth/react";

/**
 * Portal sayfalarında kullanılan ortak hata ekranı.
 *
 * Neden buna ihtiyacımız var:
 * Eskiden dashboard/tasarim/sozlesme sayfaları veri bulamadığında
 * `redirect("/portal/giris")` yapıyordu. Ama middleware de giriş
 * sayfasından (logged-in portal kullanıcısı için) dashboard'a geri
 * yönlendiriyordu → sonsuz redirect döngüsü (ERR_TOO_MANY_REDIRECTS).
 *
 * Bu bileşen döngüyü kırıyor: veri bulunamadığında kullanıcıya
 * net bir mesaj gösteriyor ve "çıkış yap" opsiyonu sunuyor.
 * Böylece kullanıcı oturumundan çıkıp temiz bir şekilde tekrar
 * girebilir (veya biz durumu düzeltene kadar bekler).
 */
export default function PortalDataError({
  title = "Proje bilginiz yüklenemedi",
  message = "Hesabınızla ilişkilendirilmiş teklif veya sözleşme bilgisi bulunamadı. Sorun devam ederse bizimle iletişime geçin.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.07] bg-bg2 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="mt-3 text-sm text-white/60">{message}</p>
        <div className="mt-6 flex flex-col gap-2">
          <a
            href="mailto:studio@vorte.com.tr"
            className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-2.5 text-sm text-white hover:bg-white/[0.06]"
          >
            studio@vorte.com.tr
          </a>
          <button
            onClick={() => signOut({ callbackUrl: "/portal/giris" })}
            className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent/90"
          >
            Çıkış yap ve tekrar dene
          </button>
        </div>
      </div>
    </div>
  );
}
