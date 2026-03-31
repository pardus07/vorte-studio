import { prisma } from '@/lib/prisma'
import TemplatesPanel from './templates-panel'

export const dynamic = 'force-dynamic'

const templateCatalog = [
  {
    id: 'dis-klinikleri',
    name: 'Diş Klinikleri',
    sector: 'Diş Klinikleri',
    sprint: 1,
    colors: ['#0EA5E9', '#10B981', '#FFFFFF'],
    font: 'Outfit + DM Sans',
    description: 'Steril, ferah, modern klinik. Mavi güven tonu, randevu CTA.',
  },
  {
    id: 'veteriner-klinikleri',
    name: 'Veteriner Klinikleri',
    sector: 'Veteriner Klinikleri',
    sprint: 1,
    colors: ['#10B981', '#FFFDF7', '#92400E'],
    font: 'Nunito + Inter',
    description: 'Sıcak, güven verici, hayvan dostu. Yeşil/krem, yuvarlak şekiller.',
  },
  {
    id: 'optik-gozlukcu',
    name: 'Optik / Gözlükçü',
    sector: 'Optik / Gözlükçü',
    sprint: 1,
    colors: ['#1E40AF', '#D4AF37', '#FFFFFF'],
    font: 'Playfair Display + Source Sans',
    description: 'Premium, lüks optik mağaza. Lacivert/altın, serif başlıklar.',
  },
  {
    id: 'fizik-tedavi',
    name: 'Fizik Tedavi Merkezleri',
    sector: 'Fizik Tedavi Merkezleri',
    sprint: 1,
    colors: ['#0F766E', '#F8FFFE', '#14B8A6'],
    font: 'DM Sans + Lato',
    description: 'Sağlıklı, hareket, iyileşme. Teal gradyan, dalga şekilleri.',
  },
  {
    id: 'tip-merkezleri',
    name: 'Tıp Merkezleri',
    sector: 'Tıp Merkezleri',
    sprint: 1,
    colors: ['#1D4ED8', '#F8FAFC', '#0F172A'],
    font: 'Inter',
    description: 'Kurumsal, güvenilir, medikal. Profesyonel mavi, badge tarzı.',
  },
  {
    id: 'estetik-klinik',
    name: 'Estetik Klinik',
    sector: 'Estetik Klinikler',
    sprint: 1,
    colors: ['#F8F5F0', '#C9A96E', '#1C1917'],
    font: 'Cormorant Garamond + Jost',
    description: 'Lüks, premium, minimalist. Krem/altın, zarif serif tipografi.',
  },
  {
    id: 'psikolog-danisma',
    name: 'Psikolog / Danışman',
    sector: 'Psikologlar / Danışmanlar',
    sprint: 1,
    colors: ['#DDD6FE', '#6D28D9', '#FAF5FF'],
    font: 'Crimson Pro + Hind',
    description: 'Huzurlu, güvenli, gizli. Lavanta/mor, yumuşak yuvarlak formlar.',
  },
  {
    id: 'diyetisyen',
    name: 'Diyetisyen',
    sector: 'Diyetisyenler',
    sprint: 1,
    colors: ['#84CC16', '#FEFDF5', '#92400E'],
    font: 'Quicksand + Mulish',
    description: 'Sağlıklı, taze, motive edici. Canlı yeşil, enerji dolu.',
  },
  // ── Sprint 2: Sağlık & Klinik (2/3) + Güzellik (1/2) ──
  {
    id: 'isitme-merkezi',
    name: 'İşitme Merkezi',
    sector: 'İşitme Merkezleri',
    sprint: 2,
    colors: ['#0369A1', '#F97316', '#FFFFFF'],
    font: 'Poppins + Open Sans',
    description: 'Güven mavisi, teknoloji + bakım. Hero + cihaz teknoloji banner.',
  },
  {
    id: 'goz-merkezi',
    name: 'Göz Merkezi',
    sector: 'Göz Merkezleri',
    sprint: 2,
    colors: ['#0C4A6E', '#D4AF37', '#FFFFFF'],
    font: 'Raleway + Lato',
    description: 'Derin mavi + altın. Hexagonal hero mask, teknoloji kartı.',
  },
  {
    id: 'kuaforler',
    name: 'Kuaförler',
    sector: 'Kuaförler',
    sprint: 2,
    colors: ['#1C1917', '#F59E0B', '#FFFBEB'],
    font: 'Tenor Sans + Karla',
    description: 'Full-width hero BG, altın aksanlar, salon atmosferi.',
  },
  {
    id: 'berberler',
    name: 'Berberler',
    sector: 'Berberler',
    sprint: 2,
    colors: ['#292524', '#DC2626', '#FAFAF5'],
    font: 'Bebas Neue + Source Sans 3',
    description: 'Retro-modern, full-width hero BG, kırmızı aksanlar, erkeksi.',
  },
  {
    id: 'guzellik-spa',
    name: 'Güzellik / SPA',
    sector: 'Güzellik / SPA Merkezleri',
    sprint: 2,
    colors: ['#FDF2F8', '#BE185D', '#D4AF37'],
    font: 'Playfair Display + Jost',
    description: 'Lüks SPA, blob hero, ambiance banner, feminen.',
  },
  {
    id: 'cilt-bakim',
    name: 'Cilt Bakım Merkezi',
    sector: 'Cilt Bakım Merkezleri',
    sprint: 2,
    colors: ['#FEF9F0', '#92400E', '#16A34A'],
    font: 'Gilda Display + Hind Siliguri',
    description: 'Doğal, organik. Dikey hero kart, ürün sergileme kartı.',
  },
  {
    id: 'epilasyon',
    name: 'Epilasyon Merkezi',
    sector: 'Epilasyon Merkezleri',
    sprint: 2,
    colors: ['#FAFAF9', '#14B8A6', '#D4AF37'],
    font: 'Raleway + Nunito',
    description: 'Modern teal, geometrik çerçeveli hero, teknoloji kartı.',
  },
  {
    id: 'tirnak-studyosu',
    name: 'Tırnak Stüdyosu',
    sector: 'Tırnak Stüdyoları',
    sprint: 2,
    colors: ['#FF6B9D', '#1C1917', '#FFF1F5'],
    font: 'Montserrat + Nunito',
    description: 'Instagram-native, 3 slot galeri, eğimli pembe hero kartı.',
  },
]

export default async function TemplatesPage() {
  let pageStats: { template: string; count: number; views: number; chats: number; demos: number }[] = []
  try {
    const raw = await prisma.prospectPage.groupBy({
      by: ['template'] as const,
      _count: { _all: true },
      _sum: { viewCount: true, chatCount: true, demoCount: true },
    })
    pageStats = raw.map((r) => ({
      template: r.template,
      count: r._count._all,
      views: r._sum.viewCount ?? 0,
      chats: r._sum.chatCount ?? 0,
      demos: r._sum.demoCount ?? 0,
    }))
  } catch {
    // DB bağlantısı yoksa boş devam et
  }

  const statsMap = Object.fromEntries(pageStats.map((s) => [s.template, s]))

  return <TemplatesPanel catalog={templateCatalog} stats={statsMap} />
}
