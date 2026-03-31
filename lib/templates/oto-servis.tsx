'use client'

import { Rajdhani, Source_Sans_3 } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const rajdhani = Rajdhani({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap',
})

const sourceSans = Source_Sans_3({
  subsets: ['latin-ext'],
  weight: ['300', '400', '600', '700'],
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

export default function OtoServisTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const workshopImg = props.images?.workshop

  return (
    <div className={`${rajdhani.variable} ${sourceSans.variable} min-h-screen bg-[#1E293B] text-[#F1F5F9]`}>
      {/* ═══════════════════ HERO — Industrial Grid + Tool Badge Strip ═══════════════════ */}
      <section className="relative overflow-hidden pb-20 pt-16">
        {/* Grid pattern overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#F97316 1px, transparent 1px), linear-gradient(90deg, #F97316 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
          >
            <div className="space-y-8">
              {/* Tool badge strip */}
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-2">
                {['🔧 Mekanik', '⚡ Elektrik', '🛞 Egzoz', '🔩 Kaporta'].map((tool, i) => (
                  <span key={i} className="border border-[#F97316]/30 bg-[#F97316]/10 px-3 py-1 font-[family-name:var(--font-source-sans)] text-xs font-600 text-[#F97316]">
                    {tool}
                  </span>
                ))}
              </motion.div>

              <motion.div variants={fadeInUp} className="flex items-center gap-3">
                <div className="h-px w-10 bg-[#F97316]" />
                <span className="font-[family-name:var(--font-source-sans)] text-sm font-600 uppercase tracking-[0.3em] text-[#F97316]">
                  {props.city} &bull; Oto Servis
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-rajdhani)] text-5xl font-700 uppercase leading-none sm:text-6xl lg:text-7xl">
                Aracınız
                <br />
                Bizimle <span className="text-[#F97316]">Güvende</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="max-w-md font-[family-name:var(--font-source-sans)] text-base leading-relaxed text-[#F1F5F9]/50">
                <strong className="text-[#F1F5F9]">{props.firmName}</strong> — uzman
                kadro, modern ekipman ve hızlı servis.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 bg-[#F97316] px-8 py-4 font-[family-name:var(--font-rajdhani)] text-base font-700 uppercase tracking-wider text-white shadow-lg transition-all hover:bg-[#EA580C] hover:shadow-xl"
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
                  <span className="font-[family-name:var(--font-source-sans)] text-sm text-[#F1F5F9]/70">
                    {props.googleRating} ({props.googleReviews}+ yorum)
                  </span>
                </motion.div>
              )}
            </div>

            {/* Sağ — Industrial grid hero */}
            <motion.div variants={scaleIn} className="relative">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 overflow-hidden bg-[#0F172A]">
                  <div className="aspect-[16/9]">
                    {heroImg ? (
                      <img src={heroImg} alt={`${props.firmName} servis`} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <div className="text-center">
                          <div className="text-5xl">🔧</div>
                          <p className="mt-2 font-[family-name:var(--font-source-sans)] text-xs text-[#F1F5F9]/30">Servis Görseli</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* Service type cards */}
                {['Yağ Değişimi', 'Fren Bakımı', 'Motor Tamir', 'Triger Seti'].map((service, i) => (
                  <div key={i} className="flex items-center gap-2 bg-[#0F172A] p-3">
                    <div className="h-2 w-2 bg-[#F97316]" />
                    <span className="font-[family-name:var(--font-rajdhani)] text-sm font-600 text-[#F1F5F9]/60">{service}</span>
                  </div>
                ))}
              </div>
              {/* Orange corner accent */}
              <div className="absolute -right-2 -top-2 h-8 w-8 border-r-2 border-t-2 border-[#F97316]" />
              <div className="absolute -bottom-2 -left-2 h-8 w-8 border-b-2 border-l-2 border-[#F97316]" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#F97316] py-20 text-white">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 border border-white/20 px-4 py-2 text-sm">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-rajdhani)] uppercase tracking-wider">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-rajdhani)] text-3xl font-700 uppercase sm:text-4xl">
            Arıza Yapan Araçlar İçin
            <br />
            <span className="text-[#1E293B]">Yüzlerce Kişi Google&apos;da Arıyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-source-sans)] text-lg text-white/70">
            &ldquo;Oto tamir {props.city}&rdquo; arayanların <strong className="text-white">%72&apos;si</strong> web
            sitesi olan servisleri tercih ediyor.
          </motion.p>

          {workshopImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden">
              <img src={workshopImg} alt={`${props.firmName} atölye`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '🔧', stat: '%72', text: 'Web sitesi olan servisi seçiyor' },
              { emoji: '📍', stat: '%65', text: 'Konum ve yol tarifi arıyor' },
              { emoji: '💳', stat: '%58', text: 'Fiyat şeffaflığı istiyor' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="bg-white/10 p-5 backdrop-blur-sm">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-rajdhani)] text-2xl font-700 text-[#1E293B]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-source-sans)] text-sm text-white/60">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-[#0F172A] py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-rajdhani)] text-3xl font-700 uppercase sm:text-4xl">
            Web Sitesi <span className="text-[#F97316]">Olan</span> vs <span className="text-[#F1F5F9]/30">Olmayan</span> Servis
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="border border-[#F97316]/20 bg-[#F97316]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-rajdhani)] text-lg font-700 uppercase text-[#F97316]">✅ Web Sitesi Olan Servis</div>
              <ul className="space-y-3 font-[family-name:var(--font-source-sans)] text-[#F1F5F9]/70">
                {['Hizmet listesi ve fiyatlar şeffaf', 'Google\'da "oto servis" aramasında üst sırada', 'Online randevu alabiliyorlar', 'Müşteri yorumları güven veriyor', 'Acil servis talepleri artıyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-[#F97316]">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="border border-[#F1F5F9]/5 bg-[#F1F5F9]/[0.02] p-8">
              <div className="mb-4 font-[family-name:var(--font-rajdhani)] text-lg font-700 uppercase text-[#F1F5F9]/30">❌ Web Sitesi Olmayan Servis</div>
              <ul className="space-y-3 font-[family-name:var(--font-source-sans)] text-[#F1F5F9]/30">
                {['Hizmet kapsamı bilinmiyor', 'Fiyat bilgisi yok — güven düşük', 'Arama sonuçlarında görünmüyor', 'Sadece çevreden müşteri', 'Rakiplere müşteri kaybediyor'].map((item, i) => (
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
          <motion.div variants={fadeInUp} className="text-4xl">🔧</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-rajdhani)] text-3xl font-700 uppercase sm:text-4xl lg:text-5xl">
            Servisinizi <span className="text-[#F97316]">Dijitale Taşıyalım</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-source-sans)] text-base text-[#F1F5F9]/50">
            Taahhüt yok, zorlama yok — {props.firmName} için özel hazırlanmış profesyonel web sitesi teklifi.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 bg-[#F97316] px-10 py-5 font-[family-name:var(--font-rajdhani)] text-lg font-700 uppercase tracking-wider text-white shadow-xl transition-all hover:bg-[#EA580C] hover:shadow-2xl">
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
            { icon: '🔧', title: 'Ücretsiz Danışmanlık', desc: 'İlk görüşme ve analiz tamamen ücretsiz.' },
            { icon: '⚡', title: '48 Saat Teslimat', desc: 'Profesyonel web siteniz 48 saat içinde hazır.' },
            { icon: '📅', title: 'Online Randevu', desc: 'Müşterileriniz online randevu alabilir.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="border border-[#F97316]/10 bg-[#0F172A] p-6 text-center">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-rajdhani)] text-base font-700 uppercase text-[#F97316]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-source-sans)] text-sm text-[#F1F5F9]/40">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-[#F97316]/10 py-8 text-center font-[family-name:var(--font-source-sans)] text-sm text-[#F1F5F9]/20">
        <p>Bu sayfa <strong className="text-[#F1F5F9]/40">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
