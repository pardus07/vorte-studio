'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getPrimaryGoalButtons, resolvePrimaryGoal } from '@/lib/primary-goal-mapping'
import {
  KVKK_VERSION,
  KVKK_URL,
  KVKK_CONSENT_MESSAGE,
  KVKK_ACCEPT_BUTTON_LABEL,
  KVKK_READ_BUTTON_LABEL,
} from '@/lib/kvkk-constants'
import { getLeadTrace } from '@/lib/utm-capture'

interface Props {
  firmName: string
  city: string
  sector: string
  slug: string
  phone?: string | null
  email?: string | null
  leadId?: string | null
  source?: 'whatsapp' | 'prospect' | 'preview' | 'demo'
}

interface Message {
  role: 'assistant' | 'user'
  text: string
  buttons?: ButtonOption[]
  multiSelect?: 'features' | 'audience'
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
  | 'siteType'
  | 'features'
  | 'pageCount'
  | 'contentStatus'
  | 'hasExistingSite'
  | 'existingSiteUrl'
  | 'hostingStatus'
  | 'hostingProvider'
  | 'hostingPackages'
  | 'domainStatus'
  | 'domainName'
  | 'brandColors'
  | 'timeline'
  | 'targetAudience'
  | 'primaryGoal'
  | 'extraNote'
  | 'kvkkConsent'
  | 'contactConfirm'
  | 'contactName'
  | 'contactPhone'
  | 'contactEmail'
  | 'done'
  | 'freeQuestion'

const TOTAL_STEPS = 14

function stepToNumber(s: Step): number {
  const map: Record<string, number> = {
    siteType: 1, features: 2, pageCount: 3, contentStatus: 4,
    hasExistingSite: 5, existingSiteUrl: 5,
    hostingStatus: 6, hostingProvider: 6, hostingPackages: 6,
    domainStatus: 7, domainName: 7,
    brandColors: 8, timeline: 9, targetAudience: 10,
    primaryGoal: 11, extraNote: 12,
    kvkkConsent: 13,
    contactConfirm: 14, contactName: 14, contactPhone: 14, contactEmail: 14,
  }
  return map[s] || 0
}

// ── Site türleri (havuz) ──
const SITE_TYPE_POOL: Record<string, ButtonOption> = {
  tanitim: { label: '🏢 Kurumsal Tanıtım', value: 'tanitim' },
  randevu: { label: '📅 Randevu & Rezervasyon', value: 'randevu' },
  eticaret: { label: '🛒 E-Ticaret / Online Satış', value: 'eticaret' },
  katalog: { label: '📦 Ürün / Hizmet Kataloğu', value: 'katalog' },
  portfoy: { label: '🏆 Portföy & Referans', value: 'portfoy' },
  menu: { label: '🍽️ Menü & Online Sipariş', value: 'menu' },
}

// Sektör grubuna göre site türü sıralaması
function getSiteTypesForSector(sector: string): ButtonOption[] {
  const group = getSectorGroup(sector)
  const ordering: Record<string, string[]> = {
    saglik: ['randevu', 'tanitim', 'portfoy', 'katalog', 'eticaret'],
    guzellik: ['randevu', 'tanitim', 'portfoy', 'katalog', 'eticaret'],
    spor: ['randevu', 'tanitim', 'portfoy', 'katalog'],
    'yeme-icme': ['menu', 'tanitim', 'randevu'],
    gida: ['katalog', 'eticaret', 'tanitim'],
    perakende: ['eticaret', 'katalog', 'tanitim'],
    konaklama: ['randevu', 'tanitim', 'portfoy'],
    insaat: ['portfoy', 'tanitim', 'katalog'],
    imalat: ['portfoy', 'katalog', 'tanitim'],
    profesyonel: ['tanitim', 'portfoy', 'katalog'],
    egitim: ['tanitim', 'katalog', 'randevu'],
    otomotiv: ['katalog', 'tanitim', 'randevu'],
    'teknik-servis': ['tanitim', 'randevu', 'katalog'],
    diger: ['tanitim', 'katalog', 'portfoy', 'eticaret'],
  }
  const order = ordering[group] || ordering.diger
  return order.map((k) => SITE_TYPE_POOL[k])
}

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
  saglik: ['online-randevu', 'ekip-tanitim', 'fiyat-listesi', 'once-sonra', 'sss', 'whatsapp', 'harita', 'blog', 'yorumlar', 'seo'],
  guzellik: ['online-randevu', 'fiyat-listesi', 'ekip-tanitim', 'once-sonra', 'galeri', 'whatsapp', 'yorumlar', 'sosyal-medya', 'seo'],
  'yeme-icme': ['fiyat-listesi', 'online-siparis', 'rezervasyon', 'galeri', 'whatsapp', 'harita', 'sosyal-medya', 'yorumlar'],
  gida: ['online-siparis', 'fiyat-listesi', 'kampanya', 'whatsapp', 'harita', 'e-bulten', 'yorumlar'],
  konaklama: ['rezervasyon', 'galeri', 'video-galeri', 'fiyat-listesi', 'cok-dilli', 'harita', 'yorumlar', 'seo', 'e-bulten'],
  egitim: ['ekip-tanitim', 'fiyat-listesi', 'teklif-formu', 'sss', 'blog', 'galeri', 'whatsapp', 'harita', 'yorumlar'],
  spor: ['ekip-tanitim', 'fiyat-listesi', 'online-randevu', 'galeri', 'video-galeri', 'whatsapp', 'sosyal-medya', 'yorumlar'],
  otomotiv: ['fiyat-listesi', 'galeri', 'online-randevu', 'teklif-formu', 'whatsapp', 'harita', 'yorumlar', 'seo'],
  insaat: ['portfoy-referans', 'teklif-formu', 'bolge-harita', 'galeri', 'once-sonra', 'whatsapp', 'harita', 'seo'],
  imalat: ['portfoy-referans', 'teklif-formu', 'fiyat-listesi', 'galeri', 'whatsapp', 'harita', 'seo'],
  profesyonel: ['ekip-tanitim', 'sss', 'blog', 'teklif-formu', 'fiyat-listesi', 'whatsapp', 'seo', 'yorumlar'],
  perakende: ['urun-katalogu', 'kampanya', 'fiyat-listesi', 'online-odeme', 'whatsapp', 'harita', 'sosyal-medya', 'e-bulten'],
  'teknik-servis': ['bolge-harita', 'fiyat-listesi', 'teklif-formu', 'online-randevu', 'whatsapp', 'harita', 'yorumlar', 'seo'],
  diger: ['portfoy-referans', 'teklif-formu', 'bolge-harita', 'fiyat-listesi', 'whatsapp', 'harita', 'yorumlar', 'seo'],
}

