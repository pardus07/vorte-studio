'use client'

import { Nunito, Quicksand } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { suffixDe, suffixIn } from './turkish-grammar'
import { useTrackPageView, trackEvent } from './use-track'

const nunito = Nunito({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-nunito',
  display: 'swap',
})

const quicksand = Quicksand({
  subsets: ['latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-quicksand',
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

export default function PetShopTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const productsImg = props.images?.products

  return (
    <div className={`${nunito.variable} ${quicksand.variable} min-h-screen bg-[#FAFDF7] text-[#1C1917]`}>
      {/* ═══════════════════ HERO — Organic Blob Shape Mask + Paw Decorations ═══════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-[#ECFDF5]">
        {/* Organic paw print decorations */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[8%] top-[15%] text-6xl opacity-[0.06] rotate-[-20deg]">🐾</div>
          <div className="absolute right-[12%] top-[25%] text-4xl opacity-[0.05] rotate-[15deg]">🐾</div>
          <div className="absolute bottom-[20%] left-[20%] text-5xl opacity-[0.04] rotate-[30deg]">🐾</div>
          <div className="absolute bottom-[35%] right-[8%] text-7xl opacity-[0.05] rotate-[-10deg]">🐾</div>
        </div>

        {/* Soft organic blob shapes — background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-20 top-20 h-[500px] w-[500px] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-[#F59E0B]/8" />
          <div className="absolute -left-32 bottom-0 h-[400px] w-[400px] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-[#10B981]/8" />
        </div>

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="grid w-full items-center gap-12 lg:grid-cols-2">
            {/* Sol — metin */}
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-sm">
                <span className="text-lg">🐕</span>
                <span className="font-[family-name:var(--font-quicksand)] text-xs font-700 uppercase tracking-[0.25em] text-[#78350F]">
                  {props.city} &bull; Pet Shop
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-nunito)] text-4xl font-800 leading-tight text-[#1C1917] sm:text-5xl lg:text-6xl">
                Dostunuz İçin
                <br />
                <span className="text-[#F59E0B]">En İyisi</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="mt-6 max-w-md font-[family-name:var(--font-quicksand)] text-lg leading-relaxed text-[#57534E]">
                {props.firmName} — {suffixDe(props.city)} evcil hayvanınızın sağlığı ve mutluluğu için
                kaliteli mama, oyuncak ve bakım ürünleri.
              </motion.p>

              {/* Pet category badges */}
              <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-3">
                {['🐶 Köpek', '🐱 Kedi', '🐦 Kuş', '🐠 Akvaryum', '🐹 Kemirgen'].map((cat) => (
                  <span key={cat} className="rounded-full bg-white px-4 py-2 font-[family-name:var(--font-quicksand)] text-sm font-600 text-[#78350F] shadow-sm">
                    {cat}
                  </span>
                ))}
              </motion.div>

              <motion.div variants={fadeInUp} className="mt-8">
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="inline-flex items-center gap-2 rounded-full bg-[#F59E0B] px-8 py-4 font-[family-name:var(--font-nunito)] text-sm font-700 text-white shadow-lg shadow-[#F59E0B]/25 transition-all hover:bg-[#D97706] hover:shadow-xl"
                >
                  Ücretsiz Teklif Al
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              </motion.div>
            </motion.div>

            {/* Sağ — organic blob masked image */}
            <motion.div variants={scaleIn} initial="hidden" animate="visible" className="relative flex items-center justify-center">
              <div
                className="relative h-[420px] w-[420px] overflow-hidden"
                style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}
              >
                {heroImg ? (
                  <img src={heroImg} alt={`${props.firmName} pet shop`} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#F59E0B]/20 to-[#10B981]/20">
                    <span className="text-8xl">🐾</span>
                  </div>
                )}
              </div>
              {/* Floating accent blobs */}
              <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-[#F59E0B]/20" />
              <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-[#10B981]/20" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
            <motion.div variants={fadeInUp} className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-red-50 px-5 py-2">
              <span className="text-lg">⚠️</span>
              <span className="font-[family-name:var(--font-nunito)] text-sm font-700 text-red-700">Dikkat — Kaçırıyorsunuz</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-nunito)] text-3xl font-800 text-[#1C1917] sm:text-4xl">
              Evcil hayvan sahipleri <span className="text-red-600">online ürün araştırıyor</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-quicksand)] text-lg text-[#78716C]">
              Web siteniz yoksa sizi bulmak zorlaşıyor. Müşterileriniz online mağazası olan
              rakiplerinizi tercih ediyor.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-[#FAFDF7] py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-nunito)] text-3xl font-800 text-[#1C1917] sm:text-4xl">
              Web Siteniz <span className="text-[#10B981]">Olursa</span> / <span className="text-red-500">Olmazsa</span>
            </motion.h2>
            <div className="grid gap-6 md:grid-cols-2">
              <motion.div variants={slideFromLeft} className="rounded-2xl border-2 border-[#10B981]/20 bg-white p-8">
                <div className="mb-4 text-2xl">✅</div>
                <h3 className="mb-4 font-[family-name:var(--font-nunito)] text-lg font-700 text-[#1C1917]">Web Siteniz Olursa</h3>
                <ul className="space-y-3 font-[family-name:var(--font-quicksand)] text-sm text-[#57534E]">
                  {['Ürün kataloğu 7/24 erişilebilir', 'Google\'da "pet shop + şehir" aramasında çıkarsınız', 'Mama markaları ve fiyatlar görünür', 'Veteriner işbirliği bilgisi güven verir', 'Online sipariş/teslimat alırsınız'].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.5 text-[#10B981]">●</span> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div variants={slideFromRight} className="rounded-2xl border border-red-100 bg-red-50/50 p-8">
                <div className="mb-4 text-2xl">❌</div>
                <h3 className="mb-4 font-[family-name:var(--font-nunito)] text-lg font-700 text-[#1C1917]">Web Siteniz Olmazsa</h3>
                <ul className="space-y-3 font-[family-name:var(--font-quicksand)] text-sm text-[#57534E]">
                  {['Müşteriler ürün çeşitliliğinizi göremez', 'Online mağazalara müşteri kaptırırsınız', 'Kampanya duyuruları ulaşmaz', 'Sadece fiziksel trafiğe bağımlı kalırsınız', 'Marka güveni oluşturamazsınız'].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.5 text-red-400">●</span> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ÜRÜN GÖRSELİ ═══════════════════ */}
      {productsImg && (
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="overflow-hidden rounded-2xl">
              <img src={productsImg} alt={`${props.firmName} ürünler`} className="w-full object-cover" style={{ aspectRatio: '4/3' }} />
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="bg-[#78350F] py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-nunito)] text-3xl font-800 text-white sm:text-4xl">
              {props.firmName} İçin
              <br />
              <span className="text-[#FDE68A]">Profesyonel Web Sitenizi Oluşturalım</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-quicksand)] text-white/70">
              Ücretsiz demo ile farkı görün — taahhüt yok, baskı yok.
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-8">
              <a
                href={chatLink}
                onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                className="inline-flex items-center gap-2 rounded-full bg-[#F59E0B] px-10 py-4 font-[family-name:var(--font-nunito)] text-sm font-700 text-white transition-all hover:bg-[#D97706]"
              >
                Ücretsiz Teklif Al
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div variants={scaleIn} className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F59E0B]/10">
              <span className="text-2xl">🔒</span>
            </motion.div>
            <motion.h3 variants={fadeInUp} className="font-[family-name:var(--font-nunito)] text-lg font-700 text-[#1C1917]">
              Taahhüt Yok, Risk Yok
            </motion.h3>
            <motion.p variants={fadeInUp} className="mt-2 font-[family-name:var(--font-quicksand)] text-sm text-[#78716C]">
              Demo tamamen ücretsizdir. Beğenmezseniz hiçbir ödeme yapmazsınız.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="border-t border-[#E5E7EB] py-8">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="font-[family-name:var(--font-quicksand)] text-xs text-[#94A3B8]">
            © {new Date().getFullYear()} Vorte Studio — {props.firmName} için özel olarak hazırlanmıştır.
          </p>
        </div>
      </footer>
    </div>
  )
}
