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
      subject: `Vorte Studio - Doğrulama Kodunuz: ${code}`,
      html: `
        <!DOCTYPE html>
        <html lang="tr">
        <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
        <body style="margin:0;padding:0">
        <div style="font-family:'Segoe UI',Roboto,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#fafafa;border-radius:12px">
          <div style="text-align:center;margin-bottom:24px">
            <div style="display:inline-block;background:#FF4500;color:#fff;font-weight:800;font-size:18px;padding:8px 16px;border-radius:8px">V</div>
            <span style="font-size:16px;font-weight:700;margin-left:8px;color:#1a1a1a">VORTE<span style="color:#FF4500">.</span>STUDIO</span>
          </div>
          <h2 style="color:#1a1a1a;font-size:20px;margin-bottom:8px;text-align:center">E-posta Doğrulama</h2>
          <p style="color:#666;font-size:14px;text-align:center;margin-bottom:24px">
            <strong>${escapeHtml(firmName)}</strong> projesi için sözleşme doğrulama kodunuz:
          </p>
          <div style="background:#FF4500;color:#fff;font-size:32px;font-weight:800;letter-spacing:8px;text-align:center;padding:16px;border-radius:8px;margin-bottom:24px">
            ${code}
          </div>
          <p style="color:#999;font-size:12px;text-align:center">
            Bu kod 10 dakika geçerlidir. Talebi siz yapmadıysanız bu e-postayı görmezden gelin.
          </p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
          <p style="color:#bbb;font-size:11px;text-align:center">Vorte Studio · vortestudio.com</p>
        </div>
        </body>
        </html>
      `,
    });
    return true;
  } catch (err) {
    console.error("Doğrulama maili gönderilemedi:", err);
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
    // Dosya adı için Türkçe karakterleri ASCII'ye çevir (mail client uyumluluğu)
    const safeFileName = firmName
      .replace(/ş/g, "s").replace(/Ş/g, "S")
      .replace(/ç/g, "c").replace(/Ç/g, "C")
      .replace(/ğ/g, "g").replace(/Ğ/g, "G")
      .replace(/ü/g, "u").replace(/Ü/g, "U")
      .replace(/ö/g, "o").replace(/Ö/g, "O")
      .replace(/ı/g, "i").replace(/İ/g, "I")
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_-]/g, "");

    await transporter.sendMail({
      from: FROM,
      to,
      subject: `Vorte Studio - ${firmName} Sözleşmesi`,
      html: `
        <!DOCTYPE html>
        <html lang="tr">
        <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
        <body style="margin:0;padding:0">
        <div style="font-family:'Segoe UI',Roboto,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#fafafa;border-radius:12px">
          <div style="text-align:center;margin-bottom:24px">
            <div style="display:inline-block;background:#FF4500;color:#fff;font-weight:800;font-size:18px;padding:8px 16px;border-radius:8px">V</div>
            <span style="font-size:16px;font-weight:700;margin-left:8px;color:#1a1a1a">VORTE<span style="color:#FF4500">.</span>STUDIO</span>
          </div>
          <h2 style="color:#1a1a1a;font-size:20px;margin-bottom:8px;text-align:center">Sözleşmeniz İmzalandı</h2>
          <p style="color:#666;font-size:14px;text-align:center;margin-bottom:24px">
            <strong>${escapeHtml(firmName)}</strong> projesi için sözleşmeniz başarıyla imzalanmıştır.
            İmzalı sözleşme bu e-postanın ekinde yer almaktadır.
          </p>
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;text-align:center;margin-bottom:24px">
            <span style="color:#16a34a;font-size:14px;font-weight:600">Sözleşme başarıyla kaydedildi</span>
          </div>
          <p style="color:#999;font-size:12px;text-align:center">
            Bu sözleşmeyi güvenli bir yerde saklamanızı öneririz.
          </p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
          <p style="color:#bbb;font-size:11px;text-align:center">Vorte Studio · vortestudio.com</p>
        </div>
        </body>
        </html>
      `,
      attachments: [
        {
          filename: `Vorte_Studio_Sozlesme_${safeFileName}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });
    return true;
  } catch (err) {
    console.error("Sözleşme maili gönderilemedi:", err);
    return false;
  }
}

/** Musteri portal giris bilgilerini gonder */
export async function sendPortalCredentials(
  to: string,
  password: string,
  firmName: string
): Promise<boolean> {
  const portalUrl = `${process.env.NEXTAUTH_URL || "https://vortestudio.com"}/portal/giris`;
  try {
    await transporter.sendMail({
      from: FROM,
      to,
      subject: `Vorte Studio - Proje Portalınız Hazır`,
      html: `
        <!DOCTYPE html>
        <html lang="tr">
        <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
        <body style="margin:0;padding:0">
        <div style="font-family:'Segoe UI',Roboto,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#fafafa;border-radius:12px">
          <div style="text-align:center;margin-bottom:24px">
            <div style="display:inline-block;background:#FF4500;color:#fff;font-weight:800;font-size:18px;padding:8px 16px;border-radius:8px">V</div>
            <span style="font-size:16px;font-weight:700;margin-left:8px;color:#1a1a1a">VORTE<span style="color:#FF4500">.</span>STUDIO</span>
          </div>
          <h2 style="color:#1a1a1a;font-size:20px;margin-bottom:8px;text-align:center">Proje Portalınız Hazır!</h2>
          <p style="color:#666;font-size:14px;text-align:center;margin-bottom:24px">
            <strong>${escapeHtml(firmName)}</strong> projenizi takip edebileceğiniz portal hesabınız oluşturuldu.
          </p>
          <div style="background:#fff;border:1px solid #e5e5e5;border-radius:8px;padding:20px;margin-bottom:24px">
            <table style="width:100%;font-size:14px;border-collapse:collapse">
              <tr><td style="padding:8px 0;color:#666">E-posta</td><td style="padding:8px 0;font-weight:600;text-align:right">${escapeHtml(to)}</td></tr>
              <tr><td style="padding:8px 0;color:#666">Şifre</td><td style="padding:8px 0;font-weight:600;font-family:monospace;font-size:16px;text-align:right;color:#FF4500">${escapeHtml(password)}</td></tr>
            </table>
          </div>
          <div style="text-align:center;margin-bottom:24px">
            <a href="${portalUrl}" style="display:inline-block;background:#FF4500;color:#fff;font-weight:700;font-size:14px;padding:12px 32px;border-radius:8px;text-decoration:none">Portala Giriş Yap</a>
          </div>
          <p style="color:#999;font-size:12px;text-align:center">
            Giriş yaptıktan sonra şifrenizi değiştirebilirsiniz.<br>
            Bu e-postayı güvenli bir yerde saklayın.
          </p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
          <p style="color:#bbb;font-size:11px;text-align:center">Vorte Studio · vortestudio.com</p>
        </div>
        </body>
        </html>
      `,
    });
    return true;
  } catch (err) {
    console.error("Portal bilgi maili gönderilemedi:", err);
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
      subject: `Yeni Sözleşme İmzalandı - ${firmName}`,
      html: `
        <!DOCTYPE html>
        <html lang="tr">
        <head><meta charset="UTF-8"></head>
        <body style="margin:0;padding:0">
        <div style="font-family:'Segoe UI',Roboto,sans-serif;max-width:480px;margin:0 auto;padding:24px">
          <h2 style="color:#16a34a;margin-bottom:16px">Yeni Sözleşme İmzalandı!</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:8px 0;color:#666;width:120px">Firma</td><td style="padding:8px 0;font-weight:600">${escapeHtml(firmName)}</td></tr>
            <tr><td style="padding:8px 0;color:#666">İmzalayan</td><td style="padding:8px 0;font-weight:600">${escapeHtml(signerName)}</td></tr>
          </table>
          <p style="margin-top:16px;color:#999;font-size:12px">Admin panelden detayları görüntüleyebilirsiniz.</p>
        </div>
        </body>
        </html>
      `,
    });
    return true;
  } catch {
    return false;
  }
}
