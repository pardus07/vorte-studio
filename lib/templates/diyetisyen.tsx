'use client'

import { Quicksand, Mulish } from 'next/font/google'
import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { TemplateProps, buildChatLink } from './types'
import { suffixDe, suffixIn } from './turkish-grammar'
import { useTrackPageView, trackEvent } from './use-track'

const quicksand = Quicksand({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-quicksand',
  display: 'swap',
})

const mulish = Mulish({
  subsets: ['latin-ext'],
  weight: ['400', '600'],
  variable: '--font-mulish',
  display: 'swap',
})

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 36 },
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
    transition: { staggerChildren: 0.13 },
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

/* ------------------------------------------------------------------ */
/*  Animated Counter                                                   */
/* ------------------------------------------------------------------ */
function AnimatedCounter({
  target,
  duration = 2000,
  suffix = '',
}: {
  target: number
  duration?: number
  suffix?: string
}) {
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

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

/* ================================================================== */
/*  MAIN TEMPLATE                                                      */
/* ================================================================== */
export default function DiyetisyenTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const negatives = [
    'Danışanlar sizi bulamıyor',
    'Program detaylarınız bilinmiyor',
    'Başarı hikayelerinizi paylaşamıyorsunuz',
    'Online danışmanlık sunamıyorsunuz',
    'Rakipleriniz öne geçiyor',
  ]

  const positives = [
    "Google'da kolayca bulunuyorsunuz",
    'Tüm program paketlerinizi gösteriyorsunuz',
    'Danışan yorumları ve dönüşüm hikayeleri',
    'Online diyet takibi hizmeti',
    'Güvenilir ve profesyonel imaj',
  ]

  return (
    <div
      className={`${quicksand.variable} ${mulish.variable} min-h-screen`}
      style={{ backgroundColor: '#FEFDF5' }}
    >
      {/* ============================================================ */}
      {/*  1. HERO                                                      */}
      {/* ============================================================ */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
        }}
      >
        {/* Decorative circles */}
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #A3E635 0%, transparent 70%)',
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, #A3E635 0%, transparent 70%)',
          }}
        />

        <div className={`relative z-10 mx-auto px-5 pb-20 pt-16 sm:px-8 md:pb-28 md:pt-24 lg:px-12 ${props.images?.hero ? 'max-w-6xl' : 'max-w-4xl text-center'}`}>
          {props.images?.hero ? (
            /* ---- Grid layout: text left + image right ---- */
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="text-center lg:text-left">
                {/* Google rating badge */}
                {props.googleRating && props.googleRating > 0 && (
                  <motion.div variants={fadeIn} className="mb-6 inline-block">
                    <div className="inline-flex items-center gap-2.5 rounded-full bg-white px-5 py-2.5 shadow-lg">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4.5 w-4.5 ${
                              i < Math.round(props.googleRating!)
                                ? 'text-amber-400'
                                : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span
                        className={`${quicksand.className} text-sm font-bold text-[#1a2e05]`}
                      >
                        {props.googleRating}
                      </span>
                      {props.googleReviews && (
                        <span
                          className={`${mulish.className} text-sm text-[#1a2e05]/60`}
                        >
                          ({props.googleReviews} değerlendirme)
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}

                <motion.h1
                  variants={fadeUp}
                  className={`${quicksand.className} text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl`}
                >
                  Hedef kilonuza giden yol{' '}
                  <span className="underline decoration-white/40 decoration-4 underline-offset-4">
                    {props.firmName}
                  </span>
                  &apos;dan geçiyor
                </motion.h1>

                <motion.p
                  variants={fadeUp}
                  className={`${mulish.className} mt-5 max-w-lg text-lg text-white/85 md:text-xl lg:mx-0`}
                >
                  {suffixDe(props.city)} uzman diyetisyen desteği
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  variants={fadeUp}
                  className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
                >
                  <a
                    href={chatLink}
                    onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                    className={`${quicksand.className} inline-flex items-center justify-center gap-2 rounded-full bg-[#1A2E05] px-8 py-4 text-base font-bold text-white shadow-lg shadow-black/15 transition-all hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0`}
                  >
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    Ücretsiz Teklif Al
                  </a>
                </motion.div>
              </div>

              {/* Hero image column */}
              <motion.div
                variants={scaleIn}
                className="hidden lg:flex items-center justify-center"
              >
                <div className="h-80 w-80 overflow-hidden rounded-3xl shadow-2xl shadow-[#84CC16]/20 ring-4 ring-[#84CC16]/20">
                  <img
                    src={props.images.hero}
                    alt={props.firmName}
                    className="h-full w-full object-cover"
                  />
                </div>
              </motion.div>
            </div>
          ) : (
            /* ---- Original centered layout (no image) ---- */
            <>
              {/* Google rating badge */}
              {props.googleRating && props.googleRating > 0 && (
                <motion.div variants={fadeIn} className="mb-6 inline-block">
                  <div className="inline-flex items-center gap-2.5 rounded-full bg-white px-5 py-2.5 shadow-lg">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4.5 w-4.5 ${
                            i < Math.round(props.googleRating!)
                              ? 'text-amber-400'
                              : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span
                      className={`${quicksand.className} text-sm font-bold text-[#1a2e05]`}
                    >
                      {props.googleRating}
                    </span>
                    {props.googleReviews && (
                      <span
                        className={`${mulish.className} text-sm text-[#1a2e05]/60`}
                      >
                        ({props.googleReviews} değerlendirme)
                      </span>
                    )}
                  </div>
                </motion.div>
              )}

              <motion.h1
                variants={fadeUp}
                className={`${quicksand.className} text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl`}
              >
                Hedef kilonuza giden yol{' '}
                <span className="underline decoration-white/40 decoration-4 underline-offset-4">
                  {props.firmName}
                </span>
                &apos;dan geçiyor
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className={`${mulish.className} mx-auto mt-5 max-w-lg text-lg text-white/85 md:text-xl`}
              >
                {suffixDe(props.city)} uzman diyetisyen desteği
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={fadeUp}
                className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
              >
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className={`${quicksand.className} inline-flex items-center justify-center gap-2 rounded-full bg-[#1A2E05] px-8 py-4 text-base font-bold text-white shadow-lg shadow-black/15 transition-all hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0`}
                >
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  Ücretsiz Teklif Al
                </a>
              </motion.div>

              {/* Floating decorative badges */}
              <div className="pointer-events-none mt-12 hidden items-center justify-center gap-6 lg:flex">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    ease: 'easeInOut',
                  }}
                  className="rounded-2xl bg-white/15 px-4 py-3 backdrop-blur-sm"
                >
                  <span
                    className={`${mulish.className} text-sm font-medium text-white`}
                  >
                    🥗 Kişiye Özel Programlar
                  </span>
                </motion.div>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 3.5,
                    ease: 'easeInOut',
                  }}
                  className="rounded-2xl bg-white/15 px-4 py-3 backdrop-blur-sm"
                >
                  <span
                    className={`${mulish.className} text-sm font-medium text-white`}
                  >
                    📊 Online Takip
                  </span>
                </motion.div>
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                    ease: 'easeInOut',
                  }}
                  className="rounded-2xl bg-white/15 px-4 py-3 backdrop-blur-sm"
                >
                  <span
                    className={`${mulish.className} text-sm font-medium text-white`}
                  >
                    💪 Dönüşüm Hikayeleri
                  </span>
                </motion.div>
              </div>
            </>
          )}
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            className="w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0 80V30C240 70 480 0 720 30C960 60 1200 10 1440 40V80H0Z"
              fill="#FEFDF5"
            />
          </svg>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  2. ALARM                                                     */}
      {/* ============================================================ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={staggerContainer}
        className="px-5 py-16 sm:px-8 md:py-24"
      >
        <motion.div
          variants={fadeUp}
          className="mx-auto max-w-2xl rounded-2xl border-l-4 p-8 shadow-sm md:p-10"
          style={{
            borderLeftColor: '#84CC16',
            backgroundColor: '#F7FEE7',
          }}
        >
          <div className="mb-4 text-3xl">🔍</div>

          <h2
            className={`${quicksand.className} text-xl font-bold md:text-2xl`}
            style={{ color: '#92400E' }}
          >
            Diyet programı arayanlar online danışman arıyor. Web siteniz yoksa
            sizi bulamıyorlar.
          </h2>

          {/* Animated counter stat */}
          <motion.div variants={scaleIn} className="mt-8 text-center">
            <div
              className={`${quicksand.className} text-5xl font-bold sm:text-6xl`}
              style={{ color: '#84CC16' }}
            >
              <AnimatedCounter target={5} suffix="/5" />
            </div>
            <p
              className={`${mulish.className} mt-2 text-base`}
              style={{ color: '#92400E' }}
            >
              Her 5 kişiden 3&apos;ü online diyetisyen arıyor
            </p>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className={`${mulish.className} mt-6 text-sm leading-relaxed`}
            style={{ color: '#92400E', opacity: 0.75 }}
          >
            Sağlıklı beslenme ve kilo yönetimi konusunda danışan bulmak artık
            dijital görünürlükten geçiyor. Online varlığınız, güveninizdir.
          </motion.p>
        </motion.div>
      </motion.section>

      {/* ============================================================ */}
      {/*  3. COMPARISON                                                */}
      {/* ============================================================ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={staggerContainer}
        className="px-5 py-16 sm:px-8 md:py-24"
      >
        <motion.div variants={fadeUp} className="mb-12 text-center">
          <span
            className={`${quicksand.className} mb-3 inline-block rounded-full px-4 py-1.5 text-sm font-semibold`}
            style={{ backgroundColor: '#F7FEE7', color: '#65A30D' }}
          >
            Karşılaştırma
          </span>
          <h2
            className={`${quicksand.className} text-2xl font-bold sm:text-3xl md:text-4xl`}
            style={{ color: '#1A2E05' }}
          >
            Fark bu kadar net
          </h2>
        </motion.div>

        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {/* Without Website */}
          <motion.div
            variants={fadeUp}
            className="rounded-3xl border p-6 md:p-8"
            style={{
              borderColor: 'rgba(146, 64, 14, 0.15)',
              background:
                'linear-gradient(135deg, rgba(146,64,14,0.04) 0%, rgba(254,253,245,1) 100%)',
            }}
          >
            <div className="mb-5 flex items-center gap-3">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold text-white"
                style={{ backgroundColor: '#DC2626' }}
              >
                ✕
              </span>
              <h3
                className={`${quicksand.className} text-lg font-bold`}
                style={{ color: '#92400E' }}
              >
                Web Siteniz Yoksa
              </h3>
            </div>
            <ul className="space-y-3.5">
              {negatives.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: '#EF4444' }}
                  >
                    ✕
                  </span>
                  <span
                    className={`${mulish.className} text-sm leading-relaxed`}
                    style={{ color: '#92400E', opacity: 0.85 }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* With Website */}
          <motion.div
            variants={fadeUp}
            className="rounded-3xl border p-6 md:p-8"
            style={{
              borderColor: 'rgba(132,204,22,0.2)',
              background:
                'linear-gradient(135deg, rgba(132,204,22,0.06) 0%, rgba(254,253,245,1) 100%)',
            }}
          >
            <div className="mb-5 flex items-center gap-3">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold text-white"
                style={{ backgroundColor: '#84CC16' }}
              >
                ✓
              </span>
              <h3
                className={`${quicksand.className} text-lg font-bold`}
                style={{ color: '#65A30D' }}
              >
                Web Siteniz Olursa
              </h3>
            </div>
            <ul className="space-y-3.5">
              {positives.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: '#84CC16' }}
                  >
                    ✓
                  </span>
                  <span
                    className={`${mulish.className} text-sm leading-relaxed`}
                    style={{ color: '#1A2E05', opacity: 0.8 }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
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
        className="relative overflow-hidden py-20 sm:py-28"
        style={{ backgroundColor: '#92400E' }}
      >
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute -left-20 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full blur-3xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
          />
          <div
            className="absolute -right-20 top-1/4 h-72 w-72 rounded-full blur-3xl"
            style={{ backgroundColor: 'rgba(163,230,53,0.06)' }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl px-5 text-center sm:px-8">
          <motion.div variants={fadeUp} className="mb-4">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl backdrop-blur-sm">
              💬
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className={`${quicksand.className} mb-4 text-2xl font-bold text-white sm:text-3xl md:text-4xl lg:text-5xl`}
          >
            Ücretsiz Teklif Alın
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className={`${mulish.className} mx-auto mb-12 max-w-xl text-base leading-relaxed md:text-lg`}
            style={{ color: 'rgba(255,255,255,0.75)' }}
          >
            Sağlıklı yaşam yolculuğunuza ortak olalım. Taahhüt yok, zorlama
            yok &mdash; sadece size özel fiyat bilgisi.
          </motion.p>

          <motion.div variants={scaleIn}>
            <a
              href={chatLink}
              onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className={`${quicksand.className} group relative inline-flex items-center gap-3 rounded-full px-12 py-5 text-lg font-bold shadow-2xl transition-all hover:-translate-y-1 hover:shadow-3xl active:translate-y-0`}
              style={{ backgroundColor: '#A3E635', color: '#1A2E05' }}
            >
              {/* Pulsing ring */}
              <span
                className="absolute inset-0 animate-ping rounded-full"
                style={{
                  backgroundColor: 'rgba(163,230,53,0.3)',
                  animationDuration: '2s',
                }}
              />
              <span className="relative flex items-center gap-3">
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                Ücretsiz Teklif Al
              </span>
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  6. GUARANTEE                                                 */}
      {/* ============================================================ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={staggerContainer}
        className="px-5 py-20 sm:px-8 md:py-28"
      >
        <div className="mx-auto max-w-4xl text-center">
          <motion.div variants={fadeUp} className="mb-5">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full text-3xl"
              style={{ backgroundColor: '#F7FEE7' }}
            >
              🛡️
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className={`${quicksand.className} mb-4 text-2xl font-bold sm:text-3xl md:text-4xl`}
            style={{ color: '#1A2E05' }}
          >
            Risk Yok, Taahhüt Yok
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className={`${mulish.className} mx-auto mb-14 max-w-xl text-base leading-relaxed`}
            style={{ color: '#1A2E05', opacity: 0.6 }}
          >
            Tamamen ücretsiz keşif görüşmesi. Beğenmezseniz hiçbir ücret
            ödemezsiniz.
          </motion.p>

          <motion.div
            variants={staggerContainer}
            className="flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-8"
          >
            {[
              { icon: '🆓', label: 'Ücretsiz Keşif' },
              { icon: '🤝', label: 'Taahhütsüz' },
              { icon: '💻', label: 'Online Danışmanlık Desteği' },
            ].map((item) => (
              <motion.div
                key={item.label}
                variants={scaleIn}
                className="flex flex-col items-center gap-3 rounded-2xl border px-8 py-7 shadow-sm transition-shadow hover:shadow-md"
                style={{
                  backgroundColor: '#F7FEE7',
                  borderColor: 'rgba(132,204,22,0.15)',
                }}
              >
                <span className="text-3xl">{item.icon}</span>
                <span
                  className={`${quicksand.className} text-sm font-bold`}
                  style={{ color: '#1A2E05' }}
                >
                  {item.label}
                </span>
              </motion.div>
            ))}
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
        className="py-12"
        style={{ backgroundColor: '#1A2E05' }}
      >
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <p
            className={`${mulish.className} mb-3 text-sm leading-relaxed`}
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            Bu sayfa{' '}
            <span className="font-medium text-white">{props.firmName}</span>{' '}
            için{' '}
            <a
              href="https://vframer.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-white/20 underline-offset-2 transition-colors hover:text-white"
              style={{ color: '#A3E635' }}
            >
              Vorte Studio
            </a>{' '}
            tarafından hazırlanmıştır.
          </p>
          <p
            className={`${mulish.className} text-xs`}
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            &copy; {new Date().getFullYear()} Vorte Studio. Tüm hakları
            saklıdır.
          </p>
        </div>
      </motion.section>
    </div>
  )
}
