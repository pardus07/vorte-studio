import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE = "https://www.vortestudio.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let blogEntries: MetadataRoute.Sitemap = [];
  let latestBlogDate: Date | null = null;

  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true, publishedAt: true },
      orderBy: { publishedAt: "desc" },
    });

    if (posts.length > 0) {
      latestBlogDate = posts[0].updatedAt;
    }

    const now = Date.now();
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

    blogEntries = posts.map((p) => {
      const age = now - new Date(p.publishedAt ?? p.updatedAt).getTime();
      const isRecent = age < THIRTY_DAYS;
      return {
        url: `${BASE}/blog/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: isRecent ? ("daily" as const) : ("weekly" as const),
        priority: isRecent ? 0.9 : 0.7,
      };
    });
  } catch {}

  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE}/blog`,
      lastModified: latestBlogDate ?? new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...blogEntries,
  ];
}
