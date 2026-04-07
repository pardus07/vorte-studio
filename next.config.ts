import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  output: "standalone",

  // sharp native binary'sini server externals'a al — Next standalone build'in
  // sharp'i bundle'a almaya calismasini engelle (libvips native lib gerekiyor)
  serverExternalPackages: ["sharp", "@react-pdf/renderer"],

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // HSTS — HTTP'yi tamamen kapat, Google "Yönlendirmeli sayfa"
          // uyarısını uzun vadede çözer (tarayıcılar ve Googlebot 2 yıl
          // boyunca HTTP denemez). Bonus: SSL Labs skorunu A+ yapar.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      // Özel/dinamik rotalar — arama motorlarından tamamen gizle
      // (brand impersonation / deceptive pages tespitini önler)
      {
        source: "/p/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive, nosnippet",
          },
        ],
      },
      {
        source: "/demo/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive, nosnippet",
          },
        ],
      },
      {
        source: "/teklif/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive, nosnippet",
          },
        ],
      },
      {
        source: "/portal/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive, nosnippet",
          },
        ],
      },
    ];
  },
};

// Sentry wrapper — source map upload + error tunneling + Vercel toolbar
// SENTRY_AUTH_TOKEN ortam değişkeni yoksa source map upload sessizce atlanır
// (build patlamaz, sadece stack trace minified kalır)
export default withSentryConfig(nextConfig, {
  org: "vorte-studio",
  project: "javascript-nextjs",

  // Build loglarını sustur (CI/Coolify build çıktısını kirletmesin)
  silent: !process.env.CI,

  // Source map'leri Sentry'ye yükle (auth token varsa)
  // Coolify env'e SENTRY_AUTH_TOKEN eklediğinde otomatik aktif olur
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },

  // Reklam engelleyicilerin Sentry isteklerini bloklamasını engelle
  // /monitoring üzerinden tunnel et — kendi domain'imizden geçer
  tunnelRoute: "/monitoring",

  // Bundle boyutunu küçült — Sentry SDK debug mesajlarını production'dan çıkar
  disableLogger: true,

  // React component annotation (DevTools entegrasyonu) — kapalı, gerek yok
  reactComponentAnnotation: { enabled: false },

  // Build sırasında widen client file upload kapsamı (standalone uyumu)
  widenClientFileUpload: true,
});
