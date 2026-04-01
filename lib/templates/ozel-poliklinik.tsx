'use client'

import { Plus_Jakarta_Sans, Inter } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700', '800'], variable: '--font-jakarta', display: 'swap' })
const inter = Inter({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700'], variable: '--font-inter', display: 'swap' })

const fadeInUp = { hidden: { opacity: 0, y: 35 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
const scaleIn = { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromLeft = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromRight = { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }

export default function OzelPoliklinikTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)
  const heroImg = props.images?.hero
  const clinicImg = props.images?.clinic

  return (
    <div className={`${jakarta.variable} ${inter.variable} min-h-screen bg-white text-gray-900`}>
      {/* ═══════════════════ HERO — ECG Heartbeat Line: kalp atışı çizgisi + tıbbi haç ═══════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#ECFEFF] via-white to-white">
        {/* ECG heartbeat line */}
        <div className="pointer-events-none absolute inset-0">
          <svg className="absolute bottom-[40%] left-0 h-24 w-full" viewBox="0 0 1440 100" preserveAspectRatio="none">
            <polyline points="0,50 200,50 240,50 260,15 280,85 300,30 320,70 340,50 500,50 540,50 560,15 580,85 600,30 620,70 640,50 900,50 940,50 960,15 980,85 1000,30 1020,70 1040,50 1440,50" fill="none" stroke="rgba(8,145,178,0.07)" strokeWidth="2" />
          </svg>
        </div>

        {/* Medical cross */}
        <div className="pointer-events-none absolute right-[10%] top-[15%]">
          <div className="relative h-32 w-32 opacity-[0.04]">
            <div className="absolute left-1/2 top-0 h-full w-10 -translate-x-1/2 bg-[#0891B2]" />
            <div className="absolute left-0 top-1/2 h-10 w-full -translate-y-1/2 bg-[#0891B2]" />
          </div>
        </div>

        {heroImg && (
          <div className="absolute inset-0">
            <img src={heroImg} alt={`${props.firmName} poliklinik`} className="h-full w-full object-cover" style={{ opacity: 0.12 }} />
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/60" />
          </div>
        )}

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-2xl">
            <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#0891B2]/10 px-5 py-2">
              <span className="text-sm">🏥</span>
              <span className="font-[family-name:var(--font-inter)] text-xs font-600 uppercase tracking-[0.25em] text-[#0891B2]">
                {props.city} &bull; Özel Poliklinik
              </span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-jakarta)] text-5xl font-800 leading-[1.08] sm:text-6xl lg:text-7xl">
              Sağlığınız
              <br />
              <span className="text-[#0891B2]">Güvende</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="mt-5 max-w-lg font-[family-name:var(--font-inter)] text-lg leading-relaxed text-gray-500">
              {props.firmName} — {props.city}&apos;de uzman hekim kadrosu, modern teşhis ve tedavi hizmetleri.
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-6 flex flex-wrap gap-3">
              {['Dahiliye', 'Ortopedi', 'KBB', 'Göz', 'Laboratuvar', 'Görüntüleme'].map((s) => (
                <span key={s} className="rounded-full border border-[#0891B2]/15 bg-[#0891B2]/5 px-4 py-2 font-[family-name:var(--font-inter)] text-xs font-500 text-[#0891B2]">{s}</span>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-8 flex gap-4">
              <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 rounded-xl bg-[#0891B2] px-8 py-4 font-[family-name:var(--font-jakarta)] text-sm font-600 text-white shadow-lg shadow-[#0891B2]/25 transition-all hover:bg-[#0E7490]">
                Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#ECFEFF] py-20"><div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
          <motion.div variants={fadeInUp} className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-red-50 px-5 py-2"><span className="text-lg">⚠️</span><span className="font-[family-name:var(--font-inter)] text-sm font-600 text-red-500">Dikkat</span></motion.div>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-jakarta)] text-3xl font-700 text-gray-900 sm:text-4xl">Hastalar poliklinik ararken <span className="text-red-500">önce internete bakıyor</span></motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-inter)] text-lg text-gray-500">Web siteniz yoksa randevu almak isteyen hastalar sizi bulamıyor, rakibi tercih ediyor.</motion.p>
        </motion.div>
      </div></section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="py-20"><div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-jakarta)] text-3xl font-700 text-gray-900 sm:text-4xl">Web Siteniz <span className="text-[#0891B2]">Olursa</span> / <span className="text-red-500">Olmazsa</span></motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="rounded-2xl border border-[#0891B2]/20 bg-[#ECFEFF] p-8"><div className="mb-4 text-2xl">✅</div><h3 className="mb-4 font-[family-name:var(--font-jakarta)] text-lg font-600 text-gray-900">Olursa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-inter)] text-sm text-gray-600">
                {['Online randevu ile hasta kaybını önlersiniz', 'Branş ve hekim kadrosu güven oluşturur', 'Laboratuvar sonuçları online erişim sağlar', 'Google\'da "poliklinik + şehir" aramasında çıkarsınız', 'Hasta yorumları itibar artırır'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-[#0891B2]">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="rounded-2xl border border-red-200 bg-red-50 p-8"><div className="mb-4 text-2xl">❌</div><h3 className="mb-4 font-[family-name:var(--font-jakarta)] text-lg font-600 text-gray-900">Olmazsa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-inter)] text-sm text-gray-600">
                {['Hastalar rakip polikliniklere yönelir', 'Telefon trafiği yoğunlaşır, randevu kaçar', 'Branş bilgileriniz bilinmez', 'Güven algısı oluşturulamaz', 'Dijital hasta deneyimi sunulamaz'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-red-400">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div></section>

      {clinicImg && (<section className="py-8"><div className="mx-auto max-w-5xl px-4 sm:px-6"><motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="overflow-hidden rounded-2xl border border-gray-100 shadow-lg"><img src={clinicImg} alt={`${props.firmName} klinik`} className="w-full object-cover" style={{ aspectRatio: '4/3' }} /></motion.div></div></section>)}

      <section className="bg-[#0891B2] py-20"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-jakarta)] text-3xl font-700 text-white sm:text-4xl">{props.firmName} İçin<br />Profesyonel Web Sitenizi Oluşturalım</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-inter)] text-white/80">Ücretsiz demo — taahhüt yok.</motion.p>
          <motion.div variants={fadeInUp} className="mt-8"><a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 rounded-xl bg-white px-10 py-4 font-[family-name:var(--font-jakarta)] text-sm font-600 text-[#0891B2] shadow-lg transition-all hover:bg-gray-50">Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></a></motion.div>
        </motion.div>
      </div></section>

      <section className="py-16"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6"><motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}><motion.div variants={scaleIn} className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#0891B2]/10"><span className="text-2xl">🔒</span></motion.div><motion.h3 variants={fadeInUp} className="font-[family-name:var(--font-jakarta)] text-lg font-600 text-gray-900">Taahhüt Yok, Risk Yok</motion.h3><motion.p variants={fadeInUp} className="mt-2 font-[family-name:var(--font-inter)] text-sm text-gray-400">Demo tamamen ücretsizdir.</motion.p></motion.div></div></section>

      <footer className="border-t border-gray-100 py-8"><div className="mx-auto max-w-5xl px-4 text-center sm:px-6"><p className="font-[family-name:var(--font-inter)] text-xs text-gray-300">© {new Date().getFullYear()} Vorte Studio — {props.firmName} için özel olarak hazırlanmıştır.</p></div></footer>
    </div>
  )
}
