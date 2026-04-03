/**
 * WhatsApp İlk Temas Mesaj Şablonları — v2
 *
 * Pazarlama psikolojisi prensipleri:
 * - Sosyal kanıt (social proof): İstatistikler, sektör verileri
 * - Kayıp korkusu (loss aversion): Rakiplere kaybedilen müşteri vurgusu
 * - Merak boşluğu (curiosity gap): Linke tıklatmak için eksik bilgi bırakma
 * - Karşılıklılık (reciprocity): Ücretsiz değer sunma
 * - Aciliyet (urgency): Zaman sınırlı teklif hissi (yumuşak)
 * - Spesifik rakamlar: Yuvarlak değil kesin sayılar güven verir
 *
 * Placeholder'lar: {firma}, {sektor}, {sehir}, {sorun}, {link}
 */

import { getTemplateName } from "./template-selector";

export type WaTemplateData = {
  firma: string;
  sektor: string;
  sehir: string;
  sorun: string;
  link: string;
  phone: string;
};

// ── Sektör grubu → mesaj şablonu ──

const templates: Record<string, string> = {
  // ── Sağlık ──
  saglik: `Merhaba {firma} 👋

{sehir}'da {sektor} araştırması yaparken Google'da sizi inceledik.

Dikkat çeken bir şey fark ettik: {sorun}

Neden önemli? Hastaların %82'si randevu almadan önce kliniği Google'da arıyor. İlk 3 saniyede profesyonel bir site göremezlerse, bir sonraki kliniğe geçiyor.

Sizin sektörünüze özel bir site tasarladık — nasıl görüneceğini merak ediyor musunuz?

👉 {link}

30 saniye sürer, taahhüt yok. Sadece bakın, beğenirseniz konuşalım.

Vorte Studio
Web & Mobil Çözümler`,

  // ── Güzellik & Bakım ──
  guzellik: `Merhaba {firma} 👋

{sehir}'da {sektor} sektörünü araştırırken profilinizi gördük — Google puanınız etkileyici! 🌟

Ama bir şey dikkatimizi çekti: {sorun}

Bugün müşterilerin %74'ü randevu almadan önce salonu online araştırıyor. Rakipleriniz bunu biliyor — {sehir}'daki 10 salondan 6'sı son 1 yılda web sitesi yaptırdı.

Sizin tarzınıza uygun bir demo site hazırladık:
👉 {link}

Beğenmezseniz hiçbir yükümlülüğünüz yok. Sadece 30 saniye ayırın.

Vorte Studio`,

  // ── Yeme-İçme ──
  yemeicme: `Merhaba {firma} 👋

{sehir}'da {sektor} araması yapan birisi olarak söylüyorum — Google'da sizi bulmak kolay, ama ilk izlenim güçlendirilmeli.

{sorun}

Bilgi: Yemek sektöründe web sitesi olan işletmeler, olmayanlara göre %43 daha fazla yeni müşteri kazanıyor. Online menü, konum ve sipariş butonu — hepsi tek sayfada.

Size özel hazırladığımız demo siteye bakmanızı öneriyoruz:
👉 {link}

Tamamen ücretsiz bakın, taahhüt yok. Hoşunuza giderse 5 dk konuşalım.

Vorte Studio`,

  // ── Gıda Perakende ──
  gida: `Merhaba {firma} 👋

{sehir}'da {sektor} sektörünü incelerken sizi fark ettik.

{sorun}

Bir gerçek: Düzenli müşterileriniz bile kampanya ve yeni ürünlerinizden haberdar olmak istiyor. Web sitesi olan marketler, müşteri sadakatini %38 artırıyor.

Sektörünüze özel hazırladığımız örnek siteyi görmelisiniz:
👉 {link}

30 saniye bakın — beğenirseniz ücretsiz keşif görüşmesi yapalım.

Vorte Studio`,

  // ── Otomotiv ──
  otomotiv: `Merhaba {firma} 👋

{sehir}'da {sektor} araştırması yapan bir müşteri perspektifinden bakıyoruz.

{sorun}

Gerçek: Araç sahiplerinin %67'si servis seçerken önce Google'a bakıyor. Profesyonel bir siteye sahip servisler, telefon ile randevu taleplerinde %52 artış görüyor.

Tam sizin sektörünüze özel bir demo hazırladık:
👉 {link}

Sadece bakmanızı istiyoruz — beğenmezseniz sıfır yükümlülük.

Vorte Studio`,

  // ── İnşaat & Tadilat ──
  insaat: `Merhaba {firma} 👋

{sehir}'da {sektor} firması arayan bir müşteri gözünden baktık.

{sorun}

Önemli bir veri: Tadilat/inşaat müşterilerinin %71'i teklif almadan önce firmanın web sitesini ve referanslarını kontrol ediyor. Site olmadan güven kurmak çok zor.

Projelerinizi sergileyen bir portfolyo sitesi nasıl görünür?
👉 {link}

Ücretsiz bakın. Taahhüt yok, sadece bir fikir.

Vorte Studio`,

  // ── Eğitim ──
  egitim: `Merhaba {firma} 👋

{sehir}'da {sektor} araştırması yaparken kurumunuzu inceledik.

{sorun}

Velilerin %89'u kayıt öncesi okul/kurs hakkında online araştırma yapıyor. Profesyonel bir web sitesi, velilerin gözünde kurumsal güvenilirliğin ilk göstergesi.

Sizin kurumunuza özel tasarladığımız demo siteye göz atın:
👉 {link}

30 saniye ayırın — beğenirseniz ücretsiz keşif görüşmesi yapalım.

Vorte Studio`,

  // ── Konaklama ──
  konaklama: `Merhaba {firma} 👋

{sehir}'da konaklama seçenekleri araştırırken sizi bulduk.

{sorun}

Kritik bilgi: Misafirlerin %91'i rezervasyon öncesi otelin web sitesini inceliyor. Booking/Trivago komisyonları %15-25 arasında — kendi sitenizden direkt rezervasyon bu maliyeti sıfırlar.

Size özel hazırladığımız demo siteyi inceleyin:
👉 {link}

Ücretsiz bakın, beğenirseniz konuşalım.

Vorte Studio`,

  // ── Spor & Fitness ──
  spor: `Merhaba {firma} 👋

{sehir}'da {sektor} araştırması yaparken salonunuzu inceledik 💪

{sorun}

Bilgi: Spor salonu arayan kişilerin %68'i üyelik öncesi online ders programı, fiyat ve tesis fotoğraflarını araştırıyor. Web sitesi olan salonlar %45 daha fazla yeni üye kazanıyor.

Salonunuza özel tasarladığımız demo siteye bakın:
👉 {link}

Taahhüt yok — sadece bakın, fikir edinmeniz yeterli.

Vorte Studio`,

  // ── Atölye & İmalat ──
  imalat: `Merhaba {firma} 👋

{sehir}'da {sektor} firması araştırırken sizi bulduk.

{sorun}

B2B müşterilerin %73'ü iş ortağı seçerken firma web sitesini kontrol ediyor. Profesyonel bir site, yeni iş fırsatları ve güvenilir firma imajı demek.

Sektörünüze özel hazırladığımız örnek siteye göz atın:
👉 {link}

Ücretsiz keşif — taahhütsüz. 30 saniyenizi alır.

Vorte Studio`,

  // ── Hizmet & Profesyonel ──
  profesyonel: `Merhaba {firma} 👋

{sehir}'da {sektor} araştırması yaparken profilinizi inceledik.

{sorun}

Müvekkil/müşteri davranışı: %76'sı ilk temas öncesi firmanın web sitesini ziyaret ediyor. Kurumsal bir site, uzmanlığınızı ve referanslarınızı sergilemenin en etkili yolu.

Size özel hazırladığımız profesyonel demo siteye bakın:
👉 {link}

Tamamen ücretsiz — beğenirseniz 10 dk konuşalım.

Vorte Studio`,

  // ── Perakende ──
  perakende: `Merhaba {firma} 👋

{sehir}'da {sektor} sektörünü araştırırken mağazanızı fark ettik.

{sorun}

Tüketici araştırması: Müşterilerin %69'u mağazaya gitmeden önce ürünleri ve çalışma saatlerini online kontrol ediyor. Web sitesi olan mağazalar %41 daha fazla yaya trafiği alıyor.

Mağazanıza özel hazırladığımız demo siteye bakın:
👉 {link}

30 saniye ayırın — taahhüt yok, beğenirseniz konuşalım.

Vorte Studio`,

  // ── Teknik Servis ──
  teknik: `Merhaba {firma} 👋

{sehir}'da {sektor} arayan bir müşteri gözünden bakıyoruz.

{sorun}

Acil servis aramasında müşterinin davranışı: Google'da ilk 3 sonuca bakar, web sitesi olan güvenilir görüneni arar. Web sitesi olan servisler %58 daha fazla çağrı alıyor.

Sektörünüze özel demo sitemize bakmanızı öneriyoruz:
👉 {link}

Ücretsiz — beğenmezseniz sıfır yükümlülük.

Vorte Studio`,

  // ── Diğer Hizmetler ──
  diger: `Merhaba {firma} 👋

{sehir}'da {sektor} araştırması yaparken sizi fark ettik.

{sorun}

Dijital dünyada bir gerçek: Potansiyel müşterilerin %72'si hizmet almadan önce firmayı Google'da araştırıyor. Profesyonel bir web sitesi, güvenin ilk adımı.

Size özel hazırladığımız demo siteye bir göz atın:
👉 {link}

Tamamen ücretsiz, taahhütsüz — 30 saniyenizi alır.

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

// ── Sorun tespiti — gerçekçi ve doğru ──
export function detectIssue(lead: {
  hasWebsite: boolean;
  mobileScore?: number | null;
  sslValid?: boolean;
  website?: string | null;
}): string {
  // 1. Site yoksa — en güçlü hook
  if (!lead.hasWebsite || !lead.website) {
    return "Şu an Google'da sizi aratanlar profesyonel bir web sitenize ulaşamıyor";
  }

  // 2. Mobil performans düşükse (gerçekten ölçülmüşse)
  if (lead.mobileScore !== null && lead.mobileScore !== undefined && lead.mobileScore > 0) {
    if (lead.mobileScore < 50) {
      return `Web siteniz mobilde çok yavaş yükleniyor (${lead.mobileScore}/100) — ziyaretçilerin yarısı 3 saniyeden uzun beklemiyor`;
    }
    if (lead.mobileScore < 70) {
      return `Web sitenizin mobil hızı (${lead.mobileScore}/100) ideal seviyenin altında — bu her gün potansiyel müşteri kaybettiriyor`;
    }
  }

  // 3. Genel — site var ama iyileştirilebilir
  return "Dijital varlığınız rakiplerinizin gerisinde kalıyor olabilir — bunu birlikte değerlendirelim";
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
  return `https://vortestudio.com/demo/${slug}?ref=${leadId}`;
}

// ── WA URL oluştur ──
export function buildWaUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

// ── Adresten şehir çıkar ──
export function extractCity(address?: string | null): string {
  if (!address) return "Türkiye";
  const parts = address.split(/[,\/]/);
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
