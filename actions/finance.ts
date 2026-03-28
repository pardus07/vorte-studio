"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const PaymentFormSchema = z.object({
  projectId: z.string().min(1, "Proje seçin"),
  amount: z.number().min(1, "Tutar girin"),
  type: z.enum(["DEPOSIT", "MILESTONE", "FINAL", "MAINTENANCE"]),
  dueDate: z.string().min(1, "Vade tarihi girin"),
  invoiceNo: z.string().optional(),
});

export async function createPayment(data: z.infer<typeof PaymentFormSchema>) {
  try {
    const parsed = PaymentFormSchema.parse(data);
    await prisma.payment.create({
      data: {
        projectId: parsed.projectId,
        amount: parsed.amount,
        type: parsed.type,
        dueDate: new Date(parsed.dueDate),
        status: "PENDING",
        invoiceNo: parsed.invoiceNo || null,
      },
    });
    revalidatePath("/admin/finance");
    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) return { success: false, error: err.issues[0].message };
    console.error("Ödeme oluşturma hatası:", err);
    return { success: false, error: "Ödeme oluşturulamadı." };
  }
}

export async function markPaymentPaid(paymentId: string) {
  try {
    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: "PAID", paidAt: new Date() },
    });
    revalidatePath("/admin/finance");
    return { success: true };
  } catch {
    return { success: false, error: "Ödeme güncellenemedi." };
  }
}

export async function getFinanceData() {
  try {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [payments, maintenances, projects] = await Promise.all([
      prisma.payment.findMany({
        include: { project: { select: { title: true } } },
        orderBy: { dueDate: "desc" },
      }),
      prisma.maintenance.findMany({
        where: { isActive: true },
        include: { client: { select: { name: true } } },
      }),
      prisma.project.findMany({
        select: { id: true, title: true },
        orderBy: { title: "asc" },
      }),
    ]);

    const thisMonthRevenue = payments
      .filter((p) => p.status === "PAID" && p.paidAt && p.paidAt >= thisMonthStart)
      .reduce((s, p) => s + p.amount, 0);

    const pendingTotal = payments
      .filter((p) => p.status === "PENDING" || (p.status === "PENDING" && p.dueDate < now))
      .reduce((s, p) => s + p.amount, 0);

    const overdueCount = payments.filter(
      (p) => p.status === "PENDING" && p.dueDate < now
    ).length;

    const maintenanceTotal = maintenances.reduce((s, m) => s + m.monthlyFee, 0);

    const monthNames = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
    const monthlyRevenue: { month: string; value: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const revenue = payments
        .filter((p) => p.status === "PAID" && p.paidAt && p.paidAt >= d && p.paidAt <= monthEnd)
        .reduce((s, p) => s + p.amount, 0);
      monthlyRevenue.push({ month: monthNames[d.getMonth()], value: revenue });
    }

    const last3 = monthlyRevenue.slice(-3).reduce((s, m) => s + m.value, 0);
    const yearlyProjection = Math.round((last3 / 3) * 12);

    return {
      stats: { thisMonthRevenue, pendingTotal, overdueCount, yearlyProjection, maintenanceTotal, maintenanceCount: maintenances.length },
      payments: payments.map((p) => ({
        id: p.id, projectTitle: p.project.title, projectId: p.projectId,
        amount: p.amount, type: p.type,
        status: (p.status === "PENDING" && p.dueDate < now) ? "OVERDUE" as const : p.status,
        dueDate: p.dueDate.toISOString(), paidAt: p.paidAt?.toISOString() || null, invoiceNo: p.invoiceNo,
      })),
      maintenances: maintenances.map((m) => ({
        id: m.id, clientName: m.client.name, fee: m.monthlyFee,
        renewalDate: m.renewalDate?.toISOString() || null,
      })),
      monthlyRevenue,
      projects: projects.map((p) => ({ id: p.id, title: p.title })),
    };
  } catch (err) {
    console.error("Finans veri hatası:", err);
    return null;
  }
}
