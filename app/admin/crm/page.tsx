import { prisma } from "@/lib/prisma";
import { seedClients } from "@/lib/seed-data";
import CrmClientList from "./client-list";

async function getClients() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        maintenance: { select: { monthlyFee: true, isActive: true } },
      },
    });
    if (clients.length > 0)
      return clients.map((c) => ({
        id: c.id,
        name: c.name,
        company: c.company,
        email: c.email,
        phone: c.phone,
        sector: c.sector,
        status: c.status,
        totalRevenue: c.totalRevenue,
        updatedAt: c.updatedAt.toISOString(),
        maintenanceFee: c.maintenance
          .filter((m) => m.isActive)
          .reduce((sum, m) => sum + m.monthlyFee, 0),
      }));
  } catch {
    /* fallback */
  }
  return seedClients.map((c) => ({
    id: c.id,
    name: c.name,
    company: c.company,
    email: c.email,
    phone: c.phone,
    sector: c.sector,
    status: c.status,
    totalRevenue: c.totalRevenue,
    updatedAt: c.updatedAt.toISOString(),
    maintenanceFee: c.status === "MAINTENANCE" ? 2000 : 0,
  }));
}

export default async function CrmPage() {
  const clients = await getClients();
  return <CrmClientList clients={clients} />;
}
