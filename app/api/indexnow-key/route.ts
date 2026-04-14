import { NextResponse } from "next/server";
import { getIndexNowKey } from "@/lib/indexnow";

export const dynamic = "force-dynamic";

// IndexNow keyLocation — Bing/Yandex bu endpoint'i çağırıp key'i doğrular.
export async function GET() {
  const key = getIndexNowKey();
  if (!key) {
    return new NextResponse("Not configured", { status: 404 });
  }
  return new NextResponse(key, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
