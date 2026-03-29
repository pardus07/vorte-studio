"use client";

import RevealSection from "./RevealSection";

const techs = [
  "Next.js 15",
  "TypeScript",
  "React",
  "Tailwind CSS",
  "Prisma ORM",
  "PostgreSQL",
  "Kotlin",
  "Jetpack Compose",
  "Framer Motion",
  "Coolify",
  "Docker",
  "Iyzico",
];

export default function TechStack() {
  return (
    <section className="border-t border-border bg-bg2 px-6 py-20 md:px-12">
      <RevealSection>
        <div className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
          <span className="h-px w-6 bg-accent" />
          Teknoloji Farkı
        </div>
      </RevealSection>
      <RevealSection delay={100}>
        <h2 className="font-[family-name:var(--font-syne)] text-[clamp(32px,4vw,52px)] font-bold leading-tight tracking-[-0.03em]">
          WordPress değil<span style={{ color: "rgba(255,255,255,0.25)" }}>.</span>
          <br />
          Gerçek kod<span className="text-accent">.</span>
        </h2>
      </RevealSection>
      <RevealSection delay={200}>
        <p className="mt-2 text-sm text-muted" style={{ fontStyle: "italic" }}>
          Rakipler şablon kullanır. Biz Next.js, Kotlin ve modern stack ile
          sıfırdan, sizin için kodlarız.
        </p>
      </RevealSection>

      <RevealSection delay={300}>
        <ul className="mt-12 flex list-none flex-wrap gap-3" aria-label="Kullandığımız teknolojiler">
          {techs.map((tech) => (
            <li
              key={tech}
              className="cursor-default rounded-lg border border-border bg-bg px-4 py-2.5 text-[13px] font-medium text-muted transition-all hover:text-white"
            >
              {tech}
            </li>
          ))}
        </ul>
      </RevealSection>
    </section>
  );
}
