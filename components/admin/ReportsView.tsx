"use client";

import RevenueLineChart from "./charts/RevenueLineChart";
import PipelineBarChart from "./charts/PipelineBarChart";
import DoughnutChart from "./charts/DoughnutChart";
import LeadTrendChart from "./charts/LeadTrendChart";

type ReportData = {
  thisMonthRevenue: number;
  lastMonthRevenue: number;
  revenueChange: number;
  yearlyRevenue: number;
  yearlyProjection: number;
  pendingTotal: number;
  maintenanceMonthly: number;
  maintenanceCount: number;
  monthlyRevenue: { month: string; gelir: number; bakim: number }[];
  totalProjects: number;
  activeProjectCount: number;
  deliveredCount: number;
  avgProgress: number;
  projectTypeDistribution: { label: string; count: number }[];
  projectStatusDistribution: { label: string; count: number }[];
  totalLeads: number;
  wonLeads: number;
  lostLeads: number;
  conversionRate: number;
  leadSourceDistribution: { label: string; count: number }[];
  pipelineFunnel: { label: string; count: number }[];
  monthlyLeads: { month: string; count: number }[];
  totalProposals: number;
  acceptedProposals: number;
  proposalConversion: number;
  totalProposalValue: number;
  totalSubmissions: number;
  hotSubmissions: number;
  warmSubmissions: number;
  avgCompletedSteps: number;
  totalClients: number;
  activeClients: number;
  portalUserCount: number;
};

function fmt(n: number) {
  return `₺${n.toLocaleString("tr-TR")}`;
}

