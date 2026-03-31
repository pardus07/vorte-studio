'use client'

import { Playfair_Display, Lato } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const playfair = Playfair_Display({
  subsets: ['latin-ext'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-playfair',
  display: 'swap',
})

const lato = Lato({
  subsets: ['latin-ext'],
  weight: ['400', '700'],
  variable: '--font-lato',
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

export default function KuruyemiscilerTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const productsImg = props.images?.products

  return (
    <div className={`${playfair.variable} ${lato.variable} min-h-screen bg-[#FFFBF5] text-[#3C1A00]`}>
      {/* ═══════════════════ HERO — Warm Shelf Display ═══════════════════ */}
      <section className="relative overflow-hidden pb-20 pt-16">
        {/* Subtle wood grain pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'repeating-linear-gradient(90deg, #713F12 0px, transparent 1px, transparent 24px)', backgroundSize: '25px 25px' }}
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
                <span className="text-2xl">🥜</span>
                <span className="font-[family-name:var(--font-lato)] text-sm font-700 uppercase tracking-[0.2em] text-[#713F12]">
                  {props.city} &bull; Kuruyemiş Uzmanı
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-playfair)] text-4xl font-800 leading-tight sm:text-5xl lg:text-6xl">
                En Taze <span className="text-[#B8860B]">Kuruyemiş</span>
                <br />
                En İyi Fiyat
              </motion.h1>

              <motion.p variants={fadeInUp} className="max-w-md font-[family-name:var(--font-lato)] text-lg leading-relaxed text-[#3C1A00]/60">
                <strong className="text-[#3C1A00]">{props.firmName}</strong> — kavrulmuş
                fıstık, badem, fındık, kuru meyve ve özel karışımlar. Toptan ve perakende.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 rounded-full bg-[#713F12] px-8 py-4 font-[family-name:var(--font-playfair)] text-base font-700 text-[#FDE68A] shadow-lg transition-all hover:bg-[#5C3310] hover:shadow-xl"
                >
                  Ücretsiz Teklif Al
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              {(props.googleRating || props.googleReviews) && (
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 rounded-2xl border border-[#713F12]/10 bg-white/70 px-5 py-3 backdrop-blur-sm">
                  <div className="flex gap-0.5 text-[#B8860B]">
                    {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <span className="font-[family-name:var(--font-lato)] text-sm font-700 text-[#3C1A00]">
                    {props.googleRating} ({props.googleReviews}+ yorum)
                  </span>
                </motion.div>
              )}
            </div>

            {/* Sağ — Shelf Display Card */}
            <motion.div variants={scaleIn} className="relative">
              <div className="relative overflow-hidden rounded-3xl border-2 border-[#B8860B]/20 bg-gradient-to-b from-[#713F12]/5 to-[#B8860B]/10 shadow-2xl">
                <div className="aspect-[4/3]">
                  {heroImg ? (
                    <img src={heroImg} alt={`${props.firmName} kuruyemiş`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#713F12]/5">
                      <div className="text-center">
                        <div className="text-6xl">🥜</div>
                        <p className="mt-3 font-[family-name:var(--font-lato)] text-sm text-[#713F12]/40">Kuruyemiş Görseli</p>
                      </div>
                    </div>
                  )}
                </div>
                {/* Gold shelf strip */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#B8860B]" />
              </div>
              {/* Floating nut badges */}
              <div className="absolute -right-3 top-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#B8860B] text-2xl shadow-lg">🌰</div>
              <div className="absolute -left-3 bottom-16 flex h-12 w-12 items-center justify-center rounded-full bg-[#713F12] text-xl text-white shadow-lg">🫘</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#713F12] py-20 text-white">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-4xl px-4 text-center sm:px-6"
        >
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-playfair)]">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-playfair)] text-3xl font-800 sm:text-4xl">
            Toplu Sipariş Verenler
            <br />
            <span className="text-[#FDE68A]">Online Fiyat Arıyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-lato)] text-lg text-white/70">
            Toplu kuruyemiş siparişi verenlerin <strong className="text-white">%62&apos;si</strong> online
            fiyat araştırıyor. Web siteniz yoksa rakibinizden sipariş veriyorlar.
          </motion.p>

          {productsImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden rounded-2xl">
              <img src={productsImg} alt={`${props.firmName} ürünler`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '🛒', stat: '%62', text: 'Online fiyat araştırıyor' },
              { emoji: '📦', stat: '%45', text: 'Toptan sipariş veriyor' },
              { emoji: '🎁', stat: '%38', text: 'Hediye paketi istiyor' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-playfair)] text-2xl font-800 text-[#FDE68A]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-lato)] text-sm text-white/60">{item.text}</div>
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
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-playfair)] text-3xl font-800 sm:text-4xl">
            Web Sitesi <span className="text-[#B8860B]">Olan</span> vs <span className="text-[#3C1A00]/30">Olmayan</span> Kuruyemişçi
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="rounded-2xl border border-[#B8860B]/20 bg-[#B8860B]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-playfair)] text-lg font-700 text-[#713F12]">✅ Web Sitesi Olan Kuruyemişçi</div>
              <ul className="space-y-3 font-[family-name:var(--font-lato)] text-[#3C1A00]/80">
                {['Ürün çeşitleri ve fiyatlar online', 'Toptan sipariş talepleri artıyor', 'Google\'da "kuruyemiş" aramasında üst sırada', 'Hediye paketi siparişleri geliyor', 'Kurumsal müşteri portföyü büyüyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-[#B8860B]">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="rounded-2xl border border-[#3C1A00]/5 bg-[#3C1A00]/[0.02] p-8">
              <div className="mb-4 font-[family-name:var(--font-playfair)] text-lg font-700 text-[#3C1A00]/30">❌ Web Sitesi Olmayan Kuruyemişçi</div>
              <ul className="space-y-3 font-[family-name:var(--font-lato)] text-[#3C1A00]/40">
                {['Ürün çeşitleri bilinmiyor', 'Sadece mahalle müşterisi', 'Arama sonuçlarında görünmüyor', 'Toplu sipariş gelmiyor', 'Hediye paketi satışı düşük'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFBF5] to-[#FDE68A]/20 py-24">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="text-4xl">🥜</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-playfair)] text-3xl font-800 sm:text-4xl lg:text-5xl">
            Kuruyemişçinizi <span className="text-[#B8860B]">Dijitale Taşıyalım</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-lato)] text-lg text-[#3C1A00]/60">
            Taahhüt yok, zorlama yok — {props.firmName} için özel hazırlanmış profesyonel web sitesi teklifi.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 rounded-full bg-[#713F12] px-10 py-5 font-[family-name:var(--font-playfair)] text-lg font-700 text-[#FDE68A] shadow-xl transition-all hover:bg-[#5C3310] hover:shadow-2xl">
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-[#713F12]/10 py-16">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: '🥜', title: 'Ücretsiz Danışmanlık', desc: 'İlk görüşme ve analiz tamamen ücretsiz.' },
            { icon: '⚡', title: '48 Saat Teslimat', desc: 'Profesyonel web siteniz 48 saat içinde hazır.' },
            { icon: '📦', title: 'Online Sipariş', desc: 'Müşterileriniz online sipariş verebilir.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="rounded-2xl border border-[#B8860B]/10 bg-white/60 p-6 text-center">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-playfair)] text-base font-700 text-[#713F12]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-lato)] text-sm text-[#3C1A00]/50">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-[#713F12]/10 py-8 text-center font-[family-name:var(--font-lato)] text-sm text-[#3C1A00]/30">
        <p>Bu sayfa <strong className="text-[#3C1A00]/50">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
