'use client'

import { Poppins, Inter } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const poppins = Poppins({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
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

export default function SuBayileriTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const productsImg = props.images?.products

  return (
    <div className={`${poppins.variable} ${inter.variable} min-h-screen bg-[#F0F9FF] text-[#0C4A6E]`}>
      {/* ═══════════════════ HERO — Wave Clip-Path ═══════════════════ */}
      <section className="relative overflow-hidden pb-32 pt-16">
        {/* Water bubble pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #0EA5E9 2px, transparent 2px)', backgroundSize: '40px 40px' }}
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
                <span className="text-2xl">💧</span>
                <span className="font-[family-name:var(--font-inter)] text-sm font-600 uppercase tracking-[0.2em] text-[#0EA5E9]">
                  {props.city} &bull; Güvenilir Su Teslimatı
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-poppins)] text-4xl font-800 leading-tight sm:text-5xl lg:text-6xl">
                Temiz <span className="text-[#0EA5E9]">Su</span>
                <br />
                Güvenilir Teslimat
              </motion.h1>

              <motion.p variants={fadeInUp} className="max-w-md font-[family-name:var(--font-inter)] text-lg leading-relaxed text-[#0C4A6E]/60">
                <strong className="text-[#0C4A6E]">{props.firmName}</strong> — damacana,
                pet şişe ve abonelik planlarıyla her gün kapınıza temiz su ulaştırıyoruz.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 rounded-full bg-[#0EA5E9] px-8 py-4 font-[family-name:var(--font-poppins)] text-base font-700 text-white shadow-lg transition-all hover:bg-[#0284C7] hover:shadow-xl"
                >
                  Ücretsiz Teklif Al
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              {(props.googleRating || props.googleReviews) && (
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 rounded-2xl border border-[#0EA5E9]/10 bg-white/70 px-5 py-3 backdrop-blur-sm">
                  <div className="flex gap-0.5 text-[#0EA5E9]">
                    {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <span className="font-[family-name:var(--font-inter)] text-sm font-600 text-[#0C4A6E]">
                    {props.googleRating} ({props.googleReviews}+ yorum)
                  </span>
                </motion.div>
              )}
            </div>

            {/* Sağ — Water drop shaped hero */}
            <motion.div variants={scaleIn} className="relative">
              <div className="relative mx-auto aspect-[3/4] max-w-sm overflow-hidden rounded-[40%_60%_55%_45%/60%_40%_60%_40%] border-4 border-[#0EA5E9]/20 bg-[#0EA5E9]/5 shadow-2xl">
                {heroImg ? (
                  <img src={heroImg} alt={`${props.firmName} su teslimat`} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl">💧</div>
                      <p className="mt-3 font-[family-name:var(--font-inter)] text-sm text-[#0EA5E9]/40">Su Bayisi Görseli</p>
                    </div>
                  </div>
                )}
              </div>
              {/* Floating water drops */}
              <div className="absolute -right-2 top-12 flex h-12 w-12 items-center justify-center rounded-full bg-[#0EA5E9] text-xl text-white shadow-lg">💧</div>
              <div className="absolute -left-4 bottom-20 flex h-10 w-10 items-center justify-center rounded-full bg-[#38BDF8] text-lg shadow-lg">🫧</div>
            </motion.div>
          </motion.div>
        </div>

        {/* Wave bottom */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" className="w-full">
            <path d="M0,60 C360,100 720,20 1440,60 L1440,100 L0,100 Z" fill="#0EA5E9" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#0EA5E9] py-20 text-white">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-4xl px-4 text-center sm:px-6"
        >
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-poppins)]">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-poppins)] text-3xl font-800 sm:text-4xl">
            Abonelik Suyu Arayanlar
            <br />
            <span className="text-[#BAE6FD]">Online Sipariş Veriyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-inter)] text-lg text-white/70">
            Abonelik suyu arayanların <strong className="text-white">%71&apos;i</strong> online
            sipariş veriyor. Web siteniz yoksa aramadan çıkıyorsunuz.
          </motion.p>

          {productsImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden rounded-2xl">
              <img src={productsImg} alt={`${props.firmName} ürünler`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '💧', stat: '%71', text: 'Online sipariş veriyor' },
              { emoji: '📅', stat: '%55', text: 'Abonelik tercih ediyor' },
              { emoji: '🚚', stat: '%83', text: 'Aynı gün teslimat istiyor' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-poppins)] text-2xl font-800 text-[#BAE6FD]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-inter)] text-sm text-white/60">{item.text}</div>
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
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-poppins)] text-3xl font-800 sm:text-4xl">
            Web Sitesi <span className="text-[#0EA5E9]">Olan</span> vs <span className="text-[#0C4A6E]/30">Olmayan</span> Su Bayisi
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="rounded-2xl border border-[#0EA5E9]/20 bg-[#0EA5E9]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-poppins)] text-lg font-700 text-[#0EA5E9]">✅ Web Sitesi Olan Su Bayisi</div>
              <ul className="space-y-3 font-[family-name:var(--font-inter)] text-[#0C4A6E]/80">
                {['Abonelik sistemi online çalışıyor', 'Sipariş otomatik geliyor', 'Google\'da "su bayisi" aramasında üst sırada', 'Teslimat bölgesi net görünüyor', 'Kurumsal müşteri portföyü büyüyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-[#0EA5E9]">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="rounded-2xl border border-[#0C4A6E]/5 bg-[#0C4A6E]/[0.02] p-8">
              <div className="mb-4 font-[family-name:var(--font-poppins)] text-lg font-700 text-[#0C4A6E]/30">❌ Web Sitesi Olmayan Su Bayisi</div>
              <ul className="space-y-3 font-[family-name:var(--font-inter)] text-[#0C4A6E]/40">
                {['Sipariş sadece telefonla', 'Yeni müşteri gelmiyor', 'Arama sonuçlarında görünmüyor', 'Teslimat bölgesi bilinmiyor', 'Rakiplere müşteri kaybediyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F0F9FF] to-[#BAE6FD]/30 py-24">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="text-4xl">💧</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-poppins)] text-3xl font-800 sm:text-4xl lg:text-5xl">
            Su Bayinizi <span className="text-[#0EA5E9]">Dijitale Taşıyalım</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-inter)] text-lg text-[#0C4A6E]/60">
            Taahhüt yok, zorlama yok — {props.firmName} için özel hazırlanmış profesyonel web sitesi teklifi.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 rounded-full bg-[#0EA5E9] px-10 py-5 font-[family-name:var(--font-poppins)] text-lg font-700 text-white shadow-xl transition-all hover:bg-[#0284C7] hover:shadow-2xl">
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-[#0EA5E9]/10 py-16">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: '💧', title: 'Ücretsiz Danışmanlık', desc: 'İlk görüşme ve analiz tamamen ücretsiz.' },
            { icon: '⚡', title: '48 Saat Teslimat', desc: 'Profesyonel web siteniz 48 saat içinde hazır.' },
            { icon: '📱', title: 'Online Sipariş', desc: 'Müşterileriniz online sipariş verebilir.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="rounded-2xl border border-[#0EA5E9]/10 bg-white/60 p-6 text-center">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-poppins)] text-base font-700 text-[#0EA5E9]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-inter)] text-sm text-[#0C4A6E]/50">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-[#0EA5E9]/10 py-8 text-center font-[family-name:var(--font-inter)] text-sm text-[#0C4A6E]/30">
        <p>Bu sayfa <strong className="text-[#0C4A6E]/50">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
