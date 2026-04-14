export default function JsonLd() {
  const SITE_URL = "https://www.vortestudio.com";

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Vorte Studio",
        description:
          "WordPress değil, gerçek kod. Next.js ve Prisma altyapısıyla kurumsal web siteleri, e-ticaret çözümleri ve mobil uygulamalar geliştiren yazılım stüdyosu.",
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "tr-TR",
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Vorte Studio",
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
        },
        address: {
          "@type": "PostalAddress",
          streetAddress: "Mansuroğlu Mah. Ankara Caddesi No:81/012 Bayraklı Tower",
          addressLocality: "Bayraklı",
          addressRegion: "İzmir",
          postalCode: "35030",
          addressCountry: "TR",
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer service",
            email: "info@vortestudio.com",
            telephone: "+90-850-305-8635",
            availableLanguage: ["Turkish", "English"],
          },
        ],
      },
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}/#service`,
        name: "Vorte Studio",
        description:
          "Next.js ve Prisma ile kurumsal web sitesi, e-ticaret ve mobil uygulama geliştiren yazılım stüdyosu. Yenilikçi tasarım, gerçek kod, ölçülebilir performans.",
        url: SITE_URL,
        telephone: "+90-850-305-8635",
        email: "info@vortestudio.com",
        priceRange: "₺₺",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Mansuroğlu Mah. Ankara Caddesi No:81/012 Bayraklı Tower",
          addressLocality: "Bayraklı",
          addressRegion: "İzmir",
          postalCode: "35030",
          addressCountry: "TR",
        },
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
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "Web sitesi yaptırmak ne kadar sürer?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Proje kapsamına göre değişmekle birlikte, ortalama teslimat süremiz 3 haftadır. Keşif ve tasarım aşaması 1-2 hafta, geliştirme ve test 1-2 hafta sürer.",
            },
          },
          {
            "@type": "Question",
            name: "WordPress yerine neden Next.js kullanıyorsunuz?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Next.js, WordPress'e kıyasla 5 kata kadar daha hızlı sayfa yükleme sunar. SEO skoru 95+ garanti ediyoruz. Güvenlik açıkları minimumda, bakım maliyeti düşük ve tamamen özelleştirilebilir.",
            },
          },
          {
            "@type": "Question",
            name: "Bakım paketi neleri kapsar?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Hosting, SSL sertifikası, yedekleme, güvenlik güncellemeleri ve 7/24 izleme dahildir. Aylık sabit ücretle siteniz her zaman güncel ve güvende kalır.",
            },
          },
          {
            "@type": "Question",
            name: "Uzaktan çalışıyor musunuz?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Evet, Türkiye genelinde uzaktan hizmet veriyoruz. Tüm iletişim ve proje yönetimi dijital ortamda gerçekleşir. WhatsApp, e-posta ve video görüşme ile sürekli iletişim halindeyiz.",
            },
          },
          {
            "@type": "Question",
            name: "E-ticaret sitesi yaptırabilir miyim?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Evet, İyzico ödeme entegrasyonu, sipariş yönetimi, stok takibi ve admin paneli dahil tam kapsamlı e-ticaret çözümleri sunuyoruz.",
            },
          },
        ],
      },
    ],
  };

  // Safe: structuredData is a hardcoded object, not user input
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
