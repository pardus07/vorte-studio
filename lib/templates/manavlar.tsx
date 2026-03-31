'use client'

import { Nunito, Open_Sans } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const nunito = Nunito({
  subsets: ['latin-ext'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-nunito',
  display: 'swap',
})

const openSans = Open_Sans({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600'],
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

export default function ManavlarTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const productsImg = props.images?.products

  return (
    <div className={`${nunito.variable} ${openSans.variable} min-h-screen bg-[#F0FFF4] text-[#14532D]`}>
      {/* ═══════════════════ HERO — Circular Produce Grid ═══════════════════ */}
      <section className="relative overflow-hidden pb-20 pt-16">
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(#15803D 1.5px, transparent 1.5px)', backgroundSize: '28px 28px' }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
          >
            <div className="space-y-8">
              <motion.div variants={fadeInUp} className="flex items-center gap-3">
                <span className="text-2xl">🥬</span>
                <span className="font-[family-name:var(--font-open-sans)] text-sm font-600 uppercase tracking-[0.2em] text-[#15803D]">
                  {props.city} &bull; Taze Manav
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-nunito)] text-4xl font-800 leading-tight sm:text-5xl lg:text-6xl">
                Her Gün <span className="text-[#15803D]">Taze</span>
                <br />
                Toprağından Sofranıza
              </motion.h1>

              <motion.p variants={fadeInUp} className="max-w-md font-[family-name:var(--font-open-sans)] text-lg leading-relaxed text-[#14532D]/60">
                <strong className="text-[#14532D]">{props.firmName}</strong> — her sabah
                tarladan gelen taze meyve ve sebzeler, doğal ürünler ve güler yüzlü hizmet.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 rounded-full bg-[#15803D] px-8 py-4 font-[family-name:var(--font-nunito)] text-base font-700 text-white shadow-lg transition-all hover:bg-[#166534] hover:shadow-xl"
                >
                  Ücretsiz Teklif Al
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              {(props.googleRating || props.googleReviews) && (
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 rounded-2xl border border-[#15803D]/10 bg-white/70 px-5 py-3 backdrop-blur-sm">
                  <div className="flex gap-0.5 text-[#F59E0B]">
                    {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <span className="font-[family-name:var(--font-nunito)] text-sm font-700 text-[#14532D]">
                    {props.googleRating} ({props.googleReviews}+ yorum)
                  </span>
                </motion.div>
              )}
            </div>

            {/* Sağ — Circular produce display */}
            <motion.div variants={scaleIn} className="relative">
              <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-full border-4 border-[#15803D]/20 bg-[#15803D]/5 shadow-2xl">
                {heroImg ? (
                  <img src={heroImg} alt={`${props.firmName} taze ürünler`} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl">🥬</div>
                      <p className="mt-3 font-[family-name:var(--font-open-sans)] text-sm text-[#15803D]/40">Manav Görseli</p>
                    </div>
                  </div>
                )}
              </div>
              {/* Floating fruit badges */}
              <div className="absolute -right-2 top-8 flex h-14 w-14 items-center justify-center rounded-full bg-[#F97316] text-2xl shadow-lg">🍅</div>
              <div className="absolute -left-2 bottom-12 flex h-12 w-12 items-center justify-center rounded-full bg-[#15803D] text-xl shadow-lg">🥒</div>
              <div className="absolute -bottom-2 right-16 flex h-12 w-12 items-center justify-center rounded-full bg-[#EAB308] text-xl shadow-lg">🍋</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#15803D] py-20 text-white">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-4xl px-4 text-center sm:px-6"
        >
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-nunito)]">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-nunito)] text-3xl font-800 sm:text-4xl">
            Organik Ürün Arayanlar
            <br />
            <span className="text-[#BBF7D0]">Online Manav Arıyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-open-sans)] text-lg text-white/70">
            Müşterilerin <strong className="text-white">%58&apos;i</strong> taze ürün sipariş etmek
            için online manav arıyor. Web siteniz yoksa sizi bulamıyorlar — rakibinize gidiyorlar.
          </motion.p>

          {productsImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden rounded-2xl">
              <img src={productsImg} alt={`${props.firmName} ürünler`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '📱', stat: '%58', text: 'Online manav arıyor' },
              { emoji: '🚚', stat: '%40', text: 'Eve teslimat istiyor' },
              { emoji: '🌿', stat: '%72', text: 'Organik tercih ediyor' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-nunito)] text-2xl font-800 text-[#BBF7D0]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-open-sans)] text-sm text-white/60">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="py-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-5xl px-4 sm:px-6"
        >
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-nunito)] text-3xl font-800 sm:text-4xl">
            Web Sitesi <span className="text-[#15803D]">Olan</span> vs <span className="text-[#14532D]/30">Olmayan</span> Manav
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="rounded-2xl border border-[#15803D]/20 bg-[#15803D]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-nunito)] text-lg font-700 text-[#15803D]">✅ Web Sitesi Olan Manav</div>
              <ul className="space-y-3 font-[family-name:var(--font-open-sans)] text-[#14532D]/80">
                {['Ürünler online — müşteri seçerek geliyor', 'Sipariş/teslimat hizmeti online', 'Google\'da "manav" aramasında üst sırada', 'Günlük taze ürün listesi paylaşılıyor', 'Toptan sipariş talepleri artıyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-[#15803D]">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="rounded-2xl border border-[#14532D]/5 bg-[#14532D]/[0.02] p-8">
              <div className="mb-4 font-[family-name:var(--font-nunito)] text-lg font-700 text-[#14532D]/30">❌ Web Sitesi Olmayan Manav</div>
              <ul className="space-y-3 font-[family-name:var(--font-open-sans)] text-[#14532D]/40">
                {['Ürün çeşidi bilinmiyor — müşteri gelmiyor', 'Sadece çevreden müşteri', 'Arama sonuçlarında görünmüyor', 'Fiyat bilgisi yok — güven düşük', 'Toplu sipariş talepleri gelmiyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F0FFF4] to-[#BBF7D0]/20 py-24">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="text-4xl">🥬</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-nunito)] text-3xl font-800 sm:text-4xl lg:text-5xl">
            Manavınızı <span className="text-[#15803D]">Dijitale Taşıyalım</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-open-sans)] text-lg text-[#14532D]/60">
            Taahhüt yok, zorlama yok — {props.firmName} için özel hazırlanmış profesyonel manav web sitesi teklifi.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 rounded-full bg-[#15803D] px-10 py-5 font-[family-name:var(--font-nunito)] text-lg font-700 text-white shadow-xl transition-all hover:bg-[#166534] hover:shadow-2xl">
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-[#15803D]/10 py-16">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: '🥬', title: 'Ücretsiz Danışmanlık', desc: 'İlk görüşme ve analiz tamamen ücretsiz.' },
            { icon: '⚡', title: '48 Saat Teslimat', desc: 'Profesyonel manav web siteniz 48 saat içinde hazır.' },
            { icon: '📱', title: 'Mobil Uyumlu', desc: 'Müşterileriniz telefondan da sipariş verebilir.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="rounded-2xl border border-[#15803D]/10 bg-white/60 p-6 text-center">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-nunito)] text-base font-700 text-[#15803D]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-open-sans)] text-sm text-[#14532D]/50">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-[#15803D]/10 py-8 text-center font-[family-name:var(--font-open-sans)] text-sm text-[#14532D]/30">
        <p>Bu sayfa <strong className="text-[#14532D]/50">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
