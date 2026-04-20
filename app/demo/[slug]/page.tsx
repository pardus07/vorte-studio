import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import DemoDisclaimer from "@/components/site/DemoDisclaimer";

export const dynamic = "force-dynamic";

// 103 şablon — lazy import
const templateComponents = {
  "dis-klinikleri": () => import("@/lib/templates/dis-klinikleri"),
  "veteriner-klinikleri": () => import("@/lib/templates/veteriner-klinikleri"),
  "optik-gozlukcu": () => import("@/lib/templates/optik-gozlukcu"),
  "fizik-tedavi": () => import("@/lib/templates/fizik-tedavi"),
  "tip-merkezleri": () => import("@/lib/templates/tip-merkezleri"),
  "estetik-klinik": () => import("@/lib/templates/estetik-klinik"),
  "psikolog-danisma": () => import("@/lib/templates/psikolog-danisma"),
  "diyetisyen": () => import("@/lib/templates/diyetisyen"),
  "isitme-merkezi": () => import("@/lib/templates/isitme-merkezi"),
  "goz-merkezi": () => import("@/lib/templates/goz-merkezi"),
  "kuaforler": () => import("@/lib/templates/kuaforler"),
  "berberler": () => import("@/lib/templates/berberler"),
  "guzellik-spa": () => import("@/lib/templates/guzellik-spa"),
  "cilt-bakim": () => import("@/lib/templates/cilt-bakim"),
  "epilasyon": () => import("@/lib/templates/epilasyon"),
  "tirnak-studyosu": () => import("@/lib/templates/tirnak-studyosu"),
  "dovme-piercing": () => import("@/lib/templates/dovme-piercing"),
  "restoranlar": () => import("@/lib/templates/restoranlar"),
  "kafeler": () => import("@/lib/templates/kafeler"),
  "pastaneler": () => import("@/lib/templates/pastaneler"),
  "firinlar": () => import("@/lib/templates/firinlar"),
  "catering": () => import("@/lib/templates/catering"),
  "kasaplar": () => import("@/lib/templates/kasaplar"),
  "manavlar": () => import("@/lib/templates/manavlar"),
  "kuruyemisciler": () => import("@/lib/templates/kuruyemisciler"),
  "sarkuteri": () => import("@/lib/templates/sarkuteri"),
  "su-bayileri": () => import("@/lib/templates/su-bayileri"),
  "oteller": () => import("@/lib/templates/oteller"),
  "seyahat-acentesi": () => import("@/lib/templates/seyahat-acentesi"),
  "ozel-okullar": () => import("@/lib/templates/ozel-okullar"),
  "kresler": () => import("@/lib/templates/kresler"),
  "muzik-kurslari": () => import("@/lib/templates/muzik-kurslari"),
  "spor-salonlari": () => import("@/lib/templates/spor-salonlari"),
  "pilates-yoga": () => import("@/lib/templates/pilates-yoga"),
  "oto-galeri": () => import("@/lib/templates/oto-galeri"),
  "oto-servis": () => import("@/lib/templates/oto-servis"),
  "lastikci": () => import("@/lib/templates/lastikci"),
  "oto-egzoz": () => import("@/lib/templates/oto-egzoz"),
  "oto-kaporta": () => import("@/lib/templates/oto-kaporta"),
  "oto-cam": () => import("@/lib/templates/oto-cam"),
  "motosiklet-servisi": () => import("@/lib/templates/motosiklet-servisi"),
  "insaat-firmalari": () => import("@/lib/templates/insaat-firmalari"),
  "mimarlik-ofisleri": () => import("@/lib/templates/mimarlik-ofisleri"),
  "tadilat-dekorasyon": () => import("@/lib/templates/tadilat-dekorasyon"),
  "isi-yalitim": () => import("@/lib/templates/isi-yalitim"),
  "dis-cephe": () => import("@/lib/templates/dis-cephe"),
  "cati-sistemleri": () => import("@/lib/templates/cati-sistemleri"),
  "fayans-seramik": () => import("@/lib/templates/fayans-seramik"),
  "asma-tavan": () => import("@/lib/templates/asma-tavan"),
  "boya-badana": () => import("@/lib/templates/boya-badana"),
  "elektrikci": () => import("@/lib/templates/elektrikci"),
  "tesisatci": () => import("@/lib/templates/tesisatci"),
  "mermer-granit": () => import("@/lib/templates/mermer-granit"),
  "parke-zemin": () => import("@/lib/templates/parke-zemin"),
  "dosemeci": () => import("@/lib/templates/dosemeci"),
  "marangoz": () => import("@/lib/templates/marangoz"),
  "cadir-tente": () => import("@/lib/templates/cadir-tente"),
  "branda": () => import("@/lib/templates/branda"),
  "kaynak-demir": () => import("@/lib/templates/kaynak-demir"),
  "bobinaj": () => import("@/lib/templates/bobinaj"),
  "matbaalar": () => import("@/lib/templates/matbaalar"),
  "ambalaj": () => import("@/lib/templates/ambalaj"),
  "plastik-imalat": () => import("@/lib/templates/plastik-imalat"),
  "terzi": () => import("@/lib/templates/terzi"),
  "tabela-reklam": () => import("@/lib/templates/tabela-reklam"),
  "hukuk-burosu": () => import("@/lib/templates/hukuk-burosu"),
  "muhasebe": () => import("@/lib/templates/muhasebe"),
  "sigorta": () => import("@/lib/templates/sigorta"),
  "emlak-ofisi": () => import("@/lib/templates/emlak-ofisi"),
  "mobilya": () => import("@/lib/templates/mobilya"),
  "elektronik": () => import("@/lib/templates/elektronik"),
  "kirtasiye": () => import("@/lib/templates/kirtasiye"),
  "pet-shop": () => import("@/lib/templates/pet-shop"),
  "cicekci": () => import("@/lib/templates/cicekci"),
  "kuyumcu": () => import("@/lib/templates/kuyumcu"),
  "tekstil-giyim": () => import("@/lib/templates/tekstil-giyim"),
  "spor-malzemeleri": () => import("@/lib/templates/spor-malzemeleri"),
  "klima-servisi": () => import("@/lib/templates/klima-servisi"),
  "kombi-servisi": () => import("@/lib/templates/kombi-servisi"),
  "beyaz-esya": () => import("@/lib/templates/beyaz-esya"),
  "asansor": () => import("@/lib/templates/asansor"),
  "jenerator": () => import("@/lib/templates/jenerator"),
  "guvenlik-sistemleri": () => import("@/lib/templates/guvenlik-sistemleri"),
  "cilingir": () => import("@/lib/templates/cilingir"),
  "su-aritma": () => import("@/lib/templates/su-aritma"),
  "fotograf-studyosu": () => import("@/lib/templates/fotograf-studyosu"),
  "temizlik": () => import("@/lib/templates/temizlik"),
  "kuru-temizleme": () => import("@/lib/templates/kuru-temizleme"),
  "hali-yikama": () => import("@/lib/templates/hali-yikama"),
  "nakliyat": () => import("@/lib/templates/nakliyat"),
  "organizasyon": () => import("@/lib/templates/organizasyon"),
  "ozel-poliklinik": () => import("@/lib/templates/ozel-poliklinik"),
  "dil-kurslari": () => import("@/lib/templates/dil-kurslari"),
  "etut-merkezleri": () => import("@/lib/templates/etut-merkezleri"),
  "surucu-kurslari": () => import("@/lib/templates/surucu-kurslari"),
  "oto-yikama": () => import("@/lib/templates/oto-yikama"),
  "oto-elektrik": () => import("@/lib/templates/oto-elektrik"),
  "oto-yedek-parca": () => import("@/lib/templates/oto-yedek-parca"),
  "oto-aksesuar": () => import("@/lib/templates/oto-aksesuar"),
  "pvc-dograma": () => import("@/lib/templates/pvc-dograma"),
  "aluminyum-dograma": () => import("@/lib/templates/aluminyum-dograma"),
  "cam-balkon": () => import("@/lib/templates/cam-balkon"),
  "prefabrik-yapi": () => import("@/lib/templates/prefabrik-yapi"),
} as const;

