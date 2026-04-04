import { getPricingConfigs, updatePricingByKey } from "@/actions/pricing";
import { getUsdTryRate } from "@/lib/exchange-rate";
import PricingTable from "./pricing-table";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const [configs, usdTry] = await Promise.all([
    getPricingConfigs(),
    getUsdTryRate(),
  ]);

  // DB'deki dolar kurunu otomatik güncelle
  if (usdTry.date !== "fallback") {
    const current = configs.find((c) => c.key === "token_dolar_kuru");
    if (current && Math.abs(current.value - usdTry.rate) > 0.5) {
      await updatePricingByKey("token_dolar_kuru", Math.round(usdTry.rate * 100) / 100);
      // Config'i de güncelle (UI'da doğru göster)
      const idx = configs.findIndex((c) => c.key === "token_dolar_kuru");
      if (idx >= 0) configs[idx].value = Math.round(usdTry.rate * 100) / 100;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">Fiyat Ayarları</h1>
          <p className="mt-1 text-[13px] text-admin-muted">
            Chatbot teklif hesaplamasında kullanılan fiyat parametreleri. Değerleri
            düzenleyerek otomatik fiyatlandırmayı özelleştirin.
          </p>
        </div>
        <div className="shrink-0 rounded-xl border border-admin-border bg-admin-bg2 px-4 py-2.5 text-right">
          <div className="text-[10px] uppercase tracking-wider text-admin-muted">
            USD / TRY
          </div>
          <div className="mt-0.5 text-lg font-bold text-admin-accent">
            {usdTry.rate.toFixed(2)} ₺
          </div>
          <div className="text-[10px] text-admin-muted">
            {usdTry.date === "fallback" ? "Güncel veri alınamadı" : usdTry.date}
          </div>
        </div>
      </div>
      <PricingTable initialData={configs} usdRate={usdTry.rate} />
    </div>
  );
}
