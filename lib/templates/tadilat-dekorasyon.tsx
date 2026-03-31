'use client'

import { Raleway, Open_Sans } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const raleway = Raleway({
  subsets: ['latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-raleway',
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

export default function TadilatDekorasyonTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const productsImg = props.images?.products

  return (
    <div className={`${raleway.variable} ${openSans.variable} min-h-screen bg-[#F8FAFC] text-[#0F172A]`}>
      {/* ═══════════════════ HERO — Window Frame Mockup ═══════════════════ */}
      <section className="relative overflow-hidden pb-20 pt-16">
        {/* Subtle blue-gray metallic gradient */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 opacity-[0.04]"
          style={{ background: 'linear-gradient(180deg, #64748B 0%, transparent 100%)' }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
          >
            <div className="space-y-8">
              {/* Product type badges */}
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-2">
                {['PVC Pencere', 'Alüminyum Doğrama', 'Cam Balkon', 'Sürme Sistem'].map((type, i) => (
                  <span key={i} className="rounded-sm border border-[#64748B]/20 bg-[#64748B]/5 px-3 py-1 font-[family-name:var(--font-open-sans)] text-xs font-600 text-[#64748B]">
                    {type}
                  </span>
                ))}
              </motion.div>

              <motion.div variants={fadeInUp} className="flex items-center gap-3">
                <div className="h-px w-10 bg-[#0F172A]" />
                <span className="font-[family-name:var(--font-open-sans)] text-xs font-600 uppercase tracking-[0.3em] text-[#64748B]">
                  {props.city} &bull; PVC & Doğrama
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-raleway)] text-4xl font-700 leading-tight sm:text-5xl lg:text-6xl">
                Evinizi
                <br />
                Dönüştürecek
                <br />
                <span className="text-[#64748B]">Pencereler</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="max-w-md font-[family-name:var(--font-open-sans)] text-base font-300 leading-relaxed text-[#0F172A]/60">
                <strong className="font-700 text-[#0F172A]">{props.firmName}</strong> — ısı yalıtımlı
                PVC pencere, alüminyum doğrama ve cam balkon sistemleri.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 rounded-sm bg-[#0F172A] px-8 py-4 font-[family-name:var(--font-raleway)] text-sm font-600 uppercase tracking-wider text-white shadow-lg transition-all hover:bg-[#1E293B] hover:shadow-xl"
                >
                  Ücretsiz Teklif Al
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              {(props.googleRating || props.googleReviews) && (
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 rounded-sm border border-[#0F172A]/10 bg-white px-5 py-2.5 shadow-sm">
                  <div className="flex gap-0.5 text-[#64748B]">
                    {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <span className="font-[family-name:var(--font-open-sans)] text-sm text-[#0F172A]/60">
                    {props.googleRating} ({props.googleReviews}+ yorum)
                  </span>
                </motion.div>
              )}
            </div>

            {/* Sağ — Window frame mockup */}
            <motion.div variants={scaleIn} className="relative">
              {/* Window frame outer */}
              <div className="relative bg-[#64748B] p-4 shadow-xl" style={{ borderRadius: '2px' }}>
                {/* Inner glass pane */}
                <div className="relative overflow-hidden bg-white" style={{ borderRadius: '1px' }}>
                  <div className="aspect-[4/3]">
                    {heroImg ? (
                      <img src={heroImg} alt={`${props.firmName} pencere`} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[#E2E8F0]">
                        <div className="text-center">
                          <div className="text-6xl">🪟</div>
                          <p className="mt-3 font-[family-name:var(--font-open-sans)] text-sm text-[#0F172A]/30">Pencere Görseli</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Glass reflection effect */}
                  <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rotate-45 bg-gradient-to-br from-white/30 to-transparent" />
                  {/* Window divider (cross) */}
                  <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#64748B]/30" />
                  <div className="pointer-events-none absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[#64748B]/30" />
                </div>
                {/* Handle */}
                <div className="absolute -right-2 top-1/2 h-8 w-2 -translate-y-1/2 rounded-sm bg-[#94A3B8] shadow-md" />
              </div>

              {/* Feature badges */}
              <div className="absolute -left-3 top-8 rounded-sm bg-[#0F172A] px-4 py-2 font-[family-name:var(--font-raleway)] text-xs font-600 text-white shadow-lg">
                🌡️ Isı Yalıtım
              </div>
              <div className="absolute -right-3 bottom-8 rounded-sm bg-white px-4 py-2 font-[family-name:var(--font-raleway)] text-xs font-600 text-[#0F172A] shadow-lg">
                📏 Ücretsiz Ölçüm
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#0F172A] py-20 text-white">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-sm border border-white/20 px-4 py-2 text-sm">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-raleway)] font-500 uppercase tracking-wider">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-raleway)] text-3xl font-700 sm:text-4xl">
            Pencere-Kapı Yaptırmak İsteyenler
            <br />
            <span className="text-[#64748B]">Birden Fazla Firmayı Karşılaştırıyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-open-sans)] text-lg text-white/70">
            PVC/alüminyum doğrama arayanların <strong className="text-white">%77&apos;si</strong> en
            az 3 firmadan teklif alıyor. Web siteniz yoksa teklife dahil edilmiyorsunuz.
          </motion.p>

          {productsImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden rounded-sm">
              <img src={productsImg} alt={`${props.firmName} ürünler`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '🪟', stat: '%77', text: 'Birden fazla firmayı karşılaştırıyor' },
              { emoji: '🌡️', stat: '%69', text: 'Isı yalıtım değeri soruyor' },
              { emoji: '📏', stat: '%82', text: 'Ücretsiz ölçüm bekliyor' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="rounded-sm bg-white/10 p-5 backdrop-blur-sm">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-raleway)] text-2xl font-700 text-[#64748B]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-open-sans)] text-sm text-white/60">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-raleway)] text-3xl font-700 sm:text-4xl">
            Web Sitesi <span className="text-[#64748B]">Olan</span> vs <span className="text-[#0F172A]/30">Olmayan</span> Doğrama Firması
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="rounded-sm border border-[#64748B]/20 bg-[#64748B]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-raleway)] text-lg font-600 text-[#64748B]">✅ Web Sitesi Olan Firma</div>
              <ul className="space-y-3 font-[family-name:var(--font-open-sans)] text-[#0F172A]/70">
                {['Ürün çeşitleri ve renk seçenekleri online', 'Google\'da "PVC pencere" aramasında üst sırada', 'Ücretsiz ölçüm talebi online geliyor', 'Isı yalıtım değerleri belirtiliyor', 'Referans projeler güven veriyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-[#64748B]">●</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="rounded-sm border border-[#0F172A]/10 bg-[#0F172A]/[0.03] p-8">
              <div className="mb-4 font-[family-name:var(--font-raleway)] text-lg font-600 text-[#0F172A]/30">❌ Web Sitesi Olmayan Firma</div>
              <ul className="space-y-3 font-[family-name:var(--font-open-sans)] text-[#0F172A]/30">
                {['Ürün seçenekleri bilinmiyor', 'Teknik bilgi paylaşılamıyor', 'Arama sonuçlarında görünmüyor', 'Sadece çevreden müşteri', 'Teklif karşılaştırmasına dahil olamıyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5">●</span>{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="relative py-24">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="text-4xl">🪟</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-raleway)] text-3xl font-700 sm:text-4xl lg:text-5xl">
            Firmanızı <span className="text-[#64748B]">Dijitale Taşıyalım</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-open-sans)] text-base font-300 text-[#0F172A]/60">
            Taahhüt yok, zorlama yok — {props.firmName} için özel hazırlanmış profesyonel web sitesi teklifi.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 rounded-sm bg-[#0F172A] px-10 py-5 font-[family-name:var(--font-raleway)] text-base font-600 uppercase tracking-wider text-white shadow-xl transition-all hover:bg-[#1E293B] hover:shadow-2xl">
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-[#0F172A]/10 py-16">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: '📏', title: 'Ücretsiz Ölçüm', desc: 'Yerinize geliriz, ölçüm ve keşif ücretsiz.' },
            { icon: '⚡', title: '48 Saat Teslimat', desc: 'Profesyonel web siteniz 48 saat içinde hazır.' },
            { icon: '🌡️', title: 'Isı Yalıtım', desc: 'Enerji tasarruflu yalıtım sistemleri.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="rounded-sm border border-[#0F172A]/10 bg-white p-6 text-center shadow-sm">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-raleway)] text-sm font-600 uppercase tracking-wider text-[#64748B]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-open-sans)] text-sm text-[#0F172A]/50">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-[#0F172A]/10 py-8 text-center font-[family-name:var(--font-open-sans)] text-sm text-[#0F172A]/30">
        <p>Bu sayfa <strong className="text-[#0F172A]/50">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
