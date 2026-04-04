'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  firmName: string
  city: string
  sector: string
  slug: string
}

interface Message {
  role: 'assistant' | 'user'
  text: string
  buttons?: ButtonOption[]
  multiSelect?: boolean
  infoBox?: boolean
}

interface ButtonOption {
  label: string
  value: string
}

interface FreeQuestion {
  question: string
  answer: string
  step: number
  timestamp: string
}

// ── Adım tanımları ──
type Step =
  | 'intro'
  | 'firmName'
  | 'siteType'
  | 'features'
  | 'pageCount'
  | 'contentStatus'
  | 'hostingStatus'
  | 'hostingInfo'
  | 'hostingChoice'
  | 'hostingPackages'
  | 'domainStatus'
  | 'domainInfo'
  | 'timeline'
  | 'message'
  | 'contactName'
  | 'contactPhone'
  | 'contactEmail'
  | 'done'
  | 'freeQuestion'

// ── Toplam anlamlı adım sayısı (progress bar için) ──
const TOTAL_STEPS = 10

function stepToNumber(s: Step): number {
  const map: Record<string, number> = {
    firmName: 1, siteType: 2, features: 3, pageCount: 4,
    contentStatus: 5, hostingStatus: 6, domainStatus: 7,
    timeline: 8, message: 9, contact: 10,
  }
  return map[s] || 0
}

// ── Site türü seçenekleri ──
const SITE_TYPES: ButtonOption[] = [
  { label: '🏢 Tanıtım Sitesi', value: 'tanitim' },
  { label: '🛒 E-Ticaret', value: 'e-ticaret' },
  { label: '🎨 Portföy', value: 'portfoy' },
  { label: '📅 Randevu Sistemi', value: 'randevu' },
  { label: '📦 Katalog Sitesi', value: 'katalog' },
  { label: '🤔 Henüz Karar Vermedim', value: 'belirsiz' },
]

// ── Tüm özellik seçenekleri (24 adet) ──
const ALL_FEATURES: ButtonOption[] = [
  { label: '📅 Online Randevu', value: 'online-randevu' },
  { label: '📦 Ürün Kataloğu', value: 'urun-katalogu' },
  { label: '💬 WhatsApp İletişim', value: 'whatsapp' },
  { label: '📍 Google Harita', value: 'harita' },
  { label: '📸 Fotoğraf Galerisi', value: 'galeri' },
  { label: '📝 Blog', value: 'blog' },
  { label: '⭐ Müşteri Yorumları', value: 'yorumlar' },
  { label: '🔗 Sosyal Medya', value: 'sosyal-medya' },
  { label: '💳 Online Ödeme', value: 'online-odeme' },
  { label: '🌐 Çok Dilli (TR/EN)', value: 'cok-dilli' },
  { label: '💬 Canlı Destek', value: 'canli-destek' },
  { label: '🔍 SEO Optimizasyon', value: 'seo' },
  // ── Yeni özellikler ──
  { label: '💰 Fiyat / Hizmet Listesi', value: 'fiyat-listesi' },
  { label: '👥 Ekip / Kadro Tanıtımı', value: 'ekip-tanitim' },
  { label: '🏆 Proje Portföyü / Referanslar', value: 'portfoy-referans' },
  { label: '🛵 Online Sipariş / Paket Servis', value: 'online-siparis' },
  { label: '📋 Teklif İsteme Formu', value: 'teklif-formu' },
  { label: '❓ SSS (Sıkça Sorulan Sorular)', value: 'sss' },
  { label: '🔄 Önce / Sonra Galerisi', value: 'once-sonra' },
  { label: '🎬 Video Galeri', value: 'video-galeri' },
  { label: '🗺️ Hizmet Bölgeleri Haritası', value: 'bolge-harita' },
  { label: '🏷️ Kampanya / İndirim Sistemi', value: 'kampanya' },
  { label: '📆 Rezervasyon Sistemi', value: 'rezervasyon' },
  { label: '📧 E-Bülten Abonelik', value: 'e-bulten' },
]

