import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/**
 * KVKK Prospect Opt-Out Endpoint
 *
 * Prospect landing sayfasındaki (/p/[slug]) "Verimi Sil" butonunun hedefi.
 * Firma sahibi veri silme talebini bu endpoint'e POST eder.
 *
 * Etki:
 *  1. ProspectPage.isActive → false (sayfa artık 404 döner)
 *  2. ProspectOptOut tablosuna delil kaydı yazılır (KVKK m.13 başvuru delili)
 *
 * NOT: Prospect kaydı SİLİNMEZ — sadece sayfası kapatılır. Muhtemel hukuki
 * sorguda "kime ne yaptık" delilimiz korunur. 30 gün sonra istenirse tam
 * silme yapılır (KVKK m.7).
 */
export async function POST(req: NextRequest) {
  // Rate limit: 5 opt-out/saat/IP — kötü niyetli toplu silme önlemi.
  // Meşru kullanım: Bir firma kendi sayfasını siler, maksimum 1 deneme.
  const limited = checkRateLimit(req, "prospect-opt-out", 5, 60 * 60 * 1000);
  if (limited) return limited;

  try {
    const body = await req.json();
    const { slug, reason } = body;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { success: false, error: "Geçersiz istek — slug zorunlu" },
        { status: 400 }
      );
    }

    // İstemci meta bilgileri — delil için
    const xff = req.headers.get("x-forwarded-for") || "";
    const ip =
      xff.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      null;
    const userAgent = req.headers.get("user-agent") || null;

    // Sayfa var mı?
    const page = await prisma.prospectPage.findUnique({
      where: { slug },
      include: { prospect: true },
    });

    if (!page) {
      return NextResponse.json(
        { success: false, error: "Kayıt bulunamadı" },
        { status: 404 }
      );
    }

    // Zaten deaktif mi? (idempotent — tekrar çağrılırsa yeni delil yazıp
    // OK dönüyoruz; kullanıcı tarafında hata görünmez)
    // Paralel transaction: sayfa kapat + delil yaz
    await prisma.$transaction([
      prisma.prospectPage.update({
        where: { slug },
        data: { isActive: false },
      }),
      prisma.prospectOptOut.create({
        data: {
          prospectId: page.prospectId,
          slug,
          firmName: page.prospect.name,
          ip,
          userAgent,
          reason: reason && typeof reason === "string" ? reason.slice(0, 500) : null,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message:
        "Veri silme talebiniz alındı. Sayfanız kaldırıldı, iletişim listemizden de çıkarıldınız.",
    });
  } catch (err) {
    console.error("Opt-out hatası:", err);
    return NextResponse.json(
      { success: false, error: "İşlem başarısız — lütfen tekrar deneyin" },
      { status: 500 }
    );
  }
}
