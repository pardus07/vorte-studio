"use client";

import Link from "next/link";
import { motion } from "framer-motion";

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
    <section id="blog" className="border-t border-border px-6 py-24 md:px-12 lg:px-20 md:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            <span className="h-px w-8 bg-accent" />
            Blog
          </div>
          <h2 className="font-[family-name:var(--font-syne)] text-3xl font-extrabold text-white md:text-4xl">
            Son Yazılar
          </h2>
          <p className="mt-3 max-w-xl text-base text-muted">
            Web geliştirme, dijital dünya ve teknoloji hakkında güncel yazılar.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-bg2 transition-all duration-500 hover:border-accent/30 hover:shadow-[0_0_40px_rgba(255,69,0,0.08)] hover:-translate-y-1"
              >
                {/* Cover */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-bg3">
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/8 to-bg3">
                      <span className="font-[family-name:var(--font-syne)] text-4xl font-bold text-accent/20">
                        V
                      </span>
                    </div>
                  )}
                  {/* Gradient overlay on image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg2/60 to-transparent" />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-lg bg-accent/10 px-2.5 py-0.5 text-[11px] font-semibold text-accent"
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
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-[10px] font-bold text-accent">
                        V
                      </div>
                      <time className="text-[11px] text-muted2">
                        {post.publishedAt
                          ? new Intl.DateTimeFormat("tr-TR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }).format(new Date(post.publishedAt))
                          : ""}
                      </time>
                    </div>
                    <span className="flex items-center gap-1 text-[12px] font-semibold text-accent transition-transform group-hover:translate-x-1">
                      Oku
                      <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M2 6h8M7 3l3 3-3 3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 rounded-full border border-accent/30 px-7 py-3 text-sm font-semibold text-accent transition-all duration-300 hover:bg-accent hover:text-white hover:shadow-lg hover:shadow-accent/20"
          >
            Tüm Yazıları Gör
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M6 3l5 5-5 5" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
