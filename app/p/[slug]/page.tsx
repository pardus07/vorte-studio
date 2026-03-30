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
    />
  )
}
