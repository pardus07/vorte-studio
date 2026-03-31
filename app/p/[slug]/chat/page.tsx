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
  'dovme-piercing': { firmName: 'Ink Master Studio', city: 'İstanbul', sector: 'Dövme & Piercing Stüdyoları' },
  'restoranlar': { firmName: 'Lezzet Konağı', city: 'İstanbul', sector: 'Restoranlar' },
  'kafeler': { firmName: 'Kahve Durağı', city: 'Ankara', sector: 'Kafeler' },
  'pastaneler': { firmName: 'Tatlı Eller Pastanesi', city: 'İzmir', sector: 'Pastaneler' },
  'firinlar': { firmName: 'Altın Başak Fırını', city: 'Antalya', sector: 'Fırınlar' },
  'catering': { firmName: 'Elit Catering', city: 'İstanbul', sector: 'Catering / Yemek Servisleri' },
  'kasaplar': { firmName: 'Güven Et Market', city: 'Bursa', sector: 'Kasaplar' },
  'manavlar': { firmName: 'Taze Manav', city: 'Antalya', sector: 'Manavlar' },
  'kuruyemisciler': { firmName: 'Altın Fıstık Kuruyemiş', city: 'Gaziantep', sector: 'Kuruyemişçiler' },
  'sarkuteri': { firmName: 'Gurme Şarküteri', city: 'İstanbul', sector: 'Şarküteri / Delikatessen' },
  'su-bayileri': { firmName: 'Hayat Su', city: 'Ankara', sector: 'Su Bayileri' },
  'oteller': { firmName: 'Grand Palace Hotel', city: 'İstanbul', sector: 'Oteller' },
  'seyahat-acentesi': { firmName: 'Keşif Tur', city: 'Antalya', sector: 'Seyahat Acenteleri' },
  'ozel-okullar': { firmName: 'Bilgi Akademi', city: 'İzmir', sector: 'Özel Okullar / Etüt Merkezleri' },
  'kresler': { firmName: 'Minik Adımlar Kreşi', city: 'Antalya', sector: 'Kreşler' },
  'muzik-kurslari': { firmName: 'Nota Müzik Akademi', city: 'İstanbul', sector: 'Müzik Kursları' },
  'spor-salonlari': { firmName: 'PowerFit Gym', city: 'Ankara', sector: 'Spor Salonları' },
  'pilates-yoga': { firmName: 'Zen Stüdyo', city: 'İzmir', sector: 'Pilates / Yoga Stüdyoları' },
  'oto-galeri': { firmName: 'Prestige Oto Galeri', city: 'İstanbul', sector: 'Oto Galeri' },
  'oto-servis': { firmName: 'Güven Oto Servis', city: 'Bursa', sector: 'Oto Mekanik / Servisler' },
  'lastikci': { firmName: 'Hızlı Lastik', city: 'Ankara', sector: 'Lastik / Rot Balans' },
  'oto-egzoz': { firmName: 'Performans Egzoz', city: 'İstanbul', sector: 'Oto Egzoz' },
  'oto-kaporta': { firmName: 'Usta Kaporta', city: 'Ankara', sector: 'Oto Kaporta' },
  'oto-cam': { firmName: 'Cam Ustası', city: 'İzmir', sector: 'Oto Cam' },
  'motosiklet-servisi': { firmName: 'Moto Teknik', city: 'Antalya', sector: 'Motosiklet Servisleri' },
  'insaat-firmalari': { firmName: 'Sağlam Yapı İnşaat', city: 'İstanbul', sector: 'Müteahhitler' },
  'mimarlik-ofisleri': { firmName: 'Atölye Tasarım', city: 'Ankara', sector: 'İç Mimarlar / Dekorasyon' },
  'tadilat-dekorasyon': { firmName: 'Cam Balkon Sistemleri', city: 'Bursa', sector: 'PVC / Cam Balkon' },
  'isi-yalitim': { firmName: 'Enerji Yalıtım', city: 'Ankara', sector: 'Isı Yalıtım / Mantolama' },
  'dis-cephe': { firmName: 'Cephe Master', city: 'İstanbul', sector: 'Dış Cephe Kaplama' },
  'cati-sistemleri': { firmName: 'Güven Çatı', city: 'Bursa', sector: 'Çatı & İzolasyon' },
  'fayans-seramik': { firmName: 'Karo Ustası', city: 'İzmir', sector: 'Fayans / Seramik' },
  'asma-tavan': { firmName: 'Tavan Tasarım', city: 'Antalya', sector: 'Asma Tavan / Alçıpan' },
  'boya-badana': { firmName: 'Renk Ustası', city: 'İstanbul', sector: 'Boyacılar' },
  'elektrikci': { firmName: 'Volt Elektrik', city: 'Ankara', sector: 'Elektrikçiler' },
  'tesisatci': { firmName: 'Su Ustası Tesisat', city: 'İzmir', sector: 'Tesisatçılar' },
  'mermer-granit': { firmName: 'Taş Sanatı Mermer', city: 'Bursa', sector: 'Mermer / Granit' },
  'parke-zemin': { firmName: 'Zemin Ustası Parke', city: 'Ankara', sector: 'Parke / Zemin Kaplama' },
  'dosemeci': { firmName: 'Usta Döşemeci', city: 'İstanbul', sector: 'Döşemeciler' },
  'marangoz': { firmName: 'Ahşap Sanatı', city: 'İzmir', sector: 'Marangozlar' },
  'cadir-tente': { firmName: 'Gölge Tente', city: 'Antalya', sector: 'Çadır / Tente İmalatı' },
  'branda': { firmName: 'Endüstri Branda', city: 'Kocaeli', sector: 'Branda İmalatı' },
  'kaynak-demir': { firmName: 'Çelik Usta Demir', city: 'Ankara', sector: 'Demiriciler / Ferforje' },
  'bobinaj': { firmName: 'Motor Teknik Bobinaj', city: 'İstanbul', sector: 'Bobinajcılar' },
  'matbaalar': { firmName: 'Renk Matbaa', city: 'İstanbul', sector: 'Matbaacılar' },
  'ambalaj': { firmName: 'Paket Ambalaj', city: 'İstanbul', sector: 'Ambalaj / Paketleme' },
  'plastik-imalat': { firmName: 'Tekno Plastik', city: 'İstanbul', sector: 'Plastik İmalatı' },
  'terzi': { firmName: 'Elit Terzi', city: 'İstanbul', sector: 'Terzi / Konfeksiyoncular' },
  'tabela-reklam': { firmName: 'Neon Tabela', city: 'İstanbul', sector: 'Tabelacılar / Reklam' },
  'hukuk-burosu': { firmName: 'Adalet Hukuk', city: 'İstanbul', sector: 'Avukatlar' },
  'muhasebe': { firmName: 'Güven Mali Müşavirlik', city: 'İstanbul', sector: 'Muhasebeciler / SMMM' },
  'sigorta': { firmName: 'Kalkan Sigorta', city: 'İstanbul', sector: 'Sigorta Acenteleri' },
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
