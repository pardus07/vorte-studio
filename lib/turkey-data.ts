// Türkiye 81 il — plaka sırasına göre (statik, hızlı yükleme)
export const cities = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya",
  "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir",
  "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur",
  "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli",
  "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum",
  "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari",
  "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir",
  "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir",
  "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa",
  "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir",
  "Niğde", "Ordu", "Rize", "Sakarya", "Samsun",
  "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat",
  "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van",
  "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman",
  "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan",
  "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye",
  "Düzce",
];

// İl plaka kodları (turkiyeapi.dev provinceId olarak kullanılıyor)
const cityIdMap: Record<string, number> = {
  "Adana": 1, "Adıyaman": 2, "Afyonkarahisar": 3, "Ağrı": 4, "Amasya": 5,
  "Ankara": 6, "Antalya": 7, "Artvin": 8, "Aydın": 9, "Balıkesir": 10,
  "Bilecik": 11, "Bingöl": 12, "Bitlis": 13, "Bolu": 14, "Burdur": 15,
  "Bursa": 16, "Çanakkale": 17, "Çankırı": 18, "Çorum": 19, "Denizli": 20,
  "Diyarbakır": 21, "Edirne": 22, "Elazığ": 23, "Erzincan": 24, "Erzurum": 25,
  "Eskişehir": 26, "Gaziantep": 27, "Giresun": 28, "Gümüşhane": 29, "Hakkari": 30,
  "Hatay": 31, "Isparta": 32, "Mersin": 33, "İstanbul": 34, "İzmir": 35,
  "Kars": 36, "Kastamonu": 37, "Kayseri": 38, "Kırklareli": 39, "Kırşehir": 40,
  "Kocaeli": 41, "Konya": 42, "Kütahya": 43, "Malatya": 44, "Manisa": 45,
  "Kahramanmaraş": 46, "Mardin": 47, "Muğla": 48, "Muş": 49, "Nevşehir": 50,
  "Niğde": 51, "Ordu": 52, "Rize": 53, "Sakarya": 54, "Samsun": 55,
  "Siirt": 56, "Sinop": 57, "Sivas": 58, "Tekirdağ": 59, "Tokat": 60,
  "Trabzon": 61, "Tunceli": 62, "Şanlıurfa": 63, "Uşak": 64, "Van": 65,
  "Yozgat": 66, "Zonguldak": 67, "Aksaray": 68, "Bayburt": 69, "Karaman": 70,
  "Kırıkkale": 71, "Batman": 72, "Şırnak": 73, "Bartın": 74, "Ardahan": 75,
  "Iğdır": 76, "Yalova": 77, "Karabük": 78, "Kilis": 79, "Osmaniye": 80,
  "Düzce": 81,
};

export type District = {
  name: string;
  neighborhoods: string[];
};

// İl ID'sini al
export function getCityId(cityName: string): number | null {
  return cityIdMap[cityName] || null;
}

// İlçe + mahalle verisi çek (turkiyeapi.dev)
export async function getDistricts(cityName: string): Promise<District[]> {
  const cityId = getCityId(cityName);
  if (!cityId) return [];

  try {
    const res = await fetch(
      `https://turkiyeapi.dev/api/v1/districts?provinceId=${cityId}&fields=name,neighborhoods`,
      { next: { revalidate: 86400 } } // 24 saat cache
    );
    if (!res.ok) return [];

    const data = await res.json();
    if (!data?.data) return [];

    return data.data.map((d: { name: string; neighborhoods?: { name: string }[] }) => ({
      name: d.name,
      neighborhoods: (d.neighborhoods || []).map((n) => n.name),
    }));
  } catch {
    return [];
  }
}

