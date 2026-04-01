import type { ComponentType } from 'react'
import type { TemplateProps } from './templates/types'

type TemplateName =
  | 'dis-klinikleri'
  | 'veteriner-klinikleri'
  | 'optik-gozlukcu'
  | 'fizik-tedavi'
  | 'tip-merkezleri'
  | 'estetik-klinik'
  | 'psikolog-danisma'
  | 'diyetisyen'
  | 'isitme-merkezi'
  | 'goz-merkezi'
  | 'kuaforler'
  | 'berberler'
  | 'guzellik-spa'
  | 'cilt-bakim'
  | 'epilasyon'
  | 'tirnak-studyosu'
  | 'dovme-piercing'
  | 'restoranlar'
  | 'kafeler'
  | 'pastaneler'
  | 'firinlar'
  | 'catering'
  | 'kasaplar'
  | 'manavlar'
  | 'kuruyemisciler'
  | 'sarkuteri'
  | 'su-bayileri'
  | 'oteller'
  | 'seyahat-acentesi'
  | 'ozel-okullar'
  | 'kresler'
  | 'muzik-kurslari'
  | 'spor-salonlari'
  | 'pilates-yoga'
  | 'oto-galeri'
  | 'oto-servis'
  | 'lastikci'
  | 'oto-egzoz'
  | 'oto-kaporta'
  | 'oto-cam'
  | 'motosiklet-servisi'
  | 'insaat-firmalari'
  | 'mimarlik-ofisleri'
  | 'tadilat-dekorasyon'
  | 'isi-yalitim'
  | 'dis-cephe'
  | 'cati-sistemleri'
  | 'fayans-seramik'
  | 'asma-tavan'
  | 'boya-badana'
  | 'elektrikci'
  | 'tesisatci'
  | 'mermer-granit'
  | 'parke-zemin'
  | 'dosemeci'
  | 'marangoz'
  | 'cadir-tente'
  | 'branda'
  | 'kaynak-demir'
  | 'bobinaj'
  | 'matbaalar'
  | 'ambalaj'
  | 'plastik-imalat'
  | 'terzi'
  | 'tabela-reklam'
  | 'hukuk-burosu'
  | 'muhasebe'
  | 'sigorta'
  | 'emlak-ofisi'
  | 'mobilya'
  | 'elektronik'
  | 'kirtasiye'
  | 'pet-shop'
  | 'cicekci'
  | 'kuyumcu'
  | 'tekstil-giyim'
  | 'spor-malzemeleri'
  | 'klima-servisi'
  | 'kombi-servisi'
  | 'beyaz-esya'
  | 'asansor'
  | 'jenerator'
  | 'guvenlik-sistemleri'
  | 'cilingir'
  | 'su-aritma'
  | 'fotograf-studyosu'
  | 'temizlik'
  | 'kuru-temizleme'
  | 'hali-yikama'
  | 'nakliyat'
  | 'organizasyon'

