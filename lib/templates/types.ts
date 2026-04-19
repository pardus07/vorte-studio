export interface TemplateImageSlot {
  slot: string
  label: string
  aspectRatio: string
  imageSize: string
  style: 'photorealistic' | 'minimalist' | 'illustration'
  promptHint: string
  position: string
}

export interface TemplateProps {
  firmName: string
  city: string
  district?: string
  address?: string
  phone?: string
  googleRating?: number
  googleReviews?: number
  score: number
  slug: string
  sector: string
  images?: Record<string, string>
}

// Teklif chatbot sayfası linki
// Sprint 3.6c — /p/[slug] kaldırıldı, chat akışı /demo/[slug]/chat'e taşındı.
// 103 şablonun tümü bu helper'ı kullandığı için merkezi değişiklik.
export function buildChatLink(slug: string) {
  return `/demo/${slug}/chat`
}
