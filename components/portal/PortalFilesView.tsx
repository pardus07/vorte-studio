"use client";

import { useState, useRef, useEffect } from "react";
import {
  FILE_CATEGORIES,
  ACCEPT_ATTRIBUTE,
  MAX_FILES_PER_REQUEST,
  MAX_TOTAL_REQUEST_LABEL,
} from "@/lib/file-constraints";

interface PortalFileItem {
  id: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  uploadedBy: string;
  description: string | null;
  createdAt: string;
}

interface RejectedFile {
  fileName: string;
  reason: string;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return "🖼️";
  if (type.startsWith("video/")) return "🎬";
  if (type.includes("pdf")) return "📄";
  if (type.includes("word") || type.includes("document")) return "📝";
  if (type.includes("sheet") || type.includes("excel")) return "📊";
  return "📎";
}

export default function PortalFilesView({ initialFiles }: { initialFiles: PortalFileItem[] }) {
  const [files, setFiles] = useState<PortalFileItem[]>(initialFiles);
  const [uploading, setUploading] = useState(false);
  const [rejected, setRejected] = useState<RejectedFile[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reddedilen dosya bildirimi 8 saniye sonra otomatik kaybolsun
  useEffect(() => {
    if (rejected.length === 0 && !errorMessage) return;
    const timer = setTimeout(() => {
      setRejected([]);
      setErrorMessage(null);
    }, 8000);
    return () => clearTimeout(timer);
  }, [rejected, errorMessage]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList?.length) return;

    setUploading(true);
    setRejected([]);
    setErrorMessage(null);

    const formData = new FormData();
    for (let i = 0; i < fileList.length; i++) {
      formData.append("files", fileList[i]);
    }
    formData.append("source", "portal");

    try {
      const res = await fetch("/api/portal/files", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Dosya yüklenemedi");
      } else {
        if (data.files?.length) {
          setFiles((prev) => [...data.files, ...prev]);
        }
        if (data.rejected?.length) {
          setRejected(data.rejected);
        }
      }
    } catch {
      setErrorMessage("Sunucuya ulaşılamadı, lütfen tekrar deneyin.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
            <svg className="h-5 w-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold">Dosyalar</h1>
            <p className="text-xs text-white/40">Logo, görseller, içerikler</p>
          </div>
        </div>

        {/* Yükle butonu */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleUpload}
            className="hidden"
            accept={ACCEPT_ATTRIBUTE}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
          >
            {uploading ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            )}
            Dosya Yükle
          </button>
        </div>
      </div>

      {/* Kategori + limit bilgi bantı */}
      <div className="mb-4 overflow-hidden rounded-xl border border-white/[0.07] bg-bg2">
        <div className="border-b border-white/[0.05] bg-white/[0.02] px-4 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
            Desteklenen dosya türleri
          </p>
        </div>
        <div className="divide-y divide-white/[0.05]">
          {FILE_CATEGORIES.map((cat) => (
            <div
              key={cat.category}
              className="flex items-center gap-3 px-4 py-2.5 text-xs"
            >
              <span className="text-base">{cat.icon}</span>
              <span className="w-14 font-semibold text-white/80">{cat.label}</span>
              <span className="flex-1 text-white/40">{cat.formatLabel}</span>
              <span className="rounded-md bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-white/50">
                max {cat.maxLabel}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-white/[0.05] bg-white/[0.02] px-4 py-2">
          <p className="text-[10px] text-white/30">
            Tek seferde en fazla {MAX_FILES_PER_REQUEST} dosya · toplam {MAX_TOTAL_REQUEST_LABEL}
          </p>
        </div>
      </div>

      {/* Hata mesajı (request seviyesi) */}
      {errorMessage && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/[0.08] px-4 py-3">
          <svg className="h-4 w-4 flex-shrink-0 text-red-400 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-xs text-red-200">{errorMessage}</p>
        </div>
      )}

      {/* Reddedilen dosyalar (dosya seviyesi) */}
      {rejected.length > 0 && (
        <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/[0.06] px-4 py-3">
          <div className="flex items-center gap-2 mb-2">
            <svg className="h-4 w-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <p className="text-xs font-semibold text-amber-200">
              {rejected.length} dosya yüklenemedi
            </p>
          </div>
          <ul className="space-y-1 pl-6">
            {rejected.map((r, idx) => (
              <li key={idx} className="text-[11px] text-amber-200/70">
                <span className="font-medium text-amber-200/90">{r.fileName}</span>
                <span className="text-amber-200/50"> — {r.reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Dosya listesi */}
      {files.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.1] bg-bg2 py-20">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.03]">
            <svg className="h-8 w-8 text-white/15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <p className="text-sm text-white/30">Henüz dosya yüklenmemiş</p>
          <p className="mt-1 text-xs text-white/15">Logo, görseller veya içeriklerinizi buradan paylaşabilirsiniz</p>
        </div>
      ) : (
        <div className="space-y-2">
          {files.map((f) => (
            <div key={f.id} className="flex items-center gap-4 rounded-xl border border-white/[0.07] bg-bg2 px-4 py-3 transition-colors hover:bg-bg3">
              <span className="text-2xl">{getFileIcon(f.fileType)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{f.fileName}</p>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-white/30">
                  <span>{formatSize(f.fileSize)}</span>
                  <span>·</span>
                  <span>{formatDate(f.createdAt)}</span>
                  <span>·</span>
                  <span className={f.uploadedBy === "ADMIN" ? "text-accent/60" : "text-blue-400/60"}>
                    {f.uploadedBy === "ADMIN" ? "Vorte Studio" : "Siz"}
                  </span>
                </div>
              </div>
              <a
                href={f.filePath}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-white/[0.06] hover:text-white/60"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
