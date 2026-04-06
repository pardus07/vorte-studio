"use client";

import { useState, useEffect } from "react";
import { getClientDeletionInfo, deleteClient } from "@/actions/crm";

type DeletionInfo = {
  id: string;
  name: string;
  company: string | null;
  status: string;
  totalRevenue: number;
  projectCount: number;
  quoteCount: number;
  maintenanceCount: number;
  activityCount: number;
};

type WarningLevel = "safe" | "warning" | "danger";

/**
 * İŞ KURALI: Bir müşterinin silinme tehlike seviyesini belirler.
 *
 * - ACTIVE veya MAINTENANCE              → "danger" (çift onay)
 * - POTENTIAL/INACTIVE + bağlı verisi var → "warning" ("SİL" yaz)
 * - POTENTIAL/INACTIVE + boş             → "safe" (tek tık — test kayıtları için)
 */
function getDeleteWarningLevel(info: DeletionInfo): WarningLevel {
  if (info.status === "ACTIVE" || info.status === "MAINTENANCE") {
    return "danger";
  }
  const hasData =
    info.projectCount > 0 ||
    info.quoteCount > 0 ||
    info.maintenanceCount > 0;
  if (hasData) {
    return "warning";
  }
  return "safe";
}

const statusLabels: Record<string, string> = {
  ACTIVE: "Aktif",
  POTENTIAL: "Potansiyel",
  MAINTENANCE: "Bakım",
  INACTIVE: "Eski",
};

