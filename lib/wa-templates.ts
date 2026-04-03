/**
 * WhatsApp İlk Temas Mesaj Şablonları
 *
 * Her sektör grubu için özelleştirilmiş ilk temas mesajı.
 * Placeholder'lar: {firma}, {sektor}, {sehir}, {sorun}, {link}
 */

import { getTemplateName } from "./template-selector";

// ── Placeholder tipi ──
export type WaTemplateData = {
  firma: string;
  sektor: string; // Dropdown'daki Türkçe sektör adı
  sehir: string;
  sorun: string; // "Web siteniz yok", "Mobil puanınız düşük" vb.
  link: string; // Şablon demo linki
  phone: string; // WA numarası (90XXXXXXXXXX)
};

// ── Sektör grubu → mesaj şablonu ──
// Benzer sektörleri grupluyoruz, her gruba özel mesaj tonu

const templates: Record<string, string> = {
  // ── Sağlık ──
  saglik: `Merhaba, {firma} 👋

{sehir} bölgesinde {sektor} alanında araştırma yaparken sizi fark ettik.

{sorun} — günümüzde hastaların %82'si randevu almadan önce Google'da klinik araması yapıyor. Profesyonel bir web sitesi, güven veren ilk izlenim demek.

Sektörünüze özel hazırladığımız örnek siteyi incelemenizi isteriz:
👉 {link}

Tamamen ücretsiz ve taahhütsüz — beğenmezseniz hiçbir yükümlülüğünüz yok.

İyi çalışmalar,
Vorte Studio`,

  // ── Güzellik & Bakım ──
  guzellik: `Merhaba, {firma} 👋

{sehir} bölgesinde {sektor} sektörünü araştırırken sizi fark ettik.

{sorun} — müşterilerinizin büyük çoğunluğu randevu almadan önce Instagram ve Google'dan araştırma yapıyor. Şık ve profesyonel bir web sitesi, markanızı bir adım öne taşır.

Size özel hazırladığımız sektörel örnek siteye göz atın:
👉 {link}

Ücretsiz ve taahhütsüz. Beğenirseniz konuşalım 😊

Vorte Studio`,

  // ── Yeme-İçme ──
  yemeicme: `Merhaba, {firma} 👋

{sehir}'da {sektor} araştırması yaparken sizi bulduk.

{sorun} — yeni müşteriler sizi Google'da aradığında profesyonel bir site görmek istiyor. Online menü, sipariş butonu ve konum bilgisi tek sayfada.

Sektörünüze özel tasarladığımız demo siteyi inceleyin:
👉 {link}

Ücretsiz keşif görüşmesi — taahhüt yok!

Afiyet olsun 😊
Vorte Studio`,

  // ── Gıda Perakende ──
  gida: `Merhaba, {firma} 👋

{sehir} bölgesinde {sektor} sektörünü araştırırken sizi fark ettik.

{sorun} — sadık müşterilerinize kampanya ve ürün duyurusu yapabileceğiniz, online sipariş alacağınız bir web sitesi satışlarınızı artırır.

Sektörünüze özel hazırladığımız örnek siteyi görmek ister misiniz?
👉 {link}

Ücretsiz ve taahhütsüz.

Vorte Studio`,

  // ── Otomotiv ──
  otomotiv: `Merhaba, {firma} 👋

{sehir}'da {sektor} araması yaparken sizi bulduk.

{sorun} — araç sahipleri güvenilir servis ararken ilk Google'a bakıyor. Profesyonel bir web sitesi, müşteri güvenini artırır ve randevu taleplerini kolaylaştırır.

Size özel hazırladığımız demo siteye göz atın:
👉 {link}

Ücretsiz keşif — taahhütsüz.

Vorte Studio`,

  // ── İnşaat & Tadilat ──
  insaat: `Merhaba, {firma} 👋

{sehir} bölgesinde {sektor} sektörünü araştırırken sizi fark ettik.

{sorun} — müşteriler tadilat/inşaat firması seçerken referans ve portfolyo arıyor. Profesyonel bir web sitesi, projelerinizi sergilemenizi ve güven oluşturmanızı sağlar.

Sektörünüze özel portfolyo sitesi örneğimizi inceleyin:
👉 {link}

Ücretsiz keşif görüşmesi — taahhüt yok!

Vorte Studio`,

  // ── Eğitim ──
  egitim: `Merhaba, {firma} 👋

{sehir}'da {sektor} sektörünü araştırırken sizi fark ettik.

{sorun} — veliler ve öğrenciler kayıt öncesi mutlaka online araştırma yapıyor. Profesyonel bir web sitesi, kurumunuzun güvenilirliğini artırır.

Size özel hazırladığımız sektörel demo siteyi inceleyin:
👉 {link}

Ücretsiz ve taahhütsüz.

Vorte Studio`,

  // ── Konaklama ──
  konaklama: `Merhaba, {firma} 👋

{sehir} bölgesinde {sektor} araştırması yaparken sizi bulduk.

{sorun} — misafirler rezervasyon öncesi %90 oranında web sitesini inceliyor. Modern bir site, doluluk oranınızı doğrudan etkiler.

Sektörünüze özel hazırladığımız örnek siteye bakın:
👉 {link}

Ücretsiz keşif — taahhütsüz.

Vorte Studio`,

  // ── Spor & Fitness ──
  spor: `Merhaba, {firma} 👋

{sehir}'da {sektor} sektörünü araştırırken sizi fark ettik.

{sorun} — yeni üyeler kayıt öncesi online ders programı, fiyat ve tesis fotoğrafları arıyor. Profesyonel bir site, üye kazanımını artırır.

Size özel hazırladığımız demo siteyi inceleyin:
👉 {link}

Ücretsiz ve taahhütsüz 💪

Vorte Studio`,

  // ── Atölye & İmalat ──
  imalat: `Merhaba, {firma} 👋

{sehir} bölgesinde {sektor} araması yaparken sizi bulduk.

{sorun} — iş ortakları ve müşteriler sizi araştırırken profesyonel bir web varlığı görmeyi bekliyor. Ürünlerinizi ve hizmetlerinizi sergileyen bir site, yeni iş fırsatları getirir.

Sektörünüze özel örnek sitemizi inceleyin:
👉 {link}

Ücretsiz keşif — taahhütsüz.

Vorte Studio`,

  // ── Hizmet & Profesyonel ──
  profesyonel: `Merhaba, {firma} 👋

{sehir}'da {sektor} sektörünü araştırırken sizi fark ettik.

{sorun} — müvekkiller ve müşteriler güvenilir bir profesyonel ararken web varlığınıza bakıyor. Kurumsal bir site, uzmanlığınızı ve referanslarınızı sergilemenizi sağlar.

Size özel hazırladığımız demo siteye göz atın:
👉 {link}

Ücretsiz ve taahhütsüz.

Vorte Studio`,

  // ── Perakende ──
  perakende: `Merhaba, {firma} 👋

{sehir} bölgesinde {sektor} sektörünü araştırırken sizi fark ettik.

{sorun} — müşteriler mağazanıza gelmeden önce ürünlerinize ve çalışma saatlerinize online bakıyor. Profesyonel bir web sitesi, fiziksel mağaza trafiğinizi artırır.

Sektörünüze özel hazırladığımız örnek siteyi inceleyin:
👉 {link}

Ücretsiz keşif — taahhütsüz.

Vorte Studio`,

  // ── Teknik Servis ──
  teknik: `Merhaba, {firma} 👋

{sehir}'da {sektor} araması yaparken sizi bulduk.

{sorun} — acil servis ihtiyacı olan müşteriler Google'dan en yakın güvenilir servisi arıyor. Profesyonel bir web sitesi, hemen aranmanızı sağlar.

Size özel hazırladığımız demo siteye bakın:
👉 {link}

Ücretsiz ve taahhütsüz.

Vorte Studio`,

  // ── Diğer Hizmetler ──
  diger: `Merhaba, {firma} 👋

{sehir} bölgesinde {sektor} sektörünü araştırırken sizi fark ettik.

{sorun} — potansiyel müşterileriniz sizi Google'da aradığında profesyonel bir web sitesi görmek istiyor. Bu, güvenin ilk adımı.

Sektörünüze özel hazırladığımız örnek siteyi inceleyin:
👉 {link}

Ücretsiz keşif görüşmesi — taahhütsüz.

Vorte Studio`,
};

