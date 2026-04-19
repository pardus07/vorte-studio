'use client'

import { Lora, Source_Sans_3 } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { suffixDe, suffixIn } from './turkish-grammar'
import { useTrackPageView, trackEvent } from './use-track'

const lora = Lora({ subsets: ['latin-ext'], weight: ['400', '500', '600', '700'], variable: '--font-lora', display: 'swap' })
const sourceSans = Source_Sans_3({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700'], variable: '--font-source-sans', display: 'swap' })

const fadeInUp = { hidden: { opacity: 0, y: 35 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
const scaleIn = { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromLeft = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromRight = { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }

export default function HaliYikamaTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)
  const heroImg = props.images?.hero
  const serviceImg = props.images?.service

  return (
    <div className={`${lora.variable} ${sourceSans.variable} min-h-screen bg-[#FFFBEB] text-gray-900`}>
      {/* ═══════════════════ HERO — Before/After Vertical Split: dikey bölünme + dönüşüm hissi ═══════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-white">
        {/* Vertical split line — before/after divider */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[70%] w-px bg-gradient-to-b from-transparent via-[#78350F]/20 to-transparent" style={{ marginLeft: '50%' }} />
        </div>

        {/* Left side — warm/dirty tone */}
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 w-1/2 bg-gradient-to-r from-[#78350F]/5 to-transparent" />

        {/* Right side — clean golden tone */}
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-1/2 bg-gradient-to-l from-[#FDE68A]/10 to-transparent" />

        {/* Before / After labels */}
        <div className="pointer-events-none absolute left-[20%] top-8 font-[family-name:var(--font-source-sans)] text-[10px] font-600 uppercase tracking-[0.4em] text-[#78350F]/20">Önce</div>
        <div className="pointer-events-none absolute right-[20%] top-8 font-[family-name:var(--font-source-sans)] text-[10px] font-600 uppercase tracking-[0.4em] text-[#78350F]/20">Sonra</div>

        {heroImg && (
          <div className="absolute inset-0">
            <img src={heroImg} alt={`${props.firmName} halı yıkama`} className="h-full w-full object-cover" style={{ opacity: 0.80 }} />
            <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/50 to-white/70" />
          </div>
        )}

        <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 sm:px-6 lg:px-8">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="mx-auto max-w-2xl text-center">
            <motion.div variants={fadeInUp} className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#78350F]/10 px-5 py-2">
              <span className="text-sm">🧹</span>
              <span className="font-[family-name:var(--font-source-sans)] text-xs font-600 uppercase tracking-[0.25em] text-[#78350F]">
                {props.city} &bull; Halı Yıkama
              </span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-lora)] text-5xl font-700 leading-[1.1] text-gray-900 sm:text-6xl">
              Halılarınız
              <br />
              <span className="text-[#78350F]">Fabrika Gibi</span>
              <br />
              Temizleniyor
            </motion.h1>

            <motion.p variants={fadeInUp} className="mt-5 font-[family-name:var(--font-source-sans)] text-lg leading-relaxed text-gray-500">
              {props.firmName} — {suffixDe(props.city)} eve alma/teslim ile profesyonel halı yıkama.
              Hızlı kurutma, hijyenik teslim garantisi.
            </motion.p>

            {/* Stat badges */}
            <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap justify-center gap-4">
              {[{ value: 'Eve', sub: 'Alma/Teslim' }, { value: '24 Saat', sub: 'Hızlı Kurutma' }, { value: 'm²', sub: 'Bazlı Fiyat' }].map((stat) => (
                <div key={stat.sub} className="rounded-xl border border-[#78350F]/15 bg-[#FFFBEB] px-6 py-4 text-center">
                  <div className="font-[family-name:var(--font-lora)] text-xl font-700 text-[#78350F]">{stat.value}</div>
                  <div className="font-[family-name:var(--font-source-sans)] text-xs font-500 uppercase tracking-wider text-gray-400">{stat.sub}</div>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-8">
              <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 rounded-xl bg-[#78350F] px-8 py-4 font-[family-name:var(--font-source-sans)] text-sm font-600 text-white shadow-lg shadow-[#78350F]/20 transition-all hover:bg-[#6B2E0D]">
                Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#FFFBEB] py-20"><div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
          <motion.div variants={fadeInUp} className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-red-50 px-5 py-2"><span className="text-lg">⚠️</span><span className="font-[family-name:var(--font-source-sans)] text-sm font-600 text-red-500">Dikkat</span></motion.div>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-lora)] text-3xl font-700 text-gray-900 sm:text-4xl">Halı yıkama arayanlar <span className="text-red-500">fiyat ve hizmet kalitesi</span> karşılaştırıyor</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-source-sans)] text-lg text-gray-500">Siteniz yoksa fiyat şeffaflığı sağlayamaz, güvensiz görünürsünüz.</motion.p>
        </motion.div>
      </div></section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-white py-20"><div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-lora)] text-3xl font-700 text-gray-900 sm:text-4xl">Web Siteniz <span className="text-[#78350F]">Olursa</span> / <span className="text-red-500">Olmazsa</span></motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="rounded-2xl border border-[#78350F]/15 bg-[#FFFBEB] p-8"><div className="mb-4 text-2xl">✅</div><h3 className="mb-4 font-[family-name:var(--font-lora)] text-lg font-700 text-gray-900">Olursa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-source-sans)] text-sm text-gray-600">
                {['m² bazlı fiyat hesaplayıcı güven verir', 'Eve alma/teslim hizmeti öne çıkar', 'Hızlı kurutma garantisi fark yaratır', 'Google\'da "halı yıkama + şehir" aramasında çıkarsınız', 'Referans fotoğraflar ikna eder'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-[#78350F]">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="rounded-2xl border border-red-200 bg-red-50 p-8"><div className="mb-4 text-2xl">❌</div><h3 className="mb-4 font-[family-name:var(--font-lora)] text-lg font-700 text-gray-900">Olmazsa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-source-sans)] text-sm text-gray-600">
                {['Fiyat şeffaflığı olmadan müşteri çekilir', 'Eve teslim hizmeti bilinmez', 'Referans gösteremezsiniz', 'Karşılaştırmada rakip öne geçer', 'İş hacmi mahalle ile sınırlı kalır'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-red-400">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div></section>

      {serviceImg && (<section className="bg-[#FFFBEB] py-8"><div className="mx-auto max-w-5xl px-4 sm:px-6"><motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="overflow-hidden rounded-2xl border border-[#78350F]/10 shadow-lg"><img src={serviceImg} alt={`${props.firmName} servis`} className="w-full object-cover" style={{ aspectRatio: '4/3' }} /></motion.div></div></section>)}

      <section className="bg-[#78350F] py-20"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-lora)] text-3xl font-700 text-white sm:text-4xl">{props.firmName} İçin<br />Profesyonel Web Sitenizi Oluşturalım</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-source-sans)] text-white/80">Ücretsiz demo — taahhüt yok.</motion.p>
          <motion.div variants={fadeInUp} className="mt-8"><a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 rounded-xl bg-[#FDE68A] px-10 py-4 font-[family-name:var(--font-source-sans)] text-sm font-600 text-[#78350F] shadow-lg transition-all hover:bg-[#FCD34D]">Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></a></motion.div>
        </motion.div>
      </div></section>

      <section className="bg-white py-16"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6"><motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}><motion.div variants={scaleIn} className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#78350F]/10"><span className="text-2xl">🔒</span></motion.div><motion.h3 variants={fadeInUp} className="font-[family-name:var(--font-lora)] text-lg font-700 text-gray-900">Taahhüt Yok, Risk Yok</motion.h3><motion.p variants={fadeInUp} className="mt-2 font-[family-name:var(--font-source-sans)] text-sm text-gray-400">Demo tamamen ücretsizdir.</motion.p></motion.div></div></section>

      <footer className="border-t border-gray-100 py-8"><div className="mx-auto max-w-5xl px-4 text-center sm:px-6"><p className="font-[family-name:var(--font-source-sans)] text-xs text-gray-300">© {new Date().getFullYear()} Vorte Studio — {props.firmName} için özel olarak hazırlanmıştır.</p></div></footer>
    </div>
  )
}
