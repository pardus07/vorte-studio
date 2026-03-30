export type PageContext = {
  title: string;
  shortcuts: { label: string; prompt: string }[];
};

export function getPageContext(pathname: string): PageContext {
  const contextMap: Record<string, PageContext> = {
    "/admin/dashboard": {
      title: "Dashboard",
      shortcuts: [
        {
          label: "Durum ozeti",
          prompt: "Dashboard istatistiklerini ozetle",
        },
        {
          label: "Aktif projeler",
          prompt: "Aktif projeleri ve durumlarini goster",
        },
      ],
    },
    "/admin/blog": {
      title: "Blog",
      shortcuts: [
        {
          label: "Yazilari listele",
          prompt: "Blog yazilarini listele ve ozetle",
        },
        {
          label: "Yeni SEO yazisi",
          prompt:
            "Web tasarim ajansi icin SEO uyumlu, anahtar kelime odakli bir blog yazisi olustur. Baslik, slug, excerpt, seoTitle, seoDescription, tags ve tam HTML icerik uret. Kapak gorseli de uret.",
        },
        {
          label: "Taslaklari goster",
          prompt: "Yayinlanmamis taslak blog yazilarini listele",
        },
      ],
    },
    "/admin/settings": {
      title: "Ayarlar",
      shortcuts: [
        {
          label: "Ayarlari goster",
          prompt: "Mevcut site ayarlarini listele",
        },
      ],
    },
    "/admin/crm": {
      title: "CRM",
      shortcuts: [
        {
          label: "Aktif musteriler",
          prompt: "Aktif musterileri listele",
        },
        {
          label: "Potansiyel musteriler",
          prompt: "Potansiyel musterileri listele",
        },
      ],
    },
    "/admin/leads": {
      title: "Lead Pipeline",
      shortcuts: [
        {
          label: "Tum lead'ler",
          prompt: "Lead pipeline'ini ozetle",
        },
      ],
    },
    "/admin/projects": {
      title: "Projeler",
      shortcuts: [
        {
          label: "Aktif projeler",
          prompt: "Devam eden projeleri goster",
        },
      ],
    },
    "/admin/portfolio": {
      title: "Portfolyo",
      shortcuts: [
        {
          label: "Portfolyo listele",
          prompt: "Yayinlanan portfolyo ogelerini listele",
        },
      ],
    },
    "/admin/maintenance": {
      title: "Bakim Paketleri",
      shortcuts: [
        {
          label: "Aktif paketler",
          prompt:
            "Aktif bakim paketlerini ve yenileme tarihlerini goster",
        },
      ],
    },
  };

  return (
    contextMap[pathname] || {
      title: "Admin Panel",
      shortcuts: [
        {
          label: "Genel durum",
          prompt: "Dashboard istatistiklerini ozetle",
        },
      ],
    }
  );
}