// ── Sektör → Grup eşleştirmesi ──
const sectorGroupMap: Record<string, string> = {
  // Sağlık
  "Diş Klinikleri": "saglik",
  "Veteriner Klinikleri": "saglik",
  "Optik / Gözlükçü": "saglik",
  "Fizik Tedavi Merkezleri": "saglik",
  "Tıp Merkezleri": "saglik",
  "Psikolog / Danışman": "saglik",
  "Diyetisyen / Beslenme Uzmanı": "saglik",
  "Estetik Klinik": "saglik",
  "Özel Poliklinik": "saglik",
  "İşitme Merkezi": "saglik",
  "Göz Merkezi": "saglik",

  // Güzellik
  "Kuaförler": "guzellik",
  "Berberler": "guzellik",
  "Güzellik / SPA": "guzellik",
  "Cilt Bakım Merkezleri": "guzellik",
  "Epilasyon Merkezleri": "guzellik",
  "Tırnak Stüdyosu": "guzellik",
  "Dövme & Piercing Stüdyosu": "guzellik",

  // Yeme-İçme
  "Restoranlar": "yemeicme",
  "Kafeler": "yemeicme",
  "Pastaneler": "yemeicme",
  "Fırınlar": "yemeicme",
  "Catering / Yemek Servisi": "yemeicme",

  // Gıda Perakende
  "Kasaplar": "gida",
  "Manavlar": "gida",
  "Kuruyemişçiler": "gida",
  "Su Bayileri": "gida",
  "Şarküteri / Delikatessen": "gida",

  // Konaklama
  "Oteller": "konaklama",
  "Seyahat Acentesi": "konaklama",

  // Eğitim
  "Dil Kursları": "egitim",
  "Özel Okullar": "egitim",
  "Kreşler": "egitim",
  "Etüt Merkezleri": "egitim",
  "Sürücü Kursları": "egitim",
  "Müzik Kursları": "egitim",

  // Spor
  "Spor Salonları": "spor",
  "Pilates / Yoga": "spor",

  // Otomotiv
  "Oto Servisler": "otomotiv",
  "Oto Yıkama": "otomotiv",
  "Lastikçiler": "otomotiv",
  "Oto Galeri": "otomotiv",
  "Oto Elektrik": "otomotiv",
  "Oto Egzoz": "otomotiv",
  "Oto Kaporta & Boya": "otomotiv",
  "Oto Cam": "otomotiv",
  "Oto Yedek Parça": "otomotiv",
  "Oto Aksesuar": "otomotiv",
  "Motosiklet Servisi": "otomotiv",

  // İnşaat & Tadilat
  "İnşaat Firmaları": "insaat",
  "Mimarlık Ofisleri": "insaat",
  "Tadilat / Dekorasyon": "insaat",
  "PVC Doğrama": "insaat",
  "Alüminyum Doğrama": "insaat",
  "Cam Balkon": "insaat",
  "Mermer & Granit": "insaat",
  "Dış Cephe Kaplama": "insaat",
  "Isı Yalıtım / Mantolama": "insaat",
  "Çatı Sistemleri": "insaat",
  "Fayans / Seramik Döşeme": "insaat",
  "Asma Tavan / Alçıpan": "insaat",
  "Prefabrik Yapı": "insaat",
  "Boya Badana Ustası": "insaat",
  "Elektrikçi": "insaat",
  "Tesisatçı": "insaat",

  // Atölye & İmalat
  "Parke & Zemin Döşeme": "imalat",
  "Döşemeci / Koltuk Tamircisi": "imalat",
  "Çadır & Tente İmalatı": "imalat",
  "Branda İmalatı": "imalat",
  "Kaynak & Demir Atölyesi": "imalat",
  "Marangoz / Ahşap Atölyesi": "imalat",
  "Bobinaj": "imalat",
  "Matbaalar": "imalat",
  "Ambalaj İmalatı": "imalat",
  "Plastik İmalat": "imalat",
  "Terzi / Dikiş Atölyesi": "imalat",

  // Hizmet & Profesyonel
  "Hukuk Büroları": "profesyonel",
  "Muhasebe Büroları": "profesyonel",
  "Emlak Ofisleri": "profesyonel",
  "Sigorta Acenteleri": "profesyonel",

  // Perakende
  "Mobilya Mağazaları": "perakende",
  "Elektronik Mağazaları": "perakende",
  "Kırtasiyeler": "perakende",
  "Pet Shop": "perakende",
  "Çiçekçiler": "perakende",
  "Kuyumcular": "perakende",
  "Tekstil / Giyim Mağazası": "perakende",
  "Spor Malzemeleri Mağazası": "perakende",

  // Teknik Servis
  "Klima Servisi": "teknik",
  "Kombi Servisi": "teknik",
  "Beyaz Eşya Tamircisi": "teknik",
  "Asansör Bakım": "teknik",
  "Jeneratör Servisi": "teknik",
  "Güvenlik Sistemleri": "teknik",
  "Çilingir": "teknik",
  "Su Arıtma Servisi": "teknik",

  // Diğer Hizmetler
  "Fotoğraf Stüdyoları": "diger",
  "Temizlik Şirketleri": "diger",
  "Nakliyat Firmaları": "diger",
  "Organizasyon Şirketleri": "diger",
  "Kuru Temizleme": "diger",
  "Halı Yıkama": "diger",
  "Tabela & Reklam": "diger",
};

