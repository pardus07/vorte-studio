"use client";

import { motion } from "framer-motion";

const techs = [
  { name: "Next.js 15", desc: "Framework" },
  { name: "TypeScript", desc: "Dil" },
  { name: "React", desc: "UI" },
  { name: "Tailwind CSS", desc: "Stil" },
  { name: "Prisma ORM", desc: "Veritabanı" },
  { name: "PostgreSQL", desc: "DB" },
  { name: "Kotlin", desc: "Android" },
  { name: "Jetpack Compose", desc: "Mobil UI" },
  { name: "Framer Motion", desc: "Animasyon" },
  { name: "Coolify", desc: "Deploy" },
  { name: "Docker", desc: "Container" },
  { name: "Iyzico", desc: "Ödeme" },
];

const comparison = [
  { label: "Sayfa Hızı", us: "< 1 saniye", them: "3-5 saniye" },
  { label: "SEO Skoru", us: "95+", them: "60-75" },
  { label: "Özelleştirme", us: "Sınırsız", them: "Tema sınırlı" },
  { label: "Güvenlik", us: "Enterprise", them: "Plugin bağımlı" },
];

export default function TechStack() {
  return (
    <section className="border-t border-border bg-bg2 px-6 py-24 md:px-12 lg:px-20 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent"
      >
        <span className="h-px w-8 bg-accent" />
        Teknoloji Farkı
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="font-[family-name:var(--font-syne)] text-[clamp(32px,4vw,52px)] font-bold leading-tight tracking-[-0.03em]"
      >
        WordPress değil<span className="text-white/25">.</span>
        <br />
        Gerçek kod<span className="text-accent">.</span>
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mt-3 max-w-lg text-sm italic leading-relaxed text-muted"
      >
        Rakipler şablon kullanır. Biz Next.js, Kotlin ve modern stack ile
        sıfırdan, sizin için kodlarız.
      </motion.p>

      {/* Tech grid */}
      <div className="mt-14 flex flex-wrap gap-3" role="list" aria-label="Kullandığımız teknolojiler">
        {techs.map((tech, i) => (
          <motion.div
            key={tech.name}
            role="listitem"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
            whileHover={{ y: -3, borderColor: "rgba(255,69,0,0.3)" }}
            className="group cursor-default rounded-xl border border-border bg-bg px-5 py-3 transition-all"
          >
            <div className="text-[13px] font-semibold text-muted transition-colors group-hover:text-white">
              {tech.name}
            </div>
            <div className="mt-0.5 text-[10px] text-muted2">{tech.desc}</div>
          </motion.div>
        ))}
      </div>

      {/* Comparison table */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="mt-16 overflow-hidden rounded-2xl border border-border"
      >
        <div className="grid grid-cols-3 border-b border-border bg-bg3/50 px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted2">
          <span></span>
          <span className="text-center text-accent">Vorte Studio</span>
          <span className="text-center">WordPress</span>
        </div>
        {comparison.map((row, i) => (
          <div
            key={row.label}
            className={`grid grid-cols-3 px-6 py-3.5 text-[13px] ${
              i < comparison.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <span className="font-medium text-muted">{row.label}</span>
            <span className="text-center font-semibold text-accent">
              {row.us}
            </span>
            <span className="text-center text-muted2">{row.them}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
