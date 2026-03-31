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

export default function IsiYalitimTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const projectsImg = props.images?.projects

  return (
    <div className={`${oswald.variable} ${lato.variable} min-h-screen bg-white text-[#1C1917]`}>
      {/* ═══════════════════ HERO — Energy Savings Gauge + Thermal Layers ═══════════════════ */}
      <section className="relative overflow-hidden bg-[#78350F] pb-20 pt-16 text-white">
        {/* Thermal gradient layers — diagonal warm-to-cool bands */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 opacity-[0.08]" style={{
            backgroundImage: 'repeating-linear-gradient(135deg, #FDE68A 0px, #FDE68A 20px, transparent 20px, transparent 60px, #EF4444 60px, #EF4444 80px, transparent 80px, transparent 120px)',
          }} />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
          >
            <div className="space-y-8">
              {/* Energy badge */}
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full bg-[#FDE68A]/20 px-5 py-2">
                <span className="text-lg">🔥</span>
                <span className="font-[family-name:var(--font-lato)] text-sm font-700 uppercase tracking-wider text-[#FDE68A]">
                  Enerji Tasarrufu
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-oswald)] text-5xl font-700 uppercase leading-none sm:text-6xl lg:text-7xl">
                Faturalarınızı
                <br />
                <span className="text-[#FDE68A]">Yarıya</span>
                <br />
                İndirin
              </motion.h1>

              <motion.p variants={fadeInUp} className="max-w-md font-[family-name:var(--font-lato)] text-base leading-relaxed text-white/70">
                <strong className="text-white">{props.firmName}</strong> — profesyonel ısı yalıtım ve
                mantolama çözümleri. {props.city} genelinde enerji tasarrufu garantisi.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 bg-[#FDE68A] px-8 py-4 font-[family-name:var(--font-oswald)] text-base font-600 uppercase tracking-wider text-[#78350F] shadow-lg transition-all hover:bg-[#FEF08A] hover:shadow-xl"
                >
                  Ücretsiz Teklif Al
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              {(props.googleRating || props.googleReviews) && (
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 rounded-lg bg-white/10 px-5 py-3 backdrop-blur-sm">
                  <div className="flex gap-0.5 text-[#FDE68A]">
                    {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <span className="font-[family-name:var(--font-lato)] text-sm text-white/70">
                    {props.googleRating} ({props.googleReviews}+ yorum)
                  </span>
                </motion.div>
              )}
            </div>

            {/* Sağ — Energy gauge + image */}
            <motion.div variants={scaleIn} className="relative">
              {/* Circular energy gauge decoration */}
              <div className="absolute -left-6 -top-6 z-10 flex h-28 w-28 flex-col items-center justify-center rounded-full bg-[#FDE68A] shadow-xl">
                <span className="font-[family-name:var(--font-oswald)] text-3xl font-700 text-[#78350F]">%50</span>
                <span className="font-[family-name:var(--font-lato)] text-[10px] font-700 uppercase text-[#78350F]/70">Tasarruf</span>
              </div>

              <div className="overflow-hidden rounded-2xl bg-[#92400E]">
                <div className="aspect-[4/3]">
                  {heroImg ? (
                    <img src={heroImg} alt={`${props.firmName} mantolama`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#FDE68A]/10">
                      <div className="text-center">
                        <div className="text-6xl">🏠</div>
                        <p className="mt-3 font-[family-name:var(--font-lato)] text-sm text-white/30">Proje Görseli</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Thermal layer strip */}
              <div className="mt-3 flex overflow-hidden rounded-lg">
                {[
                  { color: '#EF4444', label: 'Sıcak' },
                  { color: '#F97316', label: 'Ilık' },
                  { color: '#FDE68A', label: 'Yalıtım' },
                  { color: '#3B82F6', label: 'Soğuk' },
                ].map((layer, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center py-2" style={{ backgroundColor: layer.color }}>
                    <span className="font-[family-name:var(--font-lato)] text-[10px] font-700 text-white drop-shadow-sm">{layer.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#FEF3C7] py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#78350F] px-5 py-2 text-sm text-white">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-oswald)] uppercase tracking-wider">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-oswald)] text-3xl font-700 uppercase text-[#78350F] sm:text-4xl">
            Mantolamayı Düşünenler
            <br />
            <span className="text-[#B45309]">Enerji Tasarrufu Hesabı Arıyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-lato)] text-lg text-[#78350F]/70">
            Yalıtım yaptırmak isteyenlerin <strong className="text-[#78350F]">%76&apos;sı</strong> önce
            amortisman süresi ve tasarruf oranını araştırıyor. Web siteniz yoksa hesap yapamıyorlar.
          </motion.p>

          {projectsImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden rounded-xl border-2 border-[#78350F]/20">
              <img src={projectsImg} alt={`${props.firmName} projeler`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '🔥', stat: '%50', text: 'Enerji tasarrufu' },
              { emoji: '📊', stat: '2-3 Yıl', text: 'Amortisman süresi' },
              { emoji: '🏠', stat: '%76', text: 'Online araştırıyor' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="rounded-xl bg-white p-5 shadow-sm">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-oswald)] text-2xl font-700 text-[#78350F]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-lato)] text-sm text-[#78350F]/60">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-oswald)] text-3xl font-700 uppercase sm:text-4xl">
            Yalıtım <span className="text-[#78350F]">Olan</span> vs <span className="text-[#1C1917]/30">Olmayan</span> Bina
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="rounded-2xl border-2 border-[#78350F]/20 bg-[#78350F]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-oswald)] text-lg font-600 uppercase text-[#78350F]">✅ Yalıtımlı Bina</div>
              <ul className="space-y-3 font-[family-name:var(--font-lato)] text-[#1C1917]/70">
                {['Kış aylarında %50 enerji tasarrufu', 'Yaz aylarında serin, kışın sıcak', 'Bina değeri artıyor', 'Nem ve küf sorunu bitiyor', 'Devlet teşviklerinden yararlanıyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-[#78350F]">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="rounded-2xl border border-[#1C1917]/10 bg-[#1C1917]/[0.03] p-8">
              <div className="mb-4 font-[family-name:var(--font-oswald)] text-lg font-600 uppercase text-[#1C1917]/30">❌ Yalıtımsız Bina</div>
              <ul className="space-y-3 font-[family-name:var(--font-lato)] text-[#1C1917]/30">
                {['Yüksek doğalgaz ve elektrik faturaları', 'Duvarlarda nem ve küf oluşumu', 'Sıcaklık dengesizliği', 'Bina ömrü kısalıyor', 'Devlet teşviklerini kaçırıyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="bg-[#78350F] py-24 text-white">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="text-4xl">🏠</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-oswald)] text-3xl font-700 uppercase sm:text-4xl lg:text-5xl">
            Evinizi <span className="text-[#FDE68A]">Yalıtarak Tasarruf Edin</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-lato)] text-base text-white/60">
            Taahhüt yok, zorlama yok — {props.firmName} için ücretsiz keşif ve enerji tasarrufu hesabı.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 bg-[#FDE68A] px-10 py-5 font-[family-name:var(--font-oswald)] text-lg font-600 uppercase tracking-wider text-[#78350F] shadow-xl transition-all hover:bg-[#FEF08A] hover:shadow-2xl">
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-[#78350F]/10 py-16">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: '🔥', title: 'Ücretsiz Keşif', desc: 'Enerji tasarruf analizi ve amortisman hesabı ücretsiz.' },
            { icon: '⚡', title: '10 Yıl Garanti', desc: 'Mantolama işçiliğinde 10 yıl yazılı garanti.' },
            { icon: '📊', title: '%50 Tasarruf', desc: 'Isı kaybını minimuma indirerek faturalarınızı düşürün.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="rounded-xl border border-[#78350F]/10 bg-[#FEF3C7]/30 p-6 text-center">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-oswald)] text-base font-600 uppercase text-[#78350F]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-lato)] text-sm text-[#1C1917]/50">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-[#78350F]/10 py-8 text-center font-[family-name:var(--font-lato)] text-sm text-[#1C1917]/30">
        <p>Bu sayfa <strong className="text-[#1C1917]/50">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