// ── Sorun tespiti ──
export function detectIssue(lead: {
  hasWebsite: boolean;
  mobileScore?: number | null;
  sslValid?: boolean;
}): string {
  if (!lead.hasWebsite) return "Şu an web siteniz bulunmuyor";
  if (lead.mobileScore !== null && lead.mobileScore !== undefined) {
    if (lead.mobileScore < 50) return `Web sitenizin mobil performansı düşük (${lead.mobileScore}/100)`;
    if (lead.mobileScore < 70) return `Web siteniz mobilde yavaş yükleniyor (${lead.mobileScore}/100)`;
  }
  if (lead.sslValid === false) return "Web sitenizde SSL sertifikası bulunmuyor";
  return "Dijital varlığınızı güçlendirebilirsiniz";
}

// ── Şablon oluştur ──
export function generateWaMessage(data: WaTemplateData): string {
  const group = sectorGroupMap[data.sektor] || "diger";
  const tpl = templates[group] || templates.diger;

  return tpl
    .replace(/\{firma\}/g, data.firma)
    .replace(/\{sektor\}/g, data.sektor.toLowerCase())
    .replace(/\{sehir\}/g, data.sehir)
    .replace(/\{sorun\}/g, data.sorun)
    .replace(/\{link\}/g, data.link);
}

