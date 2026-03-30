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
  'İşitme Merkezleri': 'tip-merkezleri',
  'Göz Merkezleri': 'tip-merkezleri',

  // ── Güzellik & Bakım → Sprint 2-3, şimdilik en yakın eşleşme ──
  'Kuaförler': 'estetik-klinik',
  'Berberler': 'estetik-klinik',
  'Güzellik / SPA Merkezleri': 'estetik-klinik',
  'Cilt Bakım Merkezleri': 'estetik-klinik',
  'Epilasyon Merkezleri': 'estetik-klinik',
  'Tırnak Stüdyoları': 'estetik-klinik',
  'Dövme & Piercing Stüdyoları': 'estetik-klinik',

  // ── Yeme-İçme → Sprint 3 ──
  'Restoranlar': 'dis-klinikleri',
  'Kafeler': 'dis-klinikleri',
  'Pastaneler': 'dis-klinikleri',
  'Fırınlar': 'dis-klinikleri',
  'Catering / Yemek Servisleri': 'dis-klinikleri',

  // ── Gıda Perakende → Sprint 4 ──
  'Kasaplar': 'dis-klinikleri',
  'Manavlar': 'dis-klinikleri',
  'Kuruyemişçiler': 'dis-klinikleri',
  'Şarküteri / Delikatessen': 'dis-klinikleri',
  'Su Bayileri': 'dis-klinikleri',

  // ── Konaklama & Turizm → Sprint 4 ──
  'Oteller': 'tip-merkezleri',
  'Seyahat Acenteleri': 'tip-merkezleri',

  // ── Eğitim → Sprint 4-5 ──
  'Özel Okullar / Etüt Merkezleri': 'tip-merkezleri',
  'Dil Kursları': 'tip-merkezleri',
  'Sürücü Kursları': 'tip-merkezleri',
  'Kreşler': 'tip-merkezleri',
  'Müzik Kursları': 'tip-merkezleri',
  'Sanat Atölyeleri': 'tip-merkezleri',

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
}

export function getTemplateName(sector: string): TemplateName {
  return sectorMap[sector] ?? 'tip-merkezleri'
}

export async function loadTemplate(sector: string): Promise<ComponentType<TemplateProps>> {
  const name = getTemplateName(sector)
  const mod = await templateLoaders[name]()
  return mod.default
}
