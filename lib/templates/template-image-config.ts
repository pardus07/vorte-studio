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
        aspectRatio: '16:9',
        imageSize: '2K',
        style: 'photorealistic',
        promptHint:
          'Professional tattoo portfolio showcase, close-up of intricate tattoo artwork on skin, dramatic dark lighting, artistic photography, underground studio aesthetic, no face',
        position: 'Hero section sag taraf, 2-sutun grid ust kisim full-width (16:9), neon border efekti',
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
        aspectRatio: '3:4',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Cozy artisan cafe interior, steaming latte art on wooden table, warm natural lighting, exposed brick and plants, hygge comfortable atmosphere, no people',
        position: 'Hero section sag taraf, diagonal clip-path ile kesilmis dikey gorsel (aspect 3:4), rounded-2rem',
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

  /* ============================================================ */
  /*  SPRINT 4 — GIDA PERAKENDE + KONAKLAMA + EĞİTİM             */
  /* ============================================================ */

  manavlar: {
    id: 'manavlar',
    name: 'Manavlar',
    sector: 'Manavlar',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Manav Ana Gorsel',
        aspectRatio: '1:1',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Fresh organic vegetables and fruits display, colorful produce arrangement, green lettuce, red tomatoes, oranges, wooden crates, farmers market aesthetic, bright natural lighting, no people',
        position: 'Hero section sag taraf, dairesel mask (rounded-full), border-4 yesil',
      },
      {
        slot: 'products',
        label: 'Urun Sergileme',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Organic fruit and vegetable shop interior, wooden shelves with fresh produce, green and orange tones, clean market aesthetic, no people',
        position: 'Alarm section icinde merkezi kart, yesil border, rounded-2xl, max-w-lg',
      },
    ],
  },

  kuruyemisciler: {
    id: 'kuruyemisciler',
    name: 'Kuruyemisciler',
    sector: 'Kuruyemisciler',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Kuruyemis Ana Gorsel',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Premium mixed nuts display, almonds pistachios walnuts hazelnuts in wooden bowls, warm golden lighting, rustic wood surface, gourmet food photography, no people',
        position: 'Hero section sag taraf, shelf display karti (aspect 4:3), altin border, rounded-3xl',
      },
      {
        slot: 'products',
        label: 'Urun Cesitleri',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Dried fruits and nuts shop display, glass jars with various nuts, dried apricots, figs, dates, warm amber lighting, traditional Turkish nut shop aesthetic',
        position: 'Alarm section icinde merkezi kart, kahverengi border, rounded-2xl, max-w-lg',
      },
    ],
  },

  'sarkuteri': {
    id: 'sarkuteri',
    name: 'Sarküteri / Delikatessen',
    sector: 'Sarküteri',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Gurme Ana Gorsel',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Premium charcuterie board, imported cheeses, cured meats, olives, artisan bread, dark wood surface, dramatic moody lighting, gourmet food photography, no people',
        position: 'Hero section sag taraf, floating premium kart (aspect 4:3), amber border, rounded-3xl',
      },
      {
        slot: 'products',
        label: 'Urun Sergileme',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Delicatessen shop interior, glass display counter with imported meats and cheeses, warm amber lighting, premium retail aesthetic, dark wood shelves',
        position: 'Alarm section icinde merkezi kart, kirmizi border, rounded-2xl, max-w-lg',
      },
    ],
  },

  'su-bayileri': {
    id: 'su-bayileri',
    name: 'Su Bayileri',
    sector: 'Su Bayileri',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Su Teslimat Ana Gorsel',
        aspectRatio: '3:4',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Clean water delivery service, blue water bottles and dispensers, crystal clear water splash, bright clean blue and white tones, hygiene focused photography, no people',
        position: 'Hero section sag taraf, water-drop sekil (organic border-radius), mavi border',
      },
      {
        slot: 'products',
        label: 'Su Urunleri',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Water cooler dispenser with blue water bottles, modern office water station, clean hygienic environment, blue and white color scheme, product photography',
        position: 'Alarm section icinde merkezi kart, mavi border, rounded-2xl, max-w-lg',
      },
    ],
  },

  oteller: {
    id: 'oteller',
    name: 'Oteller',
    sector: 'Oteller',
    imageSlots: [
      {
        slot: 'hero-bg',
        label: 'Otel Luks Arkaplan',
        aspectRatio: '16:9',
        imageSize: '2K',
        style: 'photorealistic',
        promptHint:
          'Luxury hotel lobby interior, elegant chandelier, marble floor, warm golden lighting, sophisticated decor, navy and gold color scheme, premium hospitality atmosphere, no people',
        position: 'Hero section tam ekran arkaplan (min-h-90vh), koyu gradient overlay soldan saga',
      },
      {
        slot: 'rooms',
        label: 'Oda Gorseli',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Luxury hotel room interior, king size bed with white linens, elegant furniture, warm ambient lighting, city view from window, premium accommodation photography',
        position: 'Alarm section icinde merkezi kart, altin border, max-w-lg',
      },
    ],
  },

  'seyahat-acentesi': {
    id: 'seyahat-acentesi',
    name: 'Seyahat Acentesi',
    sector: 'Seyahat Acenteleri',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Destinasyon Ana Gorsel',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Beautiful travel destination collage, tropical beach sunset, mountain landscape, historic city view, adventure travel photography, vibrant warm colors, no people',
        position: 'Hero section sag taraf, collage karti (aspect 4:3), stamp efektli badge lar, rounded-3xl',
      },
      {
        slot: 'destination',
        label: 'Destinasyon Banneri',
        aspectRatio: '16:9',
        imageSize: '2K',
        style: 'photorealistic',
        promptHint:
          'Stunning panoramic travel landscape, turquoise sea, white sand beach, palm trees, golden sunset, paradise destination photography',
        position: 'Alarm section icinde full-width banner, mavi gradient overlay, max-h-280px',
      },
    ],
  },

  'ozel-okullar': {
    id: 'ozel-okullar',
    name: 'Ozel Okullar / Kurslar',
    sector: 'Ozel Okullar',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Egitim Ana Gorsel',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Modern education classroom interior, bright colorful learning environment, books and educational materials, whiteboard, blue and yellow accents, professional school aesthetic, no people',
        position: 'Hero section sag taraf, geometric blok karti (aspect 4:3), mavi border, istatistik badge lari',
      },
      {
        slot: 'campus',
        label: 'Kampus Gorseli',
        aspectRatio: '16:9',
        imageSize: '2K',
        style: 'photorealistic',
        promptHint:
          'Modern school campus exterior or library interior, bookshelves, study areas, bright natural lighting, educational environment, blue and white tones',
        position: 'Alarm section icinde merkezi banner, mavi border, rounded-2xl, max-w-lg',
      },
    ],
  },

  /* ============================================================ */
  /*  SPRINT 5 — EĞİTİM (devamı) + SPOR + OTOMOTİV (1/2)       */
  /* ============================================================ */

  kresler: {
    id: 'kresler',
    name: 'Kresler',
    sector: 'Kresler',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Kres Ana Gorsel',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Colorful kindergarten playroom interior, bright toys, building blocks, soft play area, rainbow colored furniture, warm natural lighting, child-friendly environment, no children',
        position: 'Hero section sag taraf, rainbow border karti (aspect 4:3), floating oyuncak badge lari',
      },
      {
        slot: 'gallery',
        label: 'Aktivite Galerisi',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Kindergarten activity room, art supplies, colorful paintings on wall, educational toys, bright cheerful atmosphere, pastel colors, no children',
        position: 'Alarm section icinde merkezi kart, renkli border, rounded-3xl, max-w-lg',
      },
    ],
  },

  'muzik-kurslari': {
    id: 'muzik-kurslari',
    name: 'Muzik Kurslari',
    sector: 'Muzik Kurslari',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Muzik Studio Ana Gorsel',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Music studio with instruments, grand piano, guitars on wall, microphone, warm stage lighting with golden spotlight, dark moody atmosphere, professional music school aesthetic, no people',
        position: 'Hero section sag taraf, spotlight efektli kart (aspect 4:3), altin border, nota dekorasyonu',
      },
      {
        slot: 'studio',
        label: 'Ders Studio Gorseli',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Music lesson room, acoustic guitar, piano keyboard, sheet music on stand, warm amber lighting, cozy artistic atmosphere, no people',
        position: 'Alarm section icinde merkezi kart, altin border, rounded-2xl, max-w-lg',
      },
    ],
  },

  'spor-salonlari': {
    id: 'spor-salonlari',
    name: 'Spor Salonlari',
    sector: 'Spor Salonlari',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Spor Salonu Ana Gorsel',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Modern gym interior, professional fitness equipment, dumbbells rack, treadmills, dark interior with orange LED accent lighting, motivational atmosphere, no people',
        position: 'Hero section sag taraf, diagonal clip-path karti (aspect 4:3), turuncu alt serit, Power Zone badge',
      },
      {
        slot: 'equipment',
        label: 'Ekipman Gorseli',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Professional gym equipment close-up, weight plates, kettlebells, battle ropes, dark background with orange highlights, fitness product photography',
        position: 'Alarm section icinde merkezi kart, turuncu border, max-w-lg',
      },
    ],
  },

  'pilates-yoga': {
    id: 'pilates-yoga',
    name: 'Pilates / Yoga',
    sector: 'Pilates / Yoga',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Studio Ana Gorsel',
        aspectRatio: '1:1',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Serene yoga studio interior, wooden floor, large windows with natural light, yoga mats, plants, minimalist zen atmosphere, soft green and stone gray tones, no people',
        position: 'Hero section sag taraf, dairesel mask (rounded-full, w-80 h-80), ring-4 yesil, konsantrik halkalar',
      },
      {
        slot: 'studio',
        label: 'Studio Atmosfer',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Pilates reformer machines in bright studio, clean minimal interior, natural wood and white tones, morning light, wellness atmosphere, no people',
        position: 'Alarm section icinde merkezi kart, yesil border, rounded-2xl, max-w-lg',
      },
    ],
  },

  'oto-galeri': {
    id: 'oto-galeri',
    name: 'Oto Galeri',
    sector: 'Oto Galeri',
    imageSlots: [
      {
        slot: 'hero-bg',
        label: 'Showroom Arkaplan',
        aspectRatio: '16:9',
        imageSize: '2K',
        style: 'photorealistic',
        promptHint:
          'Premium car showroom interior, luxury vehicles on display, dramatic spotlight lighting, polished dark floor, modern automotive dealership, dark and red accents, no people',
        position: 'Hero section tam ekran arkaplan (min-h-90vh), koyu gradient overlay soldan saga, kirmizi alt cizgi',
      },
      {
        slot: 'stock',
        label: 'Arac Stok Gorseli',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Row of premium cars in showroom, various colors, professional automotive photography, dramatic lighting, clean modern dealership floor',
        position: 'Alarm section icinde merkezi kart, kirmizi border, max-w-lg',
      },
    ],
  },

  'oto-servis': {
    id: 'oto-servis',
    name: 'Oto Servis',
    sector: 'Oto Servis',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Servis Ana Gorsel',
        aspectRatio: '16:9',
        imageSize: '2K',
        style: 'photorealistic',
        promptHint:
          'Professional auto repair workshop interior, car on hydraulic lift, mechanic tools organized on wall, bright industrial lighting, navy blue and orange color scheme, no people',
        position: 'Hero section grid ust kisim full-width (16:9), turuncu kose aksanlari, servis tipi kartlari altinda',
      },
      {
        slot: 'workshop',
        label: 'Atolye Gorseli',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Auto mechanic workshop close-up, engine repair, professional diagnostic tools, organized workbench, industrial automotive aesthetic, no people',
        position: 'Alarm section icinde merkezi kart, turuncu border, max-w-lg',
      },
    ],
  },

  lastikci: {
    id: 'lastikci',
    name: 'Lastikci',
    sector: 'Lastikci',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Lastik Ana Gorsel',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Professional tire shop display, stacked tires of various brands and sizes, clean organized tire rack, red and yellow accent lighting, automotive retail aesthetic, no people',
        position: 'Hero section sag taraf, skewed polygon clip-path (aspect 4:3), kirmizi+sari alt serit, marka badge lari',
      },
      {
        slot: 'products',
        label: 'Urun Sergileme',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Tire mounting service, wheel balancing machine, professional tire changing equipment, clean workshop environment, red accent lighting, no people',
        position: 'Alarm section icinde merkezi kart, kirmizi border, max-w-lg',
      },
    ],
  },

  /* ============================================================ */
  /*  SPRINT 6 — OTOMOTİV (2/2) + İNŞAAT (1/3)                  */
  /* ============================================================ */

  'oto-egzoz': {
    id: 'oto-egzoz',
    name: 'Oto Egzoz',
    sector: 'Oto Egzoz',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Egzoz Sistemi Ana Gorsel',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Professional exhaust system workshop, stainless steel exhaust pipes and catalytic converters on workbench, dark industrial lighting with chrome and red accents, automotive performance aesthetic, no people',
        position: 'Hero section sag taraf, chrome mesh overlay karti (aspect 4:3), kirmizi alt serit, muayene badge lari',
      },
      {
        slot: 'workshop',
        label: 'Atolye Gorseli',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Car on lift in exhaust repair shop, mechanic tools and exhaust pipes, industrial environment, red and chrome color scheme, no people',
        position: 'Alarm section icinde merkezi kart, kirmizi border, max-w-lg',
      },
    ],
  },

  'oto-kaporta': {
    id: 'oto-kaporta',
    name: 'Oto Kaporta & Boya',
    sector: 'Oto Kaporta',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Kaporta Ana Gorsel',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Professional auto body paint booth, freshly painted car with metallic finish, clean spray booth environment, dramatic lighting showing paint quality, navy and silver tones, no people',
        position: 'Hero section sag taraf, diagonal split before/after karti (aspect 4:3), metalik gradient border',
      },
      {
        slot: 'gallery',
        label: 'Oncesi/Sonrasi Galeri',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Before and after car body repair comparison, damaged panel vs perfect finish, professional auto body work result, clean workshop, metallic gray tones, no people',
        position: 'Alarm section icinde merkezi kart, metalik border, max-w-lg',
      },
    ],
  },

  'oto-cam': {
    id: 'oto-cam',
    name: 'Oto Cam',
    sector: 'Oto Cam',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Cam Degisim Ana Gorsel',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Professional windshield replacement service, new car glass installation, clean bright workshop, blue and white tones, crystal clear glass, automotive glass service, no people',
        position: 'Hero section sag taraf, frosted glass card (backdrop-blur, aspect 4:3), cam yansima efekti',
      },
      {
        slot: 'service',
        label: 'Mobil Servis Gorseli',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Mobile windshield repair service van, technician tools for glass repair, outdoor car glass replacement setup, blue and white branding, no people',
        position: 'Alarm section icinde merkezi kart, mavi border, max-w-lg',
      },
    ],
  },

  'motosiklet-servisi': {
    id: 'motosiklet-servisi',
    name: 'Motosiklet Servisi',
    sector: 'Motosiklet Servisleri',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Motosiklet Ana Gorsel',
        aspectRatio: '1:1',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Powerful motorcycle in professional workshop, sport bike on repair stand, chrome and orange lighting, dramatic dark atmosphere, motorcycle service aesthetic, no people',
        position: 'Hero section sag taraf, dairesel chrome cerceve (rounded-full, w-72 h-72), gradient ring, marka badge lari',
      },
      {
        slot: 'workshop',
        label: 'Servis Atolye',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Motorcycle repair workshop interior, organized tools, bike parts on workbench, orange and chrome accents, professional mechanic environment, no people',
        position: 'Alarm section icinde merkezi kart, turuncu border, max-w-lg',
      },
    ],
  },

  'insaat-firmalari': {
    id: 'insaat-firmalari',
    name: 'Insaat Firmalari',
    sector: 'Insaat',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Insaat Projesi Ana Gorsel',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Modern construction site, building under construction with crane, professional construction project, navy blue sky, orange safety equipment visible, corporate construction company aesthetic, no people',
        position: 'Hero section sag taraf, blueprint cerceveli kart (aspect 4:3), turuncu kose isaretleri, istatistik badge lari',
      },
      {
        slot: 'projects',
        label: 'Tamamlanan Proje',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Completed modern residential building exterior, clean architecture, landscaped surroundings, professional construction photography, navy and orange tones, no people',
        position: 'Alarm section icinde merkezi kart, lacivert border, max-w-lg',
      },
    ],
  },

  'mimarlik-ofisleri': {
    id: 'mimarlik-ofisleri',
    name: 'Mimarlik / Tadilat',
    sector: 'Ic Mimarlar',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Tasarim Ana Gorsel',
        aspectRatio: '3:4',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Elegant modern interior design, luxury living room renovation, neutral tones with gold accents, minimalist aesthetic, architectural photography, warm natural lighting, no people',
        position: 'Hero section sag taraf, golden ratio dikey kart (aspect 3:4), altin cerceve + kose aksanlari',
      },
      {
        slot: 'portfolio',
        label: 'Portfolyo Gorseli',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Before and after interior renovation, modern kitchen or bathroom transformation, clean minimal design, warm lighting, architectural design portfolio, no people',
        position: 'Alarm section icinde merkezi kart, altin border, max-w-lg',
      },
    ],
  },

  'tadilat-dekorasyon': {
    id: 'tadilat-dekorasyon',
    name: 'PVC / Dograma',
    sector: 'PVC / Cam Balkon',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Pencere Sistemi Ana Gorsel',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Modern PVC window installation, white frame window with double glazing, bright room with view, clean professional window installation, blue-gray metallic accents, no people',
        position: 'Hero section sag taraf, window frame mockup karti (aspect 4:3), cam capraz boluculer, yansima efekti',
      },
      {
        slot: 'products',
        label: 'Urun Cesitleri',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'PVC window and door display showroom, various colors and styles, sliding glass balcony systems, modern window profiles, clean retail environment, no people',
        position: 'Alarm section icinde merkezi kart, gri border, max-w-lg',
      },
    ],
  },

  'isi-yalitim': {
    id: 'isi-yalitim',
    name: 'Isi Yalitim / Mantolama',
    sector: 'Isi Yalitim',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Mantolama Ana Gorsel',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Building exterior thermal insulation work, styrofoam panels on wall, professional insulation installation, warm orange-brown tones, construction scaffolding, energy efficiency concept, no people',
        position: 'Hero section sag taraf, rounded-2xl kart (aspect 4:3), enerji gauge badge sol ust',
      },
      {
        slot: 'projects',
        label: 'Tamamlanan Proje',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Completed building with new thermal insulation, modern apartment exterior, clean finished insulation work, warm cream and brown tones, energy efficient building, no people',
        position: 'Alarm section icinde merkezi kart, kahverengi border, max-w-lg',
      },
    ],
  },

  'dis-cephe': {
    id: 'dis-cephe',
    name: 'Dis Cephe Kaplama',
    sector: 'Dis Cephe',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Cephe Kaplama Ana Gorsel',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Modern building exterior facade, professional cladding installation, composite panels on building, gray and amber tones, architectural exterior photography, no people',
        position: 'Hero section sag taraf, kart (aspect 4:3), amber sol accent cizgi, floating badge',
      },
      {
        slot: 'projects',
        label: 'Referans Proje',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Completed facade renovation, before and after building exterior, modern cladding materials, professional construction photography, gray tones, no people',
        position: 'Alarm section icinde merkezi kart, gri border, max-w-lg',
      },
    ],
  },

  'cati-sistemleri': {
    id: 'cati-sistemleri',
    name: 'Cati Sistemleri',
    sector: 'Cati & Izolasyon',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Cati Projesi Ana Gorsel',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Professional roof construction, new tile roof installation, roofing workers on scaffolding, dark blue sky, red accent safety equipment, modern roofing system, no people',
        position: 'Hero section sag taraf, kart (aspect 4:3), garanti shield badge sol ust, kirmizi accent cizgi',
      },
      {
        slot: 'projects',
        label: 'Tamamlanan Cati',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Completed modern roof with quality tiles, clean roofline, professional roofing work result, blue sky background, residential building, no people',
        position: 'Alarm section icinde merkezi kart, kirmizi border, max-w-lg',
      },
    ],
  },

  'fayans-seramik': {
    id: 'fayans-seramik',
    name: 'Fayans / Seramik',
    sector: 'Fayans Doseme',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Seramik Doseme Ana Gorsel',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Beautiful ceramic tile installation, modern bathroom or kitchen floor, earth tone tiles, professional tile work, warm cream and brown palette, interior design photography, no people',
        position: 'Hero section sag taraf, tile-framed kart (aspect 4:3), malzeme badge strip alt',
      },
      {
        slot: 'gallery',
        label: 'Model Galeri',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Tile showroom display, various ceramic tile patterns, mosaic samples, earth tone color palette, organized tile exhibition, interior design materials, no people',
        position: 'Alarm section icinde merkezi kart, toprak rengi border, max-w-lg',
      },
    ],
  },

  'asma-tavan': {
    id: 'asma-tavan',
    name: 'Asma Tavan / Alcipan',
    sector: 'Asma Tavan',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Asma Tavan Ana Gorsel',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Modern suspended ceiling with LED lighting, clean white drywall ceiling, elegant interior design, silver metallic accents, recessed lighting, professional ceiling installation, no people',
        position: 'Hero section sag taraf, silver metalik cerceve kart (aspect 4:3), tavan tipi badge strip alt',
      },
      {
        slot: 'gallery',
        label: 'Is Galeri',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Variety of ceiling designs, coffered ceiling, stretch ceiling with lights, modern office ceiling, residential decorative ceiling, clean white and silver tones, no people',
        position: 'Alarm section icinde merkezi kart, gumus border, max-w-lg',
      },
    ],
  },

  'boya-badana': {
    id: 'boya-badana',
    name: 'Boya Badana',
    sector: 'Boyacilar',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Boya Projesi Ana Gorsel',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Freshly painted modern room interior, roller and paint supplies, colorful paint cans, bright cheerful atmosphere, before and after painting, clean professional painting work, no people',
        position: 'Hero section sag taraf, rounded-2xl kart (aspect 4:3), renk cemberi dekor sag ust',
      },
      {
        slot: 'gallery',
        label: 'Oncesi Sonrasi Galeri',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Before and after room painting transformation, dramatic color change, professional interior painting result, warm cheerful colors, clean paint job, no people',
        position: 'Alarm section icinde merkezi kart, renkli border, max-w-lg',
      },
    ],
  },

  elektrikci: {
    id: 'elektrikci',
    name: 'Elektrikci',
    sector: 'Elektrikciler',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Elektrik Servis Ana Gorsel',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Professional electrical panel installation, modern circuit breaker box, organized electrical wiring, yellow safety equipment, dark workshop with dramatic lighting, electrical service tools, no people',
        position: 'Hero section sag taraf, sari borderli kart (aspect 4:3), yildirim SVG dekor sol, servis badge strip alt',
      },
      {
        slot: 'service',
        label: 'Servis Gorseli',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Electrical repair tools and equipment, multimeter, wire strippers, cable management, professional electrician toolkit, yellow and black color scheme, no people',
        position: 'Alarm section icinde merkezi kart, siyah border, max-w-lg',
      },
    ],
  },

  tesisatci: {
    id: 'tesisatci',
    name: 'Tesisatci',
    sector: 'Tesisatcilar',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Tesisat Servis Ana Gorsel',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Professional plumbing service, modern bathroom pipe installation, clean water pipes and fittings, blue and chrome tones, organized plumbing workshop, water droplet theme, no people',
        position: 'Hero section sag taraf, droplet seklinde kart (aspect 4:3), su damlasi floating ikon lar',
      },
      {
        slot: 'service',
        label: 'Servis Gorseli',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Plumbing tools and equipment, pipe wrench, water fittings, modern plumbing supplies, blue and chrome color scheme, professional toolkit, no people',
        position: 'Alarm section icinde merkezi kart, mavi border, max-w-lg',
      },
    ],
  },

  'mermer-granit': {
    id: 'mermer-granit',
    name: 'Mermer & Granit',
    sector: 'Mermer / Granit',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Mermer Showroom Ana Gorsel',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Luxury marble and granite showroom, natural stone slabs on display, Calacatta marble with gold veins, dark elegant interior, professional stone craftsmanship, warm LED spotlighting, no people',
        position: 'Hero section sag taraf, altin kose aksanli kart (aspect 4:3), tas cesidi badge lari alt',
      },
      {
        slot: 'gallery',
        label: 'Proje Galerisi',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Premium marble kitchen countertop installation, polished granite surface, luxury modern kitchen, natural stone veins visible, professional stone work, warm lighting, no people',
        position: 'Alarm section icinde merkezi kart, altin border, max-w-lg',
      },
    ],
  },

  'parke-zemin': {
    id: 'parke-zemin',
    name: 'Parke & Zemin Doseme',
    sector: 'Parke / Zemin',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Parke Doseme Ana Gorsel',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Beautiful hardwood floor installation in modern living room, oak parquet pattern, warm natural wood tones, professional flooring work, sunlight on polished wood surface, no people',
        position: 'Hero section sag taraf, ahsap serit dekorlu kart (aspect 4:3), zemin tipi badge strip alt',
      },
      {
        slot: 'gallery',
        label: 'Zemin Galeri Gorseli',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Various wood flooring samples arranged neatly, different wood species and colors, oak walnut bamboo, professional flooring showroom, warm earthy tones, no people',
        position: 'Alarm section icinde merkezi kart, kahverengi border, max-w-lg',
      },
    ],
  },

  dosemeci: {
    id: 'dosemeci',
    name: 'Dosemeci / Koltuk Tamircisi',
    sector: 'Dosemeciler',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Doseme Isi Ana Gorsel',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Professional upholstery workshop, leather and fabric samples on workbench, restored antique chair, warm brown and gold tones, traditional craftsmanship tools, no people',
        position: 'Hero section sag taraf, rounded-2xl kart (aspect 4:3), oncesi/sonrasi label badge',
      },
      {
        slot: 'gallery',
        label: 'Oncesi Sonrasi Galeri',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Before and after furniture reupholstery, restored sofa with new fabric, dramatic transformation, leather and velvet textures, professional upholstery result, no people',
        position: 'Alarm section icinde merkezi kart, kahverengi border, max-w-lg',
      },
    ],
  },

  marangoz: {
    id: 'marangoz',
    name: 'Marangoz / Ahsap Atolyesi',
    sector: 'Marangozlar',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Ahsap Atolye Ana Gorsel',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Professional woodworking workshop, handcrafted wooden furniture in progress, chisels and planes on workbench, warm wood shavings, natural light through workshop window, artisan carpentry aesthetic, no people',
        position: 'Hero section sag taraf, ahsap cerceveli kart (aspect 4:3), testere badge sol ust',
      },
      {
        slot: 'gallery',
        label: 'Proje Galerisi',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Custom built wooden kitchen cabinets, handmade furniture, quality wood craftsmanship, warm cream and wood tones, professional carpentry photography, no people',
        position: 'Alarm section icinde merkezi kart, krem border, max-w-lg',
      },
    ],
  },

  'cadir-tente': {
    id: 'cadir-tente',
    name: 'Cadir & Tente Imalati',
    sector: 'Cadir / Tente',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Tente Projesi Ana Gorsel',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Modern retractable awning on restaurant terrace, green and cream striped canopy, outdoor shade solution, sunny day, professional awning installation, garden and patio setting, no people',
        position: 'Hero section sag taraf, kanopi seritli ust kenar kart (aspect 4:3), urun badge lari alt',
      },
      {
        slot: 'projects',
        label: 'Referans Proje',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Large commercial tent structure, event canopy setup, white and green fabric, professional tent installation, outdoor coverage solution, no people',
        position: 'Alarm section icinde merkezi kart, yesil border, max-w-lg',
      },
    ],
  },

  branda: {
    id: 'branda',
    name: 'Branda Imalati',
    sector: 'Branda Imalat',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Branda Uretim Ana Gorsel',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Industrial tarpaulin manufacturing, heavy duty PVC tarp rolls in warehouse, truck tarpaulin cover, dark blue and amber tones, industrial B2B production facility, no people',
        position: 'Hero section sag taraf, endustriyel borderli kart (aspect 4:3), urun spec grid alt',
      },
      {
        slot: 'products',
        label: 'Urun Cesitleri',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Various tarpaulin products displayed, printed tarp banners, truck covers, tent covers, industrial tarp rolls, blue and yellow branding, no people',
        position: 'Alarm section icinde merkezi kart, lacivert border, max-w-lg',
      },
    ],
  },

  'kaynak-demir': {
    id: 'kaynak-demir',
    name: 'Kaynak & Demir Atolyesi',
    sector: 'Kaynak / Demir',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Demir Atolye Ana Gorsel',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Dramatic welding sparks in dark workshop, iron gate fabrication, steel construction work, orange molten metal glow, industrial metal workshop, professional welding equipment, no people',
        position: 'Hero section sag taraf, turuncu glow cerceve kart (aspect 4:3), hizmet badge lari alt',
      },
      {
        slot: 'projects',
        label: 'Tamamlanan Proje',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Finished ornamental iron gate, decorative wrought iron railing, custom metal staircase, dark metallic finish with orange accent lighting, professional ironwork photography, no people',
        position: 'Alarm section icinde merkezi kart, turuncu border, max-w-lg',
      },
    ],
  },

  bobinaj: {
    id: 'bobinaj',
    name: 'Bobinaj',
    sector: 'Bobinajcilar',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Motor Sarim Ana Gorsel',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Electric motor rewinding workshop, copper wire coils on motor stator, professional motor repair bench, industrial electrical equipment, dark blue and amber tones, technical B2B environment, no people',
        position: 'Hero section sag taraf, bakir halka dekorlu kart (aspect 4:3), servis badge grid alt',
      },
      {
        slot: 'service',
        label: 'Servis Gorseli',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Industrial motor and transformer parts, copper coil winding, electrical repair tools, generator components on workbench, amber and dark blue tones, no people',
        position: 'Alarm section icinde merkezi kart, sari border, max-w-lg',
      },
    ],
  },

  /* ============================================================ */
  /*  SPRINT 9 — ATÖLYE (2/2) + HİZMET & PERAKENDE              */
  /* ============================================================ */

  matbaalar: {
    id: 'matbaalar',
    name: 'Matbaalar',
    sector: 'Matbaacilar',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Matbaa Ana Gorsel',
        aspectRatio: '16:9',
        imageSize: '2K',
        style: 'photorealistic',
        promptHint:
          'Professional printing press in action, CMYK ink rollers, offset printing machine, vivid colors on paper, industrial print shop interior, dramatic warm lighting, commercial printing environment, no people',
        position: 'Hero section tam ekran arkaplan (opacity 0.12), koyu gradient overlay, CMYK watermark text ustunde',
      },
      {
        slot: 'products',
        label: 'Baski Urunleri',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Professional print products display, business cards, brochures, catalogs, posters stacked neatly, CMYK color theme, printing press background, commercial print shop aesthetic, no people',
        position: 'Alarm section icinde merkezi kart, kirmizi border, max-w-lg',
      },
      {
        slot: 'print',
        label: 'Baski Kalitesi',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Close-up of high quality offset printing, CMYK ink on paper, printing press rollers, vivid colors, professional print production, commercial printing environment, no people',
        position: 'Urun galeri section, tam genislik gorsel, max-h-320px',
      },
    ],
  },

  ambalaj: {
    id: 'ambalaj',
    name: 'Ambalaj Imalat',
    sector: 'Ambalaj / Paketleme',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Ambalaj Ana Gorsel',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Custom printed packaging boxes display, various sizes, branded cardboard boxes, professional packaging design, warm amber lighting, packaging production facility, no people',
        position: 'Hero section sag taraf capraz cerceve (aspect 4:3, -rotate-3), floating Ozel Baski badge',
      },
      {
        slot: 'products',
        label: 'Urun Cesitleri',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Variety of packaging products, paper bags, custom boxes, food packaging, cosmetic packaging, printed labels, professional product photography, no people',
        position: 'Alarm section icinde merkezi kart, koyu border, max-w-lg',
      },
    ],
  },

  'plastik-imalat': {
    id: 'plastik-imalat',
    name: 'Plastik Imalat',
    sector: 'Plastik Imalat',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Fabrika Ana Gorsel',
        aspectRatio: '16:9',
        imageSize: '2K',
        style: 'photorealistic',
        promptHint:
          'Plastic injection molding machine in operation, industrial manufacturing facility, blue tones, clean modern factory floor, plastic products and molds, B2B industrial environment, dramatic lighting, no people',
        position: 'Hero section tam ekran arkaplan (opacity 0.12), mavi gradient overlay, firma watermark ustunde. Ayrica Alarm section icinde kart olarak da gosterilir.',
      },
      {
        slot: 'factory',
        label: 'Fabrika Gorseli',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Modern plastic manufacturing factory interior, production line, industrial robots, blue and white clean environment, high-tech plastic production, no people',
        position: 'Fabrika section tam genislik gorsel, rounded-lg, max-h-320px',
      },
    ],
  },

  terzi: {
    id: 'terzi',
    name: 'Terzi / Moda Atolyesi',
    sector: 'Terzi / Konfeksiyoncular',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Terzi Atolye Ana Gorsel',
        aspectRatio: '1:1',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Elegant tailoring atelier, fabric rolls, sewing machine, dress form mannequin with beautiful gown, purple and gold color scheme, warm boutique lighting, luxury fashion studio, no people',
        position: 'Hero section merkez dairesel mask (rounded-full w-64 h-64), altin ring aksanlari, Butik badge alt',
      },
      {
        slot: 'fabrics',
        label: 'Kumas Koleksiyonu',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Luxury fabric collection display, silk velvet lace samples, rich textures, purple cream and gold tones, fashion atelier material showcase, elegant textile arrangement, no people',
        position: 'Alarm section icinde merkezi kart, mor border, max-w-lg',
      },
    ],
  },

  'tabela-reklam': {
    id: 'tabela-reklam',
    name: 'Tabela & Reklam',
    sector: 'Tabelacilar / Reklam',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Tabela/Reklam Ana Gorsel',
        aspectRatio: '16:9',
        imageSize: '2K',
        style: 'photorealistic',
        promptHint:
          'Dramatic neon sign installation at night, glowing LED channel letters on building facade, orange neon light, professional signage work, dark urban background, sign making workshop, no people',
        position: 'Hero section tam ekran arkaplan (opacity 0.15), koyu gradient overlay, neon glow efektleri',
      },
      {
        slot: 'works',
        label: 'Referans Calismalar',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Collection of custom signage work, illuminated store signs, box letters, vehicle wrapping, totem signs, professional sign making portfolio, orange and dark tones, no people',
        position: 'Alarm section icinde merkezi kart, turuncu border, max-w-lg',
      },
    ],
  },

  'hukuk-burosu': {
    id: 'hukuk-burosu',
    name: 'Hukuk Burosu',
    sector: 'Avukatlar',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Avukat/Buro Ana Gorsel',
        aspectRatio: '3:4',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Professional law office interior, leather chair, law books on shelves, scales of justice, dark blue and gold tones, prestigious attorney office, mahogany desk, warm desk lamp lighting, no people',
        position: 'Hero section SOL taraf (ters duzende), portrait orani (3:4), altin kose aksanli cerceve',
      },
      {
        slot: 'office',
        label: 'Buro Ic Mekan',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Modern law firm meeting room, conference table, legal documents, professional corporate interior, navy blue and gold accents, prestigious business setting, no people',
        position: 'Alarm section icinde merkezi kart, lacivert border, max-w-lg',
      },
    ],
  },

  muhasebe: {
    id: 'muhasebe',
    name: 'Muhasebe / Mali Musavirlik',
    sector: 'Muhasebeciler / SMMM',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Buro Ana Gorsel',
        aspectRatio: '16:9',
        imageSize: '2K',
        style: 'photorealistic',
        promptHint:
          'Professional accounting office interior, modern corporate workspace, laptop showing financial spreadsheets and graphs, calculator, neatly organized documents on large desk, bookshelves with binders, green accent plants, warm ambient lighting, navy blue and green tones, trustworthy high-end business atmosphere, wide angle shot, no people',
        position: 'Hero section tam ekran arkaplan (min-h-screen), soldan saga gradient overlay (lacivert → seffaf), metin sol tarafa dayali',
      },
      {
        slot: 'office',
        label: 'Ofis Gorseli',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Professional accounting office, organized desk with calculator, financial documents, laptop showing spreadsheet, clean modern office, green and navy blue tones, corporate atmosphere, no people',
        position: 'Alarm section icinde merkezi kart, yesil border, max-w-lg',
      },
      {
        slot: 'team',
        label: 'Ekip Gorseli',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Modern accounting firm office space, multiple workstations, financial charts on screen, professional corporate environment, green accent plants, clean organized desks, no people',
        position: 'Ekip section tam genislik gorsel, max-h-320px',
      },
    ],
  },

  sigorta: {
    id: 'sigorta',
    name: 'Sigorta Acentesi',
    sector: 'Sigorta Acenteleri',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Sigorta Ana Gorsel',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Insurance agency concept, protective umbrella over family icons, teal and white color scheme, shield and protection symbols, modern clean professional aesthetic, financial security concept, no people',
        position: 'Hero alt yari bolunme icinde, kalkan SVG overlay altinda, rounded-2xl, max-w-2xl',
      },
      {
        slot: 'office',
        label: 'Acente Ofis Gorseli',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Modern insurance agency office, professional desk setup, insurance documents and policies, teal and white interior, trustworthy corporate atmosphere, no people',
        position: 'Alarm section icinde merkezi kart, teal border, rounded-xl, max-w-lg',
      },
    ],
  },

  // ── Sprint 10: Perakende + Teknik Servis (1/2) ──

  'emlak-ofisi': {
    id: 'emlak-ofisi',
    name: 'Emlak Ofisi',
    sector: 'Emlakcilar',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Emlak Hero Gorseli',
        aspectRatio: '16:9',
        imageSize: '2K',
        style: 'photorealistic',
        promptHint:
          'Luxury modern apartment exterior or interior, warm golden hour lighting, premium real estate photography, elegant architectural design, city skyline in background, no people, dark navy and gold color scheme',
        position: 'Hero section sag tarafi capraz clip-path ile kesilen tam yukseklik gorsel',
      },
      {
        slot: 'interior',
        label: 'Ofis / Is Yeri Gorseli',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Modern real estate office interior, professional desk with property listings, elegant decor, warm lighting, corporate but welcoming atmosphere, no people',
        position: 'Icerik bolumunde merkezi tam genislik gorsel, rounded-2xl, max-w-5xl',
      },
    ],
  },

  mobilya: {
    id: 'mobilya',
    name: 'Mobilya Magazasi',
    sector: 'Mobilya Magazalari',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Mobilya Hero Gorseli',
        aspectRatio: '16:9',
        imageSize: '2K',
        style: 'photorealistic',
        promptHint:
          'Beautiful modern living room interior design, stylish sofa and coffee table, warm natural wood tones, soft lighting, Scandinavian minimalist aesthetic, home decor magazine style, no people',
        position: 'Hero section tam genislik arka plan (75vh), altinda beyaz kart ustuste binecek',
      },
      {
        slot: 'showroom',
        label: 'Showroom Gorseli',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Furniture showroom interior, multiple room setups displayed, warm wood and cream tones, professional retail display, modern furniture store, no people',
        position: 'Icerik bolumunde merkezi gorsel, max-w-5xl',
      },
    ],
  },

  elektronik: {
    id: 'elektronik',
    name: 'Elektronik Magazasi',
    sector: 'Elektronik Magazalari',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Elektronik Hero Gorseli',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Modern electronics store display, smartphones laptops headphones arranged artistically, dark navy background with electric blue neon glow, tech gadgets showcase, futuristic lighting, no people',
        position: 'Hero section arka plan gorseli (opacity 0.1), koyu bg uzerine tech karti grid',
      },
      {
        slot: 'products',
        label: 'Urun Gorseli',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Electronics product display, various tech gadgets on shelves, modern retail store interior, blue LED accent lighting, clean organized layout, no people',
        position: 'Icerik bolumunde merkezi gorsel, rounded-2xl, border, max-w-5xl',
      },
    ],
  },

  kirtasiye: {
    id: 'kirtasiye',
    name: 'Kirtasiye',
    sector: 'Kirtasiyeler',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Kirtasiye Hero Gorseli',
        aspectRatio: '16:9',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Colorful stationery supplies flat lay, pencils pens notebooks erasers rulers arranged neatly, pastel yellow background, cheerful school supplies aesthetic, birds eye view, no people',
        position: 'Hero section sag taraf kart icinde, rounded-2xl, col-span-2 asagi kart',
      },
      {
        slot: 'products',
        label: 'Urun Gorseli',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Stationery store interior, organized shelves with school and office supplies, colorful products, warm welcoming retail space, no people',
        position: 'Icerik bolumunde merkezi gorsel, rounded-2xl, max-w-5xl',
      },
    ],
  },

  'pet-shop': {
    id: 'pet-shop',
    name: 'Pet Shop',
    sector: 'Pet Shop',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Pet Shop Hero Gorseli',
        aspectRatio: '1:1',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Adorable golden retriever puppy and tabby kitten sitting together, soft green background, warm natural lighting, pet store advertising style, cute friendly animals, professional pet photography',
        position: 'Hero section sag taraf organik blob mask icinde (420x420), yuvarlak organik sekil',
      },
      {
        slot: 'products',
        label: 'Urun Gorseli',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Pet shop interior with organized shelves, pet food bags, toys, accessories, colorful pet supplies display, clean modern pet store, no people no animals',
        position: 'Icerik bolumunde merkezi gorsel, rounded-2xl, max-w-5xl',
      },
    ],
  },

  cicekci: {
    id: 'cicekci',
    name: 'Cicekci',
    sector: 'Cicekçiler',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Cicek Hero Gorseli',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Beautiful fresh flower bouquet arrangement, roses peonies tulips in elegant vase, soft pink background, romantic florist studio photography, pastel colors, professional floral arrangement, no people',
        position: 'Hero section merkezi cerceveli gorsel, rounded-xl, pink border, max-w-md',
      },
      {
        slot: 'bouquet',
        label: 'Buket Gorseli',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Flower shop interior display, multiple colorful bouquets in buckets, fresh flowers market, warm inviting atmosphere, romantic aesthetic, no people',
        position: 'Icerik bolumunde merkezi gorsel, rounded-2xl, max-w-5xl',
      },
    ],
  },

  kuyumcu: {
    id: 'kuyumcu',
    name: 'Kuyumcu',
    sector: 'Kuyumcular',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Kuyumcu Hero Gorseli',
        aspectRatio: '16:9',
        imageSize: '2K',
        style: 'photorealistic',
        promptHint:
          'Luxury jewelry display, gold necklaces diamond rings on black velvet, cinematic ultra-wide composition, dramatic golden lighting, premium jewelry store showcase, reflection and sparkle, no people',
        position: 'Hero section sinematik letterbox serit gorsel (21:9 crop), altin borderli, tam genislik',
      },
      {
        slot: 'collection',
        label: 'Koleksiyon Gorseli',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Jewelry collection display case, various gold and diamond pieces elegantly arranged, dark velvet background, luxury retail display, warm spotlight lighting, no people',
        position: 'Icerik bolumunde merkezi gorsel, altin border, max-w-5xl',
      },
    ],
  },

  'tekstil-giyim': {
    id: 'tekstil-giyim',
    name: 'Tekstil / Giyim Magazasi',
    sector: 'Tekstil / Giyim Magazasi',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Moda Hero Gorseli',
        aspectRatio: '9:16',
        imageSize: '2K',
        style: 'photorealistic',
        promptHint:
          'Fashion runway or clothing store editorial, elegant mannequins with trendy outfits, moody dark background with warm amber spotlights, fashion magazine cover aesthetic, luxury boutique atmosphere, no real people',
        position: 'Hero section tam ekran arka plan (min-h-screen), koyu overlay + merkezi text',
      },
      {
        slot: 'lookbook',
        label: 'Lookbook Gorseli',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Fashion boutique interior, clothing racks with organized outfits, warm amber lighting, modern retail store design, stylish mannequins, no real people',
        position: 'Icerik bolumunde merkezi gorsel, max-w-5xl',
      },
    ],
  },

  // ── Sprint 11: Teknik Servis (2/2) + Diger Hizmetler ──

  'spor-malzemeleri': {
    id: 'spor-malzemeleri',
    name: 'Spor Malzemeleri',
    sector: 'Spor Malzemeleri Magazasi',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Hero Gorseli',
        aspectRatio: '16:9',
        imageSize: '2K',
        style: 'photorealistic',
        promptHint:
          'Sports equipment store interior, dynamic display of fitness gear, running shoes, weights and balls, high-energy orange and black branding, dramatic gym lighting, no people',
        position: 'Hero section arkaplan, koyu overlay, SVG slash dekorasyon uzerinde',
      },
      {
        slot: 'product',
        label: 'Urun Gorseli',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Professional sports equipment flat lay, running shoes, fitness accessories, water bottles, athletic gear arrangement on dark background, product photography',
        position: 'Icerik bolumunde merkezi gorsel, max-w-5xl',
      },
    ],
  },

  'klima-servisi': {
    id: 'klima-servisi',
    name: 'Klima Servisi',
    sector: 'Klima Servisi',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Hero Gorseli',
        aspectRatio: '3:4',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Modern split air conditioner on clean white wall, cool blue LED light, frost effect, professional HVAC installation, minimalist interior, no people',
        position: 'Hero section sag taraf, frosted glass kart yaninda, 3:4 dikey gorsel',
      },
      {
        slot: 'service',
        label: 'Servis Gorseli',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'HVAC technician tools and air conditioning unit maintenance, clean workspace, blue and white color theme, professional service photography, no face visible',
        position: 'Icerik bolumunde merkezi gorsel, max-w-5xl',
      },
    ],
  },

  'kombi-servisi': {
    id: 'kombi-servisi',
    name: 'Kombi Servisi',
    sector: 'Kombi Servisi',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Hero Gorseli',
        aspectRatio: '16:9',
        imageSize: '2K',
        style: 'photorealistic',
        promptHint:
          'Modern combi boiler wall-mounted in clean utility room, warm orange ambient lighting, professional heating system, pipes and valves visible, no people',
        position: 'Hero section arkaplan gorseli, navy overlay uzerinde',
      },
      {
        slot: 'service',
        label: 'Servis Gorseli',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Boiler maintenance tools and gauges, professional plumbing equipment, warm orange and blue tones, technical service photography, no face visible',
        position: 'Icerik bolumunde merkezi gorsel, max-w-5xl',
      },
    ],
  },

  'beyaz-esya': {
    id: 'beyaz-esya',
    name: 'Beyaz Esya',
    sector: 'Beyaz Esya Servisi',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Hero Gorseli',
        aspectRatio: '16:9',
        imageSize: '2K',
        style: 'photorealistic',
        promptHint:
          'Modern kitchen with white appliances, washing machine, dishwasher, refrigerator in clean bright interior, dot grid pattern overlay, product showcase, no people',
        position: 'Hero section arkaplan, hafif opak overlay ile',
      },
      {
        slot: 'service',
        label: 'Servis Gorseli',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Appliance repair technician tools, multimeter and screwdriver on washing machine, clean professional service photography, no face visible',
        position: 'Icerik bolumunde merkezi gorsel, max-w-5xl',
      },
    ],
  },

  'asansor': {
    id: 'asansor',
    name: 'Asansor',
    sector: 'Asansor Bakim',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Hero Gorseli',
        aspectRatio: '16:9',
        imageSize: '2K',
        style: 'photorealistic',
        promptHint:
          'Modern elevator interior with stainless steel doors, clean shaft perspective, silver metallic finishes, floor indicator display, corporate building lobby, no people',
        position: 'Hero section arkaplan, koyu slate overlay, shaft lines uzerinde',
      },
      {
        slot: 'project',
        label: 'Proje Gorseli',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Elevator installation project, modern elevator cabin, stainless steel interior, LED strip lighting, professional building engineering, no people',
        position: 'Icerik bolumunde merkezi gorsel, max-w-5xl',
      },
    ],
  },

  'jenerator': {
    id: 'jenerator',
    name: 'Jenerator',
    sector: 'Jenerator',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Hero Gorseli',
        aspectRatio: '16:9',
        imageSize: '2K',
        style: 'photorealistic',
        promptHint:
          'Industrial power generator set, large diesel generator in facility room, yellow and black industrial colors, energy pulse lighting, no people',
        position: 'Hero section arkaplan, koyu siyah overlay, industrial grid uzerinde',
      },
      {
        slot: 'product',
        label: 'Urun Gorseli',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Portable generator close-up, professional power equipment, yellow accents, industrial product photography, clean background, no people',
        position: 'Icerik bolumunde merkezi gorsel, max-w-5xl',
      },
    ],
  },

  'guvenlik-sistemleri': {
    id: 'guvenlik-sistemleri',
    name: 'Guvenlik Sistemleri',
    sector: 'Guvenlik Sistemleri',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Hero Gorseli',
        aspectRatio: '16:9',
        imageSize: '2K',
        style: 'photorealistic',
        promptHint:
          'Security surveillance control room, multiple CCTV monitors showing camera feeds, dark room with blue and red LED indicators, professional security system, no people',
        position: 'Hero section arkaplan, koyu matrix overlay uzerinde',
      },
      {
        slot: 'project',
        label: 'Proje Gorseli',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Professional CCTV camera installation on building exterior, security alarm panel, modern access control keypad, clean professional photography, no people',
        position: 'Icerik bolumunde merkezi gorsel, max-w-5xl',
      },
    ],
  },

  'cilingir': {
    id: 'cilingir',
    name: 'Cilingir',
    sector: 'Cilingir',
    imageSlots: [
      {
        slot: 'hero',
        label: 'Hero Gorseli',
        aspectRatio: '16:9',
        imageSize: '2K',
        style: 'photorealistic',
        promptHint:
          'Professional locksmith tools, key cutting machine, lock picks and keys arrangement, dark moody lighting with amber highlights, artisan workshop aesthetic, no people',
        position: 'Hero section arkaplan, koyu overlay, amber flash lines uzerinde',
      },
      {
        slot: 'service',
        label: 'Servis Gorseli',
        aspectRatio: '4:3',
        imageSize: '1K',
        style: 'photorealistic',
        promptHint:
          'Door lock installation, modern smart lock system, professional locksmith service, amber and dark tones, close-up of lock mechanism, no people',
        position: 'Icerik bolumunde merkezi gorsel, max-w-5xl',
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
