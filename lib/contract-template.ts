/**
 * Vorte Studio — Dijital Hizmet Sözleşmesi Şablonu
 *
 * Türk Borçlar Kanunu, 5070 Sayılı Elektronik İmza Kanunu,
 * HMK m. 193 Delil Sözleşmesi kapsamında hazırlanmıştır.
 */

interface ContractData {
  // Vorte Studio bilgileri (.env'den)
  ownerName: string;
  ownerTcNo: string;
  ownerAddress: string;
  ownerPhone: string;
  ownerEmail: string;
  ownerIban: string;
  ownerTaxOffice: string;

  // Müşteri bilgileri
  signerName: string;
  signerTcNo?: string;
  signerTaxNo?: string;
  signerTitle?: string;
  signerCompany?: string;
  signerEmail: string;
  signerPhone?: string;
  signerAddress?: string;

  // Proje bilgileri
  firmName: string;
  siteType: string;
  features: string[];
  pageCount?: string;
  totalPrice: number;      // KDV hariç
  kdvAmount: number;        // KDV tutarı
  totalWithKdv: number;     // KDV dahil
  paymentPlan: Array<{ label: string; percent: number; amount: number; description: string }>;
  timeline?: string;
  validUntil: string;
  contractDate: string;

  // Feature labels
  featureLabels: Record<string, string>;
}

const SITE_TYPE_LABELS: Record<string, string> = {
  tanitim: "Tanıtım Web Sitesi",
  "e-ticaret": "E-Ticaret Web Sitesi",
  portfoy: "Portföy Web Sitesi",
  randevu: "Randevu Sistemi Web Sitesi",
  katalog: "Katalog Web Sitesi",
  belirsiz: "Özel Web Projesi",
};

const TIMELINE_LABELS: Record<string, string> = {
  acil: "2 hafta",
  "1-ay": "1 ay",
  "2-3-ay": "2-3 ay",
  esnek: "Taraflarca belirlenecek süre",
};

