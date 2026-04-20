import Link from "next/link";
import ProspectSearch from "./prospect-search";

export const dynamic = "force-dynamic";

// Sprint 3.6b — Aşama 1 temizlik
// ProspectBatch tablosu hiç kullanılmıyordu (0 kayıt, 0 create call).
// Sayfa artık doğrudan boş state ile açılıyor; UI scraper çağrısı yaparak
// sonuçları kendi state'ine yüklüyor ve lead'leri doğrudan `Lead`
// tablosuna ekliyor (addRawProspectToLead / addManualLead).
//
// FAZ A — Madde 1.2: KVKK bilgi bandı
// Scraper sonuçları Google Maps'in public kayıtlarından geldiği için
// admin kullanıcıya kaynak + hukuki dayanak hatırlatmalıyız (operatör
// eğitimi + denetim izi). Meşru menfaat dayanağı: KVKK m.5/2-f.

export default function ProspectPage() {
  return (
    <div className="space-y-4">
      {/* KVKK kaynak bildirimi — admin operatör farkındalığı */}
      <div
        role="note"
        aria-label="KVKK kaynak bildirimi"
        className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-100"
      >
        <span aria-hidden="true" className="text-xl leading-none">
          🔒
        </span>
        <div className="flex-1 leading-relaxed">
          <p>
            <span className="font-semibold text-amber-200">
              KVKK bildirimi:
            </span>{" "}
            Bu liste <strong>Google Maps&apos;in kamuya açık</strong>{" "}
            kayıtlarından derlenmiştir. İletişim kurmadan önce KVKK aydınlatma
            metnimiz müşteriye iletilir. Hukuki dayanak:{" "}
            <em>KVKK m.5/2-f (meşru menfaat)</em>.
          </p>
          <Link
            href="/kvkk"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 font-medium text-amber-300 underline decoration-amber-500/50 underline-offset-2 hover:text-amber-200 hover:decoration-amber-300"
          >
            KVKK Metnini Gör →
          </Link>
        </div>
      </div>

      <ProspectSearch
        initialProspects={[]}
        batchInfo={{ query: "", totalFound: 0 }}
      />
    </div>
  );
}
