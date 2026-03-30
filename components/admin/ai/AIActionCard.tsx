"use client";

import { useState } from "react";
import type { PendingAction } from "./AIMessageBubble";

function formatArgsPreview(toolName: string, args: Record<string, unknown>): string[] {
  const lines: string[] = [];

  if (toolName === "create_blog_post" || toolName === "update_blog_post") {
    if (args.title) lines.push(`Başlık: ${args.title}`);
    if (args.slug) lines.push(`Slug: ${args.slug}`);
    if (args.tags) lines.push(`Etiketler: ${args.tags}`);
    if (args.seoTitle) lines.push(`SEO: ${args.seoTitle}`);
    if (args.published !== undefined) lines.push(`Durum: ${args.published ? "Yayında" : "Taslak"}`);
    return lines;
  }

  if (toolName === "update_settings") {
    if (args.key) lines.push(`Ayar: ${args.key}`);
    if (args.value) lines.push(`Değer: ${String(args.value).substring(0, 60)}`);
    return lines;
  }

  if (toolName === "generate_image") {
    if (args.prompt) lines.push(`Prompt: ${String(args.prompt).substring(0, 80)}...`);
    if (args.style) lines.push(`Stil: ${args.style}`);
    return lines;
  }

  if (toolName.startsWith("delete_")) {
    if (args.id) lines.push(`Silinecek ID: ${args.id}`);
    return lines;
  }

  for (const [key, value] of Object.entries(args)) {
    if (value !== undefined && value !== null && key !== "content") {
      lines.push(`${key}: ${String(value).substring(0, 60)}`);
    }
  }
  return lines;
}

interface AIActionCardProps {
  action: PendingAction;
  onApprove: (action: PendingAction) => void;
  onReject: (action: PendingAction) => void;
  isLoading?: boolean;
  status?: "pending" | "approved" | "rejected";
}

export function AIActionCard({ action, onApprove, onReject, isLoading, status = "pending" }: AIActionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const preview = formatArgsPreview(action.toolName, action.args);
  const isDelete = action.level >= 3;
  const htmlContent = action.args.content as string | undefined;

  if (status === "approved") {
    return (
      <div className="rounded-lg border border-admin-green/30 bg-admin-green-dim p-3">
        <div className="flex items-center gap-2 text-xs text-admin-green">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 8l4 4 6-7" />
          </svg>
          <span className="font-medium">{action.summary} — Onaylandı</span>
        </div>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="rounded-lg border border-admin-border bg-admin-bg2 p-3">
        <div className="flex items-center gap-2 text-xs text-admin-muted">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
          <span>{action.summary} — Reddedildi</span>
        </div>
      </div>
    );
  }

  const borderColor = isDelete ? "border-admin-red/30" : "border-admin-amber/30";
  const bgColor = isDelete ? "bg-admin-red-dim" : "bg-admin-amber-dim";
  const badgeColor = isDelete ? "bg-admin-red/20 text-admin-red" : "bg-admin-amber/20 text-admin-amber";

  return (
    <div className={`rounded-lg border ${borderColor} ${bgColor} overflow-hidden`}>
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
          className={isDelete ? "text-admin-red" : "text-admin-amber"}>
          <path d="M8 5v4M8 11h.01" />
        </svg>
        <span className="flex-1 text-xs font-medium text-admin-text">{action.summary}</span>
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${badgeColor}`}>
          {isDelete ? "Kritik" : "Onay Gerekli"}
        </span>
      </div>

      {/* Preview */}
      {preview.length > 0 && (
        <div className="border-t border-inherit px-3 py-2 space-y-0.5">
          {preview.map((line, i) => (
            <p key={i} className="text-[11px] text-admin-muted">{line}</p>
          ))}
        </div>
      )}

      {/* HTML önizleme — content is admin-generated via AI, not user-submitted */}
      {htmlContent && (
        <div className="border-t border-inherit">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex w-full items-center gap-1 px-3 py-1.5 text-[10px] text-admin-muted hover:text-admin-text"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="8" cy="8" r="5" />
              <circle cx="8" cy="8" r="1" fill="currentColor" />
            </svg>
            <span>{expanded ? "Önizlemeyi Kapat" : "İçeriği Önizle"}</span>
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"
              className={`ml-auto transition-transform ${expanded ? "rotate-180" : ""}`}>
              <path d="M4 6l4 4 4-4" />
            </svg>
          </button>
          {expanded && (
            <div className="max-h-64 overflow-y-auto border-t border-inherit bg-admin-bg2 px-3 py-2">
              {/* Safe: content generated by AI assistant (Gemini), not external user input */}
              <div className="prose-blog text-xs" dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 border-t border-inherit px-3 py-2.5">
        <button
          onClick={() => onReject(action)}
          disabled={isLoading}
          className="rounded-lg border border-admin-border px-3 py-1.5 text-[11px] font-medium text-admin-muted hover:border-admin-red hover:text-admin-red disabled:opacity-50"
        >
          Reddet
        </button>
        <button
          onClick={() => onApprove(action)}
          disabled={isLoading}
          className="rounded-lg bg-admin-accent px-3 py-1.5 text-[11px] font-medium text-white hover:bg-admin-accent/80 disabled:opacity-50"
        >
          {isLoading ? "İşleniyor..." : "Onayla"}
        </button>
      </div>
    </div>
  );
}
