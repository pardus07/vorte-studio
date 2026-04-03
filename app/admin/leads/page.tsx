import { prisma } from "@/lib/prisma";
import KanbanBoard from "./kanban-board";

export const dynamic = "force-dynamic";

const seedLeads = [
  { id: "l1", name: "Güneş Diş Kliniği", company: "Muratpaşa, Antalya", source: "MAPS_SCRAPER", status: "COLD", budget: "₺12-18K", sector: "Sağlık", phone: null, email: null, website: null, address: "Muratpaşa, Antalya", notes: null, googleMapsUrl: null, hasWebsite: false, mobileScore: null, sslValid: false, waTemplate: null, waTemplateSector: null, waTemplateSlug: null, waSentAt: null, updatedAt: "2026-03-27" },
  { id: "l2", name: "Deniz Eczanesi", company: "Konyaaltı, Antalya", source: "MAPS_SCRAPER", status: "COLD", budget: "₺8-12K", sector: "Sağlık", phone: null, email: null, website: null, address: "Konyaaltı, Antalya", notes: null, googleMapsUrl: null, hasWebsite: false, mobileScore: null, sslValid: false, waTemplate: null, waTemplateSector: null, waTemplateSlug: null, waSentAt: null, updatedAt: "2026-03-26" },
  { id: "l3", name: "Koray Hukuk Bürosu", company: "Konyaaltı, Antalya", source: "SITE_FORM", status: "MEETING", budget: "₺20-25K", sector: "Hukuk", phone: null, email: null, website: null, address: "Konyaaltı, Antalya", notes: null, googleMapsUrl: null, hasWebsite: false, mobileScore: null, sslValid: false, waTemplate: null, waTemplateSector: null, waTemplateSlug: null, waSentAt: null, updatedAt: "2026-03-23" },
  { id: "l4", name: "Sarıgül Otomotiv", company: "Kepez, Antalya", source: "REFERRAL", status: "QUOTED", budget: "₺18K", sector: "Otomotiv", phone: null, email: null, website: null, address: "Kepez, Antalya", notes: null, googleMapsUrl: null, hasWebsite: false, mobileScore: null, sslValid: false, waTemplate: null, waTemplateSector: null, waTemplateSlug: null, waSentAt: null, updatedAt: "2026-03-20" },
  { id: "l5", name: "Akdeniz Spor", company: "Kepez, Antalya", source: "LINKEDIN", status: "QUOTED", budget: "₺60-80K", sector: "Spor", phone: null, email: null, website: null, address: "Kepez, Antalya", notes: null, googleMapsUrl: null, hasWebsite: false, mobileScore: null, sslValid: false, waTemplate: null, waTemplateSector: null, waTemplateSlug: null, waSentAt: null, updatedAt: "2026-03-23" },
  { id: "l6", name: "DisSağlık Dental", company: "Muratpaşa", source: "MANUAL", status: "WON", budget: "₺22K", sector: "Sağlık", phone: null, email: null, website: null, address: "Muratpaşa", notes: null, googleMapsUrl: null, hasWebsite: false, mobileScore: null, sslValid: false, waTemplate: null, waTemplateSector: null, waTemplateSlug: null, waSentAt: null, updatedAt: "2026-03-15" },
  { id: "l7", name: "Otopark Plus", company: "Antalya", source: "MAPS_SCRAPER", status: "LOST", budget: "₺10K", sector: "Otopark", phone: null, email: null, website: null, address: "Antalya", notes: null, googleMapsUrl: null, hasWebsite: false, mobileScore: null, sslValid: false, waTemplate: null, waTemplateSector: null, waTemplateSlug: null, waSentAt: null, updatedAt: "2026-03-10" },
  { id: "l8", name: "FitZone Spor", company: "Lara, Antalya", source: "LINKEDIN", status: "CONTACTED", budget: "₺55-65K", sector: "Spor", phone: null, email: null, website: null, address: "Lara, Antalya", notes: null, googleMapsUrl: null, hasWebsite: false, mobileScore: null, sslValid: false, waTemplate: null, waTemplateSector: null, waTemplateSlug: null, waSentAt: null, updatedAt: "2026-03-25" },
];

async function getLeads() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { updatedAt: "desc" },
    });
    if (leads.length > 0) {
      return leads.map((l) => ({
        id: l.id,
        name: l.name,
        company: l.company || l.address || "",
        source: l.source,
        status: l.status,
        budget: l.budget || "—",
        sector: l.sector || "",
        phone: l.phone,
        email: l.email,
        website: l.website,
        address: l.address,
        notes: l.notes,
        googleMapsUrl: l.googleMapsUrl,
        hasWebsite: l.hasWebsite,
        mobileScore: l.mobileScore,
        sslValid: l.sslValid,
        waTemplate: l.waTemplate,
        waTemplateSector: l.waTemplateSector,
        waTemplateSlug: l.waTemplateSlug,
        waSentAt: l.waSentAt?.toISOString() || null,
        updatedAt: l.updatedAt.toISOString(),
      }));
    }
  } catch { /* fallback */ }
  return seedLeads;
}

export default async function LeadsPage() {
  const leads = await getLeads();
  return <KanbanBoard leads={leads} />;
}
