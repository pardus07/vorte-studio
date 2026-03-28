"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ProjectFormSchema = z.object({
  title: z.string().min(2, "Proje başlığı en az 2 karakter olmalı"),
  clientId: z.string().min(1, "Müşteri seçin"),
  type: z.enum(["WEBSITE", "ECOMMERCE", "MOBILE_APP", "REDESIGN", "CUSTOM"]),
  status: z.enum(["DISCOVERY", "DESIGN", "DEVELOPMENT", "TESTING", "DELIVERED", "ARCHIVED"]).optional(),
  budget: z.number().min(0, "Bütçe 0'dan büyük olmalı"),
  startDate: z.string().optional(),
  deadline: z.string().optional(),
  techStack: z.string().optional(),
  notes: z.string().optional(),
});

export type ProjectFormData = z.infer<typeof ProjectFormSchema>;

const defaultMilestones = [
  "Tasarım onayı",
  "Frontend",
  "Backend entegrasyon",
  "Test & yayın",
];

export async function createProject(data: ProjectFormData) {
  try {
    const parsed = ProjectFormSchema.parse(data);
    const project = await prisma.project.create({
      data: {
        title: parsed.title,
        clientId: parsed.clientId,
        type: parsed.type,
        status: parsed.status || "DISCOVERY",
        budget: parsed.budget,
        startDate: parsed.startDate ? new Date(parsed.startDate) : new Date(),
        deadline: parsed.deadline ? new Date(parsed.deadline) : null,
        techStack: parsed.techStack ? parsed.techStack.split(",").map((t) => t.trim()).filter(Boolean) : [],
        notes: parsed.notes || null,
        progress: 0,
      },
    });

    // Varsayılan milestone'lar oluştur
    await prisma.milestone.createMany({
      data: defaultMilestones.map((title) => ({
        projectId: project.id,
        title,
        completed: false,
      })),
    });

    // Aktivite logu
    await prisma.activity.create({
      data: {
        clientId: parsed.clientId,
        projectId: project.id,
        type: "project_created",
        description: `Yeni proje oluşturuldu: ${parsed.title}`,
      },
    });

    revalidatePath("/admin/projects");
    return { success: true, id: project.id };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues[0].message };
    }
    console.error("Proje oluşturma hatası:", err);
    return { success: false, error: "Proje oluşturulamadı." };
  }
}

export async function updateProject(id: string, data: Partial<ProjectFormData>) {
  try {
    await prisma.project.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.type && { type: data.type }),
        ...(data.status && { status: data.status }),
        ...(data.budget !== undefined && { budget: data.budget }),
        ...(data.deadline && { deadline: new Date(data.deadline) }),
        ...(data.techStack !== undefined && { techStack: data.techStack.split(",").map((t) => t.trim()).filter(Boolean) }),
        ...(data.notes !== undefined && { notes: data.notes || null }),
      },
    });
    revalidatePath("/admin/projects");
    revalidatePath(`/admin/projects/${id}`);
    return { success: true };
  } catch (err) {
    console.error("Proje güncelleme hatası:", err);
    return { success: false, error: "Proje güncellenemedi." };
  }
}

export async function updateProjectStatus(id: string, status: string) {
  try {
    const validStatus = z.enum(["DISCOVERY", "DESIGN", "DEVELOPMENT", "TESTING", "DELIVERED", "ARCHIVED"]).parse(status);
    await prisma.project.update({
      where: { id },
      data: { status: validStatus },
    });
    revalidatePath("/admin/projects");
    return { success: true };
  } catch {
    return { success: false, error: "Durum güncellenemedi." };
  }
}

export async function updateMilestone(milestoneId: string, completed: boolean) {
  try {
    const milestone = await prisma.milestone.update({
      where: { id: milestoneId },
      data: { completed, completedAt: completed ? new Date() : null },
    });

    // Progress'i yeniden hesapla
    const allMilestones = await prisma.milestone.findMany({
      where: { projectId: milestone.projectId },
    });
    const completedCount = allMilestones.filter((m) => m.completed).length;
    const progress = Math.round((completedCount / allMilestones.length) * 100);

    await prisma.project.update({
      where: { id: milestone.projectId },
      data: { progress },
    });

    revalidatePath("/admin/projects");
    return { success: true, progress };
  } catch {
    return { success: false, error: "Milestone güncellenemedi." };
  }
}

export async function addMilestone(projectId: string, title: string) {
  try {
    await prisma.milestone.create({
      data: { projectId, title, completed: false },
    });
    revalidatePath("/admin/projects");
    revalidatePath(`/admin/projects/${projectId}`);
    return { success: true };
  } catch {
    return { success: false, error: "Milestone eklenemedi." };
  }
}

export async function deleteMilestone(milestoneId: string) {
  try {
    const milestone = await prisma.milestone.delete({ where: { id: milestoneId } });

    // Progress'i yeniden hesapla
    const allMilestones = await prisma.milestone.findMany({
      where: { projectId: milestone.projectId },
    });
    const progress = allMilestones.length > 0
      ? Math.round((allMilestones.filter((m) => m.completed).length / allMilestones.length) * 100)
      : 0;

    await prisma.project.update({
      where: { id: milestone.projectId },
      data: { progress },
    });

    revalidatePath("/admin/projects");
    return { success: true };
  } catch {
    return { success: false, error: "Milestone silinemedi." };
  }
}

export async function getProjectById(id: string) {
  try {
    return await prisma.project.findUnique({
      where: { id },
      include: {
        client: { select: { id: true, name: true } },
        milestones: { orderBy: { createdAt: "asc" } },
        activities: { orderBy: { createdAt: "desc" }, take: 20 },
      },
    });
  } catch {
    return null;
  }
}