// ── Sektör grubu → önerilen özellikler ──
const SECTOR_FEATURE_MAP: Record<string, string[]> = {
  // Sağlık & Klinik
  'saglik': ['online-randevu', 'ekip-tanitim', 'fiyat-listesi', 'once-sonra', 'sss', 'whatsapp', 'harita', 'blog', 'yorumlar', 'seo'],
  // Güzellik & Bakım
  'guzellik': ['online-randevu', 'fiyat-listesi', 'ekip-tanitim', 'once-sonra', 'galeri', 'whatsapp', 'yorumlar', 'sosyal-medya', 'seo'],
  // Yeme-İçme
  'yeme-icme': ['fiyat-listesi', 'online-siparis', 'rezervasyon', 'galeri', 'whatsapp', 'harita', 'sosyal-medya', 'yorumlar'],
  // Gıda Perakende
  'gida': ['online-siparis', 'fiyat-listesi', 'kampanya', 'whatsapp', 'harita', 'e-bulten', 'yorumlar'],
  // Konaklama & Turizm
  'konaklama': ['rezervasyon', 'galeri', 'video-galeri', 'fiyat-listesi', 'cok-dilli', 'harita', 'yorumlar', 'seo', 'e-bulten'],
  // Eğitim
  'egitim': ['ekip-tanitim', 'fiyat-listesi', 'teklif-formu', 'sss', 'blog', 'galeri', 'whatsapp', 'harita', 'yorumlar'],
  // Spor & Fitness
  'spor': ['ekip-tanitim', 'fiyat-listesi', 'online-randevu', 'galeri', 'video-galeri', 'whatsapp', 'sosyal-medya', 'yorumlar'],
  // Otomotiv
  'otomotiv': ['fiyat-listesi', 'galeri', 'online-randevu', 'teklif-formu', 'whatsapp', 'harita', 'yorumlar', 'seo'],
  // İnşaat & Tadilat
  'insaat': ['portfoy-referans', 'teklif-formu', 'bolge-harita', 'galeri', 'once-sonra', 'whatsapp', 'harita', 'seo'],
  // Atölye & İmalat
  'imalat': ['portfoy-referans', 'teklif-formu', 'fiyat-listesi', 'galeri', 'whatsapp', 'harita', 'seo'],
  // Hizmet & Profesyonel
  'profesyonel': ['ekip-tanitim', 'sss', 'blog', 'teklif-formu', 'fiyat-listesi', 'whatsapp', 'seo', 'yorumlar'],
  // Perakende
  'perakende': ['urun-katalogu', 'kampanya', 'fiyat-listesi', 'online-odeme', 'whatsapp', 'harita', 'sosyal-medya', 'e-bulten'],
  // Teknik Servis & Bakım
  'teknik-servis': ['bolge-harita', 'fiyat-listesi', 'teklif-formu', 'online-randevu', 'whatsapp', 'harita', 'yorumlar', 'seo'],
  // Diğer Hizmetler
  'diger': ['portfoy-referans', 'teklif-formu', 'bolge-harita', 'fiyat-listesi', 'whatsapp', 'harita', 'yorumlar', 'seo'],
}

// Sektör adından grup belirle
function getSectorGroup(sector: string): string {
  const s = sector.toLowerCase()
  // Sağlık
  if (['diş', 'veteriner', 'optik', 'fizik tedavi', 'tıp', 'psikolog', 'diyetisyen', 'estetik klinik', 'poliklinik', 'işitme', 'göz merkezi'].some(k => s.includes(k))) return 'saglik'
  // Güzellik
  if (['kuaför', 'berber', 'güzellik', 'spa', 'cilt bakım', 'epilasyon', 'tırnak', 'dövme', 'piercing'].some(k => s.includes(k))) return 'guzellik'
  // Yeme-İçme
  if (['restoran', 'kafe', 'pastane', 'fırın', 'catering', 'yemek'].some(k => s.includes(k))) return 'yeme-icme'
  // Gıda
  if (['kasap', 'manav', 'kuruyemiş', 'su bayi', 'şarküteri', 'delikatessen'].some(k => s.includes(k))) return 'gida'
  // Konaklama
  if (['otel', 'seyahat', 'acente', 'turizm'].some(k => s.includes(k))) return 'konaklama'
  // Eğitim
  if (['kurs', 'okul', 'kreş', 'etüt', 'sürücü', 'müzik', 'eğitim'].some(k => s.includes(k))) return 'egitim'
  // Spor
  if (['spor salon', 'pilates', 'yoga', 'fitness'].some(k => s.includes(k))) return 'spor'
  // Otomotiv
  if (['oto ', 'oto-', 'lastik', 'motosiklet', 'galeri'].some(k => s.includes(k))) return 'otomotiv'
  // İnşaat
  if (['inşaat', 'mimar', 'tadilat', 'dekorasyon', 'pvc', 'alüminyum', 'cam balkon', 'mermer', 'cephe', 'yalıtım', 'çatı', 'fayans', 'alçıpan', 'prefabrik', 'boya', 'elektrikçi', 'tesisatçı'].some(k => s.includes(k))) return 'insaat'
  // İmalat
  if (['parke', 'döşeme', 'çadır', 'tente', 'branda', 'kaynak', 'demir', 'marangoz', 'bobinaj', 'matbaa', 'ambalaj', 'plastik', 'terzi', 'dikiş'].some(k => s.includes(k))) return 'imalat'
  // Profesyonel
  if (['hukuk', 'avukat', 'muhasebe', 'emlak', 'sigorta'].some(k => s.includes(k))) return 'profesyonel'
  // Perakende
  if (['mobilya', 'elektronik', 'kırtasiye', 'pet shop', 'çiçek', 'kuyumcu', 'tekstil', 'giyim', 'spor malzeme', 'mağaza'].some(k => s.includes(k))) return 'perakende'
  // Teknik Servis
  if (['klima', 'kombi', 'beyaz eşya', 'asansör', 'jeneratör', 'güvenlik', 'çilingir', 'su arıtma', 'servis'].some(k => s.includes(k))) return 'teknik-servis'
  // Diğer
  return 'diger'
}

