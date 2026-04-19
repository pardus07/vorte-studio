'use client'

import { Saira, Work_Sans } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { suffixDe, suffixIn } from './turkish-grammar'
import { useTrackPageView, trackEvent } from './use-track'

const saira = Saira({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700', '800'], variable: '--font-saira', display: 'swap' })
const workSans = Work_Sans({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700'], variable: '--font-work', display: 'swap' })

const fadeInUp = { hidden: { opacity: 0, y: 35 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
const scaleIn = { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromLeft = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromRight = { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }

export default function PrefabrikYapiTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)
  const heroImg = props.images?.hero
  const projectImg = props.images?.project

  return (
    <div className={`${saira.variable} ${workSans.variable} min-h-screen bg-[#18181B] text-white`}>
      {/* ═══════════════════ HERO — Stacking Blocks: ust uste yigilan moduler bloklar ═══════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-[#18181B]">
        {/* Modular building blocks */}
        <div className="pointer-events-none absolute inset-0">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="none">
            {/* Bottom row — 3 blocks */}
            <rect x="800" y="550" width="160" height="100" rx="4" fill="none" stroke="rgba(245,158,11,0.08)" strokeWidth="2" />
            <rect x="970" y="550" width="160" height="100" rx="4" fill="none" stroke="rgba(245,158,11,0.06)" strokeWidth="2" />
            <rect x="1140" y="550" width="160" height="100" rx="4" fill="none" stroke="rgba(245,158,11,0.05)" strokeWidth="2" />
            {/* Middle row — 2 blocks */}
            <rect x="885" y="440" width="160" height="100" rx="4" fill="rgba(245,158,11,0.02)" stroke="rgba(245,158,11,0.07)" strokeWidth="2" />
            <rect x="1055" y="440" width="160" height="100" rx="4" fill="rgba(245,158,11,0.02)" stroke="rgba(245,158,11,0.05)" strokeWidth="2" />
            {/* Top block — 1 block + crane line */}
            <rect x="970" y="330" width="160" height="100" rx="4" fill="rgba(245,158,11,0.03)" stroke="rgba(245,158,11,0.08)" strokeWidth="2" />
            {/* Crane arm */}
            <line x1="1050" y1="330" x2="1050" y2="180" stroke="rgba(245,158,11,0.06)" strokeWidth="2" />
            <line x1="1050" y1="180" x2="1200" y2="180" stroke="rgba(245,158,11,0.06)" strokeWidth="2" />
            <line x1="1200" y1="180" x2="1200" y2="220" stroke="rgba(245,158,11,0.04)" strokeWidth="1.5" strokeDasharray="4 3" />
          </svg>
        </div>

        {heroImg && (
          <div className="absolute inset-0">
            <img src={heroImg} alt={`${props.firmName} prefabrik yapi`} className="h-full w-full object-cover" style={{ opacity: 0.90 }} />
            <div className="absolute inset-0 bg-gradient-to-r from-[#18181B]/92 via-[#18181B]/70 to-[#18181B]/45" />
          </div>
        )}

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="grid w-full items-center gap-12 lg:grid-cols-2">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 border-l-4 border-[#F59E0B] bg-[#F59E0B]/8 px-4 py-2">
                <span className="font-[family-name:var(--font-work)] text-xs font-600 uppercase tracking-[0.3em] text-[#F59E0B]">{props.city} &bull; Prefabrik Yapı</span>
              </motion.div>
              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-saira)] text-5xl font-800 uppercase leading-[1.05] sm:text-6xl lg:text-7xl">
                Hızlı
                <br /><span className="text-[#F59E0B]">Güçlü</span>
                <br />Modüler
              </motion.h1>
              <motion.p variants={fadeInUp} className="mt-5 max-w-md font-[family-name:var(--font-work)] text-lg leading-relaxed text-white/45">
                {props.firmName} — {suffixDe(props.city)} prefabrik ev, konteyner, şantiye binası, depo. Hızlı montaj, dayanıklı yapı, uygun maliyet.
              </motion.p>
              <motion.div variants={fadeInUp} className="mt-6 flex flex-wrap gap-3">
                {['Prefabrik Ev', 'Konteyner', 'Şantiye', 'Depo', 'Modüler Ofis'].map((s) => (
                  <span key={s} className="border border-[#F59E0B]/15 bg-[#F59E0B]/5 px-4 py-2 font-[family-name:var(--font-saira)] text-xs font-500 uppercase tracking-wider text-[#F59E0B]">{s}</span>
                ))}
              </motion.div>
              <motion.div variants={fadeInUp} className="mt-8">
                <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 bg-[#F59E0B] px-8 py-4 font-[family-name:var(--font-saira)] text-sm font-700 uppercase tracking-wider text-[#18181B] transition-all hover:bg-[#D97706] hover:shadow-lg hover:shadow-[#F59E0B]/25">
                  Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              </motion.div>
            </motion.div>
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="hidden space-y-4 lg:block">
              {[{ icon: '🏭', title: 'Fabrika Üretim', desc: 'Standart kalite kontrolü' }, { icon: '⚡', title: 'Hızlı Montaj', desc: '1-3 gün içerisinde kurulum' }, { icon: '🏠', title: 'Yaşam Alanı', desc: 'Konforlu iç mekan tasarımı' }, { icon: '📦', title: 'Taşıma Kolaylığı', desc: 'Modüler parça sistemi' }].map((item) => (
                <motion.div key={item.title} variants={fadeInUp} className="flex items-center gap-4 border border-white/10 bg-white/5 p-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center bg-[#F59E0B]/10 text-xl">{item.icon}</div>
                  <div><div className="font-[family-name:var(--font-saira)] text-sm font-600 uppercase text-white/80">{item.title}</div><div className="font-[family-name:var(--font-work)] text-xs text-white/35">{item.desc}</div></div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 py-20"><div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
          <motion.div variants={fadeInUp} className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-red-500/10 px-5 py-2"><span className="text-lg">⚠️</span><span className="font-[family-name:var(--font-work)] text-sm font-600 text-red-400">Dikkat</span></motion.div>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-saira)] text-3xl font-700 uppercase text-white sm:text-4xl">Prefabrik yapı arayanlar <span className="text-red-400">proje görseli ve fiyat</span> karşılaştırıyor</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-work)] text-lg text-white/45">Web siteniz yoksa müşteriler büyük firmalara yöneliyor.</motion.p>
        </motion.div>
      </div></section>

      <section className="bg-[#27272A] py-20"><div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-saira)] text-3xl font-700 uppercase text-white sm:text-4xl">Web Siteniz <span className="text-[#F59E0B]">Olursa</span> / <span className="text-red-400">Olmazsa</span></motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="border border-[#F59E0B]/20 bg-[#F59E0B]/5 p-8"><div className="mb-4 text-2xl">✅</div><h3 className="mb-4 font-[family-name:var(--font-saira)] text-lg font-600 uppercase text-white">Olursa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-work)] text-sm text-white/60">
                {['Proje kataloğunuz güven oluşturur', 'Fiyat listeniz şeffaf sunulur', 'Teslim süresi bilginiz paylaşılır', 'Google\'da "prefabrik yapı + şehir" aramasında çıkabilirsiniz', 'Türkiye geneli sipariş alabilirsiniz'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-[#F59E0B]">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="border border-red-500/15 bg-red-500/5 p-8"><div className="mb-4 text-2xl">❌</div><h3 className="mb-4 font-[family-name:var(--font-saira)] text-lg font-600 uppercase text-white">Olmazsa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-work)] text-sm text-white/60">
                {['Müşteriler büyük zincir firmalara gider', 'Üretim kapasiteniz bilinmez', 'Fiyat avantajınız görülmez', 'Şehir dışı satış imkansız', 'Sadece yerel tanıdıkla sınırlı kalırsınız'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-red-400">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div></section>

      {projectImg && (<section className="py-16"><div className="mx-auto max-w-5xl px-4 sm:px-6"><motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="overflow-hidden border border-white/10"><img src={projectImg} alt={`${props.firmName} proje`} className="w-full object-cover" style={{ aspectRatio: '4/3' }} /></motion.div></div></section>)}

      <section className="bg-[#F59E0B] py-20"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-saira)] text-3xl font-700 uppercase text-[#18181B] sm:text-4xl">{props.firmName} İçin<br />Profesyonel Web Sitenizi Oluşturalım</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-work)] text-[#18181B]/60">Ücretsiz demo — taahhüt yok.</motion.p>
          <motion.div variants={fadeInUp} className="mt-8"><a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 bg-[#18181B] px-10 py-4 font-[family-name:var(--font-saira)] text-sm font-700 uppercase tracking-wider text-white transition-all hover:bg-[#27272A]">Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></a></motion.div>
        </motion.div>
      </div></section>

      <section className="py-16"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6"><motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}><motion.div variants={scaleIn} className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F59E0B]/10"><span className="text-2xl">🔒</span></motion.div><motion.h3 variants={fadeInUp} className="font-[family-name:var(--font-saira)] text-lg font-700 uppercase text-white">Taahhüt Yok, Risk Yok</motion.h3><motion.p variants={fadeInUp} className="mt-2 font-[family-name:var(--font-work)] text-sm text-white/40">Demo tamamen ücretsizdir.</motion.p></motion.div></div></section>

      <footer className="border-t border-white/5 py-8"><div className="mx-auto max-w-5xl px-4 text-center sm:px-6"><p className="font-[family-name:var(--font-work)] text-xs text-white/25">© {new Date().getFullYear()} Vorte Studio — {props.firmName} için özel olarak hazırlanmıştır.</p></div></footer>
    </div>
  )
}
