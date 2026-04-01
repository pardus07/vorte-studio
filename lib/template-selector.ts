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

// 103 sektör → şablon eşleştirmesi (turkey-data.ts ile birebir uyumlu)
// Key'ler dropdown string'leriyle karakter karakter aynı olmalı
const sectorMap: Record<string, TemplateName> = {
  // ── Sağlık & Klinik (11) ──
  'Diş Klinikleri': 'dis-klinikleri',
  'Veteriner Klinikleri': 'veteriner-klinikleri',
  'Optik / Gözlükçü': 'optik-gozlukcu',
  'Fizik Tedavi Merkezleri': 'fizik-tedavi',
  'Tıp Merkezleri': 'tip-merkezleri',
  'Psikolog / Danışman': 'psikolog-danisma',
  'Diyetisyen / Beslenme Uzmanı': 'diyetisyen',
  'Estetik Klinik': 'estetik-klinik',
  'Özel Poliklinik': 'tip-merkezleri',
  'İşitme Merkezi': 'isitme-merkezi',
  'Göz Merkezi': 'goz-merkezi',

  // ── Güzellik & Bakım (7) ──
  'Kuaförler': 'kuaforler',
  'Berberler': 'berberler',
  'Güzellik / SPA': 'guzellik-spa',
  'Cilt Bakım Merkezleri': 'cilt-bakim',
  'Epilasyon Merkezleri': 'epilasyon',
  'Tırnak Stüdyosu': 'tirnak-studyosu',
  'Dövme & Piercing Stüdyosu': 'dovme-piercing',

  // ── Yeme-İçme (5) ──
  'Restoranlar': 'restoranlar',
  'Kafeler': 'kafeler',
  'Pastaneler': 'pastaneler',
  'Fırınlar': 'firinlar',
  'Catering / Yemek Servisi': 'catering',

  // ── Gıda Perakende (5) ──
  'Kasaplar': 'kasaplar',
  'Manavlar': 'manavlar',
  'Kuruyemişçiler': 'kuruyemisciler',
  'Su Bayileri': 'su-bayileri',
  'Şarküteri / Delikatessen': 'sarkuteri',

  // ── Konaklama & Turizm (2) ──
  'Oteller': 'oteller',
  'Seyahat Acentesi': 'seyahat-acentesi',

  // ── Eğitim (6) ──
  'Dil Kursları': 'ozel-okullar',
  'Özel Okullar': 'ozel-okullar',
  'Kreşler': 'kresler',
  'Etüt Merkezleri': 'ozel-okullar',
  'Sürücü Kursları': 'ozel-okullar',
  'Müzik Kursları': 'muzik-kurslari',

  // ── Spor & Fitness (2) ──
  'Spor Salonları': 'spor-salonlari',
  'Pilates / Yoga': 'pilates-yoga',

  // ── Otomotiv (11) ──
  'Oto Servisler': 'oto-servis',
  'Oto Yıkama': 'lastikci',
  'Lastikçiler': 'lastikci',
  'Oto Galeri': 'oto-galeri',
  'Oto Elektrik': 'oto-servis',
  'Oto Egzoz': 'oto-egzoz',
  'Oto Kaporta & Boya': 'oto-kaporta',
  'Oto Cam': 'oto-cam',
  'Oto Yedek Parça': 'lastikci',
  'Oto Aksesuar': 'lastikci',
  'Motosiklet Servisi': 'motosiklet-servisi',

  // ── İnşaat & Tadilat (16) ──
  'İnşaat Firmaları': 'insaat-firmalari',
  'Mimarlık Ofisleri': 'mimarlik-ofisleri',
  'Tadilat / Dekorasyon': 'tadilat-dekorasyon',
  'PVC Doğrama': 'tadilat-dekorasyon',
  'Alüminyum Doğrama': 'tadilat-dekorasyon',
  'Cam Balkon': 'tadilat-dekorasyon',
  'Mermer & Granit': 'mermer-granit',
  'Dış Cephe Kaplama': 'dis-cephe',
  'Isı Yalıtım / Mantolama': 'isi-yalitim',
  'Çatı Sistemleri': 'cati-sistemleri',
  'Fayans / Seramik Döşeme': 'fayans-seramik',
  'Asma Tavan / Alçıpan': 'asma-tavan',
  'Prefabrik Yapı': 'insaat-firmalari',
  'Boya Badana Ustası': 'boya-badana',
  'Elektrikçi': 'elektrikci',
  'Tesisatçı': 'tesisatci',

  // ── Atölye & İmalat (11) ──
  'Parke & Zemin Döşeme': 'parke-zemin',
  'Döşemeci / Koltuk Tamircisi': 'dosemeci',
  'Çadır & Tente İmalatı': 'cadir-tente',
  'Branda İmalatı': 'branda',
  'Kaynak & Demir Atölyesi': 'kaynak-demir',
  'Marangoz / Ahşap Atölyesi': 'marangoz',
  'Bobinaj': 'bobinaj',
  'Matbaalar': 'matbaalar',
  'Ambalaj İmalatı': 'ambalaj',
  'Plastik İmalat': 'plastik-imalat',
  'Terzi / Dikiş Atölyesi': 'terzi',

  // ── Hizmet & Profesyonel (4) ──
  'Hukuk Büroları': 'hukuk-burosu',
  'Muhasebe Büroları': 'muhasebe',
  'Emlak Ofisleri': 'emlak-ofisi',
  'Sigorta Acenteleri': 'sigorta',

  // ── Perakende (8) ──
  'Mobilya Mağazaları': 'mobilya',
  'Elektronik Mağazaları': 'elektronik',
  'Kırtasiyeler': 'kirtasiye',
  'Pet Shop': 'pet-shop',
  'Çiçekçiler': 'cicekci',
  'Kuyumcular': 'kuyumcu',
  'Tekstil / Giyim Mağazası': 'tekstil-giyim',
  'Spor Malzemeleri Mağazası': 'spor-malzemeleri',

  // ── Teknik Servis & Bakım (8) ──
  'Klima Servisi': 'klima-servisi',
  'Kombi Servisi': 'kombi-servisi',
  'Beyaz Eşya Tamircisi': 'beyaz-esya',
  'Asansör Bakım': 'asansor',
  'Jeneratör Servisi': 'jenerator',
  'Güvenlik Sistemleri': 'guvenlik-sistemleri',
  'Çilingir': 'cilingir',
  'Su Arıtma Servisi': 'su-aritma',

  // ── Diğer Hizmetler (7) ──
  'Fotoğraf Stüdyoları': 'fotograf-studyosu',
  'Temizlik Şirketleri': 'temizlik',
  'Nakliyat Firmaları': 'nakliyat',
  'Organizasyon Şirketleri': 'organizasyon',
  'Kuru Temizleme': 'kuru-temizleme',
  'Halı Yıkama': 'hali-yikama',
  'Tabela & Reklam': 'tabela-reklam',

  // ── Alias'lar (dropdown'da olmayan eski/alternatif isimler) ──
  'Beslenme Danışmanları': 'diyetisyen',
  'Sanat Atölyeleri': 'muzik-kurslari',
  'Oto Kuaför / Detailing': 'oto-servis',
  'Araç Kiralama': 'oto-galeri',
  'Oto Cam Filmi / Kaplama': 'oto-cam',
  'Müteahhitler': 'insaat-firmalari',
  'İç Mimarlar / Dekorasyon': 'mimarlik-ofisleri',
  'Boyacılar': 'boya-badana',
  'PVC / Cam Balkon': 'tadilat-dekorasyon',
  'Çelik Kapı / Kepenk': 'tadilat-dekorasyon',
  'Peyzaj / Bahçe Düzenleme': 'veteriner-klinikleri',
  'Yapı Malzeme Mağazaları': 'insaat-firmalari',
  'Güneş Enerjisi / Solar Panel': 'dis-cephe',
  'Mobilya Atölyeleri': 'marangoz',
  'Tabelacılar / Reklam': 'tabela-reklam',
  'Demiriciler / Ferforje': 'kaynak-demir',
  'Tornacılar / CNC': 'plastik-imalat',
  'Tekstil Atölyeleri': 'terzi',
  'Ayakkabıcılar': 'dosemeci',
  'Avukatlar': 'hukuk-burosu',
  'Muhasebeciler / SMMM': 'muhasebe',
  'Emlakçılar': 'emlak-ofisi',
  'Eczaneler': 'dis-klinikleri',
  'Zücaciye / Ev Gereçleri': 'mobilya',
  'Züccaciye / Hediyelik': 'mobilya',
  'Kreş / Çocuk Etkinlik': 'kresler',
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
