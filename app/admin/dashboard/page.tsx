import { prisma } from "@/lib/prisma";
import StatCard from "@/components/admin/StatCard";

export const dynamic = "force-dynamic";

import {
  seedAlerts,
  seedProjects,
  seedLeads,
} from "@/lib/seed-data";

async function getStats() {
  try {
    const [projectCount, pendingQuotes] = await Promise.all([
      prisma.project.count({ where: { status: { in: ["DISCOVERY", "DESIGN", "DEVELOPMENT", "TESTING"] } } }),
      prisma.quote.count({ where: { status: "SENT" } }),
    ]);
    return { projectCount, pendingQuotes, revenue: 34500, maintenanceRevenue: 7200 };
  } catch {
    return { projectCount: 3, pendingQuotes: 3, revenue: 34500, maintenanceRevenue: 7200 };
  }
}

async function getActiveProjects() {
  try {
    const projects = await prisma.project.findMany({
      where: { status: { in: ["DISCOVERY", "DESIGN", "DEVELOPMENT", "TESTING"] } },
      include: { client: true },
      orderBy: { updatedAt: "desc" },
      take: 5,
    });
    if (projects.length > 0) return projects.map((p) => ({
      id: p.id,
      title: p.title,
      clientName: p.client.name,
      type: p.type,
      status: p.status,
      progress: p.progress,
    }));
  } catch { /* fallback */ }
  return seedProjects.map((p) => ({
    id: p.id,
    title: p.title,
    clientName: p.clientName,
    type: p.type,
    status: p.status,
    progress: p.progress,
  }));
}

type DashboardLead = {
  id: string;
  name: string;
  source: string;
  status: string;
  address?: string;
  sector?: string | null;
  budget?: string | null;
  type?: string;
};

async function getRecentLeads(): Promise<DashboardLead[]> {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });
    if (leads.length > 0)
      return leads.map((l) => ({
        id: l.id,
        name: l.name,
        source: l.source,
        status: l.status,
        sector: l.sector,
        budget: l.budget,
        address: l.address ?? undefined,
      }));
  } catch { /* fallback */ }
  return seedLeads.map((l) => ({
    id: l.id,
    name: l.name,
    source: l.source,
    status: l.status,
    address: l.address,
    budget: l.budget,
    type: l.type,
  }));
}

const statusColors: Record<string, string> = {
  COLD: "bg-admin-green-dim text-admin-green",
  CONTACTED: "bg-admin-blue-dim text-admin-blue",
  MEETING: "bg-admin-amber-dim text-admin-amber",
  QUOTED: "bg-admin-blue-dim text-admin-blue",
  WON: "bg-admin-green-dim text-admin-green",
  LOST: "bg-admin-red-dim text-admin-red",
};

const sourceLabels: Record<string, { label: string; color: string }> = {
  MAPS_SCRAPER: { label: "Maps Scraper", color: "bg-admin-accent-dim text-admin-accent" },
  SITE_FORM: { label: "Site formu", color: "bg-admin-blue-dim text-admin-blue" },
  LINKEDIN: { label: "LinkedIn", color: "bg-admin-purple-dim text-admin-purple" },
  REFERRAL: { label: "Referans", color: "bg-admin-green-dim text-admin-green" },
  MANUAL: { label: "Manuel", color: "bg-admin-amber-dim text-admin-amber" },
};

const statusLabels: Record<string, string> = {
  COLD: "Yeni",
  CONTACTED: "İletişim",
  MEETING: "Görüşme",
  QUOTED: "Teklif gönderildi",
  WON: "Kazanıldı",
  LOST: "Kaybedildi",
};

const dotColors: Record<string, string> = {
  red: "bg-admin-red",
  amber: "bg-admin-amber",
  green: "bg-admin-green",
  blue: "bg-admin-blue",
};

