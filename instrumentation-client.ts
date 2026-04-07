// Next.js 15.3+ client-side instrumentation
// Tarayıcıda Sentry'yi başlatır — eski sentry.client.config.ts yerine geçer
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  environment: process.env.NODE_ENV,

  // Performance tracing — production'da %10
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 0,

  // Session replay KAPALI — KVKK kapsamını genişletir, ayrı izin gerektirir
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,

  // PII otomatik gönderme — KVKK uyumu
  sendDefaultPii: false,

  integrations: [],

  debug: false,
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Tarayıcı eklentilerinden gelen tipik gürültü hatalarını filtrele
  ignoreErrors: [
    // Tarayıcı eklentileri
    "top.GLOBALS",
    "ResizeObserver loop limit exceeded",
    "ResizeObserver loop completed with undelivered notifications",
    "Non-Error promise rejection captured",
    // Network kesintileri (kullanıcı internet sorunu)
    "Network request failed",
    "Failed to fetch",
    "NetworkError",
    "Load failed",
    // ChunkLoadError — deploy sırasında stale chunk
    "ChunkLoadError",
    "Loading chunk",
  ],

  // Üçüncü taraf script'lerden gelen hataları filtrele
  denyUrls: [
    /extensions\//i,
    /^chrome:\/\//i,
    /^chrome-extension:\/\//i,
    /^moz-extension:\/\//i,
  ],
});

// Next.js 15+ router transition tracking için
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
