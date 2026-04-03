"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { target: 48, suffix: "+", label: "Teslim Edilen Proje" },
  { target: 96, suffix: "%", label: "Müşteri Memnuniyeti" },
  { target: 3, suffix: " hafta", label: "Ort. Teslimat Süresi" },
  { target: 95, suffix: "+", label: "Lighthouse Performans" },
];

function Counter({
  target,
  suffix,
  inView,
}: {
  target: number;
  suffix: string;
  inView: boolean;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const start = performance.now();
    function step(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [inView, target]);

  return (
    <span
      className="font-[family-name:var(--font-syne)] font-extrabold leading-none tracking-[-0.04em] text-white"
      style={{ fontSize: "clamp(36px, 5vw, 56px)" }}
    >
      {value}
      <span className="text-accent">{suffix}</span>
    </span>
  );
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      aria-label="Rakamlarla Vorte Studio"
      className="grid grid-cols-2 gap-px border-y border-border md:grid-cols-4"
      style={{ background: "rgba(255,255,255,0.06)" }}
    >
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="group relative overflow-hidden bg-bg px-6 py-12 transition-colors hover:bg-bg2 md:px-10"
        >
          {/* Hover glow */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="relative">
            <Counter target={stat.target} suffix={stat.suffix} inView={inView} />
            <div className="mt-3 text-[13px] leading-snug text-muted">
              {stat.label}
            </div>
          </div>

          {/* Bottom accent line — animated on view */}
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-accent"
            initial={{ width: "0%" }}
            animate={inView ? { width: "100%" } : {}}
            transition={{ delay: 0.8 + i * 0.15, duration: 0.8, ease: "easeOut" }}
          />
        </motion.div>
      ))}
    </section>
  );
}
