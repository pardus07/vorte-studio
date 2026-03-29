"use client";

import RevealSection from "./RevealSection";

const steps = [
  { num: "01", name: "Keşif", time: "2-3 gün" },
  { num: "02", name: "Tasarım", time: "5-7 gün" },
  { num: "03", name: "Geliştirme", time: "2-4 hafta" },
  { num: "04", name: "Test", time: "3-5 gün" },
  { num: "05", name: "Yayın", time: "1 gün" },
  { num: "06", name: "Destek", time: "Sürekli" },
];

export default function Process() {
  return (
    <section
      id="surec"
      className="border-t border-border px-6 py-24 md:px-12 md:py-32"
    >
      <RevealSection>
        <div className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
          <span className="h-px w-6 bg-accent" />
          Nasıl Çalışırız
        </div>
      </RevealSection>
      <RevealSection delay={100}>
        <h2 className="font-[family-name:var(--font-syne)] text-[clamp(32px,4vw,52px)] font-bold leading-tight tracking-[-0.03em]">
          Süreç <span style={{ color: "rgba(255,255,255,0.25)" }}>&amp; Zaman</span>
        </h2>
      </RevealSection>

      <RevealSection delay={200}>
        <ol className="mt-16 grid list-none gap-px overflow-hidden rounded-2xl md:grid-cols-6">
          {steps.map((step) => (
            <li
              key={step.num}
              className="relative bg-bg px-6 py-8 transition-colors hover:bg-bg2"
              style={{ borderRight: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="mb-5 font-[family-name:var(--font-syne)] text-[11px] font-bold tracking-[0.1em] text-accent" aria-hidden="true">
                {step.num}
              </div>
              <h3 className="mb-2 font-[family-name:var(--font-syne)] text-[15px] font-bold tracking-[-0.01em]">
                {step.name}
              </h3>
              <p className="text-xs text-muted">{step.time}</p>
            </li>
          ))}
        </ol>
      </RevealSection>
    </section>
  );
}
