'use client'

import { Archivo, Inter } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const archivo = Archivo({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700', '800'], variable: '--font-archivo', display: 'swap' })
const inter = Inter({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700'], variable: '--font-inter', display: 'swap' })

const fadeInUp = { hidden: { opacity: 0, y: 35 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
const scaleIn = { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromLeft = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromRight = { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }

export default function AluminyumDogramaTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)
  const heroImg = props.images?.hero
  const projectImg = props.images?.project

  return (
    <div className={`${archivo.variable} ${inter.variable} min-h-screen bg-[#F1F5F9] text-gray-900`}>
      {/* ═══════════════════ HERO — Brushed Metal Grid: fırçalanmış metal profil ızgara ═══════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#E2E8F0] via-[#F1F5F9] to-white">
        {/* Metallic grid lines */}
        <div className="pointer-events-none absolute inset-0">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="none">
            {/* Horizontal aluminum profiles */}
            <rect x="0" y="200" width="1440" height="6" fill="url(#metalGrad)" opacity="0.08" rx="1" />
            <rect x="0" y="400" width="1440" height="6" fill="url(#metalGrad)" opacity="0.06" rx="1" />
            <rect x="0" y="600" width="1440" height="6" fill="url(#metalGrad)" opacity="0.04" rx="1" />
            {/* Vertical profiles */}
            <rect x="300" y="0" width="6" height="900" fill="url(#metalGradV)" opacity="0.06" rx="1" />
            <rect x="700" y="0" width="6" height="900" fill="url(#metalGradV)" opacity="0.05" rx="1" />
            <rect x="1100" y="0" width="6" height="900" fill="url(#metalGradV)" opacity="0.04" rx="1" />
            {/* Corner joints */}
            <rect x="296" y="196" width="14" height="14" fill="rgba(71,85,105,0.08)" rx="2" />
            <rect x="696" y="196" width="14" height="14" fill="rgba(71,85,105,0.06)" rx="2" />
            <rect x="296" y="396" width="14" height="14" fill="rgba(71,85,105,0.06)" rx="2" />
            <rect x="696" y="396" width="14" height="14" fill="rgba(71,85,105,0.05)" rx="2" />
            <defs>
              <linearGradient id="metalGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#94A3B8" stopOpacity="0" />
                <stop offset="30%" stopColor="#94A3B8" stopOpacity="1" />
                <stop offset="70%" stopColor="#94A3B8" stopOpacity="1" />
                <stop offset="100%" stopColor="#94A3B8" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="metalGradV" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#94A3B8" stopOpacity="0" />
                <stop offset="30%" stopColor="#94A3B8" stopOpacity="1" />
                <stop offset="70%" stopColor="#94A3B8" stopOpacity="1" />
                <stop offset="100%" stopColor="#94A3B8" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {heroImg && (
          <div className="absolute inset-0">
            <img src={heroImg} alt={`${props.firmName} aluminyum dograma`} className="h-full w-full object-cover" style={{ opacity: 0.90 }} />
            <div className="absolute inset-0 bg-gradient-to-r from-[#F1F5F9]/70 via-[#F1F5F9]/50 to-[#F1F5F9]/20" />
          </div>
        )}

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="grid w-full items-center gap-12 lg:grid-cols-2">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-sm border-l-4 border-[#0284C7] bg-[#0284C7]/8 px-5 py-2">
                <span className="font-[family-name:var(--font-inter)] text-xs font-600 uppercase tracking-[0.25em] text-[#0284C7]">{props.city} &bull; Alüminyum Doğrama</span>
              </motion.div>
              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-archivo)] text-5xl font-800 leading-[1.08] sm:text-6xl lg:text-7xl">
                Modern
                <br /><span className="text-[#0284C7]">Dayanıklı</span>
              </motion.h1>
              <motion.p variants={fadeInUp} className="mt-5 max-w-lg font-[family-name:var(--font-inter)] text-lg leading-relaxed text-gray-500">
                {props.firmName} — {props.city}&apos;de alüminyum pencere, kapı, cephe giydirme, pergola. Hafif, dayanıklı, modern görünüm.
              </motion.p>
              <motion.div variants={fadeInUp} className="mt-6 flex flex-wrap gap-3">
                {['Pencere', 'Kapı', 'Cephe', 'Pergola', 'Korkuluk', 'Sürme'].map((s) => (
                  <span key={s} className="rounded-sm border border-[#0284C7]/15 bg-[#0284C7]/5 px-4 py-2 font-[family-name:var(--font-inter)] text-xs font-500 text-[#0284C7]">{s}</span>
                ))}
              </motion.div>
              <motion.div variants={fadeInUp} className="mt-8">
                <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 rounded-lg bg-[#0284C7] px-8 py-4 font-[family-name:var(--font-archivo)] text-sm font-600 text-white shadow-lg shadow-[#0284C7]/25 transition-all hover:bg-[#0369A1]">
                  Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              </motion.div>
            </motion.div>
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="hidden space-y-4 lg:block">
              {[{ icon: '🏗️', title: 'Cephe Giydirme', desc: 'Kompozit & alüminyum panel' }, { icon: '🪟', title: 'Sürme Sistem', desc: 'Minimal & ışıklı alanlar' }, { icon: '🛡️', title: 'Korozyon Direnci', desc: 'Anodize & elektrostatik boya' }, { icon: '📐', title: 'Özel Ölçü', desc: 'Projeye özel üretim' }].map((item) => (
                <motion.div key={item.title} variants={fadeInUp} className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white/60 p-4 shadow-sm">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[#0284C7]/10 text-xl">{item.icon}</div>
                  <div><div className="font-[family-name:var(--font-archivo)] text-sm font-600 text-gray-900">{item.title}</div><div className="font-[family-name:var(--font-inter)] text-xs text-gray-400">{item.desc}</div></div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-[#E2E8F0] py-20"><div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
          <motion.div variants={fadeInUp} className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-red-50 px-5 py-2"><span className="text-lg">⚠️</span><span className="font-[family-name:var(--font-inter)] text-sm font-600 text-red-500">Dikkat</span></motion.div>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-archivo)] text-3xl font-700 text-gray-900 sm:text-4xl">Alüminyum doğrama arayanlar <span className="text-red-500">referans ve proje görseli</span> istiyor</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-inter)] text-lg text-gray-500">Web siteniz yoksa müşteriler profesyonel görünen rakibinizi seçiyor.</motion.p>
        </motion.div>
      </div></section>

      <section className="py-20"><div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-archivo)] text-3xl font-700 text-gray-900 sm:text-4xl">Web Siteniz <span className="text-[#0284C7]">Olursa</span> / <span className="text-red-500">Olmazsa</span></motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="rounded-xl border border-[#0284C7]/20 bg-[#0284C7]/5 p-8"><div className="mb-4 text-2xl">✅</div><h3 className="mb-4 font-[family-name:var(--font-archivo)] text-lg font-600 text-gray-900">Olursa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-inter)] text-sm text-gray-600">
                {['Proje galeriniz güven oluşturur', 'Profil seçenekleriniz şeffaf sunulur', 'Online teklif formu müşteri kazandırır', 'Google\'da "alüminyum doğrama + şehir" aramasında çıkabilirsiniz', 'Referanslarınız her zaman görünür'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-[#0284C7]">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="rounded-xl border border-red-200 bg-red-50 p-8"><div className="mb-4 text-2xl">❌</div><h3 className="mb-4 font-[family-name:var(--font-archivo)] text-lg font-600 text-gray-900">Olmazsa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-inter)] text-sm text-gray-600">
                {['Müşteriler zincir markalara yönelir', 'Proje deneyiminiz bilinmez', 'Fiyat teklifi almak zorlaşır', 'Profesyonel imaj oluşturulamaz', 'Sadece tavsiye ile sınırlı kalırsınız'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-red-400">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div></section>

      {projectImg && (<section className="py-8"><div className="mx-auto max-w-5xl px-4 sm:px-6"><motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="overflow-hidden rounded-xl border border-gray-200 shadow-lg"><img src={projectImg} alt={`${props.firmName} proje`} className="w-full object-cover" style={{ aspectRatio: '4/3' }} /></motion.div></div></section>)}

      <section className="bg-[#0284C7] py-20"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-archivo)] text-3xl font-700 text-white sm:text-4xl">{props.firmName} İçin<br />Profesyonel Web Sitenizi Oluşturalım</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-inter)] text-white/80">Ücretsiz demo — taahhüt yok.</motion.p>
          <motion.div variants={fadeInUp} className="mt-8"><a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 rounded-lg bg-white px-10 py-4 font-[family-name:var(--font-archivo)] text-sm font-600 text-[#0284C7] shadow-lg transition-all hover:bg-gray-50">Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></a></motion.div>
        </motion.div>
      </div></section>

      <section className="py-16"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6"><motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}><motion.div variants={scaleIn} className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#0284C7]/10"><span className="text-2xl">🔒</span></motion.div><motion.h3 variants={fadeInUp} className="font-[family-name:var(--font-archivo)] text-lg font-600 text-gray-900">Taahhüt Yok, Risk Yok</motion.h3><motion.p variants={fadeInUp} className="mt-2 font-[family-name:var(--font-inter)] text-sm text-gray-400">Demo tamamen ücretsizdir.</motion.p></motion.div></div></section>

      <footer className="border-t border-gray-100 py-8"><div className="mx-auto max-w-5xl px-4 text-center sm:px-6"><p className="font-[family-name:var(--font-inter)] text-xs text-gray-300">© {new Date().getFullYear()} Vorte Studio — {props.firmName} için özel olarak hazırlanmıştır.</p></div></footer>
    </div>
  )
}
