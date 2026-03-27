# VORTE STUDIO — MASTER BUILD PLAN
# Claude Code'a verilecek tam talimat dosyası
# Klasör: D:\VORTE STUDIO
# Son güncelleme: Mart 2026

---

## 🎯 PROJE ÖZETI

**studio.vorte.com.tr** — Tek kişilik web tasarım & mobil uygulama stüdyosu.
Hem portföy sitesi (müşterilere gösterilir) hem admin panel (iş yönetimi) içerir.

**Altyapı:** Mevcut Coolify VPS — vorte.com.tr ile aynı sunucu.
Vercel kullanılmıyor. Her şey kendi sunucunda çalışıyor.

---

## 📦 TEKNOLOJİ STACK

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 15 (App Router) |
| Stil | Tailwind CSS v4 |
| Veritabanı | PostgreSQL (mevcut Coolify VPS) |
| ORM | Prisma |
| Auth | NextAuth.js v5 (credentials) |
| Deploy | Coolify (aynı VPS, studio.vorte.com.tr) |
| Scraper | gosom/google-maps-scraper (Docker container) |
| Reverse Proxy | Traefik (Coolify otomatik yönetir) |
| SSL | Let's Encrypt (Coolify otomatik) |
| Font | Syne (display) + DM Sans (body) |
| Animasyon | Framer Motion |

---

## 🗂️ KLASÖR YAPISI

```
D:\VORTE STUDIO\
├── app/
│   ├── (site)/                    # Portföy sitesi (public)
│   │   ├── page.tsx               # Ana sayfa
│   │   ├── layout.tsx
│   │   └── portfolio/[slug]/      # Proje detay sayfaları
│   ├── (admin)/                   # Admin panel (korumalı)
│   │   ├── layout.tsx             # Sidebar + topbar layout
│   │   ├── dashboard/page.tsx
│   │   ├── prospect/page.tsx      # Müşteri bul (Maps Scraper)
│   │   ├── crm/page.tsx
│   │   ├── leads/page.tsx
│   │   ├── quotes/page.tsx
│   │   ├── projects/page.tsx
│   │   ├── finance/page.tsx
│   │   ├── maintenance/page.tsx
│   │   └── portfolio/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   ├── prospect/search/
│   │   ├── prospect/results/
│   │   └── pagespeed/audit/
│   ├── login/page.tsx
│   └── layout.tsx
├── components/
│   ├── site/
│   │   ├── Hero.tsx
│   │   ├── Services.tsx
│   │   ├── Portfolio.tsx
│   │   ├── Process.tsx
│   │   ├── TechStack.tsx
│   │   └── CTA.tsx
│   └── admin/
│       ├── Sidebar.tsx
│       ├── Topbar.tsx
│       ├── StatCard.tsx
│       ├── AlertList.tsx
│       ├── ProspectTable.tsx
│       ├── KanbanBoard.tsx
│       ├── QuoteCalculator.tsx
│       └── ProjectCard.tsx
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   └── utils.ts
├── actions/
│   ├── prospect.ts
│   ├── crm.ts
│   ├── projects.ts
│   ├── quotes.ts
│   └── finance.ts
├── prisma/
│   └── schema.prisma
├── middleware.ts                  # Route koruması
├── public/
├── docker-compose.yml             # Geliştirme (PostgreSQL + Scraper)
├── docker-compose.prod.yml        # Üretim: app + scraper (Coolify kullanır)
├── Dockerfile                     # Next.js üretim image
├── .env.local                     # Geliştirme ortam değişkenleri
└── package.json
```

---

## 🗃️ PRİSMA VERİ MODELİ (schema.prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  createdAt DateTime @default(now())
}

model Client {
  id           String       @id @default(cuid())
  name         String
  company      String?
  email        String?
  phone        String?
  sector       String?
  status       ClientStatus @default(POTENTIAL)
  notes        String?
  totalRevenue Float        @default(0)
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt

  projects    Project[]
  quotes      Quote[]
  maintenance Maintenance[]
  activities  Activity[]
}

enum ClientStatus {
  POTENTIAL
  ACTIVE
  MAINTENANCE
  INACTIVE
}