// ── Demo link oluştur ──
export function buildDemoLink(leadId: string, sector: string): string {
  const slug = getTemplateName(sector);
  // Tracking parametreli demo link
  return `https://vortestudio.com/demo/${slug}?ref=${leadId}`;
}

// ── WA URL oluştur ──
export function buildWaUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

// ── Sektör adını şehirden ayır (adres'ten şehir çıkar) ──
export function extractCity(address?: string | null): string {
  if (!address) return "Türkiye";
  // "Bursa, Osmangazi, ..." → "Bursa"
  // "İstanbul / Kadıköy" → "İstanbul"
  const parts = address.split(/[,\/]/);
  // Genelde en son veya en baştaki büyük şehir adıdır
  const cities = [
    "İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Adana", "Konya",
    "Gaziantep", "Mersin", "Kayseri", "Eskişehir", "Diyarbakır", "Samsun",
    "Denizli", "Şanlıurfa", "Trabzon", "Malatya", "Erzurum", "Van",
    "Sakarya", "Muğla", "Balıkesir", "Manisa", "Kocaeli", "Aydın",
    "Tekirdağ", "Hatay", "Kahramanmaraş", "Ordu", "Elazığ",
  ];
  for (const part of parts) {
    const trimmed = part.trim();
    if (cities.some((c) => trimmed.includes(c))) return trimmed;
  }
  return parts[0]?.trim() || "Türkiye";
}
