import { seedPayments } from "@/lib/seed-data";
import { getFinanceData } from "@/actions/finance";
import FinanceView from "./finance-view";

export const dynamic = "force-dynamic";

const seedMonthly = [
  { month: "Eki", value: 18000 }, { month: "Kas", value: 24500 },
  { month: "Ara", value: 31000 }, { month: "Oca", value: 22000 },
  { month: "Şub", value: 28000 }, { month: "Mar", value: 34500 },
];

const seedMaintenances = [
  { id: "sm1", clientName: "Anatolian Spa Hotel", fee: 2000, renewalDate: "2026-04-15" },
  { id: "sm2", clientName: "restocafe.com", fee: 1800, renewalDate: "2026-04-01" },
  { id: "sm3", clientName: "DisSağlık Dental", fee: 1500, renewalDate: "2026-05-10" },
  { id: "sm4", clientName: "Sarıgül Otomotiv", fee: 1900, renewalDate: "2026-06-01" },
];

export default async function FinancePage() {
  const data = await getFinanceData();

  if (data) {
    return (
      <FinanceView
        stats={data.stats}
        payments={data.payments}
        maintenances={data.maintenances}
        monthlyRevenue={data.monthlyRevenue}
        projects={data.projects}
      />
    );
  }

  // Seed fallback
  const totalPending = seedPayments
    .filter((p) => p.status === "PENDING" || p.status === "OVERDUE")
    .reduce((s, p) => s + p.amount, 0);

  return (
    <FinanceView
      stats={{
        thisMonthRevenue: 34500,
        pendingTotal: totalPending,
        overdueCount: seedPayments.filter((p) => p.status === "OVERDUE").length,
        yearlyProjection: 380000,
        maintenanceTotal: 7200,
        maintenanceCount: 4,
      }}
      payments={seedPayments.map((p) => ({
        ...p,
        projectId: "seed",
        projectTitle: p.projectTitle,
        dueDate: p.dueDate instanceof Date ? p.dueDate.toISOString() : String(p.dueDate),
        paidAt: null,
      }))}
      maintenances={seedMaintenances}
      monthlyRevenue={seedMonthly}
      projects={[{ id: "seed", title: "Demo Proje" }]}
    />
  );
}
