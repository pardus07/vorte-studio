// Fiyatlandırma sabitleri — "use server" dosyasından export edilemezler

export interface PricingItem {
  id: string;
  category: string;
  key: string;
  label: string;
  value: number;
  unit: string | null;
  sortOrder: number;
  isActive: boolean;
}

// Kategori etiketleri
export const CATEGORY_LABELS: Record<string, string> = {
  labor: "İşçilik",
  base: "Temel Paketler",
  feature: "Özellikler",
  content: "İçerik Üretim",
  hosting: "Hosting",
  urgency: "Aciliyet Çarpanı",
  token: "AI Token Maliyeti",
};

export const CATEGORY_ORDER = [
  "labor",
  "base",
  "feature",
  "content",
  "hosting",
  "urgency",
  "token",
];
