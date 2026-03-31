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

  /* ============================================================ */
  /*  SPRINT 2 — SAGLIK & KLINIK (2/3) + GUZELLIK (1/2)          */
  /* ============================================================ */

  'isitme-merkezi': {
    id: 'isitme-merkezi',
    name: 'Isitme Merkezi',
    sector: 'Isitme Merkezleri',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Hero Gorseli',
        aspectRatio: '1:1',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Modern hearing center interior, professional audiometry room, hearing aid display cabinet, soft blue and white tones, warm LED lighting, clean medical aesthetic, no people',
        position: 'Hero section sag taraf, rounded-3xl kutu (320x320), floating badge dekorasyonu',
      },
      {
        slot: 'device',
        label: 'Cihaz Teknolojisi Banner',
        aspectRatio: '16:9',
        imageSize: '2K',
        style: 'photorealistic',
        promptHint:
          'Close-up of modern digital hearing aids on white surface, premium hearing device technology, Bluetooth connectivity, sleek miniature design, clinical product photography',
        position: 'Alarm ile comparison arasi full-width banner (h-56/h-72), mavi gradient overlay',
      },
    ],
  },

  'goz-merkezi': {
    id: 'goz-merkezi',
    name: 'Goz Merkezi',
    sector: 'Goz Merkezleri',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Hero Gorseli',
        aspectRatio: '1:1',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Advanced ophthalmology examination room, slit lamp microscope, autorefractor, deep blue and gold ambient lighting, high-tech medical environment, no people',
        position: 'Hero section sag taraf, altigen (hexagonal) clip-path maskeli alan, altin golge offset',
      },
      {
        slot: 'technology',
        label: 'Lazer Teknoloji Karti',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'LASIK laser eye surgery machine in a modern operating room, blue sterile environment, advanced refractive surgery technology, dramatic clinical lighting',
        position: 'Guarantee bolumunde full-width kart, mavi gradient overlay, badge ustunde',
      },
    ],
  },

  kuaforler: {
    id: 'kuaforler',
    name: 'Kuaforler',
    sector: 'Kuaforler',
    imageSlots: [
      {
        slot: 'hero-bg',
        label: 'Hero Arkaplan',
        aspectRatio: '16:9',
        imageSize: '2K',
        style: 'photorealistic',
        promptHint:
          'Luxury modern hair salon interior, stylish mirrors and lighting, elegant black and gold decor, professional hairdressing stations, warm ambient lighting, no people, lifestyle aesthetic',
        position: 'Hero section tam ekran arkaplan, koyu gradient overlay (soldan saga), text ustunde',
      },
      {
        slot: 'showcase',
        label: 'Stil Gorseli',
        aspectRatio: '1:1',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Beautiful hairstyle showcase, elegant hair styling tools arrangement, scissors and combs on marble surface, gold and black tones, salon lifestyle photography',
        position: 'Comparison ile CTA arasi dairesel gorsel strip (w-48 h-48), altin ring border',
      },
    ],
  },

  berberler: {
    id: 'berberler',
    name: 'Berberler',
    sector: 'Berberler',
    imageSlots: [
      {
        slot: 'hero-bg',
        label: 'Hero Arkaplan',
        aspectRatio: '16:9',
        imageSize: '2K',
        style: 'photorealistic',
        promptHint:
          'Classic barbershop interior, vintage leather barber chair, warm Edison bulb lighting, brick wall, wooden shelves with grooming products, retro-modern masculine aesthetic, no people',
        position: 'Hero section tam ekran arkaplan, retro film grain overlay, soldan koyu gradient',
      },
      {
        slot: 'tools',
        label: 'Berber Aletleri',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Professional barber tools flat lay, straight razor, scissors, comb, shaving brush, leather strop on dark wooden surface, classic barbershop product photography',
        position: 'CTA bolumunde grid layout sag taraf, kirmizi border kart, text yaninda',
      },
    ],
  },

  'guzellik-spa': {
    id: 'guzellik-spa',
    name: 'Guzellik / SPA',
    sector: 'Guzellik / SPA',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Hero Gorseli',
        aspectRatio: '1:1',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Luxury spa treatment room, white towels, orchid flowers, candles, essential oil bottles, soft pink and gold ambient lighting, zen relaxation aesthetic, no people',
        position: 'Hero section sag taraf, organik blob sekil (CSS border-radius 60%/40%/55%/45%), altin golge',
      },
      {
        slot: 'ambiance',
        label: 'SPA Atmosfer Banner',
        aspectRatio: '16:9',
        imageSize: '2K',
        style: 'photorealistic',
        promptHint:
          'Serene spa atmosphere, hot stones on bamboo mat, lavender sprigs, warm candlelight, steam rising, soft pink and cream tones, wellness and relaxation mood photography',
        position: 'Alarm ile comparison arasi full-width mood banner (h-64/h-80), pembe gradient overlay',
      },
    ],
  },

  'cilt-bakim': {
    id: 'cilt-bakim',
    name: 'Cilt Bakim Merkezleri',
    sector: 'Cilt Bakim',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Hero Gorseli',
        aspectRatio: '1:1',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Natural skincare products arrangement, glass bottles with serums, fresh green leaves, cream jars on light wood surface, soft warm lighting, organic beauty aesthetic, no people',
        position: 'Hero section sag taraf, dikey uzun kart (h-96 w-72), ince kahve border, yaprak dekorasyonu',
      },
      {
        slot: 'products',
        label: 'Urun Sergileme Karti',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Professional dermatology treatment room, facial steamer, magnifying lamp, skincare products on shelf, clean cream and green interior, clinical beauty environment',
        position: 'Guarantee bolumunde full-width urun karti, yesil border, badge ustunde',
      },
    ],
  },

  epilasyon: {
    id: 'epilasyon',
    name: 'Epilasyon Merkezleri',
    sector: 'Epilasyon',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Hero Gorseli',
        aspectRatio: '1:1',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Modern laser hair removal clinic interior, clean white treatment bed, professional IPL device, teal and white color scheme, sterile hygienic environment, no people',
        position: 'Hero section sag taraf, geometrik cerceve (teal kose aksanlari), kare alan (288x288)',
      },
      {
        slot: 'technology',
        label: 'Lazer Teknoloji Karti',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Close-up of professional laser hair removal device, IPL handpiece, modern aesthetic clinic technology, teal LED indicators, clinical product photography',
        position: 'Alarm section icinde floating kart, teal bg uzerinde sag tarafta, ring-2 white border',
      },
    ],
  },

  'tirnak-studyosu': {
    id: 'tirnak-studyosu',
    name: 'Tirnak Studyosu',
    sector: 'Tirnak Studyosu',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Hero Gorseli',
        aspectRatio: '1:1',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Beautiful nail art showcase, colorful manicured nails close-up, nail polish bottles arrangement, pink and pastel tones, Instagram-worthy nail photography',
        position: 'Hero section sag taraf, egimli pembe golge kart (rotate 3deg), offset shadow',
      },
      {
        slot: 'gallery',
        label: 'Galeri Gorsel 1',
        aspectRatio: '1:1',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Elegant gel nail design close-up, French manicure with glitter accents, professional nail art, soft pink lighting, beauty salon photography',
        position: 'Comparison ile CTA arasi 2-sutun grid sol, pembe border, hover efekti',
      },
      {
        slot: 'gallery2',
        label: 'Galeri Gorsel 2',
        aspectRatio: '1:1',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Creative nail art designs, geometric patterns on nails, vibrant colors, nail technician workspace with tools, trendy Instagram aesthetic',
        position: 'Comparison ile CTA arasi 2-sutun grid sag, pembe border, hover efekti',
      },
    ],
  },
  /* ============================================================ */
  /*  SPRINT 3 — GUZELLIK (2/2) + YEME-ICME                      */
  /* ============================================================ */

  'dovme-piercing': {
    id: 'dovme-piercing',
    name: 'Dovme & Piercing',
    sector: 'Dovme & Piercing',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Portfolyo Ana Gorsel',
        aspectRatio: '16:10',
        imageSize: '2K',
        style: 'photorealistic',
        promptHint:
          'Professional tattoo portfolio showcase, close-up of intricate tattoo artwork on skin, dramatic dark lighting, artistic photography, underground studio aesthetic, no face',
        position: 'Hero section sag taraf, 2-sutun grid ust kisim full-width (16:10), neon border efekti',
      },
      {
        slot: 'portfolio',
        label: 'Portfolyo Ikinci Gorsel',
        aspectRatio: '1:1',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Tattoo studio interior, professional tattoo machine and ink bottles, dark moody lighting, sterilization equipment visible, artistic workspace',
        position: 'Hero section sag taraf, 2-sutun grid sol alt kare, white/5 border',
      },
    ],
  },

  restoranlar: {
    id: 'restoranlar',
    name: 'Restoranlar',
    sector: 'Restoranlar',
    imageSlots: [
      {
        slot: 'hero-bg',
        label: 'Restoran Atmosfer Arkaplan',
        aspectRatio: '16:9',
        imageSize: '2K',
        style: 'photorealistic',
        promptHint:
          'Luxury fine dining restaurant interior, elegant table setting with warm candlelight, dark wood and warm amber tones, sophisticated atmosphere, no people, bokeh lights',
        position: 'Hero section tam ekran arkaplan (min-h-screen), koyu gradient overlay soldan saga',
      },
      {
        slot: 'menu',
        label: 'Menu Gorseli',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Gourmet dish beautifully plated, fine dining food photography, warm amber lighting, dark background, professional restaurant menu photo',
        position: 'Alarm section icinde merkezi kart, turuncu border, max-w-lg',
      },
    ],
  },

  kafeler: {
    id: 'kafeler',
    name: 'Kafeler',
    sector: 'Kafeler',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Kafe Atmosfer Gorseli',
        aspectRatio: '4:5',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Cozy artisan cafe interior, steaming latte art on wooden table, warm natural lighting, exposed brick and plants, hygge comfortable atmosphere, no people',
        position: 'Hero section sag taraf, diagonal clip-path ile kesilmis dikey gorsel (aspect 4:5), rounded-2rem',
      },
      {
        slot: 'ambiance',
        label: 'Kafe Ambiyans Banner',
        aspectRatio: '16:9',
        imageSize: '2K',
        style: 'photorealistic',
        promptHint:
          'Coffee shop atmosphere, barista brewing pour-over coffee, warm wooden counter, coffee beans, cream and brown tones, cozy cafe photography',
        position: 'Alarm section icinde rounded-2xl banner, max-h-280px, koyu bg icinde',
      },
    ],
  },

  pastaneler: {
    id: 'pastaneler',
    name: 'Pastaneler',
    sector: 'Pastaneler',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Ana Pasta Gorseli',
        aspectRatio: '3:4',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Elegant birthday cake with cream frosting and berries, artisanal pastry on white marble, soft pink lighting, bakery product photography, Instagram worthy',
        position: 'Hero section sag taraf, masonry grid sol sutun (row-span-2, aspect 3:4), pembe border, rounded-3xl',
      },
      {
        slot: 'gallery',
        label: 'Urun Galeri 1',
        aspectRatio: '1:1',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Assorted cupcakes with colorful frosting, pastel tones, sweet bakery display, overhead food photography, pink and cream aesthetic',
        position: 'Hero section sag taraf, masonry grid sag ust kare, pembe border, rounded-3xl',
      },
      {
        slot: 'gallery2',
        label: 'Urun Galeri 2',
        aspectRatio: '1:1',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'French macarons in various pastel colors arranged in rows, elegant patisserie display, soft lighting, artisan bakery aesthetic',
        position: 'Hero section sag taraf, masonry grid sag alt kare, pembe border, rounded-3xl',
      },
    ],
  },

  firinlar: {
    id: 'firinlar',
    name: 'Firinlar',
    sector: 'Firinlar',
    imageSlots: [
      {
        slot: 'hero-bg',
        label: 'Firin Panoramik Arkaplan',
        aspectRatio: '16:9',
        imageSize: '2K',
        style: 'photorealistic',
        promptHint:
          'Traditional bakery interior, fresh bread loaves on wooden shelves, warm golden light from brick oven, flour dusted surface, rustic artisan bakery atmosphere, no people',
        position: 'Hero section panoramik banner (h-60vh), gradient overlay alttan, text ustunde',
      },
      {
        slot: 'products',
        label: 'Ekmek Urunleri',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Assorted fresh breads and pastries display, sourdough, baguette, simit, pogaca on wooden board, warm bakery photography, golden wheat tones',
        position: 'Alarm section icinde merkezi kart, kahverengi border, rounded-2xl, max-w-lg',
      },
    ],
  },

  catering: {
    id: 'catering',
    name: 'Catering / Yemek Servisi',
    sector: 'Catering',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Catering Ana Gorsel',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Professional corporate catering setup, elegant buffet table with silver chafing dishes, white tablecloth, conference room setting, modern business event food service',
        position: 'Hero section sag taraf, kurumsal 4:3 gorsel, kose aksanli cerceve (border-l-4 + border-t-4 gold)',
      },
      {
        slot: 'showcase',
        label: 'Etkinlik Sergileme',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Corporate event catering service in action, professional staff serving food at business conference, elegant venue, navy blue and gold accents',
        position: 'Alarm section icinde merkezi kart, lacivert border, max-w-lg',
      },
    ],
  },

  kasaplar: {
    id: 'kasaplar',
    name: 'Kasaplar',
    sector: 'Kasaplar',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Et Urunleri Ana Gorsel',
        aspectRatio: '3:4',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Premium raw meat cuts on wooden butcher board, ribeye steak, lamb chops, fresh herbs, dramatic dark lighting, professional food photography, warm cream background',
        position: 'Hero section sag taraf (acik bg), diagonal split layout, dikey gorsel (aspect 3:4), kirmizi alt cizgi',
      },
      {
        slot: 'products',
        label: 'Kasap Tezgahi',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Professional butcher shop display counter, various meat cuts organized, clean glass display case, professional lighting, traditional butcher shop aesthetic',
        position: 'Alarm section icinde merkezi kart, kirmizi border, max-w-lg',
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
