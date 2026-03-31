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
  | 'sarküteri'
  | 'su-bayileri'
  | 'oteller'
  | 'seyahat-acentesi'
  | 'ozel-okullar'

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
  'Şarküteri / Delikatessen': 'sarküteri',
  'Su Bayileri': 'su-bayileri',

  // ── Konaklama & Turizm → Sprint 4 ──
  'Oteller': 'oteller',
  'Seyahat Acenteleri': 'seyahat-acentesi',

  // ── Eğitim → Sprint 4-5 ──
  'Özel Okullar / Etüt Merkezleri': 'ozel-okullar',
  'Dil Kursları': 'ozel-okullar',
  'Sürücü Kursları': 'ozel-okullar',
  'Kreşler': 'tip-merkezleri',
  'Müzik Kursları': 'ozel-okullar',
  'Sanat Atölyeleri': 'ozel-okullar',

  // ── Spor & Fitness → Sprint 5 ──
  'Spor Salonları': 'fizik-tedavi',
  'Pilates / Yoga Stüdyoları': 'fizik-tedavi',

  // ── Otomotiv → Sprint 5-6 ──
  'Oto Galeri': 'tip-merkezleri',
  'Oto Yıkama': 'tip-merkezleri',
  'Oto Kuaför / Detailing': 'tip-merkezleri',
  'Oto Elektrik': 'tip-merkezleri',
  'Oto Mekanik / Servisler': 'tip-merkezleri',
  'Lastik / Rot Balans': 'tip-merkezleri',
  'Oto Boyacılar': 'tip-merkezleri',
  'Oto Kaporta': 'tip-merkezleri',
  'Motosiklet Servisleri': 'tip-merkezleri',
  'Araç Kiralama': 'tip-merkezleri',
  'Oto Cam Filmi / Kaplama': 'tip-merkezleri',

  // ── İnşaat & Tadilat → Sprint 7-8 ──
  'Müteahhitler': 'tip-merkezleri',
  'İç Mimarlar / Dekorasyon': 'estetik-klinik',
  'Boyacılar': 'tip-merkezleri',
  'Elektrikçiler': 'tip-merkezleri',
  'Tesisatçılar': 'tip-merkezleri',
  'Alüminyum Doğrama': 'tip-merkezleri',
  'PVC / Cam Balkon': 'tip-merkezleri',
  'Çelik Kapı / Kepenk': 'tip-merkezleri',
  'Parke / Zemin Kaplama': 'tip-merkezleri',
  'Çatı & İzolasyon': 'tip-merkezleri',
  'Peyzaj / Bahçe Düzenleme': 'veteriner-klinikleri',
  'Yapı Malzeme Mağazaları': 'tip-merkezleri',
  'Tadilat / Renovasyon': 'tip-merkezleri',
  'Asansör Firmaları': 'tip-merkezleri',
  'Güneş Enerjisi / Solar Panel': 'tip-merkezleri',
  'Prefabrik Yapı': 'tip-merkezleri',

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
  'sarküteri': () => import('./templates/sarküteri'),
  'su-bayileri': () => import('./templates/su-bayileri'),
  'oteller': () => import('./templates/oteller'),
  'seyahat-acentesi': () => import('./templates/seyahat-acentesi'),
  'ozel-okullar': () => import('./templates/ozel-okullar'),
}

export function getTemplateName(sector: string): TemplateName {
  return sectorMap[sector] ?? 'tip-merkezleri'
}

export async function loadTemplate(sector: string): Promise<ComponentType<TemplateProps>> {
  const name = getTemplateName(sector)
  const mod = await templateLoaders[name]()
  return mod.default
}
