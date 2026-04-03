"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type PortfolioItemData = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  techStack: string[];
  thumbnail: string | null;
  liveUrl: string | null;
  featured: boolean;
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
    featured: true,
  },
  {
    id: "2",
    title: "KlineSage Dashboard",
    slug: "klinesage",
    category: "Fintech / Kripto",
    techStack: ["Next.js", "Chart.js", "FreqTrade API"],
    thumbnail: null,
    liveUrl: null,
    featured: false,
  },
  {
    id: "3",
    title: "Android MVP Örnek",
    slug: "android-mvp",
    category: "Mobil Uygulama",
    techStack: ["Kotlin", "Jetpack Compose", "Room", "Hilt"],
    thumbnail: null,
    liveUrl: null,
    featured: false,
  },
];

const bgGradients = [
  "linear-gradient(135deg, #0f0f12 0%, #1a1a24 50%, #0f0f12 100%)",
  "linear-gradient(135deg, #0a0f0a 0%, #151f15 50%, #0a0f0a 100%)",
  "linear-gradient(135deg, #0f0a0f 0%, #1f151f 50%, #0f0a0f 100%)",
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
      className="border-t border-border bg-bg2 px-6 py-24 md:px-12 lg:px-20 md:py-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent"
      >
        <span className="h-px w-8 bg-accent" />
        Seçilen Çalışmalar
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="font-[family-name:var(--font-syne)] text-[clamp(32px,4vw,52px)] font-bold leading-tight tracking-[-0.03em]"
      >
        Son <span className="text-white/25">Projelerimiz</span>
      </motion.h2>

      <div className="mt-16 grid gap-4 md:grid-cols-2">
        {data.map((item, i) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 50, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            data-cursor
            className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-border bg-bg2 ${
              item.featured ? "md:col-span-2" : ""
            }`}
            style={
              item.thumbnail
                ? undefined
                : { aspectRatio: item.featured ? "21/9" : "16/10" }
            }
          >
            {item.thumbnail ? (
              <Image
                src={item.thumbnail}
                alt={`${item.title} — ${item.category || "Proje"}`}
                width={item.featured ? 1200 : 600}
                height={item.featured ? 514 : 375}
                className="h-full w-full object-contain transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105"
                loading={i === 0 ? "eager" : "lazy"}
                sizes={
                  item.featured
                    ? "100vw"
                    : "(max-width: 768px) 100vw, 50vw"
                }
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center font-[family-name:var(--font-syne)] font-extrabold tracking-[-0.05em] transition-transform duration-700 group-hover:scale-105"
                style={{
                  background: bgGradients[i % bgGradients.length],
                  fontSize: item.featured ? 80 : 48,
                  color: item.featured
                    ? "rgba(255,69,0,0.08)"
                    : "rgba(255,255,255,0.03)",
                }}
                role="img"
                aria-label={`${item.title} proje görseli`}
              >
                {item.title.split(" ")[0]?.toUpperCase().slice(0, 5)}
              </div>
            )}

            {/* Overlay — CSS only, no inline JS, mobile friendly */}
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent p-8 opacity-0 transition-opacity duration-400 group-hover:opacity-100 md:from-black/80">
              <p className="mb-1.5 text-[11px] uppercase tracking-[0.12em] text-accent">
                {item.category}
              </p>
              <h3 className="mb-2 font-[family-name:var(--font-syne)] text-2xl font-bold tracking-[-0.02em] text-white">
                {item.title}
              </h3>
              <p className="text-xs text-white/60">
                {item.techStack.join(" · ")}
              </p>
            </div>

            {/* Link button */}
            {item.liveUrl ? (
              <a
                href={item.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${item.title} sitesini ziyaret et`}
                className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full bg-accent text-lg text-white shadow-lg shadow-accent/20 transition-all hover:scale-110 hover:shadow-xl hover:shadow-accent/30"
                style={{ transform: "rotate(-45deg)" }}
              >
                &#8599;
              </a>
            ) : (
              <div
                className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full bg-accent/80 text-lg text-white"
                style={{ transform: "rotate(-45deg)" }}
                aria-hidden="true"
              >
                &#8599;
              </div>
            )}
          </motion.article>
        ))}
      </div>
    </section>
  );
}
