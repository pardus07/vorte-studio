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

const SITE_URL = "https://www.vortestudio.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Vorte Studio — Web Tasarım & Mobil Uygulama Ajansı | Türkiye",
    template: "%s | Vorte Studio",
  },
  description:
    "Vorte Studio — Next.js ve Prisma ile kurumsal web sitesi, e-ticaret ve mobil uygulama geliştiriyoruz. WordPress değil, gerçek kod, gerçek performans.",
  keywords: [
    "web tasarım",
    "web sitesi yapımı",
    "mobil uygulama",
    "e-ticaret sitesi",
    "Next.js",
    "Prisma",
    "React",
    "TypeScript",
    "yazılım stüdyosu",
    "dijital ajans",
    "Türkiye",
    "kurumsal web sitesi",
    "SEO uyumlu site",
    "WordPress alternatifi",
  ],
  authors: [{ name: "Vorte Studio", url: SITE_URL }],
  creator: "Vorte Studio",
  publisher: "Vorte Studio",
  formatDetection: { telephone: true, email: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE_URL,
    siteName: "Vorte Studio",
    title: "Vorte Studio — Web Tasarım & Mobil Uygulama Ajansı",
    description:
      "WordPress değil, gerçek kod ile fark yaratan web siteleri. Next.js ve Prisma ile hızlı, güvenli ve SEO uyumlu dijital çözümler üretiyoruz.",
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
      "WordPress değil, gerçek kod. Next.js ve Prisma ile kurumsal web sitesi, e-ticaret ve mobil uygulama geliştiriyoruz.",
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
