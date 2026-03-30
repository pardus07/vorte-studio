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

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

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
