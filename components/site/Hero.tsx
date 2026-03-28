"use client";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 md:px-12">
      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

      {/* Glow */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: 600,
          height: 600,
          top: -100,
          right: -100,
          background:
            "radial-gradient(circle, rgba(255,69,0,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Tag */}
      <p
        style={{
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.18em",
          textTransform: "uppercase" as const,
          color: "var(--color-accent)",
          marginBottom: 32,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span
          style={{ width: 32, height: 1, background: "var(--color-accent)" }}
        />
        Dijital Stüdyo
      </p>

      {/* Title */}
      <h1
        style={{
          fontFamily: "var(--font-syne)",
          fontSize: "clamp(48px, 8vw, 110px)",
          fontWeight: 800,
          lineHeight: 0.92,
          letterSpacing: "-0.04em",
          marginBottom: 36,
          maxWidth: 900,
        }}
      >
        <span style={{ display: "block" }}>Dijital Dünyada</span>
        <span
          style={{
            display: "block",
            WebkitTextStroke: "2px rgba(255,255,255,0.2)",
            color: "transparent",
          }}
        >
          Fark Yaratan
        </span>
        <span style={{ display: "block" }}>
          Deneyimler
          <span style={{ color: "var(--color-accent)" }}>.</span>
        </span>
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontSize: 16,
          color: "var(--color-muted)",
          maxWidth: 480,
          lineHeight: 1.7,
          marginBottom: 48,
        }}
      >
        Next.js, Kotlin ve modern teknolojilerle web siteleri ve mobil
        uygulamalar geliştiriyoruz. WordPress değil — gerçek kod, gerçek hız,
        gerçek sonuç.
      </p>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <a
          href="#contact"
          style={{
            background: "var(--color-accent)",
            color: "white",
            border: "none",
            padding: "14px 32px",
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 500,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          Projenizi Konuşalım &rarr;
        </a>
        <a
          href="#portfolyo"
          style={{
            color: "var(--color-muted)",
            fontSize: 14,
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          Çalışmalarımıza Bakın &darr;
        </a>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 1,
            height: 48,
            background:
              "linear-gradient(to bottom, var(--color-accent), transparent)",
          }}
        />
        <p
          style={{
            fontSize: 10,
            letterSpacing: "0.15em",
            color: "var(--color-muted)",
            textTransform: "uppercase" as const,
            writingMode: "vertical-lr",
            transform: "rotate(180deg)",
          }}
        >
          Kaydır
        </p>
      </div>
    </section>
  );
}
