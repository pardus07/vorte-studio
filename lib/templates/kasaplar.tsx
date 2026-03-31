'use client'

import { Oswald, Source_Sans_3 } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const oswald = Oswald({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-oswald',
  display: 'swap',
})

const sourceSans = Source_Sans_3({
  subsets: ['latin-ext'],
  weight: ['400', '600', '700'],
  variable: '--font-source-sans',
  display: 'swap',
})

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
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
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
}

const slideFromRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
}

export default function KasaplarTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const productsImg = props.images?.products

  return (
    <div className={`${oswald.variable} ${sourceSans.variable} min-h-screen bg-[#FFFBF5] text-[#1C1917]`}>
      {/* ═══════════════════ HERO — Bold Diagonal Split ═══════════════════ */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Dark background split */}
        <div className="absolute inset-0 bg-[#7F1D1D]" />
        <div
          className="absolute inset-0 bg-[#FFFBF5]"
          style={{ clipPath: 'polygon(55% 0%, 100% 0%, 100% 100%, 40% 100%)' }}
        />

        {/* Subtle texture */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }}
        />

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-16"
          >
            {/* Sol — Text (koyu arka plan üstünde) */}
            <div className="space-y-8">
              <motion.div variants={fadeInUp} className="flex items-center gap-3">
                <div className="h-1 w-10 bg-[#FDE68A]" />
                <span className="font-[family-name:var(--font-source-sans)] text-sm font-600 uppercase tracking-[0.2em] text-[#FDE68A]">
                  {props.city} &bull; Kaliteli Kasap
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="font-[family-name:var(--font-oswald)] text-5xl font-700 uppercase leading-[0.95] text-white sm:text-6xl lg:text-7xl"
              >
                Taze Et
                <br />
                <span className="text-[#FDE68A]">Güvenilir</span>
                <br />
                Kaynak
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="max-w-md font-[family-name:var(--font-source-sans)] text-lg leading-relaxed text-white/60"
              >
                <strong className="text-white">{props.firmName}</strong> — günlük kesim,
                kontrollü menşei ve profesyonel hizmet anlayışıyla sofranızın güvencesi.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 bg-[#FDE68A] px-8 py-4 font-[family-name:var(--font-oswald)] text-base font-600 uppercase tracking-wider text-[#7F1D1D] transition-all hover:bg-[#FCD34D] hover:shadow-[0_0_30px_rgba(253,230,138,0.3)]"
                >
                  Ücretsiz Teklif Al
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              {/* Trust badges */}
              <motion.div variants={fadeInUp} className="flex gap-6 border-t border-white/10 pt-6">
                {[
                  { num: '25+', label: 'Yıl Tecrübe' },
                  { num: '10.000+', label: 'Mutlu Müşteri' },
                  { num: '%100', label: 'Helal Sertifika' },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="font-[family-name:var(--font-oswald)] text-2xl font-700 text-[#FDE68A]">{s.num}</div>
                    <div className="font-[family-name:var(--font-source-sans)] text-xs text-white/40">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Sağ — Hero image (açık arka plan üstünde) */}
            <motion.div variants={scaleIn} className="relative">
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm shadow-2xl">
                {heroImg ? (
                  <img src={heroImg} alt={`${props.firmName} et ürünleri`} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#7F1D1D]/10 to-[#991B1B]/20">
                    <div className="text-center">
                      <div className="text-6xl">🥩</div>
                      <p className="mt-3 font-[family-name:var(--font-source-sans)] text-sm text-[#7F1D1D]/30">Kasap Görseli</p>
                    </div>
                  </div>
                )}

                {/* Red accent stripe */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#7F1D1D]" />
              </div>

              {/* Rating badge */}
              {(props.googleRating || props.googleReviews) && (
                <div className="absolute -bottom-5 -left-3 border-l-4 border-[#7F1D1D] bg-white px-5 py-4 shadow-xl sm:-left-5">
                  <div className="flex items-center gap-2">
                    <span className="font-[family-name:var(--font-oswald)] text-3xl font-700 text-[#7F1D1D]">{props.googleRating}</span>
                    <div>
                      <div className="flex gap-0.5 text-sm text-[#F59E0B]">
                        {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                      </div>
                      <p className="font-[family-name:var(--font-source-sans)] text-xs text-[#78350F]/60">{props.googleReviews}+ Yorum</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#FFFBF5] py-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-4xl px-4 text-center sm:px-6"
        >
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 border border-[#7F1D1D]/10 bg-[#7F1D1D]/5 px-4 py-2 text-sm text-[#7F1D1D]">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-source-sans)] font-600">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-oswald)] text-3xl font-700 uppercase sm:text-4xl">
            Kaliteli Kasap Arayanlar
            <br />
            <span className="text-[#7F1D1D]">Önce Online İnceliyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-source-sans)] text-lg text-[#78350F]/60">
            Et ürünü arayanların <strong className="text-[#1C1917]">%64&apos;ü</strong> kasap seçerken
            online inceliyor. Web siteniz yoksa &quot;güvenilir mi?&quot; sorusu yanıtsız kalıyor
            — müşteri rakibinize gidiyor.
          </motion.p>

          {/* Products image */}
          {productsImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden border border-[#7F1D1D]/10 shadow-lg">
              <img src={productsImg} alt={`${props.firmName} ürünler`} className="w-full object-cover" />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { icon: '🔍', stat: '%64', text: 'Online kasap inceliyor' },
              { icon: '🛒', stat: '%45', text: 'Online sipariş istiyor' },
              { icon: '📍', stat: '%70', text: 'Maps\'ten kasap arıyor' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="border border-[#7F1D1D]/10 bg-[#7F1D1D]/5 p-5 text-center">
                <div className="text-2xl">{item.icon}</div>
                <div className="mt-2 font-[family-name:var(--font-oswald)] text-2xl font-700 text-[#7F1D1D]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-source-sans)] text-sm text-[#78350F]/50">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="border-y border-[#7F1D1D]/10 bg-white py-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-5xl px-4 sm:px-6"
        >
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-oswald)] text-3xl font-700 uppercase sm:text-4xl">
            Web Sitesi <span className="text-[#15803D]">Olan</span> vs <span className="text-[#1C1917]/30">Olmayan</span> Kasap
          </motion.h2>

          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="border-l-4 border-[#15803D] bg-[#15803D]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-oswald)] text-lg font-700 uppercase text-[#15803D]">
                ✅ Web Sitesi Olan Kasap
              </div>
              <ul className="space-y-3 font-[family-name:var(--font-source-sans)] text-[#1C1917]/80">
                {[
                  'Ürün listesi online — müşteri fiyat bilerek geliyor',
                  'Menşei belgesi görünür — güven artıyor',
                  'Online sipariş/teslimat hizmeti',
                  'Google\'da "kasap" aramasında üst sırada',
                  'Toptan satış talepleri geliyor',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 text-[#15803D]">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={slideFromRight} className="border-l-4 border-[#1C1917]/10 bg-[#1C1917]/[0.02] p-8">
              <div className="mb-4 font-[family-name:var(--font-oswald)] text-lg font-700 uppercase text-[#1C1917]/30">
                ❌ Web Sitesi Olmayan Kasap
              </div>
              <ul className="space-y-3 font-[family-name:var(--font-source-sans)] text-[#1C1917]/40">
                {[
                  'Ürün ve fiyat bilgisi yok — müşteri çekiniyor',
                  'Güvenilirlik sorusu yanıtsız kalıyor',
                  'Sadece mağazadan satış — kısıtlı erişim',
                  'Arama sonuçlarında görünmüyor',
                  'Kurumsal müşteriler ulaşamıyor',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="relative overflow-hidden bg-[#7F1D1D] py-24 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: 'radial-gradient(#FDE68A 1px, transparent 1px)', backgroundSize: '30px 30px' }}
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="relative mx-auto max-w-3xl px-4 text-center sm:px-6"
        >
          <motion.div variants={fadeInUp} className="mx-auto mb-6 h-1 w-16 bg-[#FDE68A]" />

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-oswald)] text-4xl font-700 uppercase sm:text-5xl lg:text-6xl">
            Kasabınızı
            <br />
            <span className="text-[#FDE68A]">Dijitale Taşıyalım</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-source-sans)] text-lg text-white/60">
            Taahhüt yok, zorlama yok — {props.firmName} için özel hazırlanmış
            profesyonel kasap web sitesi teklifi.
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-8">
            <a
              href={chatLink}
              onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 bg-[#FDE68A] px-10 py-5 font-[family-name:var(--font-oswald)] text-lg font-600 uppercase tracking-wider text-[#7F1D1D] transition-all hover:bg-[#FCD34D] hover:shadow-[0_0_50px_rgba(253,230,138,0.3)]"
            >
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-[#7F1D1D]/10 py-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6"
        >
          {[
            { icon: '🥩', title: 'Ücretsiz Danışmanlık', desc: 'İlk görüşme ve analiz tamamen ücretsiz.' },
            { icon: '⚡', title: '48 Saat Teslimat', desc: 'Profesyonel kasap web siteniz 48 saat içinde hazır.' },
            { icon: '🛡️', title: 'Güven Tasarımı', desc: 'Menşei, sertifika ve kalite vurgulu tasarım.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="border border-[#7F1D1D]/10 bg-white p-6 text-center shadow-sm">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-oswald)] text-base font-600 uppercase text-[#7F1D1D]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-source-sans)] text-sm text-[#78350F]/50">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="border-t border-[#1C1917]/5 py-8 text-center font-[family-name:var(--font-source-sans)] text-sm text-[#1C1917]/30">
        <p>Bu sayfa <strong className="text-[#1C1917]/50">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
