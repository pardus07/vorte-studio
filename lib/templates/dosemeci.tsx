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
  weight: ['300', '400', '500', '600', '700'],
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

export default function DosemeciTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const galleryImg = props.images?.gallery

  return (
    <div className={`${playfair.variable} ${karla.variable} min-h-screen bg-[#FBF7F0] text-[#1C1917]`}>
      {/* ═══════════════════ HERO — Leather Texture + Before/After Concept ═══════════════════ */}
      <section className="relative overflow-hidden bg-[#713F12] pb-20 pt-16 text-white">
        {/* Leather stitch SVG pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="leather-stitch" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <line x1="0" y1="15" x2="5" y2="15" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="10" y1="15" x2="15" y2="15" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="20" y1="15" x2="25" y2="15" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="30" y1="15" x2="35" y2="15" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="40" y1="15" x2="45" y2="15" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="50" y1="15" x2="55" y2="15" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="15" y1="45" x2="20" y2="45" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="25" y1="45" x2="30" y2="45" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="35" y1="45" x2="40" y2="45" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="45" y1="45" x2="50" y2="45" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#leather-stitch)" />
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
              {/* Craft badge */}
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full bg-[#FDE68A]/20 px-5 py-2">
                <span className="text-lg">🪡</span>
                <span className="font-[family-name:var(--font-karla)] text-sm font-600 uppercase tracking-wider text-[#FDE68A]">
                  El İşçiliği
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-playfair)] text-5xl font-700 leading-tight sm:text-6xl lg:text-7xl">
                Eski Mobilyanız
                <br />
                <span className="text-[#FDE68A]">Yeni Gibi</span>
                <br />
                Olacak
              </motion.h1>

              <motion.p variants={fadeInUp} className="max-w-md font-[family-name:var(--font-karla)] text-base leading-relaxed text-white/60">
                <strong className="text-white">{props.firmName}</strong> — koltuk, kanepe ve mobilya döşeme
                ustası. {props.city} genelinde kumaş ve deri seçenekleriyle evde servis.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 rounded-lg bg-[#FDE68A] px-8 py-4 font-[family-name:var(--font-karla)] text-sm font-600 uppercase tracking-wider text-[#713F12] shadow-lg transition-all hover:bg-[#FEF08A] hover:shadow-xl"
                >
                  Ücretsiz Teklif Al
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              {(props.googleRating || props.googleReviews) && (
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 rounded-lg bg-white/10 px-5 py-3 backdrop-blur-sm">
                  <div className="flex gap-0.5 text-[#FDE68A]">
                    {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <span className="font-[family-name:var(--font-karla)] text-sm text-white/60">
                    {props.googleRating} ({props.googleReviews}+ yorum)
                  </span>
                </motion.div>
              )}
            </div>

            {/* Sağ — Before/After concept image */}
            <motion.div variants={scaleIn} className="relative">
              {/* Before/After label */}
              <div className="absolute -right-2 top-4 z-10 rounded-l-lg bg-[#FDE68A] px-4 py-2 shadow-lg">
                <span className="font-[family-name:var(--font-karla)] text-xs font-700 uppercase text-[#713F12]">Öncesi → Sonrası</span>
              </div>

              <div className="overflow-hidden rounded-2xl bg-[#5C3310]">
                <div className="aspect-[4/3]">
                  {heroImg ? (
                    <img src={heroImg} alt={`${props.firmName} döşeme`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#FDE68A]/10">
                      <div className="text-center">
                        <div className="text-6xl">🛋️</div>
                        <p className="mt-3 font-[family-name:var(--font-karla)] text-sm text-white/30">Döşeme Görseli</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Material badges */}
              <div className="mt-4 flex flex-wrap gap-2">
                {['Kumaş', 'Deri', 'Kadife', 'Süet'].map((mat, i) => (
                  <span key={i} className="rounded-full bg-white/10 px-4 py-1.5 font-[family-name:var(--font-karla)] text-xs font-600 text-[#FDE68A]">
                    🪡 {mat}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#FDE68A]/30 py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#713F12] px-5 py-2 text-sm text-white">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-karla)] uppercase tracking-wider">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-playfair)] text-3xl font-700 text-[#713F12] sm:text-4xl">
            Koltuk Yaptırmak İsteyenler
            <br />
            <span className="text-[#92400E]">Fiyat ve Malzeme Seçenekleri Arıyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-karla)] text-lg text-[#713F12]/70">
            Koltuk döşeme veya yenileme isteyenlerin <strong className="text-[#713F12]">%65&apos;i</strong> malzeme
            seçeneklerini ve öncesi/sonrası fotoğraflarını online inceliyor.
          </motion.p>

          {galleryImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden rounded-xl border-2 border-[#713F12]/20">
              <img src={galleryImg} alt={`${props.firmName} projeler`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '🛋️', stat: '%65', text: 'Online araştırıyor' },
              { emoji: '🪡', stat: '30+', text: 'Kumaş çeşidi' },
              { emoji: '🏠', stat: '%80', text: 'Evde servis istiyor' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="rounded-xl bg-white p-5 shadow-sm">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-playfair)] text-2xl font-700 text-[#713F12]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-karla)] text-sm text-[#713F12]/60">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-playfair)] text-3xl font-700 sm:text-4xl">
            Web Sitesi <span className="text-[#713F12]">Olan</span> vs <span className="text-[#1C1917]/30">Olmayan</span> Döşemeciler
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="rounded-2xl border-2 border-[#713F12]/20 bg-[#713F12]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-karla)] text-base font-600 uppercase tracking-wider text-[#713F12]">✅ Web Sitesi Olan</div>
              <ul className="space-y-3 font-[family-name:var(--font-karla)] text-[#1C1917]/70">
                {['Öncesi/sonrası fotoğrafları güven veriyor', 'Kumaş ve deri katalog online erişilebilir', 'Evde servis bilgisi net görünüyor', 'Google\'da "döşemeci" aramasında çıkıyor', 'WhatsApp ile hızlı iletişim sağlıyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-[#713F12]">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="rounded-2xl border border-[#1C1917]/10 bg-[#1C1917]/[0.03] p-8">
              <div className="mb-4 font-[family-name:var(--font-karla)] text-base font-600 uppercase tracking-wider text-[#1C1917]/30">❌ Web Sitesi Olmayan</div>
              <ul className="space-y-3 font-[family-name:var(--font-karla)] text-[#1C1917]/30">
                {['İşçilik kalitesini gösteremiyor', 'Malzeme seçeneklerini anlatamıyor', 'Sadece tanıdık tavsiyesiyle çalışıyor', 'Güven oluşturamıyor', 'Rekabette geride kalıyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="bg-[#713F12] py-24 text-white">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="text-4xl">🛋️</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-playfair)] text-3xl font-700 sm:text-4xl lg:text-5xl">
            Mobilyalarınıza <span className="text-[#FDE68A]">Yeni Hayat Verin</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-karla)] text-base text-white/60">
            Taahhüt yok, zorlama yok — {props.firmName} ile ücretsiz keşif ve kumaş numunesi.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 rounded-lg bg-[#FDE68A] px-10 py-5 font-[family-name:var(--font-karla)] text-base font-600 uppercase tracking-wider text-[#713F12] shadow-xl transition-all hover:bg-[#FEF08A] hover:shadow-2xl">
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-[#713F12]/10 py-16">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: '🏠', title: 'Evde Servis', desc: 'Kumaş numuneleriyle evinize gelip yerinde danışmanlık.' },
            { icon: '🪡', title: 'El İşçiliği', desc: '30 yıllık tecrübeyle geleneksel döşeme sanatı.' },
            { icon: '💰', title: 'Şeffaf Fiyat', desc: 'İşe başlamadan önce detaylı fiyat bilgisi.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="rounded-xl border border-[#713F12]/10 bg-white p-6 text-center">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-karla)] text-sm font-600 uppercase tracking-wider text-[#713F12]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-karla)] text-sm text-[#1C1917]/50">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-[#713F12]/10 bg-[#FBF7F0] py-8 text-center font-[family-name:var(--font-karla)] text-sm text-[#1C1917]/30">
        <p>Bu sayfa <strong className="text-[#1C1917]/50">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
