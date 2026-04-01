'use client'

import { Outfit, Inter } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const outfit = Outfit({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700', '800'], variable: '--font-outfit', display: 'swap' })
const inter = Inter({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700'], variable: '--font-inter', display: 'swap' })

const fadeInUp = { hidden: { opacity: 0, y: 35 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
const scaleIn = { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromLeft = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromRight = { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }

export default function PvcDogramaTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)
  const heroImg = props.images?.hero
  const projectImg = props.images?.project

  return (
    <div className={`${outfit.variable} ${inter.variable} min-h-screen bg-[#F8FAFC] text-gray-900`}>
      {/* ═══════════════════ HERO — Window Frame + Light Rays: pencere çerçevesi + ışık huzmeleri ═══════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#F8FAFC] via-white to-[#EFF6FF]">
        {/* Window frame outline */}
        <div className="pointer-events-none absolute right-[10%] top-[15%] h-[400px] w-[300px]">
          <div className="absolute inset-0 border-4 border-[#2563EB]/5 rounded-sm" />
          <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-[#2563EB]/5" />
          <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-[#2563EB]/5" />
          {/* Light rays through window */}
          <div className="absolute left-[20%] top-[10%] h-[350px] w-[80px] rotate-[15deg] bg-gradient-to-b from-[#2563EB]/4 to-transparent" />
          <div className="absolute left-[55%] top-[10%] h-[300px] w-[60px] rotate-[20deg] bg-gradient-to-b from-[#2563EB]/3 to-transparent" />
        </div>

        {heroImg && (
          <div className="absolute inset-0">
            <img src={heroImg} alt={`${props.firmName} PVC doğrama`} className="h-full w-full object-cover" style={{ opacity: 0.35 }} />
            <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/50 to-white/20" />
          </div>
        )}

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-2xl">
            <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#2563EB]/10 px-5 py-2">
              <span className="text-sm">🪟</span>
              <span className="font-[family-name:var(--font-inter)] text-xs font-600 uppercase tracking-[0.25em] text-[#2563EB]">{props.city} &bull; PVC Doğrama</span>
            </motion.div>
            <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-outfit)] text-5xl font-800 leading-[1.08] sm:text-6xl lg:text-7xl">
              Isı Yalıtımı
              <br /><span className="text-[#2563EB]">Sessizlik</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="mt-5 max-w-lg font-[family-name:var(--font-inter)] text-lg leading-relaxed text-gray-500">
              {props.firmName} — {props.city}&apos;de PVC pencere, kapı, sürme sistem. Enerji tasarrufu, ses yalıtımı, 10 yıl garanti.
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-6 flex flex-wrap gap-3">
              {['Pencere', 'Kapı', 'Sürme', 'Katlanır', 'Isıcamlı'].map((s) => (
                <span key={s} className="rounded-full border border-[#2563EB]/15 bg-[#2563EB]/5 px-4 py-2 font-[family-name:var(--font-inter)] text-xs font-500 text-[#2563EB]">{s}</span>
              ))}
            </motion.div>
            <motion.div variants={fadeInUp} className="mt-8">
              <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-8 py-4 font-[family-name:var(--font-outfit)] text-sm font-600 text-white shadow-lg shadow-[#2563EB]/25 transition-all hover:bg-[#1D4ED8]">
                Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="bg-[#EFF6FF] py-20"><div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
          <motion.div variants={fadeInUp} className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-red-50 px-5 py-2"><span className="text-lg">⚠️</span><span className="font-[family-name:var(--font-inter)] text-sm font-600 text-red-500">Dikkat</span></motion.div>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-outfit)] text-3xl font-700 text-gray-900 sm:text-4xl">PVC doğrama arayanlar <span className="text-red-500">referans ve fiyat</span> karşılaştırıyor</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-inter)] text-lg text-gray-500">Web siteniz yoksa müşteriler sizi atlayıp rakibinizden teklif alıyor.</motion.p>
        </motion.div>
      </div></section>

      <section className="py-20"><div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-outfit)] text-3xl font-700 text-gray-900 sm:text-4xl">Web Siteniz <span className="text-[#2563EB]">Olursa</span> / <span className="text-red-500">Olmazsa</span></motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="rounded-2xl border border-[#2563EB]/20 bg-[#EFF6FF] p-8"><div className="mb-4 text-2xl">✅</div><h3 className="mb-4 font-[family-name:var(--font-outfit)] text-lg font-600 text-gray-900">Olursa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-inter)] text-sm text-gray-600">
                {['Proje galerisi ile güven oluşturursunuz', 'Online teklif formu müşteri kazandırır', 'Ürün özellikleri şeffaf sunulur', 'Google\'da "PVC doğrama + şehir" aramasında çıkarsınız', 'Garanti koşullarınız görünür olur'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-[#2563EB]">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="rounded-2xl border border-red-200 bg-red-50 p-8"><div className="mb-4 text-2xl">❌</div><h3 className="mb-4 font-[family-name:var(--font-outfit)] text-lg font-600 text-gray-900">Olmazsa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-inter)] text-sm text-gray-600">
                {['Müşteriler zincir markalara yönelir', 'Referanslarınız bilinmez', 'Fiyat teklifi almak zorlaşır', 'Garanti avantajınız görünmez', 'Profesyonel imaj oluşturulamaz'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-red-400">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div></section>

      {projectImg && (<section className="py-8"><div className="mx-auto max-w-5xl px-4 sm:px-6"><motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="overflow-hidden rounded-2xl border border-gray-100 shadow-lg"><img src={projectImg} alt={`${props.firmName} proje`} className="w-full object-cover" style={{ aspectRatio: '4/3' }} /></motion.div></div></section>)}

      <section className="bg-[#2563EB] py-20"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-outfit)] text-3xl font-700 text-white sm:text-4xl">{props.firmName} İçin<br />Profesyonel Web Sitenizi Oluşturalım</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-inter)] text-white/80">Ücretsiz demo — taahhüt yok.</motion.p>
          <motion.div variants={fadeInUp} className="mt-8"><a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 rounded-xl bg-white px-10 py-4 font-[family-name:var(--font-outfit)] text-sm font-600 text-[#2563EB] shadow-lg transition-all hover:bg-gray-50">Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></a></motion.div>
        </motion.div>
      </div></section>

      <section className="py-16"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6"><motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}><motion.div variants={scaleIn} className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#2563EB]/10"><span className="text-2xl">🔒</span></motion.div><motion.h3 variants={fadeInUp} className="font-[family-name:var(--font-outfit)] text-lg font-600 text-gray-900">Taahhüt Yok, Risk Yok</motion.h3><motion.p variants={fadeInUp} className="mt-2 font-[family-name:var(--font-inter)] text-sm text-gray-400">Demo tamamen ücretsizdir.</motion.p></motion.div></div></section>

      <footer className="border-t border-gray-100 py-8"><div className="mx-auto max-w-5xl px-4 text-center sm:px-6"><p className="font-[family-name:var(--font-inter)] text-xs text-gray-300">© {new Date().getFullYear()} Vorte Studio — {props.firmName} için özel olarak hazırlanmıştır.</p></div></footer>
    </div>
  )
}
