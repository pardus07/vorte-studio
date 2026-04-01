'use client'

import { Exo_2, Nunito } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const exo2 = Exo_2({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700', '800'], variable: '--font-exo', display: 'swap' })
const nunito = Nunito({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700'], variable: '--font-nunito', display: 'swap' })

const fadeInUp = { hidden: { opacity: 0, y: 35 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
const scaleIn = { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromLeft = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromRight = { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }

export default function OtoYikamaTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)
  const heroImg = props.images?.hero
  const serviceImg = props.images?.service

  return (
    <div className={`${exo2.variable} ${nunito.variable} min-h-screen bg-[#0C4A6E] text-white`}>
      {/* ═══════════════════ HERO — Water Wave Splash: su dalgası + köpük efekti ═══════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-[#0C4A6E]">
        {/* Wave pattern */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="h-32 w-full">
            <path d="M0,100 C360,180 720,20 1080,100 C1260,140 1380,60 1440,80 L1440,200 L0,200 Z" fill="rgba(56,189,248,0.06)" />
            <path d="M0,120 C300,60 600,160 900,100 C1100,60 1300,140 1440,100 L1440,200 L0,200 Z" fill="rgba(56,189,248,0.04)" />
          </svg>
        </div>

        {/* Foam bubbles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[{ x: '15%', y: '30%', s: 60 }, { x: '80%', y: '25%', s: 40 }, { x: '65%', y: '60%', s: 50 }, { x: '25%', y: '65%', s: 35 }, { x: '90%', y: '50%', s: 45 }].map((b, i) => (
            <div key={i} className="absolute rounded-full border border-[#38BDF8]/10 bg-[#38BDF8]/3" style={{ left: b.x, top: b.y, width: b.s, height: b.s }} />
          ))}
        </div>

        {heroImg && (
          <div className="absolute inset-0">
            <img src={heroImg} alt={`${props.firmName} oto yıkama`} className="h-full w-full object-cover" style={{ opacity: 0.90 }} />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0C4A6E]/90 via-[#0C4A6E]/60 to-[#0C4A6E]/80" />
          </div>
        )}

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="mx-auto max-w-3xl text-center">
            <motion.div variants={fadeInUp} className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-[#38BDF8]/20 bg-[#38BDF8]/10 px-5 py-2">
              <span className="text-sm">🚿</span>
              <span className="font-[family-name:var(--font-nunito)] text-xs font-600 uppercase tracking-[0.25em] text-[#38BDF8]">
                {props.city} &bull; Oto Yıkama
              </span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-exo)] text-5xl font-800 leading-[1.08] sm:text-6xl lg:text-7xl">
              Aracınız
              <br />
              <span className="text-[#38BDF8]">Pırıl Pırıl</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="mx-auto mt-5 max-w-lg font-[family-name:var(--font-nunito)] text-lg leading-relaxed text-white/50">
              {props.firmName} — {props.city}&apos;de iç-dış yıkama, detaylı temizlik, pasta-cila.
              Aracınıza özel bakım, pırıl pırıl teslimat.
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-6 flex flex-wrap justify-center gap-3">
              {['İç Yıkama', 'Dış Yıkama', 'Detailing', 'Pasta Cila', 'Motor Yıkama'].map((s) => (
                <span key={s} className="rounded-full border border-[#38BDF8]/20 bg-[#38BDF8]/10 px-4 py-2 font-[family-name:var(--font-nunito)] text-xs font-500 text-[#38BDF8]">{s}</span>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-8">
              <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 rounded-xl bg-[#38BDF8] px-8 py-4 font-[family-name:var(--font-exo)] text-sm font-700 text-[#0C4A6E] shadow-lg shadow-[#38BDF8]/25 transition-all hover:bg-[#7DD3FC]">
                Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="border-t border-white/5 py-20"><div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
          <motion.div variants={fadeInUp} className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-red-500/10 px-5 py-2"><span className="text-lg">⚠️</span><span className="font-[family-name:var(--font-nunito)] text-sm font-600 text-red-400">Dikkat</span></motion.div>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-exo)] text-3xl font-700 text-white sm:text-4xl">Araç sahipleri yıkama <span className="text-red-400">fiyat ve yorum</span> karşılaştırıyor</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-nunito)] text-lg text-white/45">Web siteniz yoksa müşteriler Google&apos;daki rakibinizi tercih ediyor.</motion.p>
        </motion.div>
      </div></section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-[#164E63] py-20"><div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-exo)] text-3xl font-700 text-white sm:text-4xl">Web Siteniz <span className="text-[#38BDF8]">Olursa</span> / <span className="text-red-400">Olmazsa</span></motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="rounded-2xl border border-[#38BDF8]/20 bg-[#38BDF8]/5 p-8"><div className="mb-4 text-2xl">✅</div><h3 className="mb-4 font-[family-name:var(--font-exo)] text-lg font-600 text-white">Olursa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-nunito)] text-sm text-white/60">
                {['Online randevu ile bekleme süresini azaltırsınız', 'Paket fiyatlarınızı şeffaf sunarsınız', 'Öncesi-sonrası fotoğraflarla güven verirsiniz', 'Google\'da "oto yıkama + şehir" aramasında çıkarsınız', 'Sadık müşteri programı oluşturursunuz'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-[#38BDF8]">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="rounded-2xl border border-red-500/15 bg-red-500/5 p-8"><div className="mb-4 text-2xl">❌</div><h3 className="mb-4 font-[family-name:var(--font-exo)] text-lg font-600 text-white">Olmazsa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-nunito)] text-sm text-white/60">
                {['Müşteriler rastgele yıkamacıya gider', 'Fiyat avantajınız bilinmez', 'Kalite farkınızı gösteremezsiniz', 'Sadece çevre müşteriniz olur', 'Detailing hizmeti satışı düşer'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-red-400">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div></section>

      {serviceImg && (<section className="py-16"><div className="mx-auto max-w-5xl px-4 sm:px-6"><motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="overflow-hidden rounded-2xl border border-white/10"><img src={serviceImg} alt={`${props.firmName} hizmet`} className="w-full object-cover" style={{ aspectRatio: '4/3' }} /></motion.div></div></section>)}

      <section className="bg-[#38BDF8] py-20"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-exo)] text-3xl font-700 text-[#0C4A6E] sm:text-4xl">{props.firmName} İçin<br />Profesyonel Web Sitenizi Oluşturalım</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-nunito)] text-[#0C4A6E]/70">Ücretsiz demo — taahhüt yok.</motion.p>
          <motion.div variants={fadeInUp} className="mt-8"><a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 rounded-xl bg-[#0C4A6E] px-10 py-4 font-[family-name:var(--font-exo)] text-sm font-700 text-white shadow-lg transition-all hover:bg-[#164E63]">Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></a></motion.div>
        </motion.div>
      </div></section>

      <section className="py-16"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6"><motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}><motion.div variants={scaleIn} className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#38BDF8]/10"><span className="text-2xl">🔒</span></motion.div><motion.h3 variants={fadeInUp} className="font-[family-name:var(--font-exo)] text-lg font-700 text-white">Taahhüt Yok, Risk Yok</motion.h3><motion.p variants={fadeInUp} className="mt-2 font-[family-name:var(--font-nunito)] text-sm text-white/40">Demo tamamen ücretsizdir.</motion.p></motion.div></div></section>

      <footer className="border-t border-white/5 py-8"><div className="mx-auto max-w-5xl px-4 text-center sm:px-6"><p className="font-[family-name:var(--font-nunito)] text-xs text-white/25">© {new Date().getFullYear()} Vorte Studio — {props.firmName} için özel olarak hazırlanmıştır.</p></div></footer>
    </div>
  )
}
