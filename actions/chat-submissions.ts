"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getChatSubmissions() {
  try {
    const submissions = await prisma.chatSubmission.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        lead: {
          select: { id: true, name: true, phone: true, status: true },
        },
      },
    });
    return submissions.map((s) => ({
      id: s.id,
      slug: s.slug,
      firmName: s.firmName,
      contactName: s.contactName,
      contactPhone: s.contactPhone,
      contactEmail: s.contactEmail,
      siteType: s.siteType,
      features: s.features as string[],
      pageCount: s.pageCount,
      contentStatus: s.contentStatus,
      hostingStatus: s.hostingStatus,
      hostingProvider: s.hostingProvider,
      domainStatus: s.domainStatus,
      domainName: s.domainName,
      timeline: s.timeline,
      message: s.message,
      sector: s.sector,
      city: s.city,
      completedSteps: s.completedSteps,
      score: s.score,
      calculatedPrice: s.calculatedPrice,
      estimatedHours: s.estimatedHours,
      tokenCost: s.tokenCost,
      freeQuestions: s.freeQuestions as Array<{
        question: string;
        answer: string;
        step: number;
        timestamp: string;
      }>,
      isRead: s.isRead,
      createdAt: s.createdAt.toISOString(),
      lead: s.lead,
    }));
  } catch {
    return [];
  }
}

export async function markSubmissionRead(id: string) {
  try {
    await prisma.chatSubmission.update({
      where: { id },
      data: { isRead: true },
    });
    revalidatePath("/admin/chat-submissions");
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function markAllSubmissionsRead() {
  try {
    await prisma.chatSubmission.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });
    revalidatePath("/admin/chat-submissions");
    return { success: true };
  } catch {
    return { success: false };
  }
}