// 107 sektör → şablon eşleştirmesi
// Sprint 1: Sağlık & Klinik (8 şablon)
// Diğer sprint'lerde eklenen sektörler default şablona düşer
const sectorMap: Record<string, TemplateName> = {
  // ── Sağlık & Klinik ──
  'Diş Klinikleri': 'dis-klinikleri',
  'Veteriner Klinikleri': 'veteriner-klinikleri',
  'Optik / Gözlükçü': 'optik-gozlukcu',
  'Fizik Tedavi Merkezleri': 'fizik-tedavi',
  'Tıp Merkezleri': 'tip-merkezleri',
  'Özel Poliklinikler': 'tip-merkezleri',
  'Estetik Klinikler': 'estetik-klinik',
  'Psikologlar / Danışmanlar': 'psikolog-danisma',
  'Diyetisyenler': 'diyetisyen',
  'Beslenme Danışmanları': 'diyetisyen',
  // İşitme Merkezi, Göz Merkezi → Sprint 2
  'İşitme Merkezleri': 'isitme-merkezi',
  'Göz Merkezleri': 'goz-merkezi',

  // ── Güzellik & Bakım → Sprint 2 ──
  'Kuaförler': 'kuaforler',
  'Berberler': 'berberler',
  'Güzellik / SPA Merkezleri': 'guzellik-spa',
  'Cilt Bakım Merkezleri': 'cilt-bakim',
  'Epilasyon Merkezleri': 'epilasyon',
  'Tırnak Stüdyoları': 'tirnak-studyosu',
  'Dövme & Piercing Stüdyoları': 'dovme-piercing',

  // ── Yeme-İçme → Sprint 3 ──
  'Restoranlar': 'restoranlar',
  'Kafeler': 'kafeler',
  'Pastaneler': 'pastaneler',
  'Fırınlar': 'firinlar',
  'Catering / Yemek Servisleri': 'catering',

  // ── Gıda Perakende → Sprint 3 (kasaplar) + Sprint 4 ──
  'Kasaplar': 'kasaplar',
  'Manavlar': 'manavlar',
  'Kuruyemişçiler': 'kuruyemisciler',
  'Şarküteri / Delikatessen': 'sarkuteri',
  'Su Bayileri': 'su-bayileri',

  // ── Konaklama & Turizm → Sprint 4 ──
  'Oteller': 'oteller',
  'Seyahat Acenteleri': 'seyahat-acentesi',

  // ── Eğitim → Sprint 4-5 ──
  'Özel Okullar / Etüt Merkezleri': 'ozel-okullar',
  'Dil Kursları': 'ozel-okullar',
  'Sürücü Kursları': 'ozel-okullar',
  'Kreşler': 'kresler',
  'Müzik Kursları': 'muzik-kurslari',
  'Sanat Atölyeleri': 'muzik-kurslari',

  // ── Spor & Fitness → Sprint 5 ──
  'Spor Salonları': 'spor-salonlari',
  'Pilates / Yoga Stüdyoları': 'pilates-yoga',

  // ── Otomotiv → Sprint 5-6 ──
  'Oto Galeri': 'oto-galeri',
  'Oto Yıkama': 'lastikci',
  'Oto Kuaför / Detailing': 'oto-servis',
  'Oto Elektrik': 'oto-servis',
  'Oto Mekanik / Servisler': 'oto-servis',
  'Lastik / Rot Balans': 'lastikci',
  'Oto Boyacılar': 'oto-kaporta',
  'Oto Kaporta': 'oto-kaporta',
  'Motosiklet Servisleri': 'motosiklet-servisi',
  'Araç Kiralama': 'oto-galeri',
  'Oto Cam Filmi / Kaplama': 'oto-cam',
  'Oto Egzoz': 'oto-egzoz',
  'Oto Cam': 'oto-cam',
  'Yedek Parça': 'lastikci',

  // ── İnşaat & Tadilat → Sprint 6-8 ──
  'Müteahhitler': 'insaat-firmalari',
  'İç Mimarlar / Dekorasyon': 'mimarlik-ofisleri',
  'Boyacılar': 'boya-badana',
  'Elektrikçiler': 'elektrikci',
  'Tesisatçılar': 'tesisatci',
  'Alüminyum Doğrama': 'tadilat-dekorasyon',
  'PVC / Cam Balkon': 'tadilat-dekorasyon',
  'Çelik Kapı / Kepenk': 'tadilat-dekorasyon',
  'Parke / Zemin Kaplama': 'parke-zemin',
  'Çatı & İzolasyon': 'cati-sistemleri',
  'Isı Yalıtım / Mantolama': 'isi-yalitim',
  'Dış Cephe Kaplama': 'dis-cephe',
  'Fayans / Seramik': 'fayans-seramik',
  'Asma Tavan / Alçıpan': 'asma-tavan',
  'Boya Badana': 'boya-badana',
  'Peyzaj / Bahçe Düzenleme': 'veteriner-klinikleri',
  'Yapı Malzeme Mağazaları': 'insaat-firmalari',
  'Tadilat / Renovasyon': 'mimarlik-ofisleri',
  // 'Asansör Firmaları' → Sprint 11'de 'asansor' şablonuna taşındı
  'Güneş Enerjisi / Solar Panel': 'dis-cephe',
  'Prefabrik Yapı': 'insaat-firmalari',

  // ── İnşaat (devam) → Sprint 8 ──
  'Mermer / Granit': 'mermer-granit',
  'Döşemeciler': 'dosemeci',
  'Çadır / Tente İmalatı': 'cadir-tente',
  'Branda İmalatı': 'branda',

  // ── Atölye & İmalat → Sprint 8-9 ──
  'Mobilya Atölyeleri': 'marangoz',
  'Marangozlar': 'marangoz',
  'Kuyumcular': 'kuyumcu',
  'Terzi / Konfeksiyoncular': 'terzi',
  'Matbaacılar': 'matbaalar',
  'Tabelacılar / Reklam': 'tabela-reklam',
  'Demiriciler / Ferforje': 'kaynak-demir',
  'Kaynak / Demir Atölyesi': 'kaynak-demir',
  'Bobinajcılar': 'bobinaj',
  'Tornacılar / CNC': 'plastik-imalat',
  'Tekstil Atölyeleri': 'terzi',
  'Ambalaj / Paketleme': 'ambalaj',
  'Ayakkabıcılar': 'dosemeci',
  'Plastik İmalatı': 'plastik-imalat',

  // ── Hizmet & Profesyonel → Sprint 9 ──
  'Avukatlar': 'hukuk-burosu',
  'Muhasebeciler / SMMM': 'muhasebe',
  'Sigorta Acenteleri': 'sigorta',

  // ── Perakende + Teknik Servis (1/2) → Sprint 10 ──
  'Emlakçılar': 'emlak-ofisi',
  'Mobilya Mağazaları': 'mobilya',
  'Elektronik Mağazaları': 'elektronik',
  'Kırtasiyeler': 'kirtasiye',
  'Pet Shop': 'pet-shop',
  'Çiçekçiler': 'cicekci',
  'Tekstil / Giyim Mağazası': 'tekstil-giyim',
  'Eczaneler': 'dis-klinikleri',
  'Zücaciye / Ev Gereçleri': 'mobilya',
  'Züccaciye / Hediyelik': 'mobilya',

  // ── Perakende (devam) + Teknik Servis (2/2) + Diğer Hizmetler → Sprint 11 ──
  'Spor Malzemeleri Mağazası': 'spor-malzemeleri',
  'Klima Servisi': 'klima-servisi',
  'Kombi Servisi': 'kombi-servisi',
  'Beyaz Eşya Tamircisi': 'beyaz-esya',
  'Asansör Bakım': 'asansor',
  'Jeneratör Servisi': 'jenerator',
  'Güvenlik Sistemleri': 'guvenlik-sistemleri',
  'Çilingir': 'cilingir',

  // ── Diğer Hizmetler → Sprint 12 ──
  'Su Arıtma Servisi': 'su-aritma',
  'Fotoğraf Stüdyoları': 'fotograf-studyosu',
  'Temizlik Şirketleri': 'temizlik',
  'Kuru Temizleme': 'kuru-temizleme',
  'Halı Yıkama': 'hali-yikama',
  'Nakliyat Firmaları': 'nakliyat',
  'Organizasyon Şirketleri': 'organizasyon',
  'Tabela & Reklam': 'tabela-reklam',
  // ── Fallback → Sprint 13+ ──
  'Kreş / Çocuk Etkinlik': 'tip-merkezleri',
  'Oto Yedek Parça': 'tip-merkezleri',
  'Cenaze Hizmetleri': 'tip-merkezleri',
}

