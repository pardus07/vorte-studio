import { prisma } from "@/lib/prisma";
import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import Marquee from "@/components/site/Marquee";
import Stats from "@/components/site/Stats";
import Services from "@/components/site/Services";
import Portfolio from "@/components/site/Portfolio";
import Process from "@/components/site/Process";
import TechStack from "@/components/site/TechStack";
import CTA from "@/components/site/CTA";
import Footer from "@/components/site/Footer";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let portfolioItems: {
    id: string;
    title: string;
    slug: string;
    category: string | null;
    techStack: string[];
    thumbnail: string | null;
    liveUrl: string | null;
    featured: boolean;
  }[] = [];

  try {
    portfolioItems = await prisma.portfolioItem.findMany({
      where: { isPublished: true },
      orderBy: [{ featured: "desc" }, { order: "asc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        techStack: true,
        thumbnail: true,
        liveUrl: true,
        featured: true,
      },
    });
  } catch {
    // DB not available at build time — use empty array, Portfolio component has fallback data
  }

  return (
    <>
      <Navbar />
      <Hero />
      <Marquee />
      <Stats />
      <Services />
      <Portfolio items={portfolioItems} />
      <Process />
      <TechStack />
      <CTA />
      <Footer />
    </>
  );
}
