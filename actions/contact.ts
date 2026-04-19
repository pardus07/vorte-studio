"use server";

import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";
import { logLeadStatusChange } from "@/lib/lead-history";

/** HTML special karakterlerini escape eder — e-posta XSS koruması */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "mail.vorte.com.tr",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "studio@vorte.com.tr",
    pass: process.env.SMTP_PASS || "",
  },
  tls: { rejectUnauthorized: false },
});

type LeadTrace = {
  sourceDetail?: string | null;
  sourceUrl?: string | null;
  referrer?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
};

type ContactData = {
  name: string;
  phone: string;
  projectType: string;
  message: string;
  selectedPackage?: string;
  // Sprint 3.5 — attribution verisi, client'tan getLeadTrace() ile gelir.
  trace?: LeadTrace;
};

export async function sendContactForm(data: ContactData) {
  const { name, phone, projectType, message, selectedPackage, trace } = data;

  if (!name || !message) {
    return { success: false, error: "Ad ve mesaj zorunludur." };
  }

  const studioEmail = process.env.SMTP_USER || "studio@vorte.com.tr";

  // Lead kaydı oluştur — admin panelde soğuk lead olarak düşer
  try {
    const created = await prisma.lead.create({
      data: {
        name,
        phone: phone || null,
        source: "SITE_FORM",
        status: "COLD",
        budget: selectedPackage || null,
        notes: [
          `Proje türü: ${projectType}`,
          selectedPackage ? `Seçilen paket: ${selectedPackage}` : null,
          `Mesaj: ${message}`,
        ]
          .filter(Boolean)
          .join("\n"),
        // Sprint 3.5 — attribution
        sourceDetail: trace?.sourceDetail || "contact-form",
        sourceUrl: trace?.sourceUrl || null,
        referrer: trace?.referrer || null,
        utmSource: trace?.utmSource || null,
        utmMedium: trace?.utmMedium || null,
        utmCampaign: trace?.utmCampaign || null,
      },
    });
    // Sprint 3.2 — ilk status "COLD", fromStatus null, public endpoint "system"
    await logLeadStatusChange({
      leadId: created.id,
      fromStatus: null,
      toStatus: "COLD",
      reason: "lead_created",
      changedBy: "system",
    });
  } catch (err) {
    console.error("Lead kayıt hatası:", err);
  }

  // Mail gönder
  try {
    await transporter.sendMail({
      from: `Vorte Studio <${studioEmail}>`,
      to: studioEmail,
      subject: `Yeni Proje Basvurusu — ${escapeHtml(name)}${selectedPackage ? ` (${escapeHtml(selectedPackage)})` : ""}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
          <h2 style="color:#f97316;margin-bottom:8px">Yeni Proje Basvurusu</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:8px 0;color:#666;width:120px">Ad Soyad</td><td style="padding:8px 0;font-weight:600">${escapeHtml(name)}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Telefon</td><td style="padding:8px 0">${escapeHtml(phone || "Belirtilmedi")}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Proje Türü</td><td style="padding:8px 0">${escapeHtml(projectType)}</td></tr>
            ${selectedPackage ? `<tr><td style="padding:8px 0;color:#666">Seçilen Paket</td><td style="padding:8px 0;font-weight:600;color:#f97316">${escapeHtml(selectedPackage)}</td></tr>` : ""}
          </table>
          <div style="margin-top:16px;padding:16px;background:#f8f8f8;border-radius:8px;font-size:14px;line-height:1.6">
            ${escapeHtml(message).replace(/\n/g, "<br>")}
          </div>
          <p style="margin-top:24px;font-size:12px;color:#999">Bu mail www.vortestudio.com iletisim formundan gonderildi.</p>
        </div>
      `,
    });

    return { success: true };
  } catch (err) {
    console.error("SMTP error:", err);
    return { success: false, error: "Mail gönderilemedi. Lütfen tekrar deneyin." };
  }
}