function getSectorGroup(sector: string): string {
  const s = sector.toLowerCase()
  if (['diş', 'veteriner', 'optik', 'fizik tedavi', 'tıp', 'psikolog', 'diyetisyen', 'estetik klinik', 'poliklinik', 'işitme', 'göz merkezi'].some(k => s.includes(k))) return 'saglik'
  if (['kuaför', 'berber', 'güzellik', 'spa', 'cilt bakım', 'epilasyon', 'tırnak', 'dövme', 'piercing'].some(k => s.includes(k))) return 'guzellik'
  if (['restoran', 'kafe', 'pastane', 'fırın', 'catering', 'yemek'].some(k => s.includes(k))) return 'yeme-icme'
  if (['kasap', 'manav', 'kuruyemiş', 'su bayi', 'şarküteri', 'delikatessen'].some(k => s.includes(k))) return 'gida'
  if (['otel', 'seyahat', 'acente', 'turizm'].some(k => s.includes(k))) return 'konaklama'
  if (['kurs', 'okul', 'kreş', 'etüt', 'sürücü', 'müzik', 'eğitim'].some(k => s.includes(k))) return 'egitim'
  if (['spor salon', 'pilates', 'yoga', 'fitness'].some(k => s.includes(k))) return 'spor'
  if (['oto ', 'oto-', 'lastik', 'motosiklet', 'galeri'].some(k => s.includes(k))) return 'otomotiv'
  if (['inşaat', 'mimar', 'tadilat', 'dekorasyon', 'pvc', 'alüminyum', 'cam balkon', 'mermer', 'cephe', 'yalıtım', 'çatı', 'fayans', 'alçıpan', 'prefabrik', 'boya', 'elektrikçi', 'tesisatçı'].some(k => s.includes(k))) return 'insaat'
  if (['parke', 'döşeme', 'çadır', 'tente', 'branda', 'kaynak', 'demir', 'marangoz', 'bobinaj', 'matbaa', 'ambalaj', 'plastik', 'terzi', 'dikiş'].some(k => s.includes(k))) return 'imalat'
  if (['hukuk', 'avukat', 'muhasebe', 'emlak', 'sigorta'].some(k => s.includes(k))) return 'profesyonel'
  if (['mobilya', 'elektronik', 'kırtasiye', 'pet shop', 'çiçek', 'kuyumcu', 'tekstil', 'giyim', 'spor malzeme', 'mağaza'].some(k => s.includes(k))) return 'perakende'
  if (['klima', 'kombi', 'beyaz eşya', 'asansör', 'jeneratör', 'güvenlik', 'çilingir', 'su arıtma', 'servis'].some(k => s.includes(k))) return 'teknik-servis'
  return 'diger'
}

function getOrderedFeatures(sector: string): { recommended: ButtonOption[], others: ButtonOption[] } {
  const group = getSectorGroup(sector)
  const recommendedKeys = SECTOR_FEATURE_MAP[group] || SECTOR_FEATURE_MAP.diger
  const recommended = ALL_FEATURES.filter(f => recommendedKeys.includes(f.value))
  const others = ALL_FEATURES.filter(f => !recommendedKeys.includes(f.value))
  return { recommended, others }
}

// ── pageCount: siteType'a göre dinamik label, value pricing-uyumlu (1-5/5-10/10+) ──
function getPageCountQuestion(siteType: string): { question: string; buttons: ButtonOption[] } {
  if (siteType === 'eticaret') {
    return {
      question: 'Yaklaşık kaç ürün satacaksınız?',
      buttons: [
        { label: '📦 Küçük Mağaza — 50 ürüne kadar', value: '1-5' },
        { label: '🏬 Orta Mağaza — 50-500 ürün', value: '5-10' },
        { label: '🏭 Büyük Mağaza — 500+ ürün', value: '10+' },
      ],
    }
  }
  if (siteType === 'katalog' || siteType === 'menu') {
    return {
      question: siteType === 'menu' ? 'Menünüzde yaklaşık kaç ürün var?' : 'Katalog boyutunuz ne kadar?',
      buttons: [
        { label: '📋 Küçük — 20 ürüne kadar', value: '1-5' },
        { label: '📚 Standart — 100 ürüne kadar', value: '5-10' },
        { label: '📖 Geniş — 100+ ürün', value: '10+' },
      ],
    }
  }
  // tanitim, randevu, portfoy
  return {
    question: 'Sitenizin kapsamı ne olmalı?',
    buttons: [
      { label: '🪴 Kompakt — 3-5 sayfa', value: '1-5' },
      { label: '🌳 Standart — 6-10 sayfa', value: '5-10' },
      { label: '🏛️ Geniş — 10+ sayfa', value: '10+' },
    ],
  }
}

