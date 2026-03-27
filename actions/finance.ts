"use server";

import { prisma } from "@/lib/prisma";

export async function getPayments(status?: string) {
  const where =
    status && status !== "ALL"
      ? { status: status as "PENDING" | "PAID" | "OVERDUE" | "CANCELLED" }
      : undefined;

  return prisma.payment.findMany({
    where,
    orderBy: { dueDate: "asc" },
    include: {
      project: { select: { title: true, client: { select: { name: true } } } },
    },
  });
}

export async function updatePaymentStatus(
  id: string,
  status: "PENDING" | "PAID" | "OVERDUE" | "CANCELLED"
) {
  return prisma.payment.update({
    where: { id },
    data: {
      status,
      paidAt: status === "PAID" ? new Date() : null,
    },
  });
}

export async function getMaintenanceRevenue() {
  return prisma.maintenance.findMany({
    where: { isActive: true },
    include: { client: { select: { name: true, company: true } } },
    orderBy: { renewalDate: "asc" },
  });
}
