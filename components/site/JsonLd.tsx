export default function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://studio.vorte.com.tr/#website",
        url: "https://studio.vorte.com.tr",
        name: "Vorte Studio",
        description:
          "Next.js, Kotlin ve modern teknolojilerle profesyonel web siteleri ve mobil uygulamalar geliştiriyoruz.",
        publisher: { "@id": "https://studio.vorte.com.tr/#organization" },
        inLanguage: "tr-TR",
      },
      {
        "@type": "Organization",
        "@id": "https://studio.vorte.com.tr/#organization",
        name: "Vorte Studio",
        url: "https://studio.vorte.com.tr",
        logo: {
          "@type": "ImageObject",
          url: "https://studio.vorte.com.tr/og-image.png",
          width: 1200,
          height: 630,
        },
        sameAs: [],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          availableLanguage: ["Turkish", "English"],
        },
      },
      {
        "@type": "ProfessionalService",
        "@id": "https://studio.vorte.com.tr/#service",
        name: "Vorte Studio",
        description:
          "Web tasarım, mobil uygulama geliştirme ve e-ticaret çözümleri sunan dijital ajans.",
        url: "https://studio.vorte.com.tr",
        priceRange: "₺₺",
        areaServed: {
          "@type": "Country",
          name: "Türkiye",
        },
        serviceType: [
          "Web Tasarım",
          "Mobil Uygulama Geliştirme",
          "E-Ticaret Çözümleri",
          "SEO Optimizasyonu",
          "UI/UX Tasarım",
        ],
        knowsAbout: [
          "Next.js",
          "React",
          "Kotlin",
          "Jetpack Compose",
          "PostgreSQL",
          "TypeScript",
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
