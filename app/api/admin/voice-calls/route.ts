import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

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
