import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkRateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  // Rate limit: 100 olay/saat/IP — tracking yüksek volüm OK ama abuse koruması
  const limited = checkRateLimit(req, 'track', 100, 60 * 60 * 1000)
  if (limited) return limited

  try {
    const { slug, type, metadata } = await req.json()

    if (!slug || !type) {
      return NextResponse.json({ error: 'slug ve type zorunlu' }, { status: 400 })
    }

    const page = await prisma.prospectPage.findUnique({
      where: { slug },
    })

    if (!page) {
      return NextResponse.json({ error: 'Sayfa bulunamadı' }, { status: 404 })
    }

    await prisma.prospectEvent.create({
      data: {
        pageId: page.id,
        type,
        metadata: metadata ?? {},
      },
    })

    const counterField =
      type === 'PAGE_VIEW' ? 'viewCount' :
      type === 'DEMO_CLICK' ? 'demoCount' :
      type === 'CHAT_CLICK' ? 'chatCount' : null

    if (counterField) {
      await prisma.prospectPage.update({
        where: { id: page.id },
        data: { [counterField]: { increment: 1 } },
      })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Tracking hatası' }, { status: 500 })
  }
}
