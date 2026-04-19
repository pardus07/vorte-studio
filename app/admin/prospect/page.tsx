import ProspectSearch from "./prospect-search";

export const dynamic = "force-dynamic";

// Sprint 3.6b — Aşama 1 temizlik
// ProspectBatch tablosu hiç kullanılmıyordu (0 kayıt, 0 create call).
// Sayfa artık doğrudan boş state ile açılıyor; UI scraper çağrısı yaparak
// sonuçları kendi state'ine yüklüyor ve lead'leri doğrudan `Lead`
// tablosuna ekliyor (addRawProspectToLead / addManualLead).

export default function ProspectPage() {
  return (
    <ProspectSearch
      initialProspects={[]}
      batchInfo={{ query: "", totalFound: 0 }}
    />
  );
}
