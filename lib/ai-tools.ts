import { type FunctionDeclaration, Type } from "@google/genai";

export type ApprovalLevel = 1 | 2 | 3;

export type ToolMeta = {
  level: ApprovalLevel;
  description: string;
  endpoint: string;
  method: string;
};

export const TOOL_META: Record<string, ToolMeta> = {
  // Level 1 — Auto-execute reads
  get_dashboard_stats: { level: 1, description: "Dashboard istatistikleri", endpoint: "/api/admin/dashboard-stats", method: "GET" },
  get_blog_posts:      { level: 1, description: "Blog yazılarını listele", endpoint: "/api/admin/blog", method: "GET" },
  get_blog_post:       { level: 1, description: "Tek blog yazısını getir", endpoint: "/api/admin/blog/{id}", method: "GET" },
  get_settings:        { level: 1, description: "Site ayarlarını oku", endpoint: "/api/admin/settings", method: "GET" },
  get_portfolio:       { level: 1, description: "Portfolyo listele", endpoint: "/api/admin/portfolio", method: "GET" },
  get_clients:         { level: 1, description: "CRM müşterileri", endpoint: "/api/admin/crm", method: "GET" },
  get_leads:           { level: 1, description: "Lead pipeline", endpoint: "/api/admin/leads", method: "GET" },
  get_projects:        { level: 1, description: "Projeleri listele", endpoint: "/api/admin/projects", method: "GET" },
  get_maintenance:     { level: 1, description: "Bakım paketleri", endpoint: "/api/admin/maintenance", method: "GET" },

  // Level 2 — Create/Update (requires approval)
  create_blog_post: { level: 2, description: "Yeni blog yazısı oluştur", endpoint: "/api/admin/blog", method: "POST" },
  update_blog_post: { level: 2, description: "Blog yazısı güncelle", endpoint: "/api/admin/blog/{id}", method: "PATCH" },
  update_settings:  { level: 2, description: "Site ayarı güncelle", endpoint: "/api/admin/settings", method: "PATCH" },
  generate_image:   { level: 1, description: "AI görsel üret", endpoint: "/api/admin/generate-image", method: "POST" },

  // Level 3 — Delete (double confirm)
  delete_blog_post: { level: 3, description: "Blog yazısı sil", endpoint: "/api/admin/blog/{id}", method: "DELETE" },
};

