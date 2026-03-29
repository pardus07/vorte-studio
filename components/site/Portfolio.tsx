"use client";

import RevealSection from "./RevealSection";

type PortfolioItemData = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  techStack: string[];
  thumbnail: string | null;
  liveUrl: string | null;
};

const fallbackItems: PortfolioItemData[] = [
  {
    id: "1",
    title: "Vorte Tekstil",
    slug: "vorte-tekstil",
    category: "E-Ticaret / Tekstil",
    techStack: ["Next.js 15", "Prisma", "PostgreSQL", "Iyzico", "Coolify"],
    thumbnail: null,
    liveUrl: "https://vorte.com.tr",
  },
  {
    id: "2",
    title: "KlineSage Dashboard",
    slug: "klinesage",
    category: "Fintech / Kripto",
    techStack: ["Next.js", "Chart.js", "FreqTrade API"],
    thumbnail: null,
    liveUrl: null,
  },
  {
    id: "3",
    title: "Android MVP Örnek",
    slug: "android-mvp",
    category: "Mobil Uygulama",
    techStack: ["Kotlin", "Jetpack Compose", "Room", "Hilt"],
    thumbnail: null,
    liveUrl: null,
  },
];

const bgGradients = [
  "linear-gradient(135deg, #0f0f12, #1a1a24)",
  "linear-gradient(135deg, #0a0f0a, #151f15)",
  "linear-gradient(135deg, #0f0a0f, #1f151f)",
];

export default function Portfolio({
  items,
}: {
  items?: PortfolioItemData[];
}) {
  const data = items && items.length > 0 ? items : fallbackItems;

  return (
    <section
      id="portfolyo"
      className="border-t border-border bg-bg2 px-6 py-24 md:px-12 md:py-32"
    >
      <RevealSection>
        <div className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
          <span className="h-px w-6 bg-accent" />
          Seçilen Çalışmalar
        </div>
      </RevealSection>
      <RevealSection delay={100}>
        <h2 className="font-[family-name:var(--font-syne)] text-[clamp(32px,4vw,52px)] font-bold leading-tight tracking-[-0.03em]">
          Son <span style={{ color: "rgba(255,255,255,0.25)" }}>Projelerimiz</span>
        </h2>
      </RevealSection>

      <RevealSection delay={200} className="mt-16 grid gap-4 md:grid-cols-2">
        {data.map((item, i) => (
          <div
            key={item.id}
            data-cursor
            className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-border ${
              i === 0 ? "md:col-span-2" : ""
            }`}
            style={{ aspectRatio: i === 0 ? "21/9" : "16/10" }}
          >
            {item.thumbnail ? (
              <img
                src={item.thumbnail}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105"
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center font-[family-name:var(--font-syne)] font-extrabold tracking-[-0.05em]"
                style={{
                  background: bgGradients[i % bgGradients.length],
                  fontSize: i === 0 ? 80 : 48,
                  color:
                    i === 0 ? "rgba(255,69,0,0.1)" : "rgba(255,255,255,0.04)",
                  transition: "transform 0.7s cubic-bezier(0.23,1,0.32,1)",
                }}
              >
                {item.title.split(" ")[0]?.toUpperCase().slice(0, 5)}
              </div>
            )}

            <div
              className="absolute inset-0 flex flex-col justify-end p-8"
              style={{
                background: "rgba(8,8,8,0.85)",
                opacity: 0,
                transition: "opacity 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
            >
              <div className="mb-1.5 text-[11px] uppercase tracking-[0.12em] text-accent">
                {item.category}
              </div>
              <div className="mb-2 font-[family-name:var(--font-syne)] text-2xl font-bold tracking-[-0.02em]">
                {item.title}
              </div>
              <div className="text-xs text-muted">
                {item.techStack.join(" · ")}
              </div>
            </div>

            <div
              className="absolute right-7 top-7 flex h-11 w-11 items-center justify-center rounded-full bg-accent text-lg text-white"
              style={{
                transform: "rotate(-45deg)",
                transition: "transform 0.2s",
              }}
            >
              &#8599;
            </div>
          </div>
        ))}
      </RevealSection>
    </section>
  );
}
