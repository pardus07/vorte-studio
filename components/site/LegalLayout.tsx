import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Hukuki sayfalar için ortak layout.
 * KVKK, Gizlilik, Çerez, Mesafeli Satış sayfalarında kullanılır.
 *
 * Prose stili: Tailwind v4'te typography plugin yok, custom sınıflar kullanıyoruz.
 * Sayfalar Google tarafından indekslenmeli (güven sinyali) — metadata robots: true.
 */

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

const LEGAL_LINKS = [
  { href: "/kvkk", label: "KVKK Aydınlatma" },
  { href: "/gizlilik-politikasi", label: "Gizlilik Politikası" },
  { href: "/cerez-politikasi", label: "Çerez Politikası" },
  { href: "/mesafeli-satis-sozlesmesi", label: "Mesafeli Satış" },
];

export default function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  return (
    <main className="min-h-screen bg-bg px-6 pt-32 pb-24 md:px-12 lg:px-20">
      <div className="mx-auto max-w-3xl">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-muted2">
          <Link href="/" className="transition-colors hover:text-accent">
            Ana Sayfa
          </Link>
          <span className="mx-2">/</span>
          <span className="text-muted">Hukuki</span>
        </div>

        {/* Title */}
        <header className="mb-10 border-b border-border pb-8">
          <h1 className="font-[family-name:var(--font-syne)] text-3xl font-extrabold text-white md:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm text-muted2">
            Son güncelleme: {lastUpdated}
          </p>
        </header>

        {/* Content */}
        <article className="legal-prose space-y-6 text-[15px] leading-relaxed text-muted">
          {children}
        </article>

        {/* Related legal links */}
        <nav
          aria-label="Diğer hukuki sayfalar"
          className="mt-16 rounded-xl border border-border bg-bg2 p-6"
        >
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted2">
            Diğer Hukuki Metinler
          </h2>
          <ul className="grid list-none grid-cols-1 gap-2 p-0 md:grid-cols-2">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-lg border border-border bg-bg px-4 py-3 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  {link.label} →
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact footer */}
        <div className="mt-8 text-center text-xs text-muted2">
          Sorularınız için:{" "}
          <a
            href="mailto:studio@vorte.com.tr"
            className="text-accent transition-colors hover:underline"
          >
            studio@vorte.com.tr
          </a>
        </div>
      </div>
    </main>
  );
}
