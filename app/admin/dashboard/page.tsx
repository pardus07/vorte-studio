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

  const now = new Date();
  const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const dueThisWeek = seedProjects.filter(
    (p) => p.deadline <= weekLater && p.deadline >= now
  ).length;

  const hour = now.getHours();
  const greeting = hour < 12 ? "Günaydın" : hour < 18 ? "İyi günler" : "İyi akşamlar";

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-admin-border bg-gradient-to-br from-admin-bg2 via-admin-bg2 to-admin-accent/5 p-6">
        <div className="relative z-10">
          <h2 className="text-xl font-bold text-admin-text">
            {greeting}, İbrahim
          </h2>
          <p className="mt-1 text-[13px] text-admin-muted">
            {stats.projectCount} aktif proje, {stats.pendingQuotes} bekleyen teklif ve {seedAlerts.length} uyarı var.
          </p>
        </div>
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-admin-accent/5 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-8 right-20 h-24 w-24 rounded-full bg-admin-accent/8 blur-xl" />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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
          color="blue"
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
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Alerts */}
        <div className="overflow-hidden rounded-2xl border border-admin-border bg-admin-bg2">
          <div className="flex items-center justify-between border-b border-admin-border px-5 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-admin-red/12">
                <svg className="h-3.5 w-3.5 text-admin-red" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 1L1 14h14L8 1zM8 6v3M8 11.5v.5" />
                </svg>
              </div>
              <span className="text-[13px] font-semibold text-admin-text">
                Bugün yapılacaklar
              </span>
            </div>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-admin-red/15 px-2 text-[10px] font-bold text-admin-red">
              {seedAlerts.length}
            </span>
          </div>
          <AlertList alerts={seedAlerts} />
        </div>

        {/* Active Projects */}
        <div className="overflow-hidden rounded-2xl border border-admin-border bg-admin-bg2">
          <div className="flex items-center justify-between border-b border-admin-border px-5 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-admin-blue/12">
                <svg className="h-3.5 w-3.5 text-admin-blue" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="12" height="10" rx="1.5" />
                  <path d="M5 7h6M5 10h4" />
                </svg>
              </div>
              <span className="text-[13px] font-semibold text-admin-text">
                Aktif projeler
              </span>
            </div>
            <a href="/admin/projects" className="text-[11px] font-medium text-admin-accent transition-colors hover:text-admin-accent/80">
              Tümünü gör
            </a>
          </div>
          <div className="divide-y divide-admin-border">
            {projects.map((p) => {
              const progressColor =
                p.progress >= 80 ? "var(--color-admin-green)" :
                p.progress >= 50 ? "var(--color-admin-blue)" :
                "var(--color-admin-amber)";
              const badgeColor =
                p.progress >= 80 ? "bg-admin-green/12 text-admin-green" :
                p.progress >= 50 ? "bg-admin-blue/12 text-admin-blue" :
                "bg-admin-amber/12 text-admin-amber";
              const statusTr =
                p.status === "DESIGN" ? "Tasarım" :
                p.status === "DEVELOPMENT" ? "Geliştirme" :
                p.status === "TESTING" ? "Test" : "Keşif";
              return (
                <div key={p.id} className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-admin-bg3/50">
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium text-admin-text">
                      {p.title.length > 30 ? p.title.slice(0, 30) + "..." : p.title}
                    </div>
                    <div className="mt-0.5 text-[11px] text-admin-muted">
                      {p.clientName} · {statusTr}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex rounded-lg px-2.5 py-1 text-[10px] font-semibold ${badgeColor}`}>
                      %{p.progress}
                    </span>
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-admin-bg4">
                      <div
                        className="h-full rounded-full transition-all duration-500"
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
      <div className="overflow-hidden rounded-2xl border border-admin-border bg-admin-bg2">
        <div className="flex items-center justify-between border-b border-admin-border px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-admin-accent/12">
              <svg className="h-3.5 w-3.5 text-admin-accent" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 1l2 4 4.5.65-3.25 3.15.75 4.45L8 11.2l-4 2.05.75-4.45L1.5 5.65 6 5 8 1z" />
              </svg>
            </div>
            <span className="text-[13px] font-semibold text-admin-text">
              Son gelen lead&apos;ler
            </span>
          </div>
          <a href="/admin/leads" className="text-[11px] font-medium text-admin-accent transition-colors hover:text-admin-accent/80">
            Pipeline
          </a>
        </div>
        <LeadTable leads={leads} />
      </div>
    </div>
  );
}
