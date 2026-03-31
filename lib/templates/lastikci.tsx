'use client'

import { Bebas_Neue, Open_Sans } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const bebasNeue = Bebas_Neue({
  subsets: ['latin-ext'],
  weight: ['400'],
  variable: '--font-bebas-neue',
  display: 'swap',
})

const openSans = Open_Sans({
  subsets: ['latin-ext'],
  weight: ['300', '400', '600', '700'],
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

export default function LastikciTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const productsImg = props.images?.products

  return (
    <div className={`${bebasNeue.variable} ${openSans.variable} min-h-screen bg-[#171717] text-[#F5F5F5]`}>
      {/* ═══════════════════ HERO — Tire-Track Pattern + Speed Lines ═══════════════════ */}
      <section className="relative overflow-hidden pb-20 pt-16">
        {/* Tire track pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="tire" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="8" height="20" fill="#EF4444" rx="2" />
              <rect x="20" y="20" width="8" height="20" fill="#EF4444" rx="2" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#tire)" />
          </svg>
        </div>

        {/* Speed lines */}
        <div className="pointer-events-none absolute left-0 top-1/4 h-px w-1/3 bg-gradient-to-r from-[#EF4444]/30 to-transparent" />
        <div className="pointer-events-none absolute left-0 top-1/3 h-px w-1/4 bg-gradient-to-r from-[#EAB308]/20 to-transparent" />
        <div className="pointer-events-none absolute left-0 top-2/5 h-px w-2/5 bg-gradient-to-r from-[#EF4444]/20 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
          >
            <div className="space-y-8">
              <motion.div variants={fadeInUp} className="flex items-center gap-3">
                <div className="h-1 w-10 bg-[#EF4444]" />
                <span className="font-[family-name:var(--font-open-sans)] text-sm font-600 uppercase tracking-[0.3em] text-[#EF4444]">
                  {props.city} &bull; Lastik & Servis
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-bebas-neue)] text-6xl uppercase leading-none sm:text-7xl lg:text-8xl">
                Hızlı Servis
                <br />
                <span className="text-[#EF4444]">Kaliteli</span>{' '}
                <span className="text-[#EAB308]">Ürün</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="max-w-md font-[family-name:var(--font-open-sans)] text-base leading-relaxed text-[#F5F5F5]/50">
                <strong className="text-[#F5F5F5]">{props.firmName}</strong> — tüm
                markalarda lastik, hızlı montaj ve profesyonel servis.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 bg-[#EF4444] px-8 py-4 font-[family-name:var(--font-bebas-neue)] text-xl uppercase tracking-wider text-white shadow-lg transition-all hover:bg-[#DC2626] hover:shadow-xl"
                >
                  Ücretsiz Teklif Al
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              {(props.googleRating || props.googleReviews) && (
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 border border-[#EAB308]/20 bg-[#EAB308]/5 px-5 py-3">
                  <div className="flex gap-0.5 text-[#EAB308]">
                    {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <span className="font-[family-name:var(--font-open-sans)] text-sm text-[#F5F5F5]/70">
                    {props.googleRating} ({props.googleReviews}+ yorum)
                  </span>
                </motion.div>
              )}
            </div>

            {/* Sağ — Bold tire hero */}
            <motion.div variants={scaleIn} className="relative">
              <div className="relative overflow-hidden bg-[#262626]" style={{ clipPath: 'polygon(0 0, 100% 4%, 100% 96%, 0 100%)' }}>
                <div className="aspect-[4/3]">
                  {heroImg ? (
                    <img src={heroImg} alt={`${props.firmName} lastik`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl">🛞</div>
                        <p className="mt-3 font-[family-name:var(--font-open-sans)] text-sm text-[#F5F5F5]/30">Lastik Görseli</p>
                      </div>
                    </div>
                  )}
                </div>
                {/* Red + Yellow stripe */}
                <div className="absolute bottom-0 left-0 right-0 flex h-2">
                  <div className="w-1/2 bg-[#EF4444]" />
                  <div className="w-1/2 bg-[#EAB308]" />
                </div>
              </div>
              {/* Brand badges */}
              <div className="absolute -left-3 top-10 bg-[#EAB308] px-4 py-2 font-[family-name:var(--font-bebas-neue)] text-sm uppercase tracking-wider text-[#171717] shadow-lg">
                Tüm Markalar
              </div>
              <div className="absolute -right-3 bottom-10 bg-[#EF4444] px-4 py-2 font-[family-name:var(--font-bebas-neue)] text-sm uppercase tracking-wider text-white shadow-lg">
                Hızlı Montaj
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#EF4444] py-20 text-white">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 border border-white/20 px-4 py-2 text-sm">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-bebas-neue)] text-lg uppercase tracking-wider">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-bebas-neue)] text-4xl sm:text-5xl">
            Lastik Değiştirmek İsteyenler
            <br />
            <span className="text-[#171717]">Önce Fiyat ve Stok Soruyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-open-sans)] text-lg text-white/70">
            Lastik arayanların <strong className="text-white">%64&apos;ü</strong> online fiyat ve stok
            sorguluyor. Web siteniz yoksa yarısı vazgeçiyor.
          </motion.p>

          {productsImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden">
              <img src={productsImg} alt={`${props.firmName} ürünler`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '🛞', stat: '%64', text: 'Online fiyat soruyor' },
              { emoji: '📱', stat: '%52', text: 'Telefonla aramadan vazgeçiyor' },
              { emoji: '🏪', stat: '%71', text: 'En yakın lastikçiyi arıyor' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="bg-white/10 p-5 backdrop-blur-sm">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-bebas-neue)] text-3xl text-[#171717]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-open-sans)] text-sm text-white/60">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-[#262626] py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-bebas-neue)] text-4xl sm:text-5xl">
            Web Sitesi <span className="text-[#EF4444]">Olan</span> vs <span className="text-[#F5F5F5]/30">Olmayan</span> Lastikçi
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="border border-[#EF4444]/20 bg-[#EF4444]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-bebas-neue)] text-2xl text-[#EF4444]">✅ Web Sitesi Olan Lastikçi</div>
              <ul className="space-y-3 font-[family-name:var(--font-open-sans)] text-[#F5F5F5]/70">
                {['Marka ve fiyat bilgisi online', 'Google\'da "lastikçi" aramasında üst sırada', 'Online randevu geliyor', 'Stok sorgusu yapılabiliyor', 'Müşteri güveni artıyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-[#EF4444]">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="border border-[#F5F5F5]/5 bg-[#F5F5F5]/[0.02] p-8">
              <div className="mb-4 font-[family-name:var(--font-bebas-neue)] text-2xl text-[#F5F5F5]/30">❌ Web Sitesi Olmayan Lastikçi</div>
              <ul className="space-y-3 font-[family-name:var(--font-open-sans)] text-[#F5F5F5]/30">
                {['Stok bilgisi bilinmiyor', 'Fiyat şeffaflığı yok', 'Arama sonuçlarında görünmüyor', 'Sadece çevreden müşteri', 'Rakiplere müşteri kaybediyor'].map((item, i) => (
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
          <motion.div variants={fadeInUp} className="text-4xl">🛞</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-bebas-neue)] text-4xl sm:text-5xl lg:text-6xl">
            İşletmenizi <span className="text-[#EF4444]">Dijitale</span>{' '}
            <span className="text-[#EAB308]">Taşıyalım</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-open-sans)] text-base text-[#F5F5F5]/50">
            Taahhüt yok, zorlama yok — {props.firmName} için özel hazırlanmış profesyonel web sitesi teklifi.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 bg-[#EF4444] px-10 py-5 font-[family-name:var(--font-bebas-neue)] text-2xl uppercase tracking-wider text-white shadow-xl transition-all hover:bg-[#DC2626] hover:shadow-2xl">
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-[#EF4444]/10 py-16">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: '🛞', title: 'Ücretsiz Danışmanlık', desc: 'İlk görüşme ve analiz tamamen ücretsiz.' },
            { icon: '⚡', title: '48 Saat Teslimat', desc: 'Profesyonel web siteniz 48 saat içinde hazır.' },
            { icon: '🏷️', title: 'Online Fiyat Listesi', desc: 'Müşterileriniz fiyatları online görebilir.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="border border-[#EF4444]/10 bg-[#262626] p-6 text-center">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-bebas-neue)] text-xl text-[#EF4444]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-open-sans)] text-sm text-[#F5F5F5]/40">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-[#EF4444]/10 py-8 text-center font-[family-name:var(--font-open-sans)] text-sm text-[#F5F5F5]/20">
        <p>Bu sayfa <strong className="text-[#F5F5F5]/40">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
