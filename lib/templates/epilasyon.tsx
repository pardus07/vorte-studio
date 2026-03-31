'use client'

import { Raleway, Nunito } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const raleway = Raleway({
  subsets: ['latin-ext'],
  weight: ['400', '600', '700'],
  variable: '--font-raleway',
  display: 'swap',
})

const nunito = Nunito({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-nunito',
  display: 'swap',
})

/* ---------- Animation variants ---------- */
const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.65, ease: 'easeOut' as const } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
}

/* ---------- Image config ---------- */
export const TEMPLATE_IMAGE_CONFIG = [
  {
    slot: 'hero',
    label: 'Hero Görsel (Epilasyon Merkezi)',
    aspectRatio: '1:1',
    imageSize: '1024x1024',
    style: 'photorealistic' as const,
    promptHint: 'Modern epilasyon merkezi iç mekan, temiz ve aydınlık klinik ortam, pastel tonlar, profesyonel hijyen',
    position: 'Hero bölümünde geometrik çerçeve içinde',
  },
  {
    slot: 'technology',
    label: 'Teknoloji Görseli (Lazer/IPL)',
    aspectRatio: '4:3',
    imageSize: '1024x768',
    style: 'photorealistic' as const,
    promptHint: 'Son teknoloji lazer epilasyon cihazı, IPL sistemi, modern klinik ekipman, profesyonel tıbbi ortam',
    position: 'Alarm bölümünde yüzen kart olarak',
  },
]

