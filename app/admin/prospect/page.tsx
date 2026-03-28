import { prisma } from "@/lib/prisma";
import ProspectSearch from "./prospect-search";

export const dynamic = "force-dynamic";

async function getProspects() {
  try {
    const batch = await prisma.prospectBatch.findFirst({
      orderBy: { createdAt: "desc" },
      include: {
        prospects: { orderBy: { score: "desc" } },
      },
    });

    if (batch && batch.prospects.length > 0) {
      const leadNames = await prisma.lead.findMany({
        where: { source: "MAPS_SCRAPER" },
        select: { name: true },
      });
      const leadNameSet = new Set(leadNames.map((l) => l.name));

      return {
        prospects: batch.prospects.map((p) => ({
          id: p.id,
          name: p.name,
          phone: p.phone,
          website: p.website,
          address: p.address,
          googleRating: p.googleRating,
          googleReviews: p.googleReviews,
          googleMapsUrl: p.googleMapsUrl,
          mobileScore: p.mobileScore,
          sslValid: true,
          hasWebsite: p.hasWebsite,
          score: p.score,
          issue: p.issue,
          addedToLeads: p.addedToLeads || leadNameSet.has(p.name),
        })),
        query: batch.query,
      };
    }
  } catch { /* DB hatası */ }

  // Boş başla — scraper ile arama yapılınca sonuçlar gelecek
  return {
    prospects: [],
    query: "",
  };
}

export default async function ProspectPage() {
  const { prospects, query } = await getProspects();

  return (
    <ProspectSearch
      initialProspects={prospects}
      batchInfo={{ query, totalFound: prospects.length }}
    />
  );
}
