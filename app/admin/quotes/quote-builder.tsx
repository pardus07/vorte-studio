"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createQuote, sendQuoteMail } from "@/actions/quotes";

const packages = [
  { value: "temel", label: "Temel Site", price: 12000 },
  { value: "profesyonel", label: "Profesyonel Kurumsal", price: 22000 },
  { value: "eticaret", label: "E-Ticaret", price: 35000 },
  { value: "android", label: "Android MVP", price: 55000 },
];

const addonList = [
  { key: "seo", label: "SEO Setup", price: 3000 },
  { key: "dil", label: "Çoklu Dil", price: 8000 },
  { key: "eticaret", label: "E-ticaret Modülü", price: 12000 },
  { key: "bakim", label: "1 Yıl Bakım", price: 18000 },
];

const statusBadge: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Taslak", color: "bg-admin-bg4 text-admin-muted" },
  SENT: { label: "Yanıt bekliyor", color: "bg-admin-amber-dim text-admin-amber" },
  VIEWED: { label: "Görüldü", color: "bg-admin-blue-dim text-admin-blue" },
  ACCEPTED: { label: "Onaylandı", color: "bg-admin-green-dim text-admin-green" },
  REJECTED: { label: "Reddedildi", color: "bg-admin-red-dim text-admin-red" },
};

type Quote = { id: string; client: string; packageType: string; total: number; createdAt: string; status: string; daysWaiting: number };
type Client = { id: string; name: string; email: string | null };

