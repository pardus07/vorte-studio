"use client";

import { motion } from "framer-motion";

const steps = [
  { num: "01", name: "Keşif", time: "2-3 gün", desc: "İhtiyaç analizi ve hedef belirleme" },
  { num: "02", name: "Tasarım", time: "5-7 gün", desc: "UI/UX tasarımı ve prototip" },
  { num: "03", name: "Geliştirme", time: "2-4 hafta", desc: "Next.js / Kotlin ile kodlama" },
  { num: "04", name: "Test", time: "3-5 gün", desc: "Performans ve uyumluluk testleri" },
  { num: "05", name: "Yayın", time: "1 gün", desc: "Coolify ile canlıya alma" },
  { num: "06", name: "Destek", time: "Sürekli", desc: "Bakım, güncelleme ve izleme" },
];

export default function Process() {
  return (
    <section
      id="surec"
      className="border-t border-border px-6 py-24 md:px-12 lg:px-20 md:py-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent"
      >
        <span className="h-px w-8 bg-accent" />
        Nasıl Çalışırız
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="font-[family-name:var(--font-syne)] text-[clamp(32px,4vw,52px)] font-bold leading-tight tracking-[-0.03em]"
      >
        Süreç <span className="text-white/25">& Zaman</span>
      </motion.h2>

      <ol className="mt-16 grid list-none gap-px overflow-hidden rounded-2xl md:grid-cols-6">
        {steps.map((step, i) => (
          <motion.li
            key={step.num}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="group relative bg-bg px-6 py-8 transition-all duration-300 hover:bg-bg2"
            style={{
              borderRight:
                i < steps.length - 1
                  ? "1px solid rgba(255,255,255,0.06)"
                  : "none",
            }}
          >
            {/* Step connector dot */}
            <motion.div
              className="absolute -right-1.5 top-1/2 z-10 hidden h-3 w-3 -translate-y-1/2 rounded-full border-2 border-bg bg-accent md:block"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1, type: "spring", bounce: 0.5 }}
              style={{ display: i === steps.length - 1 ? "none" : undefined }}
            />

            <div className="mb-5 font-[family-name:var(--font-syne)] text-[11px] font-bold tracking-[0.12em] text-accent">
              {step.num}
            </div>
            <h3 className="mb-2 font-[family-name:var(--font-syne)] text-[16px] font-bold tracking-[-0.01em]">
              {step.name}
            </h3>
            <p className="text-[12px] leading-relaxed text-muted">
              {step.desc}
            </p>
            <div className="mt-4 inline-flex rounded-full border border-border/60 bg-white/[0.03] px-3 py-1 text-[10px] font-semibold text-accent">
              {step.time}
            </div>

            {/* Bottom line on hover */}
            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-accent transition-all duration-500 group-hover:w-full" />
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
