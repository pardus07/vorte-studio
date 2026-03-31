'use client'

import { Lora, Source_Sans_3 } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const lora = Lora({
  subsets: ['latin-ext'],
  weight: ['400', '600', '700'],
  variable: '--font-lora',
  display: 'swap',
})

const sourceSans = Source_Sans_3({
  subsets: ['latin-ext'],
  weight: ['400', '600', '700'],
  variable: '--font-source-sans',
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
  hidden: { opacity: 0, scale: 0.9 },
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

export default function FirinlarTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroBg = props.images?.['hero-bg']
  const productsImg = props.images?.products

  return (
    <div className={`${lora.variable} ${sourceSans.variable} min-h-screen bg-[#FFFBF0] text-[#78350F]`}>
      {/* ═══════════════════ HERO — Panoramic Banner + Buğday Doku ═══════════════════ */}
      <section className="relative overflow-hidden">
        {/* Panoramic banner */}
        <div className="relative h-[60vh] min-h-[400px] sm:h-[70vh]">
          {heroBg ? (
            <img src={heroBg} alt={`${props.firmName} fırın`} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#92400E] via-[#78350F] to-[#451A03]" />
          )}

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FFFBF0] via-transparent to-[#78350F]/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#78350F]/60 via-transparent to-transparent" />

          {/* Hero text over banner */}
          <div className="absolute inset-0 flex items-center">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
            >
              <motion.div variants={fadeInUp} className="flex items-center gap-3">
                <span className="text-2xl">🌾</span>
                <span className="font-[family-name:var(--font-source-sans)] text-sm font-600 uppercase tracking-[0.2em] text-[#FDE68A]">
                  {props.city} &bull; Geleneksel Fırın
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="mt-4 max-w-xl font-[family-name:var(--font-lora)] text-4xl font-700 leading-tight text-white sm:text-5xl lg:text-6xl">
                Her Sabah Taze
                <br />
                <span className="text-[#FDE68A]">Her Isırıkta Fark</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="mt-4 max-w-md font-[family-name:var(--font-source-sans)] text-lg text-white/70">
                <strong className="text-white">{props.firmName}</strong> — kuşaktan kuşağa aktarılan
                tarifler, doğal malzemeler ve el emeği ile her gün taze.
              </motion.p>

              <motion.div variants={fadeInUp} className="mt-6">
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 rounded-lg bg-[#FDE68A] px-8 py-4 font-[family-name:var(--font-source-sans)] text-base font-700 text-[#78350F] shadow-lg transition-all hover:bg-[#FCD34D] hover:shadow-xl"
                >
                  Ücretsiz Teklif Al
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Info strip below banner */}
        <div className="relative -mt-12 mx-auto max-w-4xl px-4 sm:px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-3 gap-3 sm:gap-4"
          >
            {[
              { icon: '🕐', label: 'Sabah 06:00', sub: 'Her gün açık' },
              { icon: '🌾', label: 'Doğal Malzeme', sub: 'Katkısız üretim' },
              { icon: '⭐', label: `${props.googleRating ?? '4.8'} Puan`, sub: `${props.googleReviews ?? 200}+ Yorum` },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="rounded-xl border border-[#92400E]/10 bg-white p-4 text-center shadow-lg">
                <div className="text-2xl">{item.icon}</div>
                <div className="mt-1 font-[family-name:var(--font-lora)] text-sm font-700 text-[#78350F]">{item.label}</div>
                <div className="font-[family-name:var(--font-source-sans)] text-xs text-[#92400E]/60">{item.sub}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="py-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-4xl px-4 text-center sm:px-6"
        >
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-lg border border-[#92400E]/20 bg-[#92400E]/5 px-4 py-2 text-sm text-[#92400E]">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-source-sans)] font-600">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-lora)] text-3xl font-700 sm:text-4xl">
            Sabah Fırın Arayanlar
            <br />
            <span className="text-[#92400E]">Google Maps&apos;e Bakıyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-source-sans)] text-lg text-[#92400E]/60">
            Müşterilerin <strong className="text-[#78350F]">%68&apos;i</strong> sabah fırın ararken
            Google Maps&apos;e bakıyor. Çalışma saatiniz, adresiniz, ürün listeniz online değilse
            müşteri rakibinize gidiyor.
          </motion.p>

          {/* Products image */}
          {productsImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden rounded-2xl border border-[#92400E]/10 shadow-lg">
              <img src={productsImg} alt={`${props.firmName} ürünler`} className="w-full object-cover" />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '📍', stat: '%68', text: 'Maps\'ten fırın arıyor' },
              { emoji: '🕐', stat: '%55', text: 'Çalışma saati kontrol ediyor' },
              { emoji: '🍞', stat: '%40', text: 'Ürün çeşidini inceliyor' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="rounded-xl border border-[#92400E]/10 bg-[#92400E]/5 p-5 text-center">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-lora)] text-2xl font-700 text-[#92400E]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-source-sans)] text-sm text-[#92400E]/50">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="border-y border-[#92400E]/10 bg-white/50 py-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-5xl px-4 sm:px-6"
        >
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-lora)] text-3xl font-700 sm:text-4xl">
            Web Sitesi <span className="text-[#15803D]">Olan</span> vs <span className="text-[#78350F]/30">Olmayan</span> Fırın
          </motion.h2>

          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="rounded-2xl border border-[#15803D]/20 bg-[#15803D]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-lora)] text-lg font-700 text-[#15803D]">
                ✅ Web Sitesi Olan Fırın
              </div>
              <ul className="space-y-3 font-[family-name:var(--font-source-sans)] text-[#78350F]/80">
                {[
                  'Ürün listesi online — müşteri neyi alacağını biliyor',
                  'Çalışma saatleri güncel — müşteri boşa gelmiyor',
                  'Google\'da üst sırada çıkıyor',
                  'Konum ve adres bilgisi net',
                  'Sipariş talepleri online alınıyor',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 text-[#15803D]">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={slideFromRight} className="rounded-2xl border border-[#78350F]/10 bg-[#78350F]/[0.02] p-8">
              <div className="mb-4 font-[family-name:var(--font-lora)] text-lg font-700 text-[#78350F]/30">
                ❌ Web Sitesi Olmayan Fırın
              </div>
              <ul className="space-y-3 font-[family-name:var(--font-source-sans)] text-[#78350F]/40">
                {[
                  'Ürün çeşidi bilinmiyor — müşteri denemez',
                  'Saatler belirsiz — kapıda hayal kırıklığı',
                  'Arama sonuçlarında görünmüyor',
                  'Sadece çevre mahalleden müşteri geliyor',
                  'Toplu sipariş talepleri gelmiyor',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#FFFBF0] to-[#FDE68A]/20" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="relative mx-auto max-w-3xl px-4 text-center sm:px-6"
        >
          <motion.div variants={fadeInUp} className="text-4xl">🌾</motion.div>

          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-lora)] text-3xl font-700 sm:text-4xl lg:text-5xl">
            Fırınınızı
            <br />
            <span className="text-[#92400E]">Dijitale Taşıyalım</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-source-sans)] text-lg text-[#92400E]/60">
            Taahhüt yok, zorlama yok — {props.firmName} için özel hazırlanmış
            profesyonel fırın web sitesi teklifi.
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-8">
            <a
              href={chatLink}
              onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 rounded-lg bg-[#92400E] px-10 py-5 font-[family-name:var(--font-source-sans)] text-lg font-700 text-[#FDE68A] shadow-xl transition-all hover:bg-[#78350F] hover:shadow-2xl"
            >
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-[#92400E]/10 py-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6"
        >
          {[
            { icon: '🌾', title: 'Ücretsiz Danışmanlık', desc: 'İlk görüşme ve analiz tamamen ücretsiz.' },
            { icon: '⚡', title: '48 Saat Teslimat', desc: 'Profesyonel fırın web siteniz 48 saat içinde hazır.' },
            { icon: '📱', title: 'Mobil Uyumlu', desc: 'Müşterileriniz telefondan da kolayca erişir.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="rounded-xl border border-[#92400E]/10 bg-white/60 p-6 text-center">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-lora)] text-base font-700 text-[#78350F]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-source-sans)] text-sm text-[#92400E]/50">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="border-t border-[#92400E]/10 py-8 text-center font-[family-name:var(--font-source-sans)] text-sm text-[#78350F]/30">
        <p>Bu sayfa <strong className="text-[#78350F]/50">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
