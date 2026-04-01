'use client'

import { Merriweather, Source_Sans_3 } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const merriweather = Merriweather({ subsets: ['latin-ext'], weight: ['300', '400', '700', '900'], variable: '--font-merri', display: 'swap' })
const sourceSans = Source_Sans_3({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700'], variable: '--font-source', display: 'swap' })

const fadeInUp = { hidden: { opacity: 0, y: 35 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
const scaleIn = { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromLeft = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromRight = { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }

export default function EtutMerkezleriTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)
  const heroImg = props.images?.hero
  const studyImg = props.images?.study

  return (
    <div className={`${merriweather.variable} ${sourceSans.variable} min-h-screen bg-[#FFFBEB] text-gray-900`}>
      {/* ═══════════════════ HERO — Open Book Pages: kitap sayfaları fan şeklinde açılıyor ═══════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7] to-[#FFFBEB]">
        {/* Book pages fanning out */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {[-20, -10, 0, 10, 20].map((angle, i) => (
            <div key={angle} className="absolute left-1/2 top-1/2 h-[500px] w-[350px] origin-bottom -translate-x-1/2 -translate-y-full rounded-t-lg border border-[#D97706]" style={{ transform: `translateX(-50%) translateY(-100%) rotate(${angle}deg)`, opacity: 0.03 + i * 0.005 }} />
          ))}
        </div>

        {/* Pencil accent */}
        <div className="pointer-events-none absolute right-[12%] top-[25%] h-40 w-3 rotate-[30deg] rounded-t-full bg-[#D97706]/5" />

        {heroImg && (
          <div className="absolute inset-0">
            <img src={heroImg} alt={`${props.firmName} etüt`} className="h-full w-full object-cover" style={{ opacity: 0.12 }} />
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFFBEB]/95 via-[#FFFBEB]/85 to-[#FFFBEB]/60" />
          </div>
        )}

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="grid w-full items-center gap-12 lg:grid-cols-2">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#D97706]/10 px-5 py-2">
                <span className="text-sm">📚</span>
                <span className="font-[family-name:var(--font-source)] text-xs font-600 uppercase tracking-[0.25em] text-[#D97706]">
                  {props.city} &bull; Etüt Merkezi
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-merri)] text-4xl font-900 leading-[1.15] text-gray-900 sm:text-5xl lg:text-6xl">
                Başarıya
                <br />
                <span className="text-[#D97706]">Giden Yol</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="mt-5 max-w-md font-[family-name:var(--font-source)] text-lg leading-relaxed text-gray-500">
                {props.firmName} — {props.city}&apos;de birebir ve grup etüt, ödev takibi, sınav hazırlık.
                Deneyimli öğretmenler, sessiz çalışma ortamı.
              </motion.p>

              <motion.div variants={fadeInUp} className="mt-6 flex flex-wrap gap-3">
                {['İlkokul', 'Ortaokul', 'Lise', 'LGS Hazırlık', 'Ödev Takibi'].map((s) => (
                  <span key={s} className="rounded-full border border-[#D97706]/20 bg-[#D97706]/8 px-4 py-2 font-[family-name:var(--font-source)] text-xs font-500 text-[#92400E]">{s}</span>
                ))}
              </motion.div>

              <motion.div variants={fadeInUp} className="mt-8">
                <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 rounded-xl bg-[#D97706] px-8 py-4 font-[family-name:var(--font-merri)] text-sm font-700 text-white shadow-lg shadow-[#D97706]/25 transition-all hover:bg-[#B45309]">
                  Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              </motion.div>
            </motion.div>

            {/* Sağ — Ders kartları */}
            <motion.div variants={scaleIn} initial="hidden" animate="visible" className="hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                {[{ icon: '🧮', name: 'Matematik' }, { icon: '🔬', name: 'Fen Bilimleri' }, { icon: '📖', name: 'Türkçe' }, { icon: '🌍', name: 'Sosyal Bilgiler' }, { icon: '🇬🇧', name: 'İngilizce' }, { icon: '📐', name: 'Geometri' }].map((d) => (
                  <div key={d.name} className="rounded-2xl border border-[#D97706]/10 bg-white/60 p-5 shadow-sm backdrop-blur-sm">
                    <div className="mb-2 text-2xl">{d.icon}</div>
                    <div className="font-[family-name:var(--font-merri)] text-sm font-700 text-gray-800">{d.name}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-white py-20"><div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
          <motion.div variants={fadeInUp} className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-red-50 px-5 py-2"><span className="text-lg">⚠️</span><span className="font-[family-name:var(--font-source)] text-sm font-600 text-red-500">Dikkat</span></motion.div>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-merri)] text-3xl font-700 text-gray-900 sm:text-4xl">Veliler etüt merkezi ararken <span className="text-red-500">internetten araştırıyor</span></motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-source)] text-lg text-gray-500">Web siteniz yoksa veliler güvenemez, çocuğunu göndermez.</motion.p>
        </motion.div>
      </div></section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-[#FEF3C7] py-20"><div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-merri)] text-3xl font-700 text-gray-900 sm:text-4xl">Web Siteniz <span className="text-[#D97706]">Olursa</span> / <span className="text-red-500">Olmazsa</span></motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="rounded-2xl border border-[#D97706]/20 bg-white p-8"><div className="mb-4 text-2xl">✅</div><h3 className="mb-4 font-[family-name:var(--font-merri)] text-lg font-700 text-gray-900">Olursa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-source)] text-sm text-gray-600">
                {['Online kayıt formu ile veli kazanırsınız', 'Eğitmen kadronuzu tanıtırsınız', 'Başarı hikayeleri güven oluşturur', 'Google\'da "etüt merkezi + şehir" aramasında çıkarsınız', 'Ders programı şeffaf görünür'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-[#D97706]">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="rounded-2xl border border-red-200 bg-white p-8"><div className="mb-4 text-2xl">❌</div><h3 className="mb-4 font-[family-name:var(--font-merri)] text-lg font-700 text-gray-900">Olmazsa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-source)] text-sm text-gray-600">
                {['Veliler rakip etüt merkezini tercih eder', 'Eğitmen bilgileriniz bilinmez', 'Ders programınız paylaşılamaz', 'Sadece el ilanıyla sınırlı kalırsınız', 'Kurumsal güven oluşturulamaz'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-red-400">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div></section>

      {studyImg && (<section className="py-8"><div className="mx-auto max-w-5xl px-4 sm:px-6"><motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="overflow-hidden rounded-2xl border border-[#D97706]/10 shadow-lg"><img src={studyImg} alt={`${props.firmName} çalışma ortamı`} className="w-full object-cover" style={{ aspectRatio: '4/3' }} /></motion.div></div></section>)}

      <section className="bg-[#D97706] py-20"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-merri)] text-3xl font-700 text-white sm:text-4xl">{props.firmName} İçin<br />Profesyonel Web Sitenizi Oluşturalım</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-source)] text-white/80">Ücretsiz demo — taahhüt yok.</motion.p>
          <motion.div variants={fadeInUp} className="mt-8"><a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 rounded-xl bg-white px-10 py-4 font-[family-name:var(--font-merri)] text-sm font-700 text-[#D97706] shadow-lg transition-all hover:bg-gray-50">Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></a></motion.div>
        </motion.div>
      </div></section>

      <section className="py-16"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6"><motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}><motion.div variants={scaleIn} className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#D97706]/10"><span className="text-2xl">🔒</span></motion.div><motion.h3 variants={fadeInUp} className="font-[family-name:var(--font-merri)] text-lg font-700 text-gray-900">Taahhüt Yok, Risk Yok</motion.h3><motion.p variants={fadeInUp} className="mt-2 font-[family-name:var(--font-source)] text-sm text-gray-400">Demo tamamen ücretsizdir.</motion.p></motion.div></div></section>

      <footer className="border-t border-[#D97706]/10 py-8"><div className="mx-auto max-w-5xl px-4 text-center sm:px-6"><p className="font-[family-name:var(--font-source)] text-xs text-gray-300">© {new Date().getFullYear()} Vorte Studio — {props.firmName} için özel olarak hazırlanmıştır.</p></div></footer>
    </div>
  )
}
