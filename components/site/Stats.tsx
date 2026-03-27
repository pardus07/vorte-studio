"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { target: 48, suffix: "+", label: "Teslim Edilen\nProje" },
  { target: 96, suffix: "%", label: "Musteri\nMemnuniyeti" },
  { target: 3, suffix: " hafta", label: "Ort. Teslimat\nSuresi" },
  { target: 95, suffix: "+", label: "Lighthouse\nPerformans Skoru" },
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
      style={{ fontSize: "clamp(36px, 5vw, 52px)" }}
    >
      {value}
      <span className="text-accent">{suffix}</span>
    </span>
  );
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 gap-px border-b border-border md:grid-cols-4"
      style={{ background: "rgba(255,255,255,0.07)" }}
    >
      {stats.map((stat, i) => (
        <div
          key={i}
          className="group relative overflow-hidden bg-bg px-6 py-10 transition-colors hover:bg-bg2 md:px-8"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
            transition: `all 0.6s ease ${i * 100}ms`,
          }}
        >
          <Counter target={stat.target} suffix={stat.suffix} inView={inView} />
          <div
            className="mt-2 text-[13px] leading-snug text-muted"
            style={{ whiteSpace: "pre-line" }}
          >
            {stat.label}
          </div>
          <div
            className="absolute bottom-0 left-0 h-0.5 bg-accent"
            style={{
              width: 0,
              transition: "width 0.4s ease",
            }}
          />
        </div>
      ))}
    </div>
  );
}
