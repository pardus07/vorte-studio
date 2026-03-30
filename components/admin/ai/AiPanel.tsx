"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { AIMessageBubble, type ChatMessage, type PendingAction } from "./AIMessageBubble";
import { AIQuickActions } from "./AIQuickActions";
import { AIConfirmDialog } from "./AIConfirmDialog";

const STORAGE_KEY = "vorte-ai-messages";

function loadMessages(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatMessage[];
    return parsed.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }));
  } catch {
    return [];
  }
}

function saveMessages(messages: ChatMessage[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-100)));
  } catch {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-50)));
    } catch { /* ignore */ }
  }
}

/* ─── Sayfa kısayolları ─── */
const SHORTCUTS: Record<string, { label: string; prompt: string }[]> = {
  "/admin/dashboard": [
    { label: "Durum özeti", prompt: "Dashboard istatistiklerini özetle" },
    { label: "Aktif projeler", prompt: "Aktif projeleri ve durumlarını göster" },
  ],
  "/admin/blog": [
    { label: "Yazıları listele", prompt: "Blog yazılarını listele ve özetle" },
    { label: "Yeni SEO yazısı", prompt: "Web tasarım ajansı için SEO uyumlu bir blog yazısı oluştur." },
    { label: "Taslakları göster", prompt: "Yayınlanmamış taslak blog yazılarını listele" },
  ],
  "/admin/crm": [
    { label: "Aktif müşteriler", prompt: "Aktif müşterileri listele" },
    { label: "Potansiyel müşteriler", prompt: "Potansiyel müşterileri listele" },
  ],
  "/admin/leads": [
    { label: "Tüm lead'ler", prompt: "Lead pipeline'ını özetle" },
  ],
  "/admin/projects": [
    { label: "Aktif projeler", prompt: "Devam eden projeleri göster" },
  ],
  "/admin/portfolio": [
    { label: "Portfolyo listele", prompt: "Yayınlanan portfolyo öğelerini listele" },
  ],
  "/admin/settings": [
    { label: "Ayarları göster", prompt: "Mevcut site ayarlarını listele" },
  ],
};

const PAGE_TITLES: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/blog": "Blog",
  "/admin/crm": "CRM",
  "/admin/leads": "Lead Pipeline",
  "/admin/projects": "Projeler",
  "/admin/portfolio": "Portfolyo",
  "/admin/settings": "Ayarlar",
  "/admin/finance": "Finans",
  "/admin/maintenance": "Bakım",
  "/admin/prospect": "Müşteri Bul",
  "/admin/quotes": "Teklifler",
};

