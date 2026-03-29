"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const MaintenanceFormSchema = z.object({
  clientId: z.string().min(1, "Müşteri seçin"),
  websiteUrl: z.string().min(1, "Website URL girin"),
  monthlyFee: z.number().min(1, "Ücret girin"),
  startDate: z.string().optional(),
  renewalDate: z.string().optional(),
  domainExpiry: z.string().optional(),
  sslExpiry: z.string().optional(),
  plan: z.string().optional(),
});

export async function createMaintenanceAction(data: z.infer<typeof MaintenanceFormSchema>) {
  try {
    const parsed = MaintenanceFormSchema.parse(data);
    await prisma.maintenance.create({
      data: {
        clientId: parsed.clientId,
        websiteUrl: parsed.websiteUrl,
        monthlyFee: parsed.monthlyFee,
        startDate: parsed.startDate ? new Date(parsed.startDate) : new Date(),
        renewalDate: parsed.renewalDate ? new Date(parsed.renewalDate) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        domainExpiry: parsed.domainExpiry ? new Date(parsed.domainExpiry) : undefined,
        sslExpiry: parsed.sslExpiry ? new Date(parsed.sslExpiry) : undefined,
        plan: parsed.plan || "standard",
        isActive: true,
      },
    });
    await prisma.client.update({
      where: { id: parsed.clientId },
      data: { status: "MAINTENANCE" },
    });
    revalidatePath("/admin/maintenance");
    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) return { success: false, error: err.issues[0].message };
    console.error("Bakım oluşturma hatası:", err);
    return { success: false, error: "Bakım paketi oluşturulamadı." };
  }
}

export async function renewSSL(maintenanceId: string) {
  try {
    const m = await prisma.maintenance.findUnique({
      where: { id: maintenanceId },
      include: { client: { select: { id: true, name: true } } },
    });
    if (!m) return { success: false, error: "Kayıt bulunamadı." };

    const newExpiry = new Date();
    newExpiry.setFullYear(newExpiry.getFullYear() + 1);

    await prisma.maintenance.update({
      where: { id: maintenanceId },
      data: { sslExpiry: newExpiry },
    });

    await prisma.activity.create({
      data: {
        clientId: m.clientId,
        type: "ssl_renewed",
        description: `SSL yenilendi: ${m.websiteUrl} — yeni bitiş: ${newExpiry.toLocaleDateString("tr-TR")}`,
      },
    });

    revalidatePath("/admin/maintenance");
    return { success: true };
  } catch {
    return { success: false, error: "SSL yenilenemedi." };
  }
}

export async function getMaintenanceData() {
  try {
    const [maintenances, clients] = await Promise.all([
      prisma.maintenance.findMany({
        where: { isActive: true },
        include: { client: { select: { id: true, name: true } } },
        orderBy: { renewalDate: "asc" },
      }),
      prisma.client.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    ]);

    const now = new Date();
    const totalFee = maintenances.reduce((s, m) => s + m.monthlyFee, 0);
    const sslWarnings = maintenances.filter(
      (m) => m.sslExpiry && Math.ceil((m.sslExpiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) <= 30
    ).length;

    return {
      stats: { activeCount: maintenances.length, totalFee, sslWarnings },
      maintenances: maintenances.map((m) => ({
        id: m.id, clientId: m.client.id, clientName: m.client.name,
        websiteUrl: m.websiteUrl, monthlyFee: m.monthlyFee,
        renewalDate: m.renewalDate?.toISOString() || null,
        domainExpiry: m.domainExpiry?.toISOString() || null,
        sslExpiry: m.sslExpiry?.toISOString() || null,
        plan: m.plan,
      })),
      clients,
    };
  } catch (err) {
    console.error("Bakım veri hatası:", err);
    return null;
  }
}

export async function getClientActivities(clientId: string) {
  try {
    const activities = await prisma.activity.findMany({
      where: { clientId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return activities.map((a) => ({
      id: a.id, type: a.type, description: a.description,
      createdAt: a.createdAt.toISOString(),
    }));
  } catch {
    return [];
  }
}
