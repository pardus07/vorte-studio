'use client'

import { Poppins, Inter } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { suffixDe, suffixIn } from './turkish-grammar'
import { useTrackPageView, trackEvent } from './use-track'

const poppins = Poppins({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700', '800'], variable: '--font-poppins', display: 'swap' })
const inter = Inter({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700'], variable: '--font-inter', display: 'swap' })

const fadeInUp = { hidden: { opacity: 0, y: 35 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
const scaleIn = { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromLeft = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromRight = { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }

export default function KlimaServisiTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)
  const heroImg = props.images?.hero
  const serviceImg = props.images?.service

  return (
    <div className={`${poppins.variable} ${inter.variable} min-h-screen bg-white text-[#1C1917]`}>
      {/* ═══════════════════ HERO — Frosted Glass Split: sol buzlu cam kart + sağ tam görsel ═══════════════════ */}
      <section className="relative min-h-[90vh] overflow-hidden bg-[#0EA5E9]">
        {/* Ice crystal decorations */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[#BAE6FD]/10 blur-2xl" />
          {/* Snowflake hint dots */}
          <div className="absolute left-[15%] top-[20%] h-2 w-2 rounded-full bg-white/20" />
          <div className="absolute left-[25%] top-[60%] h-1.5 w-1.5 rounded-full bg-white/15" />
          <div className="absolute right-[45%] top-[30%] h-1 w-1 rounded-full bg-white/20" />
        </div>

        <div className="relative mx-auto flex min-h-[90vh] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="grid w-full items-center gap-8 lg:grid-cols-12">
            {/* Sol — Frosted glass card */}
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="lg:col-span-6">
              <div className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl sm:p-12">
                <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5">
                  <span className="text-sm">❄️</span>
                  <span className="font-[family-name:var(--font-inter)] text-xs font-500 text-white/90">{props.city} &bull; Klima Servisi</span>
                </motion.div>

                <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-poppins)] text-4xl font-700 leading-tight text-white sm:text-5xl">
                  Klimanız
                  <br />
                  <span className="text-[#BAE6FD]">Her Zaman Hazır</span>
                </motion.h1>

                <motion.p variants={fadeInUp} className="mt-5 font-[family-name:var(--font-inter)] text-base leading-relaxed text-white/70">
                  {props.firmName} — {suffixDe(props.city)} klima montaj, bakım ve arıza servisi.
                  Tüm markalara uygun, garantili hizmet.
                </motion.p>

                {/* Service badges */}
                <motion.div variants={fadeInUp} className="mt-6 flex flex-wrap gap-2">
                  {['Montaj', 'Bakım', 'Arıza', 'Gaz Dolumu', 'Dezenfeksiyon'].map((s) => (
                    <span key={s} className="rounded-full bg-white/15 px-3 py-1.5 font-[family-name:var(--font-inter)] text-xs font-500 text-white/80">{s}</span>
                  ))}
                </motion.div>

                <motion.div variants={fadeInUp} className="mt-8">
                  <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-[family-name:var(--font-poppins)] text-sm font-600 text-[#0EA5E9] transition-all hover:bg-[#BAE6FD]">
                    Ücretsiz Teklif Al
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </a>
                </motion.div>
              </div>
            </motion.div>

            {/* Sağ — Hero image */}
            <motion.div variants={scaleIn} initial="hidden" animate="visible" className="hidden lg:col-span-6 lg:block">
              {heroImg ? (
                <div className="overflow-hidden rounded-3xl shadow-2xl">
                  <img src={heroImg} alt={`${props.firmName} klima`} className="h-full w-full object-cover" style={{ aspectRatio: '3/4', maxHeight: '600px' }} />
                </div>
              ) : (
                <div className="flex items-center justify-center rounded-3xl bg-white/5" style={{ aspectRatio: '3/4', maxHeight: '600px' }}>
                  <span className="text-8xl opacity-20">❄️</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
            <motion.div variants={fadeInUp} className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-red-50 px-5 py-2">
              <span className="text-lg">⚠️</span>
              <span className="font-[family-name:var(--font-inter)] text-sm font-600 text-red-700">Dikkat — Kaçırıyorsunuz</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-poppins)] text-3xl font-700 text-[#1C1917] sm:text-4xl">
              Yaz gelince herkes <span className="text-red-600">klima servisi</span> arıyor
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-inter)] text-lg text-[#78716C]">
              Web siteniz yoksa o kalabalıkta kayboluyorsunuz. Google&apos;da ilk sırada olan rakibiniz müşterilerinizi alıyor.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-[#F0F9FF] py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-poppins)] text-3xl font-700 text-[#1C1917] sm:text-4xl">
              Web Siteniz <span className="text-[#0EA5E9]">Olursa</span> / <span className="text-red-500">Olmazsa</span>
            </motion.h2>
            <div className="grid gap-6 md:grid-cols-2">
              <motion.div variants={slideFromLeft} className="rounded-2xl border-2 border-[#0EA5E9]/20 bg-white p-8">
                <div className="mb-4 text-2xl">✅</div>
                <h3 className="mb-4 font-[family-name:var(--font-poppins)] text-lg font-600 text-[#1C1917]">Web Siteniz Olursa</h3>
                <ul className="space-y-3 font-[family-name:var(--font-inter)] text-sm text-[#57534E]">
                  {['Google\'da "klima servisi + şehir" aramasında çıkarsınız', 'Marka uyumluluk listeniz güven verir', 'Yıllık bakım paketi online satışa çıkar', 'Acil servis CTA ile anında çağrı alırsınız', '7/24 erişilebilir profesyonel imaj oluşturursunuz'].map((i) => (
                    <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-[#0EA5E9]">●</span> {i}</li>
                  ))}
                </ul>
              </motion.div>
              <motion.div variants={slideFromRight} className="rounded-2xl border border-red-100 bg-red-50/50 p-8">
                <div className="mb-4 text-2xl">❌</div>
                <h3 className="mb-4 font-[family-name:var(--font-poppins)] text-lg font-600 text-[#1C1917]">Web Siteniz Olmazsa</h3>
                <ul className="space-y-3 font-[family-name:var(--font-inter)] text-sm text-[#57534E]">
                  {['Sezon başında müşteri bulamazsınız', 'Rakipler online öne geçer', 'Marka güveni oluşturamazsınız', 'Bakım paketi satamazsınız', 'Acil çağrılar rakibinize gider'].map((i) => (
                    <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-red-400">●</span> {i}</li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {serviceImg && (
        <section className="py-16"><div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="overflow-hidden rounded-2xl">
            <img src={serviceImg} alt={`${props.firmName} servis`} className="w-full object-cover" style={{ aspectRatio: '4/3' }} />
          </motion.div>
        </div></section>
      )}

      <section className="bg-[#0EA5E9] py-20"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-poppins)] text-3xl font-700 text-white sm:text-4xl">
            {props.firmName} İçin<br /><span className="text-[#BAE6FD]">Profesyonel Web Sitenizi Oluşturalım</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-inter)] text-white/70">Ücretsiz demo ile farkı görün — taahhüt yok.</motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 rounded-xl bg-white px-10 py-4 font-[family-name:var(--font-poppins)] text-sm font-600 text-[#0EA5E9] transition-all hover:bg-[#BAE6FD]">
              Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </motion.div>
        </motion.div>
      </div></section>

      <section className="py-16"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.div variants={scaleIn} className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#0EA5E9]/10"><span className="text-2xl">🔒</span></motion.div>
          <motion.h3 variants={fadeInUp} className="font-[family-name:var(--font-poppins)] text-lg font-600 text-[#1C1917]">Taahhüt Yok, Risk Yok</motion.h3>
          <motion.p variants={fadeInUp} className="mt-2 font-[family-name:var(--font-inter)] text-sm text-[#78716C]">Demo tamamen ücretsizdir. Beğenmezseniz hiçbir ödeme yapmazsınız.</motion.p>
        </motion.div>
      </div></section>

      <footer className="border-t border-[#E5E7EB] py-8"><div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
        <p className="font-[family-name:var(--font-inter)] text-xs text-[#94A3B8]">© {new Date().getFullYear()} Vorte Studio — {props.firmName} için özel olarak hazırlanmıştır.</p>
      </div></footer>
    </div>
  )
}
