'use client'

import { Poppins, Inter } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const poppins = Poppins({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700', '800'], variable: '--font-poppins', display: 'swap' })
const inter = Inter({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700'], variable: '--font-inter', display: 'swap' })

const fadeInUp = { hidden: { opacity: 0, y: 35 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
const scaleIn = { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromLeft = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromRight = { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }

export default function SuAritmaTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)
  const heroImg = props.images?.hero
  const productImg = props.images?.product

  return (
    <div className={`${poppins.variable} ${inter.variable} min-h-screen bg-white text-gray-900`}>
      {/* ═══════════════════ HERO — Concentric Water Ripple: iç içe daireler + damla efekti ═══════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#F0F9FF] via-white to-[#E0F2FE]">
        {/* Concentric ripple circles */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {[300, 500, 700, 900].map((size, i) => (
            <div key={size} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#0EA5E9]" style={{ width: size, height: size, opacity: 0.06 - i * 0.01 }} />
          ))}
        </div>

        {/* Water droplet accent */}
        <div className="pointer-events-none absolute right-[15%] top-[20%] h-20 w-14 rounded-b-full rounded-t-[50%_50%_50%_50%/60%_60%_40%_40%] bg-[#0EA5E9]/5" />

        {heroImg && (
          <div className="absolute inset-0">
            <img src={heroImg} alt={`${props.firmName} su arıtma`} className="h-full w-full object-cover" style={{ opacity: 0.35 }} />
            <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/50 to-white/20" />
          </div>
        )}

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="grid w-full items-center gap-12 lg:grid-cols-2">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#0EA5E9]/10 px-5 py-2">
                <span className="text-sm">💧</span>
                <span className="font-[family-name:var(--font-inter)] text-xs font-600 uppercase tracking-[0.25em] text-[#0EA5E9]">
                  {props.city} &bull; Su Arıtma
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-poppins)] text-5xl font-700 leading-[1.08] text-gray-900 sm:text-6xl">
                Temiz Su
                <br />
                <span className="text-[#0EA5E9]">Sağlıklı Yaşam</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="mt-5 max-w-md font-[family-name:var(--font-inter)] text-lg leading-relaxed text-gray-500">
                {props.firmName} — {props.city}&apos;de su arıtma sistemi satış, montaj ve bakım.
                Ücretsiz su testi ile ihtiyacınıza en uygun çözümü sunuyoruz.
              </motion.p>

              <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-3">
                {['Ev Tipi', 'Sanayi', 'Ters Ozmos', 'Yumuşatma', 'UV Sterilizasyon'].map((s) => (
                  <span key={s} className="rounded-full border border-[#0EA5E9]/20 bg-[#0EA5E9]/5 px-4 py-2 font-[family-name:var(--font-inter)] text-xs font-500 text-[#0EA5E9]">{s}</span>
                ))}
              </motion.div>

              <motion.div variants={fadeInUp} className="mt-8">
                <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 rounded-xl bg-[#0EA5E9] px-8 py-4 font-[family-name:var(--font-poppins)] text-sm font-600 text-white shadow-lg shadow-[#0EA5E9]/25 transition-all hover:bg-[#0284C7] hover:shadow-xl hover:shadow-[#0EA5E9]/30">
                  Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              </motion.div>
            </motion.div>

            {/* Sağ — Ücretsiz Su Testi kartı */}
            <motion.div variants={scaleIn} initial="hidden" animate="visible" className="hidden lg:block">
              <div className="relative rounded-3xl border border-[#0EA5E9]/15 bg-white/80 p-8 shadow-xl shadow-[#0EA5E9]/5 backdrop-blur-sm">
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#0EA5E9]/10"><span className="text-3xl">🔬</span></div>
                  <h3 className="font-[family-name:var(--font-poppins)] text-lg font-600 text-gray-900">Ücretsiz Su Testi</h3>
                  <p className="mt-1 font-[family-name:var(--font-inter)] text-sm text-gray-400">Suyunuzun kalitesini ölçüyoruz</p>
                </div>
                <div className="space-y-3">
                  {[{ label: 'pH Değeri', icon: '⚗️' }, { label: 'Sertlik', icon: '🧪' }, { label: 'Klor Oranı', icon: '💧' }, { label: 'TDS (Çözünmüş Katı)', icon: '📊' }].map((item) => (
                    <div key={item.label} className="flex items-center gap-3 rounded-xl bg-[#F0F9FF] px-4 py-3">
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-[family-name:var(--font-inter)] text-sm font-500 text-gray-700">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#F0F9FF] py-20"><div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
          <motion.div variants={fadeInUp} className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-red-50 px-5 py-2"><span className="text-lg">⚠️</span><span className="font-[family-name:var(--font-inter)] text-sm font-600 text-red-500">Dikkat</span></motion.div>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-poppins)] text-3xl font-700 text-gray-900 sm:text-4xl">Şebeke suyu <span className="text-red-500">güvenli mi?</span></motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-inter)] text-lg text-gray-500">Müşteriler su arıtma firması ararken sertifika, referans ve sistem karşılaştırması istiyor. Web siteniz yoksa güvenilirlik algısı oluşturmanız imkansız.</motion.p>
        </motion.div>
      </div></section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="py-20"><div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-poppins)] text-3xl font-700 text-gray-900 sm:text-4xl">Web Siteniz <span className="text-[#0EA5E9]">Olursa</span> / <span className="text-red-500">Olmazsa</span></motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="rounded-2xl border border-[#0EA5E9]/20 bg-[#F0F9FF] p-8"><div className="mb-4 text-2xl">✅</div><h3 className="mb-4 font-[family-name:var(--font-poppins)] text-lg font-600 text-gray-900">Olursa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-inter)] text-sm text-gray-600">
                {['Sistem karşılaştırması güven oluşturur', 'Ücretsiz su testi CTA ile müşteri kazanırsınız', 'Bakım sözleşmesi satışı artar', 'Google\'da "su arıtma + şehir" aramasında çıkarsınız', 'Sertifika ve TSE belgeleri görünür'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-[#0EA5E9]">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="rounded-2xl border border-red-200 bg-red-50 p-8"><div className="mb-4 text-2xl">❌</div><h3 className="mb-4 font-[family-name:var(--font-poppins)] text-lg font-600 text-gray-900">Olmazsa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-inter)] text-sm text-gray-600">
                {['Rakipler güven farkı yaratır', 'Telefonda fiyat sorulur, dönüş yapılmaz', 'Bakım sözleşmeleri kaçar', 'Sertifikalarınızı gösteremezsiniz', 'Müşteri havuzunuz sınırlı kalır'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-red-400">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div></section>

      {productImg && (<section className="py-8"><div className="mx-auto max-w-5xl px-4 sm:px-6"><motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="overflow-hidden rounded-2xl border border-gray-100 shadow-lg"><img src={productImg} alt={`${props.firmName} ürün`} className="w-full object-cover" style={{ aspectRatio: '4/3' }} /></motion.div></div></section>)}

      <section className="bg-[#0EA5E9] py-20"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-poppins)] text-3xl font-700 text-white sm:text-4xl">{props.firmName} İçin<br />Profesyonel Web Sitenizi Oluşturalım</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-inter)] text-white/80">Ücretsiz demo — taahhüt yok.</motion.p>
          <motion.div variants={fadeInUp} className="mt-8"><a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 rounded-xl bg-white px-10 py-4 font-[family-name:var(--font-poppins)] text-sm font-600 text-[#0EA5E9] shadow-lg transition-all hover:bg-gray-50">Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></a></motion.div>
        </motion.div>
      </div></section>

      <section className="py-16"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6"><motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}><motion.div variants={scaleIn} className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#0EA5E9]/10"><span className="text-2xl">🔒</span></motion.div><motion.h3 variants={fadeInUp} className="font-[family-name:var(--font-poppins)] text-lg font-600 text-gray-900">Taahhüt Yok, Risk Yok</motion.h3><motion.p variants={fadeInUp} className="mt-2 font-[family-name:var(--font-inter)] text-sm text-gray-400">Demo tamamen ücretsizdir.</motion.p></motion.div></div></section>

      <footer className="border-t border-gray-100 py-8"><div className="mx-auto max-w-5xl px-4 text-center sm:px-6"><p className="font-[family-name:var(--font-inter)] text-xs text-gray-300">© {new Date().getFullYear()} Vorte Studio — {props.firmName} için özel olarak hazırlanmıştır.</p></div></footer>
    </div>
  )
}
