import type { TemplateImageSlot } from './types'

export interface TemplateImageConfig {
  id: string
  name: string
  sector: string
  imageSlots: TemplateImageSlot[]
}

/**
 * Her sablonun gorsel kimlik karti.
 * AI asistan bu config'i okuyarak dogru boyut, stil ve icerikle gorsel uretir.
 * YENi SABLON EKLERKEN BURAYA imageSlots TANIMLAMAK ZORUNLUDUR.
 */
export const TEMPLATE_IMAGE_CONFIG: Record<string, TemplateImageConfig> = {
  'dis-klinikleri': {
    id: 'dis-klinikleri',
    name: 'Dis Klinikleri',
    sector: 'Dis Klinikleri',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Hero Gorseli',
        aspectRatio: '1:1',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Modern dental clinic interior, bright white clean environment, professional dental chair and equipment, warm LED lighting, no people, clean minimalist medical aesthetic',
        position: 'Hero section sag taraf, yuvarlak maskeli dairesel alan (320x320)',
      },
    ],
  },

  'veteriner-klinikleri': {
    id: 'veteriner-klinikleri',
    name: 'Veteriner Klinikleri',
    sector: 'Veteriner Klinikleri',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Hero Gorseli',
        aspectRatio: '1:1',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Cozy veterinary clinic, cute golden retriever puppy sitting on examination table, warm natural lighting, soft green and cream tones, friendly welcoming atmosphere',
        position: 'Hero section sag taraf, yuvarlatilmis koseli alan',
      },
    ],
  },

  'optik-gozlukcu': {
    id: 'optik-gozlukcu',
    name: 'Optik / Gozlukcu',
    sector: 'Optik / Gozlukcu',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Hero Gorseli',
        aspectRatio: '1:1',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Premium optical store display, elegant luxury eyewear frames on glass shelves, dramatic lighting, navy blue and gold accents, boutique retail aesthetic',
        position: 'Hero section sag taraf, yuvarlatilmis koseli alan',
      },
    ],
  },

  'fizik-tedavi': {
    id: 'fizik-tedavi',
    name: 'Fizik Tedavi',
    sector: 'Fizik Tedavi',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Hero Gorseli',
        aspectRatio: '1:1',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Modern physical therapy and rehabilitation center, professional equipment, exercise balls, treadmill, clean teal and white interior, bright natural light, medical wellness aesthetic',
        position: 'Hero section sag taraf, yuvarlatilmis koseli alan',
      },
    ],
  },

  'tip-merkezleri': {
    id: 'tip-merkezleri',
    name: 'Tip Merkezleri',
    sector: 'Tip Merkezleri',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Hero Gorseli',
        aspectRatio: '1:1',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Modern medical center corridor, clean white walls, professional healthcare environment, blue accent lighting, reception desk, contemporary hospital interior design',
        position: 'Hero section sag taraf, yuvarlatilmis koseli alan',
      },
    ],
  },

  'estetik-klinik': {
    id: 'estetik-klinik',
    name: 'Estetik Klinik',
    sector: 'Estetik Klinik',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Hero Gorseli',
        aspectRatio: '1:1',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Luxurious aesthetic beauty clinic interior, elegant treatment room, soft cream and gold tones, marble accents, spa-like atmosphere, premium skincare products on shelf, warm ambient lighting',
        position: 'Hero section sag taraf, yuvarlatilmis koseli alan',
      },
    ],
  },

  'psikolog-danisma': {
    id: 'psikolog-danisma',
    name: 'Psikolog Danisma',
    sector: 'Psikolog Danisma',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Hero Gorseli',
        aspectRatio: '1:1',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Calming psychology consultation room, comfortable armchair, soft lavender and cream tones, indoor plants, warm reading lamp, bookshelf with psychology books, peaceful therapeutic environment',
        position: 'Hero section sag taraf, yuvarlatilmis koseli alan',
      },
    ],
  },

  diyetisyen: {
    id: 'diyetisyen',
    name: 'Diyetisyen',
    sector: 'Diyetisyen',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Hero Gorseli',
        aspectRatio: '1:1',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Fresh healthy food arrangement, colorful vegetables and fruits, avocado, salmon, nuts, quinoa bowl, wooden cutting board, bright natural lighting, clean nutrition aesthetic, lime green accents',
        position: 'Hero section sag taraf, yuvarlatilmis koseli alan',
      },
    ],
  },
}

/**
 * Sablon ID'sine gore gorsel slot bilgilerini dondurur.
 * AI asistan bu fonksiyonu kullanarak gorsel uretim parametrelerini ogrenir.
 */
export function getTemplateImageSlots(templateId: string): TemplateImageConfig | null {
  return TEMPLATE_IMAGE_CONFIG[templateId] || null
}

/**
 * Tum sablonlarin gorsel slot ozetini dondurur.
 */
export function getAllTemplateImageConfigs(): Array<{
  id: string
  name: string
  slotCount: number
  slots: string[]
}> {
  return Object.values(TEMPLATE_IMAGE_CONFIG).map((config) => ({
    id: config.id,
    name: config.name,
    slotCount: config.imageSlots.length,
    slots: config.imageSlots.map((s) => s.slot),
  }))
}
