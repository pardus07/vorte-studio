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
}

// Teklif chatbot sayfası linki
export function buildChatLink(slug: string) {
  return `/p/${slug}/chat`
}
