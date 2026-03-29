import { getPortfolioItems } from "@/actions/portfolio";
import PortfolioManager from "./portfolio-manager";

export const dynamic = "force-dynamic";

const seedPortfolio = [
  { id: "pf1", title: "Vorte Tekstil", slug: "vorte-tekstil", description: "İç giyim e-ticaret sitesi", category: "E-Ticaret", techStack: ["Next.js 15", "Prisma", "İyzico", "Coolify"], liveUrl: "https://vorte.com.tr", featured: true, isPublished: true, thumbnail: null, order: 1 },
  { id: "pf2", title: "KlineSage Dashboard", slug: "klinesage", description: "Kripto scalping bot dashboard", category: "Fintech", techStack: ["Next.js", "Chart.js", "FreqTrade"], liveUrl: null, featured: true, isPublished: true, thumbnail: null, order: 2 },
  { id: "pf3", title: "Android MVP", slug: "android-mvp", description: "Kotlin Jetpack Compose örnek uygulama", category: "Mobil", techStack: ["Kotlin", "Jetpack Compose", "Room", "Hilt"], liveUrl: null, featured: false, isPublished: true, thumbnail: null, order: 3 },
];

export default async function PortfolioPage() {
  const items = await getPortfolioItems();

  const data = items.length > 0
    ? items.map((i) => ({
        id: i.id, title: i.title, slug: i.slug,
        description: i.description, category: i.category,
        techStack: i.techStack, liveUrl: i.liveUrl,
        featured: i.featured, isPublished: i.isPublished,
        thumbnail: i.thumbnail, order: i.order,
      }))
    : seedPortfolio;

  return <PortfolioManager initialItems={data} />;
}
