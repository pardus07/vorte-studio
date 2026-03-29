const techs = [
  "Next.js",
  "React Native",
  "Kotlin",
  "Jetpack Compose",
  "Tailwind CSS",
  "PostgreSQL",
  "Coolify",
  "TypeScript",
  "Prisma ORM",
  "Docker",
];

export default function Marquee() {
  return (
    <div
      className="overflow-hidden border-y border-border bg-bg2 py-4"
      role="marquee"
      aria-label={`Kullandığımız teknolojiler: ${techs.join(", ")}`}
    >
      <div className="flex w-max animate-[marquee_22s_linear_infinite] hover:[animation-play-state:paused]">
        {techs.map((tech) => (
          <span
            key={tech}
            className="flex items-center gap-9 whitespace-nowrap px-9 font-[family-name:var(--font-syne)] text-[13px] font-semibold uppercase tracking-[0.1em] text-muted after:text-[6px] after:text-accent after:content-['●']"
          >
            {tech}
          </span>
        ))}
        {/* Duplicate for seamless loop — hidden from screen readers */}
        {techs.map((tech) => (
          <span
            key={`dup-${tech}`}
            aria-hidden="true"
            className="flex items-center gap-9 whitespace-nowrap px-9 font-[family-name:var(--font-syne)] text-[13px] font-semibold uppercase tracking-[0.1em] text-muted after:text-[6px] after:text-accent after:content-['●']"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