model Lead {
  id            String     @id @default(cuid())
  name          String
  company       String?
  email         String?
  phone         String?
  website       String?
  address       String?
  sector        String?
  source        LeadSource @default(MANUAL)
  status        LeadStatus @default(COLD)
  score         Int        @default(0)
  budget        String?
  notes         String?
  googleRating  Float?
  googleReviews Int?
  googleMapsUrl String?
  mobileScore   Int?
  hasWebsite    Boolean    @default(false)
  sslValid      Boolean    @default(false)
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
}

enum LeadSource {
  MAPS_SCRAPER
  SITE_FORM
  LINKEDIN
  REFERRAL
  MANUAL
}

enum LeadStatus {
  COLD
  CONTACTED
  MEETING
  QUOTED
  WON
  LOST
}

model ProspectBatch {
  id         String     @id @default(cuid())
  query      String
  city       String
  category   String
  totalFound Int        @default(0)
  status     String     @default("pending")
  createdAt  DateTime   @default(now())

  prospects Prospect[]
}

model Prospect {
  id            String        @id @default(cuid())
  batchId       String
  batch         ProspectBatch @relation(fields: [batchId], references: [id])
  name          String
  phone         String?
  email         String?
  website       String?
  address       String?
  googleRating  Float?
  googleReviews Int?
  googleMapsUrl String?
  mobileScore   Int?
  hasWebsite    Boolean       @default(false)
  score         Int           @default(0)
  issue         String?
  addedToLeads  Boolean       @default(false)
  createdAt     DateTime      @default(now())
}

model Project {
  id        String        @id @default(cuid())
  title     String
  clientId  String
  client    Client        @relation(fields: [clientId], references: [id])
  type      ProjectType
  status    ProjectStatus @default(DISCOVERY)
  budget    Float
  startDate DateTime?
  deadline  DateTime?
  progress  Int           @default(0)
  techStack String[]
  notes     String?
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt

  payments   Payment[]
  milestones Milestone[]
  activities Activity[]
}

enum ProjectType {
  WEBSITE
  ECOMMERCE
  MOBILE_APP
  REDESIGN
  CUSTOM
}

enum ProjectStatus {
  DISCOVERY
  DESIGN
  DEVELOPMENT
  TESTING
  DELIVERED
  ARCHIVED
}

model Milestone {
  id          String    @id @default(cuid())
  projectId   String
  project     Project   @relation(fields: [projectId], references: [id])
  title       String
  completed   Boolean   @default(false)
  dueDate     DateTime?
  completedAt DateTime?
}

model Quote {
  id          String      @id @default(cuid())
  clientId    String
  client      Client      @relation(fields: [clientId], references: [id])
  packageType String
  basePrice   Float
  addons      Json        @default("[]")
  total       Float
  status      QuoteStatus @default(DRAFT)
  validUntil  DateTime?
  sentAt      DateTime?
  createdAt   DateTime    @default(now())
}

enum QuoteStatus {
  DRAFT
  SENT
  VIEWED
  ACCEPTED
  REJECTED
}

model Payment {
  id        String        @id @default(cuid())
  projectId String
  project   Project       @relation(fields: [projectId], references: [id])
  amount    Float
  type      PaymentType
  dueDate   DateTime
  paidAt    DateTime?
  status    PaymentStatus @default(PENDING)
  invoiceNo String?
  notes     String?
  createdAt DateTime      @default(now())
}

enum PaymentType {
  DEPOSIT
  MILESTONE
  FINAL
  MAINTENANCE
}

enum PaymentStatus {
  PENDING
  PAID
  OVERDUE
  CANCELLED
}

model Maintenance {
  id           String    @id @default(cuid())
  clientId     String
  client       Client    @relation(fields: [clientId], references: [id])
  websiteUrl   String
  monthlyFee   Float
  startDate    DateTime
  renewalDate  DateTime
  domainExpiry DateTime?
  sslExpiry    DateTime?
  plan         String    @default("standard")
  notes        String?
  isActive     Boolean   @default(true)
  createdAt    DateTime  @default(now())
}

model PortfolioItem {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String?
  thumbnail   String?
  liveUrl     String?
  techStack   String[]
  featured    Boolean  @default(false)
  order       Int      @default(0)
  category    String?
  caseStudy   String?
  isPublished Boolean  @default(true)
  createdAt   DateTime @default(now())
}

