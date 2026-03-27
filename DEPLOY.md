# Vorte Studio — Coolify Deploy Talimatlari

## 1. GitHub'a Push

```bash
cd "D:\VORTE STUDIO"
git init
git add .
git commit -m "feat: Vorte Studio v1.0 — Sprint 1-6 tamamlandi

- Next.js 16 + Tailwind v4 + Prisma 7
- Portfolio sitesi (10 bolum, scroll animasyonlari)
- Admin panel (9 modul: Dashboard, CRM, Projeler, Finans,
  Teklif Uretici, Lead Pipeline, Bakim Paketleri,
  Musteri Bul, Portfolyo Yonetimi)
- NextAuth v5 credentials auth + middleware
- Docker multi-stage production build
- Google Maps Scraper entegrasyonu (mock)"

git remote add origin https://github.com/[KULLANICI]/vorte-studio.git
git branch -M main
git push -u origin main
```

## 2. DNS Kaydi

Vorte.com.tr DNS saglayicisinda (Cloudflare veya diger):

```
Tip:    A
Ad:     studio
Deger:  [Coolify VPS IP adresi]
TTL:    Auto
Proxy:  KAPALI (ilk kurulumda — SSL icin gerekli)
```

## 3. Coolify'da Yeni Uygulama

1. Coolify Dashboard → **New Resource** → **Docker Compose**
2. Git Repository: `github.com/[KULLANICI]/vorte-studio`
3. Branch: `main`
4. Docker Compose dosyasi: `docker-compose.prod.yml`
5. Domain: `studio.vorte.com.tr`
6. SSL: Let's Encrypt (Coolify otomatik halleder)

## 4. Coolify Environment Variables

Coolify panelinde su degiskenleri ekle:

```
DATABASE_URL=postgresql://vorte:GUCLU_SIFRE@COOLIFY_PG_HOST:5432/vortestudio
NEXTAUTH_SECRET=min-32-karakter-rastgele-string-uret
NEXTAUTH_URL=https://studio.vorte.com.tr
ADMIN_PASSWORD_HASH=bcrypt-hash-buraya
PAGESPEED_API_KEY=google-cloud-console-dan-al
RESEND_API_KEY=resend.com-dan-al
FROM_EMAIL=studio@vorte.com.tr
NEXT_PUBLIC_SITE_URL=https://studio.vorte.com.tr
NODE_ENV=production
```

### ONEMLI: ADMIN_PASSWORD_HASH

Bcrypt hash icindeki `$` isaretleri sorun cikarabilir.
Coolify'da **raw deger alani** veya **tek tirnak** kullan:

```bash
# Hash olusturma (bir kez calistir):
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('SIFREN', 12).then(console.log)"

# Cikan hash'i Coolify'a gir. Ornek:
# $2b$12$abc... seklinde olacak
# Coolify'da sorun cikarsa \$ ile escape et
```

## 5. Veritabani (Coolify VPS'te bir kez)

Mevcut Coolify PostgreSQL'e yeni database ekle:

```bash
# Coolify VPS'e SSH baglan
ssh root@[VPS_IP]

# PostgreSQL container'ina baglan
docker exec -it [postgres_container_name] psql -U postgres

# Database ve kullanici olustur
CREATE DATABASE vortestudio;
CREATE USER vorte WITH PASSWORD 'GUCLU_SIFRE';
GRANT ALL PRIVILEGES ON DATABASE vortestudio TO vorte;
\q
```

## 6. Ilk Deploy

Deploy otomatik baslar. Dockerfile'daki CMD satirinda migration otomatik calisir:

```dockerfile
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
```

Eger migration hata verirse manuel calistir:

```bash
docker exec -it [studio_app_container] npx prisma migrate deploy
```

## 7. Dogrulama

Deploy tamamlaninca kontrol et:

- [ ] `https://studio.vorte.com.tr` → portfolio sitesi gorunuyor
- [ ] `https://studio.vorte.com.tr/admin/dashboard` → login sayfasina yonlendirir
- [ ] `https://studio.vorte.com.tr/login` → dark login formu gorunuyor
- [ ] Giris yap → admin dashboard dolu gorunuyor
- [ ] SSL yesil kilit gorunuyor (tarayici adres cubugu)
- [ ] Mobil goruntuleme dogru calisiyor

## 8. Sonraki Adimlar

- [ ] Resend.com'da `studio@vorte.com.tr` domain dogrulamasi
- [ ] Google Cloud Console'dan PageSpeed API key al
- [ ] Google Maps Scraper tablolarini kontrol et
- [ ] Gercek musteri verisi gir (CRM, Projeler)
- [ ] Cloudflare Proxy'yi ac (performance icin)