// ── Hosting paketleri (CLAUDE.md ile uyumlu — TR-VDS kodları gizli) ──
const HOSTING_PACKAGES_INFO = `Hosting paketlerimiz (Türkiye lokasyonlu sunucu, SSL ve kurulum dahil, yıllık):

📦 Starter — 2.490 ₺/yıl
   Küçük tanıtım siteleri için. Tek firma, düşük trafik.

📦 Profesyonel — 4.490 ₺/yıl
   Orta ölçekli siteler, blog, çoklu hizmet sayfası, katalog.

📦 E-Ticaret — 8.190 ₺/yıl
   Online satış, ürün yönetimi, yoğun trafik, ödeme entegrasyonu.

Tüm paketlere SSL, kurulum, bakım ve teknik destek dahildir. Paket seçimini görüşmede birlikte yapacağız.`

const HOSTING_NOT_KNOWN_INFO = `Açıklayalım. Hosting, web sitenizin internet üzerinde yayınlandığı sunucudur. Bizden alabileceğiniz paketler:

📦 Starter — 2.490 ₺/yıl
   Küçük tanıtım siteleri için. Tek firma, düşük trafik.

📦 Profesyonel — 4.490 ₺/yıl
   Orta ölçekli siteler, blog, çoklu hizmet sayfası, katalog.

📦 E-Ticaret — 8.190 ₺/yıl
   Online satış, ürün yönetimi, yoğun trafik, ödeme entegrasyonu.

Hepsine SSL, kurulum, bakım ve teknik destek dahildir.`

// ── Domain bilgi metinleri ──
const DOMAIN_INFO_NEW = `Domain, sitenizin internet adresidir — örneğin firmaadi.com veya firmaadi.com.tr

Güvenilir Türk sağlayıcılar: İsimTescil, Natro, Turhost.

⚠️ Önemli: Domain'i mutlaka kendi firmanız adına kayıt ettirin. Yönlendirmeyi biz yaparız.`

const DOMAIN_INFO_UNKNOWN = `Açıklayalım. Domain, web sitenizin internet adresidir — örneğin firmaadi.com.

Güvenilir Türk sağlayıcılar: İsimTescil, Natro, Turhost.

Görüşmede size adım adım yardımcı olacağız. Domain'i kendi firmanız adına almanız önemlidir.`

// ── Hedef kitle kategorileri ──
const AUDIENCE_CATEGORIES = [
  {
    title: 'Yaş grubu',
    options: [
      { label: '👶 Çocuk & aile', value: 'cocuk-aile' },
      { label: '🎓 Gençler (18-30)', value: 'genc' },
      { label: '💼 Yetişkinler (30-55)', value: 'yetiskin' },
      { label: '🌿 Yaşlılar (55+)', value: 'yasli' },
    ],
  },
  {
    title: 'Müşteri tipi',
    options: [
      { label: '🏠 Bireysel müşteriler', value: 'bireysel' },
      { label: '🏢 Kurumsal / işletme', value: 'kurumsal' },
    ],
  },
  {
    title: 'Hizmet bölgesi',
    options: [
      { label: '📍 Sadece yerel (semt/ilçe)', value: 'yerel' },
      { label: '🏙️ Şehir geneli', value: 'sehir' },
      { label: '🇹🇷 Türkiye geneli', value: 'turkiye' },
      { label: '🌍 Uluslararası', value: 'uluslararasi' },
    ],
  },
]

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

// ── Renk paleti ──
const COLOR_PALETTE = [
  '#E53E3E', '#C53030', '#FF4500', '#F97316', '#EA580C', '#DC2626',
  '#EC4899', '#D946EF', '#A855F7', '#8B5CF6', '#7C3AED', '#9333EA',
  '#3B82F6', '#2563EB', '#1D4ED8', '#0EA5E9', '#06B6D4', '#0891B2',
  '#22C55E', '#16A34A', '#15803D', '#10B981', '#059669', '#14B8A6',
  '#EAB308', '#F59E0B', '#D97706', '#FBBF24', '#F5A623', '#FFD700',
  '#1A1A1A', '#374151', '#4B5563', '#6B7280', '#9CA3AF', '#D1D5DB',
  '#800020', '#8B4513', '#92400E', '#78350F', '#451A03', '#7C2D12',
  '#FFFFFF', '#F8FAFC', '#FEF3C7', '#DBEAFE', '#D1FAE5', '#FCE7F3',
]

const pulseKeyframes = `
@keyframes dotPulse {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}
`

// Telefon normalizasyonu — +90, 0, boşluklu, tireli, noktalı hepsini kabul
function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '')
  // 905xxxxxxxxx (12 hane)
  if (digits.length === 12 && digits.startsWith('905')) return '0' + digits.slice(2)
  // 05xxxxxxxxx (11 hane)
  if (digits.length === 11 && digits.startsWith('05')) return digits
  // 5xxxxxxxxx (10 hane)
  if (digits.length === 10 && digits.startsWith('5')) return '0' + digits
  return null
}

