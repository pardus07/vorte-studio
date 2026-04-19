import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import ChatForm from './chat-form'

export const dynamic = 'force-dynamic'

// Önizleme modu demo verileri — WA outreach için sektör fallback'i
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
  'emlak-ofisi': { firmName: 'Prestij Emlak', city: 'İstanbul', sector: 'Emlakçılar' },
  'mobilya': { firmName: 'Konfor Mobilya', city: 'Ankara', sector: 'Mobilya Mağazaları' },
  'elektronik': { firmName: 'TeknoPlus', city: 'İzmir', sector: 'Elektronik Mağazaları' },
  'kirtasiye': { firmName: 'Bilgi Kırtasiye', city: 'Bursa', sector: 'Kırtasiyeler' },
  'pet-shop': { firmName: 'Patili Dünya', city: 'Antalya', sector: 'Pet Shop' },
  'cicekci': { firmName: 'Gül Bahçesi', city: 'İstanbul', sector: 'Çiçekçiler' },
  'kuyumcu': { firmName: 'Altın Işık Kuyumculuk', city: 'İstanbul', sector: 'Kuyumcular' },
  'tekstil-giyim': { firmName: 'Trend Moda', city: 'İstanbul', sector: 'Tekstil / Giyim Mağazası' },
  'spor-malzemeleri': { firmName: 'ProSport Mağaza', city: 'Antalya', sector: 'Spor Malzemeleri Mağazası' },
  'klima-servisi': { firmName: 'Serin Klima', city: 'Ankara', sector: 'Klima Servisi' },
  'kombi-servisi': { firmName: 'Sıcak Yuva Kombi', city: 'İstanbul', sector: 'Kombi Servisi' },
  'beyaz-esya': { firmName: 'Teknik Beyaz Eşya', city: 'İzmir', sector: 'Beyaz Eşya Tamircisi' },
  'asansor': { firmName: 'Güven Asansör', city: 'Bursa', sector: 'Asansör Bakım' },
  'jenerator': { firmName: 'PowerGen Enerji', city: 'İstanbul', sector: 'Jeneratör Servisi' },
  'guvenlik-sistemleri': { firmName: 'Kalkan Güvenlik', city: 'Ankara', sector: 'Güvenlik Sistemleri' },
  'cilingir': { firmName: 'Hızlı Çilingir', city: 'İstanbul', sector: 'Çilingir' },
  'su-aritma': { firmName: 'Damla Su Arıtma', city: 'Ankara', sector: 'Su Arıtma Servisi' },
  'fotograf-studyosu': { firmName: 'Işık Fotoğraf', city: 'İstanbul', sector: 'Fotoğraf Stüdyoları' },
  'temizlik': { firmName: 'Pırıl Temizlik', city: 'İzmir', sector: 'Temizlik Şirketleri' },
  'kuru-temizleme': { firmName: 'Elit Kuru Temizleme', city: 'Ankara', sector: 'Kuru Temizleme' },
  'hali-yikama': { firmName: 'Tertemiz Halı', city: 'Bursa', sector: 'Halı Yıkama' },
  'nakliyat': { firmName: 'Güven Nakliyat', city: 'İstanbul', sector: 'Nakliyat Firmaları' },
  'organizasyon': { firmName: 'Altın Anlar Organizasyon', city: 'İstanbul', sector: 'Organizasyon Şirketleri' },
  'ozel-poliklinik': { firmName: 'Sağlık Poliklinik', city: 'İstanbul', sector: 'Özel Poliklinik' },
  'dil-kurslari': { firmName: 'Global Dil Akademi', city: 'Ankara', sector: 'Dil Kursları' },
  'etut-merkezleri': { firmName: 'Başarı Etüt Merkezi', city: 'İzmir', sector: 'Etüt Merkezleri' },
  'surucu-kurslari': { firmName: 'Güvenli Yol Sürücü Kursu', city: 'Bursa', sector: 'Sürücü Kursları' },
  'oto-yikama': { firmName: 'Pırıl Oto Yıkama', city: 'Antalya', sector: 'Oto Yıkama' },
  'oto-elektrik': { firmName: 'Volt Oto Elektrik', city: 'İstanbul', sector: 'Oto Elektrik' },
  'oto-yedek-parca': { firmName: 'Parça Market', city: 'Ankara', sector: 'Oto Yedek Parça' },
  'oto-aksesuar': { firmName: 'Custom Car Aksesuar', city: 'İstanbul', sector: 'Oto Aksesuar' },
  'pvc-dograma': { firmName: 'İzopan PVC', city: 'Bursa', sector: 'PVC Doğrama' },
  'aluminyum-dograma': { firmName: 'AluTek Doğrama', city: 'İzmir', sector: 'Alüminyum Doğrama' },
  'cam-balkon': { firmName: 'Kristal Cam Balkon', city: 'Antalya', sector: 'Cam Balkon' },
  'prefabrik-yapi': { firmName: 'Modül Yapı Prefabrik', city: 'Ankara', sector: 'Prefabrik Yapı' },
}

interface PageProps {
  params: Promise<{ slug: string }>
}

