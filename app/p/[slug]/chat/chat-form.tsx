'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

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
  | 'domainStatus'
  | 'domainInfo'
  | 'timeline'
  | 'message'
  | 'contact'
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

// ── Özellik seçenekleri ──
const FEATURES: ButtonOption[] = [
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
]

// ── Hosting bilgi metinleri ──
const HOSTING_INFO: Record<string, string> = {
  var: `Harika! Mevcut hostinginizin uyumluluğunu kontrol edelim.

Web sitelerimiz Next.js teknolojisi ile yapılır. Bunun için:

✅ Node.js 20+ destekli VPS veya Cloud sunucu
✅ PostgreSQL veritabanı
✅ Docker desteği
✅ En az 1 vCPU + 1GB RAM

❌ cPanel'li shared hosting uygun değildir
❌ Sadece WordPress destekleyen sunucular uygun değildir

Mevcut hostinginiz bu özelliklere sahip değilse endişelenmeyin — size uygun fiyatlı hosting paketlerimiz mevcut.`,

  yok: `Hosting konusunda endişelenmeyin — size uygun paketlerimiz var.

Kendiniz almak isterseniz Türkiye lokasyonlu VPS önerilerimiz:

• Hetzner Cloud — CX22 (~€4.5/ay)
• Contabo İstanbul — VPS S (~€6/ay)
• Turhost / Natro VPS planları

⚠️ Önemli: cPanel'li shared hosting ALMAYIN. "VPS" veya "Cloud Server" kategorisinden seçin.

Veya biz sizin için barındırma yapabiliriz — ekibimiz detayları paylaşacak.`,

  bilmiyor: `Hosting, web sitenizin yayında kalmasını sağlayan sunucu hizmetidir. Bir nevi sitenizin "evi".

Endişelenmenize gerek yok — iki seçeneğiniz var:

1. Biz barındırırız — her şeyi biz hallederiz, siz sadece sitenizi kullanırsınız
2. Siz alırsınız — size uygun sunucuyu önerir, kurulumu yaparız

Detayları görüşmede konuşuruz.`,
}

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

