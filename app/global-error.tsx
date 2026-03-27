"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="tr">
      <body
        style={{
          background: "#080808",
          color: "#f0f0f0",
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          margin: 0,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: 24, marginBottom: 16 }}>
            Bir hata olustu
          </h2>
          <p style={{ color: "#666", marginBottom: 24 }}>
            {error.message || "Beklenmedik bir hata meydana geldi."}
          </p>
          <button
            onClick={reset}
            style={{
              background: "#f97316",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: 8,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Tekrar Dene
          </button>
        </div>
      </body>
    </html>
  );
}