export default function DeleteClientModal({
  clientId,
  onClose,
  onDeleted,
}: {
  clientId: string;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [info, setInfo] = useState<DeletionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      const result = await getClientDeletionInfo(clientId);
      if (result.success && result.data) {
        setInfo(result.data);
      } else {
        setError(result.error || "Bilgi alınamadı.");
      }
      setLoading(false);
    })();
  }, [clientId]);

  async function handleDelete() {
    if (!info) return;
    setDeleting(true);
    setError(null);
    const result = await deleteClient(info.id, true); // force = true (kullanıcı onayladı)
    if (result.success) {
      onDeleted();
    } else {
      setError(result.error || "Silme başarısız.");
      setDeleting(false);
    }
  }

  const level = info ? getDeleteWarningLevel(info) : "warning";
  const requiresTyping = level === "warning" || level === "danger";
  const requiresAck = level === "danger";
  const canDelete =
    !deleting &&
    (!requiresTyping || confirmText === "SİL") &&
    (!requiresAck || acknowledged);

  // Renk paleti
  const colors = {
    safe: { bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.3)", text: "#22c55e" },
    warning: { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.3)", text: "#f59e0b" },
    danger: { bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.4)", text: "#ef4444" },
  }[level];

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
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#111114",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16,
          padding: 28,
          maxWidth: 480,
          width: "90%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#e8e8ea", margin: 0 }}>
            Müşteriyi Sil
          </h3>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "#6b6b72", fontSize: 20, cursor: "pointer" }}
          >
            ✕
          </button>
        </div>

        {loading && (
          <div style={{ padding: "32px 0", textAlign: "center", color: "#6b6b72", fontSize: 13 }}>
            Yükleniyor...
          </div>
        )}

        {!loading && info && (
          <>
            {/* Uyarı bandı */}
            <div
              style={{
                padding: "12px 14px",
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: 10,
                marginBottom: 16,
                fontSize: 12,
                color: colors.text,
                lineHeight: 1.5,
              }}
            >
              {level === "danger" && (
                <strong>⚠ TEHLİKELİ İŞLEM — Bu müşteri aktif/bakım durumunda.</strong>
              )}
              {level === "warning" && (
                <strong>⚠ Bağlı kayıtlar silinecek. Geri alınamaz.</strong>
              )}
              {level === "safe" && <strong>✓ Bağlı kayıt yok, güvenli silme.</strong>}
            </div>

            {/* Müşteri bilgisi */}
            <div
              style={{
                padding: 14,
                background: "#18181c",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 10,
                marginBottom: 16,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, color: "#e8e8ea", marginBottom: 4 }}>
                {info.name}
              </div>
              {info.company && (
                <div style={{ fontSize: 12, color: "#6b6b72", marginBottom: 8 }}>{info.company}</div>
              )}
              <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#6b6b72", flexWrap: "wrap" }}>
                <span>Durum: <strong style={{ color: "#e8e8ea" }}>{statusLabels[info.status] || info.status}</strong></span>
                <span>Toplam Gelir: <strong style={{ color: "#f97316" }}>₺{info.totalRevenue.toLocaleString("tr-TR")}</strong></span>
              </div>
            </div>

            {/* Bağlı kayıtlar — sadece veri varsa göster */}
            {level !== "safe" && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: "#6b6b72", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Birlikte Silinecek
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8, fontSize: 12 }}>
                  <div style={{ padding: "8px 12px", background: "#18181c", borderRadius: 8, color: "#e8e8ea" }}>
                    <strong style={{ color: "#f97316" }}>{info.projectCount}</strong> proje
                  </div>
                  <div style={{ padding: "8px 12px", background: "#18181c", borderRadius: 8, color: "#e8e8ea" }}>
                    <strong style={{ color: "#f97316" }}>{info.quoteCount}</strong> teklif
                  </div>
                  <div style={{ padding: "8px 12px", background: "#18181c", borderRadius: 8, color: "#e8e8ea" }}>
                    <strong style={{ color: "#f97316" }}>{info.maintenanceCount}</strong> bakım
                  </div>
                  <div style={{ padding: "8px 12px", background: "#18181c", borderRadius: 8, color: "#e8e8ea" }}>
                    <strong style={{ color: "#6b6b72" }}>{info.activityCount}</strong> aktivite (saklanır)
                  </div>
                </div>
              </div>
            )}

            {/* SİL yazma kutusu */}
            {requiresTyping && (
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 11, color: "#6b6b72", marginBottom: 6 }}>
                  Onaylamak için <strong style={{ color: colors.text }}>SİL</strong> yazın:
                </label>
                <input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="SİL"
                  style={{
                    width: "100%",
                    background: "#18181c",
                    border: `1px solid ${confirmText === "SİL" ? colors.border : "rgba(255,255,255,0.06)"}`,
                    borderRadius: 8,
                    padding: "10px 14px",
                    fontSize: 13,
                    color: "#e8e8ea",
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "monospace",
                    letterSpacing: 1,
                  }}
                />
              </div>
            )}

            {/* Danger seviyesi için ek checkbox */}
            {requiresAck && (
              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "10px 12px",
                  background: "rgba(239,68,68,0.05)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: 8,
                  marginBottom: 14,
                  cursor: "pointer",
                  fontSize: 12,
                  color: "#e8e8ea",
                  lineHeight: 1.5,
                }}
              >
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={(e) => setAcknowledged(e.target.checked)}
                  style={{ marginTop: 2, accentColor: "#ef4444" }}
                />
                <span>
                  Bu müşterinin tüm projelerinin, tekliflerinin ve bakım kayıtlarının
                  <strong> kalıcı olarak silineceğini </strong> anlıyorum.
                </span>
              </label>
            )}

            {error && (
              <div style={{ fontSize: 12, color: "#ef4444", marginBottom: 12 }}>{error}</div>
            )}

            {/* Butonlar */}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                onClick={onClose}
                disabled={deleting}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#e8e8ea",
                  padding: "10px 20px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: deleting ? "not-allowed" : "pointer",
                  opacity: deleting ? 0.5 : 1,
                }}
              >
                İptal
              </button>
              <button
                onClick={handleDelete}
                disabled={!canDelete}
                style={{
                  background: canDelete ? "#ef4444" : "rgba(239,68,68,0.3)",
                  border: "none",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: canDelete ? "pointer" : "not-allowed",
                }}
              >
                {deleting ? "Siliniyor..." : "Kalıcı Olarak Sil"}
              </button>
            </div>
          </>
        )}

        {!loading && error && !info && (
          <div style={{ padding: "16px 0", textAlign: "center", color: "#ef4444", fontSize: 13 }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
