import { getMaintenanceData } from "@/actions/maintenance";
import MaintenanceView from "./maintenance-view";

export const dynamic = "force-dynamic";

const seedMaintenance = [
  { id: "m1", clientId: "seed", clientName: "Anatolian Spa Hotel", websiteUrl: "anatolianspa.com", monthlyFee: 2000, renewalDate: "2026-04-15", domainExpiry: "2027-01-20", sslExpiry: "2026-07-15", plan: "premium" },
  { id: "m2", clientId: "seed", clientName: "restocafe.com", websiteUrl: "restocafe.com", monthlyFee: 1800, renewalDate: "2026-04-01", domainExpiry: "2026-12-10", sslExpiry: "2026-04-03", plan: "standard" },
  { id: "m3", clientId: "seed", clientName: "DisSağlık Dental", websiteUrl: "dissaglik.com", monthlyFee: 1500, renewalDate: "2026-05-10", domainExpiry: "2027-03-15", sslExpiry: "2026-09-20", plan: "standard" },
  { id: "m4", clientId: "seed", clientName: "Sarıgül Otomotiv", websiteUrl: "sariguloto.com", monthlyFee: 1900, renewalDate: "2026-06-01", domainExpiry: "2026-04-10", sslExpiry: "2026-08-01", plan: "premium" },
];

export default async function MaintenancePage() {
  const data = await getMaintenanceData();

  if (data && data.maintenances.length > 0) {
    return (
      <MaintenanceView
        stats={data.stats}
        maintenances={data.maintenances}
        clients={data.clients}
      />
    );
  }

  // Seed fallback
  return (
    <MaintenanceView
      stats={{ activeCount: seedMaintenance.length, totalFee: 7200, sslWarnings: 1 }}
      maintenances={seedMaintenance}
      clients={data?.clients || [{ id: "seed", name: "Demo Müşteri" }]}
    />
  );
}
