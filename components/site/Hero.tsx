"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const words = ["Next.js", "Kotlin", "React", "Tailwind", "Prisma"];

function useTypewriter(items: string[], typingSpeed = 80, pause = 2000) {
  const [display, setDisplay] = useState("");
  const [idx, setIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = items[idx];
    const timeout = deleting ? typingSpeed / 2 : typingSpeed;

    if (!deleting && display === current) {
      const t = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(t);
    }
    if (deleting && display === "") {
      setDeleting(false);
      setIdx((prev) => (prev + 1) % items.length);
      return;
    }

    const t = setTimeout(() => {
      setDisplay(
        deleting
          ? current.slice(0, display.length - 1)
          : current.slice(0, display.length + 1)
      );
    }, timeout);
    return () => clearTimeout(t);
  }, [display, deleting, idx, items, typingSpeed, pause]);

  return display;
}

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const wordReveal = {
  hidden: { opacity: 0, y: 40, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, bounce: 0.3, duration: 1.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: d, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function Hero() {
  const typed = useTypewriter(words);

  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 md:px-12 lg:px-20">
      {/* Animated grid background */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)",
        }}
      />

      {/* Floating animated orb */}
      <motion.div
        className="pointer-events-none absolute"
        aria-hidden="true"
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          width: 700,
          height: 700,
          top: -150,
          right: -200,
          background:
            "radial-gradient(circle, rgba(255,69,0,0.12) 0%, rgba(255,69,0,0.04) 40%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Secondary orb */}
      <motion.div
        className="pointer-events-none absolute"
        aria-hidden="true"
        animate={{
          x: [0, -20, 30, 0],
          y: [0, 30, -20, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        style={{
          width: 400,
          height: 400,
          bottom: 100,
          left: -100,
          background:
            "radial-gradient(circle, rgba(255,107,53,0.06) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      {/* Tag */}
      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0}
        className="mb-8 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent"
      >
        <motion.span
          className="block h-px bg-accent"
          initial={{ width: 0 }}
          animate={{ width: 32 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        />
        Dijital Stüdyo
      </motion.p>

      {/* Title — staggered word reveal */}
      <motion.h1
        variants={container}
        initial="hidden"
        animate="visible"
        className="max-w-[900px] font-[family-name:var(--font-syne)] font-extrabold leading-[0.92] tracking-[-0.04em]"
        style={{ fontSize: "clamp(48px, 8vw, 110px)" }}
      >
        <motion.span variants={wordReveal} className="block">
          Dijital Dünyada
        </motion.span>
        <motion.span
          variants={wordReveal}
          className="block"
          style={{
            WebkitTextStroke: "2px rgba(255,255,255,0.15)",
            color: "transparent",
          }}
        >
          Fark Yaratan
        </motion.span>
        <motion.span variants={wordReveal} className="block">
          Deneyimler
          <span className="text-accent">.</span>
        </motion.span>
      </motion.h1>

      {/* Subtitle with typewriter */}
      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.8}
        className="mt-9 max-w-lg text-base leading-relaxed text-muted md:text-lg"
      >
        <span className="inline-flex h-7 items-center rounded-md bg-accent/10 px-2.5 font-mono text-sm font-semibold text-accent">
          {typed}
          <span className="ml-0.5 animate-pulse">|</span>
        </span>
        {" "}ve modern teknolojilerle web siteleri ve mobil uygulamalar
        geliştiriyoruz. WordPress değil — gerçek kod, gerçek hız, gerçek sonuç.
      </motion.p>

      {/* Actions */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1.1}
        className="mt-12 flex flex-wrap items-center gap-4"
      >
        <a
          href="#contact"
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-accent px-8 py-4 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/25"
        >
          {/* Shine effect */}
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <span className="relative">Projenizi Konuşalım</span>
          <svg className="relative h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </a>
        <a
          href="#portfolyo"
          className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-4 text-sm font-medium text-muted transition-all hover:border-accent/30 hover:text-white"
        >
          Çalışmalarımıza Bakın
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M8 3v10M4 9l4 4 4-4" />
          </svg>
        </a>
      </motion.div>

      {/* Tech badge row */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1.4}
        className="mt-16 flex flex-wrap items-center gap-3"
      >
        <span className="text-[10px] uppercase tracking-widest text-muted2">
          Teknolojilerimiz
        </span>
        {["Next.js", "Kotlin", "TypeScript", "Tailwind", "PostgreSQL"].map(
          (t) => (
            <span
              key={t}
              className="rounded-full border border-border/60 bg-bg2/50 px-3 py-1 text-[11px] font-medium text-muted backdrop-blur-sm"
            >
              {t}
            </span>
          )
        )}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        aria-hidden="true"
      >
        <motion.div
          animate={{ height: [20, 48, 20] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px bg-gradient-to-b from-accent to-transparent"
        />
        <span className="text-[9px] uppercase tracking-[0.15em] text-muted2">
          Kaydır
        </span>
      </motion.div>
    </section>
  );
}
