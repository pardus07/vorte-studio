import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getTemplateName } from '@/lib/template-selector'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

// Dynamic import map — her şablon lazy load edilir
const templateComponents = {
  'dis-klinikleri': () => import('@/lib/templates/dis-klinikleri'),
  'veteriner-klinikleri': () => import('@/lib/templates/veteriner-klinikleri'),
  'optik-gozlukcu': () => import('@/lib/templates/optik-gozlukcu'),
  'fizik-tedavi': () => import('@/lib/templates/fizik-tedavi'),
  'tip-merkezleri': () => import('@/lib/templates/tip-merkezleri'),
  'estetik-klinik': () => import('@/lib/templates/estetik-klinik'),
  'psikolog-danisma': () => import('@/lib/templates/psikolog-danisma'),
  'diyetisyen': () => import('@/lib/templates/diyetisyen'),
  'isitme-merkezi': () => import('@/lib/templates/isitme-merkezi'),
  'goz-merkezi': () => import('@/lib/templates/goz-merkezi'),
  'kuaforler': () => import('@/lib/templates/kuaforler'),
  'berberler': () => import('@/lib/templates/berberler'),
  'guzellik-spa': () => import('@/lib/templates/guzellik-spa'),
  'cilt-bakim': () => import('@/lib/templates/cilt-bakim'),
  'epilasyon': () => import('@/lib/templates/epilasyon'),
  'tirnak-studyosu': () => import('@/lib/templates/tirnak-studyosu'),
  'dovme-piercing': () => import('@/lib/templates/dovme-piercing'),
  'restoranlar': () => import('@/lib/templates/restoranlar'),
  'kafeler': () => import('@/lib/templates/kafeler'),
  'pastaneler': () => import('@/lib/templates/pastaneler'),
  'firinlar': () => import('@/lib/templates/firinlar'),
  'catering': () => import('@/lib/templates/catering'),
  'kasaplar': () => import('@/lib/templates/kasaplar'),
  'manavlar': () => import('@/lib/templates/manavlar'),
  'kuruyemisciler': () => import('@/lib/templates/kuruyemisciler'),
  'sarkuteri': () => import('@/lib/templates/sarkuteri'),
  'su-bayileri': () => import('@/lib/templates/su-bayileri'),
  'oteller': () => import('@/lib/templates/oteller'),
  'seyahat-acentesi': () => import('@/lib/templates/seyahat-acentesi'),
  'ozel-okullar': () => import('@/lib/templates/ozel-okullar'),
  'kresler': () => import('@/lib/templates/kresler'),
  'muzik-kurslari': () => import('@/lib/templates/muzik-kurslari'),
  'spor-salonlari': () => import('@/lib/templates/spor-salonlari'),
  'pilates-yoga': () => import('@/lib/templates/pilates-yoga'),
  'oto-galeri': () => import('@/lib/templates/oto-galeri'),
  'oto-servis': () => import('@/lib/templates/oto-servis'),
  'lastikci': () => import('@/lib/templates/lastikci'),
  'oto-egzoz': () => import('@/lib/templates/oto-egzoz'),
  'oto-kaporta': () => import('@/lib/templates/oto-kaporta'),
  'oto-cam': () => import('@/lib/templates/oto-cam'),
  'motosiklet-servisi': () => import('@/lib/templates/motosiklet-servisi'),
  'insaat-firmalari': () => import('@/lib/templates/insaat-firmalari'),
  'mimarlik-ofisleri': () => import('@/lib/templates/mimarlik-ofisleri'),
  'tadilat-dekorasyon': () => import('@/lib/templates/tadilat-dekorasyon'),
  'isi-yalitim': () => import('@/lib/templates/isi-yalitim'),
  'dis-cephe': () => import('@/lib/templates/dis-cephe'),
  'cati-sistemleri': () => import('@/lib/templates/cati-sistemleri'),
  'fayans-seramik': () => import('@/lib/templates/fayans-seramik'),
  'asma-tavan': () => import('@/lib/templates/asma-tavan'),
  'boya-badana': () => import('@/lib/templates/boya-badana'),
  'elektrikci': () => import('@/lib/templates/elektrikci'),
  'tesisatci': () => import('@/lib/templates/tesisatci'),
  'mermer-granit': () => import('@/lib/templates/mermer-granit'),
  'parke-zemin': () => import('@/lib/templates/parke-zemin'),
  'dosemeci': () => import('@/lib/templates/dosemeci'),
  'marangoz': () => import('@/lib/templates/marangoz'),
  'cadir-tente': () => import('@/lib/templates/cadir-tente'),
  'branda': () => import('@/lib/templates/branda'),
  'kaynak-demir': () => import('@/lib/templates/kaynak-demir'),
  'bobinaj': () => import('@/lib/templates/bobinaj'),
  'matbaalar': () => import('@/lib/templates/matbaalar'),
  'ambalaj': () => import('@/lib/templates/ambalaj'),
  'plastik-imalat': () => import('@/lib/templates/plastik-imalat'),
  'terzi': () => import('@/lib/templates/terzi'),
  'tabela-reklam': () => import('@/lib/templates/tabela-reklam'),
  'hukuk-burosu': () => import('@/lib/templates/hukuk-burosu'),
  'muhasebe': () => import('@/lib/templates/muhasebe'),
  'sigorta': () => import('@/lib/templates/sigorta'),
  'emlak-ofisi': () => import('@/lib/templates/emlak-ofisi'),
  'mobilya': () => import('@/lib/templates/mobilya'),
  'elektronik': () => import('@/lib/templates/elektronik'),
  'kirtasiye': () => import('@/lib/templates/kirtasiye'),
  'pet-shop': () => import('@/lib/templates/pet-shop'),
  'cicekci': () => import('@/lib/templates/cicekci'),
  'kuyumcu': () => import('@/lib/templates/kuyumcu'),
  'tekstil-giyim': () => import('@/lib/templates/tekstil-giyim'),
} as const

