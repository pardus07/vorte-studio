"use client";

import { useState } from "react";
import { upsertSetting } from "@/actions/settings";

type Props = {
  initialSettings: Record<string, string>;
};

const FIELDS = [
  { key: "whatsapp_number", label: "WhatsApp Numarası", placeholder: "905XXXXXXXXX", type: "text" },
  { key: "email", label: "E-posta", placeholder: "studio@vorte.com.tr", type: "text" },
  { key: "github_url", label: "GitHub URL", placeholder: "https://github.com/...", type: "text" },
  { key: "description", label: "Site Açıklaması", placeholder: "Kısa site açıklaması...", type: "textarea" },
] as const;

export default function SettingsForm({ initialSettings }: Props) {
  const [form, setForm] = useState<Record<string, string>>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  function showNotif(msg: string, type: "success" | "error") {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  }

  async function handleSave() {
    setSaving(true);

    const changed = FIELDS.filter((f) => form[f.key] !== initialSettings[f.key]);

    if (changed.length === 0) {
      showNotif("Değişiklik yok.", "error");
      setSaving(false);
      return;
    }

    let hasError = false;
    for (const field of changed) {
      const result = await upsertSetting(field.key, form[field.key]);
      if (!result.success) {
        hasError = true;
        showNotif(result.error || `${field.label} güncellenemedi.`, "error");
        break;
      }
    }

    if (!hasError) {
      showNotif(`${changed.length} ayar güncellendi.`, "success");
    }

    setSaving(false);
  }

  const inputCls =
    "w-full rounded-lg border border-admin-border bg-admin-bg3 px-3 py-2 text-[13px] text-admin-text focus:border-admin-accent focus:outline-none";

  return (
    <div className="space-y-4">
      {notification && (
        <div
          className={`rounded-lg border px-4 py-2.5 text-[12px] font-medium ${
            notification.type === "success"
              ? "border-admin-green bg-admin-green-dim text-admin-green"
              : "border-admin-red bg-admin-red-dim text-admin-red"
          }`}
        >
          {notification.msg}
        </div>
      )}

      <div className="rounded-xl border border-admin-border bg-admin-bg2 p-5 space-y-4">
        {FIELDS.map((field) => (
          <div key={field.key}>
            <label className="mb-1 block text-[11px] font-medium text-admin-muted">
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea
                value={form[field.key] ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                rows={3}
                className={inputCls + " resize-none"}
              />
            ) : (
              <input
                value={form[field.key] ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                className={inputCls}
              />
            )}
          </div>
        ))}

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-admin-accent px-5 py-2 text-[12px] font-medium text-white hover:brightness-110 disabled:opacity-50"
          >
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}