export default function ChatForm({ firmName, city, sector, slug }: Props) {
  // ── State ──
  const [messages, setMessages] = useState<Message[]>([])
  const [step, setStep] = useState<Step>('intro')
  const [prevStep, setPrevStep] = useState<Step>('intro') // free question sonrası dönüş
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
    if (step === 'firmName' || step === 'message' || step === 'contact' || step === 'freeQuestion') {
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
          text: `Merhaba! 👋 ${firmName} için özel bir web sitesi teklifi hazırlayalım.`,
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
    // Kullanıcı mesajı ekle
    setMessages((prev) => [...prev, { role: 'user', text: label }])

    switch (step) {
      case 'siteType':
        setData((d) => ({ ...d, siteType: value }))
        addBotMessage(
          'Sitenizde hangi özellikler olsun? Birden fazla seçebilirsiniz. Seçimlerinizi yaptıktan sonra "Devam Et" butonuna basın.',
          'features',
          { buttons: FEATURES, multiSelect: true },
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
        if (HOSTING_INFO[value]) {
          addBotMessage(HOSTING_INFO[value], 'hostingInfo', { infoBox: true })
        } else {
          // "var" seçtiyse doğrudan domain sorusuna geç
          addBotMessage('Domain (alan adı) durumunuz nedir?', 'domainStatus', {
            buttons: [
              { label: '✅ Domainim var', value: 'var' },
              { label: '❌ Domainim yok', value: 'yok' },
              { label: '❓ Ne olduğunu bilmiyorum', value: 'bilmiyor' },
            ],
          })
        }
        break

      case 'hostingInfo':
        // Bilgi okundu, domain sorusuna geç
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
          // Domain var — timeline sorusuna geç
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
        // Bilgi okundu, timeline sorusuna geç
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
      ? selectedFeatures.map((v) => FEATURES.find((f) => f.value === v)?.label || v).join(', ')
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
          'Son adım! Teklifinizi hazırlayıp size iletebilmemiz için adınızı ve telefon numaranızı alabilir miyim?',
          'contact',
        )
        break

      case 'contact': {
        // İsim + telefon parse
        // Kullanıcı "Mehmet 0532..." veya sadece telefon yazabilir
        const phonePart = value.match(/0[5]\d{2}[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}/)?.[0] || ''
        const namePart = value.replace(phonePart, '').trim() || data.firmName

        if (!phonePart) {
          // Telefon bulunamadıysa sor
          addBotMessage('Telefon numaranızı alabilir miyim? (05XX XXX XX XX formatında)', 'contact')
          return
        }

        setData((d) => ({ ...d, contactName: namePart, contactPhone: phonePart }))
        submitForm({ ...data, contactName: namePart, contactPhone: phonePart })
        break
      }

      case 'freeQuestion':
        handleFreeQuestion(value)
        break
    }
  }

  // ── Mesaj adımında "Atla" ──
  function handleSkipMessage() {
    setMessages((prev) => [...prev, { role: 'user', text: 'Atla' }])
    addBotMessage(
      'Son adım! Teklifinizi hazırlayıp size iletebilmemiz için adınızı ve telefon numaranızı alabilir miyim?',
      'contact',
    )
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

      // Kaydet
      setFreeQuestions((prev) => [
        ...prev,
        { question, answer, step: stepToNumber(prevStep), timestamp: new Date().toISOString() },
      ])

      setIsTyping(false)
      setMessages((prev) => [...prev, { role: 'assistant', text: answer }])

      // Önceki adıma geri dön
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

    // Slug'dan leadId parse et (demo-tekstil-giyim-LEADID)
    let leadId: string | undefined
    if (slug.startsWith('demo-')) {
      const rest = slug.replace('demo-', '')
      // Template slugları bilinen key'ler — geri kalan leadId
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
      `Teşekkürler ${finalData.contactName}! 🎉\n\nBilgileriniz ekibimize iletildi. 24 saat içinde size özel teklifiniz hazırlanacak ve sizinle iletişime geçeceğiz.\n\nGüzel bir gün dileriz!`,
      'done',
    )
  }

  // ── Progress bar ──
  const progress = step === 'done' ? 100 : (stepToNumber(step) / TOTAL_STEPS) * 100

  // ── Buton gösterilecek mi ──
  const showButtons = !['intro', 'firmName', 'message', 'contact', 'done', 'freeQuestion'].includes(step)
  const showTextInput = ['firmName', 'message', 'contact', 'freeQuestion'].includes(step)
  const showFreeQuestionBtn = !['intro', 'done', 'freeQuestion', 'hostingInfo', 'domainInfo'].includes(step)

  // ── Placeholder ──
  const placeholders: Record<string, string> = {
    firmName: 'İşletmenizin adını yazın...',
    message: 'Notunuzu yazın veya "Atla" butonuna basın...',
    contact: 'Adınız ve telefon numaranız (Mehmet 0532...)',
    freeQuestion: 'Sorunuzu yazın...',
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <a
            href={`/p/${slug}`}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </a>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
              V
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">Vorte Studio</div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Çevrimiçi
              </div>
            </div>
          </div>
          {/* Progress */}
          {step !== 'intro' && step !== 'done' && (
            <div className="ml-auto flex items-center gap-2">
              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-orange-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-slate-400">
                {stepToNumber(step)}/{TOTAL_STEPS}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Chat area */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-xl space-y-4">
          <div className="flex justify-center">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">Bugün</span>
          </div>

          {messages.map((msg, i) => (
            <div key={i}>
              <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'rounded-br-md bg-orange-500 text-white'
                      : msg.infoBox
                        ? 'rounded-bl-md border border-blue-200 bg-blue-50 text-slate-700'
                        : 'rounded-bl-md bg-white text-slate-700 shadow-sm ring-1 ring-slate-100'
                  }`}
                >
                  {msg.text}
                </div>
              </div>

              {/* Inline butonlar (son assistant mesajında ve step eşleşiyorsa) */}
              {msg.buttons && i === messages.length - 1 && !msg.multiSelect && (
                <div className="mt-3 flex flex-wrap gap-2 pl-2">
                  {msg.buttons.map((btn) => (
                    <button
                      key={btn.value}
                      onClick={() => handleButtonClick(btn.value, btn.label)}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition-all hover:border-orange-300 hover:bg-orange-50 active:scale-95"
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Multi-select butonlar */}
              {msg.multiSelect && i === messages.length - 1 && (
                <div className="mt-3 space-y-3 pl-2">
                  <div className="flex flex-wrap gap-2">
                    {FEATURES.map((f) => (
                      <button
                        key={f.value}
                        onClick={() => toggleFeature(f.value)}
                        className={`rounded-full border px-4 py-2 text-sm transition-all active:scale-95 ${
                          selectedFeatures.includes(f.value)
                            ? 'border-orange-400 bg-orange-50 text-orange-700'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-orange-300'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleFeaturesConfirm}
                    className="rounded-full bg-orange-500 px-6 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-orange-600 active:scale-95"
                  >
                    Devam Et →
                  </button>
                </div>
              )}

              {/* Info box — "Anladım" butonu */}
              {msg.infoBox && i === messages.length - 1 && (
                <div className="mt-3 pl-2">
                  <button
                    onClick={() => handleButtonClick('anladim', 'Anladım, devam edelim')}
                    className="rounded-full bg-blue-500 px-6 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-600 active:scale-95"
                  >
                    Anladım, devam edelim →
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm ring-1 ring-slate-100">
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </main>

      {/* Input area */}
      {showTextInput && (
        <div className="sticky bottom-0 border-t border-slate-200 bg-white px-4 py-3">
          <div className="mx-auto max-w-xl">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                ref={inputRef}
                type={step === 'contact' ? 'tel' : 'text'}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholders[step] ?? 'Yazın...'}
                className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100"
                disabled={aiLoading}
              />
              {step === 'message' && (
                <button
                  type="button"
                  onClick={handleSkipMessage}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-500 transition-colors hover:bg-slate-50"
                >
                  Atla
                </button>
              )}
              <button
                type="submit"
                disabled={!inputValue.trim() || aiLoading}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white shadow-sm transition-all hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
                </svg>
              </button>
            </form>

            {/* Free question butonu — text input modlarında */}
            {showFreeQuestionBtn && step !== 'freeQuestion' && (
              <button
                onClick={handleOpenFreeQuestion}
                className="mt-2 w-full text-center text-xs text-slate-400 transition-colors hover:text-orange-500"
              >
                💬 Bir sorum var
              </button>
            )}
          </div>
        </div>
      )}

      {/* Buton modlarında "Bir sorum var" */}
      {showButtons && !showTextInput && (
        <div className="sticky bottom-0 border-t border-slate-200 bg-white px-4 py-3">
          <div className="mx-auto max-w-xl text-center">
            <button
              onClick={handleOpenFreeQuestion}
              className="text-sm text-slate-400 transition-colors hover:text-orange-500"
            >
              💬 Bir sorum var
            </button>
          </div>
        </div>
      )}

      {/* Tamamlandı */}
      {step === 'done' && (
        <div className="sticky bottom-0 border-t border-slate-200 bg-white px-4 py-4">
          <div className="mx-auto max-w-xl text-center">
            <p className="mb-3 text-sm text-slate-500">Demo sayfanıza geri dönebilirsiniz:</p>
            <a
              href={`/p/${slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-6 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Sayfaya Geri Dön
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
