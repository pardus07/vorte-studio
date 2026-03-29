import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Syne, DM_Sans } from "next/font/google";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin", "latin-ext"],
  weight: ["700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
});

const SITE_URL = "https://studio.vorte.com.tr";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Vorte Studio — Web Tasarım & Mobil Uygulama Ajansı | Türkiye",
    template: "%s | Vorte Studio",
  },
  description:
    "Next.js, Kotlin ve modern teknolojilerle profesyonel web siteleri, e-ticaret çözümleri ve mobil uygulamalar geliştiriyoruz. WordPress değil — gerçek kod, gerçek hız, gerçek sonuç. Türkiye geneli uzaktan hizmet.",
  keywords: [
    "web tasarım",
    "web sitesi yapımı",
    "mobil uygulama",
    "e-ticaret sitesi",
    "Next.js",
    "Kotlin",
    "React",
    "yazılım ajansı",
    "dijital ajans",
    "Türkiye",
    "freelance web geliştirici",
    "kurumsal web sitesi",
    "SEO uyumlu site",
  ],
  authors: [{ name: "Vorte Studio", url: SITE_URL }],
  creator: "Vorte Studio",
  publisher: "Vorte Studio",
  formatDetection: { telephone: true, email: true },
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE_URL,
    siteName: "Vorte Studio",
    title: "Vorte Studio — Web Tasarım & Mobil Uygulama Ajansı",
    description:
      "Next.js, Kotlin ve modern teknolojilerle profesyonel web siteleri ve mobil uygulamalar. WordPress değil — gerçek kod, gerçek hız, gerçek sonuç.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vorte Studio — Dijital Deneyimler",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vorte Studio — Web Tasarım & Mobil Uygulama Ajansı",
    description:
      "Next.js, Kotlin ve modern teknolojilerle profesyonel web siteleri ve mobil uygulamalar.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} ${dmSans.variable}`}
    >
      <body>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
