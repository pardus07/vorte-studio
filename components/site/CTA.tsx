"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import ContactForm from "./ContactForm";

export default function CTA({ whatsappNumber }: { whatsappNumber?: string }) {
  const [showForm, setShowForm] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      id="contact"
      className="relative overflow-hidden border-t border-border px-6 py-28 text-center md:px-12 md:py-40"
    >
      {/* Animated background orbs */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2"
        aria-hidden="true"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.06, 0.1, 0.06],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: 900,
          height: 500,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(ellipse, rgba(255,69,0,0.08) 0%, transparent 70%)",
        }}
      />
      <motion.div
        className="pointer-events-none absolute right-0 top-0"
        aria-hidden="true"
        animate={{
          x: [0, -30, 0],
          y: [0, 20, 0],
          opacity: [0.03, 0.06, 0.03],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: 500,
          height: 500,
          background:
            "radial-gradient(circle, rgba(255,69,0,0.05) 0%, transparent 60%)",
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-3xl">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-6 flex items-center justify-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent"
        >
          <motion.span
            className="h-px bg-accent"
            initial={{ width: 0 }}
            animate={inView ? { width: 32 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          />
          Başlayalım
          <motion.span
            className="h-px bg-accent"
            initial={{ width: 0 }}
            animate={inView ? { width: 32 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          />
        </motion.div>

        {/* Heading with word-by-word reveal */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-[family-name:var(--font-syne)] text-[clamp(36px,5vw,72px)] font-extrabold leading-none tracking-[-0.04em]"
        >
          Projenizi
          <br />
          <span className="relative">
            Hayata Geçirelim
            <motion.span
              className="absolute -bottom-2 left-0 h-1 rounded-full bg-accent"
              initial={{ width: "0%" }}
              animate={inView ? { width: "100%" } : {}}
              transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
            />
          </span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-6 text-base leading-relaxed text-muted md:text-lg"
        >
          Ücretsiz keşif görüşmesi — taahhütsüz, bütçesiz, sadece fikir.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.45, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          {whatsappNumber && (
            <motion.a
              href={`https://wa.me/${whatsappNumber}`}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2.5 rounded-xl px-8 py-4 text-[15px] font-semibold text-white shadow-lg shadow-[#25D366]/20 transition-shadow hover:shadow-xl hover:shadow-[#25D366]/30"
              style={{ background: "#25D366" }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Ücretsiz Teklif Al
            </motion.a>
          )}
          <motion.button
            onClick={() => setShowForm(true)}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-xl bg-accent px-8 py-4 text-[15px] font-semibold text-white shadow-lg shadow-accent/20 transition-shadow hover:shadow-xl hover:shadow-accent/30"
          >
            {/* Shine sweep */}
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative">Ücretsiz Teklif Al</span>
            <svg className="relative h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 8h10M10 4l4 4-4 4" />
            </svg>
          </motion.button>
          <motion.a
            href="mailto:studio@vorte.com.tr"
            whileHover={{ scale: 1.02 }}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-transparent px-7 py-4 text-[15px] text-muted transition-all hover:border-accent/30 hover:text-white"
          >
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="14" height="10" rx="2" />
              <path d="M1 5l7 4 7-4" />
            </svg>
            studio@vorte.com.tr
          </motion.a>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-6 text-[11px] text-muted2"
        >
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            7/24 Destek
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Ücretsiz Keşif Görüşmesi
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            Taahhütsüz Teklif
          </span>
        </motion.div>
      </div>

      {showForm && <ContactForm onClose={() => setShowForm(false)} />}
    </section>
  );
}
