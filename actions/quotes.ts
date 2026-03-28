"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";

export async function createQuote(data: {
  clientId: string;
  packageType: string;
  basePrice: number;
  addons: { name: string; price: number }[];
  total: number;
}) {
  try {
    const quoteCount = await prisma.quote.count();
    const quote = await prisma.quote.create({
      data: {
        clientId: data.clientId,
        packageType: data.packageType,
        basePrice: data.basePrice,
        addons: data.addons,
        total: data.total,
        status: "SENT",
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        sentAt: new Date(),
      },
    });

    await prisma.activity.create({
      data: {
        clientId: data.clientId,
        type: "quote_sent",
        description: `Teklif gönderildi: ${data.packageType} — ₺${data.total.toLocaleString("tr-TR")}`,
      },
    });

    revalidatePath("/admin/quotes");
    const quoteNumber = `QUOTE-2026-${String(quoteCount + 1).padStart(3, "0")}`;
    return { success: true, quoteId: quote.id, quoteNumber };
  } catch (err) {
    console.error("Teklif oluşturma hatası:", err);
    return { success: false, error: "Teklif oluşturulamadı." };
  }
}

export async function sendQuoteMail(data: {
  clientEmail: string;
  clientName: string;
  packageType: string;
  total: number;
  quoteNumber: string;
}) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return { success: false, error: "SMTP yapılandırması eksik. Coolify'dan SMTP ayarlarını kontrol edin." };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    });

    await transporter.sendMail({
      from: `Vorte Studio <${user}>`,
      to: data.clientEmail,
      subject: `Teklif: ${data.packageType} — ${data.quoteNumber}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
          <h2 style="color:#f97316;margin-bottom:8px">Vorte Studio — Proje Teklifi</h2>
          <p>Sayın ${data.clientName},</p>
          <p>Aşağıdaki teklif tarafınıza hazırlanmıştır:</p>
          <table style="width:100%;border-collapse:collapse;font-size:14px;margin:16px 0">
            <tr><td style="padding:8px 0;color:#666">Paket</td><td style="padding:8px 0;font-weight:600">${data.packageType}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Toplam</td><td style="padding:8px 0;font-weight:600;color:#f97316">₺${data.total.toLocaleString("tr-TR")}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Teklif No</td><td style="padding:8px 0">${data.quoteNumber}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Geçerlilik</td><td style="padding:8px 0">30 gün</td></tr>
          </table>
          <p>Sorularınız için bize ulaşın.</p>
          <p style="margin-top:24px;font-size:12px;color:#999">Vorte Studio · studio.vorte.com.tr</p>
        </div>
      `,
    });

    return { success: true };
  } catch (err) {
    console.error("Teklif mail hatası:", err);
    return { success: false, error: "Mail gönderilemedi." };
  }
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
