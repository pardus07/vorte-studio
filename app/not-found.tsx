import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-6"
      style={{ background: "#080808", color: "#f0f0f0" }}
    >
      <div className="max-w-md text-center">
        <h1
          className="text-7xl font-extrabold"
          style={{ fontFamily: "var(--font-syne)", color: "#FF4500" }}
        >
          404
        </h1>
        <h2
          className="mt-4 text-xl font-bold"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          Sayfa Bulunamadı
        </h2>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "#666" }}>
          Aradığınız sayfa taşınmış veya kaldırılmış olabilir.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-colors"
            style={{ background: "#FF4500" }}
          >
            Ana Sayfa
          </Link>
          <Link
            href="/blog"
            className="rounded-lg border px-6 py-2.5 text-sm font-medium transition-colors"
            style={{ borderColor: "rgba(255,255,255,0.1)", color: "#999" }}
          >
            Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