model Activity {
  id          String   @id @default(cuid())
  clientId    String?
  client      Client?  @relation(fields: [clientId], references: [id])
  projectId   String?
  project     Project? @relation(fields: [projectId], references: [id])
  type        String
  description String
  createdAt   DateTime @default(now())
}
```

---

## 🎨 TASARIM SİSTEMİ

### Portföy Sitesi (public)
- **Arka plan:** #080808
- **Aksent:** #FF4500
- **Font:** Syne 700-800 (başlık) + DM Sans 400 (gövde)
- **Özellikler:** Custom cursor, scroll animasyonları, marquee teknoloji şeridi, bento grid, kinetic typography

### Admin Panel (/admin — korumalı)
- **Arka plan:** #0c0c0e + #111114 (sidebar)
- **Aksent:** #f97316
- **Font:** Geist + Geist Mono
- **Stil:** Minimal dark dashboard, ince border'lar, kompakt layout

---

## 📋 MODÜLLER — 9 ADET

1. **Dashboard** — Gelir özeti, uyarılar, aktif projeler, son lead'ler
2. **Müşteri Bul** — Google Maps Scraper, şehir/sektör seçimi, otomatik skorlama (0-100)
3. **CRM** — Müşteri listesi, detay sayfası, toplam gelir
4. **Lead Pipeline** — Kanban board (Soğuk → İletişim → Teklif → Onay → Kapandı)
5. **Teklif Üretici** — Paket + eklenti hesaplayıcı, %40/%30/%30 takvim, PDF, e-posta
6. **Projeler** — Milestone takibi, progress bar, teknoloji stack
7. **Finans** — Bekleyen ödemeler (gecikmiş=kırmızı), bakım gelirleri, grafik
8. **Bakım Paketleri** — Domain/SSL gün sayacı, 7 gün kala kırmızı uyarı
9. **Portföy Yönetimi** — Sitede görünen projeleri yönet

---

## 🐳 DOCKER YAPILANDIRMASI

### Geliştirme (docker-compose.yml)
Sadece lokal geliştirme — PostgreSQL + Scraper:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: vortestudio
      POSTGRES_USER: vorte
      POSTGRES_PASSWORD: ${DB_PASSWORD:-vorte123}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U vorte -d vortestudio"]
      interval: 10s
      timeout: 5s
      retries: 5

  gmaps-scraper:
    image: gosom/google-maps-scraper:latest
    ports:
      - "8080:8080"
    volumes:
      - gmapsdata:/gmapsdata
    command: >
      -data-folder /gmapsdata
      -dsn postgresql://vorte:${DB_PASSWORD:-vorte123}@postgres:5432/vortestudio
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped

volumes:
  postgres_data:
  gmapsdata:
```

### Üretim (docker-compose.prod.yml)
Coolify bu dosyayı kullanır. PostgreSQL yok — mevcut Coolify DB kullanılır:

```yaml
version: '3.8'

services:
  studio-app:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - ADMIN_PASSWORD_HASH=${ADMIN_PASSWORD_HASH}
      - SCRAPER_URL=http://gmaps-scraper:8080
      - PAGESPEED_API_KEY=${PAGESPEED_API_KEY}
      - RESEND_API_KEY=${RESEND_API_KEY}
      - FROM_EMAIL=${FROM_EMAIL}
      - NODE_ENV=production
    ports:
      - "3000:3000"
    depends_on:
      - gmaps-scraper
    restart: unless-stopped
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.studio.rule=Host(`studio.vorte.com.tr`)"
      - "traefik.http.routers.studio.tls=true"
      - "traefik.http.routers.studio.tls.certresolver=letsencrypt"
      - "traefik.http.services.studio.loadbalancer.server.port=3000"

  gmaps-scraper:
    image: gosom/google-maps-scraper:latest
    volumes:
      - gmapsdata:/gmapsdata
    command: >
      -data-folder /gmapsdata
      -dsn ${DATABASE_URL}
    restart: unless-stopped
    # Dışarıya açık değil — sadece studio-app erişir

volumes:
  gmapsdata:
```

### Dockerfile

