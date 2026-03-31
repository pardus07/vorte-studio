'use client'

import { Playfair_Display, Jost } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const playfair = Playfair_Display({
  subsets: ['latin-ext'],
  weight: ['400', '600', '700'],
  variable: '--font-playfair-display',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin-ext'],
  weight: ['400', '500'],
  variable: '--font-jost',
  display: 'swap',
})

/* ---------- Animation variants ---------- */
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' as const } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
}

/* ---------- Gold star SVG ---------- */
function GoldStar({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`h-4 w-4 ${filled ? 'text-[#D4AF37]' : 'text-[#D4AF37]/20'}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}

/* ========================================== */
/*  GuzellikSpaTemplate                       */
/* ========================================== */
export default function GuzellikSpaTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  return (
    <div className={`${playfair.variable} ${jost.variable} min-h-screen bg-[#FDF2F8] text-[#1C1917]`}>

      {/* ===== HERO ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="relative overflow-hidden px-6 py-28 md:px-12 lg:px-24 lg:py-36"
      >
        {/* Decorative background circles */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#BE185D]/[0.03]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-[#D4AF37]/[0.05]" />

        <div className={`relative mx-auto ${props.images?.hero ? 'max-w-5xl grid grid-cols-1 lg:grid-cols-2 items-center gap-12' : 'max-w-3xl text-center'}`}>
          <div>
            {/* Thin gold divider above */}
            <motion.div
              variants={fadeInUp}
              className={`mb-8 h-px w-16 bg-[#D4AF37] ${props.images?.hero ? '' : 'mx-auto'}`}
            />

            <motion.h1
              variants={fadeInUp}
              className="font-[family-name:var(--font-playfair-display)] text-4xl font-700 leading-tight tracking-tight text-[#1C1917] md:text-5xl lg:text-6xl"
            >
              Kendinize zaman ayırın
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className={`mt-6 max-w-xl font-[family-name:var(--font-jost)] text-base leading-relaxed text-[#1C1917]/55 md:text-lg ${props.images?.hero ? '' : 'mx-auto'}`}
            >
              {props.firmName} sizi dinlendiriyor &mdash; {props.city}
              {props.district ? `, ${props.district}` : ''}&apos;da huzurun adresi.
            </motion.p>

            {/* Thin gold divider below */}
            <motion.div
              variants={fadeInUp}
              className={`mt-8 h-px w-24 bg-[#D4AF37] ${props.images?.hero ? '' : 'mx-auto'}`}
            />

            {/* Google Rating */}
            {props.googleRating && props.googleRating > 0 && (
              <motion.div
                variants={fadeInUp}
                className={`mt-8 flex items-center gap-3 ${props.images?.hero ? '' : 'justify-center'}`}
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <GoldStar key={i} filled={i < Math.round(props.googleRating!)} />
                  ))}
                </div>
                <span className="font-[family-name:var(--font-playfair-display)] text-lg font-600 text-[#D4AF37]">
                  {props.googleRating}
                </span>
                {props.googleReviews && (
                  <span className="font-[family-name:var(--font-jost)] text-sm text-[#1C1917]/40">
                    ({props.googleReviews} değerlendirme)
                  </span>
                )}
              </motion.div>
            )}

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className={`mt-12 flex flex-col items-center gap-4 sm:flex-row ${props.images?.hero ? '' : 'sm:justify-center'}`}
            >
              <a
                href={chatLink}
                onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                className="inline-flex items-center justify-center rounded-full bg-[#BE185D] px-10 py-3.5 font-[family-name:var(--font-jost)] text-sm font-500 uppercase tracking-[0.15em] text-white shadow-lg shadow-[#BE185D]/20 transition-all hover:bg-[#9D174D] active:scale-[0.97]"
              >
                Randevu Al
              </a>
              {props.phone && (
                <a
                  href={`tel:${props.phone}`}
                  className="inline-flex items-center justify-center rounded-full border border-[#BE185D]/25 bg-transparent px-10 py-3.5 font-[family-name:var(--font-jost)] text-sm font-500 uppercase tracking-[0.15em] text-[#BE185D] transition-all hover:bg-[#BE185D]/5 active:scale-[0.97]"
                >
                  Hemen Ara
                </a>
              )}
            </motion.div>
          </div>

          {/* Blob-shaped hero image */}
          {props.images?.hero ? (
            <motion.div variants={fadeInUp} className="hidden lg:flex items-center justify-center">
              <div className="relative h-96 w-96">
                <div
                  className="h-full w-full overflow-hidden shadow-2xl shadow-[#BE185D]/15"
                  style={{ borderRadius: '60% 40% 55% 45% / 55% 60% 40% 45%' }}
                >
                  <img
                    src={props.images.hero}
                    alt={props.firmName}
                    className="h-full w-full object-cover"
                  />
                </div>
                {/* Decorative gold blob behind */}
                <div
                  className="absolute -bottom-4 -right-4 -z-10 h-full w-full bg-[#D4AF37]/10"
                  style={{ borderRadius: '55% 45% 60% 40% / 45% 55% 40% 60%' }}
                />
              </div>
            </motion.div>
          ) : null}
        </div>

        {/* When no image: centered emoji blob below hero text */}
        {!props.images?.hero && (
          <motion.div variants={scaleIn} className="mt-12 flex justify-center">
            <div
              className="flex h-40 w-40 items-center justify-center bg-gradient-to-br from-[#FDF2F8] to-[#FCE7F3] shadow-xl shadow-[#BE185D]/10"
              style={{ borderRadius: '60% 40% 55% 45% / 55% 60% 40% 45%' }}
            >
              <span className="text-6xl">🧖‍♀️</span>
            </div>
          </motion.div>
        )}
      </motion.section>

      {/* ===== ALARM ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="relative bg-[#831843] px-6 py-20 md:px-12 lg:px-24 lg:py-28"
      >
        {/* Subtle pattern overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        <div className="relative mx-auto max-w-2xl text-center">
          <motion.div variants={fadeInUp} className="mx-auto mb-8 h-px w-12 bg-[#D4AF37]" />

          <motion.p
            variants={fadeInUp}
            className="font-[family-name:var(--font-playfair-display)] text-2xl font-600 leading-relaxed text-white md:text-3xl"
          >
            SPA randevusu arayanlar önce online inceliyor.{' '}
            Web siteniz yoksa sizi &lsquo;amatör&rsquo; sanıyorlar.
          </motion.p>

          <motion.div variants={fadeInUp} className="mx-auto my-10 h-px w-20 bg-[#D4AF37]/60" />

          <motion.p
            variants={fadeInUp}
            className="font-[family-name:var(--font-jost)] text-base text-white/45 md:text-lg"
          >
            Profesyonel bir web varlığı, güven inşa eder.
          </motion.p>
        </div>
      </motion.section>

      {/* ===== AMBIANCE BANNER (conditional) ===== */}
      {props.images?.ambiance && (
        <section className="relative h-64 overflow-hidden md:h-80">
          <img
            src={props.images.ambiance}
            alt="SPA atmosferi"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#BE185D]/40 to-[#FDF2F8]/30" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3">
            <div className="h-px w-12 bg-[#D4AF37]" />
            <p className="font-[family-name:var(--font-playfair-display)] text-3xl font-700 text-white drop-shadow-lg md:text-4xl">
              Huzurun Adresi
            </p>
            <div className="h-px w-12 bg-[#D4AF37]" />
          </div>
        </section>
      )}

      {/* ===== COMPARISON ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="px-6 py-20 md:px-12 lg:px-24 lg:py-28"
      >
        <motion.div variants={fadeInUp} className="mx-auto mb-14 max-w-lg text-center">
          <div className="mx-auto mb-5 h-px w-10 bg-[#D4AF37]" />
          <h2 className="font-[family-name:var(--font-playfair-display)] text-3xl font-700 text-[#1C1917] md:text-4xl">
            Farkı Görün
          </h2>
        </motion.div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          {/* Without Website */}
          <motion.div
            variants={fadeInUp}
            className="rounded-2xl border border-[#BE185D]/12 bg-white/50 p-8 backdrop-blur-sm md:p-10"
          >
            <div className="mb-7 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1C1917]/5">
                <svg className="h-4 w-4 text-[#1C1917]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-playfair-display)] text-xl font-700 text-[#1C1917]">
                Web Siteniz Yoksa
              </h3>
            </div>
            <ul className="space-y-4">
              {[
                'Hizmetleriniz bilinmiyor',
                'Amatör izlenimi yaratıyorsunuz',
                'Paket fiyatlarınız kapalı kalıyor',
                'Online rezervasyon yapılamıyor',
                'Sosyal medyayla sınırlı kalıyorsunuz',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 font-[family-name:var(--font-jost)] text-sm leading-relaxed text-[#1C1917]/55"
                >
                  <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-[#1C1917]/15" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* With Website */}
          <motion.div
            variants={fadeInUp}
            className="rounded-2xl border border-[#D4AF37]/50 bg-white/50 p-8 shadow-lg shadow-[#D4AF37]/5 backdrop-blur-sm md:p-10"
          >
            <div className="mb-7 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D4AF37]/10">
                <svg className="h-4 w-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-playfair-display)] text-xl font-700 text-[#BE185D]">
                Web Siteniz Olursa
              </h3>
            </div>
            <ul className="space-y-4">
              {[
                'Premium hizmet menüsü sergileniyor',
                'Lüks marka imajı oluşturuyorsunuz',
                'Şeffaf paket fiyatlar sunuyorsunuz',
                '7/24 online randevu imkanı sağlıyorsunuz',
                'Web + sosyal medya gücünü birleştiriyorsunuz',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 font-[family-name:var(--font-jost)] text-sm leading-relaxed text-[#1C1917]/75"
                >
                  <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4AF37]" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.section>

      {/* ===== CHAT CTA ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="relative bg-[#BE185D] px-6 py-20 md:px-12 lg:px-24 lg:py-28"
      >
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute left-10 top-10 h-40 w-40 rounded-full bg-white/[0.04]" />
        <div className="pointer-events-none absolute bottom-8 right-16 h-28 w-28 rounded-full bg-[#D4AF37]/[0.08]" />

        <div className="relative mx-auto max-w-2xl text-center">
          <motion.div variants={fadeInUp} className="mx-auto mb-8 h-px w-12 bg-[#D4AF37]" />

          <motion.h2
            variants={fadeInUp}
            className="font-[family-name:var(--font-playfair-display)] text-3xl font-700 text-white md:text-4xl"
          >
            Ücretsiz Teklif Alın
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-5 max-w-lg font-[family-name:var(--font-jost)] text-base text-white/50"
          >
            SPA&apos;nıza özel tasarım çözümleri &mdash; hızlı, şeffaf ve taahhütsüz.
          </motion.p>

          <motion.a
            variants={fadeInUp}
            href={chatLink}
            onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="mt-10 inline-flex items-center justify-center rounded-full bg-[#D4AF37] px-12 py-4 font-[family-name:var(--font-jost)] text-sm font-500 uppercase tracking-[0.15em] text-[#1C1917] shadow-lg shadow-[#D4AF37]/25 transition-all hover:bg-[#C5A030] active:scale-[0.97]"
          >
            Hemen Teklif Al
          </motion.a>

          <motion.div variants={fadeInUp} className="mx-auto mt-10 h-px w-12 bg-[#D4AF37]/40" />
        </div>
      </motion.section>

      {/* ===== GUARANTEE ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="px-6 py-20 md:px-12 lg:px-24 lg:py-28"
      >
        <motion.div variants={fadeInUp} className="mx-auto mb-14 max-w-lg text-center">
          <div className="mx-auto mb-5 h-px w-10 bg-[#D4AF37]" />
          <h2 className="font-[family-name:var(--font-playfair-display)] text-3xl font-700 text-[#1C1917] md:text-4xl">
            Güvence & Kalite
          </h2>
        </motion.div>

        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-3">
          {[
            {
              icon: (
                <svg className="h-6 w-6 text-[#BE185D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              ),
              title: 'Ücretsiz Keşif',
              desc: 'İlk görüşme ve analiz tamamen ücretsiz, taahhütsüz.',
            },
            {
              icon: (
                <svg className="h-6 w-6 text-[#BE185D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
              ),
              title: 'Hijyen Güvencesi',
              desc: 'Sertifika ve hijyen standartlarınız ön planda.',
            },
            {
              icon: (
                <svg className="h-6 w-6 text-[#BE185D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              ),
              title: 'Premium Bakım',
              desc: 'SPA\'nızın prestijine yakışan lüks web tasarımı.',
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              variants={fadeInUp}
              className="group rounded-2xl border border-[#BE185D]/10 bg-white/50 p-8 text-center backdrop-blur-sm transition-all duration-300 hover:border-[#D4AF37]/40 hover:shadow-lg hover:shadow-[#D4AF37]/5"
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#BE185D]/15 bg-[#FDF2F8] transition-colors group-hover:border-[#D4AF37]/30 group-hover:bg-[#D4AF37]/5">
                {item.icon}
              </div>
              <h3 className="font-[family-name:var(--font-playfair-display)] text-lg font-700 text-[#1C1917]">
                {item.title}
              </h3>
              <p className="mt-3 font-[family-name:var(--font-jost)] text-sm leading-relaxed text-[#1C1917]/50">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ===== FOOTER ===== */}
      <motion.footer
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeInUp}
        className="bg-[#1C1917] px-6 py-14 text-center md:px-12"
      >
        <div className="mx-auto mb-5 h-px w-10 bg-[#D4AF37]/25" />
        <p className="font-[family-name:var(--font-jost)] text-sm text-white/35">
          Bu sayfa{' '}
          <span className="font-500 text-[#BE185D]">{props.firmName}</span>{' '}
          için{' '}
          <span className="font-500 text-[#D4AF37]">Vorte Studio</span>{' '}
          tarafından hazırlanmıştır.
        </p>
        <div className="mx-auto mt-5 h-px w-10 bg-[#D4AF37]/25" />
      </motion.footer>
    </div>
  )
}
