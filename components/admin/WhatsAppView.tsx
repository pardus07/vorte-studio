"use client";

import { useState } from "react";
import { logWhatsAppMessage } from "@/actions/whatsapp";
import { getNotificationTemplateList } from "@/lib/wa-notifications";
import type { WANotificationKey, WANotificationInput } from "@/lib/wa-notifications";
import { WA_NOTIFICATIONS } from "@/lib/wa-notifications";
import StatCard from "./StatCard";

type LogEntry = {
  id: string;
  phone: string;
  recipientName: string | null;
  template: string;
  message: string;
  contextType: string | null;
  contextId: string | null;
  sentBy: string;
  createdAt: string;
};

type Stats = {
  total: number;
  thisMonth: number;
  lastMonth: number;
  templateCounts: Record<string, number>;
};

const templates = getNotificationTemplateList();

const TEMPLATE_LABELS: Record<string, string> = {};
templates.forEach((t) => { TEMPLATE_LABELS[t.key] = t.label; });

const contextColors: Record<string, string> = {
  PROPOSAL: "bg-admin-blue/12 text-admin-blue",
  CONTRACT: "bg-admin-green/12 text-admin-green",
  PAYMENT: "bg-admin-amber/12 text-admin-amber",
  PROJECT: "bg-admin-accent/12 text-admin-accent",
  PORTAL: "bg-admin-purple/12 text-admin-purple",
  LEAD: "bg-admin-red/12 text-admin-red",
  MAINTENANCE: "bg-admin-blue/12 text-admin-blue",
};

