"use server";

import { prisma } from "@/lib/prisma";

export async function getProjects(status?: string) {
  const where =
    status && status !== "ALL"
      ? { status: status as "DISCOVERY" | "DESIGN" | "DEVELOPMENT" | "TESTING" | "DELIVERED" | "ARCHIVED" }
      : undefined;

  return prisma.project.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: {
      client: { select: { name: true, company: true } },
      milestones: { orderBy: { dueDate: "asc" } },
    },
  });
}

export async function createProject(data: {
  title: string;
  clientId: string;
  type: "WEBSITE" | "ECOMMERCE" | "MOBILE_APP" | "REDESIGN" | "CUSTOM";
  budget: number;
  techStack: string[];
  deadline?: Date;
  notes?: string;
}) {
  return prisma.project.create({ data });
}

export async function updateProject(
  id: string,
  data: {
    title?: string;
    status?: "DISCOVERY" | "DESIGN" | "DEVELOPMENT" | "TESTING" | "DELIVERED" | "ARCHIVED";
    progress?: number;
    notes?: string;
    deadline?: Date;
  }
) {
  return prisma.project.update({ where: { id }, data });
}
