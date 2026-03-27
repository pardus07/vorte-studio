"use server";

import { prisma } from "@/lib/prisma";

export async function getMaintenancePackages() {
  return prisma.maintenance.findMany({
    where: { isActive: true },
    orderBy: { renewalDate: "asc" },
    include: { client: { select: { name: true, company: true } } },
  });
}

export async function createMaintenance(data: {
  clientId: string;
  websiteUrl: string;
  monthlyFee: number;
  startDate: Date;
  renewalDate: Date;
  domainExpiry?: Date;
  sslExpiry?: Date;
  plan?: string;
  notes?: string;
}) {
  return prisma.maintenance.create({ data });
}

export async function updateMaintenance(
  id: string,
  data: {
    monthlyFee?: number;
    renewalDate?: Date;
    domainExpiry?: Date;
    sslExpiry?: Date;
    plan?: string;
    notes?: string;
    isActive?: boolean;
  }
) {
  return prisma.maintenance.update({ where: { id }, data });
}
