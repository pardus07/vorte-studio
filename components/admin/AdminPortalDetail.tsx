"use client";

import { useState, useRef, useEffect, useCallback, useTransition } from "react";
import Link from "next/link";
import { setStagingUrl, resetDesignApproval } from "@/actions/design-preview";

interface Message {
  id: string; content: string; senderType: string; isRead: boolean; createdAt: string;
}

interface DesignRevisionItem {
  id: string;
  note: string;
  stagingUrlAtTime: string | null;
  createdAt: string;
}

interface DesignData {
  stagingUrl: string | null;
  designApprovedAt: string | null;
  usedRevisions: number;
  maxRevisions: number;
  revisions: DesignRevisionItem[];
}

interface AdminDetailData {
  user: {
    id: string; name: string; email: string; phone: string | null;
    firmName: string; isActive: boolean; lastLoginAt: string | null; createdAt: string;
  };
  proposal: {
    id: string; token: string; status: string; totalPrice: number;
    siteType: string | null; timeline: string | null;
  };
  contract: { id: string; status: string; signedAt: string | null } | null;
  payments: { id: string; stage: number; label: string; amount: number; status: string; paidAt: string | null }[];
  messages: Message[];
  files: { id: string; fileName: string; filePath: string; fileSize: number; fileType: string; uploadedBy: string; createdAt: string }[];
  design: DesignData;
}

