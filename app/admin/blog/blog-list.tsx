"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { togglePublishBlogPost, deleteBlogPost } from "@/actions/blog";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  published: boolean;
  publishedAt: Date | null;
  authorName: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
};

const filterButtons = [
  { key: "ALL", label: "Tümü" },
  { key: "PUBLISHED", label: "Yayında" },
  { key: "DRAFT", label: "Taslak" },
];

export default function BlogList({ initialPosts }: { initialPosts: BlogPost[] }) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const filtered = posts.filter((p) => {
    if (filter === "PUBLISHED" && !p.published) return false;
    if (filter === "DRAFT" && p.published) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
    }
    return true;
  });

  const totalCount = posts.length;
  const publishedCount = posts.filter((p) => p.published).length;
  const draftCount = posts.filter((p) => !p.published).length;

  async function handleTogglePublish(id: string) {
    // Optimistic update
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, published: !p.published, publishedAt: !p.published ? new Date() : null }
          : p
      )
    );
    const result = await togglePublishBlogPost(id);
    if (!result.success) {
      setPosts(initialPosts);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu yazıyı silmek istediğinize emin misiniz?")) return;
    // Optimistic update
    setPosts((prev) => prev.filter((p) => p.id !== id));
    const result = await deleteBlogPost(id);
    if (!result.success) {
      setPosts(initialPosts);
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1.5">
          {filterButtons.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors ${
                filter === f.key
                  ? "bg-admin-accent-dim text-admin-accent"
                  : "text-admin-muted hover:bg-admin-bg3 hover:text-admin-text"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Başlık veya slug ara..."
          className="rounded-lg border border-admin-border bg-admin-bg3 px-3 py-1.5 text-[12px] text-admin-text placeholder:text-admin-muted focus:border-admin-accent focus:outline-none"
          style={{ minWidth: 180 }}
        />
        <button
          onClick={() => router.push("/admin/blog/new")}
          className="rounded-lg bg-admin-accent px-4 py-2 text-[12px] font-medium text-white hover:brightness-110 transition-colors"
        >
          + Yeni Yazı
        </button>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-[12px]">
        <span className="text-admin-muted">
          Toplam: <span className="text-admin-text font-medium">{totalCount}</span>
        </span>
        <span className="text-admin-muted">
          Yayında: <span className="text-admin-green font-medium">{publishedCount}</span>
        </span>
        <span className="text-admin-muted">
          Taslak: <span className="text-admin-text font-medium">{draftCount}</span>
        </span>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-admin-border bg-admin-bg2">
        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="border-b border-admin-border text-left text-[11px] font-medium text-admin-muted">
                <th className="px-4 py-2.5">Başlık</th>
                <th className="px-4 py-2.5">Durum</th>
                <th className="px-4 py-2.5">Tarih</th>
                <th className="px-4 py-2.5">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-[12px] text-admin-muted">
                    {search ? "Arama sonucu bulunamadı." : "Henüz blog yazısı yok."}
                  </td>
                </tr>
              )}
              {filtered.map((post) => {
                const date = new Date(post.createdAt);
                const formatted = date.toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });
                return (
                  <tr key={post.id} className="hover:bg-admin-bg3">
                    <td className="px-4 py-3">
                      <div className="font-medium">{post.title}</div>
                      <div className="text-[11px] text-admin-muted">/{post.slug}</div>
                    </td>
                    <td className="px-4 py-3">
                      {post.published ? (
                        <span className="rounded-full bg-admin-green-dim px-2 py-0.5 text-[10px] font-medium text-admin-green">
                          Yayında
                        </span>
                      ) : (
                        <span className="rounded-full bg-admin-bg3 px-2 py-0.5 text-[10px] font-medium text-admin-muted">
                          Taslak
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-admin-muted">{formatted}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => router.push(`/admin/blog/${post.id}`)}
                          className="rounded border border-admin-border px-2 py-1 text-[10px] text-admin-muted hover:text-admin-text hover:bg-admin-bg3 transition-colors"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleTogglePublish(post.id)}
                          className={`rounded px-2 py-1 text-[10px] font-medium transition-colors ${
                            post.published
                              ? "border border-admin-border text-admin-muted hover:text-admin-red hover:bg-admin-bg3"
                              : "bg-admin-green px-2 py-1 text-white hover:brightness-110"
                          }`}
                        >
                          {post.published ? "Geri Al" : "Yayınla"}
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="rounded border border-admin-border px-2 py-1 text-[10px] text-admin-muted hover:text-admin-red hover:border-admin-red transition-colors"
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
