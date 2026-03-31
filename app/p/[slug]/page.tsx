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
