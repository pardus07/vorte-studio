"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ClientFormSchema = z.object({
  name: z.string().min(2, "Ad en az 2 karakter olmalı"),
  company: z.string().optional(),
  email: z.string().email("Geçerli e-posta girin").optional().or(z.literal("")),
  phone: z.string().optional(),
  sector: z.string().optional(),
  status: z.enum(["POTENTIAL", "ACTIVE", "MAINTENANCE", "INACTIVE"]).optional(),
  notes: z.string().optional(),
});

export type ClientFormData = z.infer<typeof ClientFormSchema>;

export async function createClient(data: ClientFormData) {
  try {
    const parsed = ClientFormSchema.parse(data);
    const client = await prisma.client.create({
      data: {
        name: parsed.name,
        company: parsed.company || null,
        email: parsed.email || null,
        phone: parsed.phone || null,
        sector: parsed.sector || null,
        status: parsed.status || "POTENTIAL",
        notes: parsed.notes || null,
      },
    });
    revalidatePath("/admin/crm");
    return { success: true, id: client.id };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.errors[0].message };
    }
    console.error("Müşteri oluşturma hatası:", err);
    return { success: false, error: "Müşteri oluşturulamadı." };
  }
}

export async function updateClient(id: string, data: Partial<ClientFormData>) {
  try {
    const parsed = ClientFormSchema.partial().parse(data);
    await prisma.client.update({
      where: { id },
      data: {
        ...parsed,
        company: parsed.company || null,
        email: parsed.email || null,
        phone: parsed.phone || null,
        sector: parsed.sector || null,
        notes: parsed.notes || null,
      },
    });
    revalidatePath("/admin/crm");
    revalidatePath(`/admin/crm/${id}`);
    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.errors[0].message };
    }
    console.error("Müşteri güncelleme hatası:", err);
    return { success: false, error: "Müşteri güncellenemedi." };
  }
}

export async function updateClientStatus(id: string, status: string) {
  try {
    const validStatus = z.enum(["POTENTIAL", "ACTIVE", "MAINTENANCE", "INACTIVE"]).parse(status);
    await prisma.client.update({
      where: { id },
      data: { status: validStatus },
    });
    revalidatePath("/admin/crm");
    return { success: true };
  } catch (err) {
    console.error("Durum güncelleme hatası:", err);
    return { success: false, error: "Durum güncellenemedi." };
  }
}

export async function deleteClient(id: string) {
  try {
    await prisma.client.delete({ where: { id } });
    revalidatePath("/admin/crm");
    return { success: true };
  } catch (err) {
    console.error("Müşteri silme hatası:", err);
    return { success: false, error: "Müşteri silinemedi." };
  }
}

export async function getClientById(id: string) {
  try {
    return await prisma.client.findUnique({
      where: { id },
      include: {
        projects: {
          include: { milestones: true },
          orderBy: { updatedAt: "desc" },
        },
        quotes: { orderBy: { createdAt: "desc" } },
        maintenance: true,
        activities: { orderBy: { createdAt: "desc" }, take: 20 },
      },
    });
  } catch {
    return null;
  }
}
