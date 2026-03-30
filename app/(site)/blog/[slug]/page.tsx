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

  return {
    title: `${title} | Vorte Studio`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://studio.vorte.com.tr/blog/${slug}`,
      siteName: "Vorte Studio",
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || "",
    image: post.coverImage || undefined,
    author: {
      "@type": "Organization",
      name: post.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Vorte Studio",
      url: "https://studio.vorte.com.tr",
    },
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    url: `https://studio.vorte.com.tr/blog/${post.slug}`,
    keywords: post.tags.join(", "),
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
