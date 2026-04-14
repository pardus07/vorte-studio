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
          "/p/",
          "/demo/",
          "/teklif/",
          "/portal/",
        ],
      },
    ],
    sitemap: "https://www.vortestudio.com/sitemap.xml",
  };
}
