'use client'

import { Nunito, Open_Sans } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const nunito = Nunito({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-nunito',
  display: 'swap',
})

const openSans = Open_Sans({
  subsets: ['latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-open-sans',
  display: 'swap',
})

const fadeInUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
}

const slideFromLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
}

const slideFromRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
}

export default function KirtasiyeTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const productsImg = props.images?.products

  const categories = [
    { color: '#DC2626', name: 'Okul Malzemeleri', icon: '📚' },
    { color: '#1E40AF', name: 'Ofis Ürünleri', icon: '🖊️' },
    { color: '#059669', name: 'Sanat Malzemeleri', icon: '🎨' },
    { color: '#D97706', name: 'Kırtasiye & Hobi', icon: '✂️' },
  ]

  return (
    <div className={`${nunito.variable} ${openSans.variable} min-h-screen bg-white text-[#1C1917]`}>
      {/* ═══════════════════ HERO — Playful Angled Color Blocks + Eğlenceli Geometri ═══════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-[#FEF3C7]">
        {/* Rotated color blocks — playful geometric elements */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-20 -top-20 h-80 w-80 rotate-12 rounded-3xl bg-[#1E40AF]/8" />
          <div className="absolute -left-16 bottom-20 h-64 w-64 -rotate-6 rounded-3xl bg-[#DC2626]/8" />
          <div className="absolute right-1/4 top-1/3 h-40 w-40 rotate-45 rounded-2xl bg-[#059669]/6" />
          <div className="absolute bottom-1/4 left-1/3 h-32 w-32 -rotate-12 rounded-xl bg-[#D97706]/8" />
        </div>

        {/* Dot pattern — notebook hissi */}
        <div className="pointer-events-none absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(30,64,175,0.06) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="grid w-full items-center gap-12 lg:grid-cols-2">
            {/* Sol — metin */}
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-sm">
                <span className="text-lg">✏️</span>
                <span className="font-[family-name:var(--font-nunito)] text-xs font-700 uppercase tracking-[0.25em] text-[#1E40AF]">
                  {props.city} &bull; Kırtasiye
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-nunito)] text-4xl font-800 leading-tight text-[#1C1917] sm:text-5xl lg:text-6xl">
                Okul, Ofis, Sanat
                <br />
                <span className="text-[#1E40AF]">Hepsi Burada!</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="mt-6 max-w-md font-[family-name:var(--font-open-sans)] text-lg leading-relaxed text-[#57534E]">
                {props.firmName} — {props.city}&apos;de okul, ofis ve sanat malzemeleri
                için güvenilir adresiniz. Toplu siparişlerde özel indirimler!
              </motion.p>

              <motion.div variants={fadeInUp} className="mt-8">
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1E40AF] px-8 py-4 font-[family-name:var(--font-nunito)] text-sm font-700 text-white shadow-lg shadow-[#1E40AF]/20 transition-all hover:bg-[#1E3A8A] hover:shadow-xl"
                >
                  Ücretsiz Teklif Al
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              </motion.div>
            </motion.div>

            {/* Sağ — category cards in playful grid */}
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 gap-4">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.name}
                  variants={scaleIn}
                  className="rounded-2xl bg-white p-6 shadow-lg shadow-black/5 transition-all hover:shadow-xl"
                  style={{ transform: i % 2 === 1 ? 'rotate(2deg)' : 'rotate(-1deg)' }}
                >
                  <div className="mb-3 text-4xl">{cat.icon}</div>
                  <h3 className="font-[family-name:var(--font-nunito)] text-sm font-700" style={{ color: cat.color }}>{cat.name}</h3>
                </motion.div>
              ))}

              {/* Hero image card — if available */}
              {heroImg && (
                <motion.div variants={scaleIn} className="col-span-2 overflow-hidden rounded-2xl shadow-lg" style={{ transform: 'rotate(1deg)' }}>
                  <img src={heroImg} alt={`${props.firmName} kırtasiye`} className="w-full object-cover" style={{ aspectRatio: '16/9', maxHeight: '200px' }} />
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
            <motion.div variants={fadeInUp} className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-red-50 px-5 py-2">
              <span className="text-lg">⚠️</span>
              <span className="font-[family-name:var(--font-nunito)] text-sm font-700 text-red-700">Dikkat — Kaçırıyorsunuz</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-nunito)] text-3xl font-800 text-[#1C1917] sm:text-4xl">
              Öğrenciler ve veliler <span className="text-red-600">online fiyat araştırması</span> yapıyor
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-open-sans)] text-lg text-[#78716C]">
              Kırtasiye ürünleriniz ve fiyatlarınız web sitenizde yoksa
              müşteriler rakiplerinizi tercih ediyor. Toplu siparişler için sizi bulamıyorlar.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-[#F8FAFC] py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-nunito)] text-3xl font-800 text-[#1C1917] sm:text-4xl">
              Web Siteniz <span className="text-[#1E40AF]">Olursa</span> / <span className="text-red-500">Olmazsa</span>
            </motion.h2>
            <div className="grid gap-6 md:grid-cols-2">
              <motion.div variants={slideFromLeft} className="rounded-2xl border-2 border-[#1E40AF]/10 bg-white p-8">
                <div className="mb-4 text-2xl">✅</div>
                <h3 className="mb-4 font-[family-name:var(--font-nunito)] text-lg font-700 text-[#1C1917]">Web Siteniz Olursa</h3>
                <ul className="space-y-3 font-[family-name:var(--font-open-sans)] text-sm text-[#57534E]">
                  {['Ürünler ve fiyatlar 7/24 görünür', 'Okula dönüş kampanyalarını online duyurursunuz', 'Toplu sipariş talepleri online gelir', 'Google\'da "kırtasiye + şehir" aramasında çıkarsınız', 'Veliler kolayca ulaşır ve güvenir'].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.5 text-[#1E40AF]">●</span> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div variants={slideFromRight} className="rounded-2xl border border-red-100 bg-red-50/50 p-8">
                <div className="mb-4 text-2xl">❌</div>
                <h3 className="mb-4 font-[family-name:var(--font-nunito)] text-lg font-700 text-[#1C1917]">Web Siteniz Olmazsa</h3>
                <ul className="space-y-3 font-[family-name:var(--font-open-sans)] text-sm text-[#57534E]">
                  {['Müşteriler fiyatları karşılaştıramaz', 'Toplu sipariş fırsatlarını kaçırırsınız', 'Kampanyalarınız duyulmaz', 'Sadece mağaza önünden geçenlere satarsınız', 'Marka bilinirliğiniz gelişmez'].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.5 text-red-400">●</span> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ÜRÜN GÖRSELİ ═══════════════════ */}
      {productsImg && (
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="overflow-hidden rounded-2xl">
              <img src={productsImg} alt={`${props.firmName} ürünler`} className="w-full object-cover" style={{ aspectRatio: '4/3' }} />
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="bg-[#1E40AF] py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-nunito)] text-3xl font-800 text-white sm:text-4xl">
              {props.firmName} İçin
              <br />
              <span className="text-[#FEF3C7]">Profesyonel Web Sitenizi Oluşturalım</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-open-sans)] text-white/70">
              Ücretsiz demo ile farkı görün — taahhüt yok, baskı yok.
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-8">
              <a
                href={chatLink}
                onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-10 py-4 font-[family-name:var(--font-nunito)] text-sm font-700 text-[#1E40AF] transition-all hover:bg-[#FEF3C7]"
              >
                Ücretsiz Teklif Al
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div variants={scaleIn} className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#1E40AF]/10">
              <span className="text-2xl">🔒</span>
            </motion.div>
            <motion.h3 variants={fadeInUp} className="font-[family-name:var(--font-nunito)] text-lg font-700 text-[#1C1917]">
              Taahhüt Yok, Risk Yok
            </motion.h3>
            <motion.p variants={fadeInUp} className="mt-2 font-[family-name:var(--font-open-sans)] text-sm text-[#78716C]">
              Demo tamamen ücretsizdir. Beğenmezseniz hiçbir ödeme yapmazsınız.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="border-t border-[#E5E7EB] py-8">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="font-[family-name:var(--font-open-sans)] text-xs text-[#94A3B8]">
            © {new Date().getFullYear()} Vorte Studio — {props.firmName} için özel olarak hazırlanmıştır.
          </p>
        </div>
      </footer>
    </div>
  )
}
