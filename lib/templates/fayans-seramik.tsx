'use client'

import { Playfair_Display, Karla } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const playfair = Playfair_Display({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
})

const karla = Karla({
  subsets: ['latin-ext'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-karla',
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

export default function FayansSeramikTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const galleryImg = props.images?.gallery

  return (
    <div className={`${playfair.variable} ${karla.variable} min-h-screen bg-[#F8F5F2] text-[#1C1917]`}>
      {/* ═══════════════════ HERO — Mosaic Tile Pattern + Earth Palette ═══════════════════ */}
      <section className="relative overflow-hidden pb-20 pt-16">
        {/* Mosaic tile pattern background */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="mosaic-tiles" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <rect x="1" y="1" width="28" height="28" fill="none" stroke="#92400E" strokeWidth="0.7" />
                <rect x="31" y="1" width="28" height="28" fill="none" stroke="#92400E" strokeWidth="0.7" />
                <rect x="1" y="31" width="28" height="28" fill="none" stroke="#92400E" strokeWidth="0.7" />
                <rect x="31" y="31" width="28" height="28" fill="none" stroke="#92400E" strokeWidth="0.7" />
                <rect x="14" y="14" width="32" height="32" fill="none" stroke="#92400E" strokeWidth="0.3" rx="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mosaic-tiles)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
          >
            <div className="space-y-8">
              <motion.div variants={fadeInUp} className="flex items-center gap-3">
                <div className="h-px w-12 bg-[#92400E]" />
                <span className="font-[family-name:var(--font-karla)] text-sm font-600 uppercase tracking-[0.3em] text-[#92400E]">
                  {props.city} &bull; Fayans & Seramik
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-playfair)] text-5xl font-700 leading-tight sm:text-6xl lg:text-7xl">
                Her Karo
                <br />
                Bir <span className="italic text-[#92400E]">Seçim</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="max-w-md font-[family-name:var(--font-karla)] text-base leading-relaxed text-[#1C1917]/60">
                <strong className="text-[#1C1917]">{props.firmName}</strong> — fayans, seramik ve granit
                döşeme uzmanı. Evinize değer katan estetik ve kalıcı işçilik.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 bg-[#92400E] px-8 py-4 font-[family-name:var(--font-karla)] text-base font-600 uppercase tracking-wider text-white shadow-lg transition-all hover:bg-[#78350F] hover:shadow-xl"
                >
                  Ücretsiz Teklif Al
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              {(props.googleRating || props.googleReviews) && (
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 rounded-lg bg-[#92400E]/5 px-5 py-3">
                  <div className="flex gap-0.5 text-[#92400E]">
                    {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <span className="font-[family-name:var(--font-karla)] text-sm text-[#1C1917]/50">
                    {props.googleRating} ({props.googleReviews}+ yorum)
                  </span>
                </motion.div>
              )}
            </div>

            {/* Sağ — Tile-framed image */}
            <motion.div variants={scaleIn} className="relative">
              {/* Decorative tile border frame */}
              <div className="rounded-xl bg-[#92400E]/10 p-3">
                <div className="overflow-hidden rounded-lg bg-[#E7E0DA]">
                  <div className="aspect-[4/3]">
                    {heroImg ? (
                      <img src={heroImg} alt={`${props.firmName} fayans`} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <div className="text-center">
                          <div className="text-6xl">🔲</div>
                          <p className="mt-3 font-[family-name:var(--font-karla)] text-sm text-[#1C1917]/30">Proje Görseli</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Floating material badge strip */}
              <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                {['Fayans', 'Granit', 'Mermer', 'Mozaik'].map((mat, i) => (
                  <span key={i} className="bg-white px-3 py-1.5 font-[family-name:var(--font-karla)] text-[10px] font-700 uppercase text-[#92400E] shadow-md">
                    {mat}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#92400E] py-20 text-white">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 border border-white/20 px-4 py-2 text-sm">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-playfair)] tracking-wider">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-playfair)] text-3xl font-700 sm:text-4xl">
            Fayans Döşetmek İsteyenler
            <br />
            <span className="text-[#FDE68A]">Model ve Referans Arıyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-karla)] text-lg text-white/80">
            Seramik döşetmek isteyenlerin <strong className="text-white">%71&apos;i</strong> önce
            model galeri ve referans işleri inceliyor. Web siteniz yoksa tercih edilmiyorsunuz.
          </motion.p>

          {galleryImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden rounded-xl border-2 border-white/20">
              <img src={galleryImg} alt={`${props.firmName} galeri`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '🔲', stat: '%71', text: 'Model galeri arıyor' },
              { emoji: '📸', stat: '%63', text: 'Referans iş görmek istiyor' },
              { emoji: '💰', stat: '%55', text: 'Online fiyat karşılaştırıyor' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="rounded-xl bg-white/10 p-5 backdrop-blur-sm">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-playfair)] text-2xl font-700 text-[#FDE68A]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-karla)] text-sm text-white/70">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-playfair)] text-3xl font-700 sm:text-4xl">
            Web Sitesi <span className="text-[#92400E]">Olan</span> vs <span className="text-[#1C1917]/30">Olmayan</span> Usta
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="rounded-xl border border-[#92400E]/20 bg-[#92400E]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-playfair)] text-lg font-600 text-[#92400E]">✅ Web Sitesi Olan Usta</div>
              <ul className="space-y-3 font-[family-name:var(--font-karla)] text-[#1C1917]/70">
                {['Model galerisi müşteriye ilham veriyor', 'Referans işler güven oluşturuyor', 'Google\'da "fayans döşeme" aramasında çıkıyor', 'Müşteriler doğru seçimi yapabiliyor', 'Teklif talepleri artıyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-[#92400E]">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="rounded-xl border border-[#1C1917]/10 bg-[#1C1917]/[0.03] p-8">
              <div className="mb-4 font-[family-name:var(--font-playfair)] text-lg font-600 text-[#1C1917]/30">❌ Web Sitesi Olmayan Usta</div>
              <ul className="space-y-3 font-[family-name:var(--font-karla)] text-[#1C1917]/30">
                {['İşlerini gösteremiyor', 'Güven oluşturamıyor', 'Arama sonuçlarında yok', 'Sadece çevresindeki müşterilere ulaşıyor', 'Fiyat karşılaştırmasına dahil olamıyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="relative py-24">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="text-4xl">🔲</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-playfair)] text-3xl font-700 sm:text-4xl lg:text-5xl">
            Evinize <span className="italic text-[#92400E]">Değer Katın</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-karla)] text-base text-[#1C1917]/60">
            Taahhüt yok, zorlama yok — {props.firmName} ile ücretsiz keşif ve model danışmanlığı.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 bg-[#92400E] px-10 py-5 font-[family-name:var(--font-karla)] text-lg font-600 uppercase tracking-wider text-white shadow-xl transition-all hover:bg-[#78350F] hover:shadow-2xl">
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-[#92400E]/10 py-16">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: '🔲', title: 'Ücretsiz Keşif', desc: 'Yerinde ölçü alma ve model danışmanlığı ücretsiz.' },
            { icon: '⚡', title: 'Hızlı Teslimat', desc: 'Fayans döşeme projeniz en kısa sürede tamamlanır.' },
            { icon: '🛡️', title: '5 Yıl Garanti', desc: 'İşçilik ve malzeme kalitesinde 5 yıl garanti.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="rounded-xl bg-white p-6 text-center shadow-sm">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-playfair)] text-base font-600 text-[#92400E]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-karla)] text-sm text-[#1C1917]/50">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-[#92400E]/10 py-8 text-center font-[family-name:var(--font-karla)] text-sm text-[#1C1917]/30">
        <p>Bu sayfa <strong className="text-[#1C1917]/50">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
