'use client'

import { Dancing_Script, Lato } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const dancingScript = Dancing_Script({
  subsets: ['latin-ext'],
  weight: ['400', '600', '700'],
  variable: '--font-dancing-script',
  display: 'swap',
})

const lato = Lato({
  subsets: ['latin-ext'],
  weight: ['400', '700'],
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

export default function PastanelerTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const galleryImg = props.images?.gallery
  const gallery2Img = props.images?.gallery2

  return (
    <div className={`${dancingScript.variable} ${lato.variable} min-h-screen bg-[#FFF5F7] text-[#4A1942]`}>
      {/* ═══════════════════ HERO — Masonry Gallery + Artisanal ═══════════════════ */}
      <section className="relative overflow-hidden pb-20 pt-16">
        {/* Soft pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(#9D174D 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
          >
            {/* Sol — Text */}
            <div className="space-y-8">
              <motion.div variants={fadeInUp} className="flex items-center gap-3">
                <span className="text-2xl">🎂</span>
                <span className="font-[family-name:var(--font-lato)] text-sm font-700 uppercase tracking-[0.2em] text-[#9D174D]">
                  {props.city} &bull; El Yapımı Pastane
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp}>
                <span className="font-[family-name:var(--font-dancing-script)] text-5xl leading-[1.2] text-[#9D174D] sm:text-6xl lg:text-7xl">
                  Özel Günleriniz İçin
                </span>
                <br />
                <span className="font-[family-name:var(--font-lato)] text-2xl font-700 text-[#4A1942] sm:text-3xl">
                  El Yapımı Lezzetler
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="max-w-md font-[family-name:var(--font-lato)] text-lg leading-relaxed text-[#9D174D]/60"
              >
                <strong className="text-[#4A1942]">{props.firmName}</strong> — doğal malzemeler,
                özenli el işçiliği ve yaratıcı tasarımlarla her özel gününüzü tatlandırıyoruz.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 rounded-full bg-[#9D174D] px-8 py-4 font-[family-name:var(--font-lato)] text-base font-700 text-white shadow-lg transition-all hover:bg-[#BE185D] hover:shadow-xl"
                >
                  Ücretsiz Teklif Al
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>
            </div>

            {/* Sağ — Masonry Gallery Grid */}
            <motion.div variants={scaleIn} className="relative">
              <div className="grid grid-cols-2 gap-3">
                {/* Main hero — tall left */}
                <div className="row-span-2 aspect-[3/4] overflow-hidden rounded-3xl border-2 border-[#FCE7F3] bg-[#FCE7F3] shadow-lg">
                  {heroImg ? (
                    <img src={heroImg} alt={`${props.firmName} pasta`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#FCE7F3] to-[#FDF2F8]">
                      <div className="text-center">
                        <div className="text-5xl">🎂</div>
                        <p className="mt-2 font-[family-name:var(--font-lato)] text-sm text-[#9D174D]/30">Pasta Görseli</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Gallery 1 — top right */}
                <div className="aspect-square overflow-hidden rounded-3xl border-2 border-[#FCE7F3] bg-[#FCE7F3] shadow-lg">
                  {galleryImg ? (
                    <img src={galleryImg} alt={`${props.firmName} ürün`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#FDF2F8] to-[#FCE7F3]">
                      <div className="text-3xl">🧁</div>
                    </div>
                  )}
                </div>

                {/* Gallery 2 — bottom right */}
                <div className="aspect-square overflow-hidden rounded-3xl border-2 border-[#FCE7F3] bg-[#FCE7F3] shadow-lg">
                  {gallery2Img ? (
                    <img src={gallery2Img} alt={`${props.firmName} ürün`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#FCE7F3] to-[#FDF2F8]">
                      <div className="text-3xl">🍰</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Floating badge */}
              {(props.googleRating || props.googleReviews) && (
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full border-2 border-[#9D174D]/20 bg-white px-6 py-3 shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5 text-[#F59E0B]">
                      {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                    </div>
                    <span className="font-[family-name:var(--font-lato)] text-sm font-700 text-[#9D174D]">
                      {props.googleRating} ({props.googleReviews}+)
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#9D174D] py-20 text-white">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-4xl px-4 text-center sm:px-6"
        >
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-lato)]">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-dancing-script)] text-3xl sm:text-4xl lg:text-5xl">
            Pasta Siparişi Arayanlar
          </motion.h2>
          <motion.h3 variants={fadeInUp} className="mt-2 font-[family-name:var(--font-lato)] text-xl font-700 text-[#FCE7F3]">
            Önce Görsellere Bakıyor
          </motion.h3>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-lato)] text-lg text-white/70">
            Doğum günü pastası arayanların <strong className="text-white">%88&apos;i</strong> önce
            görsel inceliyor. Instagram&apos;ınız var ama web siteniz yoksa — müşteri
            güvenemiyor ve sipariş veremiyor.
          </motion.p>

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '📸', stat: '%88', text: 'Önce görsel inceliyor' },
              { emoji: '💰', stat: '~₺8.000', text: 'Aylık kayıp potansiyel' },
              { emoji: '🎯', stat: '4x', text: 'Daha fazla sipariş' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-lato)] text-2xl font-700 text-[#FCE7F3]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-lato)] text-sm text-white/60">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="py-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-5xl px-4 sm:px-6"
        >
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-dancing-script)] text-3xl text-[#9D174D] sm:text-4xl">
            Web Sitesi Olan vs Olmayan Pastane
          </motion.h2>

          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="rounded-3xl border-2 border-[#9D174D]/10 bg-[#9D174D]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-lato)] text-lg font-700 text-[#9D174D]">
                ✅ Web Sitesi Olan Pastane
              </div>
              <ul className="space-y-3 font-[family-name:var(--font-lato)] text-[#4A1942]/80">
                {[
                  'Ürün galerisi online — müşteri güveniyor',
                  'Sipariş formu 7/24 açık',
                  'Özel tasarım pasta talepleri artıyor',
                  'Google\'da "pastane" aramasında üst sırada',
                  'Fiyat listesi şeffaf — müşteri emin geliyor',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 text-[#9D174D]">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={slideFromRight} className="rounded-3xl border-2 border-[#4A1942]/5 bg-[#4A1942]/[0.02] p-8">
              <div className="mb-4 font-[family-name:var(--font-lato)] text-lg font-700 text-[#4A1942]/30">
                ❌ Web Sitesi Olmayan Pastane
              </div>
              <ul className="space-y-3 font-[family-name:var(--font-lato)] text-[#4A1942]/40">
                {[
                  'Ürünler sadece Instagram\'da — kısıtlı erişim',
                  'Sipariş sadece telefonla — kaçırılan talepler',
                  'Sadece standart ürünler satılıyor',
                  'Arama sonuçlarında görünmüyor',
                  'Fiyat bilgisi yok — müşteri çekiniyor',
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
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F7] to-[#FCE7F3]/50 py-24">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-3xl px-4 text-center sm:px-6"
        >
          <motion.div variants={fadeInUp} className="text-4xl">🎂</motion.div>

          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-dancing-script)] text-4xl text-[#9D174D] sm:text-5xl">
            Pastanenizi Dijitale Taşıyalım
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-lato)] text-lg text-[#9D174D]/60">
            Taahhüt yok, zorlama yok — {props.firmName} için özel hazırlanmış
            profesyonel pastane web sitesi teklifi.
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-8">
            <a
              href={chatLink}
              onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 rounded-full bg-[#9D174D] px-10 py-5 font-[family-name:var(--font-lato)] text-lg font-700 text-white shadow-xl transition-all hover:bg-[#BE185D] hover:shadow-2xl"
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
      <section className="border-t border-[#9D174D]/10 py-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6"
        >
          {[
            { icon: '🎨', title: 'Ücretsiz Danışmanlık', desc: 'İlk görüşme ve tasarım analizi tamamen ücretsiz.' },
            { icon: '⚡', title: '48 Saat Teslimat', desc: 'Profesyonel pastane web siteniz 48 saat içinde hazır.' },
            { icon: '📸', title: 'Görsel Galeri', desc: 'Ürünlerinizi en güzel şekilde sergileyen tasarım.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="rounded-2xl border-2 border-[#9D174D]/10 bg-white/60 p-6 text-center">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-lato)] text-base font-700 text-[#9D174D]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-lato)] text-sm text-[#9D174D]/50">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="border-t border-[#9D174D]/10 py-8 text-center font-[family-name:var(--font-lato)] text-sm text-[#9D174D]/30">
        <p>Bu sayfa <strong className="text-[#9D174D]/50">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
