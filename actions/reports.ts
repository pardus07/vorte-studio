"use server";

import { prisma } from "@/lib/prisma";

const MONTH_NAMES = [
  "Oca", "Şub", "Mar", "Nis", "May", "Haz",
  "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara",
];

export async function getReportData() {
  try {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    // ── Paralel veri çekme ──
    const [
      payments,
      projects,
      leads,
      proposals,
      chatSubmissions,
      maintenances,
      clients,
      portalUsers,
    ] = await Promise.all([
      prisma.payment.findMany({
        include: { project: { select: { title: true, type: true } } },
      }),
      prisma.project.findMany({
        include: { client: { select: { name: true } } },
      }),
      prisma.lead.findMany(),
      prisma.proposal.findMany(),
      prisma.chatSubmission.findMany(),
      prisma.maintenance.findMany({ where: { isActive: true } }),
      prisma.client.findMany(),
      prisma.portalUser.findMany(),
    ]);

    // ═══════════════════════════════════════════
    // 1) GELİR METRİKLERİ
    // ═══════════════════════════════════════════

    const paidPayments = payments.filter((p) => p.status === "PAID" && p.paidAt);

    // Bu ay gelir
    const thisMonthRevenue = paidPayments
      .filter((p) => p.paidAt! >= thisMonthStart)
      .reduce((s, p) => s + p.amount, 0);

    // Geçen ay gelir
    const lastMonthRevenue = paidPayments
      .filter((p) => p.paidAt! >= lastMonthStart && p.paidAt! <= lastMonthEnd)
      .reduce((s, p) => s + p.amount, 0);

    // Yıllık toplam gelir
    const yearlyRevenue = paidPayments
      .filter((p) => p.paidAt! >= yearStart)
      .reduce((s, p) => s + p.amount, 0);

    // Bekleyen ödemeler
    const pendingTotal = payments
      .filter((p) => p.status === "PENDING" || p.status === "OVERDUE")
      .reduce((s, p) => s + p.amount, 0);

    // Aylık bakım geliri
    const maintenanceMonthly = maintenances.reduce((s, m) => s + m.monthlyFee, 0);

    // Son 12 ay gelir trendi
    const monthlyRevenue: { month: string; gelir: number; bakim: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
      const revenue = paidPayments
        .filter((p) => p.paidAt! >= d && p.paidAt! <= monthEnd)
        .reduce((s, p) => s + p.amount, 0);
      monthlyRevenue.push({
        month: MONTH_NAMES[d.getMonth()],
        gelir: revenue,
        bakim: maintenanceMonthly,
      });
    }

    // Gelir değişim yüzdesi
    const revenueChange = lastMonthRevenue > 0
      ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
      : 0;

    // ═══════════════════════════════════════════
    // 2) PROJE METRİKLERİ
    // ═══════════════════════════════════════════

    const activeProjects = projects.filter((p) =>
      ["DISCOVERY", "DESIGN", "DEVELOPMENT", "TESTING"].includes(p.status)
    );
    const deliveredProjects = projects.filter((p) => p.status === "DELIVERED");
    const avgProgress = activeProjects.length > 0
      ? Math.round(activeProjects.reduce((s, p) => s + p.progress, 0) / activeProjects.length)
      : 0;

    // Proje tür dağılımı (pie chart)
    const projectTypeMap: Record<string, number> = {};
    projects.forEach((p) => {
      const label = p.type === "WEBSITE" ? "Web Sitesi"
        : p.type === "ECOMMERCE" ? "E-Ticaret"
        : p.type === "MOBILE_APP" ? "Mobil Uygulama"
        : p.type === "REDESIGN" ? "Yeniden Tasarım"
        : "Özel Proje";
      projectTypeMap[label] = (projectTypeMap[label] || 0) + 1;
    });
    const projectTypeDistribution = Object.entries(projectTypeMap).map(([label, count]) => ({
      label,
      count,
    }));

    // Proje durum dağılımı
    const projectStatusMap: Record<string, number> = {};
    projects.forEach((p) => {
      const label = p.status === "DISCOVERY" ? "Keşif"
        : p.status === "DESIGN" ? "Tasarım"
        : p.status === "DEVELOPMENT" ? "Geliştirme"
        : p.status === "TESTING" ? "Test"
        : p.status === "DELIVERED" ? "Teslim"
        : "Arşiv";
      projectStatusMap[label] = (projectStatusMap[label] || 0) + 1;
    });
    const projectStatusDistribution = Object.entries(projectStatusMap).map(([label, count]) => ({
      label,
      count,
    }));

    // ═══════════════════════════════════════════
    // 3) PİPELİNE & DÖNÜŞÜM
    // ═══════════════════════════════════════════

    const totalLeads = leads.length;
    const wonLeads = leads.filter((l) => l.status === "WON").length;
    const lostLeads = leads.filter((l) => l.status === "LOST").length;
    const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

    // Lead kaynak dağılımı
    const leadSourceMap: Record<string, number> = {};
    leads.forEach((l) => {
      const label = l.source === "MAPS_SCRAPER" ? "Maps Scraper"
        : l.source === "SITE_FORM" ? "Site Formu"
        : l.source === "LINKEDIN" ? "LinkedIn"
        : l.source === "REFERRAL" ? "Referans"
        : "Manuel";
      leadSourceMap[label] = (leadSourceMap[label] || 0) + 1;
    });
    const leadSourceDistribution = Object.entries(leadSourceMap).map(([label, count]) => ({
      label,
      count,
    }));

    // Lead durum dağılımı (funnel)
    const LEAD_FUNNEL_ORDER = [
      "COLD", "TEMPLATE_ADDED", "WA_SENT", "CONTACTED",
      "MEETING", "QUOTED", "CONTRACTED", "WON",
    ];
    const LEAD_FUNNEL_LABELS: Record<string, string> = {
      COLD: "Soğuk Lead",
      TEMPLATE_ADDED: "Şablon Eklendi",
      WA_SENT: "WA Gönderildi",
      CONTACTED: "İletişim",
      MEETING: "Görüşme",
      QUOTED: "Teklif",
      CONTRACTED: "Sözleşme",
      WON: "Kazanıldı",
    };
    const pipelineFunnel = LEAD_FUNNEL_ORDER.map((status) => ({
      label: LEAD_FUNNEL_LABELS[status] || status,
      count: leads.filter((l) => l.status === status).length,
    }));

    // Aylık lead trendi (son 6 ay)
    const monthlyLeads: { month: string; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
      const count = leads.filter((l) => l.createdAt >= d && l.createdAt <= monthEnd).length;
      monthlyLeads.push({ month: MONTH_NAMES[d.getMonth()], count });
    }

    // ═══════════════════════════════════════════
    // 4) TEKLİF METRİKLERİ
    // ═══════════════════════════════════════════

    const totalProposals = proposals.length;
    const acceptedProposals = proposals.filter((p) => p.status === "ACCEPTED").length;
    const proposalConversion = totalProposals > 0
      ? Math.round((acceptedProposals / totalProposals) * 100)
      : 0;
    const totalProposalValue = proposals
      .filter((p) => p.status === "ACCEPTED")
      .reduce((s, p) => s + p.totalPrice, 0);

    // ═══════════════════════════════════════════
    // 5) CHATBOT METRİKLERİ
    // ═══════════════════════════════════════════

    const totalSubmissions = chatSubmissions.length;
    const hotSubmissions = chatSubmissions.filter((c) => c.score === "hot").length;
    const warmSubmissions = chatSubmissions.filter((c) => c.score === "warm").length;
    const avgCompletedSteps = totalSubmissions > 0
      ? Math.round(chatSubmissions.reduce((s, c) => s + c.completedSteps, 0) / totalSubmissions)
      : 0;

    // ═══════════════════════════════════════════
    // 6) GENEL SAYAÇLAR
    // ═══════════════════════════════════════════

    const totalClients = clients.length;
    const activeClients = clients.filter((c) => c.status === "ACTIVE").length;
    const portalUserCount = portalUsers.length;

    // Yıllık projeksiyon (son 3 ay ortalama × 12)
    const last3Months = monthlyRevenue.slice(-3);
    const last3Avg = last3Months.reduce((s, m) => s + m.gelir, 0) / 3;
    const yearlyProjection = Math.round(last3Avg * 12);

    return {
      // Gelir
      thisMonthRevenue,
      lastMonthRevenue,
      revenueChange,
      yearlyRevenue,
      yearlyProjection,
      pendingTotal,
      maintenanceMonthly,
      maintenanceCount: maintenances.length,
      monthlyRevenue,

      // Projeler
      totalProjects: projects.length,
      activeProjectCount: activeProjects.length,
      deliveredCount: deliveredProjects.length,
      avgProgress,
      projectTypeDistribution,
      projectStatusDistribution,

      // Pipeline
      totalLeads,
      wonLeads,
      lostLeads,
      conversionRate,
      leadSourceDistribution,
      pipelineFunnel,
      monthlyLeads,

      // Teklifler
      totalProposals,
      acceptedProposals,
      proposalConversion,
      totalProposalValue,

      // Chatbot
      totalSubmissions,
      hotSubmissions,
      warmSubmissions,
      avgCompletedSteps,

      // Genel
      totalClients,
      activeClients,
      portalUserCount,
    };
  } catch (err) {
    console.error("Rapor veri hatası:", err);
    return null;
  }
}
