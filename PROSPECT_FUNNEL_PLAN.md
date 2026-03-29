# VORTE STUDIO — PROSPECT FUNNEL SİSTEMİ
# Birleştirilmiş Final Plan
# PTT/kartpostal entegrasyonu YOK — A4 ev yazıcı sistemi VAR

---

## SİSTEM AKIŞI

```
Admin paneli → Prospect seç → A4 Mektup PDF + Adres Etiketi PDF indir
→ HP yazıcıda bas → Katlayıp zarfla → PTT şubesine götür (manuel)
→ Müşteri QR okuttu → Firmaya özel landing page açıldı
→ Demo site görüntülendi → Chatbot teklif bilgisi topladı
→ Admin panelinde brief hazır → Teklif PDF oluştur → Gönder
```

---

## SPRINT A: VERİTABANI

Prisma schema'ya ekle, migration çalıştır:

```prisma
model ProspectPage {
  id            String   @id @default(cuid())
  prospectId    String   @unique
  prospect      Prospect @relation(fields: [prospectId], references: [id])
  slug          String   @unique
  qrCode        String   // Base64 QR görsel
  qrScans       Int      @default(0)
  pageViews     Int      @default(0)
  demoViews     Int      @default(0)
  chatStarted   Boolean  @default(false)
  chatCompleted Boolean  @default(false)
  briefData     Json?    // Chatbot'tan toplanan veriler
  lastActivity  DateTime?
  createdAt     DateTime @default(now())

  events ProspectEvent[]
}

model ProspectEvent {
  id        String       @id @default(cuid())
  pageId    String
  page      ProspectPage @relation(fields: [pageId], references: [id])
  type      String       // QR_SCAN | PAGE_VIEW | DEMO_VIEW | CHAT_START | CHAT_COMPLETE | CTA_CLICK
  metadata  Json?        // cihaz, tarayıcı bilgisi
  createdAt DateTime     @default(now())
}

model PostalCampaign {
  id          String    @id @default(cuid())
  prospectId  String
  prospect    Prospect  @relation(fields: [prospectId], references: [id])
  status      String    @default("pending")
  // pending → printed → sent → scanned
  printedAt   DateTime?
  sentAt      DateTime?
  scannedAt   DateTime?
  createdAt   DateTime  @default(now())
}

model ServicePackage {
  id             String   @id @default(cuid())
  name           String
  infrastructure String   // HTML | PHP | NEXTJS | NEXTJS_PRISMA
  features       Json     // string[] özellikler listesi
  minPrice       Float
  maxPrice       Float
  deliveryDays   Int
  isActive       Boolean  @default(true)
  order          Int      @default(0)
  createdAt      DateTime @default(now())
}
```

```bash
npx prisma migrate dev --name prospect_funnel
```

---

## SPRINT B: YARDIMCI LİBRARYLER

```bash
npm install qrcode @types/qrcode jszip @types/jszip @google/generative-ai
```

**lib/qrcode.ts:**
```typescript
import QRCode from 'qrcode'

export async function generateQR(slug: string): Promise<string> {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/p/${slug}`
  return await QRCode.toDataURL(url, {
    width: 300,
    margin: 2,
    color: { dark: '#000000', light: '#FFFFFF' }
  })
}
```

**lib/slug.ts:**
```typescript
export function generateProspectSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 20)
  const random = Math.random().toString(36).slice(2, 7)
  return `${base}-${random}`
}
```

**lib/gemini.ts:**
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export function getGeminiModel() {
  return genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 500,
    }
  })
}
```

**ENV'e ekle (.env.local ve Coolify):**
```
GEMINI_API_KEY=AIzaSy...
```

---

## SPRINT C: A4 MEKTUP PDF

**app/admin/postal/letter-pdf.tsx**
@react-pdf/renderer ile A4 format (210x297mm)
Margin: 20mm (HP Smart 515 uyumlu)
Font: Helvetica (embed — tüm yazıcılarla uyumlu)

