'use client'

import { Libre_Baskerville, Karla } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin-ext'],
  weight: ['400', '700'],
  variable: '--font-libre',
  display: 'swap',
})

const karla = Karla({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600', '700'],
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

export default function SarkuteriTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const productsImg = props.images?.products

  return (
    <div className={`${libreBaskerville.variable} ${karla.variable} min-h-screen bg-[#1C1917] text-[#FAFAF5]`}>
      {/* ═══════════════════ HERO — Dark Premium Floating Cards ═══════════════════ */}
      <section className="relative overflow-hidden pb-20 pt-16">
        {/* Amber glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #F59E0B 0%, transparent 70%)' }}
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
                <span className="text-2xl">🧀</span>
                <span className="font-[family-name:var(--font-karla)] text-sm font-600 uppercase tracking-[0.2em] text-[#F59E0B]">
                  {props.city} &bull; Gurme Şarküteri
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-libre)] text-4xl font-700 leading-tight sm:text-5xl lg:text-[3.5rem]">
                Gurme <span className="text-[#F59E0B]">Lezzetler</span>
                <br />
                Kapınıza Geliyor
              </motion.h1>

              <motion.p variants={fadeInUp} className="max-w-md font-[family-name:var(--font-karla)] text-lg leading-relaxed text-[#FAFAF5]/50">
                <strong className="text-[#FAFAF5]">{props.firmName}</strong> — ithal peynirler,
                el yapımı charcuterie, premium zeytinyağları ve özenle seçilmiş gurme ürünler.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 rounded-full bg-[#F59E0B] px-8 py-4 font-[family-name:var(--font-karla)] text-base font-700 text-[#1C1917] shadow-lg transition-all hover:bg-[#D97706] hover:shadow-xl"
                >
                  Ücretsiz Teklif Al
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              {(props.googleRating || props.googleReviews) && (
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 rounded-2xl border border-[#F59E0B]/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
                  <div className="flex gap-0.5 text-[#F59E0B]">
                    {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <span className="font-[family-name:var(--font-karla)] text-sm font-700 text-[#FAFAF5]">
                    {props.googleRating} ({props.googleReviews}+ yorum)
                  </span>
                </motion.div>
              )}
            </div>

            {/* Sağ — Premium floating product card */}
            <motion.div variants={scaleIn} className="relative">
              <div className="relative overflow-hidden rounded-3xl border border-[#F59E0B]/20 bg-[#292524] shadow-2xl">
                <div className="aspect-[4/3]">
                  {heroImg ? (
                    <img src={heroImg} alt={`${props.firmName} gurme ürünler`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl">🧀</div>
                        <p className="mt-3 font-[family-name:var(--font-karla)] text-sm text-[#FAFAF5]/30">Şarküteri Görseli</p>
                      </div>
                    </div>
                  )}
                </div>
                {/* Amber accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent" />
              </div>
              {/* Floating badges */}
              <div className="absolute -right-2 top-8 rounded-xl bg-[#DC2626] px-3 py-1.5 font-[family-name:var(--font-karla)] text-xs font-700 text-white shadow-lg">Premium</div>
              <div className="absolute -left-2 bottom-10 rounded-xl bg-[#F59E0B] px-3 py-1.5 font-[family-name:var(--font-karla)] text-xs font-700 text-[#1C1917] shadow-lg">İthal</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#DC2626] py-20 text-white">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-4xl px-4 text-center sm:px-6"
        >
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-libre)]">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-libre)] text-3xl font-700 sm:text-4xl">
            İthal Ürün Arayanlar
            <br />
            <span className="text-[#FDE68A]">Önce Online Buluyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-karla)] text-lg text-white/70">
            İthal ürün araştıranların <strong className="text-white">%67&apos;si</strong> önce online
            araştırıyor. Web siteniz yoksa sizi bulamıyorlar — rakibinize gidiyorlar.
          </motion.p>

          {productsImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden rounded-2xl">
              <img src={productsImg} alt={`${props.firmName} ürünler`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '🧀', stat: '%67', text: 'Online ürün araştırıyor' },
              { emoji: '🚚', stat: '%52', text: 'Eve teslimat istiyor' },
              { emoji: '🎁', stat: '%41', text: 'Hediye sepeti arıyor' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-libre)] text-2xl font-700 text-[#FDE68A]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-karla)] text-sm text-white/60">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-[#292524] py-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-5xl px-4 sm:px-6"
        >
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-libre)] text-3xl font-700 sm:text-4xl">
            Web Sitesi <span className="text-[#F59E0B]">Olan</span> vs <span className="text-[#FAFAF5]/30">Olmayan</span> Şarküteri
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="rounded-2xl border border-[#F59E0B]/20 bg-[#F59E0B]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-libre)] text-lg font-700 text-[#F59E0B]">✅ Web Sitesi Olan Şarküteri</div>
              <ul className="space-y-3 font-[family-name:var(--font-karla)] text-[#FAFAF5]/70">
                {['Ürün katalogu online — müşteri seçerek geliyor', 'Hediye sepeti siparişleri artıyor', 'Google\'da "şarküteri" aramasında üst sırada', 'İthal ürün meraklıları buluyor', 'Kurumsal müşteriler online sipariş veriyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-[#F59E0B]">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="rounded-2xl border border-[#FAFAF5]/5 bg-[#FAFAF5]/[0.02] p-8">
              <div className="mb-4 font-[family-name:var(--font-libre)] text-lg font-700 text-[#FAFAF5]/30">❌ Web Sitesi Olmayan Şarküteri</div>
              <ul className="space-y-3 font-[family-name:var(--font-karla)] text-[#FAFAF5]/30">
                {['Ürün çeşitleri bilinmiyor', 'Sadece çevreden müşteri', 'Arama sonuçlarında görünmüyor', 'İthal ürün satışı düşük', 'Online sipariş gelmiyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1C1917] to-[#292524] py-24">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="text-4xl">🧀</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-libre)] text-3xl font-700 sm:text-4xl lg:text-5xl">
            Şarküteriinizi <span className="text-[#F59E0B]">Dijitale Taşıyalım</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-karla)] text-lg text-[#FAFAF5]/50">
            Taahhüt yok, zorlama yok — {props.firmName} için özel hazırlanmış profesyonel web sitesi teklifi.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 rounded-full bg-[#F59E0B] px-10 py-5 font-[family-name:var(--font-karla)] text-lg font-700 text-[#1C1917] shadow-xl transition-all hover:bg-[#D97706] hover:shadow-2xl">
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-[#F59E0B]/10 py-16">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: '🧀', title: 'Ücretsiz Danışmanlık', desc: 'İlk görüşme ve analiz tamamen ücretsiz.' },
            { icon: '⚡', title: '48 Saat Teslimat', desc: 'Profesyonel web siteniz 48 saat içinde hazır.' },
            { icon: '📱', title: 'Online Sipariş', desc: 'Müşterileriniz online sipariş verebilir.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="rounded-2xl border border-[#F59E0B]/10 bg-[#292524] p-6 text-center">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-libre)] text-base font-700 text-[#F59E0B]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-karla)] text-sm text-[#FAFAF5]/40">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-[#F59E0B]/10 py-8 text-center font-[family-name:var(--font-karla)] text-sm text-[#FAFAF5]/20">
        <p>Bu sayfa <strong className="text-[#FAFAF5]/40">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
