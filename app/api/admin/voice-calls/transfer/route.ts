import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";
import { escapeHtml } from "@/lib/email";

const NOTIFICATION_EMAIL = "vortekurumsal@gmail.com";

/**
 * POST /api/admin/voice-calls/transfer
 * Voice AI'dan çağrı aktarma talebi.
 * Admin'e acil email gönderir — müşteri hatta bekliyor.
 */
export async function POST(req: NextRequest) {
  try {
    const serverKey = req.headers.get("x-server-api-key");
    const voiceAiSource = req.headers.get("x-voice-ai-source");
    const isAuthorized =
      serverKey === process.env.VORTE_INTERNAL_API_KEY ||
      voiceAiSource === "vorte-voice-ai";

    if (!isAuthorized) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const body = await req.json();
    const { roomName, callerNumber, summary, callId } = body;

    if (!callerNumber) {
      return NextResponse.json(
        { error: "callerNumber zorunlu" },
        { status: 400 }
      );
    }

    // CallLog'a transferredTo bilgisi ekle
    if (callId) {
      await prisma.callLog
        .update({
          where: { callId },
          data: { transferredTo: "operator-ibrahim" },
        })
        .catch((err: unknown) => {
          console.warn("[Transfer] CallLog güncelleme hatası:", err);
        });
    }

    // Acil email bildirimi
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

    const from = `Vorte Studio <${process.env.SMTP_USER || "studio@vorte.com.tr"}>`;

    await transporter.sendMail({
      from,
      to: NOTIFICATION_EMAIL,
      subject: `ACİL: Çağrı Aktarma — ${callerNumber} hatta bekliyor!`,
      html: `
        <!DOCTYPE html>
        <html lang="tr">
        <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
        <body style="margin:0;padding:0">
        <div style="font-family:'Segoe UI',Roboto,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#fff3e0;border-radius:12px;border:2px solid #ff6d00">
          <div style="text-align:center;margin-bottom:16px">
            <div style="display:inline-block;background:#FF4500;color:#fff;font-weight:800;font-size:18px;padding:8px 16px;border-radius:8px">V</div>
            <span style="font-size:16px;font-weight:700;margin-left:8px;color:#1a1a1a">VORTE<span style="color:#FF4500">.</span>STUDIO</span>
          </div>
          <div style="background:#ff6d00;color:#fff;text-align:center;padding:12px;border-radius:8px;font-size:16px;font-weight:700;margin-bottom:20px">
            Müşteri Hatta Bekliyor!
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:10px 0;color:#666;width:100px">Arayan</td><td style="padding:10px 0;font-weight:700;font-size:18px">${escapeHtml(callerNumber || "Bilinmiyor")}</td></tr>
            <tr><td style="padding:10px 0;color:#666">Neden</td><td style="padding:10px 0">${escapeHtml(summary || "Yetkili talebi")}</td></tr>
            ${roomName ? `<tr><td style="padding:10px 0;color:#666">Oda</td><td style="padding:10px 0;font-family:monospace;font-size:12px">${escapeHtml(roomName)}</td></tr>` : ""}
          </table>
          <div style="text-align:center;margin-top:20px">
            <a href="tel:${escapeHtml(callerNumber || "")}" style="display:inline-block;background:#16a34a;color:#fff;font-weight:700;font-size:16px;padding:14px 40px;border-radius:8px;text-decoration:none">Hemen Ara</a>
          </div>
          <p style="color:#999;font-size:11px;text-align:center;margin-top:16px">Bu bildirim Voice AI asistanı tarafından otomatik gönderilmiştir.</p>
        </div>
        </body>
        </html>
      `,
    });

    console.log(`[Transfer] Email gönderildi: ${callerNumber} → ${NOTIFICATION_EMAIL}`);

    return NextResponse.json({
      success: true,
      sentCount: 1,
      method: "email",
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[Transfer] Hata:", msg);
    return NextResponse.json(
      { error: "Aktarma bildirimi gönderilemedi", detail: msg },
      { status: 500 }
    );
  }
}
