"use client";

import { AIActionCard } from "./AIActionCard";

export type ApprovalLevel = 1 | 2 | 3;

export interface PendingAction {
  toolName: string;
  args: Record<string, unknown>;
  level: ApprovalLevel;
  summary: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  imageUrl?: string;
  executedTools?: string[];
  pendingAction?: PendingAction;
  actionStatus?: "pending" | "approved" | "rejected";
}

interface AIMessageBubbleProps {
  message: ChatMessage;
  onApproveAction?: (action: PendingAction) => void;
  onRejectAction?: (action: PendingAction) => void;
  isActionLoading?: boolean;
}

export function AIMessageBubble({
  message,
  onApproveAction,
  onRejectAction,
  isActionLoading,
}: AIMessageBubbleProps) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  if (isSystem) {
    return (
      <div className="flex justify-center px-4 py-1">
        <span className="rounded-full bg-admin-bg3 px-3 py-1 text-[10px] text-admin-muted">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex gap-2.5 px-4 py-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          isUser
            ? "bg-admin-bg4 text-admin-text"
            : "bg-gradient-to-br from-admin-accent to-orange-600 text-white"
        }`}
      >
        {isUser ? (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="8" cy="5" r="3" />
            <path d="M2 14c0-3 2.5-5 6-5s6 2 6 5" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3l1.5 4.5H18l-3.5 2.5L16 14.5 12 12l-4 2.5 1.5-4.5L6 7.5h4.5z" />
          </svg>
        )}
      </div>

      {/* Mesaj */}
      <div className={`max-w-[85%] space-y-2 ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
            isUser
              ? "rounded-tr-sm bg-[#2a2a2e] text-white"
              : "rounded-tl-sm border border-admin-border bg-admin-bg3 text-admin-text"
          }`}
        >
          <div className="whitespace-pre-wrap">{message.content}</div>

          {/* Görsel */}
          {message.imageUrl && (
            <div className="mt-2 overflow-hidden rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={message.imageUrl} alt="AI tarafından üretildi" className="w-full rounded-lg" />
            </div>
          )}

          {/* Tool badge'leri */}
          {message.executedTools && message.executedTools.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {message.executedTools.map((t) => (
                <span key={t} className="rounded bg-admin-accent/10 px-1.5 py-0.5 text-[10px] text-admin-accent">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Onay kartı */}
        {message.pendingAction && onApproveAction && onRejectAction && (
          <AIActionCard
            action={message.pendingAction}
            onApprove={onApproveAction}
            onReject={onRejectAction}
            isLoading={isActionLoading}
            status={message.actionStatus}
          />
        )}

        {/* Zaman */}
        <p className={`text-[10px] text-admin-muted2 ${isUser ? "text-right" : "text-left"}`}>
          {message.timestamp.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}
