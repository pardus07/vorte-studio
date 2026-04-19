'use client'

import { Quicksand, Nunito_Sans } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { suffixDe, suffixIn } from './turkish-grammar'
import { useTrackPageView, trackEvent } from './use-track'

const quicksand = Quicksand({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700'], variable: '--font-quicksand', display: 'swap' })
const nunitoSans = Nunito_Sans({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700'], variable: '--font-nunito-sans', display: 'swap' })

const fadeInUp = { hidden: { opacity: 0, y: 35 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
const scaleIn = { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromLeft = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromRight = { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }

export default function CamBalkonTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)
  const heroImg = props.images?.hero
  const projectImg = props.images?.project

  return (
    <div className={`${quicksand.variable} ${nunitoSans.variable} min-h-screen bg-[#F0F9FF] text-gray-900`}>
      {/* ═══════════════════ HERO — Glass Panels + Sky Reflection: cam paneller + gokyuzu yansimasi ═══════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#E0F2FE] via-[#F0F9FF] to-white">
        {/* Glass panel reflections */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Sliding glass panels — vertical rectangles with subtle glass effect */}
          <div className="absolute right-[8%] top-[12%] h-[450px] w-[100px] rounded-sm border border-[#0EA5E9]/8 bg-gradient-to-br from-[#0EA5E9]/4 via-white/3 to-transparent">
            <div className="absolute left-2 top-0 h-full w-px bg-gradient-to-b from-white/20 via-white/5 to-transparent" />
          </div>
          <div className="absolute right-[16%] top-[10%] h-[470px] w-[100px] rounded-sm border border-[#0EA5E9]/6 bg-gradient-to-br from-[#0EA5E9]/3 via-white/2 to-transparent">
            <div className="absolute left-2 top-0 h-full w-px bg-gradient-to-b from-white/15 via-white/3 to-transparent" />
          </div>
          <div className="absolute right-[24%] top-[14%] h-[430px] w-[100px] rounded-sm border border-[#0EA5E9]/5 bg-gradient-to-br from-[#0EA5E9]/2 via-white/2 to-transparent">
            <div className="absolute left-2 top-0 h-full w-px bg-gradient-to-b from-white/10 via-white/2 to-transparent" />
          </div>
          {/* Top rail */}
          <div className="absolute right-[7%] top-[10%] h-1.5 w-[220px] rounded-full bg-gradient-to-r from-[#64748B]/10 via-[#64748B]/15 to-[#64748B]/5" />
          {/* Bottom rail */}
          <div className="absolute bottom-[18%] right-[7%] h-1.5 w-[220px] rounded-full bg-gradient-to-r from-[#64748B]/8 via-[#64748B]/12 to-[#64748B]/4" />
          {/* Sky reflection shimmer */}
          <div className="absolute right-[12%] top-[25%] h-[200px] w-[60px] rotate-[3deg] bg-gradient-to-b from-[#7DD3FC]/6 via-transparent to-[#7DD3FC]/3" />
        </div>

        {heroImg && (
          <div className="absolute inset-0">
            <img src={heroImg} alt={`${props.firmName} cam balkon`} className="h-full w-full object-cover" style={{ opacity: 0.90 }} />
            <div className="absolute inset-0 bg-gradient-to-r from-[#F0F9FF]/70 via-[#F0F9FF]/50 to-[#F0F9FF]/20" />
          </div>
        )}

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-2xl">
            <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#0EA5E9]/10 px-5 py-2">
              <span className="text-sm">🏠</span>
              <span className="font-[family-name:var(--font-nunito-sans)] text-xs font-600 uppercase tracking-[0.25em] text-[#0EA5E9]">{props.city} &bull; Cam Balkon</span>
            </motion.div>
            <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-quicksand)] text-5xl font-700 leading-[1.08] sm:text-6xl lg:text-7xl">
              Işık Dolu
              <br /><span className="text-[#0EA5E9]">Ferah Alan</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="mt-5 max-w-lg font-[family-name:var(--font-nunito-sans)] text-lg leading-relaxed text-gray-500">
              {props.firmName} — {suffixDe(props.city)} katlanır cam balkon, sürme cam balkon, ısıcamlı sistem. Balkonunuz dört mevsim yaşam alanı.
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-6 flex flex-wrap gap-3">
              {['Katlanır', 'Sürme', 'Isıcamlı', 'Menteşeli', 'Seri Sistem'].map((s) => (
                <span key={s} className="rounded-full border border-[#0EA5E9]/15 bg-[#0EA5E9]/5 px-4 py-2 font-[family-name:var(--font-nunito-sans)] text-xs font-500 text-[#0EA5E9]">{s}</span>
              ))}
            </motion.div>
            <motion.div variants={fadeInUp} className="mt-8">
              <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 rounded-xl bg-[#0EA5E9] px-8 py-4 font-[family-name:var(--font-quicksand)] text-sm font-700 text-white shadow-lg shadow-[#0EA5E9]/25 transition-all hover:bg-[#0284C7]">
                Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="bg-[#E0F2FE] py-20"><div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
          <motion.div variants={fadeInUp} className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-red-50 px-5 py-2"><span className="text-lg">⚠️</span><span className="font-[family-name:var(--font-nunito-sans)] text-sm font-600 text-red-500">Dikkat</span></motion.div>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-quicksand)] text-3xl font-700 text-gray-900 sm:text-4xl">Cam balkon arayanlar <span className="text-red-500">görsel ve referans</span> karşılaştırıyor</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-nunito-sans)] text-lg text-gray-500">Web siteniz yoksa müşteriler sizi atlayıp rakibinizden teklif alıyor.</motion.p>
        </motion.div>
      </div></section>

      <section className="py-20"><div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-quicksand)] text-3xl font-700 text-gray-900 sm:text-4xl">Web Siteniz <span className="text-[#0EA5E9]">Olursa</span> / <span className="text-red-500">Olmazsa</span></motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="rounded-2xl border border-[#0EA5E9]/20 bg-[#E0F2FE] p-8"><div className="mb-4 text-2xl">✅</div><h3 className="mb-4 font-[family-name:var(--font-quicksand)] text-lg font-600 text-gray-900">Olursa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-nunito-sans)] text-sm text-gray-600">
                {['Proje görselleri ile güven oluşturursunuz', 'Sistem seçenekleriniz şeffaf sunulur', 'Online teklif formu müşteri kazandırır', 'Google\'da "cam balkon + şehir" aramasında çıkabilirsiniz', 'Garanti koşullarınız görünür olur'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-[#0EA5E9]">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="rounded-2xl border border-red-200 bg-red-50 p-8"><div className="mb-4 text-2xl">❌</div><h3 className="mb-4 font-[family-name:var(--font-quicksand)] text-lg font-600 text-gray-900">Olmazsa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-nunito-sans)] text-sm text-gray-600">
                {['Müşteriler bilinen markalara yönelir', 'Referanslarınız bilinmez', 'Fiyat teklifi almak zorlaşıyor', 'Kalite farkınız görülmüyor', 'Profesyonel imaj oluşturulamıyor'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-red-400">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div></section>

      {projectImg && (<section className="py-8"><div className="mx-auto max-w-5xl px-4 sm:px-6"><motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="overflow-hidden rounded-2xl border border-gray-100 shadow-lg"><img src={projectImg} alt={`${props.firmName} proje`} className="w-full object-cover" style={{ aspectRatio: '4/3' }} /></motion.div></div></section>)}

      <section className="bg-[#0EA5E9] py-20"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-quicksand)] text-3xl font-700 text-white sm:text-4xl">{props.firmName} İçin<br />Profesyonel Web Sitenizi Oluşturalım</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-nunito-sans)] text-white/80">Ücretsiz demo — taahhüt yok.</motion.p>
          <motion.div variants={fadeInUp} className="mt-8"><a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 rounded-xl bg-white px-10 py-4 font-[family-name:var(--font-quicksand)] text-sm font-700 text-[#0EA5E9] shadow-lg transition-all hover:bg-gray-50">Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></a></motion.div>
        </motion.div>
      </div></section>

      <section className="py-16"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6"><motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}><motion.div variants={scaleIn} className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#0EA5E9]/10"><span className="text-2xl">🔒</span></motion.div><motion.h3 variants={fadeInUp} className="font-[family-name:var(--font-quicksand)] text-lg font-700 text-gray-900">Taahhüt Yok, Risk Yok</motion.h3><motion.p variants={fadeInUp} className="mt-2 font-[family-name:var(--font-nunito-sans)] text-sm text-gray-400">Demo tamamen ücretsizdir.</motion.p></motion.div></div></section>

      <footer className="border-t border-gray-100 py-8"><div className="mx-auto max-w-5xl px-4 text-center sm:px-6"><p className="font-[family-name:var(--font-nunito-sans)] text-xs text-gray-300">© {new Date().getFullYear()} Vorte Studio — {props.firmName} için özel olarak hazırlanmıştır.</p></div></footer>
    </div>
  )
}
