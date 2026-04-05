# VORTE STUDIO — Gelistirme Plani

> Bu plan her modul sonrasi commit + push + canli test + onay ile ilerler.
> Bir modul bitmeden digerine gecilmez.

---

## Durum Isaretleri

- [ ] Yapilmadi
- [x] Tamamlandi
- [~] Devam ediyor

---

## MODUL 1: Chatbot Derinlestirme (Onboarding Sorulari)

**Amac:** Musteriden daha detayli bilgi topla — AI prompt kalitesini artir.

### Gorevler

- [x] 1.1 Chatbot'a "Is hedefleri / site amaci" sorusu ekle (site turundan sonra)
- [x] 1.2 "Hedef kitle tanimi" adimi ekle (metin girisi)
- [x] 1.3 "Begenilen referans siteler" adimi ekle (URL girisi, 1-3 site)
- [x] 1.4 "Marka renkleri / stil tercihi" adimi ekle (renk secici veya metin)
- [x] 1.5 "SEO beklentileri" adimi ekle (coktan secmeli)
- [x] 1.6 Yeni alanlari ChatSubmission modeline ekle (Prisma schema)
- [x] 1.7 chat-submit API'yi guncelle (yeni alanlar)
- [x] 1.8 Admin basvuru detayinda yeni alanlari goster
- [x] 1.9 TypeScript kontrol — sifir hata
- [x] 1.10 Build test — basarili
- [x] 1.11 Commit + Push (b1628ab)
- [x] 1.12 Canli test — chatbot akisi kontrol
- [x] 1.13 **ONAY** ✅

---

## MODUL 2: AI Prompt Olusturucu (Claude Code Icin)

**Amac:** Musteri bilgilerinden mukemmel Claude Code prompt'u uret.
**Kural:** Tum bilgiler tamamlanmadan prompt olusturma YASAK.

### Gorevler

- [x] 2.1 Bilgi tamamlanma kontrolu tasarla (hangi alanlar zorunlu?)
- [x] 2.2 AI prompt sablonu olustur (sektor, ozellikler, renkler, hedef kitle, referanslar, logo, SEO)
- [x] 2.3 Admin panelde "AI Prompt Olustur" butonunu guncelle
- [x] 2.4 Prompt onizleme ve kopyalama UI
- [x] 2.5 Eksik bilgi uyarisi — "Su bilgiler eksik, prompt olusturulamaz" mesaji
- [x] 2.6 Lead pipeline'da bilgi toplama sureci kontrolu
- [x] 2.7 TypeScript kontrol — sifir hata
- [x] 2.8 Build test — basarili
- [x] 2.9 Commit + Push (148f7d4 + önceki 3 commit)
- [x] 2.10 Canli test — prompt kalitesi kontrol ✅
- [x] 2.11 **ONAY** ✅

---

## MODUL 3: Teklif Sayfasi Zenginlestirme

**Amac:** Musteri "ne alacagini" anlasin — sadece fiyat degil, cozum gorsun.

### Gorevler

