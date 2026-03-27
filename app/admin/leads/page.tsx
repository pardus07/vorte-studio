import KanbanBoard from "./kanban-board";

const seedLeads = [
  { id: "l1", name: "Güneş Diş Kliniği", company: "Muratpaşa, Antalya", source: "MAPS_SCRAPER", status: "COLD", budget: "₺12-18K", sector: "Sağlık", updatedAt: "2026-03-27" },
  { id: "l2", name: "Deniz Eczanesi", company: "Konyaaltı, Antalya", source: "MAPS_SCRAPER", status: "COLD", budget: "₺8-12K", sector: "Sağlık", updatedAt: "2026-03-26" },
  { id: "l3", name: "Koray Hukuk Bürosu", company: "Konyaaltı, Antalya", source: "SITE_FORM", status: "MEETING", budget: "₺20-25K", sector: "Hukuk", updatedAt: "2026-03-23" },
  { id: "l4", name: "Sarıgül Otomotiv", company: "Kepez, Antalya", source: "REFERRAL", status: "QUOTED", budget: "₺18K", sector: "Otomotiv", updatedAt: "2026-03-20" },
  { id: "l5", name: "Akdeniz Spor", company: "Kepez, Antalya", source: "LINKEDIN", status: "QUOTED", budget: "₺60-80K", sector: "Spor", updatedAt: "2026-03-23" },
  { id: "l6", name: "DisSağlık Dental", company: "Muratpaşa", source: "MANUAL", status: "WON", budget: "₺22K", sector: "Sağlık", updatedAt: "2026-03-15" },
  { id: "l7", name: "Otopark Plus", company: "Antalya", source: "MAPS_SCRAPER", status: "LOST", budget: "₺10K", sector: "Otopark", updatedAt: "2026-03-10" },
  { id: "l8", name: "FitZone Spor", company: "Lara, Antalya", source: "LINKEDIN", status: "CONTACTED", budget: "₺55-65K", sector: "Spor", updatedAt: "2026-03-25" },
];

export default function LeadsPage() {
  return <KanbanBoard leads={seedLeads} />;
}
