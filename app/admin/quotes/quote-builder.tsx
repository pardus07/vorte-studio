"use client";

import { useState, useMemo } from "react";

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

type Quote = {
  id: string;
  client: string;
  packageType: string;
  total: number;
  createdAt: string;
  status: string;
  daysWaiting: number;
};

type Client = { id: string; name: string };

export default function QuoteBuilder({
  clients,
  recentQuotes,
}: {
  clients: Client[];
  recentQuotes: Quote[];
}) {
  const [selectedClient, setSelectedClient] = useState(clients[0]?.id || "");
  const [selectedPackage, setSelectedPackage] = useState("temel");
  const [addons, setAddons] = useState<Record<string, boolean>>({});

  const pkg = packages.find((p) => p.value === selectedPackage)!;

  const addonTotal = useMemo(
    () =>
      addonList.reduce(
        (sum, a) => sum + (addons[a.key] ? a.price : 0),
        0
      ),
    [addons]
  );

  const total = pkg.price + addonTotal;
  const pay1 = Math.round(total * 0.4);
  const pay2 = Math.round(total * 0.3);
  const pay3 = total - pay1 - pay2;

  const fmt = (n: number) => `₺${n.toLocaleString("tr-TR")}`;

  async function handlePdf() {
    // Dynamic import to avoid SSR issues
    const { pdf } = await import("@react-pdf/renderer");
    const { default: QuotePDF } = await import("./quote-pdf");
    const clientName =
      clients.find((c) => c.id === selectedClient)?.name || "Müşteri";
    const selectedAddons = addonList
      .filter((a) => addons[a.key])
      .map((a) => ({ name: a.label, price: a.price }));

    const blob = await pdf(
      <QuotePDF
        clientName={clientName}
        packageName={pkg.label}
        packagePrice={pkg.price}
        addons={selectedAddons}
        total={total}
      />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Teklif_${clientName.replace(/\s+/g, "_")}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {/* Left: Quote Form */}
      <div className="rounded-xl border border-admin-border bg-admin-bg2">
        <div className="border-b border-admin-border px-4 py-3 text-[13px] font-medium">
          Hızlı Teklif Oluştur
        </div>
        <div className="flex flex-col gap-3 p-4">
          {/* Client */}
          <div>
            <label className="mb-1.5 block text-[11px] font-medium text-admin-muted">
              Müşteri
            </label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full rounded-lg border border-admin-border bg-admin-bg3 px-3 py-2 text-[12px] text-admin-text focus:border-admin-accent focus:outline-none"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Package */}
          <div>
            <label className="mb-1.5 block text-[11px] font-medium text-admin-muted">
              Paket
            </label>
            <select
              value={selectedPackage}
              onChange={(e) => setSelectedPackage(e.target.value)}
              className="w-full rounded-lg border border-admin-border bg-admin-bg3 px-3 py-2 text-[12px] text-admin-text focus:border-admin-accent focus:outline-none"
            >
              {packages.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label} — {fmt(p.price)}
                </option>
              ))}
            </select>
          </div>

          {/* Addons */}
          <div>
            <label className="mb-1.5 block text-[11px] font-medium text-admin-muted">
              Eklentiler
            </label>
            <div className="flex flex-col gap-1.5 mt-1">
              {addonList.map((a) => (
                <label
                  key={a.key}
                  className="flex cursor-pointer items-center gap-2 text-[12px]"
                >
                  <input
                    type="checkbox"
                    checked={!!addons[a.key]}
                    onChange={(e) =>
                      setAddons((prev) => ({
                        ...prev,
                        [a.key]: e.target.checked,
                      }))
                    }
                    className="accent-admin-accent"
                  />
                  {a.label} (+{fmt(a.price)})
                </label>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between rounded-lg bg-admin-bg3 px-3 py-3">
            <span className="text-[12px] text-admin-muted">
              Toplam (KDV hariç)
            </span>
            <span className="text-xl font-semibold text-admin-accent">
              {fmt(total)}
            </span>
          </div>

          {/* Payment Plan */}
          <div className="rounded-lg bg-admin-bg3 p-3">
            <div className="mb-2 text-[11px] text-admin-muted">
              Ödeme Takvimi (%40/%30/%30)
            </div>
            <div className="flex gap-2">
              <div className="flex-1 rounded-md bg-admin-bg4 p-2 text-center">
                <div className="text-[10px] text-admin-muted">Peşinat</div>
                <div className="text-[13px] font-semibold text-admin-green">
                  {fmt(pay1)}
                </div>
              </div>
              <div className="flex-1 rounded-md bg-admin-bg4 p-2 text-center">
                <div className="text-[10px] text-admin-muted">Ara Ödeme</div>
                <div className="text-[13px] font-semibold text-admin-amber">
                  {fmt(pay2)}
                </div>
              </div>
              <div className="flex-1 rounded-md bg-admin-bg4 p-2 text-center">
                <div className="text-[10px] text-admin-muted">Bakiye</div>
                <div className="text-[13px] font-semibold text-admin-blue">
                  {fmt(pay3)}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handlePdf}
              className="flex-1 rounded-lg bg-admin-accent px-4 py-2.5 text-[12px] font-medium text-white transition-opacity hover:opacity-90"
            >
              📄 PDF Oluştur
            </button>
            <button className="flex-1 rounded-lg border border-admin-border bg-admin-bg3 px-4 py-2.5 text-[12px] font-medium text-admin-text transition-colors hover:bg-admin-bg4">
              📧 Maile Gönder
            </button>
          </div>
        </div>
      </div>

      {/* Right: Recent Quotes */}
      <div className="rounded-xl border border-admin-border bg-admin-bg2">
        <div className="border-b border-admin-border px-4 py-3 text-[13px] font-medium">
          Son Teklifler
        </div>
        <div className="divide-y divide-admin-border">
          {recentQuotes.map((q) => {
            const badge = statusBadge[q.status] || statusBadge.DRAFT;
            return (
              <div key={q.id} className="flex items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="text-[12.5px] font-medium">
                    {q.client} — {q.packageType}
                  </div>
                  <div className="text-[11px] text-admin-muted">
                    {fmt(q.total)} · {q.createdAt}
                    {q.daysWaiting > 0 && (
                      <span className="ml-1 text-admin-amber">
                        · {q.daysWaiting} gün bekleniyor
                      </span>
                    )}
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${badge.color}`}
                >
                  {badge.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
