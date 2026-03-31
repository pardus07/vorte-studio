'use client'

import { Barlow_Condensed, Barlow } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin-ext'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-barlow-condensed',
  display: 'swap',
})

const barlow = Barlow({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-barlow',
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

export default function SporSalonlariTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const equipmentImg = props.images?.equipment

  return (
    <div className={`${barlowCondensed.variable} ${barlow.variable} min-h-screen bg-[#0A0A0A] text-[#F5F5F5]`}>
      {/* ═══════════════════ HERO — Bold Diagonal Split ═══════════════════ */}
      <section className="relative overflow-hidden pb-20 pt-16">
        {/* Orange diagonal accent */}
        <div className="pointer-events-none absolute -right-20 top-0 h-full w-1/2 skew-x-[-6deg] opacity-[0.04]"
          style={{ background: 'linear-gradient(180deg, #F97316 0%, transparent 80%)' }}
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
                <div className="h-px w-10 bg-[#F97316]" />
                <span className="font-[family-name:var(--font-barlow)] text-sm font-600 uppercase tracking-[0.3em] text-[#F97316]">
                  {props.city} &bull; Fitness & Spor
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-barlow-condensed)] text-5xl font-800 uppercase leading-none sm:text-6xl lg:text-7xl">
                Daha <span className="text-[#F97316]">Güçlü</span>
                <br />
                Bir Sen İçin
              </motion.h1>

              <motion.p variants={fadeInUp} className="max-w-md font-[family-name:var(--font-barlow)] text-lg leading-relaxed text-[#F5F5F5]/50">
                <strong className="text-[#F5F5F5]">{props.firmName}</strong> — profesyonel
                ekipman, uzman eğitmenler ve kişiye özel antrenman programları.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 bg-[#F97316] px-8 py-4 font-[family-name:var(--font-barlow-condensed)] text-base font-700 uppercase tracking-wider text-white shadow-lg transition-all hover:bg-[#EA580C] hover:shadow-xl"
                >
                  Ücretsiz Teklif Al
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              {(props.googleRating || props.googleReviews) && (
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 border border-[#F97316]/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
                  <div className="flex gap-0.5 text-[#F97316]">
                    {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <span className="font-[family-name:var(--font-barlow)] text-sm font-600 text-[#F5F5F5]">
                    {props.googleRating} ({props.googleReviews}+ yorum)
                  </span>
                </motion.div>
              )}
            </div>

            {/* Sağ — Angled gym hero */}
            <motion.div variants={scaleIn} className="relative">
              <div className="relative overflow-hidden bg-[#1A1A1A] shadow-2xl" style={{ clipPath: 'polygon(8% 0, 100% 0, 100% 100%, 0 100%)' }}>
                <div className="aspect-[4/3]">
                  {heroImg ? (
                    <img src={heroImg} alt={`${props.firmName} spor salonu`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl">💪</div>
                        <p className="mt-3 font-[family-name:var(--font-barlow)] text-sm text-[#F5F5F5]/30">Spor Salonu Görseli</p>
                      </div>
                    </div>
                  )}
                </div>
                {/* Orange stripe */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#F97316]" />
              </div>
              {/* Power badge */}
              <div className="absolute -left-4 top-8 bg-[#F97316] px-4 py-2 font-[family-name:var(--font-barlow-condensed)] text-sm font-700 uppercase tracking-wider text-white shadow-lg">Power Zone</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#F97316] py-20 text-white">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-barlow-condensed)] uppercase tracking-wider">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-barlow-condensed)] text-3xl font-800 uppercase sm:text-4xl">
            Spor Salonu Arayanlar
            <br />
            <span className="text-[#0A0A0A]">Ekipman ve Fiyat İnceliyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-barlow)] text-lg text-white/70">
            Spor salonu arayanların <strong className="text-white">%79&apos;u</strong> ekipman,
            hoca kadrosu ve fiyat listesini online inceliyor.
          </motion.p>

          {equipmentImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden">
              <img src={equipmentImg} alt={`${props.firmName} ekipman`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '💪', stat: '%79', text: 'Online araştırıyor' },
              { emoji: '🏋️', stat: '%63', text: 'Ekipman fotoğrafı istiyor' },
              { emoji: '💰', stat: '%71', text: 'Fiyat karşılaştırması yapıyor' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="bg-white/10 p-5 backdrop-blur-sm">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-barlow-condensed)] text-2xl font-800 text-[#0A0A0A]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-barlow)] text-sm text-white/60">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-[#141414] py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-barlow-condensed)] text-3xl font-800 uppercase sm:text-4xl">
            Web Sitesi <span className="text-[#F97316]">Olan</span> vs <span className="text-[#F5F5F5]/30">Olmayan</span> Salon
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="border border-[#F97316]/20 bg-[#F97316]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-barlow-condensed)] text-lg font-700 uppercase text-[#F97316]">✅ Web Sitesi Olan Salon</div>
              <ul className="space-y-3 font-[family-name:var(--font-barlow)] text-[#F5F5F5]/70">
                {['Ekipman ve salon fotoğrafları online', 'Üyelik paketleri net görünüyor', 'Google\'da "spor salonu" aramasında üst sırada', 'Deneme dersi talepleri artıyor', 'Online üyelik kaydı geliyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-[#F97316]">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="border border-[#F5F5F5]/5 bg-[#F5F5F5]/[0.02] p-8">
              <div className="mb-4 font-[family-name:var(--font-barlow-condensed)] text-lg font-700 uppercase text-[#F5F5F5]/30">❌ Web Sitesi Olmayan Salon</div>
              <ul className="space-y-3 font-[family-name:var(--font-barlow)] text-[#F5F5F5]/30">
                {['Salon ortamı bilinmiyor', 'Fiyat bilgisi yok — güven düşük', 'Arama sonuçlarında görünmüyor', 'Sadece çevreden üye', 'Rakiplere üye kaybediyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="relative overflow-hidden py-24">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="text-4xl">💪</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-barlow-condensed)] text-3xl font-800 uppercase sm:text-4xl lg:text-5xl">
            Salonunuzu <span className="text-[#F97316]">Dijitale Taşıyalım</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-barlow)] text-lg text-[#F5F5F5]/50">
            Taahhüt yok, zorlama yok — {props.firmName} için özel hazırlanmış profesyonel web sitesi teklifi.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 bg-[#F97316] px-10 py-5 font-[family-name:var(--font-barlow-condensed)] text-lg font-700 uppercase tracking-wider text-white shadow-xl transition-all hover:bg-[#EA580C] hover:shadow-2xl">
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-[#F97316]/10 py-16">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: '💪', title: 'Ücretsiz Danışmanlık', desc: 'İlk görüşme ve analiz tamamen ücretsiz.' },
            { icon: '⚡', title: '48 Saat Teslimat', desc: 'Profesyonel web siteniz 48 saat içinde hazır.' },
            { icon: '🏋️', title: 'Online Üyelik', desc: 'Üyeleriniz online kaydolabilir.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="border border-[#F97316]/10 bg-[#141414] p-6 text-center">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-barlow-condensed)] text-base font-700 uppercase text-[#F97316]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-barlow)] text-sm text-[#F5F5F5]/40">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-[#F97316]/10 py-8 text-center font-[family-name:var(--font-barlow)] text-sm text-[#F5F5F5]/20">
        <p>Bu sayfa <strong className="text-[#F5F5F5]/40">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
