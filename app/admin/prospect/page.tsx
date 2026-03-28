import { prisma } from "@/lib/prisma";
import ProspectSearch from "./prospect-search";

export const dynamic = "force-dynamic";

// Mock prospect data — scraper yapılandırılana kadar fallback
const mockProspects = [
  {
    id: "mp1", name: "Güneş Diş Kliniği", phone: "0242 321 XX XX", website: null,
    address: "Muratpaşa, Antalya", googleRating: 4.7, googleReviews: 128,
    googleMapsUrl: null, mobileScore: null, hasWebsite: false, score: 92,
    issue: "Site yok", addedToLeads: false,
  },
  {
    id: "mp2", name: "Dentaplus Ağız", phone: "0242 248 XX XX", website: "dentaplus.com.tr",
    address: "Konyaaltı, Antalya", googleRating: 4.3, googleReviews: 67,
    googleMapsUrl: null, mobileScore: 23, hasWebsite: true, score: 75,
    issue: "Mobil 23/100", addedToLeads: false,
  },
  {
    id: "mp3", name: "Smile Center", phone: "0242 502 XX XX", website: "smilecenter.com",
    address: "Muratpaşa, Antalya", googleRating: 4.9, googleReviews: 312,
    googleMapsUrl: null, mobileScore: 45, hasWebsite: true, score: 60,
    issue: "Mobil 45/100", addedToLeads: false,
  },
  {
    id: "mp4", name: "Antalya Implant", phone: "0242 316 XX XX", website: "antalyaimplant.com",
    address: "Kepez, Antalya", googleRating: 4.1, googleReviews: 24,
    googleMapsUrl: null, mobileScore: null, hasWebsite: true, score: 35,
    issue: "SSL yok", addedToLeads: false,
  },
  {
    id: "mp5", name: "Özel Dent", phone: null, website: null,
    address: "Döşemealtı, Antalya", googleRating: 3.8, googleReviews: 11,
    googleMapsUrl: null, mobileScore: null, hasWebsite: false, score: 40,
    issue: "Site yok", addedToLeads: false,
  },
  {
    id: "mp6", name: "AkDent Kliniği", phone: "0242 444 XX XX", website: "akdent.com.tr",
    address: "Muratpaşa, Antalya", googleRating: 4.5, googleReviews: 89,
    googleMapsUrl: null, mobileScore: 72, hasWebsite: true, score: 15,
    issue: "Düşük öncelik", addedToLeads: false,
  },
];

async function getProspects() {
  try {
    const batch = await prisma.prospectBatch.findFirst({
      orderBy: { createdAt: "desc" },
      include: {
        prospects: { orderBy: { score: "desc" } },
      },
    });

    if (batch && batch.prospects.length > 0) {
      // Hangi prospect'ler zaten lead olarak eklendi kontrol et
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
          hasWebsite: p.hasWebsite,
          score: p.score,
          issue: p.issue,
          addedToLeads: p.addedToLeads || leadNameSet.has(p.name),
        })),
        query: batch.query,
      };
    }
  } catch { /* DB hatası — mock fallback */ }

  // Mock data — addedToLeads kontrolü: DB'deki lead'lerle eşleştir
  try {
    const leadNames = await prisma.lead.findMany({
      where: { source: "MAPS_SCRAPER" },
      select: { name: true },
    });
    const leadNameSet = new Set(leadNames.map((l) => l.name));

    return {
      prospects: mockProspects.map((p) => ({
        ...p,
        addedToLeads: p.addedToLeads || leadNameSet.has(p.name),
      })),
      query: "Diş Klinikleri in Antalya",
    };
  } catch {
    return {
      prospects: mockProspects,
      query: "Diş Klinikleri in Antalya",
    };
  }
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
