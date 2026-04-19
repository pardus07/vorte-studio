'use client'

import { Cormorant_Garamond, Karla } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { suffixDe, suffixIn } from './turkish-grammar'
import { useTrackPageView, trackEvent } from './use-track'

const cormorant = Cormorant_Garamond({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
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

export default function MobilyaTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const showroomImg = props.images?.showroom

  return (
    <div className={`${cormorant.variable} ${karla.variable} min-h-screen bg-[#FAFAF9] text-[#292524]`}>
      {/* ═══════════════════ HERO — Editorial Magazine: tam görsel + alt kısımda örtüşen beyaz kart ═══════════════════ */}
      <section className="relative">
        {/* Full-width background image */}
        <div className="relative h-[75vh] min-h-[500px] w-full overflow-hidden bg-[#E7E5E4]">
          {heroImg ? (
            <>
              <img src={heroImg} alt={`${props.firmName} mobilya`} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />
            </>
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#D6CFC7] to-[#A8A29E]">
              <span className="font-[family-name:var(--font-cormorant)] text-8xl text-white/20">🛋️</span>
            </div>
          )}

          {/* Top bar — brand badge */}
          <div className="absolute left-0 right-0 top-0 z-10 px-6 pt-6">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-block bg-white/90 px-4 py-2 font-[family-name:var(--font-karla)] text-xs font-600 uppercase tracking-[0.3em] text-[#292524] backdrop-blur-sm">
                {props.city} &bull; Mobilya & Dekorasyon
              </span>
            </motion.div>
          </div>
        </div>

        {/* Overlapping white card — magazine editorial style */}
        <div className="relative z-10 mx-auto -mt-32 max-w-4xl px-4 sm:px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="bg-white px-8 py-12 shadow-2xl shadow-black/5 sm:px-14 sm:py-16"
          >
            {/* Wood-tone accent bar */}
            <motion.div variants={fadeInUp} className="mb-8 h-1 w-16 bg-[#8B6914]" />

            <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-cormorant)] text-4xl font-700 leading-[1.15] text-[#292524] sm:text-5xl lg:text-6xl">
              Evinizi Yansıtan
              <br />
              <span className="text-[#8B6914]">Mobilyalar</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="mt-6 max-w-xl font-[family-name:var(--font-karla)] text-lg leading-relaxed text-[#78716C]">
              {props.firmName} — {suffixDe(props.city)} yaşam alanlarınıza değer katan,
              kaliteli ve şık mobilya koleksiyonları. Showroom&apos;umuzu keşfedin.
            </motion.p>

            {/* Category tags */}
            <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-3">
              {['Oturma Grupları', 'Yatak Odası', 'Yemek Odası', 'Ofis Mobilyası', 'Bahçe'].map((cat) => (
                <span key={cat} className="border border-[#D6D3D1] px-4 py-2 font-[family-name:var(--font-karla)] text-xs font-500 text-[#57534E]">
                  {cat}
                </span>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-10">
              <a
                href={chatLink}
                onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                className="inline-flex items-center gap-2 bg-[#292524] px-8 py-4 font-[family-name:var(--font-karla)] text-sm font-600 uppercase tracking-wider text-white transition-all hover:bg-[#1C1917]"
              >
                Ücretsiz Teklif Al
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
            <motion.div variants={fadeInUp} className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-red-50 px-5 py-2">
              <span className="text-lg">⚠️</span>
              <span className="font-[family-name:var(--font-karla)] text-sm font-600 text-red-700">Dikkat — Kaçırıyorsunuz</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-cormorant)] text-3xl font-700 text-[#292524] sm:text-4xl">
              Mobilya arayanlar önce <span className="text-red-600">online katalog</span> geziyor
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-karla)] text-lg text-[#78716C]">
              Ürünleriniz online değilse mağazanıza gelme motivasyonu yok.
              Web siteniz olmazsa müşteriler rakiplerinizin katalogunu inceliyor.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-cormorant)] text-3xl font-700 text-[#292524] sm:text-4xl">
              Web Siteniz <span className="text-[#8B6914]">Olursa</span> / <span className="text-red-500">Olmazsa</span>
            </motion.h2>
            <div className="grid gap-6 md:grid-cols-2">
              <motion.div variants={slideFromLeft} className="rounded-2xl border-2 border-[#8B6914]/20 bg-[#FEFDF8] p-8">
                <div className="mb-4 text-2xl">✅</div>
                <h3 className="mb-4 font-[family-name:var(--font-cormorant)] text-xl font-700 text-[#292524]">Web Siteniz Olursa</h3>
                <ul className="space-y-3 font-[family-name:var(--font-karla)] text-sm text-[#57534E]">
                  {['Online katalogla 7/24 ürün sergilersiniz', 'Google\'da "mobilya + şehir" aramasında çıkarsınız', 'Taksit ve kampanya bilgileri anında ulaşır', 'Ücretsiz keşif/ölçüm hizmeti tanıtırsınız', 'Mağaza ziyaretçisi katlanarak artar'].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.5 text-[#8B6914]">●</span> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div variants={slideFromRight} className="rounded-2xl border border-red-100 bg-red-50/50 p-8">
                <div className="mb-4 text-2xl">❌</div>
                <h3 className="mb-4 font-[family-name:var(--font-cormorant)] text-xl font-700 text-[#292524]">Web Siteniz Olmazsa</h3>
                <ul className="space-y-3 font-[family-name:var(--font-karla)] text-sm text-[#57534E]">
                  {['Müşteriler ürünlerinizi göremez', 'Sadece mağazaya gelenlerle sınırlı kalırsınız', 'Rakipler online öne geçer', 'Kampanya duyuruları ulaşmaz', 'Marka bilinirliğiniz yerel kalır'].map((item) => (
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

      {/* ═══════════════════ SHOWROOM GÖRSELİ ═══════════════════ */}
      {showroomImg && (
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="overflow-hidden">
              <img src={showroomImg} alt={`${props.firmName} showroom`} className="w-full object-cover" style={{ aspectRatio: '4/3' }} />
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="bg-[#292524] py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-cormorant)] text-3xl font-700 text-white sm:text-4xl">
              {props.firmName} İçin
              <br />
              <span className="text-[#D4AF37]">Profesyonel Web Sitenizi Oluşturalım</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-karla)] text-white/60">
              Online katalog, taksit bilgisi, keşif randevusu — hepsi tek sitede.
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-8">
              <a
                href={chatLink}
                onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                className="inline-flex items-center gap-2 bg-[#D4AF37] px-10 py-4 font-[family-name:var(--font-karla)] text-sm font-600 uppercase tracking-wider text-[#292524] transition-all hover:bg-[#C5A028]"
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
            <motion.div variants={scaleIn} className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#8B6914]/10">
              <span className="text-2xl">🔒</span>
            </motion.div>
            <motion.h3 variants={fadeInUp} className="font-[family-name:var(--font-cormorant)] text-xl font-700 text-[#292524]">
              Taahhüt Yok, Risk Yok
            </motion.h3>
            <motion.p variants={fadeInUp} className="mt-2 font-[family-name:var(--font-karla)] text-sm text-[#78716C]">
              Demo tamamen ücretsizdir. Beğenmezseniz hiçbir ödeme yapmazsınız.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="border-t border-[#E7E5E4] py-8">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="font-[family-name:var(--font-karla)] text-xs text-[#A8A29E]">
            © {new Date().getFullYear()} Vorte Studio — {props.firmName} için özel olarak hazırlanmıştır.
          </p>
        </div>
      </footer>
    </div>
  )
}
