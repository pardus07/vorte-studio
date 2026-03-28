import { prisma } from "@/lib/prisma";
import StatCard from "@/components/admin/StatCard";
import { AlertList, LeadTable } from "./dashboard-actions";

export const dynamic = "force-dynamic";

import {
  seedAlerts,
  seedProjects,
  seedLeads,
} from "@/lib/seed-data";

async function getStats() {
  try {
    const [projectCount, pendingQuotes, maintenanceCount, paidTotal] = await Promise.all([
      prisma.project.count({ where: { status: { in: ["DISCOVERY", "DESIGN", "DEVELOPMENT", "TESTING"] } } }),
      prisma.quote.count({ where: { status: "SENT" } }),
      prisma.maintenance.count({ where: { isActive: true } }),
      prisma.payment.aggregate({ where: { status: "PAID" }, _sum: { amount: true } }),
    ]);

    if (projectCount > 0 || pendingQuotes > 0) {
      return {
        projectCount,
        pendingQuotes,
        revenue: paidTotal._sum.amount ?? 0,
        maintenanceRevenue: maintenanceCount * 2000,
        maintenanceCount,
      };
    }
  } catch { /* DB hatası — seed data kullan */ }

  // Seed data'dan hesapla
  return {
    projectCount: seedProjects.length,
    pendingQuotes: 3,
    revenue: 34500,
    maintenanceRevenue: 7200,
    maintenanceCount: 4,
  };
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
  phone?: string;
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
        phone: l.phone ?? undefined,
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

export default async function DashboardPage() {
  const [stats, projects, leads] = await Promise.all([
    getStats(),
    getActiveProjects(),
    getRecentLeads(),
  ]);

  // Deadline bu hafta olan proje sayısı
  const now = new Date();
  const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const dueThisWeek = seedProjects.filter(
    (p) => p.deadline <= weekLater && p.deadline >= now
  ).length;

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
          sub={dueThisWeek > 0 ? `${dueThisWeek} bu hafta teslim` : "Devam eden projeler"}
        />
        <StatCard
          label="Bakım geliri"
          value={`₺${stats.maintenanceRevenue.toLocaleString("tr-TR")}`}
          sub={`${stats.maintenanceCount} aktif müşteri`}
          color="accent"
        />
        <StatCard
          label="Bekleyen teklif"
          value={String(stats.pendingQuotes)}
          sub={stats.pendingQuotes > 0 ? `${Math.min(stats.pendingQuotes, 2)} takip gerekiyor` : "Bekleyen yok"}
          color="amber"
          trend={stats.pendingQuotes > 0 ? "warn" : undefined}
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
          <AlertList alerts={seedAlerts} />
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
        <LeadTable leads={leads} />
      </div>
    </div>
  );
}
