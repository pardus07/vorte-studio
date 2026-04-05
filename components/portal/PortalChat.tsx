"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Message {
  id: string;
  content: string;
  senderType: string;
  isRead: boolean;
  createdAt: string;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

function formatDateLabel(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Bugün";
  if (d.toDateString() === yesterday.toDateString()) return "Dün";
  return d.toLocaleDateString("tr-TR", { day: "numeric", month: "long" });
}

export default function PortalChat({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Otomatik scroll
  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // 5 saniyede bir yeni mesaj kontrol
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/portal/messages");
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch {
        // sessiz hata
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  async function handleSend() {
    if (!input.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch("/api/portal/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input.trim() }),
      });

      if (res.ok) {
        const newMsg = await res.json();
        setMessages((prev) => [...prev, newMsg]);
        setInput("");
        inputRef.current?.focus();
      }
    } catch {
      // hata
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // Tarih grupları
  let lastDate = "";

  return (
    <div className="mx-auto flex h-[calc(100vh-7rem)] max-w-3xl flex-col lg:h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
          <svg className="h-5 w-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-bold">Mesajlar</h1>
          <p className="text-xs text-white/40">Vorte Studio ile iletişim</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-green-400">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
          Çevrimiçi
        </div>
      </div>

      {/* Mesaj alanı */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-white/[0.07] bg-bg2 p-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
            <div>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.03]">
                <svg className="h-8 w-8 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              </div>
              <p className="text-sm text-white/30">Henüz mesaj yok</p>
              <p className="mt-1 text-xs text-white/15">Mesajınızı yazın, size en kısa sürede dönüş yapacağız</p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {messages.map((m) => {
              const dateLabel = formatDateLabel(m.createdAt);
              let showDate = false;
              if (dateLabel !== lastDate) {
                lastDate = dateLabel;
                showDate = true;
              }

              const isCustomer = m.senderType === "CUSTOMER";

              return (
                <div key={m.id}>
                  {showDate && (
                    <div className="my-4 flex items-center gap-3">
                      <div className="h-px flex-1 bg-white/[0.05]" />
                      <span className="text-[10px] text-white/25 uppercase tracking-wider">{dateLabel}</span>
                      <div className="h-px flex-1 bg-white/[0.05]" />
                    </div>
                  )}
                  <div className={`flex ${isCustomer ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                        isCustomer
                          ? "bg-accent text-white rounded-br-md"
                          : "bg-white/[0.06] text-white/80 rounded-bl-md"
                      }`}
                    >
                      {!isCustomer && (
                        <p className="mb-1 text-[10px] font-semibold text-accent/70">Vorte Studio</p>
                      )}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                      <p className={`mt-1 text-[10px] text-right ${isCustomer ? "text-white/50" : "text-white/25"}`}>
                        {formatTime(m.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Mesaj gönderme */}
      <div className="mt-3 flex gap-2">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Mesajınızı yazın..."
          rows={1}
          className="flex-1 resize-none rounded-xl border border-white/[0.07] bg-bg2 px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-colors focus:border-[#FF4500]/30"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          className="flex h-[46px] w-[46px] flex-shrink-0 items-center justify-center rounded-xl bg-accent text-white transition-opacity disabled:opacity-30"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
