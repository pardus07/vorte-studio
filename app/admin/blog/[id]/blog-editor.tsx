"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createBlogPost, updateBlogPost } from "@/actions/blog";

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

const inputClass =
  "rounded-lg border border-admin-border bg-admin-bg3 px-3 py-2 text-[13px] text-admin-text placeholder:text-admin-muted focus:border-admin-accent focus:outline-none w-full";

function turkishToSlug(text: string): string {
  const charMap: Record<string, string> = {
    ş: "s", Ş: "s",
    ç: "c", Ç: "c",
    ö: "o", Ö: "o",
    ü: "u", Ü: "u",
    ğ: "g", Ğ: "g",
    ı: "i", İ: "i",
  };
  return text
    .toLowerCase()
    .replace(/[şŞçÇöÖüÜğĞıİ]/g, (ch) => charMap[ch] || ch)
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function BlogEditor({ post }: { post: BlogPost | null }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = !!post;

  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [content, setContent] = useState(post?.content || "");
  const [coverImage, setCoverImage] = useState(post?.coverImage || "");
  const [seoTitle, setSeoTitle] = useState(post?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(post?.seoDescription || "");
  const [tags, setTags] = useState(post?.tags?.join(", ") || "");
  const [published, setPublished] = useState(post?.published || false);
  const [authorName, setAuthorName] = useState(post?.authorName || "Vorte Studio");

  const [showPreview, setShowPreview] = useState(false);
  const [showSeo, setShowSeo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showNotification = useCallback((type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!isEditing) {
      setSlug(turkishToSlug(value));
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "blog");

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (res.ok && data.url) {
        setCoverImage(data.url);
        showNotification("success", "Görsel yüklendi.");
      } else {
        showNotification("error", data.error || "Görsel yüklenemedi.");
      }
    } catch {
      showNotification("error", "Görsel yüklenirken hata oluştu.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSave() {
    if (!title.trim()) {
      showNotification("error", "Başlık zorunludur.");
      return;
    }
    if (!content.trim()) {
      showNotification("error", "İçerik zorunludur.");
      return;
    }

    setSaving(true);
    try {
      const tagArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim() || undefined,
        content,
        coverImage: coverImage.trim() || undefined,
        seoTitle: seoTitle.trim() || undefined,
        seoDescription: seoDescription.trim() || undefined,
        tags: tagArray,
        published,
        authorName: authorName.trim() || "Vorte Studio",
      };

      let result;
      if (isEditing) {
        result = await updateBlogPost(post.id, payload);
      } else {
        result = await createBlogPost(payload);
      }

      if (result.success) {
        showNotification("success", isEditing ? "Yazı güncellendi." : "Yazı oluşturuldu.");
        if (!isEditing && "id" in result) {
          router.push(`/admin/blog/${result.id}`);
        }
        router.refresh();
      } else {
        showNotification("error", ("error" in result && result.error) || "İşlem başarısız oldu.");
      }
    } catch {
      showNotification("error", "Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  // Sanitize HTML for preview: admin-only content, strip script tags as basic protection
  function sanitizeForPreview(html: string): string {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/on\w+\s*=\s*"[^"]*"/gi, "")
      .replace(/on\w+\s*=\s*'[^']*'/gi, "");
  }

  // SEO preview
  const previewTitle = seoTitle || title || "Sayfa Başlığı";
  const previewDesc = seoDescription || excerpt || "Sayfa açıklaması burada görünecek...";
  const previewUrl = `vortestudio.com/blog/${slug || "slug"}`;

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div
          className={`rounded-lg px-4 py-2.5 text-[13px] font-medium ${
            notification.type === "success"
              ? "bg-admin-green-dim text-admin-green"
              : "bg-admin-red-dim text-admin-red"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Main form */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column - Main content */}
        <div className="space-y-4 lg:col-span-2">
          {/* Title */}
          <div>
            <label className="mb-1 block text-[12px] font-medium text-admin-muted">Başlık</label>
            <input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Blog yazısının başlığı..."
              className={inputClass}
            />
          </div>

          {/* Slug */}
          <div>
            <label className="mb-1 block text-[12px] font-medium text-admin-muted">Slug</label>
            <input
              value={slug}
              onChange={(e) => setSlug(turkishToSlug(e.target.value))}
              placeholder="otomatik-olusturulur"
              className={inputClass}
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="mb-1 block text-[12px] font-medium text-admin-muted">Özet</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Kısa açıklama..."
              rows={3}
              className={inputClass}
              style={{ resize: "vertical" }}
            />
          </div>

          {/* Content */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-[12px] font-medium text-admin-muted">İçerik (HTML)</label>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="rounded border border-admin-border px-2 py-0.5 text-[10px] text-admin-muted hover:text-admin-text hover:bg-admin-bg3 transition-colors"
              >
                {showPreview ? "Editör" : "Önizleme"}
              </button>
            </div>
            {showPreview ? (
              <div
                className="prose prose-invert max-w-none rounded-lg border border-admin-border bg-admin-bg3 p-4 text-[14px] text-admin-text"
                dangerouslySetInnerHTML={{ __html: sanitizeForPreview(content) }}
                style={{ minHeight: 400 }}
              />
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="<h2>Alt Başlık</h2><p>İçerik buraya...</p>"
                rows={20}
                className={`${inputClass} font-mono text-[12px]`}
                style={{ resize: "vertical" }}
              />
            )}
          </div>
        </div>

        {/* Right column - Sidebar */}
        <div className="space-y-4">
          {/* Actions */}
          <div className="rounded-xl border border-admin-border bg-admin-bg2 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="rounded border-admin-border accent-admin-accent"
                id="published-toggle"
              />
              <label htmlFor="published-toggle" className="text-[12px] text-admin-text cursor-pointer">
                Yayında
              </label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 rounded-lg bg-admin-accent px-4 py-2 text-[12px] font-medium text-white hover:brightness-110 transition-colors disabled:opacity-50"
              >
                {saving ? "Kaydediliyor..." : isEditing ? "Güncelle" : "Kaydet"}
              </button>
              <button
                onClick={() => router.push("/admin/blog")}
                className="rounded-lg border border-admin-border px-4 py-2 text-[12px] text-admin-muted hover:text-admin-text hover:bg-admin-bg3 transition-colors"
              >
                Geri
              </button>
            </div>
          </div>

          {/* Cover Image */}
          <div className="rounded-xl border border-admin-border bg-admin-bg2 p-4 space-y-3">
            <label className="block text-[12px] font-medium text-admin-muted">Kapak Görseli</label>
            <input
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="Görsel URL'si..."
              className={inputClass}
            />
            {coverImage && (
              <div className="overflow-hidden rounded-lg border border-admin-border">
                <img
                  src={coverImage}
                  alt="Kapak görseli"
                  className="h-32 w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full rounded-lg border border-dashed border-admin-border px-3 py-2 text-[12px] text-admin-muted hover:text-admin-text hover:border-admin-accent transition-colors disabled:opacity-50"
            >
              {uploading ? "Yükleniyor..." : "Görsel Yükle"}
            </button>
          </div>

          {/* Author */}
          <div className="rounded-xl border border-admin-border bg-admin-bg2 p-4 space-y-3">
            <label className="block text-[12px] font-medium text-admin-muted">Yazar</label>
            <input
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Vorte Studio"
              className={inputClass}
            />
          </div>

          {/* Tags */}
          <div className="rounded-xl border border-admin-border bg-admin-bg2 p-4 space-y-3">
            <label className="block text-[12px] font-medium text-admin-muted">
              Etiketler <span className="text-admin-muted">(virgülle ayırın)</span>
            </label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="web tasarım, seo, nextjs"
              className={inputClass}
            />
            {tags && (
              <div className="flex flex-wrap gap-1">
                {tags
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .map((tag, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-admin-accent-dim px-2 py-0.5 text-[10px] text-admin-accent"
                    >
                      {tag}
                    </span>
                  ))}
              </div>
            )}
          </div>

          {/* SEO Section */}
          <div className="rounded-xl border border-admin-border bg-admin-bg2 overflow-hidden">
            <button
              onClick={() => setShowSeo(!showSeo)}
              className="flex w-full items-center justify-between px-4 py-3 text-[12px] font-medium text-admin-muted hover:text-admin-text transition-colors"
            >
              <span>SEO Ayarları</span>
              <span className="text-[10px]">{showSeo ? "▲" : "▼"}</span>
            </button>
            {showSeo && (
              <div className="space-y-3 border-t border-admin-border p-4">
                <div>
                  <label className="mb-1 block text-[11px] text-admin-muted">SEO Başlık</label>
                  <input
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder={title || "SEO başlığı..."}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] text-admin-muted">SEO Açıklama</label>
                  <textarea
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder={excerpt || "SEO açıklaması..."}
                    rows={3}
                    className={inputClass}
                    style={{ resize: "vertical" }}
                  />
                </div>
                {/* Google Preview */}
                <div>
                  <label className="mb-1 block text-[11px] text-admin-muted">Google Önizleme</label>
                  <div className="rounded-lg border border-admin-border bg-white p-3 space-y-0.5">
                    <div className="text-[11px] text-green-700 truncate">{previewUrl}</div>
                    <div className="text-[14px] font-medium text-blue-700 truncate">{previewTitle}</div>
                    <div className="text-[12px] text-gray-600 line-clamp-2">{previewDesc}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
