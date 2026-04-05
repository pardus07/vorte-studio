"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { formatWANumber } from "@/lib/phone-utils";
import {
  generateNotificationMessage,
  type WANotificationKey,
  type WANotificationInput,
} from "@/lib/wa-notifications";

const SendWASchema = z.object({
  phone: z.string().min(10, "Telefon numarası gerekli"),
  recipientName: z.string().optional(),
  template: z.string().min(1, "Şablon seçin"),
  templateInput: z.object({
    firmName: z.string().optional(),
    contactName: z.string().optional(),
    proposalUrl: z.string().optional(),
    totalPrice: z.number().optional(),
    projectTitle: z.string().optional(),
    stage: z.string().optional(),
    paymentAmount: z.number().optional(),
    paymentLabel: z.string().optional(),
    renewalDate: z.string().optional(),
    customNote: z.string().optional(),
  }),
  contextType: z.string().optional(),
  contextId: z.string().optional(),
});

export async function logWhatsAppMessage(
  data: z.infer<typeof SendWASchema>
) {
  try {
    const parsed = SendWASchema.parse(data);
    const message = generateNotificationMessage(
      parsed.template as WANotificationKey,
      parsed.templateInput as WANotificationInput
    );

    if (!message) {
      return { success: false, error: "Şablon bulunamadı" };
    }

    const formattedPhone = formatWANumber(parsed.phone);

    // Log'u kaydet
    await prisma.whatsAppLog.create({
      data: {
        phone: formattedPhone,
        recipientName: parsed.recipientName || null,
        template: parsed.template,
        message,
        contextType: parsed.contextType || null,
        contextId: parsed.contextId || null,
        sentBy: "ADMIN",
      },
    });

    revalidatePath("/admin/reports");

    return {
      success: true,
      waUrl: `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`,
      message,
    };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues[0].message };
    }
    console.error("WA log hatası:", err);
    return { success: false, error: "Mesaj kaydedilemedi" };
  }
}

export async function getWhatsAppLogs(limit = 50) {
  try {
    const logs = await prisma.whatsAppLog.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return logs.map((l) => ({
      id: l.id,
      phone: l.phone,
      recipientName: l.recipientName,
      template: l.template,
      message: l.message,
      contextType: l.contextType,
      contextId: l.contextId,
      sentBy: l.sentBy,
      createdAt: l.createdAt.toISOString(),
    }));
  } catch {
    return [];
  }
}

export async function getWhatsAppStats() {
  try {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const [total, thisMonth, lastMonth] = await Promise.all([
      prisma.whatsAppLog.count(),
      prisma.whatsAppLog.count({
        where: { createdAt: { gte: thisMonthStart } },
      }),
      prisma.whatsAppLog.count({
        where: { createdAt: { gte: lastMonthStart, lte: lastMonthEnd } },
      }),
    ]);

    // Şablon kullanım dağılımı
    const logs = await prisma.whatsAppLog.findMany({
      select: { template: true },
    });
    const templateCounts: Record<string, number> = {};
    logs.forEach((l) => {
      templateCounts[l.template] = (templateCounts[l.template] || 0) + 1;
    });

    return {
      total,
      thisMonth,
      lastMonth,
      templateCounts,
    };
  } catch {
    return { total: 0, thisMonth: 0, lastMonth: 0, templateCounts: {} };
  }
}