function formatPrice(n: number) {
  return new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 0 }).format(n);
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminPortalDetail({ data }: { data: AdminDetailData }) {
  const { user, proposal, contract, payments, files, design } = data;
  const [messages, setMessages] = useState<Message[]>(data.messages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [tab, setTab] = useState<"messages" | "files" | "payments" | "design">("messages");
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // 5sn polling
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/admin/portal/messages?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch { /* sessiz */ }
    }, 5000);
    return () => clearInterval(interval);
  }, [user.id]);

  async function handleSend() {
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/admin/portal/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portalUserId: user.id, content: input.trim() }),
      });
      if (res.ok) {
        const msg = await res.json();
        setMessages((prev) => [...prev, msg]);
        setInput("");
      }
    } catch { /* hata */ }
    finally { setSending(false); }
  }

  const paidTotal = payments.filter((p) => p.status === "PAID").reduce((s, p) => s + p.amount, 0);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-xs text-[var(--color-admin-muted)]">
        <Link href="/admin/portal" className="hover:text-white">Müşteri Portalı</Link>
        <span>/</span>
        <span className="text-white">{user.firmName}</span>
      </div>

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold">{user.firmName}</h1>
          <p className="mt-0.5 text-sm text-[var(--color-admin-muted)]">
            {user.name} · {user.email} {user.phone ? `· ${user.phone}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`/teklif/${proposal.token}`}
            target="_blank"
            className="rounded-lg border border-[var(--color-admin-border)] px-3 py-1.5 text-xs text-[var(--color-admin-muted)] transition-colors hover:text-white"
          >
            Teklifi Gör
          </a>
          <span className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs ${
            contract?.status === "SIGNED"
              ? "bg-green-500/10 text-green-400"
              : "bg-amber-500/10 text-amber-400"
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${contract?.status === "SIGNED" ? "bg-green-500" : "bg-amber-500"}`} />
            {contract?.status === "SIGNED" ? "İmzalı" : "Sözleşme Bekleniyor"}
          </span>
        </div>
      </div>

      {/* Özet kartları */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--color-admin-border)] bg-[var(--color-admin-bg2)] p-4">
          <p className="text-xs text-[var(--color-admin-muted)]">Toplam Tutar</p>
          <p className="mt-1 text-lg font-bold">{formatPrice(proposal.totalPrice)} ₺</p>
        </div>
        <div className="rounded-xl border border-[var(--color-admin-border)] bg-[var(--color-admin-bg2)] p-4">
          <p className="text-xs text-[var(--color-admin-muted)]">Ödenen</p>
          <p className="mt-1 text-lg font-bold text-green-400">{formatPrice(paidTotal)} ₺</p>
        </div>
        <div className="rounded-xl border border-[var(--color-admin-border)] bg-[var(--color-admin-bg2)] p-4">
          <p className="text-xs text-[var(--color-admin-muted)]">Son Giriş</p>
          <p className="mt-1 text-sm font-medium">{user.lastLoginAt ? formatDate(user.lastLoginAt) : "Hiç giriş yapmadı"}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded-xl bg-[var(--color-admin-bg2)] p-1">
        {(["messages", "files", "payments", "design"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === t
                ? "bg-[var(--color-admin-accent)] text-white"
                : "text-[var(--color-admin-muted)] hover:text-white"
            }`}
          >
            {t === "messages"
              ? "Mesajlar"
              : t === "files"
              ? "Dosyalar"
              : t === "payments"
              ? "Ödemeler"
              : "Tasarım"}
          </button>
        ))}
      </div>

      {/* Messages Tab */}
      {tab === "messages" && (
        <div className="flex flex-col rounded-2xl border border-[var(--color-admin-border)] bg-[var(--color-admin-bg2)]" style={{ height: "500px" }}>
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-[var(--color-admin-muted)]">Henüz mesaj yok</p>
              </div>
            ) : (
              messages.map((m) => {
                const isAdmin = m.senderType === "ADMIN";
                return (
                  <div key={m.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                      isAdmin
                        ? "bg-[var(--color-admin-accent)] text-white rounded-br-md"
                        : "bg-white/[0.06] text-white/80 rounded-bl-md"
                    }`}>
                      {!isAdmin && (
                        <p className="mb-1 text-[10px] font-semibold text-[var(--color-admin-accent)]/70">{user.name}</p>
                      )}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                      <p className={`mt-1 text-[10px] text-right ${isAdmin ? "text-white/50" : "text-white/25"}`}>
                        {formatTime(m.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>
          <div className="flex gap-2 border-t border-[var(--color-admin-border)] p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Yanıt yaz..."
              className="flex-1 rounded-xl border border-[var(--color-admin-border)] bg-[var(--color-admin-bg)] px-4 py-2.5 text-sm text-white placeholder-[var(--color-admin-muted)] outline-none focus:border-[var(--color-admin-accent)]/40"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-admin-accent)] text-white disabled:opacity-30"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Files Tab */}
      {tab === "files" && (
        <div className="rounded-2xl border border-[var(--color-admin-border)] bg-[var(--color-admin-bg2)] p-4">
          {files.length === 0 ? (
            <p className="py-12 text-center text-sm text-[var(--color-admin-muted)]">Henüz dosya yok</p>
          ) : (
            <div className="space-y-2">
              {files.map((f) => (
                <div key={f.id} className="flex items-center gap-3 rounded-xl bg-white/[0.02] px-4 py-3">
                  <span className="text-xl">{f.fileType.startsWith("image/") ? "🖼️" : f.fileType.includes("pdf") ? "📄" : "📎"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{f.fileName}</p>
                    <p className="text-xs text-[var(--color-admin-muted)]">
                      {formatSize(f.fileSize)} · {formatDate(f.createdAt)} · {f.uploadedBy === "ADMIN" ? "Siz" : "Müşteri"}
                    </p>
                  </div>
                  <a href={f.filePath} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--color-admin-accent)] hover:underline">
                    İndir
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Design Tab */}
      {tab === "design" && (
        <AdminDesignTab portalUserId={user.id} initial={design} />
      )}

      {/* Payments Tab */}
      {tab === "payments" && (
        <div className="rounded-2xl border border-[var(--color-admin-border)] bg-[var(--color-admin-bg2)] p-4">
          <div className="space-y-2">
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl bg-white/[0.02] px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className={`h-2.5 w-2.5 rounded-full ${p.status === "PAID" ? "bg-green-500" : "bg-amber-500"}`} />
                  <div>
                    <p className="text-sm font-medium">{p.label}</p>
                    {p.paidAt && <p className="text-xs text-green-400/60">{formatDate(p.paidAt)}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{formatPrice(p.amount)} ₺</p>
                  <p className={`text-xs ${p.status === "PAID" ? "text-green-400" : "text-amber-400"}`}>
                    {p.status === "PAID" ? "Ödendi" : "Bekliyor"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Admin Design Tab ──────────────────────────────────────────
// Staging URL yönetimi + revizyon geçmişi. Optimistic update YOK —
// Server Action dönüşünde router.refresh yerine page-level
// revalidatePath zaten tetikleniyor, bu yüzden state'i lokal tutup
// başarıda sayfayı yenilemek yeterli.
function AdminDesignTab({
  portalUserId,
  initial,
}: {
  portalUserId: string;
  initial: DesignData;
}) {
  const [urlInput, setUrlInput] = useState(initial.stagingUrl || "");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const isApproved = Boolean(initial.designApprovedAt);
  const approvedDate = initial.designApprovedAt
    ? new Date(initial.designApprovedAt).toLocaleString("tr-TR", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  function handleSaveUrl() {
    setMsg(null);
    startTransition(async () => {
      const cleaned = urlInput.trim() || null;
      const res = await setStagingUrl(portalUserId, cleaned);
      if (res.success) {
        setMsg({ type: "ok", text: "Staging URL güncellendi" });
      } else {
        setMsg({ type: "err", text: res.error || "Hata oluştu" });
      }
    });
  }

  function handleClearUrl() {
    if (!confirm("Staging URL temizlenecek. Müşteri 'henüz hazır değil' durumunu görecek. Emin misiniz?")) return;
    setUrlInput("");
    setMsg(null);
    startTransition(async () => {
      const res = await setStagingUrl(portalUserId, null);
      if (res.success) {
        setMsg({ type: "ok", text: "URL temizlendi" });
      } else {
        setMsg({ type: "err", text: res.error || "Hata oluştu" });
      }
    });
  }

  function handleResetApproval() {
    if (
      !confirm(
        "Tasarım onayı geri alınacak. Müşteri tekrar revizyon isteyebilir. Bu acil durum kapısıdır — emin misiniz?"
      )
    )
      return;
    setMsg(null);
    startTransition(async () => {
      const res = await resetDesignApproval(portalUserId);
      if (res.success) {
        setMsg({ type: "ok", text: "Onay geri alındı. Sayfayı yenileyin." });
      } else {
        setMsg({ type: "err", text: res.error || "Hata oluştu" });
      }
    });
  }

  return (
    <div className="space-y-4">
      {/* Durum özeti */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--color-admin-border)] bg-[var(--color-admin-bg2)] p-4">
          <p className="text-xs text-[var(--color-admin-muted)]">Staging URL</p>
          <p className="mt-1 text-sm font-medium truncate">
            {initial.stagingUrl ? (
              <a
                href={initial.stagingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-admin-accent)] hover:underline"
              >
                {initial.stagingUrl}
              </a>
            ) : (
              <span className="text-[var(--color-admin-muted)]">—</span>
            )}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--color-admin-border)] bg-[var(--color-admin-bg2)] p-4">
          <p className="text-xs text-[var(--color-admin-muted)]">Onay Durumu</p>
          <p className={`mt-1 text-sm font-medium ${isApproved ? "text-green-400" : "text-amber-400"}`}>
            {isApproved ? `Onaylandı · ${approvedDate}` : "Onay Bekliyor"}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--color-admin-border)] bg-[var(--color-admin-bg2)] p-4">
          <p className="text-xs text-[var(--color-admin-muted)]">Revizyon</p>
          <p className="mt-1 text-sm font-medium">
            {initial.usedRevisions} / {initial.maxRevisions} kullanıldı
          </p>
        </div>
      </div>

      {/* URL form */}
      <div className="rounded-2xl border border-[var(--color-admin-border)] bg-[var(--color-admin-bg2)] p-4">
        <p className="mb-3 text-sm font-semibold">Staging URL Yönetimi</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://staging.vortestudio.com.tr/musteri-adi"
            className="flex-1 rounded-xl border border-[var(--color-admin-border)] bg-[var(--color-admin-bg)] px-4 py-2.5 text-sm text-white placeholder-[var(--color-admin-muted)] outline-none focus:border-[var(--color-admin-accent)]/40"
          />
          <button
            onClick={handleSaveUrl}
            disabled={isPending || urlInput.trim() === (initial.stagingUrl || "")}
            className="rounded-xl bg-[var(--color-admin-accent)] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-40"
          >
            Kaydet
          </button>
          {initial.stagingUrl && (
            <button
              onClick={handleClearUrl}
              disabled={isPending}
              className="rounded-xl border border-[var(--color-admin-border)] px-4 py-2.5 text-sm text-[var(--color-admin-muted)] hover:text-white"
            >
              Temizle
            </button>
          )}
        </div>
        {msg && (
          <p className={`mt-2 text-xs ${msg.type === "ok" ? "text-green-400" : "text-red-400"}`}>
            {msg.text}
          </p>
        )}
        <p className="mt-2 text-xs text-[var(--color-admin-muted)]">
          http:// veya https:// ile başlamalı. URL güncellendiğinde eski revizyon notları korunur
          (her biri kendi zamanındaki URL'i snapshot olarak tutuyor).
        </p>
      </div>

      {/* Onay acil durum kapısı */}
      {isApproved && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
          <p className="text-sm font-semibold text-amber-400">Acil Durum: Onayı Geri Al</p>
          <p className="mt-1 text-xs text-amber-400/70">
            Müşteri tasarımı onayladı ama bir hata fark edildiyse onayı geri alıp yeniden revizyon
            açabilirsiniz. Revizyon geçmişi silinmez.
          </p>
          <button
            onClick={handleResetApproval}
            disabled={isPending}
            className="mt-3 rounded-xl border border-amber-500/40 px-4 py-2 text-xs font-medium text-amber-400 hover:bg-amber-500/10"
          >
            Onayı Geri Al
          </button>
        </div>
      )}

      {/* Revizyon geçmişi */}
      <div className="rounded-2xl border border-[var(--color-admin-border)] bg-[var(--color-admin-bg2)] p-4">
        <p className="mb-3 text-sm font-semibold">
          Revizyon Geçmişi ({initial.revisions.length})
        </p>
        {initial.revisions.length === 0 ? (
          <p className="py-6 text-center text-sm text-[var(--color-admin-muted)]">
            Henüz revizyon talebi yok
          </p>
        ) : (
          <div className="space-y-3">
            {initial.revisions.map((r, idx) => (
              <div key={r.id} className="rounded-xl bg-white/[0.02] p-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--color-admin-accent)]">
                    #{initial.revisions.length - idx}
                  </span>
                  <span className="text-xs text-[var(--color-admin-muted)]">
                    {new Date(r.createdAt).toLocaleString("tr-TR", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-sm text-white/80 whitespace-pre-wrap">{r.note}</p>
                {r.stagingUrlAtTime && (
                  <p className="mt-2 text-[11px] text-[var(--color-admin-muted)]">
                    Zamanındaki URL:{" "}
                    <a
                      href={r.stagingUrlAtTime}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-white"
                    >
                      {r.stagingUrlAtTime}
                    </a>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