type TemplateKey = keyof typeof templateComponents;

// Sektör adından şehir çıkarmak için yardımcı
function extractCity(address?: string | null): string {
  if (!address) return "Türkiye";
  const cities = [
    "İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Adana", "Konya",
    "Gaziantep", "Mersin", "Kayseri", "Eskişehir", "Diyarbakır", "Samsun",
    "Denizli", "Trabzon", "Malatya", "Sakarya", "Muğla", "Kocaeli",
    "Tekirdağ", "Hatay", "Manisa", "Balıkesir", "Aydın",
  ];
  const parts = address.split(/[,\/]/);
  for (const part of parts) {
    const trimmed = part.trim();
    if (cities.some((c) => trimmed.includes(c))) return trimmed;
  }
  return parts[0]?.trim() || "Türkiye";
}

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ref?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { ref } = await searchParams;

  // ref parametresiyle lead'i çek
  if (ref) {
    try {
      const lead = await prisma.lead.findUnique({ where: { id: ref } });
      // OPTED_OUT lead'lerde firma adı meta'ya sızdırılmaz — default meta döner
      if (lead && lead.status !== "OPTED_OUT") {
        return {
          title: `${lead.name} — Profesyonel Web Sitesi Örneği | Vorte Studio`,
          description: `${lead.name} için özel hazırlanmış web sitesi teklifi. Sektörünüze özel tasarım.`,
          robots: "noindex, nofollow",
        };
      }
    } catch { /* fallthrough */ }
  }

  return {
    title: `Demo Site — ${slug} | Vorte Studio`,
    description: "Vorte Studio tarafından hazırlanmış sektörel demo web sitesi.",
    robots: "noindex, nofollow",
  };
}

