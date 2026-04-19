import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/indexnow-key"],
        disallow: [
          "/admin/",
          "/api/",
          "/login",
          // NOT: /p/ kaldırıldı — Sprint 3.6c'den sonra /p/:path* → /demo/:path*
          // 301 redirect ediyor. Disallow + redirect kombinasyonunda Googlebot
          // 301'i göremediği için eski indekslenmiş URL'ler silinemiyor.
          // /demo/ zaten disallow'da + X-Robots-Tag noindex alıyor.
          "/demo/",
          "/teklif/",
          "/portal/",
        ],
      },
    ],
    sitemap: "https://www.vortestudio.com/sitemap.xml",
  };
}
