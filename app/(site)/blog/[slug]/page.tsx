import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { sanitizeBlogContent } from "@/lib/sanitize";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  let post: {
    title: string;
    seoTitle: string | null;
    seoDescription: string | null;
    coverImage: string | null;
    excerpt: string | null;
  } | null = null;

  try {
    post = await prisma.blogPost.findUnique({
      where: { slug },
      select: {
        title: true,
        seoTitle: true,
        seoDescription: true,
        coverImage: true,
        excerpt: true,
      },
    });
  } catch {
    return { title: "Blog | Vorte Studio" };
  }

  if (!post) return { title: "Yazı Bulunamadı | Vorte Studio" };

  const title = post.seoTitle || post.title;
  const description =
    post.seoDescription || post.excerpt || "Vorte Studio blog yazısı.";

  const url = `https://www.vortestudio.com/blog/${slug}`;

  return {
    title: `${title} | Vorte Studio`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url,
      siteName: "Vorte Studio",
      locale: "tr_TR",
      ...(post.coverImage && {
        images: [{ url: post.coverImage, width: 1200, height: 630 }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(post.coverImage && { images: [post.coverImage] }),
    },
  };
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  authorName: string;
  publishedAt: Date | null;
  tags: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  updatedAt: Date;
}

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: Date | null;
  tags: string[];
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;

  let post: BlogPost | null = null;

  try {
    post = await prisma.blogPost.findUnique({
      where: { slug, published: true },
    });
  } catch {
    post = null;
  }

  if (!post) notFound();

  // Plain text from HTML for wordCount + articleBody signal
  const plainText = post.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const wordCount = plainText ? plainText.split(" ").filter(Boolean).length : 0;
  // Türkçe ortalama okuma hızı 200 wpm
  const readingMinutes = Math.max(1, Math.round(wordCount / 200));
  const articleUrl = `https://www.vortestudio.com/blog/${post.slug}`;

  // Related posts: önce aynı tag'li yazıları çek, eksikse son yazılarla tamamla
  let related: RelatedPost[] = [];
  try {
    const selectFields = {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      publishedAt: true,
      tags: true,
    } as const;

    if (post.tags.length > 0) {
      related = await prisma.blogPost.findMany({
        where: {
          published: true,
          id: { not: post.id },
          tags: { hasSome: post.tags },
        },
        orderBy: { publishedAt: "desc" },
        take: 3,
        select: selectFields,
      });
    }

    if (related.length < 3) {
      const excludeIds = [post.id, ...related.map((r) => r.id)];
      const fallback = await prisma.blogPost.findMany({
        where: {
          published: true,
          id: { notIn: excludeIds },
        },
        orderBy: { publishedAt: "desc" },
        take: 3 - related.length,
        select: selectFields,
      });
      related = [...related, ...fallback];
    }
  } catch {
    related = [];
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${articleUrl}#article`,
        headline: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt || "",
        image: post.coverImage
          ? {
              "@type": "ImageObject",
              url: post.coverImage,
              width: 1200,
              height: 630,
            }
          : undefined,
        author: {
          "@type": "Organization",
          name: post.authorName,
          url: "https://www.vortestudio.com",
        },
        publisher: {
          "@type": "Organization",
          name: "Vorte Studio",
          url: "https://www.vortestudio.com",
          logo: {
            "@type": "ImageObject",
            url: "https://www.vortestudio.com/og-image.png",
            width: 1200,
            height: 630,
          },
        },
        datePublished: post.publishedAt?.toISOString(),
        dateModified: post.updatedAt.toISOString(),
        url: articleUrl,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": articleUrl,
        },
        inLanguage: "tr-TR",
        keywords: post.tags.join(", "),
        wordCount,
        articleSection: post.tags[0] || "Blog",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Ana Sayfa",
            item: "https://www.vortestudio.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: "https://www.vortestudio.com/blog",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: articleUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      <Navbar />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="px-6 pb-24 pt-32 md:px-12">
        <div className="mx-auto max-w-3xl">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M10 3L5 8l5 5" />
            </svg>
            Blog&apos;a Dön
          </Link>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="mt-4 font-[family-name:var(--font-syne)] text-3xl font-extrabold leading-tight text-white md:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="mt-4 flex items-center gap-3 text-sm text-muted">
            <span>{post.authorName}</span>
            <span className="text-border">&bull;</span>
            <time dateTime={post.publishedAt?.toISOString()}>
              {post.publishedAt
                ? new Intl.DateTimeFormat("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }).format(new Date(post.publishedAt))
                : "Taslak"}
            </time>
            <span className="text-border">&bull;</span>
            <span className="inline-flex items-center gap-1">
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <circle cx="8" cy="8" r="6" />
                <path d="M8 4v4l2.5 2" strokeLinecap="round" />
              </svg>
              {readingMinutes} dk okuma
            </span>
          </div>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-2xl">
              <img
                src={post.coverImage}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Content — sanitized HTML from DB (XSS korumalı) */}
          <div
            className="prose-blog mt-12"
            dangerouslySetInnerHTML={{ __html: sanitizeBlogContent(post.content) }}
          />

          {/* Related Posts */}
          {related.length > 0 && (
            <aside className="mt-20 border-t border-border pt-10">
              <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold text-white md:text-2xl">
                İlgili Yazılar
              </h2>
              <p className="mt-1 text-sm text-muted2">
                Bu yazıyı okuyanlar bunlarla da ilgilendi
              </p>

              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/blog/${r.slug}`}
                    className="group flex flex-col overflow-hidden rounded-xl border border-border bg-bg2 transition-all duration-300 hover:border-accent/30 hover:shadow-[0_0_20px_rgba(255,69,0,0.05)]"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-bg3">
                      {r.coverImage ? (
                        <img
                          src={r.coverImage}
                          alt={r.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/10 to-bg3">
                          <span className="font-[family-name:var(--font-syne)] text-2xl font-bold text-accent/30">
                            V
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-4">
                      {r.tags.length > 0 && (
                        <div className="mb-2 flex flex-wrap gap-1">
                          {r.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <h3 className="font-[family-name:var(--font-syne)] text-base font-bold leading-snug text-white transition-colors group-hover:text-accent">
                        {r.title}
                      </h3>

                      {r.excerpt && (
                        <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-muted">
                          {r.excerpt}
                        </p>
                      )}

                      <div className="mt-3 flex items-center justify-between border-t border-border pt-2">
                        <time
                          dateTime={r.publishedAt?.toISOString()}
                          className="text-[11px] text-muted2"
                        >
                          {r.publishedAt
                            ? new Intl.DateTimeFormat("tr-TR", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }).format(new Date(r.publishedAt))
                            : ""}
                        </time>
                        <span className="text-[11px] font-medium text-accent transition-transform group-hover:translate-x-1">
                          Oku &rarr;
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </aside>
          )}

          {/* Bottom divider + back */}
          <div className="mt-16 border-t border-border pt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-white"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M10 3L5 8l5 5" />
              </svg>
              Tüm Yazılar
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </>
  );
}