const templateLoaders: Record<TemplateName, () => Promise<{ default: ComponentType<TemplateProps> }>> = {
  'dis-klinikleri': () => import('./templates/dis-klinikleri'),
  'veteriner-klinikleri': () => import('./templates/veteriner-klinikleri'),
  'optik-gozlukcu': () => import('./templates/optik-gozlukcu'),
  'fizik-tedavi': () => import('./templates/fizik-tedavi'),
  'tip-merkezleri': () => import('./templates/tip-merkezleri'),
  'estetik-klinik': () => import('./templates/estetik-klinik'),
  'psikolog-danisma': () => import('./templates/psikolog-danisma'),
  'diyetisyen': () => import('./templates/diyetisyen'),
  'isitme-merkezi': () => import('./templates/isitme-merkezi'),
  'goz-merkezi': () => import('./templates/goz-merkezi'),
  'kuaforler': () => import('./templates/kuaforler'),
  'berberler': () => import('./templates/berberler'),
  'guzellik-spa': () => import('./templates/guzellik-spa'),
  'cilt-bakim': () => import('./templates/cilt-bakim'),
  'epilasyon': () => import('./templates/epilasyon'),
  'tirnak-studyosu': () => import('./templates/tirnak-studyosu'),
  'dovme-piercing': () => import('./templates/dovme-piercing'),
  'restoranlar': () => import('./templates/restoranlar'),
  'kafeler': () => import('./templates/kafeler'),
  'pastaneler': () => import('./templates/pastaneler'),
  'firinlar': () => import('./templates/firinlar'),
  'catering': () => import('./templates/catering'),
  'kasaplar': () => import('./templates/kasaplar'),
  'manavlar': () => import('./templates/manavlar'),
  'kuruyemisciler': () => import('./templates/kuruyemisciler'),
  'sarkuteri': () => import('./templates/sarkuteri'),
  'su-bayileri': () => import('./templates/su-bayileri'),
  'oteller': () => import('./templates/oteller'),
  'seyahat-acentesi': () => import('./templates/seyahat-acentesi'),
  'ozel-okullar': () => import('./templates/ozel-okullar'),
  'kresler': () => import('./templates/kresler'),
  'muzik-kurslari': () => import('./templates/muzik-kurslari'),
  'spor-salonlari': () => import('./templates/spor-salonlari'),
  'pilates-yoga': () => import('./templates/pilates-yoga'),
  'oto-galeri': () => import('./templates/oto-galeri'),
  'oto-servis': () => import('./templates/oto-servis'),
  'lastikci': () => import('./templates/lastikci'),
  'oto-egzoz': () => import('./templates/oto-egzoz'),
  'oto-kaporta': () => import('./templates/oto-kaporta'),
  'oto-cam': () => import('./templates/oto-cam'),
  'motosiklet-servisi': () => import('./templates/motosiklet-servisi'),
  'insaat-firmalari': () => import('./templates/insaat-firmalari'),
  'mimarlik-ofisleri': () => import('./templates/mimarlik-ofisleri'),
  'tadilat-dekorasyon': () => import('./templates/tadilat-dekorasyon'),
  'isi-yalitim': () => import('./templates/isi-yalitim'),
  'dis-cephe': () => import('./templates/dis-cephe'),
  'cati-sistemleri': () => import('./templates/cati-sistemleri'),
  'fayans-seramik': () => import('./templates/fayans-seramik'),
  'asma-tavan': () => import('./templates/asma-tavan'),
  'boya-badana': () => import('./templates/boya-badana'),
  'elektrikci': () => import('./templates/elektrikci'),
  'tesisatci': () => import('./templates/tesisatci'),
  'mermer-granit': () => import('./templates/mermer-granit'),
  'parke-zemin': () => import('./templates/parke-zemin'),
  'dosemeci': () => import('./templates/dosemeci'),
  'marangoz': () => import('./templates/marangoz'),
  'cadir-tente': () => import('./templates/cadir-tente'),
  'branda': () => import('./templates/branda'),
  'kaynak-demir': () => import('./templates/kaynak-demir'),
  'bobinaj': () => import('./templates/bobinaj'),
  'matbaalar': () => import('./templates/matbaalar'),
  'ambalaj': () => import('./templates/ambalaj'),
  'plastik-imalat': () => import('./templates/plastik-imalat'),
  'terzi': () => import('./templates/terzi'),
  'tabela-reklam': () => import('./templates/tabela-reklam'),
  'hukuk-burosu': () => import('./templates/hukuk-burosu'),
  'muhasebe': () => import('./templates/muhasebe'),
  'sigorta': () => import('./templates/sigorta'),
  'emlak-ofisi': () => import('./templates/emlak-ofisi'),
  'mobilya': () => import('./templates/mobilya'),
  'elektronik': () => import('./templates/elektronik'),
  'kirtasiye': () => import('./templates/kirtasiye'),
  'pet-shop': () => import('./templates/pet-shop'),
  'cicekci': () => import('./templates/cicekci'),
  'kuyumcu': () => import('./templates/kuyumcu'),
  'tekstil-giyim': () => import('./templates/tekstil-giyim'),
  'spor-malzemeleri': () => import('./templates/spor-malzemeleri'),
  'klima-servisi': () => import('./templates/klima-servisi'),
  'kombi-servisi': () => import('./templates/kombi-servisi'),
  'beyaz-esya': () => import('./templates/beyaz-esya'),
  'asansor': () => import('./templates/asansor'),
  'jenerator': () => import('./templates/jenerator'),
  'guvenlik-sistemleri': () => import('./templates/guvenlik-sistemleri'),
  'cilingir': () => import('./templates/cilingir'),
  'su-aritma': () => import('./templates/su-aritma'),
  'fotograf-studyosu': () => import('./templates/fotograf-studyosu'),
  'temizlik': () => import('./templates/temizlik'),
  'kuru-temizleme': () => import('./templates/kuru-temizleme'),
  'hali-yikama': () => import('./templates/hali-yikama'),
  'nakliyat': () => import('./templates/nakliyat'),
  'organizasyon': () => import('./templates/organizasyon'),
}

export function getTemplateName(sector: string): TemplateName {
  return sectorMap[sector] ?? 'tip-merkezleri'
}

export async function loadTemplate(sector: string): Promise<ComponentType<TemplateProps>> {
  const name = getTemplateName(sector)
  const mod = await templateLoaders[name]()
  return mod.default
}
