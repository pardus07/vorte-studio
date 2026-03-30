'use client'

import { useEffect, useRef } from 'react'

export function useTrackPageView(slug: string) {
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current) return
    tracked.current = true

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug,
        type: 'PAGE_VIEW',
        metadata: {
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          referrer: document.referrer || null,
        },
      }),
    }).catch(() => {})
  }, [slug])
}

export function trackEvent(slug: string, type: 'DEMO_CLICK' | 'CHAT_CLICK') {
  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      slug,
      type,
      metadata: { timestamp: new Date().toISOString() },
    }),
  }).catch(() => {})
}