- [x] 3.1 Renk paleti onizleme bolumu ekle (hex renk secici + teklif sayfasinda gosterim)
- [x] 3.2 Problem → Cozum hikayesi bolumu (sektor bilgisine gore otomatik metin + web artilari)
- [x] 3.3 Referans projeler bolumu (portfolyoden benzer sektor projeleri — kosullu gosterim)
- [x] 3.4 3 Paket secenegi gosterimi (Baslangic %70 / Profesyonel %100 / Kurumsal %150)
- [x] 3.5 Surec aciklamasi bolumu ("4 adimda siteniz hazir" + timeline'a gore hafta dagilimi)
- [x] 3.6 Mobil uyumluluk kontrolu
- [x] 3.7 TypeScript kontrol — sifir hata
- [x] 3.8 Build test — basarili
- [x] 3.9 Commit + Push (a17a120 + onceki 3 commit)
- [x] 3.10 Canli test — teklif sayfasi kontrol ✅
- [x] 3.11 **ONAY** ✅

---

## MODUL 4: Anasayfa Paket & Fiyatlandirma

**Amac:** 4 paket karti anasayfada gorunsun ('den baslayan fiyatlarla).

### Gorevler

- [x] 4.1 4 paket tanimla (Baslangic 14.990 / Profesyonel 29.990 / E-Ticaret 89.990 / Kurumsal B2B 139.990)
- [x] 4.2 Paket kartlari komponenti olustur (#080808 bg + #FF4500 accent + 21st MCP)
- [x] 4.3 Anasayfaya paket bolumu ekle (Services altina)
- [x] 4.4 Navbar'a Fiyatlandirma linki ekle
- [x] 4.5 Build test — basarili
- [x] 4.6 Commit + Push (81c2fa9)
- [x] 4.7 Canli test — anasayfa kontrol ✅
- [x] 4.8 **ONAY** ✅

---

## MODUL 5: Musteri Portali

**Amac:** Sozlesme sonrasi tum iletisim tek sayfadan.

### Gorevler

#### 5A — Giris Sistemi
- [x] 5.1 Musteri kullanici modeli (Prisma — PortalUser, PortalMessage, PortalFile)
- [x] 5.2 Sozlesme imzalandiginda otomatik hesap olustur (createPortalAccount)
- [x] 5.3 Giris bilgilerini mail ile gonder (sendPortalCredentials)
- [x] 5.4 Login sayfasi (/portal/giris) + dual NextAuth provider (admin + portal)
- [x] 5.5 Auth middleware — proxy.ts portal korumasi + JWT role-based auth

#### 5B — Portal Dashboard
- [x] 5.6 Dashboard sayfasi — 4 ozet karti (proje durumu, sozlesme, odeme, mesajlar)
- [x] 5.7 Odeme plani listesi + ilerleme cubugu
- [x] 5.8 Son mesajlar onizleme

#### 5C — Dosya Yukleme
- [x] 5.9 Musteriye ozel dizin yapisi (uploads/portal/[userId]/)
- [x] 5.10 10MB siniri kontrolu (API route)
- [x] 5.11 Dosya yukleme UI (portal/dosyalar sayfasi)
- [x] 5.12 Admin panelden musteri dosyalarini goruntuleme (portal detail tabs)

#### 5D — Sozlesme & Odeme
- [x] 5.13 Sozlesme durumu goruntuleme (portal/sozlesme sayfasi)
- [x] 5.14 Proje ozeti (tur, sure, tutar, baslangic tarihi)
- [x] 5.15 Odeme plani adimli gosterim + progress bar

#### 5E — Mesajlasma
- [x] 5.16 Proje bazli mesaj modeli (PortalMessage — Prisma)
- [x] 5.17 Musteri mesaj yazma UI (PortalChat — 5sn polling, auto-scroll)
- [x] 5.18 Admin panelde mesaj goruntuleme ve yanit (AdminPortalDetail)
- [x] 5.19 Okunmamis mesaj badge + admin sidebar portal linki

#### 5F — Admin Portal Yonetimi
- [x] 5.20 Admin portal liste sayfasi (musteri kartlari, arama, okunmamis badge)
- [x] 5.21 Admin portal detay sayfasi (3 tab: mesajlar, dosyalar, odemeler)
- [x] 5.22 Admin sidebar'a Portal nav item eklendi

#### 5G — Test ve Deploy
- [x] 5.23 TypeScript kontrol — sifir hata
- [x] 5.24 Build test — basarili
- [x] 5.25 Commit + Push (70ea16c, d374bdb, 2730cee)
- [x] 5.26 Canli test — portal akisi kontrol (tum sayfalar test edildi)
- [x] 5.27 **ONAY** ✅

---

## MODUL 6: Logo & Marka Kimligi (Gemini Nano Banana 2)

**Amac:** "Logom yok" diyen musteriye AI logo uretimi + onay sistemi.
**Model:** Gemini Nano Banana 2 (Turkce karakter destegi + pro gorsel uretim)

### Gorevler

- [x] 6.1 Logo uretim API endpoint (Gemini Nano Banana 2 entegrasyonu)
- [x] 6.2 Logo prompt sablonu (firma adi, sektor, renk paleti, stil)
- [x] 6.3 3-5 alternatif logo uretimi (tek tek)
- [x] 6.4 Musteri portalinda logo sunumu (galeri gorunumu)
- [x] 6.5 Musteri geri bildirim yazma (revizyon istegi)
- [x] 6.6 Revizyon — prompt guncelleme + yeniden uretim
- [x] 6.7 Musteri onay butonu (onaylanan logo siteye uygun formatta kaydedilir)
- [x] 6.8 Marka kiti olusturma (renk paleti + font + kullanim kilavuzu)
- [x] 6.9 Marka kiti bilgilerini AI prompt'a entegre etme
- [x] 6.10 Admin panelde logo/marka yonetimi
- [x] 6.11 TypeScript kontrol — sifir hata
- [x] 6.12 Build test — basarili
- [x] 6.13 Commit + Push (4cb58f2)
- [x] 6.14 Canli test — admin/logo + portal/logo sayfalari calisıyor
- [x] 6.15 **ONAY** ✅

---

## MODUL 7: Raporlama Dashboard + WhatsApp API

**Amac:** Is takibi ve otomatik iletisim.

### Gorevler

#### 7A — Raporlama Dashboard
- [ ] 7.1 Aylik/yillik gelir grafikleri (21st MCP ile)
- [ ] 7.2 Proje metrikleri (ortalama sure, karlilik)
- [ ] 7.3 Musteri memnuniyet takibi
- [ ] 7.4 Pipeline donusum oranlari

#### 7B — WhatsApp Business API
- [ ] 7.5 WhatsApp Business API arastirma ve basvuru
- [ ] 7.6 API entegrasyonu (mesaj gonderim altyapisi)
- [ ] 7.7 Otomatik mesaj sablonlari:
  - [ ] Teklif gonderildi
  - [ ] Sozlesme imzalandi
  - [ ] Odeme bekleniyor
  - [ ] Revizyon tamamlandi
  - [ ] Proje asamasi degisti
- [ ] 7.8 Admin panelde WhatsApp mesaj gecmisi

#### 7C — Test ve Deploy
- [ ] 7.9 TypeScript kontrol — sifir hata
- [ ] 7.10 Build test — basarili
- [ ] 7.11 Commit + Push
- [ ] 7.12 Canli test — raporlama + WhatsApp
- [ ] 7.13 **ONAY**

---

## YAPILMAYACAKLAR (Karar Verildi)

| Ozellik | Neden |
|---------|-------|
| Mockup gonderimi (kartvizit, tabela) | Matbaa isi, bizim isimiz degil |
| Randevu/Gorusme takvimi | Yazili iletisim daha saglıklı ve kanitli |
| Fatura sistemi | DIA CRM API sonrasi yapilacak |
| Online odeme (Iyzico) | Iyzico ile gorusme sonrasi |
| AI ile otomatik site uretimi | Claude Code yapacak, Vorte Studio sadece prompt uretecek |

---

## SONRASI YAPILACAKLAR (Beklemede)

| Ozellik | Bagli Oldugu |
|---------|-------------|
| Fatura & Finans yonetimi | DIA CRM API |
| Iyzico odeme entegrasyonu | Iyzico basvurusu |
| Gelismis WhatsApp sablonlari | WhatsApp API onayi |

---

## KURALLAR

1. **Her modul sonrasi:** TypeScript kontrol → Build test → Commit + Push → Canli test → ONAY
2. **Onay olmadan** sonraki module gecilmez
3. **Tum UI metinleri** Turkce karakter icermeli (s, c, o, u, g, i, I)
4. **21st MCP** tum yeni UI bilesenlerinde kullanilacak
5. **Prisma degisiklikleri** try/catch + dynamic = force-dynamic kurali gecerli
6. **Slug/dosya adlarinda** Turkce karakter YASAK (sadece a-z/0-9/tire)
