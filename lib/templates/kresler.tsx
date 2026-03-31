'use client'

import { Nunito, Quicksand } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const nunito = Nunito({
  subsets: ['latin-ext'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-nunito',
  display: 'swap',
})

const quicksand = Quicksand({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600', '700'],
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

export default function KreslerTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const galleryImg = props.images?.gallery

  return (
    <div className={`${nunito.variable} ${quicksand.variable} min-h-screen bg-white text-[#1E293B]`}>
      {/* ═══════════════════ HERO — Rainbow Blocks ═══════════════════ */}
      <section className="relative overflow-hidden pb-20 pt-16">
        {/* Colorful confetti dots */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(#FEF08A 2px, transparent 2px), radial-gradient(#86EFAC 2px, transparent 2px), radial-gradient(#FCA5A5 2px, transparent 2px)', backgroundSize: '60px 60px, 45px 45px, 55px 55px', backgroundPosition: '0 0, 20px 30px, 40px 10px' }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
          >
            <div className="space-y-8">
              <motion.div variants={fadeInUp} className="flex items-center gap-3">
                <span className="text-2xl">🧒</span>
                <span className="font-[family-name:var(--font-quicksand)] text-sm font-700 uppercase tracking-[0.2em] text-[#7C3AED]">
                  {props.city} &bull; Kreş & Anaokulu
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-nunito)] text-4xl font-800 leading-tight sm:text-5xl lg:text-6xl">
                Minikleriniz İçin
                <br />
                <span className="bg-gradient-to-r from-[#EAB308] via-[#22C55E] to-[#7C3AED] bg-clip-text text-transparent">Güvenli & Mutlu</span> Dünya
              </motion.h1>

              <motion.p variants={fadeInUp} className="max-w-md font-[family-name:var(--font-quicksand)] text-lg leading-relaxed text-[#1E293B]/60">
                <strong className="text-[#1E293B]">{props.firmName}</strong> — eğitici oyunlar,
                güvenli ortam ve sevgi dolu eğitmenlerle çocuğunuz güvende.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 rounded-full bg-[#7C3AED] px-8 py-4 font-[family-name:var(--font-nunito)] text-base font-700 text-white shadow-lg transition-all hover:bg-[#6D28D9] hover:shadow-xl"
                >
                  Ücretsiz Teklif Al
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              {(props.googleRating || props.googleReviews) && (
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 rounded-2xl border border-[#7C3AED]/10 bg-[#FAF5FF]/80 px-5 py-3 backdrop-blur-sm">
                  <div className="flex gap-0.5 text-[#EAB308]">
                    {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <span className="font-[family-name:var(--font-quicksand)] text-sm font-700 text-[#1E293B]">
                    {props.googleRating} ({props.googleReviews}+ yorum)
                  </span>
                </motion.div>
              )}
            </div>

            {/* Sağ — Rainbow block frame */}
            <motion.div variants={scaleIn} className="relative">
              <div className="relative overflow-hidden rounded-[2rem] border-4 border-[#EAB308]/30 bg-[#FEF9C3]/20 shadow-2xl">
                <div className="aspect-[4/3]">
                  {heroImg ? (
                    <img src={heroImg} alt={`${props.firmName} kreş`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#FEF08A]/20 via-[#86EFAC]/20 to-[#FCA5A5]/20">
                      <div className="text-center">
                        <div className="text-6xl">🧒</div>
                        <p className="mt-3 font-[family-name:var(--font-quicksand)] text-sm text-[#7C3AED]/40">Kreş Görseli</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Floating toy badges */}
              <div className="absolute -right-2 top-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FCA5A5] text-2xl shadow-lg">🎨</div>
              <div className="absolute -left-2 bottom-12 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#86EFAC] text-xl shadow-lg">🧩</div>
              <div className="absolute -bottom-2 right-16 flex h-12 w-12 items-center justify-center rounded-full bg-[#FEF08A] text-xl shadow-lg">⭐</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#7C3AED] py-20 text-white">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-nunito)]">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-nunito)] text-3xl font-800 sm:text-4xl">
            Kreş Araştıran Ebeveynler
            <br />
            <span className="text-[#FEF08A]">En Az 5-6 Kreşi Karşılaştırıyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-quicksand)] text-lg text-white/70">
            Kreş araştıran ebeveynlerin <strong className="text-white">%82&apos;si</strong> online
            karşılaştırma yapıyor. Web siteniz yoksa listede yoksunuz.
          </motion.p>

          {galleryImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden rounded-2xl">
              <img src={galleryImg} alt={`${props.firmName} galeri`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '👨‍👩‍👧', stat: '%82', text: 'Online araştırma yapıyor' },
              { emoji: '📸', stat: '%76', text: 'Fotoğraf görmek istiyor' },
              { emoji: '⭐', stat: '%91', text: 'Yorumları okuyor' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-nunito)] text-2xl font-800 text-[#FEF08A]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-quicksand)] text-sm text-white/60">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-nunito)] text-3xl font-800 sm:text-4xl">
            Web Sitesi <span className="text-[#7C3AED]">Olan</span> vs <span className="text-[#1E293B]/30">Olmayan</span> Kreş
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="rounded-2xl border border-[#7C3AED]/20 bg-[#FAF5FF] p-8">
              <div className="mb-4 font-[family-name:var(--font-nunito)] text-lg font-700 text-[#7C3AED]">✅ Web Sitesi Olan Kreş</div>
              <ul className="space-y-3 font-[family-name:var(--font-quicksand)] text-[#1E293B]/80">
                {['Ortam fotoğrafları güven veriyor', 'Eğitim programı online görünüyor', 'Google\'da "kreş" aramasında üst sırada', 'Online kayıt talepleri artıyor', 'Veli yorumları yeni aileleri çekiyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-[#7C3AED]">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="rounded-2xl border border-[#1E293B]/5 bg-[#1E293B]/[0.02] p-8">
              <div className="mb-4 font-[family-name:var(--font-nunito)] text-lg font-700 text-[#1E293B]/30">❌ Web Sitesi Olmayan Kreş</div>
              <ul className="space-y-3 font-[family-name:var(--font-quicksand)] text-[#1E293B]/40">
                {['Ortam görülmüyor — güven düşük', 'Sadece çevreden öğrenci', 'Arama sonuçlarında görünmüyor', 'Kayıt sadece yüz yüze', 'Rakipler online öne çıkıyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#FAF5FF] py-24">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="text-4xl">🧒</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-nunito)] text-3xl font-800 sm:text-4xl lg:text-5xl">
            Kreşinizi <span className="text-[#7C3AED]">Dijitale Taşıyalım</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-quicksand)] text-lg text-[#1E293B]/60">
            Taahhüt yok, zorlama yok — {props.firmName} için özel hazırlanmış profesyonel kreş web sitesi teklifi.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 rounded-full bg-[#7C3AED] px-10 py-5 font-[family-name:var(--font-nunito)] text-lg font-700 text-white shadow-xl transition-all hover:bg-[#6D28D9] hover:shadow-2xl">
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-[#7C3AED]/10 py-16">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: '🧒', title: 'Ücretsiz Danışmanlık', desc: 'İlk görüşme ve analiz tamamen ücretsiz.' },
            { icon: '⚡', title: '48 Saat Teslimat', desc: 'Profesyonel kreş web siteniz 48 saat içinde hazır.' },
            { icon: '📱', title: 'Online Kayıt', desc: 'Veliler online başvuru yapabilir.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="rounded-2xl border border-[#7C3AED]/10 bg-[#FAF5FF]/60 p-6 text-center">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-nunito)] text-base font-700 text-[#7C3AED]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-quicksand)] text-sm text-[#1E293B]/50">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-[#7C3AED]/10 py-8 text-center font-[family-name:var(--font-quicksand)] text-sm text-[#1E293B]/30">
        <p>Bu sayfa <strong className="text-[#1E293B]/50">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
