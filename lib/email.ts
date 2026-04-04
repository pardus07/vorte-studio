import nodemailer from "nodemailer";

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

const FROM = `Vorte Studio <${process.env.SMTP_USER || "studio@vorte.com.tr"}>`;

/** HTML special karakter escape */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** E-posta dogrulama kodu gonder */
export async function sendVerificationEmail(
  to: string,
  code: string,
  firmName: string
): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: FROM,
      to,
      subject: `Vorte Studio - Dogrulama Kodunuz: ${code}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#fafafa;border-radius:12px">
          <div style="text-align:center;margin-bottom:24px">
            <div style="display:inline-block;background:#FF4500;color:#fff;font-weight:800;font-size:18px;padding:8px 16px;border-radius:8px">V</div>
            <span style="font-size:16px;font-weight:700;margin-left:8px;color:#1a1a1a">VORTE<span style="color:#FF4500">.</span>STUDIO</span>
          </div>
          <h2 style="color:#1a1a1a;font-size:20px;margin-bottom:8px;text-align:center">E-posta Dogrulama</h2>
          <p style="color:#666;font-size:14px;text-align:center;margin-bottom:24px">
            <strong>${escapeHtml(firmName)}</strong> projesi icin sozlesme dogrulama kodunuz:
          </p>
          <div style="background:#FF4500;color:#fff;font-size:32px;font-weight:800;letter-spacing:8px;text-align:center;padding:16px;border-radius:8px;margin-bottom:24px">
            ${code}
          </div>
          <p style="color:#999;font-size:12px;text-align:center">
            Bu kod 10 dakika gecerlidir. Talep siz yapmadiysaniz bu e-postayi gormezden gelin.
          </p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
          <p style="color:#bbb;font-size:11px;text-align:center">Vorte Studio · vortestudio.com</p>
        </div>
      `,
    });
    return true;
  } catch (err) {
    console.error("Dogrulama maili gonderilemedi:", err);
    return false;
  }
}

/** Sozlesme PDF'ini musteriye gonder */
export async function sendContractEmail(
  to: string,
  firmName: string,
  pdfBuffer: Buffer
): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: FROM,
      to,
      subject: `Vorte Studio - ${firmName} Sozlesmesi`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#fafafa;border-radius:12px">
          <div style="text-align:center;margin-bottom:24px">
            <div style="display:inline-block;background:#FF4500;color:#fff;font-weight:800;font-size:18px;padding:8px 16px;border-radius:8px">V</div>
            <span style="font-size:16px;font-weight:700;margin-left:8px;color:#1a1a1a">VORTE<span style="color:#FF4500">.</span>STUDIO</span>
          </div>
          <h2 style="color:#1a1a1a;font-size:20px;margin-bottom:8px;text-align:center">Sozlesmeniz Imzalandi</h2>
          <p style="color:#666;font-size:14px;text-align:center;margin-bottom:24px">
            <strong>${escapeHtml(firmName)}</strong> projesi icin sozlesmeniz basariyla imzalanmistir.
            Imzali sozlesme bu e-postanin ekinde yer almaktadir.
          </p>
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;text-align:center;margin-bottom:24px">
            <span style="color:#16a34a;font-size:14px;font-weight:600">Sozlesme basariyla kaydedildi</span>
          </div>
          <p style="color:#999;font-size:12px;text-align:center">
            Bu sozlesmeyi guvenli bir yerde saklamanizi oneririz.
          </p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
          <p style="color:#bbb;font-size:11px;text-align:center">Vorte Studio · vortestudio.com</p>
        </div>
      `,
      attachments: [
        {
          filename: `Vorte_Studio_Sozlesme_${firmName.replace(/\s+/g, "_")}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });
    return true;
  } catch (err) {
    console.error("Sozlesme maili gonderilemedi:", err);
    return false;
  }
}

/** Admin'e bildirim maili gonder */
export async function sendContractNotification(
  firmName: string,
  signerName: string
): Promise<boolean> {
  const studioEmail = process.env.SMTP_USER || "studio@vorte.com.tr";
  try {
    await transporter.sendMail({
      from: FROM,
      to: studioEmail,
      subject: `Yeni Sozlesme Imzalandi - ${firmName}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
          <h2 style="color:#16a34a;margin-bottom:16px">Yeni Sozlesme Imzalandi!</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:8px 0;color:#666;width:120px">Firma</td><td style="padding:8px 0;font-weight:600">${escapeHtml(firmName)}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Imzalayan</td><td style="padding:8px 0;font-weight:600">${escapeHtml(signerName)}</td></tr>
          </table>
          <p style="margin-top:16px;color:#999;font-size:12px">Admin panelden detaylari goruntuleyebilirsiniz.</p>
        </div>
      `,
    });
    return true;
  } catch {
    return false;
  }
}
