"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a
        href="#hizmetler"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        İçeriğe geç
      </a>
      <nav
        aria-label="Ana menü"
        className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-6 transition-all duration-300 md:px-12 ${
          scrolled
            ? "border-b border-border bg-bg/85 backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
      <Link
        href="/"
        className="font-[family-name:var(--font-syne)] text-lg font-extrabold tracking-tight text-white"
      >
        VORTE<span className="text-accent">.</span>STUDIO
      </Link>

      <ul className="hidden gap-9 md:flex">
        {["Hizmetler", "Portfolyo", "Süreç"].map((item) => (
          <li key={item}>
            <a
              href={`#${item.toLowerCase()}`}
              className="text-sm text-muted transition-colors hover:text-white"
            >
              {item}
            </a>
          </li>
        ))}
      </ul>

      <a
        href="#contact"
        className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-accent2"
      >
        Proje Başlat &rarr;
      </a>
      </nav>
    </>
  );
}