type TemplateKey = keyof typeof templateComponents

// Önizleme modu için demo veriler
const previewData: Record<string, { firmName: string; city: string; sector: string; rating: number; reviews: number }> = {
  'dis-klinikleri': { firmName: 'Gülüş Diş Kliniği', city: 'Antalya', sector: 'Diş Klinikleri', rating: 4.8, reviews: 247 },
  'veteriner-klinikleri': { firmName: 'Patiler Veteriner', city: 'İstanbul', sector: 'Veteriner Klinikleri', rating: 4.9, reviews: 183 },
  'optik-gozlukcu': { firmName: 'Netgöz Optik', city: 'Ankara', sector: 'Optik / Gözlükçü', rating: 4.7, reviews: 156 },
  'fizik-tedavi': { firmName: 'Hareket Fizik Tedavi', city: 'İzmir', sector: 'Fizik Tedavi Merkezleri', rating: 4.6, reviews: 112 },
  'tip-merkezleri': { firmName: 'Anadolu Tıp Merkezi', city: 'Bursa', sector: 'Tıp Merkezleri', rating: 4.5, reviews: 324 },
  'estetik-klinik': { firmName: 'Elite Estetik', city: 'İstanbul', sector: 'Estetik Klinikler', rating: 4.9, reviews: 89 },
  'psikolog-danisma': { firmName: 'Huzur Psikoloji', city: 'Ankara', sector: 'Psikologlar / Danışmanlar', rating: 5.0, reviews: 67 },
  'diyetisyen': { firmName: 'Sağlıklı Yaşam Beslenme', city: 'Antalya', sector: 'Diyetisyenler', rating: 4.8, reviews: 198 },
  'isitme-merkezi': { firmName: 'Ses Dünyası İşitme', city: 'Ankara', sector: 'İşitme Merkezleri', rating: 4.7, reviews: 134 },
  'goz-merkezi': { firmName: 'Netgöz Lazer', city: 'İstanbul', sector: 'Göz Merkezleri', rating: 4.9, reviews: 267 },
  'kuaforler': { firmName: 'Stil Atölyesi', city: 'İzmir', sector: 'Kuaförler', rating: 4.8, reviews: 312 },
  'berberler': { firmName: 'Usta Berber', city: 'Antalya', sector: 'Berberler', rating: 4.6, reviews: 189 },
  'guzellik-spa': { firmName: 'Huzur SPA', city: 'İstanbul', sector: 'Güzellik / SPA Merkezleri', rating: 4.9, reviews: 156 },
  'cilt-bakim': { firmName: 'Dermavita Cilt', city: 'Ankara', sector: 'Cilt Bakım Merkezleri', rating: 4.7, reviews: 98 },
  'epilasyon': { firmName: 'LazerPro Epilasyon', city: 'Bursa', sector: 'Epilasyon Merkezleri', rating: 4.8, reviews: 221 },
  'tirnak-studyosu': { firmName: 'Nail Art Studio', city: 'İstanbul', sector: 'Tırnak Stüdyoları', rating: 4.9, reviews: 178 },
  'dovme-piercing': { firmName: 'Ink Master Studio', city: 'İstanbul', sector: 'Dövme & Piercing Stüdyoları', rating: 4.9, reviews: 312 },
  'restoranlar': { firmName: 'Lezzet Konağı', city: 'İstanbul', sector: 'Restoranlar', rating: 4.8, reviews: 487 },
  'kafeler': { firmName: 'Kahve Durağı', city: 'Ankara', sector: 'Kafeler', rating: 4.7, reviews: 234 },
  'pastaneler': { firmName: 'Tatlı Eller Pastanesi', city: 'İzmir', sector: 'Pastaneler', rating: 4.9, reviews: 189 },
  'firinlar': { firmName: 'Altın Başak Fırını', city: 'Antalya', sector: 'Fırınlar', rating: 4.6, reviews: 345 },
  'catering': { firmName: 'Elit Catering', city: 'İstanbul', sector: 'Catering / Yemek Servisleri', rating: 4.8, reviews: 156 },
  'kasaplar': { firmName: 'Güven Et Market', city: 'Bursa', sector: 'Kasaplar', rating: 4.7, reviews: 278 },
  'manavlar': { firmName: 'Taze Manav', city: 'Antalya', sector: 'Manavlar', rating: 4.6, reviews: 189 },
  'kuruyemisciler': { firmName: 'Altın Fıstık Kuruyemiş', city: 'Gaziantep', sector: 'Kuruyemişçiler', rating: 4.8, reviews: 234 },
  'sarkuteri': { firmName: 'Gurme Şarküteri', city: 'İstanbul', sector: 'Şarküteri / Delikatessen', rating: 4.9, reviews: 156 },
  'su-bayileri': { firmName: 'Hayat Su', city: 'Ankara', sector: 'Su Bayileri', rating: 4.5, reviews: 312 },
  'oteller': { firmName: 'Grand Palace Hotel', city: 'İstanbul', sector: 'Oteller', rating: 4.8, reviews: 567 },
  'seyahat-acentesi': { firmName: 'Keşif Tur', city: 'Antalya', sector: 'Seyahat Acenteleri', rating: 4.7, reviews: 289 },
  'ozel-okullar': { firmName: 'Bilgi Akademi', city: 'İzmir', sector: 'Özel Okullar / Etüt Merkezleri', rating: 4.9, reviews: 178 },
  'kresler': { firmName: 'Minik Adımlar Kreşi', city: 'Antalya', sector: 'Kreşler', rating: 4.9, reviews: 145 },
  'muzik-kurslari': { firmName: 'Nota Müzik Akademi', city: 'İstanbul', sector: 'Müzik Kursları', rating: 4.8, reviews: 203 },
  'spor-salonlari': { firmName: 'PowerFit Gym', city: 'Ankara', sector: 'Spor Salonları', rating: 4.7, reviews: 356 },
  'pilates-yoga': { firmName: 'Zen Stüdyo', city: 'İzmir', sector: 'Pilates / Yoga Stüdyoları', rating: 4.9, reviews: 167 },
  'oto-galeri': { firmName: 'Prestige Oto Galeri', city: 'İstanbul', sector: 'Oto Galeri', rating: 4.6, reviews: 289 },
  'oto-servis': { firmName: 'Güven Oto Servis', city: 'Bursa', sector: 'Oto Mekanik / Servisler', rating: 4.7, reviews: 234 },
  'lastikci': { firmName: 'Hızlı Lastik', city: 'Ankara', sector: 'Lastik / Rot Balans', rating: 4.5, reviews: 312 },
  'oto-egzoz': { firmName: 'Performans Egzoz', city: 'İstanbul', sector: 'Oto Egzoz', rating: 4.7, reviews: 198 },
  'oto-kaporta': { firmName: 'Usta Kaporta', city: 'Ankara', sector: 'Oto Kaporta', rating: 4.8, reviews: 234 },
  'oto-cam': { firmName: 'Cam Ustası', city: 'İzmir', sector: 'Oto Cam', rating: 4.6, reviews: 167 },
  'motosiklet-servisi': { firmName: 'Moto Teknik', city: 'Antalya', sector: 'Motosiklet Servisleri', rating: 4.8, reviews: 145 },
  'insaat-firmalari': { firmName: 'Sağlam Yapı İnşaat', city: 'İstanbul', sector: 'Müteahhitler', rating: 4.7, reviews: 289 },
  'mimarlik-ofisleri': { firmName: 'Atölye Tasarım', city: 'Ankara', sector: 'İç Mimarlar / Dekorasyon', rating: 4.9, reviews: 178 },
  'tadilat-dekorasyon': { firmName: 'Cam Balkon Sistemleri', city: 'Bursa', sector: 'PVC / Cam Balkon', rating: 4.6, reviews: 234 },
  'isi-yalitim': { firmName: 'Enerji Yalıtım', city: 'Ankara', sector: 'Isı Yalıtım / Mantolama', rating: 4.8, reviews: 198 },
  'dis-cephe': { firmName: 'Cephe Master', city: 'İstanbul', sector: 'Dış Cephe Kaplama', rating: 4.7, reviews: 167 },
  'cati-sistemleri': { firmName: 'Güven Çatı', city: 'Bursa', sector: 'Çatı & İzolasyon', rating: 4.6, reviews: 234 },
  'fayans-seramik': { firmName: 'Karo Ustası', city: 'İzmir', sector: 'Fayans / Seramik', rating: 4.8, reviews: 189 },
  'asma-tavan': { firmName: 'Tavan Tasarım', city: 'Antalya', sector: 'Asma Tavan / Alçıpan', rating: 4.7, reviews: 145 },
  'boya-badana': { firmName: 'Renk Ustası', city: 'İstanbul', sector: 'Boyacılar', rating: 4.9, reviews: 312 },
  'elektrikci': { firmName: 'Volt Elektrik', city: 'Ankara', sector: 'Elektrikçiler', rating: 4.8, reviews: 267 },
  'tesisatci': { firmName: 'Su Ustası Tesisat', city: 'İzmir', sector: 'Tesisatçılar', rating: 4.7, reviews: 198 },
  'mermer-granit': { firmName: 'Taş Sanatı Mermer', city: 'Bursa', sector: 'Mermer / Granit', rating: 4.9, reviews: 178 },
  'parke-zemin': { firmName: 'Zemin Ustası Parke', city: 'Ankara', sector: 'Parke / Zemin Kaplama', rating: 4.7, reviews: 234 },
  'dosemeci': { firmName: 'Usta Döşemeci', city: 'İstanbul', sector: 'Döşemeciler', rating: 4.8, reviews: 156 },
  'marangoz': { firmName: 'Ahşap Sanatı', city: 'İzmir', sector: 'Marangozlar', rating: 4.9, reviews: 198 },
  'cadir-tente': { firmName: 'Gölge Tente', city: 'Antalya', sector: 'Çadır / Tente İmalatı', rating: 4.6, reviews: 167 },
  'branda': { firmName: 'Endüstri Branda', city: 'Kocaeli', sector: 'Branda İmalatı', rating: 4.7, reviews: 134 },
  'kaynak-demir': { firmName: 'Çelik Usta Demir', city: 'Ankara', sector: 'Demiriciler / Ferforje', rating: 4.8, reviews: 212 },
  'bobinaj': { firmName: 'Motor Teknik Bobinaj', city: 'İstanbul', sector: 'Bobinajcılar', rating: 4.7, reviews: 145 },
  'matbaalar': { firmName: 'Renk Matbaa', city: 'İstanbul', sector: 'Matbaacılar', rating: 4.8, reviews: 210 },
  'ambalaj': { firmName: 'Paket Ambalaj', city: 'İstanbul', sector: 'Ambalaj / Paketleme', rating: 4.6, reviews: 135 },
  'plastik-imalat': { firmName: 'Tekno Plastik', city: 'İstanbul', sector: 'Plastik İmalatı', rating: 4.7, reviews: 160 },
  'terzi': { firmName: 'Elit Terzi', city: 'İstanbul', sector: 'Terzi / Konfeksiyoncular', rating: 4.9, reviews: 245 },
  'tabela-reklam': { firmName: 'Neon Tabela', city: 'İstanbul', sector: 'Tabelacılar / Reklam', rating: 4.7, reviews: 180 },
  'hukuk-burosu': { firmName: 'Adalet Hukuk', city: 'İstanbul', sector: 'Avukatlar', rating: 4.8, reviews: 195 },
  'muhasebe': { firmName: 'Güven Mali Müşavirlik', city: 'İstanbul', sector: 'Muhasebeciler / SMMM', rating: 4.7, reviews: 170 },
  'sigorta': { firmName: 'Kalkan Sigorta', city: 'İstanbul', sector: 'Sigorta Acenteleri', rating: 4.8, reviews: 220 },
  'emlak-ofisi': { firmName: 'Prestij Emlak', city: 'İstanbul', sector: 'Emlakçılar', rating: 4.8, reviews: 312 },
  'mobilya': { firmName: 'Konfor Mobilya', city: 'Ankara', sector: 'Mobilya Mağazaları', rating: 4.7, reviews: 245 },
  'elektronik': { firmName: 'TeknoPlus', city: 'İzmir', sector: 'Elektronik Mağazaları', rating: 4.6, reviews: 289 },
  'kirtasiye': { firmName: 'Bilgi Kırtasiye', city: 'Bursa', sector: 'Kırtasiyeler', rating: 4.8, reviews: 178 },
  'pet-shop': { firmName: 'Patili Dünya', city: 'Antalya', sector: 'Pet Shop', rating: 4.9, reviews: 234 },
  'cicekci': { firmName: 'Gül Bahçesi', city: 'İstanbul', sector: 'Çiçekçiler', rating: 4.9, reviews: 198 },
  'kuyumcu': { firmName: 'Altın Işık Kuyumculuk', city: 'İstanbul', sector: 'Kuyumcular', rating: 4.8, reviews: 267 },
  'tekstil-giyim': { firmName: 'Trend Moda', city: 'İstanbul', sector: 'Tekstil / Giyim Mağazası', rating: 4.7, reviews: 312 },
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  // Önizleme modu
  if (slug.startsWith('preview-')) {
    const templateId = slug.replace('preview-', '')
    const demo = previewData[templateId]
    if (!demo) return { title: 'Şablon Bulunamadı' }
    return {
      title: `${demo.firmName} — Önizleme | Vorte Studio`,
      robots: 'noindex, nofollow',
    }
  }

  let page = null
  try {
    page = await prisma.prospectPage.findUnique({
      where: { slug },
      include: { prospect: true },
    })
  } catch {
    return { title: 'Sayfa Bulunamadı' }
  }

  if (!page) return { title: 'Sayfa Bulunamadı' }

  return {
    title: `${page.prospect.name} — Profesyonel Web Sitesi | Vorte Studio`,
    description: `${page.prospect.name} için özel hazırlanmış web sitesi teklifi. ${page.city}'da ${page.sector} sektöründe dijital dönüşüm.`,
    robots: 'noindex, nofollow',
  }
}

