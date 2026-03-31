'use client'

import { Bebas_Neue, Source_Sans_3 } from 'next/font/google'
import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-bebas-neue',
  display: 'swap',
})

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-source-sans-3',
  display: 'swap',
})

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6 },
  },
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
}

const slideFromLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
}

const slideFromRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
}

/* ------------------------------------------------------------------ */
/*  Animated Counter                                                   */
/* ------------------------------------------------------------------ */
function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (!inView) return

    let start = 0
    const increment = target / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [inView, target, duration])

  return <span ref={ref}>{count}</span>
}

/* ------------------------------------------------------------------ */
/*  Trust Badge                                                        */
/* ------------------------------------------------------------------ */
function TrustBadge({ icon, label }: { icon: string; label: string }) {
  return (
    <motion.div
      variants={scaleIn}
      className="flex flex-col items-center gap-3 rounded-2xl border border-[#DC2626]/20 bg-[#292524] px-10 py-8 shadow-lg shadow-black/40"
    >
      <span className="text-4xl">{icon}</span>
      <span className="font-[family-name:var(--font-bebas-neue)] text-lg uppercase tracking-widest text-[#FAFAF5]">
        {label}
      </span>
    </motion.div>
  )
}

/* ================================================================== */
/*  MAIN TEMPLATE                                                      */
/* ================================================================== */
export default function BerberlerTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const withoutSite = [
    'Hizmetleriniz bilinmiyor',
    "Google Maps'te kayıpsınız",
    'Fiyat bilgisi yok',
    'Güven oluşturamıyorsunuz',
    'Sadece ağızdan ağıza',
  ]

  const withSite = [
    'Tıraş/sakal/bakım menüsü açık',
    "Google'da ilk sırada",
    'Şeffaf fiyatlandırma',
    'Profesyonel web varlığı',
    'Sosyal medya + web entegrasyonu',
  ]

  return (
    <div className={`${bebasNeue.variable} ${sourceSans.variable} min-h-screen bg-[#292524]`}>
      {/* ============================================================ */}
      {/*  1. HERO — Full-width BG with retro overlay                   */}
      {/* ============================================================ */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative min-h-screen flex items-center overflow-hidden"
      >
        {/* Background: image or solid with diagonal stripe */}
        {props.images?.['hero-bg'] ? (
          <>
            <img
              src={props.images['hero-bg']}
              alt={props.firmName}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#292524] via-[#292524]/80 to-[#292524]/40" />
            {/* Grain texture overlay */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
                backgroundRepeat: 'repeat',
              }}
            />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-[#292524]" />
            <div className="absolute -right-24 top-0 h-full w-1/2 bg-[#DC2626]/10 -skew-x-12" />
            {/* Secondary decorative stripe */}
            <div className="absolute -right-48 top-0 h-full w-1/3 bg-[#DC2626]/5 -skew-x-12" />
          </>
        )}

        {/* Subtle vignette */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#292524] via-transparent to-[#292524]/30" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-24 lg:px-12">
          <div className="max-w-2xl space-y-8">
            {/* Google rating badge */}
            {props.googleRating && props.googleReviews && (
              <motion.div variants={fadeIn}>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#DC2626]/40 bg-[#DC2626]/10 px-5 py-2.5 backdrop-blur-sm">
                  <span className="text-lg">⭐</span>
                  <span className="font-[family-name:var(--font-source-sans-3)] text-sm font-semibold text-[#FAFAF5]/90">
                    {props.googleRating} puan &middot; {props.googleReviews} değerlendirme
                  </span>
                </div>
              </motion.div>
            )}

            {/* Decorative red line */}
            <motion.div variants={fadeIn}>
              <div className="h-1 w-16 rounded-full bg-[#DC2626]" />
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="font-[family-name:var(--font-bebas-neue)] text-5xl uppercase leading-[1.05] tracking-wider text-white sm:text-6xl lg:text-7xl xl:text-8xl"
            >
              Gerçek Bir
              <br />
              Tıraşın Adresi
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="font-[family-name:var(--font-source-sans-3)] text-xl font-semibold uppercase tracking-wide text-[#DC2626]"
            >
              {props.firmName}
            </motion.p>

            <motion.p
              variants={fadeInUp}
              className="font-[family-name:var(--font-source-sans-3)] max-w-lg text-lg leading-relaxed text-[#FAFAF5]/60"
            >
              {props.city} bölgesinde{props.district ? `, ${props.district} semtinde` : ''} dijital
              varlığınızı güçlendirin. Profesyonel web sitesi ile yeni müşteriler kazanın.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col gap-4 sm:flex-row">
              <a
                href={chatLink}
                onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                className="font-[family-name:var(--font-bebas-neue)] inline-flex items-center justify-center gap-3 rounded-xl bg-[#DC2626] px-10 py-5 text-xl uppercase tracking-wider text-white shadow-lg shadow-[#DC2626]/30 transition-all hover:shadow-xl hover:shadow-[#DC2626]/50 hover:-translate-y-0.5 active:translate-y-0"
              >
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Ücretsiz Teklif Al
              </a>
            </motion.div>
          </div>
        </div>

        {/* Bottom fade for smooth transition */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAFAF5] to-transparent" />
      </motion.section>

      {/* ============================================================ */}
      {/*  2. ALARM — Cream bg, red counter, dark text                  */}
      {/* ============================================================ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={staggerContainer}
        className="relative overflow-hidden bg-[#FAFAF5] py-24 sm:py-32"
      >
        {/* Decorative corner accents */}
        <div className="pointer-events-none absolute left-0 top-0 h-40 w-40 rounded-br-full bg-[#DC2626]/5" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-40 w-40 rounded-tl-full bg-[#DC2626]/5" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center sm:px-8">
          <motion.div variants={fadeIn} className="mb-6">
            <span className="font-[family-name:var(--font-bebas-neue)] inline-block rounded-full border border-[#DC2626]/30 bg-[#DC2626]/10 px-6 py-2 text-base uppercase tracking-widest text-[#DC2626]">
              Dikkat
            </span>
          </motion.div>

          <motion.div variants={fadeInUp} className="mb-6">
            <p className="font-[family-name:var(--font-source-sans-3)] text-lg text-[#292524]/60">
              Her gün ortalama
            </p>
          </motion.div>

          <motion.div variants={scaleIn} className="mb-8 inline-flex flex-col items-center">
            <div className="font-[family-name:var(--font-bebas-neue)] text-8xl tracking-tight text-[#DC2626] sm:text-9xl">
              <AnimatedCounter target={73} />
            </div>
            <span className="font-[family-name:var(--font-source-sans-3)] mt-1 text-lg font-semibold text-[#292524]/70">
              kişi berber arıyor
            </span>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="font-[family-name:var(--font-source-sans-3)] mx-auto max-w-2xl text-xl leading-relaxed text-[#292524]/80 sm:text-2xl"
          >
            Erkekler berber ararken{' '}
            <span className="font-bold text-[#292524]">Google Maps&apos;e bakıyor</span>.
            Profiliniz eksik &mdash;{' '}
            <span className="font-bold text-[#DC2626]">müşteri kaçıyor.</span>
          </motion.p>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  3. COMPARISON — Dark bg, red vs cream cards side by side      */}
      {/* ============================================================ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={staggerContainer}
        className="bg-[#1C1917] py-24 sm:py-32"
      >
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          {/* Section header */}
          <motion.div variants={fadeInUp} className="mb-16 text-center">
            <div className="mb-4 h-1 w-12 mx-auto rounded-full bg-[#DC2626]" />
            <h2 className="font-[family-name:var(--font-bebas-neue)] text-4xl uppercase tracking-wider text-[#FAFAF5] sm:text-5xl lg:text-6xl">
              Fark Bu Kadar Büyük
            </h2>
          </motion.div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* WITHOUT card — red tint */}
            <motion.div
              variants={slideFromLeft}
              className="rounded-3xl border border-[#DC2626]/30 bg-gradient-to-b from-[#DC2626]/10 to-[#DC2626]/5 p-8 sm:p-10"
            >
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DC2626] text-xl text-white">
                  ✕
                </span>
                <h3 className="font-[family-name:var(--font-bebas-neue)] text-2xl uppercase tracking-wider text-[#DC2626]">
                  Web Siteniz Yoksa
                </h3>
              </div>
              <ul className="space-y-4">
                {withoutSite.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#DC2626]/20 text-xs font-bold text-[#DC2626]">
                      {i + 1}
                    </span>
                    <span className="font-[family-name:var(--font-source-sans-3)] text-[15px] leading-relaxed text-red-200/90">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* WITH card — cream tint */}
            <motion.div
              variants={slideFromRight}
              className="rounded-3xl border border-[#FAFAF5]/20 bg-gradient-to-b from-[#FAFAF5]/10 to-[#FAFAF5]/5 p-8 sm:p-10"
            >
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FAFAF5] text-xl text-[#292524]">
                  ✓
                </span>
                <h3 className="font-[family-name:var(--font-bebas-neue)] text-2xl uppercase tracking-wider text-[#FAFAF5]">
                  Web Siteniz Olursa
                </h3>
              </div>
              <ul className="space-y-4">
                {withSite.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FAFAF5]/20 text-xs font-bold text-[#FAFAF5]">
                      {i + 1}
                    </span>
                    <span className="font-[family-name:var(--font-source-sans-3)] text-[15px] leading-relaxed text-[#FAFAF5]/80">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  4. CHAT CTA — Grid: left text + button, right tools image    */}
      {/* ============================================================ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={staggerContainer}
        className="relative overflow-hidden bg-[#292524] py-24 sm:py-32"
      >
        {/* Red glow accents */}
        <div className="pointer-events-none absolute -left-32 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-[#DC2626]/8 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-64 w-64 rounded-full bg-[#DC2626]/5 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Left — CTA text */}
            <div className="space-y-6">
              <motion.div variants={fadeIn}>
                <div className="h-1 w-12 rounded-full bg-[#DC2626]" />
              </motion.div>

              <motion.h2
                variants={fadeInUp}
                className="font-[family-name:var(--font-bebas-neue)] text-4xl uppercase tracking-wider text-[#FAFAF5] sm:text-5xl lg:text-6xl"
              >
                Hemen Teklif Alın
              </motion.h2>

              <motion.p
                variants={fadeInUp}
                className="font-[family-name:var(--font-source-sans-3)] max-w-md text-lg leading-relaxed text-[#FAFAF5]/60"
              >
                Taahhüt yok, zorlama yok &mdash; sadece işletmenize özel fiyat bilgisi.
                Berber dükkanınızı dijitale taşıyalım.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="font-[family-name:var(--font-bebas-neue)] group relative inline-flex items-center gap-3 rounded-xl bg-[#DC2626] px-10 py-5 text-xl uppercase tracking-wider text-white shadow-2xl shadow-[#DC2626]/30 transition-all hover:shadow-[#DC2626]/50 hover:-translate-y-1 active:translate-y-0"
                >
                  {/* Pulsing ring */}
                  <span
                    className="absolute inset-0 rounded-xl animate-ping bg-[#DC2626]/25"
                    style={{ animationDuration: '2.5s' }}
                  />
                  <span className="relative flex items-center gap-3">
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Ücretsiz Teklif Al
                  </span>
                </a>
              </motion.div>
            </div>

            {/* Right — Tools image or emoji fallback */}
            <motion.div variants={slideFromRight} className="flex items-center justify-center lg:justify-end">
              {props.images?.tools ? (
                <div className="overflow-hidden rounded-2xl border-2 border-[#DC2626]/40 shadow-2xl shadow-[#DC2626]/10">
                  <img
                    src={props.images.tools}
                    alt="Berber aletleri"
                    className="h-auto w-full max-w-md object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-64 w-64 items-center justify-center rounded-2xl border border-[#DC2626]/20 bg-gradient-to-br from-[#DC2626]/10 to-[#DC2626]/5 sm:h-80 sm:w-80">
                  <span className="text-8xl sm:text-9xl">💈</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  5. GUARANTEE — 3 badges                                      */}
      {/* ============================================================ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={staggerContainer}
        className="bg-[#1C1917] py-24 sm:py-32"
      >
        <div className="mx-auto max-w-4xl px-6 text-center sm:px-8">
          <motion.div variants={fadeIn} className="mb-4">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-[#DC2626]/30 bg-[#DC2626]/10 text-3xl">
              🛡️
            </span>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="font-[family-name:var(--font-bebas-neue)] mb-4 text-4xl uppercase tracking-wider text-[#FAFAF5] sm:text-5xl"
          >
            Garantimiz
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="font-[family-name:var(--font-source-sans-3)] mx-auto mb-14 max-w-2xl text-lg leading-relaxed text-[#FAFAF5]/60"
          >
            Tamamen ücretsiz keşif görüşmesi. Beğenmezseniz hiçbir ücret ödemezsiniz.
          </motion.p>

          <motion.div
            variants={staggerContainer}
            className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-8"
          >
            <TrustBadge icon="🆓" label="Ücretsiz Danışmanlık" />
            <TrustBadge icon="💈" label="Usta Berberler" />
            <TrustBadge icon="✨" label="Hijyen Garantisi" />
          </motion.div>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  6. FOOTER                                                    */}
      {/* ============================================================ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="border-t border-[#DC2626]/10 bg-[#292524] py-12"
      >
        <div className="mx-auto max-w-4xl px-6 text-center sm:px-8">
          <p className="font-[family-name:var(--font-source-sans-3)] mb-3 text-sm leading-relaxed text-[#FAFAF5]/40">
            Bu sayfa <span className="text-[#FAFAF5]/80">{props.firmName}</span> için{' '}
            <a
              href="https://vframer.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#DC2626] underline decoration-[#DC2626]/30 underline-offset-2 transition-colors hover:text-[#EF4444]"
            >
              Vorte Studio
            </a>{' '}
            tarafından hazırlanmıştır.
          </p>
          <p className="font-[family-name:var(--font-source-sans-3)] text-xs text-[#FAFAF5]/30">
            &copy; {new Date().getFullYear()} Vorte Studio. Tüm hakları saklıdır.
          </p>
        </div>
      </motion.section>
    </div>
  )
}