export default async function DashboardPage() {
  const [stats, projects, leads] = await Promise.all([
    getStats(),
    getActiveProjects(),
    getRecentLeads(),
  ]);

  return (
    <div className="space-y-5">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Bu ay gelir"
          value={`₺${stats.revenue.toLocaleString("tr-TR")}`}
          sub="+12% geçen aya göre"
          color="green"
          trend="up"
        />
        <StatCard
          label="Aktif proje"
          value={String(stats.projectCount)}
          sub="1 bu hafta teslim"
        />
        <StatCard
          label="Bakım geliri"
          value={`₺${stats.maintenanceRevenue.toLocaleString("tr-TR")}`}
          sub="4 aktif müşteri"
          color="accent"
        />
        <StatCard
          label="Bekleyen teklif"
          value={String(stats.pendingQuotes)}
          sub="2 takip gerekiyor"
          color="amber"
          trend="warn"
        />
      </div>

      {/* Grid: Alerts + Active Projects */}
      <div className="grid gap-3 lg:grid-cols-2">
        {/* Alerts */}
        <div className="rounded-xl border border-admin-border bg-admin-bg2">
          <div className="flex items-center justify-between border-b border-admin-border px-4 py-3">
            <span className="text-[13px] font-medium">⚡ Bugün yapılacaklar</span>
            <span className="rounded-full bg-admin-red-dim px-2 py-0.5 text-[10px] font-medium text-admin-red">
              {seedAlerts.length} uyarı
            </span>
          </div>
          <div className="divide-y divide-admin-border">
            {seedAlerts.map((alert, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3">
                <div
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dotColors[alert.dot]}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[12.5px] font-medium">{alert.title}</div>
                  <div className="text-[11px] text-admin-muted">{alert.meta}</div>
                </div>
                <button
                  className={`shrink-0 rounded px-2.5 py-1 text-[10px] font-medium ${
                    alert.actionType === "primary"
                      ? "bg-admin-accent text-white"
                      : "border border-admin-border text-admin-muted hover:text-admin-text"
                  }`}
                >
                  {alert.action}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Active Projects */}
        <div className="rounded-xl border border-admin-border bg-admin-bg2">
          <div className="flex items-center justify-between border-b border-admin-border px-4 py-3">
            <span className="text-[13px] font-medium">🚀 Aktif projeler</span>
            <a href="/admin/projects" className="text-[11px] text-admin-muted hover:text-admin-text">
              Tümü →
            </a>
          </div>
          <div className="divide-y divide-admin-border">
            {projects.map((p) => {
              const progressColor =
                p.progress >= 80 ? "var(--color-admin-green)" :
                p.progress >= 50 ? "var(--color-admin-blue)" :
                "var(--color-admin-amber)";
              const badgeColor =
                p.progress >= 80 ? "bg-admin-green-dim text-admin-green" :
                p.progress >= 50 ? "bg-admin-blue-dim text-admin-blue" :
                "bg-admin-amber-dim text-admin-amber";
              return (
                <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-[12.5px] font-medium">{p.title.length > 25 ? p.title.slice(0, 25) + "..." : p.title}</div>
                    <div className="text-[11px] text-admin-muted">
                      {p.clientName} · {p.status === "DESIGN" ? "Tasarım" : p.status === "DEVELOPMENT" ? "Geliştirme" : p.status === "TESTING" ? "Test" : "Keşif"}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${badgeColor}`}>
                      %{p.progress}
                    </span>
                    <div className="mt-1 h-1 w-20 overflow-hidden rounded-full bg-admin-bg4">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${p.progress}%`, background: progressColor }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="rounded-xl border border-admin-border bg-admin-bg2">
        <div className="flex items-center justify-between border-b border-admin-border px-4 py-3">
          <span className="text-[13px] font-medium">🎯 Son gelen lead&apos;ler</span>
          <a href="/admin/leads" className="text-[11px] text-admin-muted hover:text-admin-text">
            Pipeline →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="border-b border-admin-border text-left text-[11px] font-medium text-admin-muted">
                <th className="px-4 py-2.5">İşletme</th>
                <th className="px-4 py-2.5">Kaynak</th>
                <th className="px-4 py-2.5">Tür</th>
                <th className="px-4 py-2.5">Bütçe</th>
                <th className="px-4 py-2.5">Durum</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {leads.map((lead) => {
                const src = sourceLabels[lead.source] || sourceLabels.MANUAL;
                const st = statusLabels[lead.status] || lead.status;
                const stColor = statusColors[lead.status] || statusColors.COLD;
                return (
                  <tr key={lead.id} className="hover:bg-admin-bg3">
                    <td className="px-4 py-2.5">
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-[11px] text-admin-muted">
                        {lead.address || lead.sector || ""}
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${src.color}`}>
                        {src.label}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-admin-muted">
                      {lead.type || "Web sitesi"}
                    </td>
                    <td className="px-4 py-2.5">
                      {lead.budget || "—"}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${stColor}`}>
                        {st}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <button className="rounded bg-admin-accent px-2.5 py-1 text-[10px] font-medium text-white">
                        WA Gönder
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
