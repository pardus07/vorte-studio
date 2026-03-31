import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import ChatForm from './chat-form'

export const dynamic = 'force-dynamic'

// Önizleme modu demo verileri
const previewData: Record<string, { firmName: string; city: string; sector: string }> = {
  'dis-klinikleri': { firmName: 'Gülüş Diş Kliniği', city: 'Antalya', sector: 'Diş Klinikleri' },
  'veteriner-klinikleri': { firmName: 'Patiler Veteriner', city: 'İstanbul', sector: 'Veteriner Klinikleri' },
  'optik-gozlukcu': { firmName: 'Netgöz Optik', city: 'Ankara', sector: 'Optik / Gözlükçü' },
  'fizik-tedavi': { firmName: 'Hareket Fizik Tedavi', city: 'İzmir', sector: 'Fizik Tedavi Merkezleri' },
  'tip-merkezleri': { firmName: 'Anadolu Tıp Merkezi', city: 'Bursa', sector: 'Tıp Merkezleri' },
  'estetik-klinik': { firmName: 'Elite Estetik', city: 'İstanbul', sector: 'Estetik Klinikler' },
  'psikolog-danisma': { firmName: 'Huzur Psikoloji', city: 'Ankara', sector: 'Psikologlar / Danışmanlar' },
  'diyetisyen': { firmName: 'Sağlıklı Yaşam Beslenme', city: 'Antalya', sector: 'Diyetisyenler' },
  'isitme-merkezi': { firmName: 'Ses Dünyası İşitme', city: 'Ankara', sector: 'İşitme Merkezleri' },
  'goz-merkezi': { firmName: 'Netgöz Lazer', city: 'İstanbul', sector: 'Göz Merkezleri' },
  'kuaforler': { firmName: 'Stil Atölyesi', city: 'İzmir', sector: 'Kuaförler' },
  'berberler': { firmName: 'Usta Berber', city: 'Antalya', sector: 'Berberler' },
  'guzellik-spa': { firmName: 'Huzur SPA', city: 'İstanbul', sector: 'Güzellik / SPA Merkezleri' },
  'cilt-bakim': { firmName: 'Dermavita Cilt', city: 'Ankara', sector: 'Cilt Bakım Merkezleri' },
  'epilasyon': { firmName: 'LazerPro Epilasyon', city: 'Bursa', sector: 'Epilasyon Merkezleri' },
  'tirnak-studyosu': { firmName: 'Nail Art Studio', city: 'İstanbul', sector: 'Tırnak Stüdyoları' },
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  if (slug.startsWith('preview-')) {
    const templateId = slug.replace('preview-', '')
    const demo = previewData[templateId]
    if (!demo) return { title: 'Sayfa Bulunamadı' }
    return {
      title: `Ücretsiz Teklif — ${demo.firmName} | Vorte Studio`,
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
    title: `Ücretsiz Teklif — ${page.prospect.name} | Vorte Studio`,
    robots: 'noindex, nofollow',
  }
}

export default async function ChatPage({ params }: PageProps) {
  const { slug } = await params

  // Önizleme modu
  if (slug.startsWith('preview-')) {
    const templateId = slug.replace('preview-', '')
    const demo = previewData[templateId]
    if (!demo) notFound()

    return (
      <ChatForm
        firmName={demo.firmName}
        city={demo.city}
        sector={demo.sector}
        slug={slug}
      />
    )
  }

  // Gerçek veri
  let page = null
  try {
    page = await prisma.prospectPage.findUnique({
      where: { slug, isActive: true },
      include: { prospect: true },
    })
  } catch {
    notFound()
  }

  if (!page) notFound()

  return (
    <ChatForm
      firmName={page.prospect.name}
      city={page.city}
      sector={page.sector}
      slug={slug}
    />
  )
}
