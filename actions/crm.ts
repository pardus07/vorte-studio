"use server";

import { prisma } from "@/lib/prisma";

export async function getClients(filter?: string) {
  const where =
    filter && filter !== "ALL"
      ? { status: filter as "POTENTIAL" | "ACTIVE" | "MAINTENANCE" | "INACTIVE" }
      : undefined;

  return prisma.client.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: {
      projects: { select: { id: true, status: true } },
      maintenance: { select: { id: true, monthlyFee: true, isActive: true } },
    },
  });
}

export async function getClientById(id: string) {
  return prisma.client.findUnique({
    where: { id },
    include: {
      projects: true,
      quotes: true,
      maintenance: true,
      activities: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });
}

export async function createClient(data: {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  sector?: string;
  notes?: string;
}) {
  return prisma.client.create({ data });
}

export async function updateClient(
  id: string,
  data: {
    name?: string;
    company?: string;
    email?: string;
    phone?: string;
    sector?: string;
    status?: "POTENTIAL" | "ACTIVE" | "MAINTENANCE" | "INACTIVE";
    notes?: string;
  }
) {
  return prisma.client.update({ where: { id }, data });
}