// Sektöre göre sıralı özellik listesi oluştur (öneriler üstte)
function getOrderedFeatures(sector: string): { recommended: ButtonOption[], others: ButtonOption[] } {
  const group = getSectorGroup(sector)
  const recommendedKeys = SECTOR_FEATURE_MAP[group] || SECTOR_FEATURE_MAP['diger']
  const recommended = ALL_FEATURES.filter(f => recommendedKeys.includes(f.value))
  const others = ALL_FEATURES.filter(f => !recommendedKeys.includes(f.value))
  return { recommended, others }
}

// ── Hosting bilgi metinleri ──
const HOSTING_COMPAT_INFO = `Harika! Mevcut hostinginizin uyumluluğunu kontrol edelim.

Web sitelerimiz Next.js teknolojisi ile yapılır. Bunun için:

✅ Node.js 20+ destekli VPS veya Cloud sunucu
✅ PostgreSQL veritabanı
✅ Docker desteği
✅ En az 1 vCPU + 1GB RAM

❌ cPanel'li shared hosting uygun değildir
❌ Sadece WordPress destekleyen sunucular uygun değildir

Mevcut hostinginiz bu özelliklere sahip değilse endişelenmeyin — size uygun fiyatlı hosting paketlerimiz mevcut.`

const HOSTING_SELF_INFO = `Kendiniz almak isterseniz Türkiye lokasyonlu VPS önerilerimiz:

• Hetzner Cloud — CX22 (~€4.5/ay)
• Contabo İstanbul — VPS S (~€6/ay)
• Turhost / Natro VPS planları

⚠️ Önemli: cPanel'li shared hosting ALMAYIN. "VPS" veya "Cloud Server" kategorisinden seçin.

Kurulumu ve yapılandırmayı biz yaparız, sadece sunucuyu almanız yeterli.`

const HOSTING_PACKAGES_INFO = `Hosting paketlerimiz (Türkiye lokasyonlu VDS, yıllık, KDV dahil):

📦 Starter — 2.650 TL/yıl
   2 vCPU · 3 GB RAM · 30 GB SSD · Limitsiz bant genişliği
   Tek site için ideal

📦 Business — 4.900 TL/yıl
   4 vCPU · 6 GB RAM · 50 GB SSD · Limitsiz bant genişliği
   Orta ölçekli siteler ve katalog siteleri için

📦 Pro — 6.150 TL/yıl
   4 vCPU · 8 GB RAM · 60 GB SSD · Limitsiz bant genişliği
   E-ticaret ve yoğun trafikli siteler için

Tüm paketlere kurulum, SSL sertifikası ve teknik destek dahildir.`

// ── Domain bilgi metinleri ──
const DOMAIN_INFO: Record<string, string> = {
  yok: `Domain (alan adı) web sitenizin adresidir. Örneğin: firmaadi.com veya firmaadi.com.tr

Türkiye'deki güvenilir domain sağlayıcıları:
• İsimTescil (isimtescil.net)
• Natro (natro.com)
• Turhost (turhost.com)

⚠️ Önemli: Domain'i KENDİ firmanız adına ve KENDİ faturanıza kayıt ettirin. Nameserver yönlendirmesini biz yaparız.`,

  bilmiyor: `Domain (alan adı), web sitenizin internet adresidir — örneğin firmaadi.com

Eğer daha önce bir domain almadıysanız endişelenmeyin. Görüşmede size adım adım yardımcı olacağız. Domain'i kendi adınıza almanız önemlidir.`,
}

// ── Framer-motion variants ──
const messageVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
}

const buttonVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, type: 'spring' as const, stiffness: 400, damping: 25 },
  }),
}

const pulseKeyframes = `
@keyframes dotPulse {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}
`

