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
  // Duplicate for seamless loop
  const items = [...techs, ...techs];

  return (
    <div className="overflow-hidden border-y border-border bg-bg2 py-4">
      <div className="flex w-max animate-[marquee_22s_linear_infinite] hover:[animation-play-state:paused]">
        {items.map((tech, i) => (
          <span
            key={i}
            className="flex items-center gap-9 whitespace-nowrap px-9 font-[family-name:var(--font-syne)] text-[13px] font-semibold uppercase tracking-[0.1em] text-muted after:text-[6px] after:text-accent after:content-['●']"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
