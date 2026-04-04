import { getPricingConfigs } from "@/actions/pricing";
import PricingTable from "./pricing-table";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const configs = await getPricingConfigs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Fiyat Ayarları</h1>
        <p className="mt-1 text-[13px] text-admin-muted">
          Chatbot teklif hesaplamasında kullanılan fiyat parametreleri. Değerleri
          düzenleyerek otomatik fiyatlandırmayı özelleştirin.
        </p>
      </div>
      <PricingTable initialData={configs} />
    </div>
  );
}
