"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Hizmetler", href: "#hizmetler" },
  { label: "Portfolyo", href: "#portfolyo" },
  { label: "Süreç", href: "#surec" },
  { label: "Blog", href: "#blog" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <a
        href="#hizmetler"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        İçeriğe geç
      </a>

      <motion.nav
        aria-label="Ana menü"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 transition-all duration-500 md:px-12 ${
          scrolled
            ? "border-b border-white/[0.06] bg-bg/80 py-4 backdrop-blur-2xl"
            : "border-b border-transparent"
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          className="group font-[family-name:var(--font-syne)] text-lg font-extrabold tracking-tight text-white"
        >
          VORTE
          <span className="text-accent transition-all group-hover:drop-shadow-[0_0_8px_rgba(255,69,0,0.5)]">
            .
          </span>
          STUDIO
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-10 md:flex">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="group relative text-sm text-muted transition-colors hover:text-white"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <a
          href="#contact"
          className="hidden items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/30 md:inline-flex"
        >
          Proje Başlat
          <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </a>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white md:hidden"
          aria-label={mobileOpen ? "Menüyü kapat" : "Menüyü aç"}
        >
          <div className="relative h-4 w-5">
            <span
              className={`absolute left-0 h-px w-full bg-white transition-all duration-300 ${
                mobileOpen ? "top-2 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-2 h-px w-full bg-white transition-all duration-300 ${
                mobileOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 h-px w-full bg-white transition-all duration-300 ${
                mobileOpen ? "top-2 -rotate-45" : "top-4"
              }`}
            />
          </div>
        </button>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col bg-bg/95 backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-1 flex-col items-center justify-center gap-8">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setMobileOpen(false)}
                  className="font-[family-name:var(--font-syne)] text-3xl font-bold text-white transition-colors hover:text-accent"
                >
                  {item.label}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => setMobileOpen(false)}
                className="mt-4 rounded-xl bg-accent px-8 py-4 text-lg font-semibold text-white"
              >
                Proje Başlat &rarr;
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