export function generateContractText(data: ContractData): string {
  const siteTypeLabel = SITE_TYPE_LABELS[data.siteType] || data.siteType || "Web Sitesi";
  const timelineLabel = data.timeline ? TIMELINE_LABELS[data.timeline] || data.timeline : "Taraflarca belirlenecek süre";

  const featureList = data.features
    .map((f) => data.featureLabels[f] || f)
    .map((f, i) => `  ${i + 1}. ${f}`)
    .join("\n");

  const paymentLines = data.paymentPlan
    .map((p) => `  - ${p.label} (%${p.percent}): ${p.amount.toLocaleString("tr-TR")} TL — ${p.description}`)
    .join("\n");

  const fmt = (n: number) => n.toLocaleString("tr-TR");

  // Müşteri taraf bilgisi
  const customerParty = data.signerCompany
    ? `${data.signerCompany} adına ${data.signerName} (${data.signerTitle || "Yetkili"})`
    : data.signerName;

  const customerIdLine = data.signerTcNo
    ? `TC Kimlik No: ${data.signerTcNo}`
    : data.signerTaxNo
    ? `Vergi No: ${data.signerTaxNo}`
    : "";

  const text = `
================================================================================
                    WEB TASARIM VE GELİŞTİRME HİZMET SÖZLEŞMESİ
================================================================================

Sözleşme Tarihi: ${data.contractDate}
Sözleşme No: VS-${Date.now().toString(36).toUpperCase()}

================================================================================
MADDE 1 — TARAFLAR
================================================================================

1.1. HİZMET SAĞLAYICI (bundan böyle "VORTE STUDIO" olarak anılacaktır):
  Ad Soyad       : ${data.ownerName}
  TC Kimlik No    : ${data.ownerTcNo}
  Vergi Dairesi   : ${data.ownerTaxOffice}
  Adres           : ${data.ownerAddress}
  Telefon         : ${data.ownerPhone}
  E-posta         : ${data.ownerEmail}
  IBAN            : ${data.ownerIban}

1.2. MÜŞTERİ (bundan böyle "MÜŞTERİ" olarak anılacaktır):
  Ad Soyad / Ünvan: ${customerParty}
  ${customerIdLine}
  ${data.signerAddress ? `Adres           : ${data.signerAddress}` : ""}
  Telefon         : ${data.signerPhone || "—"}
  E-posta         : ${data.signerEmail}

================================================================================
MADDE 2 — SÖZLEŞMENİN KONUSU
================================================================================

2.1. İşbu sözleşme, VORTE STUDIO'nun MÜŞTERİ'ye aşağıda belirtilen kapsamda
web tasarım ve geliştirme hizmeti sunmasına ilişkin tarafların karşılıklı hak
ve yükümlülüklerini düzenlemektedir.

2.2. Proje Bilgileri:
  Firma Adı       : ${data.firmName}
  Proje Türü      : ${siteTypeLabel}
  ${data.pageCount ? `Sayfa Sayısı    : ${data.pageCount}` : ""}

2.3. Proje Kapsamı — Dahil Edilen Özellikler:
${featureList}

2.4. Kapsam Dışı İşler: Bu sözleşmede belirtilmeyen her türlü ek iş, ek
özellik veya değişiklik talebi, ayrıca fiyatlandırılacak olup ancak tarafların
yazılı mutabakatı ile gerçekleştirilecektir.

================================================================================
MADDE 3 — BEDEL VE ÖDEME KOŞULLARI
================================================================================

3.1. Proje Bedeli:
  Ara Toplam (KDV Hariç) : ${fmt(data.totalPrice)} TL
  KDV (%20)              : ${fmt(data.kdvAmount)} TL
  TOPLAM (KDV Dahil)     : ${fmt(data.totalWithKdv)} TL

3.2. Ödeme Planı:
${paymentLines}

3.3. Ödemeler, aşağıdaki banka hesabına yapılacaktır:
  Banka         : Türkiye İş Bankası
  Hesap Sahibi  : ${data.ownerName}
  IBAN          : ${data.ownerIban}

3.4. MÜŞTERİ, ödeme açıklamasına firma adını, proje türünü ve ödemenin
hangi aşamaya ait olduğunu yazacaktır.

3.5. Vadesinde ödenmeyen tutarlara, 6102 sayılı Türk Ticaret Kanunu m. 1530
uyarınca ticari temerrüt faizi uygulanır.

3.6. Peşinat ödemesi yapılmadan projeye başlanmaz. Bir sonraki aşamaya ait
ödeme yapılmadan, o aşamanın çalışmaları teslim edilmez.

================================================================================
MADDE 4 — SÜRE VE TESLİMAT
================================================================================

4.1. Tahmini Proje Süresi: ${timelineLabel}

4.2. Proje süresi, peşinat ödemesinin alınmasından itibaren başlar.

4.3. MÜŞTERİ'den kaynaklanan gecikmeler (içerik tesliminde gecikme, geri
bildirim vermeme, iletişim kopukluğu vb.) proje süresini uzatır ve VORTE
STUDIO bu gecikmelerden sorumlu değildir.

4.4. Mücbir sebepler (doğal afet, savaş, salgın, altyapı arızası vb.)
nedeniyle oluşan gecikmelerden taraflar sorumlu tutulamaz.

================================================================================
MADDE 5 — REVİZYON HAKKI
================================================================================

5.1. Proje kapsamında toplam 3 (üç) tur revizyon hakkı dahildir.

5.2. Bir revizyon turu, MÜŞTERİ'nin toplu olarak gönderdiği tek bir geri
bildirim paketini ifade eder. Geri bildirimler tek seferde ve yazılı olarak
iletilmelidir.

5.3. Revizyon, mevcut tasarım ve özellikler üzerinde yapılan düzeltmeleri
kapsar. Aşağıdakiler revizyon kapsamında DEĞİLDİR:
  - Yeni sayfa eklenmesi
  - Onaylanan tasarımın tamamen değiştirilmesi
  - Veritabanı/kod yapısında değişiklik gerektiren talepler
  - Kapsam dışı yeni fonksiyonlar

5.4. Dahil revizyon hakları kullanıldıktan sonra yapılacak ek revizyonlar,
VORTE STUDIO'nun güncel saatlik ücreti üzerinden faturalandırılır.

5.5. MÜŞTERİ, her teslimat aşamasında 5 (beş) iş günü içinde geri bildirim
vermekle yükümlüdür. Bu süre içinde geri bildirim verilmemesi halinde,
teslim edilen çalışma kabul edilmiş sayılır.

================================================================================
MADDE 6 — GARANTİ
================================================================================

6.1. VORTE STUDIO, projenin canlıya alınmasından itibaren 12 (on iki) ay
süreyle ücretsiz teknik destek ve hata düzeltme garantisi sağlar.

6.2. Garanti kapsamı:
  - Geliştirmeden kaynaklanan yazılım hataları (bug)
  - Kırık bağlantılar ve UI/UX tutarsızlıkları
  - Backend, API veya entegrasyon hataları (sözleşme kapsamındaki özellikler)

6.3. Garanti kapsamında OLMAYANLAR:
  - Yeni özellik talepleri
  - Tasarım değişiklikleri (renk, yerleşim, font vb.)
  - Üçüncü parti yazılım/eklenti güncellemelerinden kaynaklanan sorunlar
  - MÜŞTERİ tarafından yapılan içerik veya kod değişikliklerinden kaynaklanan
    sorunlar
  - Hosting, sunucu veya DNS kaynaklı sorunlar
  - Düzenli güvenlik güncellemeleri ve bakım (ayrı bakım sözleşmesi gerektirir)

================================================================================
MADDE 7 — FİKRİ MÜLKİYET
================================================================================

7.1. Sözleşme bedelinin tamamının ödenmesiyle birlikte, projeye ait mali
haklar (5846 sayılı FSEK kapsamında çoğaltma, yayma, umuma iletim) MÜŞTERİ'ye
devredilir.

7.2. VORTE STUDIO, projeyi kendi web sitesinde ve sosyal medya hesaplarında
referans/portföy amacıyla kullanma hakkını saklı tutar.

7.3. Projede kullanılan açık kaynak kodlu yazılımlar, kendi lisans koşullarına
tabidir. Bu yazılımların lisans hakları VORTE STUDIO tarafından devredilemez.

7.4. Kaynak kodu, sözleşme bedelinin tamamının ödenmesi ve projenin teslim
edilmesiyle birlikte MÜŞTERİ'ye teslim edilir.

================================================================================
MADDE 8 — GİZLİLİK VE KİŞİSEL VERİLERİN KORUNMASI
================================================================================

8.1. Taraflar, bu sözleşme kapsamında birbirlerine açtıkları tüm ticari,
teknik ve kişisel bilgileri gizli tutmayı kabul ve taahhüt eder.

8.2. 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında:
  - VORTE STUDIO, MÜŞTERİ'den aldığı kişisel verileri yalnızca sözleşmenin
    ifası amacıyla işler.
  - Veriler, sözleşme süresince ve yasal saklama yükümlülükleri boyunca muhafaza
    edilir.
  - MÜŞTERİ, KVKK m. 11 kapsamındaki haklarını (erişim, düzeltme, silme)
    kullanabilir.

================================================================================
MADDE 9 — CAYMA VE FESİH
================================================================================

9.1. İşbu sözleşme ticari amaçla akdedilmiş olup, 6502 sayılı Tüketicinin
Korunması Hakkında Kanun hükümleri uygulanmaz. (B2B)

9.2. Bireysel müşteriler için: İşbu sözleşme kapsamında sipariş edilen hizmet,
MÜŞTERİ'nin kişisel ihtiyaçları doğrultusunda özel olarak hazırlanacak olup,
hizmetin ifasına başlanmasıyla birlikte Mesafeli Sözleşmeler Yönetmeliği m. 15
uyarınca cayma hakkı kullanılamaz.

9.3. MÜŞTERİ'nin Feshi:
  - MÜŞTERİ, Türk Borçlar Kanunu m. 484 uyarınca sözleşmeyi feshedebilir.
  - Bu durumda, VORTE STUDIO'nun o güne kadar yaptığı çalışmalar ve ayırdığı
    kaynaklar için hakkaniyete uygun bir bedel ödenir.
  - Peşinat (%40) iade edilmez; kaynak tahsisi ve planlama maliyetini karşılar.

9.4. VORTE STUDIO'nun Feshi:
  - MÜŞTERİ'nin ödeme temerrüdüne düşmesi (vadeden itibaren 15 gün),
  - MÜŞTERİ'nin 30 gün boyunca iletişime geçmemesi,
  - Kapsam dışı taleplerde ısrar edilmesi
  durumlarında VORTE STUDIO, yazılı bildirimle sözleşmeyi feshedebilir.

9.5. Fesih halinde, tamamlanan çalışmalar oranında ödeme yapılır.

================================================================================
MADDE 10 — SORUMLULUK SINIRLAMASI
================================================================================

10.1. VORTE STUDIO'nun işbu sözleşmeden doğan toplam sorumluluğu, sözleşme
bedelini aşamaz.

10.2. VORTE STUDIO, kâr kaybı, veri kaybı, iş kaybı, itibar kaybı veya diğer
dolaylı, arızi veya cezai zararlardan sorumlu değildir.

10.3. Üçüncü taraf hizmetlerinden (hosting sağlayıcı, domain kayıt, ödeme
altyapısı, e-posta servisi vb.) kaynaklanan kesinti, arıza veya veri kayıplarından
VORTE STUDIO sorumlu tutulamaz.

10.4. MÜŞTERİ'nin sağlayacağı içeriklerin (metin, görsel, video) hukuki
sorumluluğu MÜŞTERİ'ye aittir.

================================================================================
MADDE 11 — UYUŞMAZLIK ÇÖZÜMÜ
================================================================================

11.1. İşbu sözleşmeden doğan uyuşmazlıklarda öncelikle 6102 sayılı Türk
Ticaret Kanunu m. 5/A uyarınca zorunlu arabuluculuk yoluna başvurulacaktır.

11.2. Arabuluculukta çözüm sağlanamaması halinde İZMİR MAHKEMELERİ ve İCRA
DAİRELERİ yetkilidir.

================================================================================
MADDE 12 — DİJİTAL İMZA VE DELİL SÖZLEŞMESİ
================================================================================

12.1. İşbu sözleşme, 6098 sayılı Türk Borçlar Kanunu m. 12 kapsamında
şekil serbestisi ilkesine uygun olarak dijital ortamda akdedilmiştir.

12.2. Taraflar, işbu sözleşmenin dijital ortamda imzalanmasını ve bu imza
sürecinde kaydedilen tüm elektronik verileri (IP adresi, zaman damgası,
cihaz bilgisi, e-posta doğrulaması, elektronik imza görseli dahil) 6100
sayılı Hukuk Muhakemeleri Kanunu m. 193 uyarınca KESIN DELIL olarak kabul
ederler.

12.3. İmzalayan kişi, temsil ettiği gerçek veya tüzel kişilik adına işlem
yapma yetkisine sahip olduğunu, aksi halde doğacak tüm zararlardan şahsen
sorumlu olduğunu beyan, kabul ve taahhüt eder.

12.4. Sözleşme metninin bütünlüğü, SHA-256 kriptografik hash değeri ile
korunmaktadır. Hash değeri imza anında kaydedilir ve sözleşme metninde
herhangi bir değişiklik yapılmadığının kanıtı olarak kullanılır.

================================================================================
MADDE 13 — DİĞER HÜKÜMLER
================================================================================

13.1. İşbu sözleşme, tarafların karşılıklı iradeleri doğrultusunda
${data.contractDate} tarihinde dijital ortamda akdedilmiştir.

13.2. Sözleşmenin herhangi bir maddesinin geçersiz sayılması, diğer
maddelerin geçerliliğini etkilemez.

13.3. Bu sözleşmede düzenlenmeyen hususlarda 6098 sayılı Türk Borçlar Kanunu
ve ilgili mevzuat hükümleri uygulanır.

13.4. Tebligat adresleri, Madde 1'de belirtilen adreslerdir. Adres
değişiklikleri yazılı olarak bildirilmelidir.

================================================================================
İMZA
================================================================================

İşbu sözleşme, 13 (on üç) maddeden oluşmakta olup, taraflarca okunmuş,
anlaşılmış ve kabul edilmiştir.

HİZMET SAĞLAYICI:                    MÜŞTERİ:
${data.ownerName}                     ${customerParty}
Vorte Studio                          ${data.signerCompany || data.firmName}

[Dijital İmza]                        [Dijital İmza]

================================================================================
`.trim();

  return text;
}

/** SHA-256 hash hesapla (sözleşme bütünlüğü için) */
export async function hashContractText(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