export default function WhatsAppView({
  logs: initialLogs,
  stats,
}: {
  logs: LogEntry[];
  stats: Stats;
}) {
  const [logs] = useState(initialLogs);
  const [showModal, setShowModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<WANotificationKey>("teklif_gonderildi");
  const [phone, setPhone] = useState("");
  const [input, setInput] = useState<WANotificationInput>({});
  const [preview, setPreview] = useState("");
  const [sending, setSending] = useState(false);

  function updatePreview(tmpl: WANotificationKey, data: WANotificationInput) {
    const n = WA_NOTIFICATIONS[tmpl];
    if (n) setPreview(n.generate(data));
  }

  function handleTemplateChange(key: WANotificationKey) {
    setSelectedTemplate(key);
    updatePreview(key, input);
  }

  function handleInputChange(field: keyof WANotificationInput, value: string | number) {
    const updated = { ...input, [field]: value };
    setInput(updated);
    updatePreview(selectedTemplate, updated);
  }

  async function handleSend() {
    if (!phone) return;
    setSending(true);

    const tmplInfo = WA_NOTIFICATIONS[selectedTemplate];
    const result = await logWhatsAppMessage({
      phone,
      recipientName: input.contactName || input.firmName || undefined,
      template: selectedTemplate,
      templateInput: input,
      contextType: tmplInfo?.contextType,
    });

    if (result.success && result.waUrl) {
      window.open(result.waUrl, "_blank");
      setShowModal(false);
      setPhone("");
      setInput({});
      setPreview("");
    }

    setSending(false);
  }

  const inputCls =
    "w-full rounded-lg border border-admin-border bg-admin-bg3 px-3 py-2 text-[12px] text-admin-text focus:border-admin-accent focus:outline-none";

  return (
    <div className="space-y-5">
      {/* Başlık */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-admin-text">WhatsApp Mesajları</h1>
          <p className="mt-0.5 text-[13px] text-admin-muted">
            Şablon mesaj gönderimi ve geçmiş
          </p>
        </div>
        <button
          onClick={() => {
            setShowModal(true);
            updatePreview(selectedTemplate, input);
          }}
          className="rounded-lg bg-admin-green px-4 py-2 text-[12px] font-medium text-white shadow-sm shadow-admin-green/20 hover:brightness-110"
        >
          + Yeni Mesaj Gönder
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Toplam Mesaj"
          value={String(stats.total)}
          sub="Tüm zamanlar"
          color="green"
        />
        <StatCard
          label="Bu Ay"
          value={String(stats.thisMonth)}
          sub={stats.lastMonth > 0 ? `Geçen ay: ${stats.lastMonth}` : "İlk ay"}
          color="accent"
        />
        <StatCard
          label="En Çok Kullanılan"
          value={
            Object.entries(stats.templateCounts).sort(
              (a, b) => b[1] - a[1]
            )[0]?.[0]
              ? TEMPLATE_LABELS[
                  Object.entries(stats.templateCounts).sort(
                    (a, b) => b[1] - a[1]
                  )[0][0]
                ] || "—"
              : "—"
          }
          sub="En popüler şablon"
          color="blue"
        />
        <StatCard
          label="Şablon Sayısı"
          value={String(templates.length)}
          sub="Aktif bildirim şablonu"
          color="blue"
        />
      </div>

      {/* Mesaj Geçmişi */}
      <div className="rounded-xl border border-admin-border bg-admin-bg2">
        <div className="border-b border-admin-border px-5 py-3.5">
          <h3 className="text-[13px] font-semibold text-admin-text">
            Mesaj Geçmişi
          </h3>
        </div>

        {logs.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <div className="text-3xl mb-2">📱</div>
            <p className="text-sm text-admin-muted">
              Henüz WhatsApp mesajı gönderilmedi
            </p>
          </div>
        ) : (
          <div className="divide-y divide-admin-border">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-4 px-5 py-4 hover:bg-admin-bg3/50 transition-colors"
              >
                {/* WA Icon */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-admin-green/12">
                  <svg
                    className="h-4 w-4 text-admin-green"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium text-admin-text">
                      {log.recipientName || log.phone}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        contextColors[log.contextType || ""] ||
                        "bg-admin-bg4 text-admin-muted"
                      }`}
                    >
                      {TEMPLATE_LABELS[log.template] || log.template}
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] text-admin-muted line-clamp-2">
                    {log.message}
                  </p>
                  <div className="mt-1.5 flex items-center gap-3 text-[11px] text-admin-muted2">
                    <span>
                      {new Date(log.createdAt).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span>+{log.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Yeni Mesaj Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-admin-border bg-admin-bg2 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-admin-text">
                WhatsApp Bildirim Gönder
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-admin-muted hover:text-admin-text text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Telefon */}
              <div>
                <label className="mb-1 block text-[11px] font-medium text-admin-muted">
                  Telefon Numarası *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="05XX XXX XX XX"
                  className={inputCls}
                />
              </div>

              {/* Şablon */}
              <div>
                <label className="mb-1 block text-[11px] font-medium text-admin-muted">
                  Mesaj Şablonu *
                </label>
                <select
                  value={selectedTemplate}
                  onChange={(e) =>
                    handleTemplateChange(e.target.value as WANotificationKey)
                  }
                  className={inputCls}
                >
                  {templates.map((t) => (
                    <option key={t.key} value={t.key}>
                      {t.label} — {t.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dinamik Alanlar */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-admin-muted">
                    Firma Adı
                  </label>
                  <input
                    value={input.firmName || ""}
                    onChange={(e) =>
                      handleInputChange("firmName", e.target.value)
                    }
                    placeholder="Firma adı"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-admin-muted">
                    İletişim Adı
                  </label>
                  <input
                    value={input.contactName || ""}
                    onChange={(e) =>
                      handleInputChange("contactName", e.target.value)
                    }
                    placeholder="Kişi adı"
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-admin-muted">
                    Tutar (₺)
                  </label>
                  <input
                    type="number"
                    value={input.totalPrice || ""}
                    onChange={(e) =>
                      handleInputChange("totalPrice", Number(e.target.value))
                    }
                    placeholder="0"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-admin-muted">
                    Proje / Aşama
                  </label>
                  <input
                    value={input.stage || ""}
                    onChange={(e) =>
                      handleInputChange("stage", e.target.value)
                    }
                    placeholder="Tasarım, Geliştirme..."
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-medium text-admin-muted">
                  Ek Not (opsiyonel)
                </label>
                <input
                  value={input.customNote || ""}
                  onChange={(e) =>
                    handleInputChange("customNote", e.target.value)
                  }
                  placeholder="Mesaja ek not..."
                  className={inputCls}
                />
              </div>

              {/* Önizleme */}
              {preview && (
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-admin-muted">
                    Mesaj Önizlemesi
                  </label>
                  <div className="rounded-lg border border-admin-border bg-admin-bg4 p-3 text-[12px] text-admin-text whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {preview}
                  </div>
                </div>
              )}

              {/* Butonlar */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-admin-border px-4 py-2 text-[12px] font-medium text-admin-muted hover:bg-admin-bg3"
                >
                  İptal
                </button>
                <button
                  onClick={handleSend}
                  disabled={!phone || sending}
                  className="rounded-lg bg-admin-green px-5 py-2 text-[12px] font-medium text-white hover:brightness-110 disabled:opacity-50"
                >
                  {sending ? "Gönderiliyor..." : "WhatsApp'ta Aç"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
