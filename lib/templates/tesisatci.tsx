'use client'

import { Poppins, Source_Sans_3 } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const poppins = Poppins({
  subsets: ['latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
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

export default function TesisatciTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const serviceImg = props.images?.service

  return (
    <div className={`${poppins.variable} ${sourceSans.variable} min-h-screen bg-white text-[#0F172A]`}>
      {/* ═══════════════════ HERO — Water Pipe Network + Droplet Frame ═══════════════════ */}
      <section className="relative overflow-hidden bg-[#1E3A5F] pb-20 pt-16 text-white">
        {/* Water pipe network SVG pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="pipes" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                {/* Horizontal pipe */}
                <rect x="0" y="55" width="50" height="10" rx="5" fill="none" stroke="#0EA5E9" strokeWidth="1" />
                {/* Vertical pipe */}
                <rect x="55" y="0" width="10" height="50" rx="5" fill="none" stroke="#0EA5E9" strokeWidth="1" />
                {/* Elbow joint */}
                <path d="M50,60 Q65,60 65,50" fill="none" stroke="#0EA5E9" strokeWidth="1" />
                {/* T-joint */}
                <rect x="70" y="75" width="50" height="10" rx="5" fill="none" stroke="#0EA5E9" strokeWidth="1" />
                <rect x="90" y="75" width="10" height="45" rx="5" fill="none" stroke="#0EA5E9" strokeWidth="1" />
                {/* Valve */}
                <circle cx="95" cy="80" r="6" fill="none" stroke="#0EA5E9" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pipes)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* 24 saat acil servis strip */}
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="mb-8">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 rounded-full bg-[#0EA5E9] px-6 py-3 shadow-lg shadow-[#0EA5E9]/20">
              <span className="text-lg">💧</span>
              <span className="font-[family-name:var(--font-poppins)] text-sm font-600 uppercase tracking-wider">
                24 Saat Acil Tesisat Servisi
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
          >
            <div className="space-y-8">
              <motion.div variants={fadeInUp} className="flex items-center gap-3">
                <div className="h-1 w-10 bg-[#0EA5E9]" />
                <span className="font-[family-name:var(--font-source-sans)] text-sm font-600 uppercase tracking-[0.3em] text-[#0EA5E9]">
                  {props.city} &bull; Tesisatçı
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-poppins)] text-5xl font-700 leading-tight sm:text-6xl lg:text-7xl">
                Su Kaçağı
                <br />
                Tıkanıklık
                <br />
                <span className="text-[#0EA5E9]">Çözülür</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="max-w-md font-[family-name:var(--font-source-sans)] text-base leading-relaxed text-white/60">
                <strong className="text-white">{props.firmName}</strong> — su kaçağı tespiti, tıkanıklık
                açma, pis su, temiz su tesisatı. Hızlı müdahale, kalıcı çözüm.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 bg-[#0EA5E9] px-8 py-4 font-[family-name:var(--font-poppins)] text-base font-600 uppercase tracking-wider text-white shadow-lg shadow-[#0EA5E9]/20 transition-all hover:bg-[#0284C7] hover:shadow-xl"
                >
                  Ücretsiz Teklif Al
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              {(props.googleRating || props.googleReviews) && (
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 rounded-full bg-white/10 px-5 py-3 backdrop-blur-sm">
                  <div className="flex gap-0.5 text-[#0EA5E9]">
                    {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <span className="font-[family-name:var(--font-source-sans)] text-sm text-white/60">
                    {props.googleRating} ({props.googleReviews}+ yorum)
                  </span>
                </motion.div>
              )}
            </div>

            {/* Sağ — Water droplet-shaped frame */}
            <motion.div variants={scaleIn} className="relative">
              {/* Droplet shape via clip-path */}
              <div className="relative overflow-hidden rounded-3xl bg-[#0F2A45]" style={{ clipPath: 'ellipse(90% 95% at 50% 55%)' }}>
                <div className="aspect-[4/3]">
                  {heroImg ? (
                    <img src={heroImg} alt={`${props.firmName} tesisat`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#0EA5E9]/5">
                      <div className="text-center">
                        <div className="text-6xl">🔧</div>
                        <p className="mt-3 font-[family-name:var(--font-source-sans)] text-sm text-white/30">Servis Görseli</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Water droplet floating icons */}
              <div className="absolute -right-2 top-12 flex h-14 w-14 items-center justify-center rounded-full bg-[#0EA5E9] shadow-lg">
                <span className="text-2xl">💧</span>
              </div>
              <div className="absolute -left-2 bottom-16 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg">
                <span className="text-xl">🔧</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#0EA5E9] py-20 text-white">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2 text-sm">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-poppins)] font-600 uppercase tracking-wider">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-poppins)] text-3xl font-700 sm:text-4xl">
            Tesisat Arızasında İnsanlar
            <br />
            <span className="text-[#1E3A5F]">Hemen Çözüm Arıyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-source-sans)] text-lg text-white/80">
            Su kaçağı ve tıkanıklıklarda insanların <strong className="text-white">%85&apos;i</strong> acil
            müdahale yapacak güvenilir tesisatçı arıyor. Web siteniz yoksa güven veremiyorsunuz.
          </motion.p>

          {serviceImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden rounded-2xl border-2 border-white/20">
              <img src={serviceImg} alt={`${props.firmName} servis`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '💧', stat: '%85', text: 'Acil çözüm istiyor' },
              { emoji: '📱', stat: '%78', text: 'Telefondan arıyor' },
              { emoji: '⭐', stat: '%62', text: 'Yorumları okuyor' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="rounded-xl bg-white/10 p-5 backdrop-blur-sm">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-poppins)] text-2xl font-700 text-[#1E3A5F]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-source-sans)] text-sm text-white/70">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-poppins)] text-3xl font-700 sm:text-4xl">
            Web Sitesi <span className="text-[#0EA5E9]">Olan</span> vs <span className="text-[#0F172A]/30">Olmayan</span> Tesisatçı
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="rounded-2xl border border-[#0EA5E9]/20 bg-[#0EA5E9]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-poppins)] text-lg font-600 text-[#0EA5E9]">✅ Web Sitesi Olan Usta</div>
              <ul className="space-y-3 font-[family-name:var(--font-source-sans)] text-[#0F172A]/70">
                {['Acil servis bilgisi hemen erişilebilir', 'Hizmet bölgesi ve ulaşım bilgisi mevcut', 'Google\'da "tesisatçı" aramasında çıkıyor', 'Müşteri yorumları güven veriyor', '24 saat teklif talebi alıyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-[#0EA5E9]">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="rounded-2xl border border-[#0F172A]/10 bg-[#0F172A]/[0.03] p-8">
              <div className="mb-4 font-[family-name:var(--font-poppins)] text-lg font-600 text-[#0F172A]/30">❌ Web Sitesi Olmayan Usta</div>
              <ul className="space-y-3 font-[family-name:var(--font-source-sans)] text-[#0F172A]/30">
                {['Acil durumlarda bulunamıyor', 'Hizmet bölgesi bilinmiyor', 'Arama sonuçlarında görünmüyor', 'Güvenilirliğini kanıtlayamıyor', 'Sadece çevresinden müşteri buluyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="bg-[#1E3A5F] py-24 text-white">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="text-4xl">💧</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-poppins)] text-3xl font-700 sm:text-4xl lg:text-5xl">
            Tesisat Sorunlarınız <span className="text-[#0EA5E9]">Çözülsün</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-source-sans)] text-base text-white/60">
            Taahhüt yok, zorlama yok — {props.firmName} ile ücretsiz keşif ve arıza tespiti.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 bg-[#0EA5E9] px-10 py-5 font-[family-name:var(--font-poppins)] text-lg font-600 uppercase tracking-wider text-white shadow-xl shadow-[#0EA5E9]/20 transition-all hover:bg-[#0284C7] hover:shadow-2xl">
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
            { icon: '💧', title: '24 Saat Acil Servis', desc: 'Su kaçağı ve tıkanıklıklarda anında müdahale.' },
            { icon: '🔧', title: 'Kalıcı Çözüm', desc: 'Geçici değil kalıcı tesisat çözümleri.' },
            { icon: '💰', title: 'Şeffaf Fiyat', desc: 'İşe başlamadan önce net fiyat bilgisi.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="rounded-2xl border border-[#0EA5E9]/10 bg-[#F0F9FF] p-6 text-center">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-poppins)] text-base font-600 text-[#0EA5E9]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-source-sans)] text-sm text-[#0F172A]/50">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-[#0EA5E9]/10 py-8 text-center font-[family-name:var(--font-source-sans)] text-sm text-[#0F172A]/30">
        <p>Bu sayfa <strong className="text-[#0F172A]/50">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
