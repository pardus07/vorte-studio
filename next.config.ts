import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // sharp native binary'sini server externals'a al — Next standalone build'in
  // sharp'i bundle'a almaya calismasini engelle (libvips native lib gerekiyor)
  serverExternalPackages: ["sharp", "@react-pdf/renderer"],

  // Sprint 3.6c — /p/[slug] mimarisi kaldırıldı, chat akışı /demo/ altına
  // taşındı. Eski URL'leri (dış linkler, Google cache, WA geçmişi) kırmamak
  // için kalıcı (301) redirect. Tüm alt yollar dahil: /p/xxx ve /p/xxx/chat.
  async redirects() {
    return [
      {
        source: "/p/:path*",
        destination: "/demo/:path*",
        permanent: true,
      },
    ];
  },

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
      // NOT: /p/:path* artık redirect olduğu için X-Robots-Tag bloğu yok
      // (redirect öncelikli çalışır, header uygulanmaz).
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

export default nextConfig;
