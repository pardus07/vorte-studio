"use server";

import { prisma } from "@/lib/prisma";

export async function getPortfolioItems() {
  return prisma.portfolioItem.findMany({
    orderBy: { order: "asc" },
  });
}

export async function createPortfolioItem(data: {
  title: string;
  slug: string;
  description?: string;
  liveUrl?: string;
  category?: string;
  techStack: string[];
  featured?: boolean;
  isPublished?: boolean;
}) {
  const maxOrder = await prisma.portfolioItem.findFirst({
    orderBy: { order: "desc" },
    select: { order: true },
  });
  return prisma.portfolioItem.create({
    data: { ...data, order: (maxOrder?.order ?? 0) + 1 },
  });
}

export async function updatePortfolioItem(
  id: string,
  data: {
    title?: string;
    slug?: string;
    description?: string;
    liveUrl?: string;
    category?: string;
    techStack?: string[];
    featured?: boolean;
    isPublished?: boolean;
    order?: number;
  }
) {
  return prisma.portfolioItem.update({ where: { id }, data });
}

export async function deletePortfolioItem(id: string) {
  return prisma.portfolioItem.delete({ where: { id } });
}