export default function QuoteBuilder({ clients, recentQuotes }: { clients: Client[]; recentQuotes: Quote[] }) {
  const router = useRouter();
  const [selectedClient, setSelectedClient] = useState(clients[0]?.id || "");
  const [selectedPackage, setSelectedPackage] = useState("temel");
  const [addons, setAddons] = useState<Record<string, boolean>>({});
  const [notification, setNotification] = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [mailLoading, setMailLoading] = useState(false);

  const pkg = packages.find((p) => p.value === selectedPackage)!;
  const addonTotal = useMemo(() => addonList.reduce((sum, a) => sum + (addons[a.key] ? a.price : 0), 0), [addons]);
  const total = pkg.price + addonTotal;
  const pay1 = Math.round(total * 0.4);
  const pay2 = Math.round(total * 0.3);
  const pay3 = total - pay1 - pay2;
  const fmt = (n: number) => `₺${n.toLocaleString("tr-TR")}`;

  const clientObj = clients.find((c) => c.id === selectedClient);
  const clientName = clientObj?.name || "Müşteri";

  function showNotif(msg: string, type: "success" | "error" | "info" = "info") {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 5000);
  }

  async function handlePdf() {
    setPdfLoading(true);

    // 1. DB'ye kaydet
    const selectedAddons = addonList.filter((a) => addons[a.key]).map((a) => ({ name: a.label, price: a.price }));
    const quoteResult = await createQuote({
      clientId: selectedClient,
      packageType: pkg.label,
      basePrice: pkg.price,
      addons: selectedAddons,
      total,
    });

    // 2. PDF oluştur ve indir
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const { default: QuotePDF } = await import("./quote-pdf");

      const blob = await pdf(
        <QuotePDF
          clientName={clientName}
          packageName={pkg.label}
          packagePrice={pkg.price}
          addons={selectedAddons}
          total={total}
          quoteNumber={quoteResult.success ? quoteResult.quoteNumber! : "QUOTE-DRAFT"}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Teklif_${clientName.replace(/\s+/g, "_")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      showNotif(`PDF oluşturuldu${quoteResult.success ? " ve teklif kaydedildi" : ""}.`, "success");
      router.refresh();
    } catch (err) {
      console.error("PDF hatası:", err);
      showNotif("PDF oluşturulamadı.", "error");
    }

    setPdfLoading(false);
  }

  async function handleMail() {
    const email = clientObj?.email;
    if (!email) {
      showNotif("Müşterinin e-posta adresi yok. CRM'den e-posta ekleyin.", "error");
      return;
    }

    setMailLoading(true);

    // Önce DB'ye kaydet
    const selectedAddons = addonList.filter((a) => addons[a.key]).map((a) => ({ name: a.label, price: a.price }));
    const quoteResult = await createQuote({
      clientId: selectedClient,
      packageType: pkg.label,
      basePrice: pkg.price,
      addons: selectedAddons,
      total,
    });

    const quoteNumber = quoteResult.success ? quoteResult.quoteNumber! : "QUOTE-DRAFT";

    // Mail gönder
    const mailResult = await sendQuoteMail({
      clientEmail: email,
      clientName,
      packageType: pkg.label,
      total,
      quoteNumber,
    });

    if (mailResult.success) {
      showNotif(`Teklif ${email} adresine gönderildi.`, "success");
      router.refresh();
    } else {
      showNotif(mailResult.error || "Mail gönderilemedi.", "error");
    }

    setMailLoading(false);
  }

  const notifColors = {
    info: "border-admin-blue bg-admin-blue-dim text-admin-blue",
    success: "border-admin-green bg-admin-green-dim text-admin-green",
    error: "border-admin-red bg-admin-red-dim text-admin-red",
  };

  return (
    <div className="space-y-4">
      {notification && (
        <div className={`rounded-lg border px-4 py-2.5 text-[12px] font-medium ${notifColors[notification.type]}`}>{notification.msg}</div>
      )}

      <div className="grid gap-3 lg:grid-cols-2">
        {/* Sol: Teklif Formu */}
        <div className="rounded-xl border border-admin-border bg-admin-bg2">
          <div className="border-b border-admin-border px-4 py-3 text-[13px] font-medium">Hızlı Teklif Oluştur</div>
          <div className="flex flex-col gap-3 p-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-medium text-admin-muted">Müşteri</label>
              <select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full rounded-lg border border-admin-border bg-admin-bg3 px-3 py-2 text-[12px] text-admin-text focus:border-admin-accent focus:outline-none">
                {clients.map((c) => (<option key={c.id} value={c.id}>{c.name}{c.email ? ` (${c.email})` : ""}</option>))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-medium text-admin-muted">Paket</label>
              <select value={selectedPackage} onChange={(e) => setSelectedPackage(e.target.value)}
                className="w-full rounded-lg border border-admin-border bg-admin-bg3 px-3 py-2 text-[12px] text-admin-text focus:border-admin-accent focus:outline-none">
                {packages.map((p) => (<option key={p.value} value={p.value}>{p.label} — {fmt(p.price)}</option>))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-medium text-admin-muted">Eklentiler</label>
              <div className="flex flex-col gap-1.5 mt-1">
                {addonList.map((a) => (
                  <label key={a.key} className="flex cursor-pointer items-center gap-2 text-[12px]">
                    <input type="checkbox" checked={!!addons[a.key]}
                      onChange={(e) => setAddons((prev) => ({ ...prev, [a.key]: e.target.checked }))}
                      className="accent-admin-accent" />
                    {a.label} (+{fmt(a.price)})
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-admin-bg3 px-3 py-3">
              <span className="text-[12px] text-admin-muted">Toplam (KDV hariç)</span>
              <span className="text-xl font-semibold text-admin-accent">{fmt(total)}</span>
            </div>

            <div className="rounded-lg bg-admin-bg3 p-3">
              <div className="mb-2 text-[11px] text-admin-muted">Ödeme Takvimi (%40/%30/%30)</div>
              <div className="flex gap-2">
                <div className="flex-1 rounded-md bg-admin-bg4 p-2 text-center">
                  <div className="text-[10px] text-admin-muted">Peşinat</div>
                  <div className="text-[13px] font-semibold text-admin-green">{fmt(pay1)}</div>
                </div>
                <div className="flex-1 rounded-md bg-admin-bg4 p-2 text-center">
                  <div className="text-[10px] text-admin-muted">Ara Ödeme</div>
                  <div className="text-[13px] font-semibold text-admin-amber">{fmt(pay2)}</div>
                </div>
                <div className="flex-1 rounded-md bg-admin-bg4 p-2 text-center">
                  <div className="text-[10px] text-admin-muted">Bakiye</div>
                  <div className="text-[13px] font-semibold text-admin-blue">{fmt(pay3)}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={handlePdf} disabled={pdfLoading}
                className="flex-1 rounded-lg bg-admin-accent px-4 py-2.5 text-[12px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50">
                {pdfLoading ? "Oluşturuluyor..." : "📄 PDF Oluştur"}
              </button>
              <button onClick={handleMail} disabled={mailLoading}
                className="flex-1 rounded-lg border border-admin-border bg-admin-bg3 px-4 py-2.5 text-[12px] font-medium text-admin-text transition-colors hover:bg-admin-bg4 disabled:opacity-50">
                {mailLoading ? "Gönderiliyor..." : "📧 Maile Gönder"}
              </button>
            </div>
          </div>
        </div>

        {/* Sağ: Son Teklifler */}
        <div className="rounded-xl border border-admin-border bg-admin-bg2">
          <div className="border-b border-admin-border px-4 py-3 text-[13px] font-medium">Son Teklifler</div>
          <div className="divide-y divide-admin-border">
            {recentQuotes.length === 0 && (
              <div className="px-4 py-8 text-center text-[12px] text-admin-muted">Henüz teklif yok</div>
            )}
            {recentQuotes.map((q) => {
              const badge = statusBadge[q.status] || statusBadge.DRAFT;
              return (
                <div key={q.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-[12.5px] font-medium">{q.client} — {q.packageType}</div>
                    <div className="text-[11px] text-admin-muted">
                      {fmt(q.total)} · {q.createdAt}
                      {q.daysWaiting > 0 && <span className="ml-1 text-admin-amber"> · {q.daysWaiting} gün bekleniyor</span>}
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${badge.color}`}>{badge.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
