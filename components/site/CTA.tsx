"use client";

import { useState } from "react";
import RevealSection from "./RevealSection";
import ContactForm from "./ContactForm";

export default function CTA() {
  const [showForm, setShowForm] = useState(false);

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-border px-6 py-24 text-center md:px-12 md:py-32"
    >
      {/* Glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2"
        style={{
          width: 800,
          height: 400,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(ellipse, rgba(255,69,0,0.06) 0%, transparent 70%)",
        }}
      />

      <RevealSection>
        <div className="mb-6 flex items-center justify-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
          <span className="h-px w-8 bg-accent" />
          Başlayalım
          <span className="h-px w-8 bg-accent" />
        </div>
      </RevealSection>

      <RevealSection delay={100}>
        <h2 className="font-[family-name:var(--font-syne)] text-[clamp(36px,5vw,72px)] font-extrabold leading-none tracking-[-0.04em]">
          Projenizi
          <br />
          Hayata Geçirelim
        </h2>
      </RevealSection>

      <RevealSection delay={200}>
        <p className="mt-5 text-base text-muted">
          Ücretsiz keşif görüşmesi — taahhütsüz, bütçesiz, sadece fikir.
        </p>
      </RevealSection>

      <RevealSection
        delay={300}
        className="mt-12 flex flex-wrap items-center justify-center gap-4"
      >
        <a
          href="https://wa.me/90XXXXXXXXXX"
          className="inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-[15px] font-medium text-white transition-all hover:-translate-y-0.5"
          style={{ background: "#25D366" }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp ile Yaz
        </a>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-[15px] font-medium text-white transition-all hover:-translate-y-0.5"
          style={{ background: "#f97316" }}
        >
          Teklif Formu &rarr;
        </button>
        <a
          href="mailto:studio@vorte.com.tr"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-transparent px-7 py-3.5 text-[15px] text-text transition-all hover:bg-bg2"
        >
          studio@vorte.com.tr
        </a>
      </RevealSection>

      {showForm && <ContactForm onClose={() => setShowForm(false)} />}
    </section>
  );
}
