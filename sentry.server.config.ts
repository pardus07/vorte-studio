// Sentry — server runtime (Node.js) için init
// Bu dosya instrumentation.ts içinden register() ile yüklenir
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Ortam ayrımı — Coolify production'da "production" set edilir
  environment: process.env.NODE_ENV,

  // Performance tracing — production'da %10 örnekle, dev'de kapalı
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 0,

  // PII'yi otomatik gönderme — KVKK uyumu için kapalı
  // (request body, IP, header gibi kişisel veriler Sentry'ye gitmez)
  sendDefaultPii: false,

  // Console.error otomatik yakalansın mı? Hayır — gürültü azaltmak için
  // sadece throw edilen exception'lar ve manuel Sentry.captureException
  integrations: [],

  // Sentry'nin kendi loglarını sustur
  debug: false,

  // Build sırasında DSN yoksa sessizce devre dışı kal (build patlamasın)
  enabled: !!process.env.SENTRY_DSN,

  // Bilinen gürültü hatalarını filtrele
  ignoreErrors: [
    // NextAuth normal akış hataları (yanlış şifre vs.)
    "CredentialsSignin",
    "CallbackRouteError",
    // Rate limit response'ları normal davranış, hata değil
    "Rate limit exceeded",
  ],
});
