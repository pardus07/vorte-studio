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
  'Boyacılar': 'mimarlik-ofisleri',
  'Elektrikçiler': 'insaat-firmalari',
  'Tesisatçılar': 'insaat-firmalari',
  'Alüminyum Doğrama': 'tadilat-dekorasyon',
  'PVC / Cam Balkon': 'tadilat-dekorasyon',
  'Çelik Kapı / Kepenk': 'tadilat-dekorasyon',
  'Parke / Zemin Kaplama': 'mimarlik-ofisleri',
  'Çatı & İzolasyon': 'insaat-firmalari',
  'Peyzaj / Bahçe Düzenleme': 'veteriner-klinikleri',
  'Yapı Malzeme Mağazaları': 'insaat-firmalari',
  'Tadilat / Renovasyon': 'mimarlik-ofisleri',
  'Asansör Firmaları': 'insaat-firmalari',
  'Güneş Enerjisi / Solar Panel': 'insaat-firmalari',
  'Prefabrik Yapı': 'insaat-firmalari',

  // ── Atölye & İmalat → Sprint 9 ──
  'Mobilya Atölyeleri': 'tip-merkezleri',
  'Marangozlar': 'tip-merkezleri',
  'Kuyumcular': 'estetik-klinik',
  'Terzi / Konfeksiyoncular': 'estetik-klinik',
  'Matbaacılar': 'tip-merkezleri',
  'Tabelacılar / Reklam': 'tip-merkezleri',
  'Demiriciler / Ferforje': 'tip-merkezleri',
  'Tornacılar / CNC': 'tip-merkezleri',
  'Tekstil Atölyeleri': 'tip-merkezleri',
  'Ambalaj / Paketleme': 'tip-merkezleri',
  'Ayakkabıcılar': 'tip-merkezleri',

  // ── Hizmet & Profesyonel → Sprint 10 ──
  'Avukatlar': 'tip-merkezleri',
  'Muhasebeciler / SMMM': 'tip-merkezleri',
  'Sigorta Acenteleri': 'tip-merkezleri',
  'Emlakçılar': 'tip-merkezleri',

  // ── Perakende → Sprint 11 ──
  'Eczaneler': 'dis-klinikleri',
  'Çiçekçiler': 'veteriner-klinikleri',
  'Zücaciye / Ev Gereçleri': 'tip-merkezleri',
  'Pet Shop': 'veteriner-klinikleri',
  'Züccaciye / Hediyelik': 'tip-merkezleri',
  'Elektronik Mağazaları': 'tip-merkezleri',
  'Kırtasiyeler': 'tip-merkezleri',
  'Spor Mağazaları': 'fizik-tedavi',

  // ── Teknik Servis & Bakım → Sprint 12 ──
  'Bilgisayar Tamircileri': 'tip-merkezleri',
  'Telefon Tamircileri': 'tip-merkezleri',
  'Beyaz Eşya Servisleri': 'tip-merkezleri',
  'Klima Servisleri': 'tip-merkezleri',
  'Kombi / Doğalgaz Servisleri': 'tip-merkezleri',
  'Çilingirler': 'tip-merkezleri',
  'Halı Yıkama': 'tip-merkezleri',
  'Nakliyat Firmaları': 'tip-merkezleri',

  // ── Diğer Hizmetler → Sprint 13-14 ──
  'Fotoğrafçılar': 'estetik-klinik',
  'Organizasyon / Düğün Salonu': 'estetik-klinik',
  'Kreş / Çocuk Etkinlik': 'tip-merkezleri',
  'Oto Yedek Parça': 'tip-merkezleri',
  'Temizlik Şirketleri': 'tip-merkezleri',
  'Güvenlik Sistemleri': 'tip-merkezleri',
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
}

export function getTemplateName(sector: string): TemplateName {
  return sectorMap[sector] ?? 'tip-merkezleri'
}

export async function loadTemplate(sector: string): Promise<ComponentType<TemplateProps>> {
  const name = getTemplateName(sector)
  const mod = await templateLoaders[name]()
  return mod.default
}