export default function EpilasyonTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  return (
    <div className={`${raleway.variable} ${nunito.variable} min-h-screen bg-[#FAFAF9] text-[#1C1917]`}>
      {/* ===== HERO ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="relative overflow-hidden px-6 py-28 md:px-12 lg:px-24 lg:py-36"
      >
        {/* Decorative teal circles */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#14B8A6]/[0.04]" />
        <div className="pointer-events-none absolute -left-16 bottom-12 h-40 w-40 rounded-full bg-[#14B8A6]/[0.06]" />
        <div className="pointer-events-none absolute right-1/4 top-1/3 h-24 w-24 rounded-full bg-[#D4AF37]/[0.05]" />

        <div
          className={`relative mx-auto ${
            props.images?.hero
              ? 'max-w-5xl grid grid-cols-1 lg:grid-cols-2 items-center gap-14'
              : 'max-w-3xl text-center'
          }`}
        >
          {/* Text column */}
          <div>
            {/* Teal accent line */}
            <motion.div
              variants={fadeInUp}
              className={`mb-8 flex items-center gap-3 ${props.images?.hero ? '' : 'justify-center'}`}
            >
              <div className="h-px w-10 bg-[#14B8A6]" />
              <span className="font-[family-name:var(--font-nunito)] text-xs font-medium uppercase tracking-[0.2em] text-[#14B8A6]">
                Epilasyon Merkezi
              </span>
              <div className="h-px w-10 bg-[#14B8A6]" />
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="font-[family-name:var(--font-raleway)] text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-[3.4rem]"
            >
              Kalıcı sonuçlar için{' '}
              <span className="text-[#14B8A6]">doğru adres</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className={`mt-6 max-w-xl font-[family-name:var(--font-nunito)] text-base leading-relaxed text-[#1C1917]/55 md:text-lg ${
                props.images?.hero ? '' : 'mx-auto'
              }`}
            >
              {props.firmName} &mdash; {props.city}
              {props.district ? `, ${props.district}` : ''}&apos;da son teknoloji
              lazer epilasyon hizmeti ile pürüzsüz cilde kavuşun.
            </motion.p>

            {/* Google Rating */}
            {props.googleRating && props.googleRating > 0 && (
              <motion.div
                variants={fadeInUp}
                className={`mt-8 flex items-center gap-3 ${props.images?.hero ? '' : 'justify-center'}`}
              >
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(props.googleRating!) ? 'text-[#D4AF37]' : 'text-[#D4AF37]/20'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="font-[family-name:var(--font-raleway)] text-lg font-semibold text-[#14B8A6]">
                  {props.googleRating}
                </span>
                {props.googleReviews && (
                  <span className="font-[family-name:var(--font-nunito)] text-sm text-[#1C1917]/40">
                    ({props.googleReviews} değerlendirme)
                  </span>
                )}
              </motion.div>
            )}

            {/* CTA */}
            <motion.div
              variants={fadeInUp}
              className={`mt-12 flex flex-col items-center gap-4 sm:flex-row ${
                props.images?.hero ? '' : 'sm:justify-center'
              }`}
            >
              <a
                href={chatLink}
                onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#14B8A6] px-10 py-3.5 font-[family-name:var(--font-nunito)] text-sm font-semibold text-white shadow-lg shadow-[#14B8A6]/25 transition-all hover:bg-[#0D9488] hover:shadow-xl hover:shadow-[#14B8A6]/30 active:scale-[0.97]"
              >
                <svg className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Ücretsiz Danışmanlık
              </a>
            </motion.div>
          </div>

          {/* SLOT 1 — Hero Image: Geometric Frame */}
          {props.images?.hero ? (
            <motion.div
              variants={scaleIn}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative p-4">
                {/* Corner decorations */}
                <div className="absolute top-0 left-0 h-8 w-8 border-t-2 border-l-2 border-[#14B8A6]" />
                <div className="absolute top-0 right-0 h-8 w-8 border-t-2 border-r-2 border-[#14B8A6]" />
                <div className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-[#14B8A6]" />
                <div className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-[#14B8A6]" />
                {/* Inner gold accent dots */}
                <div className="absolute top-2 left-2 h-2 w-2 rounded-full bg-[#D4AF37]" />
                <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#D4AF37]" />
                <div className="absolute bottom-2 left-2 h-2 w-2 rounded-full bg-[#D4AF37]" />
                <div className="absolute bottom-2 right-2 h-2 w-2 rounded-full bg-[#D4AF37]" />
                <div className="h-72 w-72 overflow-hidden rounded-lg">
                  <img
                    src={props.images.hero}
                    alt={props.firmName}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              variants={fadeInUp}
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              style={{ opacity: 0.04 }}
            >
              <div className="h-[420px] w-[420px] rounded-full bg-gradient-to-br from-[#14B8A6] to-[#D4AF37] blur-3xl" />
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* ===== ALARM + SLOT 2: Technology Image ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="bg-[#0F766E] px-6 py-20 md:px-12 lg:px-24 lg:py-28"
      >
        <div
          className={`mx-auto ${
            props.images?.technology
              ? 'max-w-5xl grid grid-cols-1 lg:grid-cols-2 items-center gap-10'
              : 'max-w-2xl text-center'
          }`}
        >
          {/* Alarm text */}
          <div className={props.images?.technology ? '' : ''}>
            <motion.div
              variants={fadeInUp}
              className={`mb-6 flex items-center gap-2 ${props.images?.technology ? '' : 'justify-center'}`}
            >
              <div className="h-px w-8 bg-[#D4AF37]" />
              <span className="font-[family-name:var(--font-nunito)] text-xs font-medium uppercase tracking-[0.15em] text-[#D4AF37]">
                Dikkat
              </span>
            </motion.div>

            <motion.p
              variants={fadeInUp}
              className={`font-[family-name:var(--font-raleway)] text-2xl font-bold leading-relaxed text-white md:text-3xl ${
                props.images?.technology ? '' : ''
              }`}
            >
              Epilasyon araştıranlar fiyat karşılaştırıyor.{' '}
              <span className="text-[#D4AF37]">Web siteniz yoksa</span>{' '}
              fiyatlandırmanıza güvenemiyorlar.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className={`my-8 h-px w-16 bg-white/20 ${props.images?.technology ? '' : 'mx-auto'}`}
            />

            <motion.p
              variants={fadeInUp}
              className="font-[family-name:var(--font-nunito)] text-base text-white/60 md:text-lg"
            >
              Müşterilerin %85&apos;i seans paketlerini ve teknoloji bilgisini online
              karşılaştırıyor. Dijital varlığınız yoksa tercih listenizden düşüyorsunuz.
            </motion.p>
          </div>

          {/* SLOT 2 — Technology Image: Floating Card */}
          {props.images?.technology && (
            <motion.div variants={fadeInUp}>
              <div className="overflow-hidden rounded-xl shadow-2xl shadow-black/20 ring-2 ring-white/20">
                <img
                  src={props.images.technology}
                  alt="Lazer teknolojisi"
                  className="h-56 w-full object-cover"
                />
              </div>
              <p className="mt-3 text-center font-[family-name:var(--font-nunito)] text-sm text-white/60">
                Son Teknoloji Lazer &amp; IPL Sistemleri
              </p>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* ===== COMPARISON ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="px-6 py-20 md:px-12 lg:px-24 lg:py-28"
      >
        <motion.div variants={fadeInUp} className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="font-[family-name:var(--font-raleway)] text-3xl font-bold text-[#1C1917] md:text-4xl">
            Fark nerede başlıyor?
          </h2>
          <p className="mt-4 font-[family-name:var(--font-nunito)] text-base text-[#1C1917]/50">
            Web siteniz olduğunda müşteri güveni katlanarak artıyor.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          {/* Without Website */}
          <motion.div
            variants={fadeInUp}
            className="rounded-2xl border border-[#14B8A6]/10 bg-white p-8 md:p-10"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1C1917]/5">
                <svg className="h-4 w-4 text-[#1C1917]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-raleway)] text-xl font-bold text-[#1C1917]">
                Web Siteniz Yoksa
              </h3>
            </div>
            <ul className="space-y-4">
              {[
                'Fiyatlarınız bilinmiyor',
                'Teknolojiniz görünmüyor',
                'Güven oluşturamıyorsunuz',
                'Sonuçlarınızı gösteremiyorsunuz',
                'Randevu almak zor',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 font-[family-name:var(--font-nunito)] text-sm text-[#1C1917]/55"
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
            className="rounded-2xl border-2 border-[#14B8A6] bg-white p-8 shadow-lg shadow-[#14B8A6]/10 md:p-10"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#14B8A6]/10">
                <svg className="h-4 w-4 text-[#14B8A6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-raleway)] text-xl font-bold text-[#14B8A6]">
                Web Siteniz Olursa
              </h3>
            </div>
            <ul className="space-y-4">
              {[
                'Şeffaf paket fiyatlar',
                'Lazer/IPL teknolojiniz sergileniyor',
                'Profesyonel marka imajı',
                'Öncesi-sonrası galeri',
                '7/24 online randevu',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 font-[family-name:var(--font-nunito)] text-sm text-[#1C1917]/80"
                >
                  <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-[#14B8A6]" />
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
        className="relative overflow-hidden bg-gradient-to-br from-[#14B8A6] via-[#0F9B8E] to-[#0F766E] px-6 py-20 md:px-12 lg:px-24 lg:py-28"
      >
        {/* Decorative elements */}
        <div className="pointer-events-none absolute -left-10 top-10 h-32 w-32 rounded-full bg-white/[0.04]" />
        <div className="pointer-events-none absolute -right-8 bottom-8 h-48 w-48 rounded-full bg-[#D4AF37]/[0.06]" />

        <div className="relative mx-auto max-w-2xl text-center">
          <motion.div variants={fadeInUp} className="mx-auto mb-6 text-4xl">
            ✨
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="font-[family-name:var(--font-raleway)] text-3xl font-bold text-white md:text-4xl"
          >
            Ücretsiz Teklif Alın
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-5 max-w-lg font-[family-name:var(--font-nunito)] text-base leading-relaxed text-white/70"
          >
            Size özel epilasyon merkezi web sitesi için hemen iletişime geçin.
            Teknolojinizi ve fiyatlarınızı en iyi şekilde sergileyelim.
          </motion.p>

          <motion.a
            variants={fadeInUp}
            href={chatLink}
            onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
            className="mt-10 inline-flex items-center justify-center gap-2 rounded-full bg-white px-12 py-4 font-[family-name:var(--font-nunito)] text-sm font-semibold text-[#0F766E] shadow-xl shadow-black/10 transition-all hover:bg-[#D4AF37] hover:text-white active:scale-[0.97]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Hemen Teklif Al
          </motion.a>
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
        <motion.div variants={fadeInUp} className="mx-auto mb-12 max-w-xl text-center">
          <h2 className="font-[family-name:var(--font-raleway)] text-2xl font-bold text-[#1C1917] md:text-3xl">
            Neden Vorte Studio?
          </h2>
        </motion.div>

        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-3">
          {[
            {
              icon: (
                <svg className="h-6 w-6 text-[#14B8A6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                </svg>
              ),
              title: 'Ücretsiz Danışmanlık',
              desc: 'İlk görüşme ve ihtiyaç analizi tamamen ücretsiz.',
            },
            {
              icon: (
                <svg className="h-6 w-6 text-[#14B8A6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              ),
              title: 'Son Teknoloji',
              desc: 'Lazer ve IPL teknolojilerinizi en iyi şekilde sergiliyoruz.',
            },
            {
              icon: (
                <svg className="h-6 w-6 text-[#14B8A6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              ),
              title: 'Hijyen Garantisi',
              desc: 'Hijyen standartlarınızı ön plana çıkaran profesyonel tasarım.',
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              variants={fadeInUp}
              className="group rounded-2xl border border-[#14B8A6]/10 bg-white p-8 text-center transition-all hover:border-[#14B8A6]/30 hover:shadow-xl hover:shadow-[#14B8A6]/5"
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#14B8A6]/[0.08] transition-colors group-hover:bg-[#14B8A6]/[0.14]">
                {item.icon}
              </div>
              <h3 className="font-[family-name:var(--font-raleway)] text-lg font-bold text-[#1C1917]">
                {item.title}
              </h3>
              <p className="mt-2 font-[family-name:var(--font-nunito)] text-sm leading-relaxed text-[#1C1917]/50">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ===== FOOTER ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeInUp}
        className="bg-[#1C1917] px-6 py-14 text-center md:px-12"
      >
        <div className="mx-auto mb-6 flex items-center justify-center gap-3">
          <div className="h-px w-8 bg-[#14B8A6]/30" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#14B8A6]/40" />
          <div className="h-px w-8 bg-[#14B8A6]/30" />
        </div>
        <p className="font-[family-name:var(--font-nunito)] text-sm text-[#FAFAF9]/40">
          Bu sayfa {props.firmName} için{' '}
          <span className="font-semibold text-[#14B8A6]">Vorte Studio</span>{' '}
          tarafından hazırlanmıştır.
        </p>
        <p className="mt-2 font-[family-name:var(--font-nunito)] text-xs text-[#FAFAF9]/20">
          {props.city}
          {props.district ? ` / ${props.district}` : ''}
        </p>
      </motion.section>
    </div>
  )
}