```dockerfile
FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production

FROM base AS builder
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
```

---

## 🌐 COOLIFY KURULUM ADIMLARI

### 1. DNS Kaydı Ekle (Cloudflare veya kullandığın sağlayıcı)
```
Tip:    A
Ad:     studio
Değer:  [Coolify VPS IP adresi — vorte.com.tr ile aynı]
TTL:    Auto
Proxy:  Kapalı (ilk kurulumda)
```

### 2. Coolify'da Yeni Uygulama Oluştur
```
Coolify Dashboard
→ New Resource
→ Docker Compose
→ Git Repository: github.com/[kullanici]/vorte-studio
→ Branch: main
→ Docker Compose dosyası: docker-compose.prod.yml
→ Domain: studio.vorte.com.tr
→ SSL: Let's Encrypt (Coolify otomatik halleder)
```

### 3. Coolify Environment Variables
```env
DATABASE_URL=postgresql://vorte:GERCEK_SIFRE@localhost:5432/vortestudio
NEXTAUTH_SECRET=cok-uzun-rastgele-gizli-string-min-32-karakter
NEXTAUTH_URL=https://studio.vorte.com.tr
ADMIN_PASSWORD_HASH=$2a$12$GERCEK_BCRYPT_HASH_BURAYA
PAGESPEED_API_KEY=AIzaSy...
RESEND_API_KEY=re_...
FROM_EMAIL=studio@vorte.com.tr
NODE_ENV=production
```

### 4. Veritabanı
Mevcut Coolify PostgreSQL'e yeni database ekle:
```sql
CREATE DATABASE vortestudio;
CREATE USER vorte WITH PASSWORD 'guclu_sifre';
GRANT ALL PRIVILEGES ON DATABASE vortestudio TO vorte;
```

### 5. Deploy Akışı
```
GitHub'a push
→ Coolify webhook tetiklenir
→ Docker image build edilir (Dockerfile)
→ Prisma migrate otomatik çalışır
→ Servis başlar
→ SSL sertifikası Let's Encrypt'ten alınır
→ studio.vorte.com.tr yayına girer
```

---

## 🔐 AUTH

```typescript
// lib/auth.ts
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Şifre', type: 'password' },
      },
      async authorize(credentials) {
        const valid = await bcrypt.compare(
          credentials.password as string,
          process.env.ADMIN_PASSWORD_HASH!
        )
        if (valid) {
          return { id: '1', email: credentials.email as string, name: 'İbrahim Abi' }
        }
        return null
      }
    })
  ],
  pages: { signIn: '/login' },
  session: { strategy: 'jwt' },
})
```

**Şifre hash oluşturma (bir kez çalıştır):**
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('SIFREN_BURAYA', 12).then(console.log)"
# Çıkan hash'i Coolify'da ADMIN_PASSWORD_HASH olarak ekle
```

**middleware.ts (route koruması):**
```typescript
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = req.nextUrl.pathname === '/login'

  if (isAdminRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url))
  }
})

export const config = {
  matcher: ['/admin/:path*', '/login'],
}
```

---

## 🔍 GOOGLE MAPS SCRAPER

```typescript
// actions/prospect.ts
'use server'
import { prisma } from '@/lib/prisma'

const SCRAPER_URL = process.env.SCRAPER_URL || 'http://localhost:8080'