function MetricCard({
  label,
  value,
  sub,
  color = "accent",
  icon,
}: {
  label: string;
  value: string;
  sub?: React.ReactNode;
  color?: string;
  icon?: React.ReactNode;
}) {
  const colorMap: Record<string, { bg: string; text: string; glow: string }> = {
    accent: { bg: "bg-admin-accent/12", text: "text-admin-accent", glow: "shadow-admin-accent/10" },
    green: { bg: "bg-admin-green/12", text: "text-admin-green", glow: "shadow-admin-green/10" },
    blue: { bg: "bg-admin-blue/12", text: "text-admin-blue", glow: "shadow-admin-blue/10" },
    amber: { bg: "bg-admin-amber/12", text: "text-admin-amber", glow: "shadow-admin-amber/10" },
    red: { bg: "bg-admin-red/12", text: "text-admin-red", glow: "shadow-admin-red/10" },
    purple: { bg: "bg-admin-purple/12", text: "text-admin-purple", glow: "shadow-admin-purple/10" },
  };
  const c = colorMap[color] || colorMap.accent;

  return (
    <div className={`rounded-xl border border-admin-border bg-admin-bg2 p-4 shadow-lg ${c.glow}`}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-admin-muted uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${c.bg}`}>
            {icon}
          </div>
        )}
      </div>
      <div className={`mt-2 text-2xl font-bold ${c.text}`} style={{ fontFamily: "var(--font-geist-mono)" }}>
        {value}
      </div>
      {sub && <p className="mt-1 text-[11px] text-admin-muted">{sub}</p>}
    </div>
  );
}

function ChartCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-admin-border bg-admin-bg2 ${className}`}>
      <div className="border-b border-admin-border px-5 py-3.5">
        <h3 className="text-[13px] font-semibold text-admin-text">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function ReportsView({ data }: { data: ReportData | null }) {
  if (!data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">📊</div>
          <h2 className="text-lg font-semibold text-admin-text">Rapor verisi yüklenemedi</h2>
          <p className="mt-1 text-sm text-admin-muted">Veritabanı bağlantısını kontrol edin</p>
        </div>
      </div>
    );
  }

  const changeIcon = data.revenueChange >= 0 ? "↑" : "↓";
  const changeColor = data.revenueChange >= 0 ? "text-admin-green" : "text-admin-red";

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-admin-text">Raporlar & Analitik</h1>
          <p className="mt-0.5 text-[13px] text-admin-muted">
            İş performansı ve dönüşüm metrikleri
          </p>
        </div>
      </div>

      {/* ════════════════════════════════════════ */}
      {/* GELİR METRİKLERİ */}
      {/* ════════════════════════════════════════ */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard
          label="Bu Ay Gelir"
          value={fmt(data.thisMonthRevenue)}
          sub={
            <span>
              <span className={changeColor}>{changeIcon}{Math.abs(data.revenueChange)}%</span>
              {" "}geçen aya göre
            </span>
          }
          color="green"
          icon={
            <svg className="h-3.5 w-3.5 text-admin-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
          }
        />
        <MetricCard
          label="Yıllık Gelir"
          value={fmt(data.yearlyRevenue)}
          sub={`Projeksiyon: ${fmt(data.yearlyProjection)}`}
          color="blue"
          icon={
            <svg className="h-3.5 w-3.5 text-admin-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          }
        />
        <MetricCard
          label="Aylık Bakım"
          value={fmt(data.maintenanceMonthly)}
          sub={`${data.maintenanceCount} aktif müşteri`}
          color="accent"
          icon={
            <svg className="h-3.5 w-3.5 text-admin-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <MetricCard
          label="Bekleyen Ödeme"
          value={fmt(data.pendingTotal)}
          sub={data.pendingTotal > 0 ? "Takip gerekiyor" : "Bekleyen yok"}
          color={data.pendingTotal > 0 ? "red" : "green"}
          icon={
            <svg className="h-3.5 w-3.5 text-admin-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Gelir Grafiği */}
      <ChartCard title="Son 12 Ay Gelir Trendi">
        <RevenueLineChart data={data.monthlyRevenue} />
      </ChartCard>

      {/* ════════════════════════════════════════ */}
      {/* PROJE & DÖNÜŞÜM */}
      {/* ════════════════════════════════════════ */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard
          label="Toplam Proje"
          value={String(data.totalProjects)}
          sub={`${data.activeProjectCount} aktif, ${data.deliveredCount} teslim`}
          color="blue"
        />
        <MetricCard
          label="Ort. İlerleme"
          value={`%${data.avgProgress}`}
          sub="Aktif projelerin ortalaması"
          color="accent"
        />
        <MetricCard
          label="Dönüşüm Oranı"
          value={`%${data.conversionRate}`}
          sub={`${data.wonLeads} kazanılan / ${data.totalLeads} lead`}
          color={data.conversionRate >= 20 ? "green" : "amber"}
        />
        <MetricCard
          label="Teklif Dönüşüm"
          value={`%${data.proposalConversion}`}
          sub={`${data.acceptedProposals}/${data.totalProposals} kabul, ${fmt(data.totalProposalValue)}`}
          color="purple"
        />
      </div>

      {/* Grafikler Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Proje Tür Dağılımı */}
        <ChartCard title="Proje Tür Dağılımı">
          {data.projectTypeDistribution.length > 0 ? (
            <DoughnutChart
              data={data.projectTypeDistribution}
              colors={["#f97316", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7"]}
              centerLabel="Toplam"
              centerValue={String(data.totalProjects)}
            />
          ) : (
            <div className="flex h-[260px] items-center justify-center text-admin-muted text-sm">
              Henüz proje yok
            </div>
          )}
        </ChartCard>

        {/* Proje Durum Dağılımı */}
        <ChartCard title="Proje Durum Dağılımı">
          {data.projectStatusDistribution.length > 0 ? (
            <DoughnutChart
              data={data.projectStatusDistribution}
              colors={["#f59e0b", "#3b82f6", "#f97316", "#a855f7", "#22c55e", "#55555f"]}
              centerLabel="Aktif"
              centerValue={String(data.activeProjectCount)}
            />
          ) : (
            <div className="flex h-[260px] items-center justify-center text-admin-muted text-sm">
              Henüz proje yok
            </div>
          )}
        </ChartCard>
      </div>

      {/* ════════════════════════════════════════ */}
      {/* PİPELİNE ANALİZİ */}
      {/* ════════════════════════════════════════ */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Pipeline Hunisi */}
        <ChartCard title="Lead Pipeline Hunisi">
          {data.pipelineFunnel.some((f) => f.count > 0) ? (
            <PipelineBarChart data={data.pipelineFunnel} />
          ) : (
            <div className="flex h-[200px] items-center justify-center text-admin-muted text-sm">
              Henüz lead yok
            </div>
          )}
        </ChartCard>

        {/* Lead Kaynak Dağılımı */}
        <ChartCard title="Lead Kaynak Dağılımı">
          {data.leadSourceDistribution.length > 0 ? (
            <DoughnutChart
              data={data.leadSourceDistribution}
              colors={["#f97316", "#3b82f6", "#a855f7", "#22c55e", "#f59e0b"]}
              centerLabel="Toplam Lead"
              centerValue={String(data.totalLeads)}
            />
          ) : (
            <div className="flex h-[260px] items-center justify-center text-admin-muted text-sm">
              Henüz lead yok
            </div>
          )}
        </ChartCard>
      </div>

      {/* Aylık Lead Trendi */}
      <ChartCard title="Aylık Yeni Lead Trendi (Son 6 Ay)">
        <LeadTrendChart data={data.monthlyLeads} />
      </ChartCard>

      {/* ════════════════════════════════════════ */}
      {/* CHATBOT & PORTAL */}
      {/* ════════════════════════════════════════ */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard
          label="Chatbot Başvuru"
          value={String(data.totalSubmissions)}
          sub={`${data.hotSubmissions} sıcak, ${data.warmSubmissions} ılık`}
          color="accent"
        />
        <MetricCard
          label="Ort. Tamamlanan Adım"
          value={`${data.avgCompletedSteps}/12`}
          sub="Chatbot form doldurma"
          color="blue"
        />
        <MetricCard
          label="Toplam Müşteri"
          value={String(data.totalClients)}
          sub={`${data.activeClients} aktif`}
          color="green"
        />
        <MetricCard
          label="Portal Kullanıcı"
          value={String(data.portalUserCount)}
          sub="Aktif portal hesapları"
          color="purple"
        />
      </div>
    </div>
  );
}