export default async function ProspectLandingPage({ params }: PageProps) {
  const { slug } = await params

  // ── ÖNİZLEME MODU ──
  if (slug.startsWith('preview-')) {
    const templateId = slug.replace('preview-', '') as TemplateKey
    const loader = templateComponents[templateId]
    if (!loader) notFound()

    const demo = previewData[templateId]
    if (!demo) notFound()

    const { default: TemplateComponent } = await loader()

    // Önizleme modunda da görselleri DB'den çek
    let previewImages: Record<string, string> = {}
    try {
      const imgs = await prisma.templateImage.findMany({
        where: { templateId },
        select: { slot: true, url: true },
      })
      for (const img of imgs) {
        previewImages[img.slot] = img.url
      }
    } catch {
      previewImages = {}
    }

    return (
      <TemplateComponent
        firmName={demo.firmName}
        city={demo.city}
        address="Atatürk Caddesi No:42/A"
        phone="0532 000 00 00"
        googleRating={demo.rating}
        googleReviews={demo.reviews}
        score={85}
        slug={slug}
        sector={demo.sector}
        images={Object.keys(previewImages).length > 0 ? previewImages : undefined}
      />
    )
  }

  // ── GERÇEK VERİ MODU ──
  let page = null
  try {
    page = await prisma.prospectPage.findUnique({
      where: { slug, isActive: true },
      include: {
        prospect: {
          include: { batch: true },
        },
      },
    })
  } catch {
    notFound()
  }

  if (!page) notFound()

  const { prospect } = page
  const templateName = getTemplateName(page.sector) as TemplateKey
  const loader = templateComponents[templateName] ?? templateComponents['tip-merkezleri']
  const { default: TemplateComponent } = await loader()

  // Şablon görsellerini DB'den çek
  let templateImages: Record<string, string> = {}
  try {
    const imgs = await prisma.templateImage.findMany({
      where: { templateId: templateName },
      select: { slot: true, url: true },
    })
    for (const img of imgs) {
      templateImages[img.slot] = img.url
    }
  } catch {
    templateImages = {}
  }

  return (
    <TemplateComponent
      firmName={prospect.name}
      city={page.city}
      address={prospect.address ?? undefined}
      phone={prospect.phone ?? undefined}
      googleRating={prospect.googleRating ?? undefined}
      googleReviews={prospect.googleReviews ?? undefined}
      score={prospect.score}
      slug={slug}
      sector={page.sector}
      images={Object.keys(templateImages).length > 0 ? templateImages : undefined}
    />
  )
}
