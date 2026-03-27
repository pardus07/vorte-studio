"use client";

import RevealSection from "./RevealSection";

const services = [
  {
    num: "01",
    icon: "🌐",
    title: "Web Sitesi & Uygulama",
    desc: "Next.js ile statik hizinda dinamik siteler. WordPress'in bes kati hiz, SEO skoru 95+. Her pixel yerli yerinde.",
    tags: ["Next.js 15", "Tailwind", "Framer Motion", "Prisma", "ISR / SSG"],
    large: true,
  },
  {
    num: "02",
    icon: "📱",
    title: "Mobil Uygulama",
    desc: "Android native — Kotlin & Jetpack Compose. Play Store'da hazir. Smooth, fast, gercek.",
    tags: ["Kotlin", "Jetpack Compose", "Android"],
    large: false,
  },
  {
    num: "03",
    icon: "🛒",
    title: "E-Ticaret",
    desc: "Iyzico entegrasyonu, siparis yonetimi, stok takibi. Satmak icin tasarlanmis altyapi.",
    tags: ["Iyzico", "Odeme", "Admin panel"],
    large: false,
  },
  {
    num: "04",
    icon: "🛡️",
    title: "Bakim Paketi",
    desc: "Siteniz yayinda kalsin, guvende kalsin. Hosting, yedekleme, guncellemeler. Aylik sabit ucret.",
    tags: ["Hosting", "SSL", "7/24 Izleme"],
    large: false,
  },
];

export default function Services() {
  return (
    <section id="hizmetler" className="px-6 py-24 md:px-12 md:py-32">
      <div className="mb-16">
        <RevealSection>
          <div className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
            <span className="h-px w-6 bg-accent" />
            Hizmetler
          </div>
        </RevealSection>
        <RevealSection delay={100}>
          <h2 className="font-[family-name:var(--font-syne)] text-[clamp(32px,4vw,52px)] font-bold leading-tight tracking-[-0.03em]">
            Ne <span style={{ color: "rgba(255,255,255,0.25)" }}>Yapiyoruz?</span>
          </h2>
        </RevealSection>
      </div>

      <RevealSection delay={200} className="grid gap-3 md:grid-cols-3">
        {services.map((s) => (
          <div
            key={s.num}
            data-cursor
            className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-border bg-bg2 p-8 transition-all duration-300 hover:-translate-y-1 hover:bg-bg3 md:p-9 ${
              s.large ? "md:col-span-2" : ""
            }`}
            style={{ borderColor: undefined }}
          >
            <div
              className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-accent to-transparent"
              style={{ opacity: 0, transition: "opacity 0.3s" }}
            />
            <div className="mb-7 font-[family-name:var(--font-syne)] text-[11px] font-bold tracking-[0.1em] text-accent">
              {s.num}
            </div>
            <span className="mb-5 block text-[32px] grayscale" style={{ filter: "grayscale(1) brightness(2)" }}>
              {s.icon}
            </span>
            <h3 className="mb-3 font-[family-name:var(--font-syne)] text-[22px] font-bold tracking-[-0.02em]">
              {s.title}
            </h3>
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              {s.desc}
            </p>
            <div className="mt-6 flex flex-wrap gap-1.5">
              {s.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </RevealSection>
    </section>
  );
}
