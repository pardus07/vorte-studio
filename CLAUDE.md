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

### 8. Google "Aldatıcı Sayfalar" Önleme
Scraper tabanlı dinamik sayfalar (`/p/`, `/demo/`) gerçek firma verisi
gösterdiği için Google tarafından brand impersonation / deceptive pages
olarak algılanabilir. Her yeni dinamik rota için **dört katmanlı savunma**
zorunlu:

1. **generateMetadata**'da `robots: { index: false, follow: false }`
2. **next.config.ts**'de `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet` header
3. **app/robots.ts**'de rotayı `disallow` listesine ekle
4. **/p/** sayfalarında `<ProspectDisclaimer>` bantı (components/site/ProspectDisclaimer.tsx)

Tek katman yeterli DEĞİL — Google metadata ve header'ı ayrı doğrular.
Disclaimer bantı SSR'da render edilmeli (initial state `dismissed=false`)
aksi halde Googlebot ilk HTML'de göremez.

Sitemap hatası: Search Console'a **sadece `sitemap.xml`** gönder,
`robots.txt`'yi sitemap olarak gönderme ("Desteklenmeyen dosya biçimi" hatası).

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

## 🌐 HOSTING & VDS KAPASİTE BİLGİLERİ

### Hosting Sağlayıcı
- **Kaynak:** hostingdunyam.com.tr (Türkiye SSD VDS)
- **Model:** VDS alınıp %40 kâr eklenerek müşteriye satılıyor
- **Müşteri teknik detay görmez** — "Vorte Studio hosting" olarak bilir
- **Domain dahil**, yönetim Vorte Studio'da

### VDS Paket Eşleştirme (yıllık fiyatlar)
| Vorte Paketi | VDS | Spec | Maliyet | Müşteriye |
|---|---|---|---|---|
| Starter | TR-VDS3 | 2C/3GB/30GB | 1.700 ₺ | 2.490 ₺/yıl |
| Profesyonel | TR-VDS5 | 4C/6GB/50GB | 3.150 ₺ | 4.490 ₺/yıl |
| E-Ticaret | TR-VDS7 | 4C/12GB/70GB | 5.800 ₺ | 8.190 ₺/yıl |

### Site Başı Kaynak Tüketimi (Coolify + Next.js standalone)
- **Sistem overhead:** ~1.2 GB RAM (OS + Coolify + Traefik + Docker + shared PostgreSQL)
- **Starter:** ~130 MB RAM, ~200 MB disk (DB yok)
- **Profesyonel:** ~175 MB RAM, ~500 MB disk (shared DB)
- **E-Ticaret:** ~400 MB RAM, ~3 GB disk (ağır DB + görseller)

### Paylaşımlı Model (Starter + Profesyonel müşteriler)
- TR-VDS6 (4C/8GB, 3.950 ₺/yıl) ile 10-16 müşteri barındırılır
- E-Ticaret müşterilere ayrı VDS (TR-VDS5 veya VDS7)
- 15+ müşteriyle TR-VDS8'e (6C/16GB) geçiş planla

### Bakım/Yenileme Formülü
- `Maintenance.monthlyFee` **aylık** değer tutar (DB alan adı)
- Yıllık paket tutarı 12'ye bölünerek kaydedilir:
  - Starter: 2.490 / 12 = **207,50 ₺/ay**
  - Profesyonel: 4.490 / 12 = **374,17 ₺/ay**
  - E-Ticaret: 8.190 / 12 = **682,50 ₺/ay**

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
