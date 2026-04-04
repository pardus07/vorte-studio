/**
 * WhatsApp İlk Temas Mesaj Şablonları — v3 (Brand-Voice)
 *
 * Pazarlama psikolojisi prensipleri:
 * - Pattern interrupt: Her şablon FARKLI açılış (soru, iddia, istatistik)
 * - Kayıp korkusu (loss aversion): Rakiplere kaybedilen müşteri vurgusu
 * - Merak boşluğu (curiosity gap): Linke tıklatmak için eksik bilgi bırakma
 * - Sosyal kanıt (social proof): Sektöre özel spesifik istatistikler
 * - Karşılıklılık (reciprocity): Ücretsiz değer sunma
 * - Aciliyet (urgency): Yumuşak zaman sınırlı teklif hissi
 *
 * Placeholder'lar: {firma}, {sektor}, {sehir}, {sorun}, {link}
 * Emoji kuralı: Max 1-2 emoji, sadece link için 👉
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
  // ── Sağlık ── (hook: güven + korku)
  saglik: `{firma} — kısa bir sorum var:

{sehir}'da {sektor} arayan bir hasta Google'a ne yazar biliyor musunuz?

Biz yazdık. Ve karşımıza çıkan sonuçlarda sizi inceledik.

{sorun}

Rakam net: Hastaların %82'si randevu öncesi kliniği Google'da arıyor. 3 saniyede profesyonel bir site göremezlerse sıradaki kliniğe geçiyor. Her gün bu şekilde kaçan hastaları düşünün.

Kliniğinize özel bir site tasarladık — 30 saniyede bakın:
{link}

Taahhüt yok. Beğenirseniz konuşalım, beğenmezseniz sıfır yükümlülük.

Vorte Studio`,

  // ── Güzellik & Bakım ── (hook: sosyal kanıt + trend)
  guzellik: `Biliyor muydunuz? {sehir}'daki her 10 salondan 6'sı son 1 yılda web sitesi yaptırdı.

{firma} olarak Google puanınız etkileyici — ama bir şey eksik:

{sorun}

Müşterilerin %74'ü randevu almadan önce salonu online araştırıyor. Instagram güzel ama yetmiyor, çünkü Google aramasında Instagram sayfanız 3. sayfada kalıyor.

Sizin tarzınıza özel bir demo hazırladık:
{link}

30 saniyenizi alır, beğenmezseniz hiçbir yükümlülük yok.

Vorte Studio`,

  // ── Yeme-İçme ── (hook: kayıp korkusu + somut fayda)
  yemeicme: `{firma} — dün gece {sehir}'da "{sektor}" diye Google'a yazdık.

Sizi bulduk, ama ilk izlenim eksik kalmış.

{sorun}

Net veri: Web sitesi olan yeme-içme işletmeleri %43 daha fazla yeni müşteri kazanıyor. Online menü, konum haritası, sipariş butonu — tek sayfada hepsi.

Sizin restoranınıza özel bir site tasarladık:
{link}

Tamamen ücretsiz bakın. Hoşunuza giderse 5 dk konuşalım.

Vorte Studio`,

  // ── Gıda Perakende ── (hook: müşteri sadakati + merak)
  gida: `{firma} — düzenli müşterileriniz bile kampanyalarınızdan haberdar olamıyorsa bir sorun var.

{sehir}'da {sektor} sektörünü incelerken sizi fark ettik.

{sorun}

Web sitesi olan gıda işletmeleri müşteri sadakatini %38 artırıyor. Kampanya duyurusu, ürün kataloğu, WhatsApp sipariş butonu — hepsi bir arada.

Sektörünüze özel örnek siteyi görmeniz lazım:
{link}

30 saniye bakın — beğenirseniz ücretsiz keşif görüşmesi yapalım.

Vorte Studio`,

  // ── Otomotiv ── (hook: aciliyet + kayıp)
  otomotiv: `{firma} — şu an {sehir}'da "{sektor}" arayan bir araç sahibi Google'a bakıyor.

Sizi buluyor mu? Yoksa rakibinize mi gidiyor?

{sorun}

Araç sahiplerinin %67'si servis seçerken Google'a bakıyor. Profesyonel sitesi olan servisler %52 daha fazla randevu talebi alıyor. Her geçen gün bu farkı rakipleriniz lehine büyütüyor.

Tam sizin sektöre özel bir demo hazırladık:
{link}

Bakmanız 30 saniye sürer — beğenmezseniz sıfır yükümlülük.

Vorte Studio`,

  // ── İnşaat & Tadilat ── (hook: güven problemi + portfolyo)
  insaat: `Bir müşteri {sehir}'da {sektor} firması arıyor. Teklif almadan önce ne yapıyor biliyor musunuz?

Firmanın web sitesine ve referanslarına bakıyor. %71'i bunu yapıyor.

{firma} olarak sizi inceledik:
{sorun}

Web sitesi olmadan güven kurmak neredeyse imkansız. Projelerinizi sergileyen profesyonel bir portfolyo, fiyat rekabeti yerine kalite rekabetine geçmenizi sağlar.

Nasıl görüneceğini hazırladık:
{link}

Ücretsiz bakın. Taahhüt yok, sadece bir fikir.

Vorte Studio`,

  // ── Eğitim ── (hook: veli psikolojisi + güvenilirlik)
  egitim: `{firma} — velilerin %89'u kayıt öncesi kurumunuzu Google'da arıyor. Peki ne görüyorlar?

{sehir}'da {sektor} araştırması yaparken sizi inceledik.

{sorun}

Profesyonel bir web sitesi, velilerin gözünde kurumsal güvenilirliğin ilk göstergesi. Kadro bilgisi, program detayları, başarı hikayeleri — bunlar kaydı tetikleyen unsurlar.

Kurumunuza özel tasarladığımız demo siteye göz atın:
{link}

30 saniye ayırın — beğenirseniz ücretsiz keşif görüşmesi yapalım.

Vorte Studio`,

  // ── Konaklama ── (hook: komisyon kaybı + direkt gelir)
  konaklama: `{firma} — Booking ve Trivago'ya her rezervasyonda %15-25 komisyon ödüyorsunuz. Bunu sıfırlayabilirsiniz.

{sehir}'da konaklama araştırırken sizi inceledik.

{sorun}

Misafirlerin %91'i rezervasyon öncesi otelin kendi sitesini arıyor. Profesyonel bir site ile direkt rezervasyon alarak aracı komisyonlarını ortadan kaldırabilirsiniz.

Size özel bir demo hazırladık:
{link}

Ücretsiz bakın, beğenirseniz konuşalım.

Vorte Studio`,

  // ── Spor & Fitness ── (hook: üye kazanımı + trend)
  spor: `{firma} — {sehir}'da spor salonu arayan birinin ilk yaptığı şey ne biliyor musunuz?

Google'a yazıp ders programı, fiyat ve tesis fotoğraflarına bakmak. %68'i bunu yapıyor.

{sorun}

Web sitesi olan salonlar %45 daha fazla yeni üye kazanıyor. Online ders takvimi, üyelik paketleri, tesis galerisi — potansiyel üyenin aradığı her şey tek yerde.

Salonunuza özel demo siteye bakın:
{link}

Taahhüt yok — sadece bakın, fikir edinmeniz yeterli.

Vorte Studio`,

  // ── Atölye & İmalat ── (hook: B2B güven + iş fırsatı)
  imalat: `{firma} — B2B müşterilerinizin %73'ü sizi Google'da arıyor. Ne buluyorlar?

{sehir}'da {sektor} araştırırken sizi fark ettik.

{sorun}

Profesyonel bir web sitesi, yeni iş fırsatları demek. Ürün kataloğu, referanslar, kapasite bilgisi — bunlar potansiyel iş ortağını ikna eden unsurlar.

Sektörünüze özel bir örnek hazırladık:
{link}

30 saniye bakın, taahhütsüz. Beğenirseniz konuşalım.

Vorte Studio`,

  // ── Hizmet & Profesyonel ── (hook: uzmanlık kanıtı + ilk izlenim)
  profesyonel: `{firma} — potansiyel müşterilerinizin %76'sı ilk temas öncesi web sitenizi ziyaret ediyor.

Peki şu an ne görüyorlar?

{sehir}'da {sektor} araştırması yaparken profilinizi inceledik.

{sorun}

Kurumsal bir web sitesi, uzmanlığınızı ve referanslarınızı sergilemenin en etkili yolu. Hizmet alanları, ekip bilgisi, başarı hikayeleri — güveni dijitalde inşa edin.

Size özel profesyonel demo siteye bakın:
{link}

Tamamen ücretsiz — beğenirseniz 10 dk konuşalım.

Vorte Studio`,

  // ── Perakende ── (hook: mağaza trafiği + online keşif)
  perakende: `{firma} — müşterilerinizin %69'u mağazanıza gelmeden önce sizi online arıyor. Bulabiliyorlar mı?

{sehir}'da {sektor} araştırırken sizi fark ettik.

{sorun}

Web sitesi olan mağazalar %41 daha fazla ziyaretçi alıyor. Ürün vitrini, çalışma saatleri, konum haritası — müşteriyi kapınıza getiren üçlü.

Mağazanıza özel demo siteye bakın:
{link}

30 saniye ayırın — taahhüt yok, beğenirseniz konuşalım.

Vorte Studio`,

  // ── Teknik Servis ── (hook: acil arama davranışı)
  teknik: `{firma} — kliması bozulan, kombi arıza veren biri ne yapar? Google'a yazar ve ilk 3 sonuca bakar.

Sizin orada olmanız lazım.

{sehir}'da {sektor} arayan bir müşteri gözünden baktık.

{sorun}

Web sitesi olan servisler %58 daha fazla çağrı alıyor. Acil servis numarası, hizmet bölgesi, fiyat bilgisi — müşteri bunları 10 saniyede görmek istiyor.

Sektörünüze özel demo siteye bakın:
{link}

Ücretsiz — beğenmezseniz sıfır yükümlülük.

Vorte Studio`,

  // ── Diğer Hizmetler ── (hook: dijital güven + genel)
  diger: `{firma} — {sehir}'da {sektor} arayan potansiyel müşterileriniz sizi Google'da buluyor mu?

Biz aradık ve şunu fark ettik:

{sorun}

Müşterilerin %72'si hizmet almadan önce firmayı online araştırıyor. Profesyonel bir web sitesi, güvenin ilk adımı — telefonu açmadan önce karar zaten veriliyor.

Size özel bir demo site hazırladık:
{link}

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

// ── Bilgilendirme notu (KVKK / Şeffaflık) ──
const DISCLOSURE_NOTE = `

---
Sayın firma yetkilisi, GSM numaranızı Google Haritalar'da halka açık olarak yayınlanan işletme bilgilerinizden aldık. Firmanızın Google Haritalar kaydında web sitesi bulunmadığını veya mevcut sitenizin iyileştirilebileceğini tespit ettiğimiz için sizinle iletişime geçiyoruz. Yanıt vermek istemezseniz bu mesajı görmezden gelebilirsiniz.`;

// ── Şablon oluştur ──
export function generateWaMessage(data: WaTemplateData): string {
  const group = sectorGroupMap[data.sektor] || "diger";
  const tpl = templates[group] || templates.diger;

  const message = tpl
    .replace(/\{firma\}/g, data.firma)
    .replace(/\{sektor\}/g, data.sektor.toLowerCase())
    .replace(/\{sehir\}/g, data.sehir)
    .replace(/\{sorun\}/g, data.sorun)
    .replace(/\{link\}/g, data.link);

  return message + DISCLOSURE_NOTE;
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