// Sprint 3.6c — Revize slug parse stratejisi:
//   - `demo-{templateSlug}`               → template preview (ref yok)
//   - `demo-{templateSlug}-{leadId}`      → WhatsApp outreach lead sayfası
//
// ID format fragile olmasın diye: template key'lerini uzundan kısaya deneyip
// kalan parçayı cuid-benzeri regex ile validate ediyoruz. DB lookup FINAL auth
// — ID ne tipte olursa olsun (cuid/cuid2/nanoid) sadece DB'de bulunursa Lead
// olarak davranırız. Bulunamazsa generic demo fallback — crash yok, 404 yok.
function parseDemoSlug(slug: string): { templateId: string; leadId?: string } | null {
  const rest = slug.replace(/^demo-/, '')

  // Direkt template key mi? (ör: "dis-klinikleri")
  if (previewData[rest]) return { templateId: rest }

  // Template key + leadId: uzundan kısaya eşleştir
  const keys = Object.keys(previewData).sort((a, b) => b.length - a.length)
  for (const key of keys) {
    if (rest.startsWith(key + '-')) {
      const maybeLeadId = rest.slice(key.length + 1)
      // cuid (25 char), cuid2 (24 char) ve nanoid uyumlu geniş regex:
      //   - sadece a-z, A-Z, 0-9, _, -
      //   - 20-30 karakter uzunluğunda
      // Format değişirse DB lookup yine filtreler — crash yok
      if (/^[a-z0-9_-]{20,30}$/i.test(maybeLeadId)) {
        return { templateId: key, leadId: maybeLeadId }
      }
      // Regex tutmuyorsa leadId'siz template kabul et
      return { templateId: key }
    }
  }

  return null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  // Admin önizleme (preview-{templateId})
  if (slug.startsWith('preview-')) {
    const templateId = slug.replace(/^preview-/, '')
    const demo = previewData[templateId]
    if (!demo) return { title: 'Sayfa Bulunamadı' }
    return {
      title: `Ücretsiz Teklif — ${demo.firmName} | Vorte Studio`,
      robots: { index: false, follow: false },
    }
  }

  // Demo modu (WA şablonlarından gelen lead'ler veya plain template)
  if (slug.startsWith('demo-')) {
    const parsed = parseDemoSlug(slug)
    if (!parsed) return { title: 'Sayfa Bulunamadı' }

    // Lead ID varsa DB'den firma adını çek
    if (parsed.leadId) {
      try {
        const lead = await prisma.lead.findUnique({ where: { id: parsed.leadId } })
        if (lead) {
          return {
            title: `Ücretsiz Teklif — ${lead.name} | Vorte Studio`,
            robots: { index: false, follow: false },
          }
        }
      } catch {
        /* fallthrough to generic */
      }
    }

    const demo = previewData[parsed.templateId]
    return {
      title: `Ücretsiz Teklif — ${demo?.firmName || 'Demo'} | Vorte Studio`,
      robots: { index: false, follow: false },
    }
  }

  // Tanınmayan slug — 404
  return { title: 'Sayfa Bulunamadı' }
}

// Adresten şehir çıkar (lead.address → şehir)
function extractCityFromAddress(address?: string | null): string {
  if (!address) return 'Türkiye'
  const parts = address.split(/[,\/]/)
  const cities = [
    'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya',
    'Gaziantep', 'Mersin', 'Kayseri', 'Eskişehir', 'Diyarbakır', 'Samsun',
    'Denizli', 'Trabzon', 'Malatya', 'Sakarya', 'Muğla', 'Kocaeli',
  ]
  for (const part of parts) {
    const trimmed = part.trim()
    if (cities.some((c) => trimmed.includes(c))) return trimmed
  }
  return parts[0]?.trim() || 'Türkiye'
}

export default async function ChatPage({ params }: PageProps) {
  const { slug } = await params

  // Admin önizleme (preview-{templateId})
  if (slug.startsWith('preview-')) {
    const templateId = slug.replace(/^preview-/, '')
    const demo = previewData[templateId]
    if (!demo) notFound()

    return (
      <ChatForm
        firmName={demo.firmName}
        city={demo.city}
        sector={demo.sector}
        slug={slug}
        source="preview"
      />
    )
  }

  // Demo modu (WA şablonlarından gelen lead'ler)
  if (slug.startsWith('demo-')) {
    const parsed = parseDemoSlug(slug)
    if (!parsed) notFound()

    // Lead ID varsa DB'den kişiselleştirilmiş veri çek
    // WhatsApp gönderiminde lead.phone dolu → contact step atlanır
    if (parsed.leadId) {
      try {
        const lead = await prisma.lead.findUnique({ where: { id: parsed.leadId } })
        if (lead) {
          const demo = previewData[parsed.templateId]
          return (
            <ChatForm
              firmName={lead.name}
              city={extractCityFromAddress(lead.address)}
              sector={lead.sector || demo?.sector || 'Genel'}
              slug={slug}
              phone={lead.phone ?? null}
              email={lead.email ?? null}
              leadId={lead.id}
              source="whatsapp"
            />
          )
        }
      } catch {
        /* fallthrough to generic demo — crash olmasin */
      }
    }

    // Lead bulunamazsa generic demo — bot saldirisi veya stale URL icin
    // crash-safe fallback. Generic demo data ile ChatForm render edilir.
    const demo = previewData[parsed.templateId]
    if (!demo) notFound()

    return (
      <ChatForm
        firmName={demo.firmName}
        city={demo.city}
        sector={demo.sector}
        slug={slug}
        source="demo"
      />
    )
  }

  // Tanınmayan slug — 404
  notFound()
}
