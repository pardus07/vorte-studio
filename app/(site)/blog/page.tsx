import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog | Vorte Studio",
  description:
    "Vorte Studio blog: Web geliştirme, mobil uygulama, UI/UX tasarım ve dijital dünya hakkında yazılar, ipuçları ve güncellemeler.",
  openGraph: {
    title: "Blog | Vorte Studio",
    description:
      "Web geliştirme, mobil uygulama, UI/UX tasarım ve dijital dünya hakkında yazılar.",
    url: "https://studio.vorte.com.tr/blog",
    siteName: "Vorte Studio",
    type: "website",
  },
};

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: Date | null;
  tags: string[];
  authorName: string;
}

export default async function BlogPage() {
  let posts: BlogPost[] = [];

  try {
    posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
        tags: true,
        authorName: true,
      },
    });
  } catch {
    posts = [];
  }

  return (
    <>
      <Navbar />

      <section className="px-6 pb-24 pt-32 md:px-12">
        {/* Header */}
        <div className="mx-auto max-w-5xl">
          <h1 className="font-[family-name:var(--font-syne)] text-4xl font-extrabold text-white md:text-5xl">
            Blog
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
            Web geliştirme, mobil uygulama, UI/UX tasarım ve dijital dünya
            hakkında yazılar, ipuçları ve güncellemeler.
          </p>
          <div className="mt-6 h-px w-16 bg-accent" />
        </div>

        {/* Posts Grid */}
        <div className="mx-auto mt-16 max-w-5xl">
          {posts.length === 0 ? (
            <div className="rounded-2xl border border-border bg-bg2 px-8 py-16 text-center">
              <p className="text-lg text-muted">
                Henüz yayınlanmış bir yazı bulunmuyor.
              </p>
              <p className="mt-2 text-sm text-muted2">
                Yakında yeni içerikler burada olacak.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-bg2 transition-all duration-300 hover:border-accent/30 hover:shadow-[0_0_30px_rgba(255,69,0,0.06)]"
                >
                  {/* Cover */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-bg3">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/10 to-bg3">
                        <span className="font-[family-name:var(--font-syne)] text-3xl font-bold text-accent/30">
                          V
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-5">
                    {/* Tags */}
                    {post.tags.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[11px] font-medium text-accent"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Title */}
                    <h2 className="font-[family-name:var(--font-syne)] text-lg font-bold leading-snug text-white transition-colors group-hover:text-accent">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Footer */}
                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      <time
                        dateTime={post.publishedAt?.toISOString()}
                        className="text-xs text-muted2"
                      >
                        {post.publishedAt
                          ? new Intl.DateTimeFormat("tr-TR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }).format(new Date(post.publishedAt))
                          : "Taslak"}
                      </time>
                      <span className="text-xs font-medium text-accent transition-transform group-hover:translate-x-1">
                        Devamını Oku &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
