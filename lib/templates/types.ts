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
export function buildChatLink(slug: string) {
  return `/p/${slug}/chat`
}
