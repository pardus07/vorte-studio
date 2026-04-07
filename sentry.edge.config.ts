// Sentry — edge runtime (middleware/proxy.ts ve edge route'lar) için init
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 0,
  sendDefaultPii: false,
  integrations: [],
  debug: false,
  enabled: !!process.env.SENTRY_DSN,
  ignoreErrors: ["CredentialsSignin", "CallbackRouteError", "Rate limit exceeded"],
});
