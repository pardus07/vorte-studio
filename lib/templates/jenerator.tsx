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

export default function JeneratorTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)
  const heroImg = props.images?.hero
  const productImg = props.images?.product

  return (
    <div className={`${oswald.variable} ${sourceSans.variable} min-h-screen bg-[#111111] text-white`}>
      {/* ═══════════════════ HERO — Power Pulse Grid: sarı enerji pulse + endüstriyel grid ═══════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-[#0A0A0A]">
        {/* Industrial grid overlay */}
        <div className="pointer-events-none absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(252,211,77,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(252,211,77,0.03) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }} />

        {/* Pulse glow — energy */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FCD34D]/5 blur-[150px]" />
          <div className="absolute left-1/4 top-1/3 h-40 w-40 rounded-full bg-[#FCD34D]/8 blur-[80px]" />
        </div>

        {/* Hero bg */}
        {heroImg && (
          <div className="absolute inset-0">
            <img src={heroImg} alt={`${props.firmName} jeneratör`} className="h-full w-full object-cover" style={{ opacity: 0.35 }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-[#0A0A0A]/50 to-[#0A0A0A]/30" />
          </div>
        )}

        {/* Yellow bottom power line */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FCD34D] to-transparent" />

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="grid w-full items-center gap-12 lg:grid-cols-2">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <motion.div variants={fadeInUp} className="mb-6 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-[#FCD34D]">
                  <span className="font-[family-name:var(--font-oswald)] text-sm font-700 text-[#0A0A0A]">⚡</span>
                </div>
                <span className="font-[family-name:var(--font-source-sans)] text-xs font-600 uppercase tracking-[0.3em] text-[#FCD34D]/70">{props.city} &bull; Jeneratör</span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-oswald)] text-5xl font-700 uppercase leading-[0.95] sm:text-6xl lg:text-7xl">
                Kesintisiz
                <br />
                <span className="text-[#FCD34D]">Güç</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="mt-5 max-w-md font-[family-name:var(--font-source-sans)] text-lg leading-relaxed text-white/50">
                {props.firmName} — {props.city}&apos;de jeneratör satış, kiralama, bakım ve arıza servisi.
                Her güç kapasitesinde çözümler.
              </motion.p>

              {/* Power capacity badges */}
              <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-3">
                {['Satış', 'Kiralama', 'Bakım', 'Arıza Servisi', 'Yedek Parça'].map((s) => (
                  <span key={s} className="border border-[#FCD34D]/20 px-4 py-2 font-[family-name:var(--font-oswald)] text-xs font-500 uppercase tracking-wider text-[#FCD34D]/60">{s}</span>
                ))}
              </motion.div>

              <motion.div variants={fadeInUp} className="mt-8">
                <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 bg-[#FCD34D] px-8 py-4 font-[family-name:var(--font-oswald)] text-sm font-600 uppercase tracking-wider text-[#0A0A0A] transition-all hover:bg-[#FBBF24] hover:shadow-lg hover:shadow-[#FCD34D]/20">
                  Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              </motion.div>
            </motion.div>

            {/* Sağ — Power stats */}
            <motion.div variants={scaleIn} initial="hidden" animate="visible" className="hidden lg:block">
              <div className="space-y-4">
                {[
                  { kva: '30-100 kVA', desc: 'Konut & Küçük İşletme' },
                  { kva: '100-500 kVA', desc: 'Fabrika & Sanayi' },
                  { kva: '500+ kVA', desc: 'Büyük Tesis & Enerji' },
                ].map((p) => (
                  <div key={p.kva} className="flex items-center gap-4 rounded-xl border border-[#FCD34D]/10 bg-white/5 p-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#FCD34D]/10">
                      <span className="text-xl">⚡</span>
                    </div>
                    <div>
                      <div className="font-[family-name:var(--font-oswald)] text-lg font-600 text-[#FCD34D]">{p.kva}</div>
                      <div className="font-[family-name:var(--font-source-sans)] text-sm text-white/40">{p.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="border-t border-white/5 py-20"><div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
          <motion.div variants={fadeInUp} className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-red-500/10 px-5 py-2"><span className="text-lg">⚠️</span><span className="font-[family-name:var(--font-source-sans)] text-sm font-600 text-red-400">Dikkat</span></motion.div>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-oswald)] text-3xl font-700 uppercase text-white sm:text-4xl">Elektrik kesintisinde herkes <span className="text-red-400">acil jeneratör</span> arıyor</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-source-sans)] text-lg text-white/50">Web siteniz yoksa o acil aramada sizi bulamıyorlar.</motion.p>
        </motion.div>
      </div></section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-[#1A1A1A] py-20"><div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-oswald)] text-3xl font-700 uppercase text-white sm:text-4xl">Web Siteniz <span className="text-[#FCD34D]">Olursa</span> / <span className="text-red-400">Olmazsa</span></motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="rounded-xl border border-[#FCD34D]/20 bg-[#FCD34D]/5 p-8"><div className="mb-4 text-2xl">✅</div><h3 className="mb-4 font-[family-name:var(--font-oswald)] text-lg font-600 uppercase text-white">Olursa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-source-sans)] text-sm text-white/70">
                {['Güç kapasiteleri ve fiyatlar online görünür', 'Google\'da "jeneratör + şehir" aramasında çıkarsınız', 'Kiralama/satış seçenekleri netleşir', 'Bakım paketleri online sunulur', 'Referans projeler güven oluşturur'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-[#FCD34D]">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="rounded-xl border border-red-500/20 bg-red-500/5 p-8"><div className="mb-4 text-2xl">❌</div><h3 className="mb-4 font-[family-name:var(--font-oswald)] text-lg font-600 uppercase text-white">Olmazsa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-source-sans)] text-sm text-white/70">
                {['Müşteriler kapasite bilgilerinizi göremez', 'Güven oluşturmak zorlaşır', 'Kiralama talepleri rakibe gider', 'Bakım sözleşmeleri online satılamaz', 'İş fırsatlarını kaçırırsınız'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-red-400">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div></section>

      {productImg && (<section className="py-16"><div className="mx-auto max-w-5xl px-4 sm:px-6"><motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="overflow-hidden rounded-xl border border-white/10"><img src={productImg} alt={`${props.firmName} ürün`} className="w-full object-cover" style={{ aspectRatio: '4/3' }} /></motion.div></div></section>)}

      <section className="bg-[#FCD34D] py-20"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-oswald)] text-3xl font-700 uppercase text-[#0A0A0A] sm:text-4xl">{props.firmName} İçin<br />Profesyonel Web Sitenizi Oluşturalım</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-source-sans)] text-[#0A0A0A]/70">Ücretsiz demo — taahhüt yok.</motion.p>
          <motion.div variants={fadeInUp} className="mt-8"><a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 bg-[#0A0A0A] px-10 py-4 font-[family-name:var(--font-oswald)] text-sm font-600 uppercase tracking-wider text-white transition-all hover:bg-[#1A1A1A]">Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></a></motion.div>
        </motion.div>
      </div></section>

      <section className="py-16"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6"><motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}><motion.div variants={scaleIn} className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FCD34D]/10"><span className="text-2xl">🔒</span></motion.div><motion.h3 variants={fadeInUp} className="font-[family-name:var(--font-oswald)] text-lg font-600 uppercase text-white">Taahhüt Yok, Risk Yok</motion.h3><motion.p variants={fadeInUp} className="mt-2 font-[family-name:var(--font-source-sans)] text-sm text-white/40">Demo tamamen ücretsizdir.</motion.p></motion.div></div></section>

      <footer className="border-t border-white/5 py-8"><div className="mx-auto max-w-5xl px-4 text-center sm:px-6"><p className="font-[family-name:var(--font-source-sans)] text-xs text-white/30">© {new Date().getFullYear()} Vorte Studio — {props.firmName} için özel olarak hazırlanmıştır.</p></div></footer>
    </div>
  )
}
