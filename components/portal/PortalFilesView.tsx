"use client";

import { useState, useRef } from "react";

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
  if (type.includes("pdf")) return "📄";
  if (type.includes("word") || type.includes("document")) return "📝";
  if (type.includes("zip") || type.includes("rar")) return "📦";
  return "📎";
}

export default function PortalFilesView({ initialFiles }: { initialFiles: PortalFileItem[] }) {
  const [files, setFiles] = useState<PortalFileItem[]>(initialFiles);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList?.length) return;

    setUploading(true);
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
      if (res.ok) {
        const data = await res.json();
        setFiles((prev) => [...data.files, ...prev]);
      }
    } catch {
      // hata
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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF4500]/10">
            <svg className="h-5 w-5 text-[#FF4500]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
            accept="image/*,.pdf,.doc,.docx,.zip,.rar,.txt,.svg"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 rounded-xl bg-[#FF4500] px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
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

      {/* Dosya listesi */}
      {files.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.1] bg-[#0c0c0e] py-20">
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
            <div key={f.id} className="flex items-center gap-4 rounded-xl border border-white/[0.07] bg-[#0f0f0f] px-4 py-3 transition-colors hover:bg-[#161616]">
              <span className="text-2xl">{getFileIcon(f.fileType)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{f.fileName}</p>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-white/30">
                  <span>{formatSize(f.fileSize)}</span>
                  <span>·</span>
                  <span>{formatDate(f.createdAt)}</span>
                  <span>·</span>
                  <span className={f.uploadedBy === "ADMIN" ? "text-[#FF4500]/60" : "text-blue-400/60"}>
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
