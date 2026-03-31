'use client'

import { Oswald, Lato } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const oswald = Oswald({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-oswald',
  display: 'swap',
})

const lato = Lato({
  subsets: ['latin-ext'],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
  display: 'swap',
})

const fadeInUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
}

const slideFromLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
}

const slideFromRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
}

export default function DisCepheTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const projectsImg = props.images?.projects

  return (
    <div className={`${oswald.variable} ${lato.variable} min-h-screen bg-white text-[#1F2937]`}>
      {/* ═══════════════════ HERO — Facade Grid + Material Showcase ═══════════════════ */}
      <section className="relative overflow-hidden bg-[#374151] pb-20 pt-16 text-white">
        {/* Building facade grid pattern — vertical & horizontal lines */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="facade-grid" x="0" y="0" width="80" height="120" patternUnits="userSpaceOnUse">
                <rect x="2" y="2" width="76" height="36" fill="none" stroke="#F59E0B" strokeWidth="0.5" />
                <rect x="2" y="42" width="36" height="76" fill="none" stroke="#F59E0B" strokeWidth="0.5" />
                <rect x="42" y="42" width="36" height="76" fill="none" stroke="#F59E0B" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#facade-grid)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Material type cards — top strip */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mb-10"
          >
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-2">
              {['🧱 Seramik Cephe', '🪨 Taş Kaplama', '🔩 Kompozit Panel', '🏗️ Dış Cephe Boya'].map((badge, i) => (
                <span key={i} className="border border-[#F59E0B]/30 bg-[#F59E0B]/10 px-4 py-1.5 font-[family-name:var(--font-lato)] text-xs font-700 uppercase text-[#F59E0B]">
                  {badge}
                </span>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
          >
            <div className="space-y-8">
              <motion.div variants={fadeInUp} className="flex items-center gap-3">
                <div className="h-1 w-10 bg-[#F59E0B]" />
                <span className="font-[family-name:var(--font-lato)] text-sm font-700 uppercase tracking-[0.3em] text-[#F59E0B]">
                  {props.city} &bull; Dış Cephe
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-oswald)] text-5xl font-700 uppercase leading-none sm:text-6xl lg:text-7xl">
                Binanızın
                <br />
                Dış Yüzü
                <br />
                <span className="text-[#F59E0B]">Kalıcı & Güzel</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="max-w-md font-[family-name:var(--font-lato)] text-base leading-relaxed text-white/70">
                <strong className="text-white">{props.firmName}</strong> — profesyonel dış cephe kaplama
                ve yenileme. Dayanıklı malzeme, estetik sonuç, uzun ömür.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 bg-[#F59E0B] px-8 py-4 font-[family-name:var(--font-oswald)] text-base font-600 uppercase tracking-wider text-[#374151] shadow-lg transition-all hover:bg-[#FBBF24] hover:shadow-xl"
                >
                  Ücretsiz Teklif Al
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              {(props.googleRating || props.googleReviews) && (
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 bg-white/10 px-5 py-3 backdrop-blur-sm">
                  <div className="flex gap-0.5 text-[#F59E0B]">
                    {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <span className="font-[family-name:var(--font-lato)] text-sm text-white/70">
                    {props.googleRating} ({props.googleReviews}+ yorum)
                  </span>
                </motion.div>
              )}
            </div>

            {/* Sağ — Stacked facade panels image */}
            <motion.div variants={scaleIn} className="relative">
              <div className="overflow-hidden bg-[#4B5563]">
                <div className="aspect-[4/3]">
                  {heroImg ? (
                    <img src={heroImg} alt={`${props.firmName} dış cephe`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#F59E0B]/5">
                      <div className="text-center">
                        <div className="text-6xl">🏢</div>
                        <p className="mt-3 font-[family-name:var(--font-lato)] text-sm text-white/30">Proje Görseli</p>
                      </div>
                    </div>
                  )}
                </div>
                {/* Amber accent lines */}
                <div className="absolute bottom-0 left-0 h-1.5 w-full bg-[#F59E0B]" />
                <div className="absolute left-0 top-0 h-full w-1.5 bg-[#F59E0B]" />
              </div>

              {/* Floating badge */}
              <div className="absolute -right-3 bottom-8 bg-[#F59E0B] px-5 py-2.5 font-[family-name:var(--font-oswald)] text-sm font-600 uppercase text-[#374151] shadow-lg">
                200+ Bina
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#1F2937] py-20 text-white">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 border border-white/20 px-4 py-2 text-sm">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-oswald)] uppercase tracking-wider">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-oswald)] text-3xl font-700 uppercase sm:text-4xl">
            Dış Cephe Yaptırmak İsteyenler
            <br />
            <span className="text-[#F59E0B]">Referans Proje Arıyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-lato)] text-lg text-white/70">
            Cephe kaplama yaptırmak isteyenlerin <strong className="text-white">%79&apos;u</strong> önce
            tamamlanmış projeleri ve malzeme seçeneklerini araştırıyor.
          </motion.p>

          {projectsImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden">
              <img src={projectsImg} alt={`${props.firmName} projeler`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '🏢', stat: '%79', text: 'Referans proje arıyor' },
              { emoji: '🧱', stat: '%65', text: 'Malzeme karşılaştırıyor' },
              { emoji: '📸', stat: '%58', text: 'Önce/sonra görmek istiyor' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="bg-white/10 p-5 backdrop-blur-sm">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-oswald)] text-2xl font-700 text-[#F59E0B]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-lato)] text-sm text-white/60">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-oswald)] text-3xl font-700 uppercase sm:text-4xl">
            Web Sitesi <span className="text-[#F59E0B]">Olan</span> vs <span className="text-[#1F2937]/30">Olmayan</span> Cephe Firması
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="border-l-4 border-[#F59E0B] bg-[#F59E0B]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-oswald)] text-lg font-600 uppercase text-[#F59E0B]">✅ Web Sitesi Olan Firma</div>
              <ul className="space-y-3 font-[family-name:var(--font-lato)] text-[#1F2937]/70">
                {['Tamamlanan projeler online sergide', 'Malzeme çeşitleri detaylı sunuluyor', 'Google\'da "dış cephe kaplama" üst sırada', 'Toplu projeler ve ihaleler kazanıyor', 'Güvenilirlik referanslarla kanıtlanıyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-[#F59E0B]">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="border-l-4 border-[#1F2937]/10 bg-[#1F2937]/[0.03] p-8">
              <div className="mb-4 font-[family-name:var(--font-oswald)] text-lg font-600 uppercase text-[#1F2937]/30">❌ Web Sitesi Olmayan Firma</div>
              <ul className="space-y-3 font-[family-name:var(--font-lato)] text-[#1F2937]/30">
                {['Proje referansları paylaşılamıyor', 'Malzeme bilgisi telefonda anlatılmaya çalışılıyor', 'Arama sonuçlarında görünmüyor', 'Sadece tanıdık referansıyla müşteri', 'Büyük projelerde tercih edilmiyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-[#374151] opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(90deg, #374151 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="text-4xl">🏢</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-oswald)] text-3xl font-700 uppercase sm:text-4xl lg:text-5xl">
            Binanızı <span className="text-[#F59E0B]">Yeniden Giydirin</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-lato)] text-base text-[#1F2937]/60">
            Taahhüt yok, zorlama yok — {props.firmName} için ücretsiz keşif ve malzeme danışmanlığı.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 bg-[#374151] px-10 py-5 font-[family-name:var(--font-oswald)] text-lg font-600 uppercase tracking-wider text-white shadow-xl transition-all hover:bg-[#1F2937] hover:shadow-2xl">
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-[#374151]/10 py-16">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: '🏢', title: 'Ücretsiz Keşif', desc: 'Yerinde inceleme ve malzeme danışmanlığı ücretsiz.' },
            { icon: '⚡', title: '15 Yıl Garanti', desc: 'Cephe kaplama işçiliğinde 15 yıl yazılı garanti.' },
            { icon: '🧱', title: 'Premium Malzeme', desc: 'Sertifikalı, UV dayanımlı, uzun ömürlü malzemeler.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="border border-[#374151]/10 bg-white p-6 text-center shadow-sm">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-oswald)] text-base font-600 uppercase text-[#F59E0B]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-lato)] text-sm text-[#1F2937]/50">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-[#374151]/10 py-8 text-center font-[family-name:var(--font-lato)] text-sm text-[#1F2937]/30">
        <p>Bu sayfa <strong className="text-[#1F2937]/50">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
