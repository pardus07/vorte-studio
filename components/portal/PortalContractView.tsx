"use client";

interface ContractPageProps {
  proposal: {
    id: string; token: string; firmName: string; status: string;
    totalPrice: number; siteType: string | null; features: string[];
    timeline: string | null; createdAt: string;
  };
  contract: { id: string; status: string; signedAt: string | null } | null;
  payments: {
    id: string; stage: number; label: string; amount: number;
    status: string; paidAt: string | null;
  }[];
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 0 }).format(price);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

const SITE_TYPES: Record<string, string> = {
  tanitim: "Tanıtım Sitesi",
  "e-ticaret": "E-Ticaret Sitesi",
  portfoy: "Portföy Sitesi",
  randevu: "Randevu Sistemi",
  katalog: "Ürün Kataloğu",
};

const TIMELINE_LABELS: Record<string, string> = {
  acil: "Acil (1-2 Hafta)",
  "1-ay": "1 Ay",
  "2-3-ay": "2-3 Ay",
  esnek: "Esnek",
};

export default function PortalContractView({ proposal, contract, payments }: ContractPageProps) {
  const paidTotal = payments.filter((p) => p.status === "PAID").reduce((s, p) => s + p.amount, 0);
  const totalDue = payments.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF4500]/10">
          <svg className="h-5 w-5 text-[#FF4500]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 12l2 2 4-4" />
            <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9-9-1.8-9-9 1.8-9 9-9z" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-bold">Sözleşme & Ödeme</h1>
          <p className="text-xs text-white/40">{proposal.firmName} projesi</p>
        </div>
      </div>

      {/* Proje Özeti */}
      <div className="mb-6 rounded-2xl border border-white/[0.07] bg-[#0f0f0f] p-6">
        <h2 className="mb-4 text-sm font-semibold text-white/60 uppercase tracking-wider">Proje Özeti</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-white/30">Proje Türü</p>
            <p className="mt-1 text-sm font-medium">{SITE_TYPES[proposal.siteType || ""] || proposal.siteType}</p>
          </div>
          <div>
            <p className="text-xs text-white/30">Süre</p>
            <p className="mt-1 text-sm font-medium">{TIMELINE_LABELS[proposal.timeline || ""] || proposal.timeline || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-white/30">Toplam Tutar</p>
            <p className="mt-1 text-lg font-bold text-[#FF4500]">{formatPrice(proposal.totalPrice)} ₺</p>
          </div>
          <div>
            <p className="text-xs text-white/30">Başlangıç Tarihi</p>
            <p className="mt-1 text-sm font-medium">{formatDate(proposal.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Sözleşme Durumu */}
      <div className="mb-6 rounded-2xl border border-white/[0.07] bg-[#0f0f0f] p-6">
        <h2 className="mb-4 text-sm font-semibold text-white/60 uppercase tracking-wider">Sözleşme</h2>
        {contract ? (
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
              contract.status === "SIGNED" ? "bg-green-500/10" : "bg-amber-500/10"
            }`}>
              {contract.status === "SIGNED" ? (
                <svg className="h-6 w-6 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              ) : (
                <svg className="h-6 w-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              )}
            </div>
            <div>
              <p className={`text-sm font-semibold ${contract.status === "SIGNED" ? "text-green-400" : "text-amber-400"}`}>
                {contract.status === "SIGNED" ? "İmzalandı" : "İmza Bekleniyor"}
              </p>
              {contract.signedAt && (
                <p className="text-xs text-white/30">{formatDate(contract.signedAt)}</p>
              )}
            </div>
            {contract.status === "SIGNED" && (
              <a
                href={`/teklif/${proposal.token}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-xs text-[#FF4500] hover:underline"
              >
                Teklifi görüntüle →
              </a>
            )}
          </div>
        ) : (
          <p className="text-sm text-white/30">Sözleşme henüz oluşturulmadı</p>
        )}
      </div>

      {/* Ödeme Planı */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#0f0f0f] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Ödeme Planı</h2>
          <div className="text-right">
            <p className="text-xs text-white/30">Toplam Ödenen</p>
            <p className="text-sm font-bold text-green-400">
              {formatPrice(paidTotal)} <span className="text-white/20">/ {formatPrice(totalDue)} ₺</span>
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6 h-2 w-full rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#FF4500] to-[#ff6b35] transition-all duration-700"
            style={{ width: `${totalDue > 0 ? (paidTotal / totalDue) * 100 : 0}%` }}
          />
        </div>

        <div className="space-y-3">
          {payments.map((p, i) => (
            <div
              key={p.id}
              className={`flex items-center gap-4 rounded-xl px-4 py-4 ${
                p.status === "PAID"
                  ? "bg-green-500/[0.04] border border-green-500/10"
                  : "bg-white/[0.02] border border-white/[0.05]"
              }`}
            >
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  p.status === "PAID"
                    ? "bg-green-500 text-white"
                    : "bg-white/[0.08] text-white/30"
                }`}>
                  {p.status === "PAID" ? (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium">{p.label}</p>
                {p.paidAt && (
                  <p className="mt-0.5 text-xs text-green-400/60">Ödendi: {formatDate(p.paidAt)}</p>
                )}
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

        {/* Banka bilgileri notu */}
        <div className="mt-6 rounded-xl bg-white/[0.02] border border-white/[0.05] px-4 py-3">
          <p className="text-xs text-white/30">
            Ödeme bilgileri için{" "}
            <a href="/portal/mesajlar" className="text-[#FF4500] hover:underline">mesajlar</a>
            {" "}bölümünden bizimle iletişime geçebilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
}
