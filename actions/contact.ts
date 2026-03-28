"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

  const toEmail = process.env.FROM_EMAIL || "studio@vorte.com.tr";

  try {
    // 1. Studio'ya bildirim maili
    await resend.emails.send({
      from: `Vorte Studio <${toEmail}>`,
      to: toEmail,
      subject: `Yeni Proje Basvurusu — ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
          <h2 style="color:#f97316;margin-bottom:8px">Yeni Proje Basvurusu</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:8px 0;color:#666;width:120px">Ad Soyad</td><td style="padding:8px 0;font-weight:600">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Telefon</td><td style="padding:8px 0">${phone || "Belirtilmedi"}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Proje Turu</td><td style="padding:8px 0">${projectType}</td></tr>
          </table>
          <div style="margin-top:16px;padding:16px;background:#f8f8f8;border-radius:8px;font-size:14px;line-height:1.6">
            ${message.replace(/\n/g, "<br>")}
          </div>
          <p style="margin-top:24px;font-size:12px;color:#999">Bu mail studio.vorte.com.tr iletisim formundan gonderildi.</p>
        </div>
      `,
    });

    // 2. Gonderene otomatik yanit
    if (data.phone) {
      // Telefon varsa WhatsApp linki de ekle
    }

    return { success: true };
  } catch (err) {
    console.error("Resend error:", err);
    return { success: false, error: "Mail gonderilemedi. Lutfen tekrar deneyin." };
  }
}