// Kapsamlı sektör listesi — Google Maps arama terimleri (107 sektör, 14 kategori)
export const sectors = [
  // Sağlık & Klinik
  "Diş Klinikleri",
  "Veteriner Klinikleri",
  "Optik / Gözlükçü",
  "Fizik Tedavi Merkezleri",
  "Tıp Merkezleri",
  "Psikolog / Danışman",
  "Diyetisyen / Beslenme Uzmanı",
  "Estetik Klinik",
  "Özel Poliklinik",
  "İşitme Merkezi",
  "Göz Merkezi",

  // Güzellik & Bakım
  "Kuaförler",
  "Berberler",
  "Güzellik / SPA",
  "Cilt Bakım Merkezleri",
  "Epilasyon Merkezleri",
  "Tırnak Stüdyosu",
  "Dövme & Piercing Stüdyosu",

  // Yeme-İçme
  "Restoranlar",
  "Kafeler",
  "Pastaneler",
  "Fırınlar",
  "Catering / Yemek Servisi",

  // Gıda Perakende
  "Kasaplar",
  "Manavlar",
  "Kuruyemişçiler",
  "Su Bayileri",
  "Şarküteri / Delikatessen",

  // Konaklama & Turizm
  "Oteller",
  "Seyahat Acentesi",

  // Eğitim
  "Dil Kursları",
  "Özel Okullar",
  "Kreşler",
  "Etüt Merkezleri",
  "Sürücü Kursları",
  "Müzik Kursları",

  // Spor & Fitness
  "Spor Salonları",
  "Pilates / Yoga",

  // Otomotiv
  "Oto Servisler",
  "Oto Yıkama",
  "Lastikçiler",
  "Oto Galeri",
  "Oto Elektrik",
  "Oto Egzoz",
  "Oto Kaporta & Boya",
  "Oto Cam",
  "Oto Yedek Parça",
  "Oto Aksesuar",
  "Motosiklet Servisi",

  // İnşaat & Tadilat
  "İnşaat Firmaları",
  "Mimarlık Ofisleri",
  "Tadilat / Dekorasyon",
  "PVC Doğrama",
  "Alüminyum Doğrama",
  "Cam Balkon",
  "Mermer & Granit",
  "Dış Cephe Kaplama",
  "Isı Yalıtım / Mantolama",
  "Çatı Sistemleri",
  "Fayans / Seramik Döşeme",
  "Asma Tavan / Alçıpan",
  "Prefabrik Yapı",
  "Boya Badana Ustası",
  "Elektrikçi",
  "Tesisatçı",

  // Atölye & İmalat
  "Parke & Zemin Döşeme",
  "Döşemeci / Koltuk Tamircisi",
  "Çadır & Tente İmalatı",
  "Branda İmalatı",
  "Kaynak & Demir Atölyesi",
  "Marangoz / Ahşap Atölyesi",
  "Bobinaj",
  "Matbaalar",
  "Ambalaj İmalatı",
  "Plastik İmalat",
  "Terzi / Dikiş Atölyesi",

  // Hizmet & Profesyonel
  "Hukuk Büroları",
  "Muhasebe Büroları",
  "Emlak Ofisleri",
  "Sigorta Acenteleri",

  // Perakende
  "Mobilya Mağazaları",
  "Elektronik Mağazaları",
  "Kırtasiyeler",
  "Pet Shop",
  "Çiçekçiler",
  "Kuyumcular",
  "Tekstil / Giyim Mağazası",
  "Spor Malzemeleri Mağazası",

  // Teknik Servis & Bakım
  "Klima Servisi",
  "Kombi Servisi",
  "Beyaz Eşya Tamircisi",
  "Asansör Bakım",
  "Jeneratör Servisi",
  "Güvenlik Sistemleri",
  "Çilingir",
  "Su Arıtma Servisi",

  // Diğer Hizmetler
  "Fotoğraf Stüdyoları",
  "Temizlik Şirketleri",
  "Nakliyat Firmaları",
  "Organizasyon Şirketleri",
  "Kuru Temizleme",
  "Halı Yıkama",
  "Tabela & Reklam",
];
