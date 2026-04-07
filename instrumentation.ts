// Next.js 13.4+ instrumentation hook
// Server ve edge runtime'da otomatik çağrılır, Sentry init'i tetikler
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Next.js 15+ — server-side request error hook
// API route ve Server Component hatalarını otomatik Sentry'ye yollar
export const onRequestError = Sentry.captureRequestError;
