# VORTE STUDIO — Claude Code Kuralları

Bu dosya her oturumda otomatik okunur. Kod yazmadan önce bu kuralları uygula.

---

## ⚡ KRİTİK — DEPLOYMENT HATALARI

### 1. Next.js — Build Time DB Çağrısı YASAK
Server Component'lerde doğrudan Prisma çağrısı build'i patlatır.
Her DB çağrısını `try/catch` ile sar ve sayfaya `dynamic` ekle:

```typescript
// Her DB çağrısı yapan sayfanın BAŞINA ekle:
export const dynamic = 'force-dynamic'

// Her Prisma çağrısını try/catch ile sar:
let data = []
try {
  data = await prisma.model.findMany()
} catch {
  data = [] // DB yoksa boş döndür, build patlamasın
}
```

### 2. Prisma 7.x — Client Path Değişti
`node_modules/.prisma` artık YOK. Client `app/generated/prisma`'da.

```typescript
// YANLIŞ:
import { PrismaClient } from '@prisma/client'

// DOĞRU (Prisma 7.x):
import { PrismaClient } from '@/app/generated/prisma'
```

Dockerfile'da:
```dockerfile
# YANLIŞ — bu path yok:
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# DOĞRU:
COPY --from=builder /app/app/generated ./app/generated
```

### 3. NextAuth v5 — Route Handler
Route dosyası SADECE şunu içermeli, başka hiçbir şey:

```typescript
// app/api/auth/[...nextauth]/route.ts
export { GET, POST } from '@/lib/auth'
```

### 4. Next.js 16 — middleware.ts Deprecated
`middleware.ts` çalışıyor ama deprecated. `proxy.ts` olarak adlandır:

```
middleware.ts → proxy.ts (aynı içerik)
```

### 5. Tailwind v4 — Config Yok
`tailwind.config.ts` OLMAZ. Tüm config `globals.css`'te `@theme` bloğunda:

```css
@import "tailwindcss";

@theme {
  --color-accent: #f97316;
  /* ... */
}
```

PostCSS plugin: `@tailwindcss/postcss` (tailwindcss değil)

### 6. Dockerfile — NODE_ENV Build Sorunu
Build aşamasında `NODE_ENV=production` devDependencies'i atlar, build patlar.
Builder stage'de her zaman `development` kullan:

```dockerfile
FROM base AS builder
# NODE_ENV=development ile kur:
RUN NODE_ENV=development npm ci
# Build'den ÖNCE production'a geç:
ENV NODE_ENV=production
RUN npm run build
```

### 7. Bcrypt Hash — Coolify $ Sorunu
Bcrypt hash'lerindeki `$` işareti Coolify'da `dotenv-expand` tarafından
değişken referansı olarak yorumlanır.
Coolify env panelinde hash değerini tırnak içine al veya `\$` ile escape et.

---

## 🏗️ PROJE MİMARİSİ

```
app/
├── (site)/          # Public portföy — URL: /
├── admin/           # Admin panel — URL: /admin/*  ← literal klasör
├── api/auth/
├── login/
└── layout.tsx

# (admin) route group KULLANMA — URL'e yansımaz!
# admin/ literal klasör kullan — middleware /admin/* yakalar
```

---

## 🗃️ VERİTABANI

- **ORM:** Prisma 7.x
- **DB:** PostgreSQL (Coolify VPS)
- **Client path:** `app/generated/prisma`
- **Migration:** `npx prisma migrate dev` (geliştirme) / `npx prisma migrate deploy` (üretim)
- **Prisma CLI:** `.env` dosyasından okur (`.env.local` değil)
  → `DATABASE_URL` her ikisinde de bulunmalı

---

## 🔐 AUTH

- **NextAuth v5 beta** — `next-auth@beta`
- **Pattern:** `auth()` wrapper, JWT session, Credentials provider
- **Tek kullanıcı:** bcrypt hash `.env.local`'de, DB'ye kayıt yok
- **Route:** sadece `export { GET, POST } from '@/lib/auth'`

---

## 🐳 DOCKER — COOLIFY DEPLOY

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN NODE_ENV=development npm ci    # development ile kur
COPY . .
RUN npx prisma generate
ENV NODE_ENV=production
RUN npm run build                  # production build

FROM node:20-alpine AS runner
# node_modules/.prisma KOPYALAMA (Prisma 7.x'te yok)
COPY --from=builder /app/app/generated ./app/generated  # bunu kopyala
COPY --from=builder /app/prisma ./prisma
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
```

`next.config.ts`'de `output: 'standalone'` zorunlu.

---

## 🎨 TASARIM SİSTEMİ

### Portföy Sitesi (public)
| Token | Değer |
|---|---|
| Arka plan | #080808 |
| Aksent | #FF4500 |
| Font display | Syne 700-800 |
| Font body | DM Sans 400 |

### Admin Panel
| Token | Değer |
|---|---|
| Arka plan | #0c0c0e |
| Sidebar | #111114 |
| Aksent | #f97316 |
| Font | Geist + Geist Mono |

---

## ✅ HER MODÜL İÇİN KONTROL LİSTESİ

Yeni sayfa veya bileşen yazmadan önce sor:

- [ ] DB çağrısı var mı? → `try/catch` + `export const dynamic = 'force-dynamic'`
- [ ] Prisma import doğru mu? → `app/generated/prisma`'dan
- [ ] Client component gerekiyor mu? → `'use client'` direktifi var mı?
- [ ] Türkçe karakter kontrolü → ş, ç, ö, ü, ğ, ı, İ doğru mu?
- [ ] Tailwind class'lar `globals.css`'teki token'lardan mı geliyor?
- [ ] Zod validasyonu var mı? (Server Actions için zorunlu)
- [ ] Hata boundary / loading state var mı?

---

## 📦 PAKET VERSİYONLARI

```json
{
  "next": "^16.x",
  "next-auth": "^5.0.0-beta",
  "@prisma/client": "^7.x",
  "prisma": "^7.x",
  "tailwindcss": "^4.x",
  "framer-motion": "^11.x"
}
```

---

## 🚫 YAPMA

- `export default function Page()` içinde doğrudan `await prisma.x()` — try/catch olmadan
- `tailwind.config.ts` oluşturma (v4'te yok)
- `app/api/auth/[...nextauth]/route.ts` içine fazladan kod yazma
- `node_modules/.prisma` path'ini Dockerfile'da kopyalama
- `.env.local` dosyasını git'e commit etme
- Client component'te `async` kullanma (Server Component'e taşı)
- `middleware.ts` yerine artık `proxy.ts` kullan

---

## 💬 İLETİŞİM KURALLARI

- Türkçe konuş
- Planlamadan önce dosyaları oku
- Değişiklik öncesi ne yapacağını açıkla
- Onay almadan kod yazma (KODLA veya UYGULA denilmedikçe)
- Sessiz değişiklik yapma
