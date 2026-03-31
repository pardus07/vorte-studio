'use client'

import { Rubik, DM_Sans } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const rubik = Rubik({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-rubik',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-dm-sans',
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

export default function SeyahatAcentesiTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const destinationImg = props.images?.destination

  return (
    <div className={`${rubik.variable} ${dmSans.variable} min-h-screen bg-[#F8FAFC] text-[#0C4A6E]`}>
      {/* ═══════════════════ HERO — Destination Collage with Stamps ═══════════════════ */}
      <section className="relative overflow-hidden pb-20 pt-16">
        {/* Passport stamp pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, #0369A1 1px, transparent 1px)', backgroundSize: '32px 32px' }}
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
                <span className="text-2xl">✈️</span>
                <span className="font-[family-name:var(--font-dm-sans)] text-sm font-600 uppercase tracking-[0.2em] text-[#0369A1]">
                  {props.city} &bull; Seyahat Uzmanı
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-rubik)] text-4xl font-800 leading-tight sm:text-5xl lg:text-6xl">
                Hayal Ettiğiniz <span className="text-[#0369A1]">Tatil</span>
                <br />
                Bir Tık Uzakta
              </motion.h1>

              <motion.p variants={fadeInUp} className="max-w-md font-[family-name:var(--font-dm-sans)] text-lg leading-relaxed text-[#0C4A6E]/60">
                <strong className="text-[#0C4A6E]">{props.firmName}</strong> — yurt içi ve
                yurt dışı tur paketleri, erken rezervasyon fırsatları ve özel tatil planları.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 rounded-full bg-[#F97316] px-8 py-4 font-[family-name:var(--font-rubik)] text-base font-700 text-white shadow-lg transition-all hover:bg-[#EA580C] hover:shadow-xl"
                >
                  Ücretsiz Teklif Al
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              {(props.googleRating || props.googleReviews) && (
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 rounded-2xl border border-[#0369A1]/10 bg-white/70 px-5 py-3 backdrop-blur-sm">
                  <div className="flex gap-0.5 text-[#F97316]">
                    {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <span className="font-[family-name:var(--font-dm-sans)] text-sm font-600 text-[#0C4A6E]">
                    {props.googleRating} ({props.googleReviews}+ yorum)
                  </span>
                </motion.div>
              )}
            </div>

            {/* Sağ — Destination collage with stamp effect */}
            <motion.div variants={scaleIn} className="relative">
              <div className="relative overflow-hidden rounded-3xl border-2 border-[#0369A1]/15 bg-[#0369A1]/5 shadow-2xl">
                <div className="aspect-[4/3]">
                  {heroImg ? (
                    <img src={heroImg} alt={`${props.firmName} destinasyonlar`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl">✈️</div>
                        <p className="mt-3 font-[family-name:var(--font-dm-sans)] text-sm text-[#0369A1]/40">Destinasyon Görseli</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Floating stamp badges */}
              <div className="absolute -right-3 top-6 rotate-12 rounded-lg border-2 border-dashed border-[#F97316] bg-white px-3 py-1.5 font-[family-name:var(--font-rubik)] text-xs font-700 text-[#F97316] shadow-md">ERKEN REZ.</div>
              <div className="absolute -left-3 bottom-10 -rotate-6 rounded-lg border-2 border-dashed border-[#0369A1] bg-white px-3 py-1.5 font-[family-name:var(--font-rubik)] text-xs font-700 text-[#0369A1] shadow-md">FIRSAT</div>
              <div className="absolute -bottom-2 right-12 rotate-3 rounded-full bg-[#F97316] px-3 py-1 font-[family-name:var(--font-rubik)] text-xs font-700 text-white shadow-md">🌍</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#0369A1] py-20 text-white">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-4xl px-4 text-center sm:px-6"
        >
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-rubik)]">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-rubik)] text-3xl font-800 sm:text-4xl">
            Tur Araştıranlar
            <br />
            <span className="text-[#BAE6FD]">Onlarca Siteye Bakıyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-dm-sans)] text-lg text-white/70">
            Tur araştıranların <strong className="text-white">%78&apos;i</strong> onlarca
            siteye bakıyor. Kendi web siteniz yoksa rakiplerinizle yarışamıyorsunuz.
          </motion.p>

          {destinationImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden rounded-2xl">
              <img src={destinationImg} alt={`${props.firmName} destinasyonlar`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '✈️', stat: '%78', text: 'Online tur araştırıyor' },
              { emoji: '📅', stat: '%62', text: 'Erken rezervasyon yapıyor' },
              { emoji: '💳', stat: '%55', text: 'Online ödeme tercih ediyor' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-rubik)] text-2xl font-800 text-[#BAE6FD]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-dm-sans)] text-sm text-white/60">{item.text}</div>
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
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-rubik)] text-3xl font-800 sm:text-4xl">
            Web Sitesi <span className="text-[#0369A1]">Olan</span> vs <span className="text-[#0C4A6E]/30">Olmayan</span> Acente
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="rounded-2xl border border-[#0369A1]/20 bg-[#0369A1]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-rubik)] text-lg font-700 text-[#0369A1]">✅ Web Sitesi Olan Acente</div>
              <ul className="space-y-3 font-[family-name:var(--font-dm-sans)] text-[#0C4A6E]/80">
                {['Tur paketleri online görünüyor', 'Erken rezervasyon talepleri artıyor', 'Google\'da "tur" aramasında üst sırada', 'Online ödeme ile anında satış', 'Referans ve yorumlar güven veriyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-[#0369A1]">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="rounded-2xl border border-[#0C4A6E]/5 bg-[#0C4A6E]/[0.02] p-8">
              <div className="mb-4 font-[family-name:var(--font-rubik)] text-lg font-700 text-[#0C4A6E]/30">❌ Web Sitesi Olmayan Acente</div>
              <ul className="space-y-3 font-[family-name:var(--font-dm-sans)] text-[#0C4A6E]/40">
                {['Turlar sadece vitrinde', 'Online müşteri gelmiyor', 'Arama sonuçlarında görünmüyor', 'Erken rezervasyon kaçırılıyor', 'Güven algısı düşük'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F8FAFC] to-[#BAE6FD]/20 py-24">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="text-4xl">✈️</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-rubik)] text-3xl font-800 sm:text-4xl lg:text-5xl">
            Acentenizi <span className="text-[#0369A1]">Dijitale Taşıyalım</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-dm-sans)] text-lg text-[#0C4A6E]/60">
            Taahhüt yok, zorlama yok — {props.firmName} için özel hazırlanmış profesyonel seyahat web sitesi teklifi.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 rounded-full bg-[#F97316] px-10 py-5 font-[family-name:var(--font-rubik)] text-lg font-700 text-white shadow-xl transition-all hover:bg-[#EA580C] hover:shadow-2xl">
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-[#0369A1]/10 py-16">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: '✈️', title: 'Ücretsiz Danışmanlık', desc: 'İlk görüşme ve analiz tamamen ücretsiz.' },
            { icon: '⚡', title: '48 Saat Teslimat', desc: 'Profesyonel web siteniz 48 saat içinde hazır.' },
            { icon: '🌍', title: 'Online Rezervasyon', desc: 'Müşterileriniz online tur rezervasyonu yapabilir.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="rounded-2xl border border-[#0369A1]/10 bg-white/60 p-6 text-center">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-rubik)] text-base font-700 text-[#0369A1]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-dm-sans)] text-sm text-[#0C4A6E]/50">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-[#0369A1]/10 py-8 text-center font-[family-name:var(--font-dm-sans)] text-sm text-[#0C4A6E]/30">
        <p>Bu sayfa <strong className="text-[#0C4A6E]/50">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
