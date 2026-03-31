'use client'

import { Oswald, Source_Sans_3 } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const oswald = Oswald({ subsets: ['latin-ext'], weight: ['400', '500', '600', '700'], variable: '--font-oswald', display: 'swap' })
const sourceSans = Source_Sans_3({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700'], variable: '--font-source-sans', display: 'swap' })

const fadeInUp = { hidden: { opacity: 0, y: 35 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
const scaleIn = { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromLeft = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromRight = { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }

export default function KombiServisiTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)
  const heroImg = props.images?.hero
  const serviceImg = props.images?.service

  return (
    <div className={`${oswald.variable} ${sourceSans.variable} min-h-screen bg-white text-[#1C1917]`}>
      {/* ═══════════════════ HERO — Emergency Banner + Split Layout: üstte acil kırmızı bant ═══════════════════ */}

      {/* Acil servis banner — dikkat çeken üst bant */}
      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="bg-[#DC2626] px-4 py-3 text-center">
        <div className="flex items-center justify-center gap-3">
          <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
          <span className="font-[family-name:var(--font-oswald)] text-sm font-600 uppercase tracking-wider text-white">
            7/24 Acil Kombi Servisi — Hemen Arayın
          </span>
          <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
        </div>
      </motion.div>

      <section className="relative min-h-[85vh] overflow-hidden bg-[#1E3A5F]">
        {/* Warmth gradient — alev/sıcaklık hissi */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#1E3A5F] via-[#1E3A5F] to-[#F97316]/10" />

        {/* Hero bg image */}
        {heroImg && (
          <div className="absolute inset-0">
            <img src={heroImg} alt={`${props.firmName} kombi`} className="h-full w-full object-cover" style={{ opacity: 0.35 }} />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1E3A5F]/90 via-[#1E3A5F]/60 to-[#1E3A5F]/30" />
          </div>
        )}

        <div className="relative mx-auto flex min-h-[85vh] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="grid w-full items-center gap-12 lg:grid-cols-2">
            {/* Sol — metin */}
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#F97316]/20 px-4 py-2">
                <span className="text-lg">🔥</span>
                <span className="font-[family-name:var(--font-source-sans)] text-xs font-600 uppercase tracking-[0.25em] text-[#FDBA74]">
                  {props.city} &bull; Kombi Servisi
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-oswald)] text-4xl font-700 uppercase leading-tight text-white sm:text-5xl lg:text-6xl">
                Kışın Kombiniz
                <br />
                <span className="text-[#F97316]">Soğuk mu?</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="mt-5 max-w-md font-[family-name:var(--font-source-sans)] text-lg leading-relaxed text-white/60">
                {props.firmName} — {props.city}&apos;de kombi arıza, bakım ve montaj servisi.
                Tüm markalarda yetkili teknik ekip, garantili hizmet.
              </motion.p>

              {/* Stat cards */}
              <motion.div variants={fadeInUp} className="mt-8 grid grid-cols-3 gap-4">
                {[
                  { num: '7/24', label: 'Acil Servis' },
                  { num: '2 Saat', label: 'Ortalama Varış' },
                  { num: '1 Yıl', label: 'İşçilik Garantisi' },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg border border-white/10 bg-white/5 p-3 text-center">
                    <div className="font-[family-name:var(--font-oswald)] text-xl font-700 text-[#F97316]">{s.num}</div>
                    <div className="font-[family-name:var(--font-source-sans)] text-[10px] font-500 uppercase tracking-wider text-white/50">{s.label}</div>
                  </div>
                ))}
              </motion.div>

              <motion.div variants={fadeInUp} className="mt-8">
                <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 bg-[#F97316] px-8 py-4 font-[family-name:var(--font-oswald)] text-sm font-600 uppercase tracking-wider text-white transition-all hover:bg-[#EA580C] hover:shadow-lg hover:shadow-[#F97316]/25">
                  Ücretsiz Teklif Al
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              </motion.div>
            </motion.div>

            {/* Sağ — Brands / Trust */}
            <motion.div variants={scaleIn} initial="hidden" animate="visible" className="hidden lg:block">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                <h3 className="mb-4 font-[family-name:var(--font-oswald)] text-sm font-600 uppercase tracking-wider text-white/40">Yetkili Servis Markalarımız</h3>
                <div className="grid grid-cols-3 gap-3">
                  {['Baymak', 'Demirdöküm', 'Vaillant', 'Buderus', 'Ariston', 'Bosch'].map((m) => (
                    <div key={m} className="flex items-center justify-center rounded-lg border border-white/10 bg-white/5 p-3">
                      <span className="font-[family-name:var(--font-source-sans)] text-sm font-500 text-white/60">{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="py-20"><div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
          <motion.div variants={fadeInUp} className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-red-50 px-5 py-2"><span className="text-lg">⚠️</span><span className="font-[family-name:var(--font-source-sans)] text-sm font-600 text-red-700">Dikkat — Kaçırıyorsunuz</span></motion.div>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-oswald)] text-3xl font-700 uppercase text-[#1C1917] sm:text-4xl">Kombi arızasında herkes <span className="text-red-600">acil yetkili servis</span> arıyor</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-source-sans)] text-lg text-[#78716C]">İlk sırada olmazsanız rakibinizi arıyorlar. Web siteniz yoksa sıralamada yer alamazsınız.</motion.p>
        </motion.div>
      </div></section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-[#F8FAFC] py-20"><div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-oswald)] text-3xl font-700 uppercase text-[#1C1917] sm:text-4xl">Web Siteniz <span className="text-[#F97316]">Olursa</span> / <span className="text-red-500">Olmazsa</span></motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="rounded-2xl border-2 border-[#F97316]/20 bg-white p-8">
              <div className="mb-4 text-2xl">✅</div><h3 className="mb-4 font-[family-name:var(--font-oswald)] text-lg font-600 uppercase text-[#1C1917]">Olursa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-source-sans)] text-sm text-[#57534E]">
                {['Google\'da "kombi servisi + şehir" aramasında çıkarsınız', 'Acil servis CTA ile anında çağrı alırsınız', 'Marka uzmanlıklarınız güven verir', 'Yıllık bakım paketi online satışa çıkar', 'Referanslar ve garantiler görünür olur'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-[#F97316]">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="rounded-2xl border border-red-100 bg-red-50/50 p-8">
              <div className="mb-4 text-2xl">❌</div><h3 className="mb-4 font-[family-name:var(--font-oswald)] text-lg font-600 uppercase text-[#1C1917]">Olmazsa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-source-sans)] text-sm text-[#57534E]">
                {['Acil çağrılar rakibinize gider', 'Yetkili servis güvencesi iletemezsiniz', 'Bakım paketi satamazsınız', 'Sezon başında müşteri bulamazsınız', 'Profesyonel imaj oluşturamazsınız'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-red-400">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div></section>

      {serviceImg && (<section className="py-16"><div className="mx-auto max-w-5xl px-4 sm:px-6"><motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="overflow-hidden rounded-2xl"><img src={serviceImg} alt={`${props.firmName} servis`} className="w-full object-cover" style={{ aspectRatio: '4/3' }} /></motion.div></div></section>)}

      <section className="bg-[#1E3A5F] py-20"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-oswald)] text-3xl font-700 uppercase text-white sm:text-4xl">{props.firmName} İçin<br /><span className="text-[#F97316]">Profesyonel Web Sitenizi Oluşturalım</span></motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-source-sans)] text-white/60">Ücretsiz demo — taahhüt yok.</motion.p>
          <motion.div variants={fadeInUp} className="mt-8"><a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 bg-[#F97316] px-10 py-4 font-[family-name:var(--font-oswald)] text-sm font-600 uppercase tracking-wider text-white transition-all hover:bg-[#EA580C]">Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></a></motion.div>
        </motion.div>
      </div></section>

      <section className="py-16"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6"><motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}><motion.div variants={scaleIn} className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F97316]/10"><span className="text-2xl">🔒</span></motion.div><motion.h3 variants={fadeInUp} className="font-[family-name:var(--font-oswald)] text-lg font-600 uppercase text-[#1C1917]">Taahhüt Yok, Risk Yok</motion.h3><motion.p variants={fadeInUp} className="mt-2 font-[family-name:var(--font-source-sans)] text-sm text-[#78716C]">Demo tamamen ücretsizdir.</motion.p></motion.div></div></section>

      <footer className="border-t border-[#E5E7EB] py-8"><div className="mx-auto max-w-5xl px-4 text-center sm:px-6"><p className="font-[family-name:var(--font-source-sans)] text-xs text-[#94A3B8]">© {new Date().getFullYear()} Vorte Studio — {props.firmName} için özel olarak hazırlanmıştır.</p></div></footer>
    </div>
  )
}