export default function ChatForm({ firmName, city, sector, slug }: Props) {
  // ── State ──
  const [messages, setMessages] = useState<Message[]>([])
  const [step, setStep] = useState<Step>('intro')
  const [prevStep, setPrevStep] = useState<Step>('intro')
  const [isTyping, setIsTyping] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  // Toplanan veriler
  const [data, setData] = useState({
    firmName: '',
    siteType: '',
    features: [] as string[],
    pageCount: '',
    contentStatus: '',
    hostingStatus: '',
    hostingProvider: '',
    domainStatus: '',
    domainName: '',
    timeline: '',
    message: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
  })

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [freeQuestions, setFreeQuestions] = useState<FreeQuestion[]>([])

  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Otomatik scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Input focus
  useEffect(() => {
    if (step === 'firmName' || step === 'message' || step === 'contactName' || step === 'contactPhone' || step === 'contactEmail' || step === 'freeQuestion') {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [step])

  // Bot mesajı ekle
  const addBotMessage = useCallback(
    (text: string, nextStep: Step, options?: { buttons?: ButtonOption[]; multiSelect?: boolean; infoBox?: boolean }) => {
      setIsTyping(true)
      const delay = Math.min(600 + text.length * 3, 1500)
      setTimeout(() => {
        setIsTyping(false)
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text,
            buttons: options?.buttons,
            multiSelect: options?.multiSelect,
            infoBox: options?.infoBox,
          },
        ])
        setStep(nextStep)
      }, delay)
    },
    [],
  )

  // ── İlk mesajlar ──
  useEffect(() => {
    const t1 = setTimeout(() => {
      setMessages([
        {
          role: 'assistant',
          text: `Merhaba! ${firmName} için özel bir web sitesi teklifi hazırlayalım.`,
        },
      ])
    }, 500)

    const t2 = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `${city}'da ${sector.toLowerCase()} sektöründe dijital varlığınızı güçlendirmek için tam size uygun bir çözüm sunacağız. Size birkaç soru soracağım — yaklaşık 2 dakika sürer.`,
        },
      ])
    }, 2000)

    const t3 = setTimeout(() => {
      addBotMessage('İşletmenizin tam adını öğrenebilir miyim?', 'firmName')
    }, 3500)

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Buton tıklama ──
  function handleButtonClick(value: string, label: string) {
    setMessages((prev) => [...prev, { role: 'user', text: label }])

    switch (step) {
      case 'siteType':
        setData((d) => ({ ...d, siteType: value }))
        addBotMessage(
          `Sitenizde hangi özellikler olsun? Sektörünüze özel önerilerimiz en üstte yer alıyor. Birden fazla seçebilirsiniz, ardından "Devam Et" butonuna basın.`,
          'features',
          { buttons: ALL_FEATURES, multiSelect: true },
        )
        break

      case 'pageCount':
        setData((d) => ({ ...d, pageCount: value }))
        addBotMessage('İçerik durumunuz nedir? (Logo, fotoğraf, metin)', 'contentStatus', {
          buttons: [
            { label: '✅ Her şeyim hazır', value: 'hazir' },
            { label: '🎨 Logom var, fotoğraf lazım', value: 'logo-var' },
            { label: '📦 Hiçbir şeyim yok, her şeyi siz yapın', value: 'hicbir-sey-yok' },
            { label: '🔄 Mevcut sitemden alınabilir', value: 'mevcut-site' },
          ],
        })
        break

      case 'contentStatus':
        setData((d) => ({ ...d, contentStatus: value }))
        addBotMessage('Hosting (sunucu barındırma) durumunuz nedir?', 'hostingStatus', {
          buttons: [
            { label: '✅ Hostingim var', value: 'var' },
            { label: '❌ Hostingim yok', value: 'yok' },
            { label: '❓ Ne olduğunu bilmiyorum', value: 'bilmiyor' },
          ],
        })
        break

      case 'hostingStatus':
        setData((d) => ({ ...d, hostingStatus: value }))
        if (value === 'var') {
          // Mevcut hosting var — uyumluluk bilgisi göster
          addBotMessage(HOSTING_COMPAT_INFO, 'hostingInfo', { infoBox: true })
        } else {
          // Yok veya bilmiyor — seçenek sun
          addBotMessage(
            value === 'bilmiyor'
              ? 'Hosting, web sitenizin yayında kalmasını sağlayan sunucu hizmetidir — sitenizin "evi". Nasıl ilerlemek istersiniz?'
              : 'Hosting konusunda iki seçeneğiniz var:',
            'hostingChoice',
            {
              buttons: [
                { label: '🛒 Ben kendim alırım', value: 'self' },
                { label: '📦 Siz sağlayın', value: 'provider' },
              ],
            },
          )
        }
        break

      case 'hostingChoice':
        if (value === 'self') {
          // Kendisi alacak — VPS önerileri
          setData((d) => ({ ...d, hostingProvider: 'musteri' }))
          addBotMessage(HOSTING_SELF_INFO, 'hostingInfo', { infoBox: true })
        } else {
          // Biz sağlayacağız — paketleri göster
          addBotMessage(HOSTING_PACKAGES_INFO, 'hostingPackages', {
            buttons: [
              { label: '📦 Starter — 2.650 TL/yıl', value: 'starter' },
              { label: '📦 Business — 4.900 TL/yıl', value: 'business' },
              { label: '📦 Pro — 6.150 TL/yıl', value: 'pro' },
              { label: '🤔 Görüşmede karar veririm', value: 'belirsiz' },
            ],
          })
        }
        break

      case 'hostingPackages':
        setData((d) => ({ ...d, hostingProvider: `vorte-${value}` }))
        addBotMessage('Domain (alan adı) durumunuz nedir?', 'domainStatus', {
          buttons: [
            { label: '✅ Domainim var', value: 'var' },
            { label: '❌ Domainim yok', value: 'yok' },
            { label: '❓ Ne olduğunu bilmiyorum', value: 'bilmiyor' },
          ],
        })
        break

      case 'hostingInfo':
        // Bilgi okundu → domain sorusuna geç
        addBotMessage('Domain (alan adı) durumunuz nedir?', 'domainStatus', {
          buttons: [
            { label: '✅ Domainim var', value: 'var' },
            { label: '❌ Domainim yok', value: 'yok' },
            { label: '❓ Ne olduğunu bilmiyorum', value: 'bilmiyor' },
          ],
        })
        break

      case 'domainStatus':
        setData((d) => ({ ...d, domainStatus: value }))
        if (value !== 'var' && DOMAIN_INFO[value]) {
          addBotMessage(DOMAIN_INFO[value], 'domainInfo', { infoBox: true })
        } else {
          addBotMessage('Projeniz için zamanlamanız nedir?', 'timeline', {
            buttons: [
              { label: '🚀 Acil — 2 hafta içinde', value: 'acil' },
              { label: '📅 1 ay içinde', value: '1-ay' },
              { label: '🗓️ 2-3 ay içinde', value: '2-3-ay' },
              { label: '⏳ Acelem yok, kaliteli olsun', value: 'esnek' },
            ],
          })
        }
        break

      case 'domainInfo':
        addBotMessage('Projeniz için zamanlamanız nedir?', 'timeline', {
          buttons: [
            { label: '🚀 Acil — 2 hafta içinde', value: 'acil' },
            { label: '📅 1 ay içinde', value: '1-ay' },
            { label: '🗓️ 2-3 ay içinde', value: '2-3-ay' },
            { label: '⏳ Acelem yok, kaliteli olsun', value: 'esnek' },
          ],
        })
        break

      case 'timeline':
        setData((d) => ({ ...d, timeline: value }))
        addBotMessage(
          'Eklemek istediğiniz özel bir not veya isteğiniz var mı?',
          'message',
        )
        break
    }
  }

  // ── Çoklu seçim onay ──
  function handleFeaturesConfirm() {
    setData((d) => ({ ...d, features: selectedFeatures }))
    const labels = selectedFeatures.length > 0
      ? selectedFeatures.map((v) => ALL_FEATURES.find((f) => f.value === v)?.label || v).join(', ')
      : 'Seçim yapılmadı'
    setMessages((prev) => [...prev, { role: 'user', text: labels }])

    addBotMessage('Yaklaşık kaç sayfa olmalı?', 'pageCount', {
      buttons: [
        { label: '📄 1-5 Sayfa (Kompakt)', value: '1-5' },
        { label: '📑 5-10 Sayfa (Standart)', value: '5-10' },
        { label: '📚 10+ Sayfa (Kapsamlı)', value: '10+' },
        { label: '🤷 Siz karar verin', value: 'siz-karar-verin' },
      ],
    })
  }

  // ── Feature toggle ──
  function toggleFeature(value: string) {
    setSelectedFeatures((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    )
  }

  // ── Text input submit ──
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const value = inputValue.trim()
    if (!value) return

    setMessages((prev) => [...prev, { role: 'user', text: value }])
    setInputValue('')

    switch (step) {
      case 'firmName':
        setData((d) => ({ ...d, firmName: value }))
        addBotMessage(`Teşekkürler! ${value} için nasıl bir web sitesi düşünüyorsunuz?`, 'siteType', {
          buttons: SITE_TYPES,
        })
        break

      case 'message':
        setData((d) => ({ ...d, message: value }))
        addBotMessage(
          'Son adım! Teklifinizi hazırlayıp size iletebilmemiz için adınızı ve soyadınızı alabilir miyim?',
          'contactName',
        )
        break

      case 'contactName': {
        const name = value.trim()
        if (!name) {
          addBotMessage('Lütfen adınızı ve soyadınızı yazın.', 'contactName')
          return
        }
        setData((d) => ({ ...d, contactName: name }))
        addBotMessage(
          `Teşekkürler ${name}! Şimdi telefon numaranızı alabilir miyim?`,
          'contactPhone',
        )
        break
      }

      case 'contactPhone': {
        const phonePart = value.match(/0[5]\d{2}[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}/)?.[0] || ''

        if (!phonePart) {
          addBotMessage('Lütfen geçerli bir telefon numarası girin. (05XX XXX XX XX)', 'contactPhone')
          return
        }

        setData((d) => ({ ...d, contactPhone: phonePart }))
        addBotMessage(
          `Teşekkürler ${data.contactName}! Teklifinizi e-posta ile de iletmemizi ister misiniz?`,
          'contactEmail',
        )
        break
      }

      case 'contactEmail': {
        const email = value.trim()
        if (email && email.includes('@')) {
          setData((d) => ({ ...d, contactEmail: email }))
          submitForm({ ...data, contactEmail: email })
        } else {
          addBotMessage('Geçerli bir e-posta adresi girebilir misiniz? (örn: isim@firma.com)', 'contactEmail')
        }
        break
      }

      case 'freeQuestion':
        handleFreeQuestion(value)
        break
    }
  }

  // ── "Atla" butonları ──
  function handleSkipMessage() {
    setMessages((prev) => [...prev, { role: 'user', text: 'Atla' }])
    addBotMessage(
      'Son adım! Teklifinizi hazırlayıp size iletebilmemiz için adınızı ve soyadınızı alabilir miyim?',
      'contactName',
    )
  }

  function handleSkipEmail() {
    setMessages((prev) => [...prev, { role: 'user', text: 'Atla' }])
    submitForm(data)
  }

  // ── "Bir sorum var" ──
  function handleOpenFreeQuestion() {
    setPrevStep(step)
    setStep('freeQuestion')
  }

  // ── AI ile serbest soru yanıtla ──
  async function handleFreeQuestion(question: string) {
    setAiLoading(true)
    setIsTyping(true)

    try {
      const res = await fetch('/api/chat-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          firmName: data.firmName || firmName,
          sector,
          city,
          step: prevStep,
        }),
      })
      const json = await res.json()
      const answer = json.answer || 'Sorunuzu not aldım, ekibimiz size dönecek.'

      setFreeQuestions((prev) => [
        ...prev,
        { question, answer, step: stepToNumber(prevStep), timestamp: new Date().toISOString() },
      ])

      setIsTyping(false)
      setMessages((prev) => [...prev, { role: 'assistant', text: answer }])

      setTimeout(() => {
        setStep(prevStep)
      }, 500)
    } catch {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Sorunuzu not aldım, ekibimiz size dönecek. Forma devam edelim mi?' },
      ])
      setFreeQuestions((prev) => [
        ...prev,
        { question, answer: '(Teknik hata — not alındı)', step: stepToNumber(prevStep), timestamp: new Date().toISOString() },
      ])
      setTimeout(() => setStep(prevStep), 500)
    } finally {
      setAiLoading(false)
    }
  }

  // ── Form gönder ──
  async function submitForm(finalData: typeof data) {
    const completedSteps = 10

    let leadId: string | undefined
    if (slug.startsWith('demo-')) {
      const rest = slug.replace('demo-', '')
      const knownTemplates = [
        'dis-klinikleri','veteriner-klinikleri','optik-gozlukcu','fizik-tedavi',
        'tip-merkezleri','estetik-klinik','psikolog-danisma','diyetisyen',
        'isitme-merkezi','goz-merkezi','kuaforler','berberler','guzellik-spa',
        'cilt-bakim','epilasyon','tirnak-studyosu','dovme-piercing','restoranlar',
        'kafeler','pastaneler','firinlar','catering','kasaplar','manavlar',
        'kuruyemisciler','sarkuteri','su-bayileri','oteller','seyahat-acentesi',
        'ozel-okullar','kresler','muzik-kurslari','spor-salonlari','pilates-yoga',
        'oto-galeri','oto-servis','lastikci','oto-egzoz','oto-kaporta','oto-cam',
        'motosiklet-servisi','insaat-firmalari','mimarlik-ofisleri','tadilat-dekorasyon',
        'isi-yalitim','dis-cephe','cati-sistemleri','fayans-seramik','asma-tavan',
        'boya-badana','elektrikci','tesisatci','mermer-granit','parke-zemin',
        'dosemeci','marangoz','cadir-tente','branda','kaynak-demir','bobinaj',
        'matbaalar','ambalaj','plastik-imalat','terzi','tabela-reklam','hukuk-burosu',
        'muhasebe','sigorta','emlak-ofisi','mobilya','elektronik','kirtasiye',
        'pet-shop','cicekci','kuyumcu','tekstil-giyim','spor-malzemeleri',
        'klima-servisi','kombi-servisi','beyaz-esya','asansor','jenerator',
        'guvenlik-sistemleri','cilingir','su-aritma','fotograf-studyosu','temizlik',
        'kuru-temizleme','hali-yikama','nakliyat','organizasyon','ozel-poliklinik',
        'dil-kurslari','etut-merkezleri','surucu-kurslari','oto-yikama','oto-elektrik',
        'oto-yedek-parca','oto-aksesuar','pvc-dograma','aluminyum-dograma',
        'cam-balkon','prefabrik-yapi',
      ].sort((a, b) => b.length - a.length)

      for (const t of knownTemplates) {
        if (rest.startsWith(t + '-')) {
          leadId = rest.slice(t.length + 1)
          break
        }
      }
    }

    try {
      await fetch('/api/chat-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          firmName: finalData.firmName || firmName,
          contactName: finalData.contactName,
          contactPhone: finalData.contactPhone,
          contactEmail: finalData.contactEmail,
          siteType: finalData.siteType,
          features: finalData.features,
          pageCount: finalData.pageCount,
          contentStatus: finalData.contentStatus,
          hostingStatus: finalData.hostingStatus,
          hostingProvider: finalData.hostingProvider,
          domainStatus: finalData.domainStatus,
          domainName: finalData.domainName,
          timeline: finalData.timeline,
          message: finalData.message,
          sector,
          city,
          completedSteps,
          freeQuestions,
          leadId,
        }),
      })
    } catch {
      // Sessiz hata — UX'i bozma
    }

    addBotMessage(
      `Teşekkürler ${finalData.contactName}!\n\nBilgileriniz ekibimize iletildi. 24 saat içinde size özel teklifiniz hazırlanacak ve sizinle iletişime geçeceğiz.\n\nGüzel bir gün dileriz!`,
      'done',
    )
  }

  // ── Progress bar ──
  const progress = step === 'done' ? 100 : (stepToNumber(step) / TOTAL_STEPS) * 100

  // ── Buton gösterilecek mi ──
  const showButtons = !['intro', 'firmName', 'message', 'contactName', 'contactPhone', 'done', 'freeQuestion'].includes(step)
  const showTextInput = ['firmName', 'message', 'contactName', 'contactPhone', 'contactEmail', 'freeQuestion'].includes(step)
  const showFreeQuestionBtn = !['intro', 'done', 'freeQuestion', 'hostingInfo', 'hostingChoice', 'hostingPackages', 'domainInfo'].includes(step)

  // ── Placeholder ──
  const placeholders: Record<string, string> = {
    firmName: 'İşletmenizin adını yazın...',
    message: 'Notunuzu yazın veya "Atla" butonuna basın...',
    contactName: 'Adınız ve soyadınız...',
    contactPhone: '05XX XXX XX XX',
    contactEmail: 'E-posta adresiniz (örn: isim@firma.com)',
    freeQuestion: 'Sorunuzu yazın...',
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Pulse animation style */}
      <style>{pulseKeyframes}</style>

      {/* ── Header ── */}
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <motion.a
            href={`/p/${slug}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </motion.a>

          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-sm font-bold text-white shadow-lg shadow-orange-500/25">
                V
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">Vorte Studio</div>
              <div className="text-xs text-slate-500">Çevrimiçi</div>
            </div>
          </div>

          {/* Progress */}
          <AnimatePresence>
            {step !== 'intro' && step !== 'done' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="ml-auto flex items-center gap-2.5"
              >
                <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                  />
                </div>
                <span className="min-w-[2.5rem] text-right text-xs font-medium text-slate-400">
                  {stepToNumber(step)}/{TOTAL_STEPS}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* ── Chat area ── */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-xl space-y-4">
          {/* Bugün etiketi */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center"
          >
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-400">Bugün</span>
          </motion.div>

          {/* ── Mesajlar ── */}
          <AnimatePresence mode="popLayout">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                layout
              >
                {/* Mesaj balonu */}
                <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {/* Assistant avatar (sadece ilk mesajda veya önceki farklı role ise) */}
                  {msg.role === 'assistant' && (
                    <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-[10px] font-bold text-white">
                      V
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] whitespace-pre-line rounded-2xl px-4 py-3 text-[14px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'rounded-br-sm bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20'
                        : msg.infoBox
                          ? 'rounded-bl-sm border border-blue-200/60 bg-gradient-to-br from-blue-50 to-indigo-50 text-slate-700'
                          : 'rounded-bl-sm bg-white text-slate-700 shadow-sm ring-1 ring-slate-200/60'
                    }`}
                  >
                    {/* Info box ikon */}
                    {msg.infoBox && (
                      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-blue-600">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Bilgilendirme
                      </div>
                    )}
                    {msg.text}
                  </div>
                </div>

                {/* ── Inline butonlar ── */}
                {msg.buttons && i === messages.length - 1 && !msg.multiSelect && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="mt-3 flex flex-wrap gap-2 pl-9"
                  >
                    {msg.buttons.map((btn, bi) => (
                      <motion.button
                        key={btn.value}
                        custom={bi}
                        variants={buttonVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ scale: 1.03, y: -1 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleButtonClick(btn.value, btn.label)}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm transition-colors hover:border-orange-300 hover:bg-orange-50 hover:shadow-md"
                      >
                        {btn.label}
                      </motion.button>
                    ))}
                  </motion.div>
                )}

                {/* ── Multi-select butonlar ── */}
                {msg.multiSelect && i === messages.length - 1 && (() => {
                  const { recommended, others } = getOrderedFeatures(sector)
                  return (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.15 }}
                      className="mt-3 space-y-3 pl-9"
                    >
                      {/* Sektöre özel öneriler */}
                      {recommended.length > 0 && (
                        <>
                          <div className="text-xs font-medium text-orange-600">⭐ Sektörünüze Özel Öneriler</div>
                          <div className="flex flex-wrap gap-2">
                            {recommended.map((f, fi) => {
                              const isSelected = selectedFeatures.includes(f.value)
                              return (
                                <motion.button
                                  key={f.value}
                                  custom={fi}
                                  variants={buttonVariants}
                                  initial="hidden"
                                  animate="visible"
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.96 }}
                                  onClick={() => toggleFeature(f.value)}
                                  className={`relative rounded-xl border px-4 py-2.5 text-sm transition-all ${
                                    isSelected
                                      ? 'border-orange-400 bg-orange-50 text-orange-700 shadow-md shadow-orange-500/10'
                                      : 'border-orange-200 bg-orange-50/30 text-slate-700 hover:border-orange-300 hover:bg-orange-50/50'
                                  }`}
                                >
                                  <span className="flex items-center gap-2">
                                    {isSelected && (
                                      <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} className="h-4 w-4 text-orange-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                      </motion.svg>
                                    )}
                                    {f.label}
                                  </span>
                                </motion.button>
                              )
                            })}
                          </div>
                        </>
                      )}

                      {/* Diğer özellikler */}
                      {others.length > 0 && (
                        <>
                          <div className="text-xs font-medium text-slate-400 pt-1">Diğer Özellikler</div>
                          <div className="flex flex-wrap gap-2">
                            {others.map((f, fi) => {
                              const isSelected = selectedFeatures.includes(f.value)
                              return (
                                <motion.button
                                  key={f.value}
                                  custom={fi}
                                  variants={buttonVariants}
                                  initial="hidden"
                                  animate="visible"
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.96 }}
                                  onClick={() => toggleFeature(f.value)}
                                  className={`relative rounded-xl border px-4 py-2.5 text-sm transition-all ${
                                    isSelected
                                      ? 'border-orange-400 bg-orange-50 text-orange-700 shadow-md shadow-orange-500/10'
                                      : 'border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:bg-orange-50/50'
                                  }`}
                                >
                                  <span className="flex items-center gap-2">
                                    {isSelected && (
                                      <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} className="h-4 w-4 text-orange-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                      </motion.svg>
                                    )}
                                    {f.label}
                                  </span>
                                </motion.button>
                              )
                            })}
                          </div>
                        </>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleFeaturesConfirm}
                        className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-500/25 transition-shadow hover:shadow-xl hover:shadow-orange-500/30"
                      >
                        Devam Et
                        <svg className="ml-2 inline h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </motion.button>
                    </motion.div>
                  )
                })()}

                {/* ── Info box — "Anladım" butonu ── */}
                {msg.infoBox && i === messages.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-3 pl-9"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleButtonClick('anladim', 'Anladım, devam edelim')}
                      className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/25 transition-shadow hover:shadow-xl hover:shadow-blue-500/30"
                    >
                      Anladım, devam edelim
                      <svg className="ml-2 inline h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* ── Typing indicator ── */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-start justify-start"
              >
                <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-[10px] font-bold text-white">
                  V
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-white px-5 py-3.5 shadow-sm ring-1 ring-slate-200/60">
                  <span
                    className="h-2 w-2 rounded-full bg-slate-400"
                    style={{ animation: 'dotPulse 1.4s ease-in-out infinite', animationDelay: '0ms' }}
                  />
                  <span
                    className="h-2 w-2 rounded-full bg-slate-400"
                    style={{ animation: 'dotPulse 1.4s ease-in-out infinite', animationDelay: '200ms' }}
                  />
                  <span
                    className="h-2 w-2 rounded-full bg-slate-400"
                    style={{ animation: 'dotPulse 1.4s ease-in-out infinite', animationDelay: '400ms' }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={chatEndRef} />
        </div>
      </main>

      {/* ── Input area ── */}
      <AnimatePresence mode="wait">
        {showTextInput && (
          <motion.div
            key="text-input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="sticky bottom-0 z-10 border-t border-slate-200/80 bg-white/80 px-4 py-3 backdrop-blur-xl"
          >
            <div className="mx-auto max-w-xl">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  ref={inputRef}
                  type={step === 'contactPhone' ? 'tel' : step === 'contactEmail' ? 'email' : 'text'}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={placeholders[step] ?? 'Yazın...'}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-orange-300 focus:bg-white focus:shadow-lg focus:shadow-orange-500/5 focus:ring-2 focus:ring-orange-100"
                  disabled={aiLoading}
                />
                {(step === 'message' || step === 'contactEmail') && (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={step === 'contactEmail' ? handleSkipEmail : handleSkipMessage}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 transition-colors hover:bg-slate-50"
                  >
                    Atla
                  </motion.button>
                )}
                <motion.button
                  type="submit"
                  disabled={!inputValue.trim() || aiLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 transition-all disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:shadow-none"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </motion.button>
              </form>

              {/* Free question butonu — text input modlarında */}
              {showFreeQuestionBtn && step !== 'freeQuestion' && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  onClick={handleOpenFreeQuestion}
                  className="mt-2 w-full text-center text-xs text-slate-400 transition-colors hover:text-orange-500"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Bir sorum var
                  </span>
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Buton modlarında "Bir sorum var" ── */}
        {showButtons && !showTextInput && (
          <motion.div
            key="button-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="sticky bottom-0 z-10 border-t border-slate-200/80 bg-white/80 px-4 py-3 backdrop-blur-xl"
          >
            <div className="mx-auto max-w-xl text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenFreeQuestion}
                className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-orange-500"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Bir sorum var
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ── Tamamlandı ── */}
        {step === 'done' && (
          <motion.div
            key="done-footer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="sticky bottom-0 z-10 border-t border-slate-200/80 bg-white/80 px-4 py-5 backdrop-blur-xl"
          >
            <div className="mx-auto max-w-xl text-center">
              {/* Kutlama animasyonu */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.4 }}
                className="mb-3 text-4xl"
              >
                🎉
              </motion.div>
              <p className="mb-4 text-sm text-slate-500">Başvurunuz alındı! Demo sayfanıza geri dönebilirsiniz.</p>
              <motion.a
                href={`/p/${slug}`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-6 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Sayfaya Geri Dön
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
