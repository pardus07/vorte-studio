'use client'

import React from 'react'
import { DM_Sans, Lato } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lato',
  display: 'swap',
})

/* ------------------------------------------------------------------ */
/*  Yardımcı: Animasyonlu sayaç                                       */
/* ------------------------------------------------------------------ */
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <CountUp target={target} suffix={suffix} />
    </motion.span>
  )
}

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const inView = React.useRef(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !inView.current) {
          inView.current = true
          let current = 0
          const step = Math.ceil(target / 40)
          const interval = setInterval(() => {
            current += step
            if (current >= target) {
              current = target
              clearInterval(interval)
            }
            el.textContent = current + suffix
          }, 30)
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, suffix])

  return <span ref={ref}>0{suffix}</span>
}

/* ------------------------------------------------------------------ */
/*  SVG Dalga Ayracı                                                   */
/* ------------------------------------------------------------------ */
function WaveDivider() {
  return (
    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="relative block h-16 w-full md:h-24"
      >
        <path
          d="M0,40 C150,100 350,0 600,60 C850,120 1050,20 1200,80 L1200,120 L0,120 Z"
          fill="#F8FFFE"
        />
      </svg>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Yıldız ikonu (Google rating)                                       */
/* ------------------------------------------------------------------ */
function StarIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Check / X ikonları                                                 */
/* ------------------------------------------------------------------ */
function CheckIcon() {
  return (
    <svg className="h-5 w-5 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg className="h-5 w-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Animasyon varyantları                                              */
/* ------------------------------------------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
}

/* ================================================================== */
/*  ANA TEMPLATE                                                       */
/* ================================================================== */
export default function FizikTedaviTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const rating = props.googleRating ?? 4.8
  const reviews = props.googleReviews ?? 0
  const fullStars = Math.floor(rating)

  return (
    <div className={`${dmSans.variable} ${lato.variable} min-h-screen bg-[#F8FFFE] text-[#134E4A]`}>
      {/* ============================================================ */}
      {/*  1. HERO                                                      */}
      {/* ============================================================ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="relative overflow-hidden bg-gradient-to-br from-[#0F766E] to-[#14B8A6] pb-24 pt-12 md:pb-32 md:pt-20"
      >
        {/* Dekoratif daire */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -left-20 bottom-10 h-64 w-64 rounded-full bg-white/5" />

        <div className="relative z-10 mx-auto max-w-5xl px-5 text-center text-white">
          {/* Google Puan Rozeti */}
          {reviews > 0 && (
            <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <div className="flex text-yellow-300">
                {Array.from({ length: fullStars }).map((_, i) => (
                  <StarIcon key={i} className="h-4 w-4" />
                ))}
              </div>
              <span className="font-[family-name:var(--font-lato)]">
                {rating} / 5 — {reviews} Google Değerlendirmesi
              </span>
            </motion.div>
          )}

          <motion.h1
            variants={fadeUp}
            className="mx-auto max-w-3xl text-3xl font-bold leading-tight font-[family-name:var(--font-dm-sans)] md:text-5xl md:leading-tight"
          >
            Ağrılarınızdan kurtulmanın yolu{' '}
            <span className="underline decoration-white/40 decoration-4 underline-offset-4">
              {props.firmName}
            </span>
            &apos;dan geçiyor
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-5 max-w-xl text-lg text-white/85 font-[family-name:var(--font-lato)] md:text-xl"
          >
            {props.city}&apos;da uzman fizyoterapi hizmeti — ağrısız bir yaşam için doğru adres.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={chatLink}
              onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/70 px-7 py-3.5 text-base font-bold text-white transition hover:bg-white/10 font-[family-name:var(--font-dm-sans)]"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Ücretsiz Teklif Al
            </a>
          </motion.div>
        </div>

        {/* SVG dalga ayracı */}
        <WaveDivider />
      </motion.section>

      {/* ============================================================ */}
      {/*  2. ALARM                                                     */}
      {/* ============================================================ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
        className="mx-auto max-w-4xl px-5 py-16 md:py-24"
      >
        <motion.div
          variants={fadeUp}
          className="rounded-2xl border border-red-100 bg-white p-6 shadow-lg md:p-10"
          style={{ borderLeft: '5px solid #DC2626' }}
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 text-2xl">
              ⚠️
            </div>
            <div>
              <h2 className="text-xl font-bold font-[family-name:var(--font-dm-sans)] text-[#134E4A] md:text-2xl">
                Hastalarınız sizi arıyor — ama bulamıyor
              </h2>
              <p className="mt-3 text-base leading-relaxed text-[#134E4A]/80 font-[family-name:var(--font-lato)] md:text-lg">
                Sırt ve bel ağrısı çeken hastalar online randevu arıyor. Web siteniz yoksa onları kaybediyorsunuz.
                Tedavi arayışındaki insanlar Google&apos;da ilk çıkan merkezlere gidiyor.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-xl bg-[#F0FDFA] p-6 text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-[#0F766E]/70 font-[family-name:var(--font-lato)]">
              Türkiye geneli istatistik
            </p>
            <p className="mt-2 text-4xl font-bold text-[#0F766E] font-[family-name:var(--font-dm-sans)] md:text-5xl">
              <AnimatedCounter target={33} suffix="%" />
            </p>
            <p className="mt-2 text-base text-[#134E4A]/70 font-[family-name:var(--font-lato)]">
              Türkiye&apos;de her 3 kişiden 1&apos;i kronik ağrı şikayeti yaşıyor
            </p>
          </div>
        </motion.div>
      </motion.section>

      {/* ============================================================ */}
      {/*  3. KARŞILAŞTIRMA                                             */}
      {/* ============================================================ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
        className="bg-[#F0FDFA] px-5 py-16 md:py-24"
      >
        <div className="mx-auto max-w-5xl">
          <motion.h2
            variants={fadeUp}
            className="mb-12 text-center text-2xl font-bold font-[family-name:var(--font-dm-sans)] md:text-4xl"
          >
            Dijitalde var olmak neden kritik?
          </motion.h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* SOL — Olumsuz */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border border-red-100 bg-white p-6 shadow-md md:p-8"
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-1.5 text-sm font-bold text-red-600 font-[family-name:var(--font-dm-sans)]">
                <XIcon />
                Web Siteniz Yoksa
              </div>
              <ul className="space-y-4 font-[family-name:var(--font-lato)]">
                {[
                  'Hastalar sizi bulamıyor',
                  'Uzmanlık alanlarınız bilinmiyor',
                  'Randevu telefona bağlı',
                  'Güvenilirliğiniz sorgulanıyor',
                  'Büyüme potansiyeliniz sınırlı',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[#134E4A]/80">
                    <XIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* SAĞ — Olumlu */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-md md:p-8"
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-bold text-[#0F766E] font-[family-name:var(--font-dm-sans)]">
                <CheckIcon />
                Web Siteniz Olursa
              </div>
              <ul className="space-y-4 font-[family-name:var(--font-lato)]">
                {[
                  'Google\'da kolayca bulunuyorsunuz',
                  'Tüm tedavi yöntemlerinizi gösteriyorsunuz',
                  'Online randevu sistemi',
                  'Profesyonel ve uzman görünümü',
                  'Hasta portföyünüz sürekli artıyor',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[#134E4A]/80">
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
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
        variants={stagger}
        className="bg-[#F0FDFA] px-5 py-16 md:py-24"
      >
        <div className="mx-auto max-w-3xl text-center">
          <motion.div variants={fadeUp} className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0F766E]/10 text-2xl">
            💬
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="text-2xl font-bold font-[family-name:var(--font-dm-sans)] md:text-4xl"
          >
            Ücretsiz Teklif Alın
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-4 max-w-xl text-lg text-[#134E4A]/70 font-[family-name:var(--font-lato)]"
          >
            Sağlık yatırımınızın geri dönüşünü görün. {props.firmName} için özel
            fiyatlandırma ve süre bilgisi alın — tamamen ücretsiz, taahhütsüz.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8">
            <a
              href={chatLink}
              onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0F766E] px-10 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-[#0d6d66] hover:shadow-xl font-[family-name:var(--font-dm-sans)]"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Hemen Teklif Al
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  6. GARANTİ                                                   */}
      {/* ============================================================ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
        className="mx-auto max-w-5xl px-5 py-16 md:py-24"
      >
        <motion.h2
          variants={fadeUp}
          className="mb-12 text-center text-2xl font-bold font-[family-name:var(--font-dm-sans)] md:text-3xl"
        >
          Neden bizi tercih etmelisiniz?
        </motion.h2>

        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: '🔍',
              title: 'Ücretsiz Keşif',
              desc: 'İhtiyaçlarınızı analiz ediyoruz. Hiçbir ücret ödemeden merkezinize özel çözümü görün.',
            },
            {
              icon: '🤝',
              title: 'Taahhütsüz',
              desc: 'Beğenmezseniz hiçbir yükümlülük yok. Karar tamamen sizin.',
            },
            {
              icon: '⚡',
              title: 'Hızlı Teslimat',
              desc: 'Web siteniz en kısa sürede hazır. Hastalarınızı beklettirmeyin.',
            },
          ].map((card) => (
            <motion.div
              key={card.title}
              variants={fadeUp}
              className="rounded-2xl border border-[#0F766E]/10 bg-white p-6 text-center shadow-md transition hover:shadow-lg md:p-8"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0FDFA] text-2xl">
                {card.icon}
              </div>
              <h3 className="text-lg font-bold font-[family-name:var(--font-dm-sans)] text-[#134E4A]">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#134E4A]/70 font-[family-name:var(--font-lato)]">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  7. FOOTER                                                    */}
      {/* ============================================================ */}
      <footer className="bg-[#134E4A] px-5 py-10 text-center text-white/60">
        <p className="text-sm font-[family-name:var(--font-lato)]">
          Bu sayfa {props.firmName} için özel olarak hazırlanmıştır.
        </p>
        <p className="mt-2 text-xs">
          © {new Date().getFullYear()}{' '}
          <a
            href="https://vfrtstudio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 underline transition hover:text-white"
          >
            Vorte Studio
          </a>{' '}
          — Tüm hakları saklıdır.
        </p>
      </footer>
    </div>
  )
}