// Gemini function declarations — her tool icin parametre semalari
export const agentFunctionDeclarations: FunctionDeclaration[] = [
  {
    name: "get_dashboard_stats",
    description:
      "Aktif proje sayisi, bekleyen teklifler, toplam musteri, lead sayisi ve aylik bakim geliri gibi dashboard istatistiklerini dondurur",
    parameters: {
      type: Type.OBJECT,
      properties: {},
      required: [],
    },
  },
  {
    name: "get_blog_posts",
    description:
      "Blog yazilarini listeler. Yayinlananlari, taslaklari veya hepsini filtreleyebilir. Baslik veya icerikte arama yapabilir",
    parameters: {
      type: Type.OBJECT,
      properties: {
        published: {
          type: Type.BOOLEAN,
          description: "true=yayinlanan, false=taslak, belirtilmezse hepsi",
        },
        search: {
          type: Type.STRING,
          description: "Baslik veya icerikte arama",
        },
      },
      required: [],
    },
  },
  {
    name: "get_blog_post",
    description: "ID ile tek bir blog yazisini tum detaylariyla getirir",
    parameters: {
      type: Type.OBJECT,
      properties: {
        id: {
          type: Type.STRING,
          description: "Blog yazisi ID'si",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "get_settings",
    description:
      "Tum site ayarlarini key-value olarak dondurur (site basligi, aciklama, iletisim bilgileri vb.)",
    parameters: {
      type: Type.OBJECT,
      properties: {},
      required: [],
    },
  },
  {
    name: "get_portfolio",
    description:
      "Yayinlanan portfolyo ogelerini sirali sekilde listeler (baslik, slug, kategori, one cikan)",
    parameters: {
      type: Type.OBJECT,
      properties: {},
      required: [],
    },
  },
  {
    name: "get_clients",
    description:
      "CRM musterilerini listeler. Status filtresiyle daraltilabilir",
    parameters: {
      type: Type.OBJECT,
      properties: {
        status: {
          type: Type.STRING,
          description:
            "Musteri durumu filtresi: POTENTIAL, ACTIVE, MAINTENANCE, INACTIVE",
        },
      },
      required: [],
    },
  },
  {
    name: "get_leads",
    description:
      "Lead pipeline'ini listeler. Status filtresiyle daraltilabilir",
    parameters: {
      type: Type.OBJECT,
      properties: {
        status: {
          type: Type.STRING,
          description:
            "Lead durumu filtresi: COLD, CONTACTED, MEETING, QUOTED, WON, LOST",
        },
      },
      required: [],
    },
  },
  {
    name: "get_projects",
    description:
      "Projeleri listeler (baslik, durum, ilerleme, butce). Son 20 proje dondurulur",
    parameters: {
      type: Type.OBJECT,
      properties: {},
      required: [],
    },
  },
  {
    name: "get_maintenance",
    description:
      "Aktif bakim paketlerini listeler (musteri, website, aylik ucret, yenileme tarihi)",
    parameters: {
      type: Type.OBJECT,
      properties: {},
      required: [],
    },
  },
  {
    name: "create_blog_post",
    description:
      "Yeni bir blog yazisi olusturur. Baslik ve icerik zorunlu. SEO alanlari, etiketler ve kapak gorseli opsiyonel",
    parameters: {
      type: Type.OBJECT,
      properties: {
        title: {
          type: Type.STRING,
          description: "Blog yazisi basligi",
        },
        content: {
          type: Type.STRING,
          description: "Blog icerigi (HTML formati)",
        },
        slug: {
          type: Type.STRING,
          description:
            "URL slug (belirtilmezse basliktan otomatik uretilir)",
        },
        excerpt: {
          type: Type.STRING,
          description: "Kisa ozet (liste gorunumunde gosterilir)",
        },
        seoTitle: {
          type: Type.STRING,
          description: "SEO basligi (max 60 karakter)",
        },
        seoDescription: {
          type: Type.STRING,
          description: "SEO aciklamasi (max 155 karakter)",
        },
        tags: {
          type: Type.STRING,
          description: "Virgul ile ayrilmis etiketler (ornek: 'nextjs, web tasarim, seo')",
        },
        coverImage: {
          type: Type.STRING,
          description: "Kapak gorseli URL'si",
        },
        published: {
          type: Type.BOOLEAN,
          description: "true=hemen yayinla, false=taslak olarak kaydet",
        },
      },
      required: ["title", "content"],
    },
  },
  {
    name: "update_blog_post",
    description:
      "Mevcut bir blog yazisini gunceller. ID zorunlu, diger alanlar opsiyonel (sadece gonderilen alanlar guncellenir)",
    parameters: {
      type: Type.OBJECT,
      properties: {
        id: {
          type: Type.STRING,
          description: "Guncellenecek blog yazisinin ID'si",
        },
        title: {
          type: Type.STRING,
          description: "Yeni baslik",
        },
        content: {
          type: Type.STRING,
          description: "Yeni icerik (HTML formati)",
        },
        slug: {
          type: Type.STRING,
          description: "Yeni slug",
        },
        excerpt: {
          type: Type.STRING,
          description: "Yeni ozet",
        },
        seoTitle: {
          type: Type.STRING,
          description: "Yeni SEO basligi",
        },
        seoDescription: {
          type: Type.STRING,
          description: "Yeni SEO aciklamasi",
        },
        tags: {
          type: Type.STRING,
          description: "Yeni etiketler (virgul ile ayrilmis)",
        },
        coverImage: {
          type: Type.STRING,
          description: "Yeni kapak gorseli URL'si",
        },
        published: {
          type: Type.BOOLEAN,
          description: "true=yayinla, false=taslaga al",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "delete_blog_post",
    description: "Bir blog yazisini kalici olarak siler. Bu islem geri alinamaz",
    parameters: {
      type: Type.OBJECT,
      properties: {
        id: {
          type: Type.STRING,
          description: "Silinecek blog yazisinin ID'si",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "update_settings",
    description:
      "Bir site ayarini gunceller veya yeni bir ayar olusturur (key-value)",
    parameters: {
      type: Type.OBJECT,
      properties: {
        key: {
          type: Type.STRING,
          description: "Ayar anahtari (ornek: 'siteTitle', 'contactEmail')",
        },
        value: {
          type: Type.STRING,
          description: "Ayar degeri",
        },
      },
      required: ["key", "value"],
    },
  },
  {
    name: "generate_image",
    description:
      "AI ile gorsel uretir. Blog kapak gorseli veya portfolyo gorseli icin kullanilabilir",
    parameters: {
      type: Type.OBJECT,
      properties: {
        prompt: {
          type: Type.STRING,
          description:
            "Gorsel aciklamasi (Ingilizce, detayli ve profesyonel)",
        },
        style: {
          type: Type.STRING,
          description:
            "Gorsel stili: minimalist, photorealistic veya illustration",
        },
      },
      required: ["prompt"],
    },
  },
];