export default async function DemoPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { ref } = await searchParams;

  // Şablon var mı kontrol et
  const templateKey = slug as TemplateKey;
  const loader = templateComponents[templateKey];
  if (!loader) notFound();

  // Template component'ı yükle
  const { default: TemplateComponent } = await loader();

  // Şablon görsellerini DB'den çek
  let templateImages: Record<string, string> = {};
  try {
    const imgs = await prisma.templateImage.findMany({
      where: { templateId: slug },
      select: { slot: true, url: true },
    });
    for (const img of imgs) {
      templateImages[img.slot] = img.url;
    }
  } catch {
    templateImages = {};
  }

  // ref parametresi varsa lead bilgilerini çek. Lead.findUnique try/catch
  // sadece DB bağlantısı problemleri için — notFound() burada çağırılmamalı
  // çünkü Next.js'in NEXT_NOT_FOUND hatası generic catch tarafından yutulur.
  let lead: Awaited<ReturnType<typeof prisma.lead.findUnique>> = null;
  if (ref) {
    try {
      lead = await prisma.lead.findUnique({ where: { id: ref } });
    } catch {
      lead = null; /* DB hatası: generic demo'ya düş */
    }
  }

  if (lead) {
    // KVKK m.7 gate: OPTED_OUT lead'in demo sayfası 404 döner.
    // Lead kaydı DB'de kalır (LeadOptOutLog FK koruması + 10 yıl saklama)
    // ama sayfası görünmez olur. notFound() try/catch dışında çağrılıyor.
    if (lead.status === "OPTED_OUT") notFound();

    const city = extractCity(lead.address);
    return (
      <>
        <DemoDisclaimer firmName={lead.name} leadId={lead.id} />
        <TemplateComponent
          firmName={lead.name}
          city={city}
          address={lead.address ?? undefined}
          phone={lead.phone ?? undefined}
          googleRating={lead.googleRating ?? undefined}
          googleReviews={lead.googleReviews ?? undefined}
          score={lead.score}
          slug={`demo-${slug}-${ref}`}
          sector={lead.sector ?? slug}
          images={Object.keys(templateImages).length > 0 ? templateImages : undefined}
        />
      </>
    );
  }

  // ref yoksa veya lead bulunamadıysa generic demo göster
  // Sprint 3.6c-fix: default şehir "İzmir" — Vorte Studio lokasyonu.
  // Gerçek Lead'lerde extractCity() Lead.address'ten şehir çekiyor.
  return (
    <TemplateComponent
      firmName="Demo Firma"
      city="İzmir"
      address="Örnek Mahallesi, Demo Sokak No:1"
      phone="0532 000 00 00"
      googleRating={4.8}
      googleReviews={150}
      score={80}
      slug={`demo-${slug}`}
      sector={slug}
      images={Object.keys(templateImages).length > 0 ? templateImages : undefined}
    />
  );
}