export default function ChatForm({ firmName, city, sector, slug, phone, email, leadId, source = 'prospect' }: Props) {
  // ── State ──
  const [messages, setMessages] = useState<Message[]>([])
  const [step, setStep] = useState<Step>('intro')
  const [prevStep, setPrevStep] = useState<Step>('intro')
  const [isTyping, setIsTyping] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  // Toplanan veriler
  const [data, setData] = useState({
    firmName: firmName,
    siteType: '',
    features: [] as string[],
    pageCount: '',
    contentStatus: '',
    hostingStatus: '',
    hostingProvider: '',
    domainStatus: '',
    domainName: '',
    timeline: '',
    targetAudience: [] as string[],
    primaryGoal: '',
    brandColors: [] as string[],
    existingSiteUrl: '',
    message: '',
    contactName: '',
    contactPhone: phone || '',
    contactEmail: email || '',
    kvkkAcceptedAt: '' as string,
    kvkkVersion: '' as string,
  })

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedAudience, setSelectedAudience] = useState<string[]>([])
  const [freeQuestions, setFreeQuestions] = useState<FreeQuestion[]>([])

  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Otomatik scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Input focus
  useEffect(() => {
    if (['existingSiteUrl', 'hostingProvider', 'domainName', 'extraNote', 'contactName', 'contactPhone', 'contactEmail', 'freeQuestion'].includes(step)) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [step])

  // Bot mesajı ekle
  const addBotMessage = useCallback(
    (text: string, nextStep: Step, options?: { buttons?: ButtonOption[]; multiSelect?: 'features' | 'audience'; infoBox?: boolean }) => {
      setIsTyping(true)
      const delay = Math.min(500 + text.length * 2, 1200)
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

  // ── İlk mesajlar (firma adı prop'tan, sorulmaz) ──
  useEffect(() => {
    const t1 = setTimeout(() => {
      setMessages([
        {
          role: 'assistant',
          text: `Merhaba 👋 Ben Vorte Studio'dan size özel teklifinizi hazırlayacağım.`,
        },
      ])
    }, 300)

    const t2 = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `${firmName} için ${city}'da ${sector.toLowerCase()} sektörüne özel bir web sitesi planlayacağız. Yaklaşık 90 saniye sürer.`,
        },
      ])
    }, 1200)

    const t3 = setTimeout(() => {
      const siteTypes = getSiteTypesForSector(sector)
      addBotMessage('Nasıl bir web sitesi düşünüyorsunuz?', 'siteType', { buttons: siteTypes })
    }, 2100)

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Buton tıklama ──
  function handleButtonClick(value: string, label: string) {
    setMessages((prev) => [...prev, { role: 'user', text: label }])

    switch (step) {
      case 'siteType': {
        setData((d) => ({ ...d, siteType: value }))
        addBotMessage(
          'Harika seçim. Sitenizde bulunmasını istediğiniz özellikleri seçelim.',
          'features',
          { multiSelect: 'features' },
        )
        break
      }

      case 'pageCount': {
        setData((d) => ({ ...d, pageCount: value }))
        addBotMessage(
          'Not aldım. İçeriklerinizi birlikte değerlendirelim.',
          'contentStatus',
          {
            buttons: [
              { label: '✅ Hepsi hazır (metin + görsel + logo)', value: 'hazir' },
              { label: '📝 Metinler var, görsel/logo yok', value: 'kismen-metin' },
              { label: '📸 Görseller var, metinler yok', value: 'kismen-gorsel' },
              { label: '🎨 Hiçbiri yok, sizden bekliyorum', value: 'yok' },
            ],
          },
        )
        break
      }

      case 'contentStatus': {
        setData((d) => ({ ...d, contentStatus: value }))
        const intro =
          value === 'hazir'
            ? 'Mükemmel, işimiz kolay.'
            : value === 'yok'
              ? 'İçerik üretimini de biz üstlenebiliriz.'
              : 'Eksik kısımları birlikte tamamlayacağız.'
        addBotMessage(
          `${intro} Şu an çalışan bir web siteniz var mı?`,
          'hasExistingSite',
          {
            buttons: [
              { label: '✅ Var, yenilemek istiyorum', value: 'var' },
              { label: '❌ Hayır, ilk sitem olacak', value: 'yok' },
            ],
          },
        )
        break
      }

      case 'hasExistingSite': {
        if (value === 'var') {
          addBotMessage(
            'Mevcut sitenizin adresini yazar mısınız? Görüşmede referans olarak inceleyeceğiz.',
            'existingSiteUrl',
          )
        } else {
          addBotMessage(
            'Anladım, yepyeni bir başlangıç yapacağız. Hosting (sunucu) durumunuzu öğrenelim.',
            'hostingStatus',
            {
              buttons: [
                { label: '🖥️ Mevcut hostingim var', value: 'var' },
                { label: '🛒 Hosting de sizden almak istiyorum', value: 'sizden' },
                { label: '❓ Hosting nedir bilmiyorum', value: 'bilmiyor' },
              ],
            },
          )
        }
        break
      }

      case 'hostingStatus': {
        setData((d) => ({ ...d, hostingStatus: value }))
        if (value === 'var') {
          addBotMessage(
            'Hangi hosting firmasını kullanıyorsunuz?\n\nSitelerimiz Node.js destekli VPS veya Cloud sunucu gerektirir. Uyumluluğu birlikte kontrol ederiz.',
            'hostingProvider',
          )
        } else if (value === 'sizden') {
          addBotMessage(HOSTING_PACKAGES_INFO, 'hostingPackages', { infoBox: true })
        } else {
          addBotMessage(HOSTING_NOT_KNOWN_INFO, 'hostingPackages', { infoBox: true })
        }
        break
      }

      case 'hostingPackages': {
        // info box'tan gelen "anladim" — domain'e geç
        addBotMessage(
          'Domain (alan adı) durumunuz nedir?',
          'domainStatus',
          {
            buttons: [
              { label: '✅ Kendi domainim var', value: 'var' },
              { label: '🛒 Yeni domain almak istiyorum', value: 'yok' },
              { label: '❓ Domain nedir bilmiyorum', value: 'bilmiyor' },
            ],
          },
        )
        break
      }

      case 'domainStatus': {
        setData((d) => ({ ...d, domainStatus: value }))
        if (value === 'var') {
          addBotMessage('Domain adresinizi yazar mısınız?', 'domainName')
        } else if (value === 'yok') {
          addBotMessage(DOMAIN_INFO_NEW, 'domainName', { infoBox: true })
        } else {
          addBotMessage(DOMAIN_INFO_UNKNOWN, 'domainName', { infoBox: true })
        }
        break
      }

      case 'domainName': {
        // info box'tan gelen "anladim" — brandColors'a geç
        addBotMessage(
          'Görsel tasarım zevkinizi öğrenelim. Markanızda öne çıkan renkleri seçin.',
          'brandColors',
        )
        break
      }

      case 'timeline': {
        setData((d) => ({ ...d, timeline: value }))
        addBotMessage(
          'Teşekkürler. Sitenizin hangi kitleye hitap etmesini istersiniz? İlgili tüm seçenekleri işaretleyin.',
          'targetAudience',
          { multiSelect: 'audience' },
        )
        break
      }

      case 'primaryGoal': {
        setData((d) => ({ ...d, primaryGoal: value }))
        addBotMessage(
          'Anladım, bu hedef doğrultusunda planlayacağız. Eklemek istediğiniz özel bir not var mı?\n\nÖrn: özel bir istek, vurgulanması gereken bir bilgi, beğendiğiniz bir referans site...',
          'extraNote',
        )
        break
      }

      case 'kvkkConsent': {
        if (value === 'read') {
          // Aydınlatma metni yeni sekmede açıldı; kullanıcı onayı hâlâ bekleniyor.
          // Aynı adımda kalınır, butonlar tekrar gösterilir.
          if (typeof window !== 'undefined') {
            window.open(KVKK_URL, '_blank', 'noopener,noreferrer')
          }
          addBotMessage(
            'Aydınlatma metnini yeni sekmede açtım. Okuduktan sonra kabul ediyorsanız devam edelim.',
            'kvkkConsent',
            {
              buttons: [
                { label: KVKK_ACCEPT_BUTTON_LABEL, value: 'onay' },
              ],
            },
          )
          return
        }
        if (value === 'onay') {
          const acceptedAt = new Date().toISOString()
          setData((d) => ({
            ...d,
            kvkkAcceptedAt: acceptedAt,
            kvkkVersion: KVKK_VERSION,
          }))
          proceedToContactAfterKvkk()
        }
        break
      }

      case 'contactConfirm': {
        if (value === 'onay') {
          // WA'dan gelen telefon onaylandı, contactName'e geç
          addBotMessage('Size nasıl hitap edelim? Adınız ve soyadınız.', 'contactName')
        } else {
          // Başka numara → contactPhone input
          addBotMessage('Size ulaşabileceğimiz telefon numarası?', 'contactPhone')
        }
        break
      }
    }
  }

  // ── Çoklu seçim onay (features) ──
  function handleFeaturesConfirm() {
    setData((d) => ({ ...d, features: selectedFeatures }))
    const labels = selectedFeatures.length > 0
      ? selectedFeatures.map((v) => ALL_FEATURES.find((f) => f.value === v)?.label || v).join(', ')
      : 'Özellikleri görüşmede konuşalım'
    setMessages((prev) => [...prev, { role: 'user', text: labels }])

    const intro = selectedFeatures.length > 0
      ? `${selectedFeatures.length} özellik seçtiniz. Şimdi projenizin boyutunu konuşalım.`
      : 'Anladım, görüşmede birlikte belirleyelim. Şimdi projenizin boyutunu konuşalım.'

    setTimeout(() => {
      const pq = getPageCountQuestion(data.siteType)
      addBotMessage(`${intro}\n\n${pq.question}`, 'pageCount', { buttons: pq.buttons })
    }, 200)
  }

  // ── Çoklu seçim onay (audience) ──
  function handleAudienceConfirm() {
    setData((d) => ({ ...d, targetAudience: selectedAudience }))
    const allOpts = AUDIENCE_CATEGORIES.flatMap((c) => c.options)
    const labels = selectedAudience.length > 0
      ? selectedAudience.map((v) => allOpts.find((o) => o.value === v)?.label || v).join(', ')
      : 'Görüşmede konuşalım'
    setMessages((prev) => [...prev, { role: 'user', text: labels }])

    const intro = selectedAudience.length > 0
      ? 'Anladım, hedef kitlenizi not aldım.'
      : 'Sorun değil, görüşmede netleştireceğiz.'

    setTimeout(() => {
      addBotMessage(
        `${intro} Son birkaç soru kaldı 🙌\n\nBu siteyle birincil hedefiniz ne? (Tek seçim)`,
        'primaryGoal',
        { buttons: getPrimaryGoalButtons() },
      )
    }, 200)
  }

  function toggleFeature(value: string) {
    setSelectedFeatures((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    )
  }

  function toggleAudience(value: string) {
    setSelectedAudience((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    )
  }

  // ── Akıllı contact başlangıcı ──
  // KVKK açık rıza adımından (kvkkConsent) sonra contactConfirm/contactName'e yönlendirir.
  function startContactFlow() {
    addBotMessage(
      KVKK_CONSENT_MESSAGE,
      'kvkkConsent',
      {
        buttons: [
          { label: KVKK_ACCEPT_BUTTON_LABEL, value: 'onay' },
          { label: KVKK_READ_BUTTON_LABEL, value: 'read' },
        ],
      },
    )
  }

  // KVKK onayı alındıktan sonra iletişim akışına devam eder.
  // (Eski startContactFlow'un WhatsApp/non-WhatsApp ayrım mantığı buraya taşındı.)
  function proceedToContactAfterKvkk() {
    if (source === 'whatsapp' && phone) {
      addBotMessage(
        `Teşekkürler. Şimdi iletişim bilgilerinizi teyit edelim.\n\nTeklifinizi ${phone} numarasına WhatsApp üzerinden iletelim. Bu numara doğru mu?`,
        'contactConfirm',
        {
          buttons: [
            { label: '✅ Evet, bu numara doğru', value: 'onay' },
            { label: '📱 Başka bir numara kullanmak istiyorum', value: 'baska' },
          ],
        },
      )
    } else {
      addBotMessage(
        'Teşekkürler. Size nasıl hitap edelim? Adınız ve soyadınız.',
        'contactName',
      )
    }
  }

  // ── Text input submit ──
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const value = inputValue.trim()
    if (!value) return

    setMessages((prev) => [...prev, { role: 'user', text: value }])
    setInputValue('')

    switch (step) {
      case 'existingSiteUrl': {
        setData((d) => ({ ...d, existingSiteUrl: value }))
        addBotMessage(
          'Not aldım. Hosting (sunucu) durumunuzu öğrenelim.',
          'hostingStatus',
          {
            buttons: [
              { label: '🖥️ Mevcut hostingim var', value: 'var' },
              { label: '🛒 Hosting de sizden almak istiyorum', value: 'sizden' },
              { label: '❓ Hosting nedir bilmiyorum', value: 'bilmiyor' },
            ],
          },
        )
        break
      }

      case 'hostingProvider': {
        setData((d) => ({ ...d, hostingProvider: value }))
        addBotMessage(
          'Teşekkürler, görüşmede uyumluluğunu birlikte kontrol edelim. Domain (alan adı) durumunuz nedir?',
          'domainStatus',
          {
            buttons: [
              { label: '✅ Kendi domainim var', value: 'var' },
              { label: '🛒 Yeni domain almak istiyorum', value: 'yok' },
              { label: '❓ Domain nedir bilmiyorum', value: 'bilmiyor' },
            ],
          },
        )
        break
      }

      case 'domainName': {
        setData((d) => ({ ...d, domainName: value }))
        addBotMessage(
          'Not aldım. Görsel tasarım zevkinizi öğrenelim. Markanızda öne çıkan renkleri seçin.',
          'brandColors',
        )
        break
      }

      case 'extraNote': {
        setData((d) => ({ ...d, message: value }))
        startContactFlow()
        break
      }

      case 'contactName': {
        const name = value.trim()
        if (!name) {
          addBotMessage('Lütfen adınızı ve soyadınızı yazar mısınız?', 'contactName')
          return
        }
        setData((d) => ({ ...d, contactName: name }))
        // WA'dan onaylandıysa direkt email'e geç, değilse phone iste
        if (source === 'whatsapp' && phone && data.contactPhone === phone) {
          addBotMessage(
            'E-posta adresiniz? Teklifi PDF olarak da göndermek için.',
            'contactEmail',
          )
        } else {
          addBotMessage(
            'Size ulaşabileceğimiz telefon numarası?',
            'contactPhone',
          )
        }
        break
      }

      case 'contactPhone': {
        const normalized = normalizePhone(value)
        if (!normalized) {
          addBotMessage(
            'Numarayı doğrulayamadım. 10 haneli cep telefonu numaranızı yazar mısınız? (örn: 05XX XXX XX XX)',
            'contactPhone',
          )
          return
        }
        setData((d) => ({ ...d, contactPhone: normalized }))
        addBotMessage(
          'E-posta adresiniz? Teklifi PDF olarak da göndermek için.',
          'contactEmail',
        )
        break
      }

      case 'contactEmail': {
        const emailVal = value.trim()
        if (emailVal && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
          setData((d) => ({ ...d, contactEmail: emailVal }))
          submitForm({ ...data, contactEmail: emailVal })
        } else {
          addBotMessage(
            'E-posta adresi geçerli görünmüyor. Kontrol edip tekrar dener misiniz? Veya "E-posta istemiyorum" butonuna basabilirsiniz.',
            'contactEmail',
          )
        }
        break
      }

      case 'freeQuestion':
        handleFreeQuestion(value)
        break
    }
  }

  // ── "Atla" butonları ──
  function handleSkipExistingSite() {
    setMessages((prev) => [...prev, { role: 'user', text: 'Bu adımı atla' }])
    addBotMessage(
      'Sorun değil. Hosting (sunucu) durumunuzu öğrenelim.',
      'hostingStatus',
      {
        buttons: [
          { label: '🖥️ Mevcut hostingim var', value: 'var' },
          { label: '🛒 Hosting de sizden almak istiyorum', value: 'sizden' },
          { label: '❓ Hosting nedir bilmiyorum', value: 'bilmiyor' },
        ],
      },
    )
  }

  function handleSkipHostingProvider() {
    setMessages((prev) => [...prev, { role: 'user', text: 'Bilmiyorum, siz kontrol edin' }])
    addBotMessage(
      'Tamam, görüşmede uyumluluğu kontrol ederiz. Domain (alan adı) durumunuz nedir?',
      'domainStatus',
      {
        buttons: [
          { label: '✅ Kendi domainim var', value: 'var' },
          { label: '🛒 Yeni domain almak istiyorum', value: 'yok' },
          { label: '❓ Domain nedir bilmiyorum', value: 'bilmiyor' },
        ],
      },
    )
  }

  function handleSkipDomainName() {
    setMessages((prev) => [...prev, { role: 'user', text: 'Henüz kesinleşmedi' }])
    addBotMessage(
      'Not aldım. Görsel tasarım zevkinizi öğrenelim. Markanızda öne çıkan renkleri seçin.',
      'brandColors',
    )
  }

  function handleSkipExtraNote() {
    setMessages((prev) => [...prev, { role: 'user', text: 'Notum yok, devam edelim' }])
    startContactFlow()
  }

  function handleSkipEmail() {
    setMessages((prev) => [...prev, { role: 'user', text: 'E-posta istemiyorum' }])
    submitForm(data)
  }

  // ── "Bir sorum var" ──
  function handleOpenFreeQuestion() {
    setPrevStep(step)
    setStep('freeQuestion')
  }

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
    const completedSteps = TOTAL_STEPS

    // Birincil hedef → businessGoals + seoExpectations çift mapping
    const goalMapping = resolvePrimaryGoal(finalData.primaryGoal)

    try {
      const res = await fetch('/api/chat-submit', {
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
          targetAudience: finalData.targetAudience.join(', '),
          brandColors: finalData.brandColors.length > 0 ? finalData.brandColors.join(',') : '',
          existingSiteUrl: finalData.existingSiteUrl,
          message: finalData.message,
          businessGoals: goalMapping?.businessGoals || null,
          seoExpectations: goalMapping?.seoExpectations || null,
          sector,
          city,
          completedSteps,
          freeQuestions,
          leadId,
          source,
          kvkkAcceptedAt: finalData.kvkkAcceptedAt,
          kvkkVersion: finalData.kvkkVersion,
          // Sprint 3.5 — attribution trace (UTM + referrer + sayfa)
          trace: getLeadTrace(`chat:${slug}`),
        }),
      })

      if (res.status === 429) {
        addBotMessage(
          'Bilgilerinizi aldık ancak sistem koruması nedeniyle şu an işleme alamadık. Lütfen 1 saat sonra tekrar deneyin veya doğrudan info@vortestudio.com adresine yazabilirsiniz.',
          'done',
        )
        return
      }

      // Paket önerisini response'tan al (saf fonksiyon, server'da hesaplanır)
      let suggestedName: string | null = null
      try {
        const json = await res.json()
        suggestedName = json?.suggestedPackage?.name || null
      } catch {
        // JSON parse hatası — paket önerisi olmadan devam
      }

      const channel = source === 'whatsapp' ? 'WhatsApp' : 'iletişim kanallarınız'
      const packageLine = suggestedName
        ? `\n\nİhtiyaçlarınıza göre "${suggestedName}" paketimiz uygun görünüyor. Kesin fiyat ve detayları görüşmemizde paylaşacağız.`
        : ''

      addBotMessage(
        `Harika, ${finalData.contactName}! 🎉\n\nBilgileriniz ekibimize iletildi. 24 saat içinde size özel hazırlanmış teklifinizi ${channel} üzerinden paylaşacağız.${packageLine}\n\nSizi aramızda görmek isteriz.\n\n— Vorte Studio`,
        'done',
      )
      return
    } catch {
      addBotMessage(
        `Bilgileriniz kaydedildi ${finalData.contactName ? finalData.contactName + ', ' : ''}ekibimiz 24 saat içinde size ulaşacak. Acil durumlar için: info@vortestudio.com`,
        'done',
      )
      return
    }
  }

  // ── Progress bar ──
  const progress = step === 'done' ? 100 : (stepToNumber(step) / TOTAL_STEPS) * 100

  // ── Buton/input gösterim koşulları ──
  const showTextInput = ['existingSiteUrl', 'hostingProvider', 'domainName', 'extraNote', 'contactName', 'contactPhone', 'contactEmail', 'freeQuestion'].includes(step)
  const showButtons = !showTextInput && !['intro', 'features', 'targetAudience', 'brandColors', 'done', 'freeQuestion'].includes(step)
  const showFreeQuestionBtn = !['intro', 'done', 'freeQuestion', 'hostingPackages', 'domainName'].includes(step)

  // brandColors → timeline geçişi (color picker onayında tetiklenir)
  function handleColorsConfirm() {
    setData((d) => ({ ...d, brandColors: selectedColors }))
    const label = selectedColors.length > 0
      ? `Seçilen renkler: ${selectedColors.join(', ')}`
      : 'Rengi görüşmede belirleyelim'
    setMessages((prev) => [...prev, { role: 'user', text: label }])

    const intro = selectedColors.length > 0
      ? `${selectedColors.length} renk not edildi.`
      : 'Sorun değil, rengi birlikte belirleyeceğiz.'

    setTimeout(() => {
      addBotMessage(
        `${intro} Siteyi ne zaman yayında görmek istersiniz?`,
        'timeline',
        {
          buttons: [
            { label: '🚀 Mümkün olan en kısa sürede', value: 'acil' },
            { label: '📅 2-4 hafta içinde', value: '1-ay' },
            { label: '🗓️ 1-2 ay içinde', value: '2-3-ay' },
            { label: '🌿 Acele etmiyorum, kalite önemli', value: 'esnek' },
          ],
        },
      )
    }, 200)
  }

  // ── Placeholder ──
  const placeholders: Record<string, string> = {
    existingSiteUrl: 'www.firmaadi.com',
    hostingProvider: 'Örn: Natro VPS, Hetzner, Contabo...',
    domainName: 'firmaadi.com',
    extraNote: 'Notunuzu yazın veya bu adımı atlayın...',
    contactName: 'Ad Soyad',
    contactPhone: '05XX XXX XX XX veya +90 5XX XXX XX XX',
    contactEmail: 'isim@firma.com',
    freeQuestion: 'Sorunuzu yazın...',
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <style>{pulseKeyframes}</style>

      {/* ── Header ── */}
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <motion.a
            href={`/demo/${slug}`}
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center"
          >
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-400">Bugün</span>
          </motion.div>

          <AnimatePresence mode="popLayout">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                layout
              >
                <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
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

                {/* ── Multi-select: features ── */}
                {msg.multiSelect === 'features' && i === messages.length - 1 && (() => {
                  const { recommended, others } = getOrderedFeatures(sector)
                  return (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.15 }}
                      className="mt-3 space-y-3 pl-9"
                    >
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

                      {others.length > 0 && (
                        <>
                          <div className="pt-1 text-xs font-medium text-slate-400">Diğer Özellikler</div>
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
                        ✓ Seçimi Onayla
                        <svg className="ml-2 inline h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </motion.button>
                    </motion.div>
                  )
                })()}

                {/* ── Multi-select: audience ── */}
                {msg.multiSelect === 'audience' && i === messages.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="mt-3 space-y-4 pl-9"
                  >
                    {AUDIENCE_CATEGORIES.map((cat) => (
                      <div key={cat.title} className="space-y-2">
                        <div className="text-xs font-medium text-slate-500">{cat.title}</div>
                        <div className="flex flex-wrap gap-2">
                          {cat.options.map((opt, oi) => {
                            const isSelected = selectedAudience.includes(opt.value)
                            return (
                              <motion.button
                                key={opt.value}
                                custom={oi}
                                variants={buttonVariants}
                                initial="hidden"
                                animate="visible"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => toggleAudience(opt.value)}
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
                                  {opt.label}
                                </span>
                              </motion.button>
                            )
                          })}
                        </div>
                      </div>
                    ))}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleAudienceConfirm}
                      className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-500/25 transition-shadow hover:shadow-xl hover:shadow-orange-500/30"
                    >
                      ✓ Seçimi Tamamla
                      <svg className="ml-2 inline h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </motion.button>
                  </motion.div>
                )}

                {/* ── Renk Paleti Seçici ── */}
                {step === 'brandColors' && i === messages.length - 1 && !msg.buttons && !msg.multiSelect && msg.role === 'assistant' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="mt-3 space-y-3 pl-9"
                  >
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="grid grid-cols-8 gap-1.5 sm:gap-2">
                        {COLOR_PALETTE.map((hex) => {
                          const isSelected = selectedColors.includes(hex)
                          const isLight = parseInt(hex.replace('#', ''), 16) > 0xcccccc
                          return (
                            <button
                              key={hex}
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedColors((prev) => prev.filter((c) => c !== hex))
                                } else if (selectedColors.length < 5) {
                                  setSelectedColors((prev) => [...prev, hex])
                                }
                              }}
                              className={`relative aspect-square rounded-lg transition-all ${
                                isSelected
                                  ? 'z-10 scale-110 ring-2 ring-orange-500 ring-offset-2'
                                  : 'hover:scale-105 hover:ring-1 hover:ring-slate-300'
                              } ${selectedColors.length >= 5 && !isSelected ? 'cursor-not-allowed opacity-40' : ''}`}
                              style={{ backgroundColor: hex, border: isLight ? '1px solid #e2e8f0' : 'none' }}
                              title={hex}
                              disabled={selectedColors.length >= 5 && !isSelected}
                            >
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute inset-0 flex items-center justify-center"
                                >
                                  <svg className={`h-4 w-4 ${isLight ? 'text-slate-800' : 'text-white'}`} fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </motion.div>
                              )}
                            </button>
                          )
                        })}
                      </div>

                      {selectedColors.length > 0 && (
                        <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3">
                          <span className="text-xs text-slate-400">Seçilen:</span>
                          {selectedColors.map((hex) => (
                            <div key={hex} className="flex items-center gap-1">
                              <div
                                className="h-6 w-6 rounded-md border border-slate-200"
                                style={{ backgroundColor: hex }}
                              />
                              <span className="font-mono text-[10px] text-slate-400">{hex}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <p className="mt-2 text-center text-xs text-slate-400">
                        En az 2, en çok 5 renk seçin
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleColorsConfirm}
                      disabled={selectedColors.length < 2}
                      className={`rounded-xl px-6 py-2.5 text-sm font-medium text-white shadow-lg transition-all ${
                        selectedColors.length >= 2
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30'
                          : 'cursor-not-allowed bg-slate-300 shadow-none'
                      }`}
                    >
                      ✓ Renk Seçimini Tamamla ({selectedColors.length}/5)
                    </motion.button>
                  </motion.div>
                )}

                {/* ── Info box "Anladım" butonu ── */}
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
                  <span className="h-2 w-2 rounded-full bg-slate-400" style={{ animation: 'dotPulse 1.4s ease-in-out infinite', animationDelay: '0ms' }} />
                  <span className="h-2 w-2 rounded-full bg-slate-400" style={{ animation: 'dotPulse 1.4s ease-in-out infinite', animationDelay: '200ms' }} />
                  <span className="h-2 w-2 rounded-full bg-slate-400" style={{ animation: 'dotPulse 1.4s ease-in-out infinite', animationDelay: '400ms' }} />
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

                {/* Adıma özel "Atla" butonu */}
                {step === 'existingSiteUrl' && (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSkipExistingSite}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 transition-colors hover:bg-slate-50"
                  >
                    Atla
                  </motion.button>
                )}
                {step === 'hostingProvider' && (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSkipHostingProvider}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 transition-colors hover:bg-slate-50"
                  >
                    Bilmiyorum
                  </motion.button>
                )}
                {step === 'domainName' && (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSkipDomainName}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 transition-colors hover:bg-slate-50"
                  >
                    Atla
                  </motion.button>
                )}
                {step === 'extraNote' && (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSkipExtraNote}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 transition-colors hover:bg-slate-50"
                  >
                    Atla
                  </motion.button>
                )}
                {step === 'contactEmail' && (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSkipEmail}
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

              {/* KVKK açık rıza 'kvkkConsent' adımında pozitif aksiyonla alınıyor.
                  Bu noktada onay zaten verilmiş durumda — implied consent metni kaldırıldı. */}
            </div>
          </motion.div>
        )}

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

        {step === 'done' && (
          <motion.div
            key="done-footer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="sticky bottom-0 z-10 border-t border-slate-200/80 bg-white/80 px-4 py-5 backdrop-blur-xl"
          >
            <div className="mx-auto max-w-xl text-center">
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
                href={`/demo/${slug}`}
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
