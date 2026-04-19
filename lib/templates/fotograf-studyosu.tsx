'use client'

import { Cormorant_Garamond, Raleway } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { suffixDe, suffixIn } from './turkish-grammar'
import { useTrackPageView, trackEvent } from './use-track'

const cormorant = Cormorant_Garamond({ subsets: ['latin-ext'], weight: ['400', '500', '600', '700'], variable: '--font-cormorant', display: 'swap' })
const raleway = Raleway({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700'], variable: '--font-raleway', display: 'swap' })

const fadeInUp = { hidden: { opacity: 0, y: 35 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
const scaleIn = { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromLeft = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromRight = { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }

export default function FotografStudyosuTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)
  const heroImg = props.images?.hero
  const portfolioImg = props.images?.portfolio

  return (
    <div className={`${cormorant.variable} ${raleway.variable} min-h-screen bg-[#0A0A0A] text-white`}>
      {/* ═══════════════════ HERO — Camera Aperture: diyafram SVG + ışık hüzmesi + sanatsal ═══════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-[#0A0A0A]">
        {/* Aperture blade SVG overlay */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <svg className="h-[800px] w-[800px]" viewBox="0 0 400 400" fill="none" style={{ opacity: 0.04 }}>
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <line key={angle} x1="200" y1="200" x2={200 + 180 * Math.cos((angle * Math.PI) / 180)} y2={200 + 180 * Math.sin((angle * Math.PI) / 180)} stroke="#D4AF37" strokeWidth="0.5" />
            ))}
            <circle cx="200" cy="200" r="80" stroke="#D4AF37" strokeWidth="0.5" />
            <circle cx="200" cy="200" r="150" stroke="#D4AF37" strokeWidth="0.3" />
          </svg>
        </div>

        {/* Light shaft — dramatic directional light */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-[600px] w-[200px] rotate-[30deg] bg-gradient-to-b from-[#D4AF37]/8 via-[#D4AF37]/3 to-transparent blur-[60px]" />

        {heroImg && (
          <div className="absolute inset-0">
            <img src={heroImg} alt={`${props.firmName} fotoğraf`} className="h-full w-full object-cover" style={{ opacity: 0.3 }} />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/90 via-[#0A0A0A]/60 to-[#0A0A0A]/40" />
          </div>
        )}

        <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 sm:px-6 lg:px-8">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="w-full text-center lg:text-left">
            <motion.div variants={fadeInUp} className="mb-5 inline-flex items-center gap-3">
              <div className="h-px w-12 bg-[#D4AF37]/40" />
              <span className="font-[family-name:var(--font-raleway)] text-xs font-500 uppercase tracking-[0.4em] text-[#D4AF37]/70">
                {props.city} &bull; Fotoğraf Stüdyosu
              </span>
              <div className="h-px w-12 bg-[#D4AF37]/40" />
            </motion.div>

            <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-cormorant)] text-5xl font-700 italic leading-[1.05] sm:text-6xl lg:text-7xl">
              Her An
              <br />
              Bir <span className="text-[#D4AF37]">Hikaye</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-raleway)] text-lg leading-relaxed text-white/40 lg:mx-0">
              {props.firmName} — {suffixDe(props.city)} düğün, bebek, kurumsal ve etkinlik fotoğrafçılığı.
              Anılarınızı profesyonel karelerle ölümsüzleştiriyoruz.
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              {['Düğün', 'Bebek', 'Kurumsal', 'Mezuniyet', 'Ürün Çekimi'].map((s) => (
                <span key={s} className="border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-2 font-[family-name:var(--font-raleway)] text-xs font-500 uppercase tracking-wider text-[#D4AF37]/70">{s}</span>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-8 flex justify-center lg:justify-start">
              <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 bg-[#D4AF37] px-8 py-4 font-[family-name:var(--font-raleway)] text-sm font-600 uppercase tracking-wider text-[#0A0A0A] transition-all hover:bg-[#B8962E]">
                Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="border-t border-white/5 py-20"><div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
          <motion.div variants={fadeInUp} className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-red-500/10 px-5 py-2"><span className="text-lg">⚠️</span><span className="font-[family-name:var(--font-raleway)] text-sm font-600 text-red-400">Dikkat</span></motion.div>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-cormorant)] text-3xl font-700 italic text-white sm:text-4xl">Düğün fotoğrafçısı arayanlar <span className="text-red-400">portfolyo</span> inceliyor</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-raleway)] text-lg text-white/40">Web siteniz yoksa çalışmalarınızı gösteremez, karar aşamasında elenirsiniz.</motion.p>
        </motion.div>
      </div></section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-[#111111] py-20"><div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-cormorant)] text-3xl font-700 italic text-white sm:text-4xl">Web Siteniz <span className="text-[#D4AF37]">Olursa</span> / <span className="text-red-400">Olmazsa</span></motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-8"><div className="mb-4 text-2xl">✅</div><h3 className="mb-4 font-[family-name:var(--font-cormorant)] text-xl font-700 text-white">Olursa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-raleway)] text-sm text-white/60">
                {['Portfolyonuz profesyonelce sergilenir', 'Paket fiyatlar güven oluşturur', 'Google\'da "fotoğrafçı + şehir" aramasında çıkarsınız', 'Online randevu ve teklif alırsınız', 'Referanslar ile rakiplerden ayrışırsınız'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-[#D4AF37]">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="border border-red-500/15 bg-red-500/5 p-8"><div className="mb-4 text-2xl">❌</div><h3 className="mb-4 font-[family-name:var(--font-cormorant)] text-xl font-700 text-white">Olmazsa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-raleway)] text-sm text-white/60">
                {['Çalışmalarınız sosyal medyaya sıkışır', 'Fiyat şeffaflığı olmadan güven kaybolur', 'Karar aşamasında değerlendirilmezsiniz', 'Profesyonel algı oluşmaz', 'İş hacminiz sınırlı kalır'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-red-400">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div></section>

      {portfolioImg && (<section className="py-16"><div className="mx-auto max-w-5xl px-4 sm:px-6"><motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="overflow-hidden border border-white/10"><img src={portfolioImg} alt={`${props.firmName} portfolyo`} className="w-full object-cover" style={{ aspectRatio: '16/9' }} /></motion.div></div></section>)}

      <section className="bg-[#D4AF37] py-20"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-cormorant)] text-3xl font-700 italic text-[#0A0A0A] sm:text-4xl">{props.firmName} İçin<br />Profesyonel Web Sitenizi Oluşturalım</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-raleway)] text-[#0A0A0A]/70">Ücretsiz demo — taahhüt yok.</motion.p>
          <motion.div variants={fadeInUp} className="mt-8"><a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 bg-[#0A0A0A] px-10 py-4 font-[family-name:var(--font-raleway)] text-sm font-600 uppercase tracking-wider text-white transition-all hover:bg-[#1a1a1a]">Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></a></motion.div>
        </motion.div>
      </div></section>

      <section className="py-16"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6"><motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}><motion.div variants={scaleIn} className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF37]/10"><span className="text-2xl">🔒</span></motion.div><motion.h3 variants={fadeInUp} className="font-[family-name:var(--font-cormorant)] text-lg font-600 text-white">Taahhüt Yok, Risk Yok</motion.h3><motion.p variants={fadeInUp} className="mt-2 font-[family-name:var(--font-raleway)] text-sm text-white/40">Demo tamamen ücretsizdir.</motion.p></motion.div></div></section>

      <footer className="border-t border-white/5 py-8"><div className="mx-auto max-w-5xl px-4 text-center sm:px-6"><p className="font-[family-name:var(--font-raleway)] text-xs text-white/25">© {new Date().getFullYear()} Vorte Studio — {props.firmName} için özel olarak hazırlanmıştır.</p></div></footer>
    </div>
  )
}