---

### MEKTUP BÖLÜM YAPISI (yukarıdan aşağıya):

**BÖLÜM 1 — HEADER**
Sol: VORTE STUDIO (#f97316, bold, 18pt) + "Web Tasarım & Mobil Uygulama" + studio.vorte.com.tr
Sağ: QR KOD (3x3cm — küçük, header'da referans)
Alt: 2pt turuncu yatay çizgi

---

**BÖLÜM 2 — FİRMAYA ÖZEL UYARI BANDI**
Turuncu sol kenarlıklı (4pt), açık turuncu arka plan kutu:
"⚠ [FİRMA ADI] YETKİLİSİNE ÖZEL — Dijital Analiz Raporu"

---

**BÖLÜM 3 — SELAMLAMA + GİRİŞ**
```
Sayın [FİRMA ADI] Yetkilisi,

[ŞEHİR]'deki [SEKTÖR] işletmeleri üzerine yaptığımız 
dijital analiz çalışmasında işletmenizi inceledik.
Bulgularımızı sizinle paylaşmak istedik.

Şu an binlerce müşteri internetten [SEKTÖR] arıyor —
ama sizi bulamıyor.
```
Firma adı: turuncu, bold.

---

**BÖLÜM 4 — DİJİTAL DURUM TESPİTLERİ**
Açık gri arka planlı kutu. Her satır: renkli nokta + açıklama.

Koşullu gösterim (prospect verisine göre):
- Kırmızı nokta: "Web sitesi yok — Müşteriler sizi Google'da bulamıyor"
- Kırmızı nokta: "SSL güvenlik sertifikası eksik"
- Sarı nokta: "Mobil uyumluluk sorunu — [SKOR]/100 puan"
- Yeşil nokta: "[X] Google yorumu — ★ [PUAN] puan (güçlü potansiyel!)"
- Son satır: "Dijital skor: [SKOR]/100"

---

**BÖLÜM 5 — KAYIP KUTUSU**
Açık kırmızı arka plan, kırmızı kenarlık:
"Tahmini aylık ulaşılamayan müşteri: ~[KAYIP] kişi
Bu kişiler sizi aradı, bulamadı, rakibinize gitti."

[KAYIP] hesaplama:
- googleReviews > 500 → "200-300"
- googleReviews > 100 → "80-120"
- googleReviews > 50  → "40-60"
- diğer               → "20-40"

---

**BÖLÜM 6 — "WEB SİTESİ OLURSA NE OLUR?" KUTUSU**
Açık mavi arka plan, mavi kenarlık, başlık koyu mavi:
"Web sitesi olan işletmeler ne kazanır?"

Madde madde (ok işareti ile):
→ Google'da üst sıralarda çıkar, rakiplerinden ayrışır
→ 7/24 açık — müşteri gece bile sizi bulabilir
→ Online sipariş, randevu veya bilgi formu alabilir
→ Kurumsal görünüm — müşteri güveni artar

---

**BÖLÜM 7 — QR OKUTMA TALİMATI (MERKEZ)**
Ortalanmış, kesik çizgili üst/alt kenarlık ile ayrılmış:

Üst metin (bold):
"İşletmenize özel hazırladığımız demo siteyi
ve ücretsiz dijital raporunuzu görmek için
QR kodu telefon kameranızla okutun:"

QR KOD: büyük, ortalanmış, 4x4cm
(Base64 olarak DB'den gelir)

Altında 3 adım (yatay sıralı):
"1. Kamerayı aç  |  2. QR'a tut  |  3. Çıkan bağlantıya dokun"

URL (turuncu, küçük):
studio.vorte.com.tr/p/[SLUG]

---

**BÖLÜM 8 — "AÇILAN SAYFADA SİZİ NELER BEKLİYOR?"**
Başlık: "Açılan sayfada sizi neler bekliyor?"
4 madde, numaralı turuncu daire ile:

1. İşletmenize özel hazırlanmış demo web sitesi —
   siteniz böyle görünebilir
2. Dijital analiz raporunuz — tam eksik listesi
   ve çözüm önerileri
3. Kısa bir sohbet — ihtiyaçlarınızı anlayalım
   (dijital asistanımız birkaç soru soracak)
4. Verdiğiniz bilgilere göre ücretsiz fiyat teklifi
   e-posta ile gönderilir

---

**BÖLÜM 9 — ÜCRETSİZ GÜVENCE KUTUSU**
Açık yeşil arka plan, yeşil kenarlık, ortalanmış:
"Bu analiz, demo site ve teklif tamamen ücretsizdir.
Herhangi bir ödeme veya taahhüt gerektirmez."

---

**BÖLÜM 10 — FOOTER**
İnce gri üst çizgi ile ayrılmış:
Sol: VORTE STUDIO (turuncu, bold)
Sağ: studio.vorte.com.tr | Web Tasarım & Mobil Uygulama

---

## SPRINT D: ADRES ETİKETİ PDF

**app/admin/postal/label-pdf.tsx**

A4'e 8 etiket (4 sütun x 2 satır)
Her etiket: ~95x52mm
Kesme çizgisi: 0.5pt gri border

```
┌─────────────────────────┐  ┌─────────────────────────┐
│                         │  │                         │
│  [FİRMA ADI]            │  │  [FİRMA ADI]            │
│  [ADRES]                │  │  [ADRES]                │
│  [İLÇE] / [ŞEHİR]      │  │  [İLÇE] / [ŞEHİR]      │
│                         │  │                         │
└─────────────────────────┘  └─────────────────────────┘
```

Toplu etiket: Seçilen tüm prospectlerin adresleri
tek A4'e sığdırılır (8 etiket/sayfa, gerekirse çok sayfa).

---

## SPRINT E: YAZDIR BUTONU — PROSPECT TABLOSUNDA

Her prospect satırına "🖨️ Yazdır" dropdown butonu:

```
├── 📄 Mektup PDF indir
├── 🏷️ Adres Etiketi indir  
└── 📦 İkisini birden indir (ZIP)
```

**Tekli indirme:**
→ Mektup PDF üret → tarayıcıda indir
→ PostalCampaign kaydı oluştur (status: 'printed', printedAt: now)

**ZIP indirme (jszip):**
→ Mektup PDF + Etiket PDF
→ tek ZIP dosyası → tarayıcıda indir

**Toplu yazdırma:**
Prospect listesinde checkbox seçimi.
Alt kısımda "Seçilenleri Yazdır" butonu:
→ Seçilen her prospect için mektup PDF
→ Tüm adresler tek etiket sayfasına (8'er adet/sayfa)
→ ZIP olarak indir

---

## SPRINT F: YAZDIR TAKİBİ

"Mektup PDF indir" → status: 'printed'
"Gönderildi İşaretle" butonu → status: 'sent', sentAt: now

Funnel sayfasında durumlar:
```
🖨️ Basıldı → 📮 Gönderildi → 📱 QR Okutuldu → 💬 Chat → ✅ Brief
```

---

## SPRINT G: FİRMAYA ÖZEL LANDING PAGE

**app/p/[slug]/page.tsx — PUBLIC (auth yok)**
```typescript
export const dynamic = 'force-dynamic'
```

Bu sayfa mektuptaki QR okutulduğunda açılır.
Tamamen firmaya özel, dinamik içerik.

**Sayfa bölümleri (sırayla):**

### 1. Başlık
```
VORTE STUDIO
[FİRMA ADI] için Dijital Analiz Raporu
```

### 2. Dijital Sağlık Durumu
Firmanın mevcut durumu:
- Web sitesi: Yok / Var (sorunlu) / Var (iyi)
- SSL: Yok / Var
- Google puanı: ★ [PUAN] ([X] yorum)
- Dijital skor: [SKOR]/100

### 3. "Web Sitesi Olursa / Olmazsa Ne Olur?" bölümü
İki sütun karşılaştırma:

```
SİTE OLMADAN               |  SİTE OLUNCA
─────────────────────────────────────────
Google'da görünmezsiniz    |  Müşteriler sizi bulur
Müşteri rakibe gider       |  7/24 açık mağaza
Güven sorunu yaşanır       |  Kurumsal görünüm
Fırsatlar kaçar            |  Online sipariş/randevu
```

### 4. Demo Sitesi Butonu
```
[👁️ İşletmenize Özel Demo Siteyi Görün]
→ /p/[slug]/demo adresine yönlendir
```

### 5. Teklif Al CTA
```
[💬 Ücretsiz Teklif Al]
→ Chatbot açılır (aynı sayfada modal)
```

**Tracking:**
Sayfa yüklenince → ProspectEvent (PAGE_VIEW) + pageViews++

---

## SPRINT H: SEKTÖRE ÖZEL DEMO SAYFASI

**app/p/[slug]/demo/page.tsx**

prospect.sector değerine göre demo tema:

```
'Restoran/Kafe'   → Menü + online sipariş + rezervasyon
'Diş Kliniği'    → Randevu formu + doktor profili + hizmetler
'Spor/Fitness'   → Program + üyelik + galeri
'Hukuk Bürosu'   → Uzman profili + hizmetler + iletişim
'Güzellik/SPA'   → Hizmetler + fiyatlar + galeri + randevu
'Fırın/Pastane'  → Ürünler + sipariş + konum
'Oto Servis'     → Hizmetler + fiyatlandırma + randevu
'Butik Otel'     → Odalar + rezervasyon + galeri
Diğer            → Genel kurumsal (hizmetler + iletişim + harita)
```

Her demo sayfasında:
- Firmanın gerçek adı, adresi, telefonu (scraper'dan gelen)
- Sektöre özel renk teması
- Google Maps embed (koordinatlar varsa)
- Sağ alt: "Bu sizin siteniz olabilirdi" watermark
- Alt CTA: "Bu siteyi istiyorum →"

Demo görüntülenince → ProspectEvent (DEMO_VIEW) + demoViews++

---

## SPRINT I: AI CHATBOT — GEMİNİ FLASH 2.5

Landing page'deki "Ücretsiz Teklif Al" butonuna
tıklanınca açılır (sayfa içi modal veya ayrı sayfa).

**app/p/[slug]/chat/page.tsx**

**lib/gemini.ts** (Sprint B'de oluşturuldu)

**Chatbot API route:**
**app/api/chat/route.ts** — Gemini'ye istek atar

**Anlık kayıt API:**
**app/api/chat/save/route.ts**
```typescript
POST /api/chat/save
body: { slug, step, answer, timestamp }
→ briefData JSON'ına ekler (merge)
→ ProspectPage günceller
```

---

### SYSTEM PROMPT (Gemini'ye verilecek):

```
Sen Vorte Studio web tasarım şirketinin dijital asistanısın.
Görevin: Potansiyel müşteriden web sitesi ihtiyaç bilgilerini
toplamak ve eksiksiz kaydetmek.

KESİN KURALLAR:
1. Sadece aşağıdaki soruları sor, sırasını asla bozma
2. Fiyat tahmini verme — paket fiyatları gösterilir, yorum yapma
3. Müşteri soru sorarsa: "Bu konuda ekibimiz size detaylı bilgi verecek"
4. Her cevabı ANLIK /api/chat/save'e kaydet
5. Asla kişi ismi kullanma (İbrahim, Ahmet vb. YOK)
6. Cevabı anlamadıysan bir kez daha sor, varsayım yapma
7. Konu dışı sorular: "Şu an bilgi topluyorum, ekibimiz yardımcı olacak"
8. Tüm veriler eksiksiz JSON formatında kaydedilmeli
9. Halüsinasyon riski: Fiyat, süre, özellik hakkında kesin ifade KULLANMA

Firma: {{FIRMA_ADI}}
Sektör: {{SEKTOR}}
```

---

### SORU AKIŞI (sıra değişmez):

**ADIM 0 — Karşılama:**
```
Merhaba! 👋

Size daha iyi hizmet verebilmek için birkaç kısa 
soru sormam gerekiyor.

Verdiğiniz bilgiler doğrultusunda ücretsiz bir 
teklif hazırlanacak. Hiçbir ödeme veya taahhüt 
söz konusu değil.

Başlayalım mı? 😊
```

**ADIM 1 — Tasarım tercihi:**
```
Web sitenizde nasıl bir görünüm hayal ediyorsunuz?

🎨 Modern ve sade
🏛️ Klasik ve kurumsal
🌈 Renkli ve dikkat çekici
💼 Profesyonel ama samimi

Seçmek zorunda değilsiniz — aklınızdaki 
bir site varsa örnek verebilirsiniz.
```

**ADIM 2 — Müşteri kitlesi:**
```
Müşterileriniz genellikle telefon mu kullanıyor, 
bilgisayar mı?

(Sitenizin hangi cihazda önce tasarlanacağını 
belirlemek için soruyorum)
```

**ADIM 3 — Fotoğraf / İçerik:**
```
Sitenizde kullanılacak fotoğraflarınız var mı?
Ürün, dükkan görseli, logo gibi...

Yoksa bu konuda da yardımcı olabiliriz.
```

**ADIM 4a — Domain (internet adresi):**
```
Şu an bir internet adresiniz var mı?
"firmanizin.com.tr" gibi bir adres?

Varsa ne olduğunu yazın, yoksa "yok" yazın.

💡 Bu adres (domain), farklı firmalardan 
yıllık ~200-500₺ karşılığında kiralanıyor.
Tıpkı işyeri kirası gibi — her yıl yenileniyor.
Biz siteyi yaparız, adres ayrı bir firma 
üzerinden alınır. İsterseniz bu konuda da 
yol gösteririz.
```

**ADIM 4b — Hosting (sunucu):**
```
Sitenizin internette yayınlanabilmesi için 
bir sunucu (hosting) alanı gerekiyor.

Bunu şöyle düşünebilirsiniz:
Siteniz bir dosya, hosting bu dosyanın 
saklandığı kiralık depo alanı.

Bu da yıllık ~500-2.000₺ arasında değişiyor 
ve her yıl yenileniyor.

Şu an böyle bir hizmetiniz var mı?
```

**ADIM 5 — Paket seçimi (DB'den dinamik):**
```
Web sitenizde hangi özellikler olmasını istersiniz?
Size seçenekleri açıklayayım:

[DB'deki aktif ServicePackage kayıtları listelenir]

Format:
━━━━━━━━━━━━━━━━━━━━━
📄 [PAKET ADI] ([ALTYAPI])
✓ [Özellik 1]
✓ [Özellik 2]
✓ Teslim: ~[SÜRE] gün
💰 [minPrice] - [maxPrice]₺
━━━━━━━━━━━━━━━━━━━━━

Hangisi ihtiyacınıza daha yakın?
```

**ADIM 6 — Sektöre özel:**
```
Restoran/Kafe:   "Online sipariş veya rezervasyon sistemi ister misiniz?"
Diş/Sağlık:     "Online randevu formu önemli mi?"
Hukuk:          "Kaç uzman profilini ekleyeceğiz?"
Spor/Fitness:   "Üyelik veya ders satışı olacak mı?"
Güzellik:       "Randevu sistemi ister misiniz?"
Fırın:          "Ürün kataloğu veya sipariş formu?"
Oto Servis:     "Online randevu veya fiyat listesi?"
Diğer:          "Müşterilerin sitede yapmasını istediğiniz özel bir işlem var mı?"
```

**ADIM 7 — E-posta:**
```
Hazırladığımız teklifi size göndermek için 
e-posta adresinizi paylaşır mısınız?

💡 Not: Teklifler bazen "Önemsiz/Spam" 
klasörüne düşebilir. Teklif gönderdikten 
sonra orayı da kontrol etmenizi öneririz.
```

**ADIM 8 — WhatsApp (opsiyonel):**
```
WhatsApp numaranızı da paylaşırsanız 
daha hızlı iletişim kurabiliriz.

(Zorunlu değil — atlamak için "gerek yok" yazın)
```

**ADIM 9 — Kapanış:**
```
Teşekkürler! 🙏

Bilgileriniz Vorte Studio ekibine iletildi.
En kısa sürede hazırlanan teklif size 
e-posta ile gönderilecek.

📧 Teklif gelince "Önemsiz/Junk" klasörünü 
de kontrol etmeyi unutmayın.

İyi günler dileriz! 😊
```

---

### VERİ KAYIT — KRİTİK:

Her adım sonrası ANLIK kayıt:
```typescript
await fetch('/api/chat/save', {
  method: 'POST',
  body: JSON.stringify({
    slug: '...',
    step: 'design_preference',
    answer: 'Modern ve sade',
    timestamp: new Date().toISOString()
  })
})
```

Tamamlanan konuşma final JSON (briefData):
```json
{
  "firma": "Tarihi Taş Fırın",
  "sehir": "Bursa",
  "sektor": "Fırın/Pastane",
  "tasarim_tercihi": "Modern ve sade",
  "musteri_cihaz": "Telefon ağırlıklı",
  "fotograf": "Yok, temin edilecek",
  "domain_var": false,
  "hosting_var": false,
  "secilen_paket": "Yönetim Panelli Site (PHP)",
  "ozel_ozellik": "Online sipariş formu",
  "email": "info@example.com",
  "whatsapp": "0532 XXX XX XX",
  "notlar": "",
  "tamamlanma": "2026-03-29T12:30:00Z"
}
```

Tamamlanınca:
→ ProspectPage.chatCompleted = true
→ ProspectPage.briefData = finalJSON
→ Dashboard'a bildirim: "Yeni brief: [FİRMA ADI]"

---

## SPRINT J: SERVİS PAKETLERİ YÖNETİMİ

**app/admin/packages/page.tsx**
Sidebar'a "📦 Paketler" ekle

CRUD sayfası:
- Paket adı
- Altyapı: HTML | PHP | Next.js | Next.js+Prisma
- Özellikler listesi (dinamik ekle/çıkar)
- Min fiyat / Max fiyat
- Teslim süresi (gün)
- Aktif/Pasif toggle
- Sıra numarası

Bu paketler chatbot ADIM 5'te dinamik olarak gösterilir.

**actions/packages.ts:**
createPackage, updatePackage, deletePackage, listPackages

---

## SPRINT K: FUNNEL TAKİP SAYFASI

**app/admin/funnel/page.tsx**
Sidebar'a "📮 Funnel" ekle

**Üst özet bar:**
```
🖨️ Basıldı: X  |  📮 Gönderildi: X  |  📱 QR Scan: X  
👁️ Demo: X  |  💬 Chat: X  |  ✅ Brief: X

Dönüşüm: Gönderildi → Brief = %XX
```

**Firma listesi — her satır:**
- Firma adı + sektör + şehir
- Son aktivite tarihi ve türü
- Aşama göstergesi (renkli):
  ```
  🖨️ Basıldı → 📮 Gönderildi → 📱 Scan → 👁️ Demo → 💬 Chat → ✅ Brief
  ```
- "Brief Gör" butonu (chatCompleted ise aktif)
- "Teklif Oluştur" butonu

**Brief modal içeriği:**
```
Firma         : [firma]
Şehir         : [sehir]
Sektör        : [sektor]
Tasarım       : [tasarim_tercihi]
Cihaz         : [musteri_cihaz]
Fotoğraf      : [fotograf]
Domain        : [domain_var]
Hosting       : [hosting_var]
Seçilen paket : [secilen_paket]
Özel özellik  : [ozel_ozellik]
E-posta       : [email]
WhatsApp      : [whatsapp]
Tamamlandı    : [tamamlanma]

[📄 PDF Teklif Oluştur] butonu
```

---

## SPRINT L: YAZDIRMA BUTONU — PROSPECT TABLOSUNDA

Prospect tablosunda her satıra "🖨️ Yazdır" dropdown:

```
├── 📄 Mektup PDF indir
├── 🏷️ Adres Etiketi indir
└── 📦 İkisini birden indir (ZIP — jszip)
```

**Tek indirme akışı:**
1. Slug yoksa oluştur (generateProspectSlug)
2. QR kod oluştur (generateQR)
3. ProspectPage DB'ye kaydet
4. PDF render et
5. İndir
6. PostalCampaign oluştur (status: 'printed')

**Toplu yazdırma:**
Prospect listesinde checkbox seçimi.
"Seçilenleri Yazdır" butonu:
→ N adet mektup PDF
→ Tüm adresler birleşik etiket sayfası (8/A4)
→ ZIP olarak indir

**"Gönderildi İşaretle" butonu:**
→ PostalCampaign.status = 'sent'
→ sentAt = now

---

## ENV DEĞİŞKENLERİ

**.env.local ve Coolify'a ekle:**
```
GEMINI_API_KEY=AIzaSy...
```

**.env.example güncelle.**

---

## DOĞRULAMA LİSTESİ

**Paketler:**
- [ ] Paketler sayfası açılıyor
- [ ] Yeni paket ekle → kaydet → listede görünüyor
- [ ] Pasif yap → chatbot'ta görünmüyor

**A4 Yazdırma:**
- [ ] Prospect → "Mektup PDF indir" → A4 PDF iniyor
- [ ] PDF içinde firma adı, QR kod, sorunlar doğru
- [ ] "Adres Etiketi indir" → A4'te 8 etiket var
- [ ] 3 prospect seç → "Toplu Yazdır" → ZIP iniyor
- [ ] ZIP: 3 mektup + 1 etiket sayfası
- [ ] PostalCampaign "printed" kaydı oluştu
- [ ] "Gönderildi İşaretle" → status "sent" oldu

**Landing Page:**
- [ ] /p/[slug] açılıyor (public, auth yok)
- [ ] Firma adı, skor, sorunlar doğru gösteriliyor
- [ ] "Site olursa / olmazsa" karşılaştırma bölümü var
- [ ] "Demo Siteyi Gör" butonu çalışıyor
- [ ] QR okutulunca PAGE_VIEW kaydediliyor

**Demo Sayfası:**
- [ ] /p/[slug]/demo açılıyor
- [ ] Sektöre göre farklı tema
- [ ] Firmanın gerçek adı, adresi, telefonu var
- [ ] "Bu sizin siteniz olabilirdi" watermark var
- [ ] DEMO_VIEW kaydediliyor

**Chatbot:**
- [ ] "Teklif Al" → chatbot açılıyor
- [ ] İlk mesaj doğru (ücretsiz teklif vurgusu var)
- [ ] Sorular sırayla geliyor, sıra bozulmuyor
- [ ] Her cevap anında /api/chat/save'e kaydediliyor
- [ ] Domain/hosting soruları sade dilde
- [ ] Paket seçimi DB'deki aktif paketleri gösteriyor
- [ ] Kapanış mesajında kişi ismi YOK, "Vorte Studio" var
- [ ] Junk mail uyarısı var
- [ ] Chat tamamlanınca briefData DB'ye yazıldı

**Funnel Takip:**
- [ ] Funnel sayfası özet bar gösteriyor
- [ ] Her firma doğru aşamada görünüyor
- [ ] "Brief Gör" → tüm veriler modal'da
- [ ] "Teklif Oluştur" butonu çalışıyor

**Push + redeploy.**
