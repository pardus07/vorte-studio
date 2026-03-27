import PortfolioManager from "./portfolio-manager";

const seedPortfolio = [
  {
    id: "pf1", title: "Vorte Tekstil", slug: "vorte-tekstil",
    description: "İç giyim e-ticaret sitesi", category: "E-Ticaret",
    techStack: ["Next.js 15", "Prisma", "İyzico", "Coolify"],
    liveUrl: "https://vorte.com.tr", featured: true, isPublished: true,
    thumbnail: null, order: 1,
  },
  {
    id: "pf2", title: "KlineSage Dashboard", slug: "klinesage",
    description: "Kripto scalping bot dashboard", category: "Fintech",
    techStack: ["Next.js", "Chart.js", "FreqTrade"],
    liveUrl: null, featured: true, isPublished: true,
    thumbnail: null, order: 2,
  },
  {
    id: "pf3", title: "Android MVP", slug: "android-mvp",
    description: "Kotlin Jetpack Compose örnek uygulama", category: "Mobil",
    techStack: ["Kotlin", "Jetpack Compose", "Room", "Hilt"],
    liveUrl: null, featured: false, isPublished: true,
    thumbnail: null, order: 3,
  },
  {
    id: "pf4", title: "Restocafe Web", slug: "restocafe",
    description: "Restoran ve kafe web sitesi", category: "Web Sitesi",
    techStack: ["Next.js", "Tailwind", "Prisma"],
    liveUrl: "https://restocafe.com", featured: false, isPublished: false,
    thumbnail: null, order: 4,
  },
];

export default function PortfolioPage() {
  return <PortfolioManager initialItems={seedPortfolio} />;
}
