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

export const metadata: Metadata = {
  title: "Vorte Studio — Dijital Deneyimler",
  description:
    "Next.js, Kotlin ve modern teknolojilerle web siteleri ve mobil uygulamalar. WordPress degil — gercek kod, gercek hiz, gercek sonuc.",
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
