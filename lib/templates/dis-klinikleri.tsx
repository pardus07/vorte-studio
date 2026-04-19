'use client'

import { Outfit, DM_Sans } from 'next/font/google'
import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-outfit',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
})

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */
const fadeUp = {
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
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
}

/* ------------------------------------------------------------------ */
/*  Animated Counter Component                                         */
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
/*  Comparison Row                                                     */
/* ------------------------------------------------------------------ */
function ComparisonRow({
  negative,
  positive,
  index,
}: {
  negative: string
  positive: string
  index: number
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
    >
      {/* Negative */}
      <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50/60 p-5">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-500 text-white text-sm font-bold">
          {index}
        </span>
        <p className={`${dmSans.className} text-[15px] leading-relaxed text-red-800`}>
          {negative}
        </p>
      </div>

      {/* Positive */}
      <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white text-sm font-bold">
          {index}
        </span>
        <p className={`${dmSans.className} text-[15px] leading-relaxed text-emerald-800`}>
          {positive}
        </p>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Trust Badge                                                        */
/* ------------------------------------------------------------------ */
function TrustBadge({ icon, label }: { icon: string; label: string }) {
  return (
    <motion.div
      variants={scaleIn}
      className="flex flex-col items-center gap-2 rounded-2xl bg-white px-8 py-6 shadow-lg shadow-slate-200/50"
    >
      <span className="text-3xl">{icon}</span>
      <span className={`${outfit.className} text-sm font-semibold text-[#1E293B]`}>
        {label}
      </span>
    </motion.div>
  )
}

/* ================================================================== */
/*  MAIN TEMPLATE                                                      */
/* ================================================================== */
export default function DisKlinikleriTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const comparisons = [
    {
      negative: 'Hastalar sizi bulamıyor',
      positive: "Google'da ilk sırada çıkıyorsunuz",
    },
    {
      negative: 'Rakiplerinize gidiyorlar',
      positive: 'Online randevu alabiliyorlar',
    },
    {
      negative: 'Güven oluşturamıyorsunuz',
      positive: 'Profesyonel imaj sunuyorsunuz',
    },
    {
      negative: 'Telefon trafiği düşük',
      positive: '7/24 bilgi erişimi sağlıyorsunuz',
    },
    {
      negative: 'Büyüyemiyorsunuz',
      positive: 'Hasta portföyünüz sürekli artıyor',
    },
  ]

  return (
    <div className={`${outfit.variable} ${dmSans.variable} min-h-screen bg-white`}>
      {/* ============================================================ */}
      {/*  1. HERO                                                      */}
      {/* ============================================================ */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative min-h-screen flex items-center overflow-hidden"
      >
        {/* Decorative gradient circle */}
        <div className="pointer-events-none absolute -right-32 top-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-[#0EA5E9]/20 via-[#10B981]/15 to-transparent blur-3xl md:h-[800px] md:w-[800px]" />
        <div className="pointer-events-none absolute right-12 top-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-[#0EA5E9]/30 to-[#10B981]/20 blur-2xl md:h-[400px] md:w-[400px]" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left — Text */}
            <div className="space-y-8">
              {/* Google rating badge */}
              {props.googleRating && props.googleReviews && (
                <motion.div variants={fadeIn} className="inline-block">
                  <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-4 py-2">
                    <span className="text-lg">⭐</span>
                    <span className={`${dmSans.className} text-sm font-medium text-amber-800`}>
                      {props.googleRating} ({props.googleReviews} değerlendirme)
                    </span>
                  </div>
                </motion.div>
              )}

              <motion.h1
                variants={fadeUp}
                className={`${outfit.className} text-4xl font-extrabold leading-[1.1] tracking-tight text-[#1E293B] sm:text-5xl lg:text-6xl`}
              >
                {props.city} bölgesinin en çok tercih edilen diş kliniği olmak{' '}
                <span className="bg-gradient-to-r from-[#0EA5E9] to-[#10B981] bg-clip-text text-transparent">
                  bir adım uzağınızda
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className={`${dmSans.className} max-w-lg text-lg leading-relaxed text-slate-500`}
              >
                <span className="font-medium text-[#1E293B]">{props.firmName}</span> olarak
                dijital varlığınızı güçlendirin. Modern, hızlı ve hasta odaklı bir web sitesi
                ile rakiplerinizin önüne geçin.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="flex flex-col gap-4 sm:flex-row"
              >
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className={`${outfit.className} inline-flex items-center justify-center gap-2 rounded-2xl bg-[#10B981] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#10B981]/25 transition-all hover:shadow-xl hover:shadow-[#10B981]/30 hover:-translate-y-0.5 active:translate-y-0`}
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Ücretsiz Teklif Al
                </a>
              </motion.div>
            </div>

            {/* Right — Hero görseli veya dekoratif illüstrasyon */}
            <motion.div
              variants={scaleIn}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative">
                {props.images?.hero ? (
                  <div className="h-80 w-80 overflow-hidden rounded-full shadow-2xl shadow-[#0EA5E9]/20 ring-4 ring-white/80">
                    <img
                      src={props.images.hero}
                      alt={props.firmName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-80 w-80 rounded-full bg-gradient-to-br from-[#0EA5E9]/10 to-[#10B981]/10 flex items-center justify-center">
                    <div className="h-56 w-56 rounded-full bg-gradient-to-br from-[#0EA5E9]/15 to-[#10B981]/15 flex items-center justify-center">
                      <span className="text-8xl">🦷</span>
                    </div>
                  </div>
                )}
                {/* Floating badges */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className="absolute -left-4 top-8 rounded-2xl bg-white px-4 py-3 shadow-lg shadow-slate-200/50"
                >
                  <span className={`${dmSans.className} text-sm font-medium text-[#1E293B]`}>
                    ✨ Modern Tasarım
                  </span>
                </motion.div>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                  className="absolute -right-4 bottom-12 rounded-2xl bg-white px-4 py-3 shadow-lg shadow-slate-200/50"
                >
                  <span className={`${dmSans.className} text-sm font-medium text-[#1E293B]`}>
                    📱 Mobil Uyumlu
                  </span>
                </motion.div>
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="absolute -right-8 top-20 rounded-2xl bg-white px-4 py-3 shadow-lg shadow-slate-200/50"
                >
                  <span className={`${dmSans.className} text-sm font-medium text-[#1E293B]`}>
                    🚀 Hızlı Yükleme
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  2. ALARM SECTION                                             */}
      {/* ============================================================ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={staggerContainer}
        className="relative overflow-hidden bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 py-24 sm:py-32"
      >
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-red-200 blur-3xl" />
          <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-orange-200 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-5 text-center sm:px-8">
          <motion.div variants={fadeUp} className="mb-4">
            <span className={`${outfit.className} inline-block rounded-full bg-red-100 px-4 py-1.5 text-sm font-semibold text-red-700`}>
              ⚠️ Dikkat
            </span>
          </motion.div>

          {/* Animated counter */}
          <motion.div
            variants={scaleIn}
            className="mb-8 inline-flex flex-col items-center"
          >
            <div className={`${outfit.className} text-7xl font-extrabold text-red-600 sm:text-8xl lg:text-9xl`}>
              <AnimatedCounter target={60} />
            </div>
            <span className={`${dmSans.className} mt-2 text-lg font-medium text-red-500`}>
              günlük arama
            </span>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className={`${dmSans.className} mx-auto max-w-2xl text-xl leading-relaxed text-slate-700 sm:text-2xl`}
          >
            Her gün yaklaşık <span className="font-medium text-red-600">60 kişi</span>{' '}
            &ldquo;{props.city} diş kliniği&rdquo; araması yapıyor.{' '}
            <span className="font-medium text-slate-900">
              Web siteniz yoksa bu hastaları hiç göremiyorsunuz.
            </span>
          </motion.p>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  3. COMPARISON SECTION                                        */}
      {/* ============================================================ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={staggerContainer}
        className="py-24 sm:py-32"
      >
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          {/* Section header */}
          <motion.div variants={fadeUp} className="mb-16 text-center">
            <span className={`${outfit.className} mb-3 inline-block rounded-full bg-slate-100 px-4 py-1.5 text-sm font-semibold text-slate-600`}>
              Karşılaştırma
            </span>
            <h2 className={`${outfit.className} text-3xl font-bold text-[#1E293B] sm:text-4xl`}>
              Fark bu kadar büyük
            </h2>
          </motion.div>

          {/* Column headers */}
          <motion.div
            variants={fadeIn}
            className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
          >
            <div className={`${outfit.className} rounded-xl bg-red-500 px-5 py-3 text-center text-base font-bold text-white`}>
              ❌ Web Siteniz Yoksa
            </div>
            <div className={`${outfit.className} rounded-xl bg-emerald-500 px-5 py-3 text-center text-base font-bold text-white`}>
              ✅ Web Siteniz Olursa
            </div>
          </motion.div>

          {/* Rows */}
          <div className="space-y-4">
            {comparisons.map((item, i) => (
              <ComparisonRow
                key={i}
                index={i + 1}
                negative={item.negative}
                positive={item.positive}
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  5. CHAT CTA                                                  */}
      {/* ============================================================ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={staggerContainer}
        className="relative overflow-hidden bg-gradient-to-br from-[#10B981] via-[#059669] to-[#047857] py-24 sm:py-32"
      >
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -right-20 top-1/4 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl px-5 text-center sm:px-8">
          <motion.div variants={fadeUp} className="mb-3">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl backdrop-blur-sm">
              💬
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className={`${outfit.className} mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl`}
          >
            Ücretsiz Teklif Alın
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className={`${dmSans.className} mx-auto mb-12 max-w-xl text-lg leading-relaxed text-emerald-100`}
          >
            Taahhüt yok, zorlama yok — sadece işletmenize özel fiyat bilgisi.
            Hemen konuşalım.
          </motion.p>

          <motion.div variants={scaleIn}>
            <a
              href={chatLink}
              onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className={`${outfit.className} group relative inline-flex items-center gap-3 rounded-2xl bg-white px-12 py-6 text-xl font-bold text-[#059669] shadow-2xl transition-all hover:shadow-3xl hover:-translate-y-1 active:translate-y-0`}
            >
              {/* Pulsing ring */}
              <span className="absolute inset-0 rounded-2xl animate-ping bg-white/30" style={{ animationDuration: '2s' }} />
              <span className="relative flex items-center gap-3">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Ücretsiz Teklif Al
              </span>
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  6. GUARANTEE SECTION                                         */}
      {/* ============================================================ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={staggerContainer}
        className="py-24 sm:py-32"
      >
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <motion.div variants={fadeUp} className="mb-4">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl">
              🛡️
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className={`${outfit.className} mb-4 text-3xl font-bold text-[#1E293B] sm:text-4xl`}
          >
            Risk Yok, Taahhüt Yok
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className={`${dmSans.className} mx-auto mb-14 max-w-2xl text-lg leading-relaxed text-slate-500`}
          >
            Tamamen ücretsiz keşif görüşmesi. Beğenmezseniz hiçbir ücret ödemezsiniz.
          </motion.p>

          <motion.div
            variants={staggerContainer}
            className="flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-8"
          >
            <TrustBadge icon="🆓" label="Ücretsiz" />
            <TrustBadge icon="📋" label="Taahhütsüz" />
            <TrustBadge icon="🕐" label="7/24 Destek" />
          </motion.div>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  7. FOOTER                                                    */}
      {/* ============================================================ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="bg-[#1E293B] py-12"
      >
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <p className={`${dmSans.className} mb-3 text-sm leading-relaxed text-slate-400`}>
            Bu sayfa <span className="text-white">{props.firmName}</span> için{' '}
            <a
              href="https://vframer.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0EA5E9] underline decoration-[#0EA5E9]/30 underline-offset-2 transition-colors hover:text-[#38BDF8]"
            >
              Vorte Studio
            </a>{' '}
            tarafından hazırlanmıştır.
          </p>
          <p className={`${dmSans.className} text-xs text-slate-500`}>
            &copy; {new Date().getFullYear()} Vorte Studio. Tüm hakları saklıdır.
          </p>
        </div>
      </motion.section>
    </div>
  )
}
