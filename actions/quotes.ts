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

    const pay1 = Math.round(data.total * 0.4);
    const pay2 = Math.round(data.total * 0.3);
    const pay3 = data.total - pay1 - pay2;
    const fmt = (n: number) => `₺${n.toLocaleString("tr-TR")}`;
    const validDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("tr-TR");

    await transporter.sendMail({
      from: `Vorte Studio <${user}>`,
      to: data.clientEmail,
      subject: `Teklif: ${data.packageType} — ${data.quoteNumber}`,
      html: `
        <div style="font-family:'Inter',system-ui,sans-serif;max-width:600px;margin:0 auto;background:#ffffff">
          <!-- Header -->
          <div style="background:#1a1a1a;padding:24px 32px;border-bottom:3px solid #f97316">
            <table style="width:100%"><tr>
              <td><span style="font-size:20px;font-weight:800;color:#fff;letter-spacing:-0.5px">VORTE<span style="color:#f97316">.</span>STUDIO</span></td>
              <td style="text-align:right;font-size:11px;color:#9ca3af;line-height:1.6">info@vortestudio.com<br>www.vortestudio.com</td>
            </tr></table>
          </div>

          <!-- Body -->
          <div style="padding:32px">
            <p style="font-size:15px;color:#1a1a1a;margin:0 0 8px">Sayın <strong>${data.clientName}</strong>,</p>
            <p style="font-size:14px;color:#6b7280;margin:0 0 24px;line-height:1.6">Aşağıdaki proje teklifi tarafınıza hazırlanmıştır. Detayları inceleyip bize dönüş yapmanızı rica ederiz.</p>

            <!-- Info Bar -->
            <table style="width:100%;background:#f3f4f6;border-radius:8px;margin-bottom:24px">
              <tr>
                <td style="padding:14px 16px"><span style="font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px">Teklif No</span><br><strong style="font-size:13px;color:#1a1a1a">${data.quoteNumber}</strong></td>
                <td style="padding:14px 16px"><span style="font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px">Paket</span><br><strong style="font-size:13px;color:#1a1a1a">${data.packageType}</strong></td>
                <td style="padding:14px 16px"><span style="font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px">Geçerlilik</span><br><strong style="font-size:13px;color:#1a1a1a">${validDate}</strong></td>
              </tr>
            </table>

            <!-- Total -->
            <div style="background:#1a1a1a;border-radius:8px;padding:16px 20px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:center">
              <table style="width:100%"><tr>
                <td><span style="font-size:14px;font-weight:700;color:#fff">TOPLAM (KDV Hariç)</span></td>
                <td style="text-align:right"><span style="font-size:22px;font-weight:800;color:#f97316">${fmt(data.total)}</span></td>
              </tr></table>
            </div>

            <!-- Payment Schedule -->
            <p style="font-size:13px;font-weight:700;color:#1a1a1a;margin:0 0 12px">Ödeme Takvimi</p>
            <table style="width:100%;border-collapse:separate;border-spacing:8px 0;margin-bottom:24px">
              <tr>
                <td style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px;text-align:center;width:33%">
                  <div style="font-size:9px;color:#16a34a;text-transform:uppercase;font-weight:700;letter-spacing:0.5px">Peşinat (%40)</div>
                  <div style="font-size:16px;font-weight:700;color:#16a34a;margin:4px 0">${fmt(pay1)}</div>
                  <div style="font-size:10px;color:#6b7280">Sözleşme imzalanınca</div>
                </td>
                <td style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:12px;text-align:center;width:33%">
                  <div style="font-size:9px;color:#d97706;text-transform:uppercase;font-weight:700;letter-spacing:0.5px">Ara Ödeme (%30)</div>
                  <div style="font-size:16px;font-weight:700;color:#d97706;margin:4px 0">${fmt(pay2)}</div>
                  <div style="font-size:10px;color:#6b7280">Tasarım onayında</div>
                </td>
                <td style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:12px;text-align:center;width:33%">
                  <div style="font-size:9px;color:#2563eb;text-transform:uppercase;font-weight:700;letter-spacing:0.5px">Bakiye (%30)</div>
                  <div style="font-size:16px;font-weight:700;color:#2563eb;margin:4px 0">${fmt(pay3)}</div>
                  <div style="font-size:10px;color:#6b7280">Teslimatta</div>
                </td>
              </tr>
            </table>

            <!-- CTA -->
            <div style="text-align:center;margin:32px 0 24px">
              <a href="https://wa.me/905427313425" style="background:#f97316;color:#fff;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none;display:inline-block">Teklifi Görüşelim →</a>
            </div>

            <!-- Notes -->
            <div style="background:#f9fafb;border-radius:8px;padding:16px;font-size:12px;color:#6b7280;line-height:1.8">
              • Fiyatlar KDV hariçtir.<br>
              • Bu teklif ${validDate} tarihine kadar geçerlidir.<br>
              • Teklif kabul edildikten sonra peşinat ödemesi ile proje başlatılır.<br>
              • Proje süresi paket tipine göre 2-6 hafta arasında değişmektedir.
            </div>
          </div>

          <!-- Footer -->
          <div style="background:#f3f4f6;padding:16px 32px;text-align:center;border-top:1px solid #e5e7eb">
            <p style="font-size:11px;color:#9ca3af;margin:0">Vorte Studio — Dijital Deneyimler · <a href="https://www.vortestudio.com" style="color:#f97316;text-decoration:none">www.vortestudio.com</a></p>
          </div>
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