export default function AiPanel() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadMessages());
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    action: PendingAction | null;
    messageId: string;
  }>({ isOpen: false, action: null, messageId: "" });

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const pageTitle = PAGE_TITLES[pathname] || "Admin";
  const shortcuts = SHORTCUTS[pathname] || [
    { label: "Genel durum", prompt: "Dashboard istatistiklerini özetle" },
  ];

  // Persist
  useEffect(() => { saveMessages(messages); }, [messages]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  // Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Focus on open
  useEffect(() => {
    if (isOpen && inputRef.current) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  // Send message
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const allMessages = [...messages, userMsg];
      const res = await fetch("/api/admin/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: allMessages.map((m) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.content,
          })),
          pageContext: pathname,
        }),
      });

      const data = await res.json();

      if (data.error) {
        addAssistantMessage(`Hata: ${data.error}`);
      } else if (data.pendingApproval) {
        const aiMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.reply || `${data.pendingApproval.summary} için onay bekleniyor...`,
          timestamp: new Date(),
          executedTools: data.executedTools,
          pendingAction: data.pendingApproval,
          actionStatus: "pending",
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        const aiMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.reply || "Yanıt alınamadı.",
          timestamp: new Date(),
          imageUrl: data.imageUrl,
          executedTools: data.executedTools,
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch {
      addAssistantMessage("Bağlantı hatası. Tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  }, [messages, pathname, isLoading]);

  function addAssistantMessage(text: string) {
    setMessages((prev) => [...prev, {
      id: crypto.randomUUID(),
      role: "assistant",
      content: text,
      timestamp: new Date(),
    }]);
  }

  // Approval
  const handleApprove = (action: PendingAction, messageId: string) => {
    if (action.level >= 3) {
      setConfirmDialog({ isOpen: true, action, messageId });
      return;
    }
    executeApproval(action, messageId);
  };

  const executeApproval = async (action: PendingAction, messageId: string) => {
    setIsActionLoading(true);
    setConfirmDialog({ isOpen: false, action: null, messageId: "" });

    try {
      const res = await fetch("/api/admin/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approvedToolCall: {
            toolName: action.toolName,
            args: action.args,
          },
        }),
      });

      const data = await res.json();

      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, actionStatus: "approved" as const } : m
        )
      );

      addAssistantMessage(data.reply || "İşlem tamamlandı.");
    } catch {
      addAssistantMessage("Onay işlemi sırasında hata oluştu.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReject = (action: PendingAction, messageId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, actionStatus: "rejected" as const } : m
      )
    );
    setMessages((prev) => [...prev, {
      id: crypto.randomUUID(),
      role: "system" as const,
      content: `${action.summary} reddedildi.`,
      timestamp: new Date(),
    }]);
  };

  const clearChat = () => {
    setMessages([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  const panelWidth = isExpanded ? "w-[600px]" : "w-[420px]";

  return (
    <>
      {/* Floating Button — Claude terracotta rengi */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all hover:scale-105 active:scale-95"
          style={{ background: "linear-gradient(135deg, #da7756 0%, #c15a3a 100%)", boxShadow: "0 8px 24px rgba(218, 119, 86, 0.35)" }}
          title="Vorte Asistan (Ctrl+K)"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M12 3l1.5 4.5H18l-3.5 2.5L16 14.5 12 12l-4 2.5 1.5-4.5L6 7.5h4.5z" />
          </svg>
        </button>
      )}

      {/* Panel — tam yükseklik sidebar */}
      {isOpen && (
        <div
          className={`fixed bottom-0 right-0 top-0 z-50 ${panelWidth} flex flex-col border-l border-admin-border bg-admin-bg shadow-2xl shadow-black/50 transition-all duration-300`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-admin-border px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{ background: "linear-gradient(135deg, #da7756 0%, #c15a3a 100%)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M12 3l1.5 4.5H18l-3.5 2.5L16 14.5 12 12l-4 2.5 1.5-4.5L6 7.5h4.5z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-admin-text">Vorte Asistan</h2>
                <p className="text-[10px] text-admin-muted2">
                  {pageTitle} &middot; Gemini 2.5 Flash
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="rounded-lg p-1.5 text-admin-muted hover:bg-admin-bg3 hover:text-admin-red"
                  title="Sohbeti Temizle"
                >
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M2 4h12M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M6 7v5M10 7v5M3 4l1 9a1 1 0 001 1h6a1 1 0 001-1l1-9" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="rounded-lg p-1.5 text-admin-muted hover:bg-admin-bg3 hover:text-admin-text"
                title={isExpanded ? "Küçült" : "Genişlet"}
              >
                {isExpanded ? (
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M10 2h4v4M6 14H2v-4M14 2L9 7M2 14l5-5" />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 10v4h-4M2 6V2h4M14 14L9 9M2 2l5 5" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-admin-muted hover:bg-admin-bg3 hover:text-admin-text"
                title="Kapat (Ctrl+K)"
              >
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages / Quick Actions */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              <AIQuickActions shortcuts={shortcuts} onAction={sendMessage} />
            ) : (
              <div className="space-y-1 py-3">
                {messages.map((msg) => (
                  <AIMessageBubble
                    key={msg.id}
                    message={msg}
                    onApproveAction={
                      msg.pendingAction
                        ? (action) => handleApprove(action, msg.id)
                        : undefined
                    }
                    onRejectAction={
                      msg.pendingAction
                        ? (action) => handleReject(action, msg.id)
                        : undefined
                    }
                    isActionLoading={isActionLoading}
                  />
                ))}

                {/* Loading */}
                {isLoading && (
                  <div className="flex gap-2.5 px-4 py-2">
                    <div
                      className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-white"
                      style={{ background: "linear-gradient(135deg, #da7756, #c15a3a)" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M12 3l1.5 4.5H18l-3.5 2.5L16 14.5 12 12l-4 2.5 1.5-4.5L6 7.5h4.5z" />
                      </svg>
                    </div>
                    <div className="rounded-2xl rounded-tl-sm border border-admin-border bg-admin-bg3 px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 animate-bounce rounded-full [animation-delay:-0.3s]" style={{ background: "#da7756" }} />
                        <div className="h-2 w-2 animate-bounce rounded-full [animation-delay:-0.15s]" style={{ background: "#da7756" }} />
                        <div className="h-2 w-2 animate-bounce rounded-full" style={{ background: "#da7756" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-admin-border p-3">
            <div className="flex items-end gap-2 rounded-xl border border-admin-border bg-admin-bg2 px-3 py-2 focus-within:border-[#da7756]/50 focus-within:ring-1 focus-within:ring-[#da7756]/20">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Mesajınızı yazın..."
                rows={1}
                className="max-h-[120px] flex-1 resize-none bg-transparent text-[13px] text-admin-text placeholder-admin-muted2 outline-none"
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-white transition-colors disabled:opacity-30"
                style={{ background: !input.trim() || isLoading ? "#555" : "#da7756" }}
              >
                {isLoading ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" className="animate-spin">
                    <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="8" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 2L7 9M14 2l-4.5 12L7 9 2 7.5 14 2z" />
                  </svg>
                )}
              </button>
            </div>
            <p className="mt-1.5 text-center text-[10px] text-admin-muted2">
              Ctrl+K ile aç/kapat &middot; Enter gönder &middot; Shift+Enter yeni satır
            </p>
          </div>
        </div>
      )}

      {/* Level 3 çift onay */}
      <AIConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Kritik İşlem Onayı"
        description={confirmDialog.action?.summary || ""}
        details={
          confirmDialog.action
            ? JSON.stringify(confirmDialog.action.args, null, 2)
            : undefined
        }
        isLoading={isActionLoading}
        onConfirm={() => {
          if (confirmDialog.action) {
            executeApproval(confirmDialog.action, confirmDialog.messageId);
          }
        }}
        onCancel={() =>
          setConfirmDialog({ isOpen: false, action: null, messageId: "" })
        }
      />
    </>
  );
}
