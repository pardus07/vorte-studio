import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { escapeHtml } from "@/lib/email";

// GET — list call logs with filters & pagination
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  const sp = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(sp.get("page") || "1"));
  const limit = parseInt(sp.get("limit") || "20");
  const search = sp.get("search") || "";
  const status = sp.get("status") || "";
  const dateFrom = sp.get("dateFrom") || "";
  const dateTo = sp.get("dateTo") || "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (search) {
    where.OR = [
      { callerNumber: { contains: search, mode: "insensitive" } },
      { summary: { contains: search, mode: "insensitive" } },
      { notes: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status) {
    where.status = status;
  }

  if (dateFrom || dateTo) {
    where.startedAt = {};
    if (dateFrom) where.startedAt.gte = new Date(dateFrom);
    if (dateTo) where.startedAt.lte = new Date(dateTo);
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [calls, total, todayCalls, missedCalls, allDurations] = await Promise.all([
      prisma.callLog.findMany({
        where,
        orderBy: { startedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.callLog.count({ where }),
      prisma.callLog.count({ where: { startedAt: { gte: today } } }),
      prisma.callLog.count({ where: { status: "missed" } }),
      prisma.callLog.aggregate({ _sum: { durationSeconds: true }, _avg: { durationSeconds: true } }),
    ]);

    return NextResponse.json({
      calls,
      total,
      stats: {
        todayCalls,
        totalDuration: allDurations._sum.durationSeconds || 0,
        avgDuration: Math.round(allDurations._avg.durationSeconds || 0),
        missedCalls,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[voice-calls] GET error:", error);
    return NextResponse.json(
      { error: "Arama kayıtları alınamadı" },
      { status: 500 }
    );
  }
}

// POST — create a new call log (from Voice AI server-to-server)
export async function POST(request: NextRequest) {
  // Allow server-to-server calls with special header OR admin session
  const serverKey = request.headers.get("x-server-api-key");
  const isServerCall = serverKey === process.env.VORTE_INTERNAL_API_KEY ||
                       request.headers.get("x-voice-ai-source") === "vorte-voice-ai";

  if (!isServerCall) {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }
  }

  try {
    const body = await request.json();

    const {
      callId,
      callerNumber,
      callDirection = "inbound",
      status = "completed",
      startedAt,
      endedAt,
      durationSeconds = 0,
      topics = [],
      summary,
      sentiment,
      transcript,
      audioUrl,
      audioBase64,
      audioFilename,
      transferredTo,
    } = body;

    if (!callId || !callerNumber || !startedAt) {
      return NextResponse.json(
        { error: "callId, callerNumber ve startedAt zorunludur" },
        { status: 400 }
      );
    }

    // Ses dosyasını kaydet (base64 geliyorsa)
    let savedAudioUrl = audioUrl || null;
    if (audioBase64 && audioFilename) {
      try {
        const { writeFile, mkdir } = await import("fs/promises");
        const path = await import("path");
        const audioDir = path.join(process.cwd(), "public", "uploads", "audio");
        await mkdir(audioDir, { recursive: true });
        const safeFilename = audioFilename.replace(/[^a-zA-Z0-9._-]/g, "_");
        const filePath = path.join(audioDir, safeFilename);
        const buffer = Buffer.from(audioBase64, "base64");
        await writeFile(filePath, buffer);
        savedAudioUrl = `/uploads/audio/${safeFilename}`;
        console.log(`[voice-calls] Audio saved: ${savedAudioUrl} (${Math.round(buffer.length / 1024)} KB)`);
      } catch (audioErr) {
        console.error("[voice-calls] Audio kaydetme hatası:", audioErr);
      }
    }

    // Create call log
    const callLog = await prisma.callLog.create({
      data: {
        callId,
        callerNumber,
        callDirection,
        status,
        startedAt: new Date(startedAt),
        endedAt: endedAt ? new Date(endedAt) : null,
        durationSeconds,
        topics,
        summary: summary || null,
        sentiment: sentiment || null,
        transcript: transcript || null,
        audioUrl: savedAudioUrl,
        transferredTo: transferredTo || null,
      },
    });

    // Email bildirimi (fire-and-forget)
    sendCallNotification({
      callerNumber,
      status,
      durationSeconds,
      topics,
      summary: summary || null,
      startedAt: new Date(startedAt),
    }).catch((err) => console.error("[voice-calls] Email hatası:", err));

    return NextResponse.json({ callLog }, { status: 201 });
  } catch (error) {
    console.error("[voice-calls] POST error:", error);

    // Duplicate callId check
    if (
      error instanceof Error &&
      error.message.includes("Unique constraint")
    ) {
      return NextResponse.json(
        { error: "Bu callId zaten kayıtlı" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Arama kaydı oluşturulamadı" },
      { status: 500 }
    );
  }
}

// ── Email bildirimi ───────────────────────────────────────────

const NOTIFICATION_EMAIL = "vortekurumsal@gmail.com";

interface CallNotificationData {
  callerNumber: string;
  status: string;
  durationSeconds: number;
  topics: string[];
  summary: string | null;
  startedAt: Date;
}

async function sendCallNotification(data: CallNotificationData) {
  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.default.createTransport({
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
  const durMin = Math.floor(data.durationSeconds / 60);
  const durSec = data.durationSeconds % 60;
  const durText = durMin > 0 ? `${durMin}dk ${durSec}sn` : `${durSec}sn`;
  const date = data.startedAt.toLocaleDateString("tr-TR", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const statusLabel = data.status === "completed" ? "Tamamlandı"
    : data.status === "missed" ? "Cevapsız" : "Başarısız";
  const statusColor = data.status === "completed" ? "#16a34a"
    : data.status === "missed" ? "#dc2626" : "#71717a";

  const topicsHtml = data.topics.length > 0
    ? data.topics.map(t => `<span style="display:inline-block;background:#fff3e0;color:#e65100;padding:2px 10px;border-radius:12px;font-size:12px;margin:2px">${escapeHtml(t)}</span>`).join(" ")
    : "<span style='color:#999'>—</span>";

  await transporter.sendMail({
    from,
    to: NOTIFICATION_EMAIL,
    subject: `Yeni Sesli Arama — ${data.callerNumber} (${statusLabel})`,
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
        <h2 style="color:#1a1a1a;font-size:20px;margin-bottom:16px;text-align:center">Yeni Sesli Arama</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:10px 0;color:#666;width:120px">Arayan</td><td style="padding:10px 0;font-weight:700;font-size:16px">${escapeHtml(data.callerNumber)}</td></tr>
          <tr><td style="padding:10px 0;color:#666">Tarih</td><td style="padding:10px 0">${date}</td></tr>
          <tr><td style="padding:10px 0;color:#666">Durum</td><td style="padding:10px 0"><span style="color:${statusColor};font-weight:600">${statusLabel}</span></td></tr>
          <tr><td style="padding:10px 0;color:#666">Süre</td><td style="padding:10px 0;font-weight:600">${durText}</td></tr>
          <tr><td style="padding:10px 0;color:#666;vertical-align:top">Konular</td><td style="padding:10px 0">${topicsHtml}</td></tr>
        </table>
        ${data.summary ? `
        <div style="background:#e3f2fd;border-radius:8px;padding:14px;margin-top:16px">
          <div style="font-size:11px;font-weight:700;color:#1565c0;text-transform:uppercase;margin-bottom:6px">AI Özet</div>
          <p style="margin:0;font-size:13px;color:#1a1a1a;line-height:1.5">${escapeHtml(data.summary)}</p>
        </div>` : ""}
        <div style="text-align:center;margin-top:24px">
          <a href="https://www.vortestudio.com/admin/voice-calls" style="display:inline-block;background:#FF4500;color:#fff;font-weight:700;font-size:14px;padding:12px 32px;border-radius:8px;text-decoration:none">Detayları Görüntüle</a>
        </div>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
        <p style="color:#bbb;font-size:11px;text-align:center">Vorte Studio · vortestudio.com</p>
      </div>
      </body>
      </html>
    `,
  });

  console.log(`[voice-calls] Email sent to ${NOTIFICATION_EMAIL}`);
}
