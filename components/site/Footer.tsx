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
                href="mailto:studio@vorte.com.tr"
                className="text-sm text-muted transition-colors hover:text-accent"
              >
                studio@vorte.com.tr
              </a>
              <span className="text-sm leading-relaxed text-muted2">
                Ankara Caddesi No:81 Bayraklı Tower K:1 No:, D:011, 35030
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

        {/* Divider */}
        <div className="mt-12 border-t border-border" />

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-[11px] text-muted2">
            &copy; {new Date().getFullYear()} İbrahim Yaşar — Vorte Studio. Tüm hakları saklıdır.
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
