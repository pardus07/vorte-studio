"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const navLinks = [
  { label: "Hizmetler", href: "#hizmetler" },
  { label: "Portfolyo", href: "#portfolyo" },
  { label: "Süreç", href: "#surec" },
  { label: "Blog", href: "/blog" },
  { label: "İletişim", href: "#contact" },
];

const techBadges = ["Next.js", "React", "Kotlin", "Tailwind", "Prisma"];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg2 px-6 pt-16 pb-8 md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        {/* Top section */}
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand column */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="font-[family-name:var(--font-syne)] text-xl font-extrabold text-white">
                VORTE<span className="text-accent">.</span>STUDIO
              </div>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
                WordPress değil, gerçek kod. Next.js ve Kotlin ile sıfırdan, sizin için kodlarız.
              </p>
              {/* Built with badge */}
              <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-1.5 text-[10px] font-semibold text-muted2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Built with Next.js & Prisma
              </div>
            </motion.div>
          </div>

          {/* Navigation column */}
          <motion.nav
            aria-label="Footer menüsü"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted2">
              Sayfalar
            </h3>
            <ul className="flex list-none flex-col gap-2.5">
              {navLinks.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("/") ? (
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-accent"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </motion.nav>

          {/* Contact column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted2">
              İletişim
            </h3>
            <address className="flex flex-col gap-2.5 not-italic">
              <a
                href="tel:+908503058635"
                className="text-sm text-muted transition-colors hover:text-accent"
              >
                0850 305 86 35
              </a>
              <a
                href="mailto:info@vortestudio.com"
                className="text-sm text-muted transition-colors hover:text-accent"
              >
                info@vortestudio.com
              </a>
              <span className="text-sm leading-relaxed text-muted2">
                Çınarlı Mah. 1572/1 Sk. No: 3 İç Kapı No: 126, Konak / İzmir
              </span>
            </address>

            {/* Tech stack row */}
            <div className="mt-6 flex flex-wrap gap-1.5">
              {techBadges.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md bg-bg px-2 py-0.5 text-[10px] font-medium text-muted2"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Kurumsal künye — değerler app/(site)/kvkk/page.tsx tablosuyla aynı tutulur */}
        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            {/* Tüzel kişilik */}
            <div className="flex items-start gap-3">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
                <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
                <path d="M10 6h4" />
                <path d="M10 10h4" />
                <path d="M10 14h4" />
                <path d="M10 18h4" />
              </svg>
              <div>
                <div className="text-sm font-semibold text-white">Vorte Dijital Teknoloji A.Ş.</div>
                <ul className="mt-2 flex list-none flex-col gap-1 text-[12px] leading-relaxed text-muted2">
                  <li>Çınarlı Mah. 1572/1 Sk. No: 3 İç Kapı No: 126, Konak / İzmir</li>
                  <li>Vergi Kimlik No (VKN): 9251333007 · Karşıyaka V.D.</li>
                  <li>MERSIS No: 0925133300700001</li>
                  <li>Ticaret Sicil No: 274473</li>
                </ul>
              </div>
            </div>

            {/* KVKK uyumluluk */}
            <div className="flex items-start gap-3">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0 text-green-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <div>
                <div className="text-sm font-semibold text-white">KVKK Uyumlu</div>
                <p className="mt-2 text-[12px] leading-relaxed text-muted2">
                  VBS kayıt numarası beklemede · SSL aktif
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Güvenli Ödeme bandı — iyzico üye işyeri kriteri (logo görünürlüğü zorunlu) */}
        <div className="mt-8 flex flex-col items-start gap-3 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted2">
              Güvenli Ödeme
            </p>
            <p className="mt-1 max-w-md text-[11px] leading-relaxed text-muted2">
              Tüm ödemeler{" "}
              <a
                href="https://www.iyzico.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                iyzico
              </a>{" "}
              altyapısıyla, BDDK lisansı ve PCI-DSS uyumu kapsamında işlenir.
              Kart bilgileriniz sunucularımızda saklanmaz.
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/payment/iyzico-logo-band-white.svg"
            alt="iyzico ile öde · Visa · MasterCard · American Express · Troy"
            className="h-10 w-auto opacity-95"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Divider */}
        <div className="mt-8 border-t border-border" />

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-[11px] text-muted2">
            &copy; {new Date().getFullYear()} Vorte Dijital Teknoloji A.Ş. Tüm hakları saklıdır.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-muted2">
            <Link href="/kvkk" className="transition-colors hover:text-white">
              KVKK
            </Link>
            <span className="text-border">|</span>
            <Link href="/gizlilik-politikasi" className="transition-colors hover:text-white">
              Gizlilik Politikası
            </Link>
            <span className="text-border">|</span>
            <Link href="/cerez-politikasi" className="transition-colors hover:text-white">
              Çerez Politikası
            </Link>
            <span className="text-border">|</span>
            <Link href="/mesafeli-satis-sozlesmesi" className="transition-colors hover:text-white">
              Mesafeli Satış
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
