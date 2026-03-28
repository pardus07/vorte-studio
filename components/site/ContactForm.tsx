"use client";

import { useState } from "react";
import { sendContactForm } from "@/actions/contact";

const projectTypes = [
  "Web Sitesi",
  "E-Ticaret",
  "Mobil Uygulama",
  "Kurumsal Web",
  "Yeniden Tasarım",
  "Diğer",
];

export default function ContactForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    projectType: "Web Sitesi",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const result = await sendContactForm(form);
    if (result.success) {
      setStatus("sent");
    } else {
      setErrorMsg(result.error || "Bir hata oluştu.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.8)",
          backdropFilter: "blur(8px)",
        }}
        onClick={onClose}
      >
        <div
          style={{
            background: "#111114",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16,
            padding: 40,
            maxWidth: 420,
            width: "90%",
            textAlign: "center",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
          <h3
            style={{
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 8,
              color: "#e8e8ea",
            }}
          >
            Başvurunuz Alındı!
          </h3>
          <p style={{ fontSize: 14, color: "#6b6b72", lineHeight: 1.6 }}>
            En kısa sürede sizinle iletişime geçeceğiz. Genellikle 24 saat
            içinde dönüş yapıyoruz.
          </p>
          <button
            onClick={onClose}
            style={{
              marginTop: 24,
              background: "#f97316",
              color: "white",
              border: "none",
              padding: "12px 32px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Tamam
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#111114",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16,
          padding: 32,
          maxWidth: 480,
          width: "90%",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <h3
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#e8e8ea",
            }}
          >
            Proje Başvurusu
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#6b6b72",
              fontSize: 20,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 500,
                color: "#6b6b72",
                marginBottom: 6,
              }}
            >
              Ad Soyad *
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Adınız Soyadınız"
              style={{
                width: "100%",
                background: "#18181c",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: 13,
                color: "#e8e8ea",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 500,
                color: "#6b6b72",
                marginBottom: 6,
              }}
            >
              Telefon
            </label>
            <input
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              placeholder="0532 XXX XX XX"
              style={{
                width: "100%",
                background: "#18181c",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: 13,
                color: "#e8e8ea",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 500,
                color: "#6b6b72",
                marginBottom: 6,
              }}
            >
              Proje Türü
            </label>
            <select
              value={form.projectType}
              onChange={(e) =>
                setForm((p) => ({ ...p, projectType: e.target.value }))
              }
              style={{
                width: "100%",
                background: "#18181c",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: 13,
                color: "#e8e8ea",
                outline: "none",
                boxSizing: "border-box",
              }}
            >
              {projectTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 500,
                color: "#6b6b72",
                marginBottom: 6,
              }}
            >
              Mesajınız *
            </label>
            <textarea
              required
              value={form.message}
              onChange={(e) =>
                setForm((p) => ({ ...p, message: e.target.value }))
              }
              placeholder="Projeniz hakkında kısa bilgi verin..."
              rows={4}
              style={{
                width: "100%",
                background: "#18181c",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: 13,
                color: "#e8e8ea",
                outline: "none",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
          </div>

          {status === "error" && (
            <p style={{ fontSize: 12, color: "#ef4444" }}>{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            style={{
              background: "#f97316",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              cursor: status === "sending" ? "wait" : "pointer",
              opacity: status === "sending" ? 0.6 : 1,
              marginTop: 4,
            }}
          >
            {status === "sending" ? "Gönderiliyor..." : "Başvuru Gönder"}
          </button>
        </form>
      </div>
    </div>
  );
}
