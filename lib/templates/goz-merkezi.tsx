'use client'

import { Raleway, Lato } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-raleway',
  display: 'swap',
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lato',
  display: 'swap',
})

/* ── Animation variants ────────────────────────────── */

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
}

/* ── Hexagonal clip-path ───────────────────────────── */
const HEX_CLIP = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'

/* ── Gold star SVG ─────────────────────────────────── */
function GoldStar() {
  return (
    <svg className="h-4 w-4 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 1l2.39 4.84L17.3 6.7l-3.54 3.46.84 4.88L10 12.77l-4.6 2.27.84-4.88L2.7 6.7l4.91-.86L10 1z" />
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════
   TEMPLATE CONFIG — IMAGE SLOTS
   ═══════════════════════════════════════════════════════ */
export const TEMPLATE_IMAGE_CONFIG = [
  {
    slot: 'hero',
    label: 'Göz Merkezi Hero Görseli',
    aspectRatio: '1:1',
    imageSize: '1024x1024',
    style: 'photorealistic' as const,
    promptHint: 'Profesyonel göz muayene odası, modern lazer ekipmanları, mavi tonlar, temiz ve steril ortam',
    position: 'Hero bölümü — altıgen çerçeve',
  },
  {
    slot: 'technology',
    label: 'Teknoloji Görseli',
    aspectRatio: '4:3',
    imageSize: '1024x768',
    style: 'photorealistic' as const,
    promptHint: 'Son teknoloji göz lazer cihazı, ameliyathane, modern tıbbi ekipman, mavi LED ışıklar',
    position: 'Garanti bölümü — teknoloji kartı',
  },
]

/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function GozMerkeziTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const rating = props.googleRating ?? 4.8
  const reviews = props.googleReviews ?? 0

  return (
    <div className={`${raleway.variable} ${lato.variable} min-h-screen bg-white text-[#1E293B]`}>
      {/* ═══════════════════════════════════════════════════
          SECTION 1 — HERO
      ═══════════════════════════════════════════════════ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="relative overflow-hidden bg-white px-4 py-20 sm:px-6 md:py-28 lg:px-8"
      >
        {/* Decorative deep-blue gradient blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#0C4A6E]/5 blur-3xl" />
          <div className="absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-[#D4AF37]/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#0C4A6E]/10 to-transparent" />
        </div>

        <div
          className={`relative mx-auto ${
            props.images?.hero
              ? 'max-w-6xl grid grid-cols-1 lg:grid-cols-2 items-center gap-16'
              : 'max-w-3xl text-center'
          }`}
        >
          {/* Left — text content */}
          <div>
            {/* Google rating badge */}
            <motion.div
              variants={fadeInUp}
              className={`mb-6 flex ${props.images?.hero ? 'justify-start' : 'justify-center'}`}
            >
              <span
                className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/5 px-5 py-2 text-sm font-semibold tracking-wide text-[#0C4A6E]"
                style={{ fontFamily: 'var(--font-lato)' }}
              >
                <GoldStar />
                {rating} Puan ({reviews}+ Değerlendirme)
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className={`text-4xl font-extrabold leading-tight tracking-tight text-[#0C4A6E] sm:text-5xl ${
                props.images?.hero ? 'md:text-5xl' : 'md:text-6xl lg:text-7xl'
              }`}
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              Görüşünüz değerli &mdash;{' '}
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#c9a432] bg-clip-text text-transparent">
                onu en iyi ellere bırakın
              </span>
            </motion.h1>

            {/* Gold accent line */}
            <motion.div
              variants={fadeInUp}
              className={`mt-6 h-1 w-24 rounded-full bg-[#D4AF37] ${props.images?.hero ? '' : 'mx-auto'}`}
            />

            <motion.p
              variants={fadeInUp}
              className={`mt-6 max-w-xl text-lg text-gray-600 sm:text-xl ${props.images?.hero ? '' : 'mx-auto'}`}
              style={{ fontFamily: 'var(--font-lato)' }}
            >
              {props.firmName} &mdash; {props.city}&apos;da göz sağlığında güvenilir adres.
              Uzman kadro ve son teknoloji ekipmanlarla hizmetinizdeyiz.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className={`mt-10 flex flex-col gap-4 sm:flex-row ${
                props.images?.hero ? 'items-start sm:justify-start' : 'items-center sm:justify-center'
              }`}
            >
              <a
                href={chatLink}
                onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#D4AF37]/25 transition-all hover:bg-[#c9a432] hover:shadow-xl sm:w-auto"
                style={{ fontFamily: 'var(--font-lato)' }}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Ücretsiz Göz Muayenesi
              </a>
            </motion.div>
          </div>

          {/* Right — hexagonal hero image OR emoji fallback */}
          {props.images?.hero ? (
            <motion.div variants={scaleIn} className="hidden lg:flex items-center justify-center">
              <div className="relative">
                <div
                  className="h-80 w-80 overflow-hidden shadow-2xl shadow-[#D4AF37]/20"
                  style={{ clipPath: HEX_CLIP }}
                >
                  <img
                    src={props.images.hero}
                    alt={props.firmName}
                    className="h-full w-full object-cover"
                  />
                </div>
                {/* Gold outline offset behind */}
                <div
                  className="absolute -z-10 inset-0 translate-x-2 translate-y-2 border-2 border-[#D4AF37]/30"
                  style={{ clipPath: HEX_CLIP }}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              variants={scaleIn}
              className="mx-auto mt-14 flex h-36 w-36 items-center justify-center lg:mt-0"
              style={{ clipPath: HEX_CLIP }}
            >
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0C4A6E]/10 to-[#D4AF37]/15">
                <span className="text-6xl" role="img" aria-label="Göz">
                  👁️
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════
          SECTION 2 — ALARM
      ═══════════════════════════════════════════════════ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="bg-[#0C4A6E] px-4 py-16 text-white sm:px-6 md:py-24 lg:px-8"
      >
        <div className="mx-auto max-w-3xl">
          {/* Top gold divider */}
          <motion.div variants={fadeInUp} className="mx-auto mb-10 h-px w-32 bg-[#D4AF37]/40" />

          <motion.div variants={fadeInUp} className="text-center">
            <div className="mb-8 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37]/15">
                <svg
                  className="h-8 w-8 text-[#D4AF37]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </div>
            </div>

            <h2
              className="text-2xl font-bold leading-snug sm:text-3xl"
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              Lazer tedavisi merak edenlerin{' '}
              <span className="text-[#D4AF37]">%85&apos;i online araştırma</span> yapıyor.
              <br className="hidden sm:block" />
              Bulamazlarsa güvenilir bulmuyorlar.
            </h2>
          </motion.div>

          <motion.div variants={fadeInUp} className="mx-auto mt-6 h-0.5 w-16 bg-[#D4AF37]" />

          <motion.div
            variants={fadeInUp}
            className="mt-10 flex items-center justify-center gap-4 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
          >
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-[#D4AF37] text-[#0C4A6E]">
              <span className="text-xl font-extrabold" style={{ fontFamily: 'var(--font-raleway)' }}>
                %85
              </span>
            </div>
            <p className="text-lg font-semibold text-white/90" style={{ fontFamily: 'var(--font-lato)' }}>
              Hastaların büyük çoğunluğu göz tedavisi öncesi internette araştırma yapıyor
            </p>
          </motion.div>

          {/* Bottom gold divider */}
          <motion.div variants={fadeInUp} className="mx-auto mt-10 h-px w-32 bg-[#D4AF37]/40" />
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════
          SECTION 3 — COMPARISON
      ═══════════════════════════════════════════════════ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="bg-white px-4 py-16 sm:px-6 md:py-24 lg:px-8"
      >
        <div className="mx-auto max-w-5xl">
          <motion.h2
            variants={fadeInUp}
            className="mb-4 text-center text-3xl font-bold text-[#0C4A6E] sm:text-4xl"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Farkı Görün
          </motion.h2>
          <motion.div variants={fadeInUp} className="mx-auto mb-12 h-1 w-16 rounded-full bg-[#D4AF37]" />

          <div className="grid gap-8 md:grid-cols-2">
            {/* Without website */}
            <motion.div
              variants={fadeInUp}
              className="rounded-2xl border border-gray-200 bg-gray-50 p-8"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#1E293B]" style={{ fontFamily: 'var(--font-raleway)' }}>
                  Web Siteniz Yoksa
                </h3>
              </div>
              <ul className="space-y-4" style={{ fontFamily: 'var(--font-lato)' }}>
                {[
                  'Lazer teknolojiniz bilinmiyor',
                  'Hastalar rakibinize gidiyor',
                  'Doktor deneyiminiz görünmüyor',
                  'Güven oluşturamıyorsunuz',
                  'Büyüyemiyorsunuz',
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
              variants={fadeInUp}
              className="rounded-2xl border-2 border-[#D4AF37]/30 bg-white p-8 shadow-lg shadow-[#D4AF37]/5"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D4AF37]/10">
                  <svg className="h-5 w-5 text-[#D4AF37]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#1E293B]" style={{ fontFamily: 'var(--font-raleway)' }}>
                  Web Siteniz Olursa
                </h3>
              </div>
              <ul className="space-y-4" style={{ fontFamily: 'var(--font-lato)' }}>
                {[
                  'Modern ekipmanlarınızı sergiliyorsunuz',
                  'Google\'da ilk sırada çıkıyorsunuz',
                  'Uzman kadronuzu tanıtıyorsunuz',
                  'Profesyonel marka imajı oluşturuyorsunuz',
                  'Hasta portföyünüz artıyor',
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
          SECTION 4 — CHAT CTA
      ═══════════════════════════════════════════════════ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="bg-gradient-to-br from-[#0C4A6E] to-[#083344] px-4 py-16 text-white sm:px-6 md:py-24 lg:px-8"
      >
        <div className="mx-auto max-w-3xl text-center">
          <motion.div variants={fadeInUp}>
            <h2
              className="text-3xl font-bold sm:text-4xl md:text-5xl"
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              Ücretsiz Teklif Alın
            </h2>
            <p
              className="mt-3 text-xl font-semibold text-[#D4AF37]"
              style={{ fontFamily: 'var(--font-lato)' }}
            >
              Kliniğinizi Dijitale Taşıyın
            </p>

            <div className="mx-auto mt-5 h-0.5 w-16 bg-[#D4AF37]/40" />

            <p
              className="mx-auto mt-6 max-w-lg text-white/70"
              style={{ fontFamily: 'var(--font-lato)' }}
            >
              {props.firmName} için teknoloji odaklı, güven veren bir web sitesi tasarlayalım.
              Sadece 2 dakikada ücretsiz teklifinizi alın.
            </p>

            {/* CTA with pulse animation */}
            <motion.a
              href={chatLink}
              onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="mt-10 inline-flex items-center gap-3 rounded-xl bg-[#D4AF37] px-10 py-4 text-lg font-bold text-[#0C4A6E] shadow-lg shadow-[#D4AF37]/25 transition-all hover:bg-[#c9a432] hover:shadow-xl"
              style={{ fontFamily: 'var(--font-lato)' }}
              animate={{
                boxShadow: [
                  '0 10px 25px -5px rgba(212, 175, 55, 0.25)',
                  '0 10px 40px -5px rgba(212, 175, 55, 0.45)',
                  '0 10px 25px -5px rgba(212, 175, 55, 0.25)',
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Hemen Teklif Al
            </motion.a>
          </motion.div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════
          SECTION 5 — GUARANTEE
      ═══════════════════════════════════════════════════ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="px-4 py-16 sm:px-6 md:py-24 lg:px-8"
      >
        <div className="mx-auto max-w-5xl">
          <motion.h2
            variants={fadeInUp}
            className="mb-4 text-center text-3xl font-bold text-[#0C4A6E] sm:text-4xl"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Neden Vorte Studio?
          </motion.h2>
          <motion.div variants={fadeInUp} className="mx-auto mb-12 h-1 w-16 rounded-full bg-[#D4AF37]" />

          {/* Technology image card — conditional slot 2 */}
          {props.images?.technology && (
            <motion.div variants={fadeInUp} className="mb-12 overflow-hidden rounded-2xl shadow-lg">
              <div className="relative h-56 md:h-64">
                <img
                  src={props.images.technology}
                  alt="Göz teknolojisi"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C4A6E]/60 to-transparent" />
                <p
                  className="absolute bottom-6 left-6 text-xl font-bold text-white"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                >
                  Son Teknoloji Ekipmanlar
                </p>
              </div>
            </motion.div>
          )}

          {/* 3 Guarantee badges */}
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                title: 'Ücretsiz Muayene',
                desc: 'Dijital ihtiyaçlarınızı analiz ediyor, kliniğinize özel çözüm sunuyoruz. Hiçbir ücret yok.',
                icon: (
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
              },
              {
                title: 'Uzman Doktorlar',
                desc: 'Doktor profillerinizi ve uzmanlık alanlarınızı en etkili şekilde ön plana çıkarıyoruz.',
                icon: (
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                    />
                  </svg>
                ),
              },
              {
                title: 'Son Teknoloji',
                desc: 'Lazer ve cerrahi ekipmanlarınızı en etkileyici biçimde dijital vitrine taşıyoruz.',
                icon: (
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                    />
                  </svg>
                ),
              },
            ].map((card) => (
              <motion.div
                key={card.title}
                variants={scaleIn}
                className="group rounded-2xl border-2 border-[#0C4A6E]/10 bg-white p-8 text-center transition-all hover:border-[#D4AF37]/50 hover:shadow-lg hover:shadow-[#D4AF37]/5"
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#0C4A6E]/10 text-[#0C4A6E] transition-colors group-hover:bg-[#D4AF37] group-hover:text-white">
                  {card.icon}
                </div>
                <h3
                  className="mb-3 text-xl font-bold text-[#1E293B]"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                >
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500" style={{ fontFamily: 'var(--font-lato)' }}>
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════
          SECTION 6 — FOOTER
      ═══════════════════════════════════════════════════ */}
      <footer className="bg-[#083344] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-4 h-0.5 w-12 bg-[#D4AF37]/40" />
          <p className="text-sm text-white/60" style={{ fontFamily: 'var(--font-lato)' }}>
            Bu sayfa {props.firmName} için{' '}
            <a
              href="https://vorte.studio"
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
