"use client";

import Link from "next/link";
import RevealSection from "./RevealSection";

interface BlogPostPreview {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: string | null;
  tags: string[];
  authorName: string;
}

export default function BlogSection({
  posts,
}: {
  posts: BlogPostPreview[];
}) {
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="border-t border-border px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-6xl">
        <RevealSection>
          <span className="text-xs font-bold uppercase tracking-[.25em] text-accent">
            Blog
          </span>
          <h2 className="mt-4 font-[family-name:var(--font-syne)] text-3xl font-extrabold text-white md:text-4xl">
            Son Yazılar
          </h2>
          <p className="mt-3 max-w-xl text-base text-muted">
            Web geliştirme, dijital dünya ve teknoloji hakkında güncel yazılar.
          </p>
        </RevealSection>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <RevealSection key={post.id} delay={i * 0.1}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-bg2 transition-all duration-300 hover:border-accent/30 hover:shadow-[0_0_30px_rgba(255,69,0,0.06)]"
              >
                {/* Cover */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-bg3">
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
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
                      {post.tags.slice(0, 2).map((tag) => (
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
                  <h3 className="font-[family-name:var(--font-syne)] text-lg font-bold leading-snug text-white transition-colors group-hover:text-accent">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <time className="text-xs text-muted2">
                      {post.publishedAt
                        ? new Intl.DateTimeFormat("tr-TR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }).format(new Date(post.publishedAt))
                        : ""}
                    </time>
                    <span className="text-xs font-medium text-accent transition-transform group-hover:translate-x-1">
                      Oku &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            </RevealSection>
          ))}
        </div>

        {/* Tümünü Gör */}
        <RevealSection delay={0.3}>
          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-accent/30 px-6 py-2.5 text-sm font-semibold text-accent transition-all duration-300 hover:bg-accent hover:text-white"
            >
              Tüm Yazıları Gör
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 3l5 5-5 5" />
              </svg>
            </Link>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
