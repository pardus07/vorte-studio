"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="max-w-md rounded-2xl border border-admin-border bg-admin-bg2 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-admin-red-dim">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h2 className="mb-2 text-lg font-semibold text-admin-text">
          Bir hata oluştu
        </h2>
        <p className="mb-6 text-sm text-admin-muted">
          {error.message || "Beklenmedik bir hata meydana geldi."}
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-admin-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-admin-accent/90"
        >
          Tekrar Dene
        </button>
      </div>
    </div>
  );
}
