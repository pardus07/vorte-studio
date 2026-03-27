"use server";

import { prisma } from "@/lib/prisma";

export async function createQuote(data: {
  clientId: string;
  packageType: string;
  basePrice: number;
  addons: { name: string; price: number }[];
  total: number;
}) {
  return prisma.quote.create({
    data: {
      clientId: data.clientId,
      packageType: data.packageType,
      basePrice: data.basePrice,
      addons: data.addons,
      total: data.total,
      status: "DRAFT",
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });
}

export async function getQuotes() {
  return prisma.quote.findMany({
    orderBy: { createdAt: "desc" },
    include: { client: { select: { name: true, company: true } } },
    take: 10,
  });
}

export async function updateQuoteStatus(
  id: string,
  status: "DRAFT" | "SENT" | "VIEWED" | "ACCEPTED" | "REJECTED"
) {
  return prisma.quote.update({
    where: { id },
    data: {
      status,
      sentAt: status === "SENT" ? new Date() : undefined,
    },
  });
}
