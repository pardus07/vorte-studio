'use client'

import { Playfair_Display, Source_Sans_3 } from 'next/font/google'
import { motion, type Variants } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-playfair',
  display: 'swap',
})

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-source-sans',
  display: 'swap',
})

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
}

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
}

const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.12 } },
}

export default function OptikGozlukcuTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const rating = props.googleRating ?? 4.8
  const reviews = props.googleReviews ?? 0

  return (
    <div className={`${playfair.variable} ${sourceSans.variable} min-h-screen bg-white text-[#1E293B]`}>
      {/* ═══════════════════════════════════════════════════
          SECTION 1 — HERO
      ═══════════════════════════════════════════════════ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="relative overflow-hidden bg-[#1E40AF] px-4 py-20 text-white sm:px-6 md:py-32 lg:px-8"
      >
        {/* Decorative gold lines */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/4 h-full w-px bg-[#D4AF37]/10" />
          <div className="absolute top-0 left-2/4 h-full w-px bg-[#D4AF37]/10" />
          <div className="absolute top-0 left-3/4 h-full w-px bg-[#D4AF37]/10" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Gold top badge */}
          <motion.div variants={fadeUp} className="mb-6 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-5 py-2 text-sm font-semibold tracking-wide text-[#D4AF37]"
              style={{ fontFamily: 'var(--font-source-sans)' }}>
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 1l2.39 4.84L17.3 6.7l-3.54 3.46.84 4.88L10 12.77l-4.6 2.27.84-4.88L2.7 6.7l4.91-.86L10 1z" />
              </svg>
              {rating} Puan ({reviews}+ Değerlendirme)
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Gözleriniz en iyi
            <br />
            gözlüğü hak ediyor
          </motion.h1>

          {/* Gold accent line */}
          <motion.div variants={fadeUp} className="mx-auto mt-6 h-1 w-24 rounded-full bg-[#D4AF37]" />

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-2xl text-lg text-white/80 sm:text-xl"
            style={{ fontFamily: 'var(--font-source-sans)' }}
          >
            {props.firmName} &mdash; {props.city}&apos;da kaliteli görmenin adresi
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <a
              href={chatLink}
              onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#D4AF37] px-8 py-4 text-base font-semibold text-[#1E40AF] shadow-lg shadow-[#D4AF37]/20 transition-all hover:bg-[#c9a432] hover:shadow-xl sm:w-auto"
              style={{ fontFamily: 'var(--font-source-sans)' }}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Ücretsiz Teklif Al
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════
          SECTION 2 — ALARM
      ═══════════════════════════════════════════════════ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={stagger}
        className="px-4 py-16 sm:px-6 md:py-24 lg:px-8"
      >
        <motion.div
          variants={fadeUp}
          className="mx-auto max-w-3xl rounded-2xl border-2 border-[#D4AF37]/30 bg-white p-8 shadow-xl shadow-[#D4AF37]/5 sm:p-12"
        >
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37]/10">
              <svg className="h-8 w-8 text-[#D4AF37]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
          </div>

          <h2
            className="text-center text-2xl font-bold leading-snug text-[#1E293B] sm:text-3xl"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Gözlük arayan müşteriler önce Google&apos;a bakıyor.
            <span className="text-[#1E40AF]"> Sizi bulamazlarsa rakibinizi buluyorlar.</span>
          </h2>

          <motion.div variants={fadeUp} className="mx-auto mt-4 h-0.5 w-16 bg-[#D4AF37]" />

          <motion.div
            variants={fadeUp}
            className="mt-8 flex items-center justify-center gap-3 rounded-xl bg-[#1E40AF]/5 p-6"
          >
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[#D4AF37] text-white">
              <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>%72</span>
            </div>
            <p className="text-lg font-semibold text-[#1E293B]" style={{ fontFamily: 'var(--font-source-sans)' }}>
              Müşterilerin %72&apos;si gözlük almadan önce online araştırma yapıyor
            </p>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════
          SECTION 3 — COMPARISON
      ═══════════════════════════════════════════════════ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
        className="bg-[#F8FAFC] px-4 py-16 sm:px-6 md:py-24 lg:px-8"
      >
        <div className="mx-auto max-w-5xl">
          <motion.h2
            variants={fadeUp}
            className="mb-4 text-center text-3xl font-bold sm:text-4xl"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Farkı Görün
          </motion.h2>
          <motion.div variants={fadeUp} className="mx-auto mb-12 h-1 w-16 rounded-full bg-[#D4AF37]" />

          <div className="grid gap-6 md:grid-cols-2">
            {/* Without website */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#1E293B]" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Web Siteniz Yoksa
                </h3>
              </div>
              <ul className="space-y-4" style={{ fontFamily: 'var(--font-source-sans)' }}>
                {[
                  'Marka koleksiyonunuzu gösteremiyorsunuz',
                  'Müşteriler fiyat karşılaştırması yapamıyor',
                  'Randevu sisteminiz yok',
                  'Online görünürlüğünüz sıfır',
                  'Rakipler öne geçiyor',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-xs text-red-500">
                      &times;
                    </span>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* With website */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border-2 border-[#D4AF37]/30 bg-white p-8 shadow-lg shadow-[#D4AF37]/5"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D4AF37]/10">
                  <svg className="h-5 w-5 text-[#D4AF37]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#1E293B]" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Web Siteniz Olursa
                </h3>
              </div>
              <ul className="space-y-4" style={{ fontFamily: 'var(--font-source-sans)' }}>
                {[
                  'Tüm çerçeve koleksiyonunuzu sergiliyorsunuz',
                  'Kampanyalarınızı duyurabiliyorsunuz',
                  'Online göz muayenesi randevusu',
                  'Google\'da üst sıralarda çıkıyorsunuz',
                  'Premium marka imajı oluşturuyorsunuz',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/10 text-xs font-bold text-[#D4AF37]">
                      &#10003;
                    </span>
                    <span className="font-medium text-[#1E293B]">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════
          SECTION 5 — CHAT CTA
      ═══════════════════════════════════════════════════ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeIn}
        className="bg-gradient-to-br from-[#D4AF37] to-[#b8962e] px-4 py-16 sm:px-6 md:py-24 lg:px-8"
      >
        <div className="mx-auto max-w-3xl text-center">
          <motion.div variants={fadeUp}>
            <h2
              className="text-3xl font-bold text-white sm:text-4xl md:text-5xl"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Ücretsiz Teklif Alın
            </h2>
            <p
              className="mt-2 text-xl font-semibold text-white/90"
              style={{ fontFamily: 'var(--font-source-sans)' }}
            >
              Markanızı Yükseltin
            </p>

            <div className="mx-auto mt-4 h-0.5 w-16 bg-white/30" />

            <p
              className="mx-auto mt-6 max-w-lg text-white/80"
              style={{ fontFamily: 'var(--font-source-sans)' }}
            >
              {props.firmName} için premium bir web sitesi tasarlayalım.
              Sadece 2 dakikada ücretsiz teklifinizi alın.
            </p>

            <a
              href={chatLink}
              onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="mt-8 inline-flex items-center gap-3 rounded-xl bg-white px-10 py-4 text-lg font-semibold text-[#1E40AF] shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl"
              style={{ fontFamily: 'var(--font-source-sans)' }}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Hemen Teklif Al
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════
          SECTION 6 — GUARANTEE
      ═══════════════════════════════════════════════════ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
        className="px-4 py-16 sm:px-6 md:py-24 lg:px-8"
      >
        <div className="mx-auto max-w-5xl">
          <motion.h2
            variants={fadeUp}
            className="mb-4 text-center text-3xl font-bold sm:text-4xl"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Neden Vorte Studio?
          </motion.h2>
          <motion.div variants={fadeUp} className="mx-auto mb-12 h-1 w-16 rounded-full bg-[#D4AF37]" />

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                title: 'Ücretsiz Keşif',
                desc: 'İhtiyaçlarınızı analiz ediyor, size özel çözüm öneriyoruz. Hiçbir ücret ödemezsiniz.',
                icon: (
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                ),
              },
              {
                title: 'Taahhütsüz',
                desc: 'Sözleşme yok, bağlayıcılık yok. Memnun kalmazsanız istediğiniz zaman ayrılabilirsiniz.',
                icon: (
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ),
              },
              {
                title: 'Premium Tasarım',
                desc: 'Her gözlükçüye özel, lüks marka imajına uygun profesyonel web sitesi tasarımı.',
                icon: (
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                  </svg>
                ),
              },
            ].map((card) => (
              <motion.div
                key={card.title}
                variants={fadeUp}
                className="group rounded-2xl border-2 border-[#D4AF37]/20 bg-white p-8 text-center transition-all hover:border-[#D4AF37]/50 hover:shadow-lg hover:shadow-[#D4AF37]/5"
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF37]/10 text-[#D4AF37] transition-colors group-hover:bg-[#D4AF37] group-hover:text-white">
                  {card.icon}
                </div>
                <h3
                  className="mb-3 text-xl font-bold text-[#1E293B]"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500" style={{ fontFamily: 'var(--font-source-sans)' }}>
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════
          SECTION 7 — FOOTER
      ═══════════════════════════════════════════════════ */}
      <footer className="bg-[#1E40AF] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-4 h-0.5 w-12 bg-[#D4AF37]/40" />
          <p
            className="text-sm text-white/60"
            style={{ fontFamily: 'var(--font-source-sans)' }}
          >
            Bu sayfa {props.firmName} için{' '}
            <a
              href="https://vfrte.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#D4AF37] transition-colors hover:text-[#D4AF37]/80"
            >
              Vorte Studio
            </a>{' '}
            tarafından hazırlanmıştır.
          </p>
        </div>
      </footer>
    </div>
  )
}
