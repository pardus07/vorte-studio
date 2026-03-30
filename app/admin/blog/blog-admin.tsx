"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FileText,
  CheckCircle,
  Clock,
  Tag,
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  CalendarDays,
  User,
} from "lucide-react";

interface BlogItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  published: boolean;
  publishedAt: string | null;
  authorName: string;
  tags: string[];
  createdAt: string;
}

type StatusFilter = "all" | "published" | "draft";

export default function BlogAdmin() {
  const [posts, setPosts] = useState<BlogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status === "published") params.set("published", "true");
    if (status === "draft") params.set("published", "false");
    const res = await fetch(`/api/admin/blog?${params}`);
    if (res.ok) {
      const data = await res.json();
      setPosts(data.posts || []);
      setTotal(data.posts?.length || 0);
    }
    setLoading(false);
  }, [search, status]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu blog yazısını silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    if (res.ok) fetchPosts();
  };

  const stats = useMemo(() => {
    const published = posts.filter((p) => p.published).length;
    const draft = posts.filter((p) => !p.published).length;
    const allTags = new Set<string>();
    posts.forEach((p) => {
      if (p.tags && Array.isArray(p.tags)) {
        p.tags.forEach((t) => allTags.add(t.trim()));
      }
    });
    return { total, published, draft, tags: allTags.size };
  }, [posts, total]);

  const statusFilters: { key: StatusFilter; label: string }[] = [
    { key: "all", label: "Tümü" },
    { key: "published", label: "Yayında" },
    { key: "draft", label: "Taslak" },
  ];

  const SkeletonRow = () => (
    <tr className="border-b border-admin-border">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-20 animate-pulse rounded-lg bg-admin-bg3" />
          <div className="space-y-2">
            <div className="h-4 w-48 animate-pulse rounded bg-admin-bg3" />
            <div className="h-3 w-32 animate-pulse rounded bg-admin-bg3" />
          </div>
        </div>
      </td>
      <td className="px-5 py-4"><div className="h-3 w-20 animate-pulse rounded bg-admin-bg3" /></td>
      <td className="px-5 py-4">
        <div className="flex gap-1">
          <div className="h-5 w-14 animate-pulse rounded-full bg-admin-bg3" />
          <div className="h-5 w-12 animate-pulse rounded-full bg-admin-bg3" />
        </div>
      </td>
      <td className="px-5 py-4"><div className="mx-auto h-5 w-16 animate-pulse rounded-full bg-admin-bg3" /></td>
      <td className="px-5 py-4"><div className="h-3 w-20 animate-pulse rounded bg-admin-bg3" /></td>
      <td className="px-5 py-4">
        <div className="flex justify-end gap-1">
          <div className="h-8 w-8 animate-pulse rounded-lg bg-admin-bg3" />
          <div className="h-8 w-8 animate-pulse rounded-lg bg-admin-bg3" />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-admin-text">Blog Yönetimi</h1>
          <p className="mt-1 text-[13px] text-admin-muted">
            {total} yazı kayıtlı, içeriklerinizi buradan yönetin
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 rounded-xl bg-admin-accent px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:brightness-110 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" /> Yeni Yazı
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-admin-border bg-admin-bg2 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <FileText className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-admin-muted">
                Toplam Yazı
              </p>
              <p className="text-2xl font-bold text-admin-text">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-admin-border bg-admin-bg2 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-admin-muted">
                Yayında
              </p>
              <p className="text-2xl font-bold text-green-400">{stats.published}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-admin-border bg-admin-bg2 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
              <Clock className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-admin-muted">
                Taslak
              </p>
              <p className="text-2xl font-bold text-amber-400">{stats.draft}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-admin-border bg-admin-bg2 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
              <Tag className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-admin-muted">
                Etiketler
              </p>
              <p className="text-2xl font-bold text-purple-400">{stats.tags}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search + Status Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-muted" />
          <input
            type="text"
            placeholder="Yazı başlığı veya slug ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-admin-border bg-admin-bg2 py-2.5 pl-10 pr-3 text-sm text-admin-text placeholder:text-admin-muted transition-colors focus:border-admin-accent focus:outline-none focus:ring-2 focus:ring-admin-accent/20"
          />
        </div>
        <div className="flex items-center rounded-xl border border-admin-border bg-admin-bg2 p-1">
          {statusFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => setStatus(f.key)}
              className={`rounded-lg px-4 py-1.5 text-[13px] font-medium transition-all ${
                status === f.key
                  ? "bg-admin-accent text-white shadow-sm"
                  : "text-admin-muted hover:text-admin-text"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-admin-border bg-admin-bg2">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-admin-border text-left">
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-admin-muted">
                  Yazı
                </th>
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-admin-muted">
                  Yazar
                </th>
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-admin-muted">
                  Etiketler
                </th>
                <th className="px-5 py-3.5 text-center text-[11px] font-semibold uppercase tracking-wider text-admin-muted">
                  Durum
                </th>
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-admin-muted">
                  Tarih
                </th>
                <th className="px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-admin-muted">
                  İşlem
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {loading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-admin-bg3">
                        <BookOpen className="h-7 w-7 text-admin-muted" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-admin-muted">
                          Henüz blog yazısı bulunmuyor
                        </p>
                        <p className="mt-0.5 text-[12px] text-admin-muted2">
                          Yeni bir yazı oluşturmak için yukarıdaki butonu kullanın
                        </p>
                      </div>
                      <Link
                        href="/admin/blog/new"
                        className="mt-2 flex items-center gap-1.5 rounded-xl bg-admin-accent px-4 py-2 text-[13px] font-medium text-white shadow-sm transition-all hover:brightness-110 active:scale-[0.98]"
                      >
                        <Plus className="h-3.5 w-3.5" /> Yazı Oluştur
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="transition-colors hover:bg-admin-bg3/50">
                    {/* Post Title + Cover */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {post.coverImage ? (
                          <div
                            className="h-12 w-20 shrink-0 rounded-lg bg-admin-bg3 bg-cover bg-center"
                            style={{ backgroundImage: `url(${post.coverImage})` }}
                          />
                        ) : (
                          <div className="flex h-12 w-20 shrink-0 items-center justify-center rounded-lg bg-admin-bg3">
                            <BookOpen className="h-5 w-5 text-admin-muted" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-semibold text-admin-text">
                            {post.title}
                          </p>
                          <p className="mt-0.5 truncate font-mono text-[11px] text-admin-muted">
                            /blog/{post.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Author */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-admin-muted" />
                        <span className="text-[12px] text-admin-muted">{post.authorName}</span>
                      </div>
                    </td>

                    {/* Tags */}
                    <td className="px-5 py-3.5">
                      {post.tags && post.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-0.5 rounded-full bg-admin-bg3 px-2 py-0.5 text-[10px] font-medium text-admin-muted"
                            >
                              <Tag className="h-2.5 w-2.5" />
                              {tag.trim()}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="rounded-full bg-admin-bg3 px-2 py-0.5 text-[10px] font-medium text-admin-muted">
                              +{post.tags.length - 3}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[12px] text-admin-muted2">--</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          post.published
                            ? "bg-green-500/10 text-green-400"
                            : "bg-admin-bg3 text-admin-muted"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            post.published ? "bg-green-400" : "bg-admin-muted"
                          }`}
                        />
                        {post.published ? "Yayında" : "Taslak"}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 text-admin-muted" />
                        <span className="text-[12px] text-admin-muted">
                          {new Date(post.publishedAt || post.createdAt).toLocaleDateString("tr-TR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {post.published && (
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg p-2 text-admin-muted transition-colors hover:bg-admin-bg3 hover:text-admin-text"
                            title="Önizle"
                          >
                            <Eye className="h-4 w-4" />
                          </a>
                        )}
                        <Link
                          href={`/admin/blog/${post.id}`}
                          className="rounded-lg p-2 text-admin-muted transition-colors hover:bg-admin-bg3 hover:text-admin-text"
                          title="Düzenle"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="rounded-lg p-2 text-admin-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
                          title="Sil"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Loading overlay */}
      {loading && posts.length > 0 && (
        <div className="flex items-center justify-center gap-3 py-6">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-admin-border border-t-admin-accent" />
          <span className="text-sm text-admin-muted">Güncelleniyor...</span>
        </div>
      )}
    </div>
  );
}
