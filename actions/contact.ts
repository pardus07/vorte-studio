"use server";

import nodemailer from "nodemailer";

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

type ContactData = {
  name: string;
  phone: string;
  projectType: string;
  message: string;
};

export async function sendContactForm(data: ContactData) {
  const { name, phone, projectType, message } = data;

  if (!name || !message) {
    return { success: false, error: "Ad ve mesaj zorunludur." };
  }

  const studioEmail = process.env.SMTP_USER || "studio@vorte.com.tr";

  try {
    await transporter.sendMail({
      from: `Vorte Studio <${studioEmail}>`,
      to: studioEmail,
      subject: `Yeni Proje Basvurusu — ${escapeHtml(name)}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
          <h2 style="color:#f97316;margin-bottom:8px">Yeni Proje Basvurusu</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:8px 0;color:#666;width:120px">Ad Soyad</td><td style="padding:8px 0;font-weight:600">${escapeHtml(name)}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Telefon</td><td style="padding:8px 0">${escapeHtml(phone || "Belirtilmedi")}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Proje Turu</td><td style="padding:8px 0">${escapeHtml(projectType)}</td></tr>
          </table>
          <div style="margin-top:16px;padding:16px;background:#f8f8f8;border-radius:8px;font-size:14px;line-height:1.6">
            ${escapeHtml(message).replace(/\n/g, "<br>")}
          </div>
          <p style="margin-top:24px;font-size:12px;color:#999">Bu mail studio.vorte.com.tr iletisim formundan gonderildi.</p>
        </div>
      `,
    });

    return { success: true };
  } catch (err) {
    console.error("SMTP error:", err);
    return { success: false, error: "Mail gonderilemedi. Lutfen tekrar deneyin." };
  }
}