export async function startProspectSearch(city: string, category: string) {
  const res = await fetch(`${SCRAPER_URL}/api/v1/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `${category} in ${city}`,
      lang: 'tr',
      depth: 1,
      email: true,
    })
  })
  const { jobId } = await res.json()

  const batch = await prisma.prospectBatch.create({
    data: { query: `${category} in ${city}`, city, category, status: 'running' }
  })

  return { jobId, batchId: batch.id }
}

export async function getProspectResults(jobId: string, batchId: string) {
  const res = await fetch(`${SCRAPER_URL}/api/v1/jobs/${jobId}`)
  const data = await res.json()

  if (data.status !== 'completed') return { status: data.status, prospects: [] }

  const prospects = data.results.map((item: any) => ({
    batchId,
    name:          item.title,
    phone:         item.phone         || null,
    email:         item.email         || null,
    website:       item.website       || null,
    address:       item.address       || null,
    googleRating:  item.rating        || null,
    googleReviews: item.reviewsCount  || null,
    googleMapsUrl: item.link          || null,
    hasWebsite:    !!item.website,
    score:         calculateScore(item),
    issue:         getIssueLabel(item),
  }))

  await prisma.prospect.createMany({ data: prospects })
  await prisma.prospectBatch.update({
    where: { id: batchId },
    data: { status: 'completed', totalFound: prospects.length }
  })

  return { status: 'completed', prospects }
}

export async function addProspectToLeads(prospectId: string) {
  const prospect = await prisma.prospect.findUnique({ where: { id: prospectId } })
  if (!prospect) throw new Error('Bulunamadı')

  const lead = await prisma.lead.create({
    data: {
      name:          prospect.name,
      phone:         prospect.phone,
      email:         prospect.email,
      website:       prospect.website,
      address:       prospect.address,
      googleRating:  prospect.googleRating,
      googleReviews: prospect.googleReviews,
      googleMapsUrl: prospect.googleMapsUrl,
      hasWebsite:    prospect.hasWebsite,
      score:         prospect.score,
      source:        'MAPS_SCRAPER',
      status:        'COLD',
    }
  })

  await prisma.prospect.update({
    where: { id: prospectId },
    data: { addedToLeads: true }
  })

  return lead
}

// Puanlama (0-100)
function calculateScore(item: any): number {
  let score = 0
  if (!item.website)                                 score += 40
  if (item.mobileScore && item.mobileScore < 50)    score += 25
  if (!item.ssl)                                     score += 15
  if (item.reviewsCount && item.reviewsCount >= 50) score += 10
  if (item.phone)                                    score +=  5
  return Math.min(score, 100)
}

function getIssueLabel(item: any): string {
  if (!item.website)                              return 'Site yok'
  if (item.mobileScore && item.mobileScore < 50) return `Mobil ${item.mobileScore}/100`
  if (!item.ssl)                                  return 'SSL yok'
  return 'Düşük öncelik'
}
```

---

## 🌍 ORTAM DEĞİŞKENLERİ

### .env.local (geliştirme)
```env
# Lokal Docker PostgreSQL
DATABASE_URL="postgresql://vorte:vorte123@localhost:5432/vortestudio"

# Auth
NEXTAUTH_SECRET="gelistirme-icin-herhangi-bir-uzun-string-32-karakter"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_PASSWORD_HASH="bcrypt-hash-buraya"

# Lokal Docker Scraper
SCRAPER_URL="http://localhost:8080"

# Google PageSpeed (console.cloud.google.com'dan ücretsiz)
PAGESPEED_API_KEY="AIzaSy..."

# Resend (resend.com — ücretsiz 3000/ay)
RESEND_API_KEY="re_..."
FROM_EMAIL="studio@vorte.com.tr"

NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

---

## 📦 PAKETLER

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@prisma/client": "^5.0.0",
    "next-auth": "^5.0.0-beta",
    "bcryptjs": "^2.4.3",
    "framer-motion": "^11.0.0",
    "tailwindcss": "^4.0.0",
    "resend": "^3.0.0",
    "@react-pdf/renderer": "^3.0.0",
    "chart.js": "^4.0.0",
    "react-chartjs-2": "^5.0.0",
    "zod": "^3.0.0",
    "date-fns": "^3.0.0",
    "clsx": "^2.0.0"
  },
  "devDependencies": {
    "prisma": "^5.0.0",
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/bcryptjs": "^2.4.0"
  }
}
```

---

## 🚀 KURULUM ADIMLARI

```bash
# 1. Next.js projesi oluştur
npx create-next-app@latest . --typescript --tailwind --app --src-dir no --import-alias "@/*"

# 2. Paketleri kur
npm install next-auth@beta @prisma/client framer-motion resend @react-pdf/renderer chart.js react-chartjs-2 zod date-fns clsx bcryptjs
npm install -D prisma @types/bcryptjs

# 3. Prisma başlat
npx prisma init

# 4. Docker başlat (geliştirme)
docker-compose up -d

# 5. Migration
npx prisma migrate dev --name init

# 6. Client oluştur
npx prisma generate

# 7. Dev server
npm run dev
```

---

## ⚡ SPRİNT PLANI (14 gün)

**Sprint 1 — Altyapı (Gün 1-2)**
- [ ] Next.js + Tailwind kurulum
- [ ] Prisma schema + migration
- [ ] docker-compose.yml (geliştirme)
- [ ] docker-compose.prod.yml + Dockerfile (Coolify)
- [ ] NextAuth login sayfası
- [ ] Admin layout (sidebar + topbar)
- [ ] middleware.ts route koruması

**Sprint 2 — Portföy Sitesi (Gün 3-4)**
- [ ] Hero (animasyon, custom cursor, kinetic typography)
- [ ] Marquee teknoloji şeridi
- [ ] Hizmetler bento grid
- [ ] Portföy grid (DB'den)
- [ ] Süreç timeline + CTA
- [ ] Mobil responsive

**Sprint 3 — Temel Admin (Gün 5-7)**
- [ ] Dashboard (istatistikler, uyarılar, projeler)
- [ ] CRM (liste + detay + CRUD)
- [ ] Projeler (milestone + progress)
- [ ] Finans (ödemeler + grafik)

**Sprint 4 — Satış Araçları (Gün 8-10)**
- [ ] Teklif üretici (hesaplayıcı + PDF + mail)
- [ ] Lead pipeline (kanban)
- [ ] Bakım paketleri (SSL/domain sayacı)

**Sprint 5 — Müşteri Motoru (Gün 11-13)**
- [ ] Google Maps Scraper bağlantısı
- [ ] Prospect arama + sonuç listesi
- [ ] Otomatik skorlama
- [ ] Lead'e dönüştürme
- [ ] PageSpeed Insights audit

**Sprint 6 — Canlıya Geçiş (Gün 14)**
- [ ] Portföy yönetim sayfası
- [ ] GitHub'a push
- [ ] Coolify: docker-compose.prod.yml ile deploy
- [ ] DNS A kaydı ekle (studio → VPS IP)
- [ ] Coolify env variables gir
- [ ] SSL otomatik alınır
- [ ] studio.vorte.com.tr yayına girer

---

## 💬 CLAUDE CODE'A VERİLECEK İLK KOMUT

```
D:\VORTE STUDIO klasöründeki VORTE_STUDIO_MASTER_PLAN.md dosyasını oku
ve Sprint 1'i başlat:

1. Next.js 15 App Router + Tailwind v4 kurulumu
2. Prisma schema (dosyadaki tam modeli kullan) + migration
3. docker-compose.yml (geliştirme — PostgreSQL + gmaps-scraper)
4. docker-compose.prod.yml + Dockerfile (Coolify deploy için)
5. NextAuth v5 credentials login sayfası (/login)
6. Admin layout: sidebar (220px, 9 modül, ikonlar) + topbar
7. middleware.ts: /admin/* route koruması

Tech stack: Next.js 15, Tailwind v4, Prisma, PostgreSQL, NextAuth v5, Geist font.
Deploy hedefi: Coolify VPS (studio.vorte.com.tr) — Vercel kullanılmıyor.
Mevcut vorte.com.tr ile aynı sunucu, aynı PostgreSQL instance.
```

---

## 📝 ÖNEMLİ NOTLAR

1. **Vercel yok** — Her şey mevcut Coolify VPS'te çalışır
2. **Subdomain DNS** — studio.vorte.com.tr → aynı VPS IP → Traefik yönlendirir → Coolify otomatik SSL verir
3. **Veritabanı** — Mevcut PostgreSQL'e yeni `vortestudio` database ekle, ayrı sunucu gerekmez
4. **Scraper** — Internal Docker network'te çalışır, 8080 portu dışarıya kapalı, sadece Next.js erişir
5. **Google Maps Scraper** — Haftada 10-15 sorgu, depth 1, yavaş kullan
6. **PageSpeed API** — Google Cloud Console'dan ücretsiz API key, günde 25.000 istek hakkı
7. **E-posta** — Resend.com, ücretsiz 3.000/ay, studio@vorte.com.tr için domain doğrulama gerekli
8. **Şifre hash** — Kurulumda bir kez `node -e "bcrypt.hash(...)"` çalıştır, hash'i Coolify env'e ekle
