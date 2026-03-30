"use client";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6">
      <div className="max-w-md text-center">
        <h2 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-white">
          Bir hata oluştu
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {error.message || "Beklenmedik bir hata meydana geldi. Lütfen tekrar deneyin."}
        </p>
        <button
          onClick={reset}
          className="mt-6 rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent2"
        >
          Tekrar Dene
        </button>
      </div>
    </div>
  );
}
