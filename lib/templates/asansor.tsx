'use client'

import { Rajdhani, Source_Sans_3 } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const rajdhani = Rajdhani({ subsets: ['latin-ext'], weight: ['400', '500', '600', '700'], variable: '--font-rajdhani', display: 'swap' })
const sourceSans = Source_Sans_3({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700'], variable: '--font-source-sans', display: 'swap' })

const fadeInUp = { hidden: { opacity: 0, y: 35 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
const scaleIn = { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromLeft = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromRight = { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }

export default function AsansorTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)
  const heroImg = props.images?.hero
  const projectImg = props.images?.project

  return (
    <div className={`${rajdhani.variable} ${sourceSans.variable} min-h-screen bg-[#F8FAFC] text-[#1E293B]`}>
      {/* ═══════════════════ HERO — Vertical Shaft Perspective: dikey yükselen çizgiler + perspektif ═══════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-[#1E293B]">
        {/* Vertical shaft lines — elevator shaft perspective */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[20%] top-0 h-full w-px bg-gradient-to-b from-[#C0C0C0]/20 via-[#C0C0C0]/5 to-transparent" />
          <div className="absolute left-[35%] top-0 h-full w-px bg-gradient-to-b from-[#C0C0C0]/10 via-transparent to-[#C0C0C0]/10" />
          <div className="absolute right-[20%] top-0 h-full w-px bg-gradient-to-b from-[#C0C0C0]/20 via-[#C0C0C0]/5 to-transparent" />
          <div className="absolute right-[35%] top-0 h-full w-px bg-gradient-to-b from-[#C0C0C0]/10 via-transparent to-[#C0C0C0]/10" />
          {/* Horizontal floor indicators */}
          <div className="absolute left-[20%] right-[20%] top-[20%] h-px bg-[#C0C0C0]/5" />
          <div className="absolute left-[20%] right-[20%] top-[40%] h-px bg-[#C0C0C0]/5" />
          <div className="absolute left-[20%] right-[20%] top-[60%] h-px bg-[#C0C0C0]/5" />
          <div className="absolute left-[20%] right-[20%] top-[80%] h-px bg-[#C0C0C0]/5" />
        </div>

        {/* Hero bg */}
        {heroImg && (
          <div className="absolute inset-0">
            <img src={heroImg} alt={`${props.firmName} asansör`} className="h-full w-full object-cover" style={{ opacity: 0.35 }} />
            <div className="absolute inset-0 bg-gradient-to-b from-[#1E293B]/70 via-[#1E293B]/50 to-[#1E293B]/90" />
          </div>
        )}

        {/* Floor number indicator — left side */}
        <div className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 hidden lg:block">
          <div className="flex flex-col items-center gap-4">
            {['12', '11', '10', '09', '08'].map((f, i) => (
              <span key={f} className="font-[family-name:var(--font-rajdhani)] text-sm font-500" style={{ color: i === 2 ? '#DC2626' : 'rgba(192,192,192,0.2)' }}>{f}</span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-4 text-center sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 rounded border border-[#C0C0C0]/20 bg-white/5 px-5 py-2 backdrop-blur-sm">
              <div className="h-6 w-px bg-[#DC2626]" />
              <span className="font-[family-name:var(--font-source-sans)] text-xs font-500 uppercase tracking-[0.35em] text-[#C0C0C0]/70">
                {props.city} &bull; Asansör Bakım & Montaj
              </span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-rajdhani)] text-5xl font-700 leading-[1.05] text-white sm:text-6xl lg:text-7xl">
              Asansörünüzün
              <br />
              <span className="bg-gradient-to-r from-[#C0C0C0] to-white bg-clip-text text-transparent">Güvenliği</span>
              <br />
              <span className="text-[#DC2626]">Bizim İşimiz</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="mx-auto max-w-lg font-[family-name:var(--font-source-sans)] text-lg leading-relaxed text-white/50">
              {props.firmName} — {props.city}&apos;de asansör montaj, periyodik bakım ve acil arıza servisi.
              TSE belgeli, sigortalı hizmet.
            </motion.p>

            {/* Service badges — metallic style */}
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-3">
              {['Periyodik Bakım', 'Acil Arıza', 'Yeni Montaj', 'Modernizasyon', 'TSE Belgeli'].map((s) => (
                <span key={s} className="border border-[#C0C0C0]/15 bg-white/5 px-4 py-2 font-[family-name:var(--font-rajdhani)] text-xs font-500 uppercase tracking-wider text-[#C0C0C0]/60">{s}</span>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp}>
              <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 bg-[#DC2626] px-8 py-4 font-[family-name:var(--font-rajdhani)] text-sm font-600 uppercase tracking-wider text-white transition-all hover:bg-[#B91C1C] hover:shadow-lg hover:shadow-[#DC2626]/25">
                Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="py-20"><div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
          <motion.div variants={fadeInUp} className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-red-50 px-5 py-2"><span className="text-lg">⚠️</span><span className="font-[family-name:var(--font-source-sans)] text-sm font-600 text-red-700">Dikkat</span></motion.div>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-rajdhani)] text-3xl font-700 text-[#1E293B] sm:text-4xl">Bina yöneticileri <span className="text-red-600">güvenilir asansör firması</span> arıyor</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-source-sans)] text-lg text-[#64748B]">Web siteniz yoksa referanslarınızı ve belgelerinizi gösteremezsiniz. Müşteriler güvenilir görünen rakibinize gider.</motion.p>
        </motion.div>
      </div></section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-white py-20"><div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-rajdhani)] text-3xl font-700 text-[#1E293B] sm:text-4xl">Web Siteniz <span className="text-[#1E293B]">Olursa</span> / <span className="text-red-500">Olmazsa</span></motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="rounded-2xl border-2 border-[#1E293B]/10 bg-[#F8FAFC] p-8"><div className="mb-4 text-2xl">✅</div><h3 className="mb-4 font-[family-name:var(--font-rajdhani)] text-lg font-600 text-[#1E293B]">Web Siteniz Olursa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-source-sans)] text-sm text-[#475569]">
                {['TSE ve sigorta belgeleriniz görünür olur', 'Bakım planları online sunulur', 'Referans projeleriniz güven oluşturur', 'Acil arıza servisi CTA ile çağrı alırsınız', 'Bina yönetimleri sizi kolayca bulur'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-[#1E293B]">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="rounded-2xl border border-red-100 bg-red-50/50 p-8"><div className="mb-4 text-2xl">❌</div><h3 className="mb-4 font-[family-name:var(--font-rajdhani)] text-lg font-600 text-[#1E293B]">Web Siteniz Olmazsa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-source-sans)] text-sm text-[#475569]">
                {['Belgelerinizi gösteremezsiniz', 'Güven oluşturmak zorlaşır', 'Rakipler online fark yaratır', 'Acil çağrılar size gelmez', 'İş hacminiz sınırlı kalır'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-red-400">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div></section>

      {projectImg && (<section className="py-16"><div className="mx-auto max-w-5xl px-4 sm:px-6"><motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="overflow-hidden rounded-2xl"><img src={projectImg} alt={`${props.firmName} proje`} className="w-full object-cover" style={{ aspectRatio: '4/3' }} /></motion.div></div></section>)}

      <section className="bg-[#1E293B] py-20"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-rajdhani)] text-3xl font-700 text-white sm:text-4xl">{props.firmName} İçin<br /><span className="text-[#DC2626]">Profesyonel Web Sitenizi Oluşturalım</span></motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-source-sans)] text-white/60">Ücretsiz demo — taahhüt yok.</motion.p>
          <motion.div variants={fadeInUp} className="mt-8"><a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 bg-[#DC2626] px-10 py-4 font-[family-name:var(--font-rajdhani)] text-sm font-600 uppercase tracking-wider text-white transition-all hover:bg-[#B91C1C]">Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></a></motion.div>
        </motion.div>
      </div></section>

      <section className="py-16"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6"><motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}><motion.div variants={scaleIn} className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#1E293B]/10"><span className="text-2xl">🔒</span></motion.div><motion.h3 variants={fadeInUp} className="font-[family-name:var(--font-rajdhani)] text-lg font-600 text-[#1E293B]">Taahhüt Yok, Risk Yok</motion.h3><motion.p variants={fadeInUp} className="mt-2 font-[family-name:var(--font-source-sans)] text-sm text-[#64748B]">Demo tamamen ücretsizdir.</motion.p></motion.div></div></section>

      <footer className="border-t border-[#E2E8F0] py-8"><div className="mx-auto max-w-5xl px-4 text-center sm:px-6"><p className="font-[family-name:var(--font-source-sans)] text-xs text-[#94A3B8]">© {new Date().getFullYear()} Vorte Studio — {props.firmName} için özel olarak hazırlanmıştır.</p></div></footer>
    </div>
  )
}
