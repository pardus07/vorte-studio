"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

/* ─── Types ─── */

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  executedTools?: string[];
};

type PendingApproval = {
  toolName: string;
  args: Record<string, unknown>;
  level: number;
  summary: string;
};

/* ─── Constants ─── */

const STORAGE_KEY = "vorte-ai-messages";
const MAX_MESSAGES = 50;

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/* ─── Component ─── */

export default function AiPanel() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState<PendingApproval | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [shortcuts, setShortcuts] = useState<{ label: string; prompt: string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load messages from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setMessages(JSON.parse(saved));
    } catch {}
  }, []);

  // Persist messages
  useEffect(() => {
    try {
      const trimmed = messages.slice(-MAX_MESSAGES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch {}
  }, [messages]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Keyboard shortcut: Ctrl+K
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Load shortcuts based on page
  useEffect(() => {
    const contextMap: Record<string, { label: string; prompt: string }[]> = {
      "/admin/dashboard": [
        { label: "Durum ozeti", prompt: "Dashboard istatistiklerini ozetle" },
        { label: "Aktif projeler", prompt: "Aktif projeleri ve durumlarini goster" },
      ],
      "/admin/blog": [
        { label: "Yazilari listele", prompt: "Blog yazilarini listele ve ozetle" },
        { label: "Yeni SEO yazisi", prompt: "Web tasarim ajansi icin SEO uyumlu bir blog yazisi olustur." },
        { label: "Taslaklari goster", prompt: "Yayinlanmamis taslak blog yazilarini listele" },
      ],
      "/admin/crm": [
        { label: "Aktif musteriler", prompt: "Aktif musterileri listele" },
        { label: "Potansiyel musteriler", prompt: "Potansiyel musterileri listele" },
      ],
      "/admin/leads": [
        { label: "Tum lead'ler", prompt: "Lead pipeline'ini ozetle" },
      ],
      "/admin/projects": [
        { label: "Aktif projeler", prompt: "Devam eden projeleri goster" },
      ],
      "/admin/portfolio": [
        { label: "Portfolyo listele", prompt: "Yayinlanan portfolyo ogelerini listele" },
      ],
      "/admin/settings": [
        { label: "Ayarlari goster", prompt: "Mevcut site ayarlarini listele" },
      ],
    };

    setShortcuts(
      contextMap[pathname] || [
        { label: "Genel durum", prompt: "Dashboard istatistiklerini ozetle" },
      ]
    );
  }, [pathname]);

  /* ─── Send message ─── */

  const sendMessage = useCallback(
    async (text: string, approvedToolCall?: { toolName: string; args: Record<string, unknown> }) => {
      if (!text.trim() && !approvedToolCall) return;

      const userMsg: Message = { id: uid(), role: "user", content: text };
      const newMessages = approvedToolCall
        ? messages
        : [...messages, userMsg];

      if (!approvedToolCall) {
        setMessages(newMessages);
        setInput("");
      }

      setLoading(true);
      setPending(null);

      try {
        const res = await fetch("/api/admin/ai-assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
            pageContext: pathname,
            ...(approvedToolCall && { approvedToolCall }),
          }),
        });

        const data = await res.json();

        if (data.error) {
          setMessages((prev) => [
            ...prev,
            { id: uid(), role: "assistant", content: `Hata: ${data.error}` },
          ]);
        } else if (data.pendingApproval) {
          setPending(data.pendingApproval);
          if (data.reply) {
            setMessages((prev) => [
              ...prev,
              {
                id: uid(),
                role: "assistant",
                content: data.reply,
                executedTools: data.executedTools,
              },
            ]);
          }
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: uid(),
              role: "assistant",
              content: data.reply || "Yanit alinamadi.",
              imageUrl: data.imageUrl,
              executedTools: data.executedTools,
            },
          ]);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          { id: uid(), role: "assistant", content: "Baglanti hatasi. Tekrar deneyin." },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [messages, pathname]
  );

  /* ─── Handle approval ─── */

  const handleApprove = () => {
    if (!pending) return;
    if (pending.level >= 3) {
      setShowConfirm(true);
      return;
    }
    sendMessage("", { toolName: pending.toolName, args: pending.args });
  };

  const handleConfirmDelete = () => {
    if (!pending) return;
    setShowConfirm(false);
    sendMessage("", { toolName: pending.toolName, args: pending.args });
  };

  const handleReject = () => {
    setPending(null);
    setShowConfirm(false);
    setMessages((prev) => [
      ...prev,
      { id: uid(), role: "assistant", content: "Islem iptal edildi." },
    ]);
  };

  /* ─── Clear chat ─── */

  const clearChat = () => {
    setMessages([]);
    setPending(null);
    setShowConfirm(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  /* ─── Handle keydown ─── */

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  /* ─── Render ─── */

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        title="AI Asistan (Ctrl+K)"
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-admin-accent shadow-lg shadow-admin-accent/20 text-white transition-transform hover:scale-105 active:scale-95"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2a7 7 0 017 7v1a7 7 0 01-14 0V9a7 7 0 017-7z" />
          <path d="M8 21h8M12 17v4" />
          <circle cx="9" cy="10" r="1" fill="currentColor" />
          <circle cx="15" cy="10" r="1" fill="currentColor" />
        </svg>
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

      {/* Panel */}
      <div className="fixed bottom-6 right-6 z-50 flex w-[420px] max-h-[600px] flex-col overflow-hidden rounded-2xl border border-admin-border bg-admin-bg shadow-2xl shadow-black/40">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-admin-border px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-admin-accent text-xs font-bold text-white">
              AI
            </div>
            <span className="text-sm font-semibold text-admin-text">
              Vorte Asistan
            </span>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                title="Sohbeti temizle"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-admin-muted transition-colors hover:bg-admin-bg3 hover:text-admin-red"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 4h12M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M6 7v5M10 7v5M3 4l1 9a1 1 0 001 1h6a1 1 0 001-1l1-9" />
                </svg>
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              title="Kapat"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-admin-muted transition-colors hover:bg-admin-bg3 hover:text-admin-text"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ maxHeight: 420 }}>
          {messages.length === 0 && !loading ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-admin-accent/10 text-admin-accent">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a7 7 0 017 7v1a7 7 0 01-14 0V9a7 7 0 017-7z" />
                  <path d="M8 21h8M12 17v4" />
                </svg>
              </div>
              <p className="text-center text-xs text-admin-muted">
                Merhaba! Size nasil yardimci olabilirim?
              </p>
              {/* Quick actions */}
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {shortcuts.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => sendMessage(s.prompt)}
                    className="rounded-lg border border-admin-border bg-admin-bg2 px-3 py-1.5 text-xs text-admin-muted transition-colors hover:border-admin-accent/40 hover:text-admin-accent"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-admin-accent text-white"
                      : "bg-admin-bg3 text-admin-text"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  {msg.imageUrl && (
                    <div className="mt-2 overflow-hidden rounded-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={msg.imageUrl}
                        alt="AI tarafindan uretildi"
                        className="w-full rounded-lg"
                      />
                    </div>
                  )}
                  {msg.executedTools && msg.executedTools.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {msg.executedTools.map((t) => (
                        <span
                          key={t}
                          className="rounded bg-admin-accent/10 px-1.5 py-0.5 text-[10px] text-admin-accent"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {/* Loading */}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1 rounded-xl bg-admin-bg3 px-4 py-3">
                <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-admin-accent [animation-delay:0ms]" />
                <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-admin-accent [animation-delay:150ms]" />
                <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-admin-accent [animation-delay:300ms]" />
              </div>
            </div>
          )}

          {/* Pending Approval Card */}
          {pending && !showConfirm && (
            <div className="rounded-xl border border-admin-amber/30 bg-admin-amber-dim p-3">
              <div className="flex items-start gap-2">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-admin-amber/20">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="text-admin-amber">
                    <path d="M8 5v4M8 11h.01" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-admin-amber">{pending.summary}</p>
                  <p className="mt-1 text-[11px] text-admin-muted">
                    {pending.level >= 3
                      ? "Bu silme islemi geri alinamaz. Onayliyor musunuz?"
                      : "Bu islemi onayliyor musunuz?"}
                  </p>
                  <pre className="mt-2 max-h-24 overflow-auto rounded bg-admin-bg2 p-2 text-[10px] text-admin-muted">
                    {JSON.stringify(pending.args, null, 2)}
                  </pre>
                  <div className="mt-2.5 flex gap-2">
                    <button
                      onClick={handleApprove}
                      className="rounded-lg bg-admin-accent px-3 py-1 text-[11px] font-medium text-white transition-colors hover:bg-admin-accent/80"
                    >
                      Onayla
                    </button>
                    <button
                      onClick={handleReject}
                      className="rounded-lg border border-admin-border px-3 py-1 text-[11px] text-admin-muted transition-colors hover:border-admin-red hover:text-admin-red"
                    >
                      Iptal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Level 3 Double Confirm Dialog */}
          {showConfirm && pending && (
            <div className="rounded-xl border border-admin-red/40 bg-admin-red-dim p-3">
              <div className="flex items-start gap-2">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-admin-red/20">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="text-admin-red">
                    <path d="M8 5v4M8 11h.01" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-admin-red">
                    Dikkat! Silme islemi geri alinamaz.
                  </p>
                  <p className="mt-1 text-[11px] text-admin-muted">
                    &quot;{pending.summary}&quot; islemini kesinlikle onayliyor musunuz?
                  </p>
                  <div className="mt-2.5 flex gap-2">
                    <button
                      onClick={handleConfirmDelete}
                      className="rounded-lg bg-admin-red px-3 py-1 text-[11px] font-medium text-white transition-colors hover:bg-admin-red/80"
                    >
                      Evet, Sil
                    </button>
                    <button
                      onClick={handleReject}
                      className="rounded-lg border border-admin-border px-3 py-1 text-[11px] text-admin-muted transition-colors hover:border-admin-muted hover:text-admin-text"
                    >
                      Vazgec
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-admin-border p-3">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Mesajinizi yazin..."
              rows={1}
              className="flex-1 resize-none rounded-xl border border-admin-border bg-admin-bg2 px-3.5 py-2.5 text-[13px] text-admin-text placeholder-admin-muted2 outline-none transition-colors focus:border-admin-accent/50"
              style={{ maxHeight: 100 }}
              disabled={loading}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-admin-accent text-white transition-all hover:bg-admin-accent/80 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2L7 9M14 2l-4.5 12L7 9 2 7.5 14 2z" />
              </svg>
            </button>
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-[10px] text-admin-muted2">
              Enter gonder &middot; Shift+Enter yeni satir
            </span>
            <span className="text-[10px] text-admin-muted2">
              Ctrl+K ile ac/kapat
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
