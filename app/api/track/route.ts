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

    // ── Sprint 3.6d: Demo sayfası tracking ──
    // /demo/[slug]?ref=<leadId> rotalarında template'ler
    // slug="demo-<template>-<leadId>" formatında POST eder.
    // Prefix-based routing: template dosyalarına dokunmadan demo ile prospect
    // ayırt edilir. CUID'ler "c" + alfanumerik karakterler ile başlar.
    if (typeof slug === 'string' && slug.startsWith('demo-')) {
      const match = slug.match(/^demo-.+-(c[a-z0-9]+)$/)
      if (!match) {
        // Generic demo (ör: "demo-dis-klinikleri", ref yok) — sessizce OK dön.
        // 404 log gürültüsü yapmaz, client tarafında hata görünmez.
        return NextResponse.json({ ok: true, skipped: 'no-lead-id' })
      }

      const leadId = match[1]

      // Sadece PAGE_VIEW viewCount'u artırır. DEMO_CLICK/CHAT_CLICK gibi
      // event'ler Lead modelinde ilgili kolon olmadığı için sessizce geçilir.
      if (type === 'PAGE_VIEW') {
        try {
          await prisma.lead.update({
            where: { id: leadId },
            data: { viewCount: { increment: 1 } },
          })
        } catch {
          // Lead bulunamazsa (silinmiş/yanlış id) sessizce geç.
          // Client tarafında hata göstermek yerine ok=true dön — UX bozulmaz.
        }
      }

      return NextResponse.json({ ok: true })
    }

    // ── ProspectPage tracking (mevcut davranış, değişmedi) ──
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
