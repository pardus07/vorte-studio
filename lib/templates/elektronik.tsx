'use client'

import { Poppins, Inter } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const poppins = Poppins({
  subsets: ['latin-ext'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
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

export default function ElektronikTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const productsImg = props.images?.products

  const categories = [
    { icon: '📱', name: 'Telefon & Tablet', desc: 'En yeni modeller' },
    { icon: '💻', name: 'Bilgisayar', desc: 'Laptop & masaüstü' },
    { icon: '🎧', name: 'Ses & Görüntü', desc: 'TV, kulaklık, hoparlör' },
    { icon: '🎮', name: 'Gaming', desc: 'Konsol & aksesuar' },
  ]

  return (
    <div className={`${poppins.variable} ${inter.variable} min-h-screen bg-[#0F172A] text-white`}>
      {/* ═══════════════════ HERO — Floating Tech Cards + Glow Grid ═══════════════════ */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Circuit board pattern background */}
        <div className="pointer-events-none absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(59,130,246,0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 30%, rgba(59,130,246,0.06) 0%, transparent 40%),
            linear-gradient(rgba(59,130,246,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 50px 50px, 50px 50px',
        }} />

        {/* Hero image as subtle background */}
        {heroImg && (
          <div className="absolute inset-0">
            <img src={heroImg} alt={`${props.firmName} elektronik`} className="h-full w-full object-cover" style={{ opacity: 0.1 }} />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/80 via-[#0F172A]/60 to-[#0F172A]" />
          </div>
        )}

        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Sol — metin */}
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/10 px-4 py-1.5 backdrop-blur-sm">
                <div className="h-2 w-2 animate-pulse rounded-full bg-[#3B82F6]" />
                <span className="font-[family-name:var(--font-inter)] text-xs font-500 text-[#93C5FD]">
                  {props.city} &bull; Elektronik Mağazası
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-poppins)] text-4xl font-700 leading-tight sm:text-5xl lg:text-6xl">
                En İyi Fiyat,
                <br />
                <span className="bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] bg-clip-text text-transparent">
                  En Hızlı Servis
                </span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="mt-6 max-w-lg font-[family-name:var(--font-inter)] text-lg leading-relaxed text-white/60">
                {props.firmName} — {props.city}&apos;de teknoloji ihtiyaçlarınız için güvenilir adres.
                Garanti, servis ve teknik destek tek çatı altında.
              </motion.p>

              <motion.div variants={fadeInUp} className="mt-8">
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#3B82F6] px-8 py-4 font-[family-name:var(--font-inter)] text-sm font-600 text-white transition-all hover:bg-[#2563EB] hover:shadow-lg hover:shadow-[#3B82F6]/25"
                >
                  Ücretsiz Teklif Al
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              </motion.div>
            </motion.div>

            {/* Sağ — floating category cards */}
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 gap-4">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.name}
                  variants={scaleIn}
                  className="group rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-[#3B82F6]/40 hover:bg-[#3B82F6]/10"
                  style={{ transform: i % 2 === 1 ? 'translateY(20px)' : 'translateY(0)' }}
                >
                  <div className="mb-3 text-3xl">{cat.icon}</div>
                  <h3 className="font-[family-name:var(--font-poppins)] text-sm font-600 text-white">{cat.name}</h3>
                  <p className="mt-1 font-[family-name:var(--font-inter)] text-xs text-white/40">{cat.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="border-t border-white/5 bg-[#0F172A] py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
            <motion.div variants={fadeInUp} className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-red-500/10 px-5 py-2">
              <span className="text-lg">⚠️</span>
              <span className="font-[family-name:var(--font-inter)] text-sm font-600 text-red-400">Dikkat — Kaçırıyorsunuz</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-poppins)] text-3xl font-700 text-white sm:text-4xl">
              Elektronik arayanlar önce <span className="text-red-400">fiyat karşılaştırıyor</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-inter)] text-lg text-white/50">
              Stoğunuz ve fiyatlarınız online değilse rakibiniz satıyor.
              Kendi web sitenizle müşteriye doğrudan ulaşın.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-[#1E293B] py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-poppins)] text-3xl font-700 text-white sm:text-4xl">
              Web Siteniz <span className="text-[#3B82F6]">Olursa</span> / <span className="text-red-400">Olmazsa</span>
            </motion.h2>
            <div className="grid gap-6 md:grid-cols-2">
              <motion.div variants={slideFromLeft} className="rounded-2xl border border-[#3B82F6]/20 bg-[#3B82F6]/5 p-8">
                <div className="mb-4 text-2xl">✅</div>
                <h3 className="mb-4 font-[family-name:var(--font-poppins)] text-lg font-600 text-white">Web Siteniz Olursa</h3>
                <ul className="space-y-3 font-[family-name:var(--font-inter)] text-sm text-white/70">
                  {['Ürün ve fiyatlar 7/24 online', 'Google\'da "elektronik + şehir" aramasında çıkarsınız', 'Garanti ve servis bilgisi güven oluşturur', 'Online sipariş/rezervasyon alırsınız', 'Kampanya duyuruları anında ulaşır'].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.5 text-[#3B82F6]">●</span> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div variants={slideFromRight} className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8">
                <div className="mb-4 text-2xl">❌</div>
                <h3 className="mb-4 font-[family-name:var(--font-poppins)] text-lg font-600 text-white">Web Siteniz Olmazsa</h3>
                <ul className="space-y-3 font-[family-name:var(--font-inter)] text-sm text-white/70">
                  {['Fiyat karşılaştırmasında görünmezsiniz', 'Müşteriler rakip mağazaya yönelir', 'Stok bilgisi paylaşamazsınız', 'Teknik destek güvencesi iletemezsiniz', 'Online satış fırsatını kaçırırsınız'].map((item) => (
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
            <motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="overflow-hidden rounded-2xl border border-white/10">
              <img src={productsImg} alt={`${props.firmName} ürünler`} className="w-full object-cover" style={{ aspectRatio: '4/3' }} />
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="bg-gradient-to-b from-[#0F172A] to-[#1E293B] py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-poppins)] text-3xl font-700 text-white sm:text-4xl">
              {props.firmName} İçin
              <br />
              <span className="bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] bg-clip-text text-transparent">Profesyonel Web Sitenizi Oluşturalım</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-inter)] text-white/50">
              Ücretsiz demo ile farkı görün — taahhüt yok, baskı yok.
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-8">
              <a
                href={chatLink}
                onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                className="inline-flex items-center gap-2 rounded-lg bg-[#3B82F6] px-10 py-4 font-[family-name:var(--font-inter)] text-sm font-600 text-white transition-all hover:bg-[#2563EB] hover:shadow-lg hover:shadow-[#3B82F6]/25"
              >
                Ücretsiz Teklif Al
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="bg-[#0F172A] py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div variants={scaleIn} className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#3B82F6]/10">
              <span className="text-2xl">🔒</span>
            </motion.div>
            <motion.h3 variants={fadeInUp} className="font-[family-name:var(--font-poppins)] text-lg font-600 text-white">
              Taahhüt Yok, Risk Yok
            </motion.h3>
            <motion.p variants={fadeInUp} className="mt-2 font-[family-name:var(--font-inter)] text-sm text-white/40">
              Demo tamamen ücretsizdir. Beğenmezseniz hiçbir ödeme yapmazsınız.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="border-t border-white/5 bg-[#0F172A] py-8">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="font-[family-name:var(--font-inter)] text-xs text-white/30">
            © {new Date().getFullYear()} Vorte Studio — {props.firmName} için özel olarak hazırlanmıştır.
          </p>
        </div>
      </footer>
    </div>
  )
}
