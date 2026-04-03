"use client";

import { motion } from "framer-motion";

const services = [
  {
    num: "01",
    icon: "🌐",
    title: "Web Sitesi & Uygulama",
    desc: "Next.js ile statik hızında dinamik siteler. WordPress'in beş katı hız, SEO skoru 95+. Her pixel yerli yerinde.",
    tags: ["Next.js 15", "Tailwind", "Framer Motion", "Prisma", "ISR / SSG"],
    large: true,
  },
  {
    num: "02",
    icon: "📱",
    title: "Mobil Uygulama",
    desc: "Android native — Kotlin & Jetpack Compose. Play Store'da hazır. Smooth, fast, gerçek.",
    tags: ["Kotlin", "Jetpack Compose", "Android"],
    large: false,
  },
  {
    num: "03",
    icon: "🛒",
    title: "E-Ticaret",
    desc: "İyzico entegrasyonu, sipariş yönetimi, stok takibi. Satmak için tasarlanmış altyapı.",
    tags: ["İyzico", "Ödeme", "Admin panel"],
    large: false,
  },
  {
    num: "04",
    icon: "🛡️",
    title: "Bakım Paketi",
    desc: "Siteniz yayında kalsın, güvende kalsın. Hosting, yedekleme, güncellemeler. Aylık sabit ücret.",
    tags: ["Hosting", "SSL", "7/24 İzleme"],
    large: false,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.15,
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export default function Services() {
  return (
    <section id="hizmetler" className="px-6 py-24 md:px-12 lg:px-20 md:py-32">
      <div className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent"
        >
          <span className="h-px w-8 bg-accent" />
          Hizmetler
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-[family-name:var(--font-syne)] text-[clamp(32px,4vw,52px)] font-bold leading-tight tracking-[-0.03em]"
        >
          Ne <span className="text-white/25">Yapıyoruz?</span>
        </motion.h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {services.map((s, i) => (
          <motion.article
            key={s.num}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -6, transition: { duration: 0.3 } }}
            data-cursor
            className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-border bg-bg2 p-8 transition-colors duration-300 hover:bg-bg3 md:p-9 ${
              s.large ? "md:col-span-2" : ""
            }`}
          >
            {/* Gradient top border — visible on hover */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-accent via-accent/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Hover glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-accent/5 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative">
              <div className="mb-7 font-[family-name:var(--font-syne)] text-[11px] font-bold tracking-[0.12em] text-accent">
                {s.num}
              </div>
              <span
                className="mb-5 block text-[32px]"
                role="img"
                aria-label={s.title}
                style={{ filter: "grayscale(1) brightness(2)" }}
              >
                {s.icon}
              </span>
              <h3 className="mb-3 font-[family-name:var(--font-syne)] text-[22px] font-bold tracking-[-0.02em]">
                {s.title}
              </h3>
              <p className="max-w-xs text-sm leading-relaxed text-muted">
                {s.desc}
              </p>
              <ul
                className="mt-6 flex list-none flex-wrap gap-1.5"
                aria-label={`${s.title} teknolojileri`}
              >
                {s.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-border/60 bg-white/[0.03] px-3 py-1 text-[11px] text-muted transition-colors group-hover:border-accent/20 group-hover:text-white/70"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
