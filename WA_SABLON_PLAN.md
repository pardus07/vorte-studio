# VORTE STUDIO — 107 SEKTÖRE ÖZEL WA ŞABLON SAYFALARI
# Kapsamlı Uygulama Planı

---

## MİMARİ

Her şablon = `/p/[slug]` route'unda açılan Next.js sayfası.
Firma bilgileri slug üzerinden DB'den çekilir, şablon dinamik dolar.

```
app/p/[slug]/page.tsx          ← Ana landing page (sektöre göre şablon seçilir)
app/p/[slug]/demo/page.tsx     ← Demo site önizlemesi
app/p/[slug]/chat/page.tsx     ← Chatbot sayfası
lib/templates/[sektor-slug].tsx ← Her sektör için şablon komponenti
```

---

## HER ŞABLONDA ZORUNLU BÖLÜMLER

```
1. HERO          — Firma adı + güçlü başlık + sektöre özel görsel atmosfer
2. ALARM         — "Şu an kaybettikleriniz" (somut, sektöre özel rakamlar)
3. KARŞILAŞTIRMA — Site olursa / olmazsa (2 sütun)
4. DEMO CTA      — "İşletmenize özel demo siteyi görün"
5. CHATBOT CTA   — "Ücretsiz teklif al" (büyük, dikkat çekici)
6. GÜVENCE       — Ücretsiz, taahhütsüz notu
7. FOOTER        — Vorte Studio imzası
```

---

## KULLANILACAK SKİLLLER (Her şablonda)

| Skill | Kullanım Amacı |
|---|---|
| `frontend-design` | Premium görsel tasarım, animasyon, bold estetik |
| `ui-ux-pro-max` | Renk paleti seçimi, tipografi, UX kuralları |
| `landing-page` | Sayfa yapısı, bölüm sırası, responsive |
| `tailwind-theme-builder` | Her şablon için Tailwind v4 tema |
| `color-palette` | Sektöre özel renk skalası |
| `page-cro` | CTA optimizasyonu, trust signal, dönüşüm |
| `copywriting` | İkna edici Türkçe metinler, başlıklar |
| `vorte-nextjs-stack` | Next.js App Router, dynamic route |
| `vorte-seo-aeo-geo` | SEO meta, schema.org LocalBusiness |
| `ileri-kodlama-standartlari` | Kod kalitesi, TypeScript |

---

## SPRINT PLANI

Her sprint = 7-8 şablon. Toplam 14 sprint.
Her sprint sonunda test + push + redeploy.

---

### SPRINT 1 — SAĞLIK & KLİNİK (1/3)

**Ekstra skill:** `ui-ux-pro-max` (steril/medikal renk sistemleri)

#### Şablon 1: Diş Klinikleri
```
Renk: Beyaz baskın + #0EA5E9 (güven mavisi) + #10B981 aksent
Font: Outfit (başlık) + DM Sans (gövde)
Estetik: Steril, ferah, modern klinik
Hero: "Antalya'nın en çok tercih edilen diş kliniği olmak bir adım uzağınızda"
Alarm: "Her gün ~60 kişi 'diş kliniği Antalya' arıyor. Web siteniz yoksa onları göremiyorsunuz."
Özel: Randevu formu CTA, doktor profili vurgusu
Animasyon: Sayaç (aranan kişi sayısı), fade-in bölümler
```

#### Şablon 2: Veteriner Klinikleri
```
Renk: #10B981 (doğal yeşil) + krem + kahve aksent
Font: Nunito (sıcak, yuvarlak) + Inter
Estetik: Sıcak, güven verici, hayvan dostu
Hero: "[FİRMA ADI] — [ŞEHİR]'in güvenilir veteriner kliniği"
Alarm: "Evcil hayvanı hasta olan sahipler acil vet arıyor. Bulamazlarsa rakibinize gidiyorlar."
Özel: Acil hizmet vurgusu, fotoğraf galerisi alanı
```

#### Şablon 3: Optik / Gözlükçü
```
Renk: #1E40AF (lacivert) + altın aksent + beyaz
Font: Playfair Display (başlık) + Source Sans Pro
Estetik: Şık, optik mağaza, premium
Hero: "Gözleriniz en iyi gözlüğü hak ediyor"
Alarm: "Gözlük arayan müşteriler önce Google'a bakıyor. Sizi bulamazlarsa rakibinizi buluyorlar."
Özel: Marka logoları grid, çerçeve koleksiyonu vurgusu
```

#### Şablon 4: Fizik Tedavi Merkezleri
```
Renk: #0F766E (teal) + açık gri + beyaz
Font: DM Sans (başlık) + Lato
Estetik: Sağlıklı, hareket, iyileşme
Hero: "Ağrılarınızdan kurtulmanın yolu [FİRMA ADI]'dan geçiyor"
Alarm: "Sırt-bel ağrısı çeken hastalar online randevu arıyor. Web siteniz yok — onları kaybediyorsunuz."
Özel: Uzman fizyoterapist profili, randevu CTA
```

#### Şablon 5: Tıp Merkezleri + Özel Poliklinik
```
Renk: #1D4ED8 (kurumsal mavi) + beyaz + açık gri
Font: Inter (başlık, bold) + Inter (gövde)
Estetik: Kurumsal, güvenilir, medikal
Hero: "Sağlığınız için doğru adres: [FİRMA ADI]"
Alarm: "Uzman hekim arayan hastalar online randevu bekliyor. Sisteminiz yoksa kaybediyorsunuz."
Özel: Branş listesi, doktor profilleri, akreditasyon vurgusu
```

#### Şablon 6: Estetik Klinik
```
Renk: #F8F5F0 (krem) + #C9A96E (altın) + siyah
Font: Cormorant Garamond (başlık) + Jost
Estetik: Lüks, premium, minimalist
Hero: "Güzelliğinizi en değerli ellere emanet edin"
Alarm: "Estetik işlem araştıran kişiler %78'i online araştırma yapıyor. Sizi bulamazlarsa güvenemiyorlar."
Özel: Before/after alanı, sertifikasyon vurgusu, gizlilik güvencesi
```

#### Şablon 7: Psikolog / Danışman
```
Renk: #DDD6FE (lavanta) + #6D28D9 (mor) + beyaz
Font: Crimson Pro (başlık) + Hind
Estetik: Huzurlu, güvenli, gizli
Hero: "İyi hissetmek bir seçim — doğru desteği almak da"
Alarm: "Psikolojik destek arayanlar %90'ı online araştırıyor. Bulamazlarsa güvenmedikleri birine gidiyorlar."
Özel: Gizlilik vurgusu güçlü, online seans seçeneği, ilk seans ücretsiz CTA
```

#### Şablon 8: Diyetisyen / Beslenme Uzmanı
```
Renk: #84CC16 (canlı yeşil) + krem + kahverengi
Font: Quicksand (başlık) + Mulish
Estetik: Sağlıklı, taze, motive edici
Hero: "Hedef kilonuza giden yol [FİRMA ADI]'dan geçiyor"
Alarm: "Diyet programı arayanlar online danışman arıyor. Web siteniz yoksa sizi bulamıyorlar."
Özel: Başarı hikayeleri alanı, program paketleri, online danışmanlık CTA
```

---

### SPRINT 2 — SAĞLIK & KLİNİK (2/3) + GÜZELLIK (1/2)

#### Şablon 9: İşitme Merkezi
```
Renk: #0369A1 (güven mavisi) + turuncu aksent + beyaz
Font: Poppins + Open Sans
Estetik: Teknoloji + bakım, güven verici
Hero: "Duymak bir hak — doğru cihazla hayat değişiyor"
Alarm: "İşitme cihazı araştıranlar önce online bilgi topluyor. Sizi bulamazlarsa rakibinizin bilgisine güveniyorlar."
Özel: Ücretsiz test CTA, cihaz markaları, teknik vurgu
```

#### Şablon 10: Göz Merkezi
```
Renk: #0C4A6E (derin mavi) + altın + beyaz
Font: Raleway (başlık) + Lato
Estetik: Hassas, teknoloji, güven
Hero: "Görüşünüz değerli — onu en iyi ellere bırakın"
Alarm: "Lazer tedavisi merak edenler %85'i online araştırıyor. Bulamazlarsa güvenilir bulmuyorlar."
Özel: Teknoloji vurgusu, doktor deneyimi, ücretsiz muayene CTA
```

#### Şablon 11: Kuaförler
```
Renk: #1C1917 (derin siyah) + #F59E0B (altın) + krem
Font: Tenor Sans (başlık) + Karla
Estetik: Modern salon, şık, lifestyle
Hero: "[FİRMA ADI] — Saçınız sizin en güzel aksesuarınız"
Alarm: "Yeni saç modeli arayanlar önce Instagram'a, sonra Google'a bakıyor. Sizi bulamazlarsa rakibinizi buluyorlar."
Özel: Galeri odaklı tasarım, randevu al CTA, stil danışmanlığı vurgusu
```

#### Şablon 12: Berberler
```
Renk: #292524 (koyu) + #DC2626 (kırmızı) + krem
Font: Bebas Neue (başlık) + Source Sans Pro
Estetik: Klasik berber, retro-modern, erkeksi
Hero: "Gerçek bir tıraşın adresi: [FİRMA ADI]"
Alarm: "Erkekler berber ararken Google Maps'e bakıyor. Profiliniz eksik — müşteri kaçıyor."
Özel: Hizmet listesi (tıraş, sakal, cilt bakımı), fiyat şeffaflığı
```

#### Şablon 13: Güzellik / SPA
```
Renk: #FDF2F8 (pudra) + #BE185D (gül) + altın
Font: Playfair Display (başlık) + Jost
Estetik: Lüks SPA, feminen, sakin
Hero: "Kendinize zaman ayırın — [FİRMA ADI] sizi dinlendiriyor"
Alarm: "SPA randevusu arayanlar önce online inceliyor. Web siteniz yoksa sizi 'amatör' sanıyorlar."
Özel: Hizmet menüsü, online rezervasyon, paket fiyatlar
```

#### Şablon 14: Cilt Bakım Merkezleri
```
Renk: #FEF9F0 (krem) + #92400E (kahve tonu) + yeşil
Font: Gilda Display (başlık) + Hind Siliguri
Estetik: Doğal, organik, güvenilir dermatoloji
Hero: "Cildiniz için doğru bakım, doğru uzman"
Alarm: "Cilt sorunu yaşayanlar online uzman arıyor. Bulamazlarsa yanlış ürün alıyorlar."
Özel: Cilt tipi analizi CTA, ürün/hizmet kombine sunumu
```

#### Şablon 15: Epilasyon Merkezleri
```
Renk: #FAFAF9 + #14B8A6 (modern teal) + altın
Font: Raleway (başlık) + Nunito
Estetik: Hijyen, modern, femin
Hero: "Kalıcı sonuçlar için doğru adres"
Alarm: "Epilasyon araştıranlar fiyat karşılaştırıyor. Web siteniz yoksa fiyatlandırmanıza güvenemiyorlar."
Özel: Teknoloji vurgusu (lazer, IPL), seans paketi fiyatları
```

#### Şablon 16: Tırnak Stüdyosu
```
Renk: #FF6B9D (pembe) + siyah + krem
Font: Montserrat (başlık) + Nunito
Estetik: Instagram-native, trendy, renkli
Hero: "Her tırnak bir sanat eseri"
Alarm: "Nail art arayanlar %95'i görsel platformlarda geziyor. Instagram'ı web sitenizle desteklemelisiniz."
Özel: Galeri ağırlıklı, fiyat listesi, randevu CTA
```

---

### SPRINT 3 — GÜZELLIK (2/2) + YEME-İÇME

#### Şablon 17: Dövme & Piercing Stüdyosu
```
Renk: #0A0A0A (siyah) + #FF3D00 (ateş) + beyaz
Font: Barlow Condensed (başlık) + Barlow
Estetik: Underground, sanatsal, cesur
Hero: "Sanatınızı taşıyın — kalıcı, özgün, sizin"
Alarm: "Dövme yaptıracaklar ustanın portfolyosunu önce online inceliyor. Portfolyonuz yoksa iş almıyorsunuz."
Özel: Portfolyo galerisi, sanatçı profilleri, sterilizasyon vurgusu
```

#### Şablon 18: Restoranlar
```
Renk: #1C1917 (derin) + #D97706 (sıcak turuncu) + krem
Font: Cormorant Garamond (başlık) + DM Sans
Estetik: Sofistike restoran, lüks yemek deneyimi
Hero: "Her çatalda bir hikaye — [FİRMA ADI]"
Alarm: "Yemek arayanlar Google'da restoran arıyor. Menünüz online değilse müşteri rakibinize gidiyor."
Özel: Menü önizleme, rezervasyon CTA, mutfak hikayesi
```

#### Şablon 19: Kafeler
```
Renk: #78350F (kahve) + #FEF3C7 (krem) + yeşil
Font: Reenie Beanie veya Pacifico (başlık) + Nunito
Estetik: Sıcak, huzurlu, ev gibi kafe
Hero: "En güzel molalar [FİRMA ADI]'nda verilir"
Alarm: "Sabah kahve yeri arayanlar Maps'te açık olan kafei arıyor. Saatleriniz güncel değilse kaybediyorsunuz."
Özel: Çalışma saatleri vurgusu, özel içecekler, atmosfer görselleri
```

#### Şablon 20: Pastaneler
```
Renk: #FCE7F3 (pudra pembe) + #9D174D (koyu gül) + altın
Font: Dancing Script (başlık) + Lato
Estetik: El yapımı, artisanal, tatlı
Hero: "Özel günleriniz için el yapımı lezzetler"
Alarm: "Doğum günü pastası arayanlar önce görsel inceliyor. Instagram'ınız varsa ama web siteniz yoksa güvenemiyorlar."
Özel: Sipariş formu CTA, özel tasarım pasta, galeri
```

#### Şablon 21: Fırınlar
```
Renk: #92400E (ekmek kahvesi) + #FDE68A (buğday sarısı) + beyaz
Font: Lora (başlık) + Source Sans Pro
Estetik: Geleneksel, sıcak, el emeği, otantik
Hero: "Her sabah taze, her ısırıkta [FİRMA ADI] farkı"
Alarm: "Sabah fırın arayanlar Google Maps'e bakıyor. Çalışma saatiniz, adresiniz, menünüz online değilse müşteri rakibinize gidiyor."
Özel: Ürün listesi (ekmek çeşitleri), çalışma saatleri büyük, konum embed
```

#### Şablon 22: Catering / Yemek Servisi
```
Renk: #1E3A5F (lacivert) + #F59E0B + beyaz
Font: Raleway (başlık) + Open Sans
Estetik: Kurumsal, organizasyon, profesyonel
Hero: "Kurumsal etkinlikleriniz için lezzetli çözümler"
Alarm: "Şirket yemeği organize edenler online teklif alıyor. Web siteniz yoksa teklife dahil edilmiyorsunuz."
Özel: Kapasite bilgisi, menü paketleri, referans şirketler, teklif formu CTA
```

#### Şablon 23: Kasaplar
```
Renk: #7F1D1D (koyu kırmızı) + krem + yeşil
Font: Oswald (başlık) + Source Sans Pro
Estetik: Güçlü, güven, kalite et
Hero: "Taze et, güvenilir kaynak — [FİRMA ADI]"
Alarm: "Kaliteli kasap arayanlar artık önce online inceliyor. Web siteniz yoksa 'güvenilir mi?' sorusu yanıtsız kalıyor."
Özel: Menşei vurgusu, ürün listesi, sipariş/teslimat seçeneği
```

---

### SPRINT 4 — GIDA PERAKENDEv + KONAKLAMA & EĞİTİM

#### Şablon 24: Manavlar
```
Renk: #15803D (taze yeşil) + turuncu + krem
Font: Nunito (başlık) + Open Sans
Estetik: Taze, organik, pazar yeri enerjisi
Hero: "Her gün taze — toprağından sofranıza"
Alarm: "Organik ürün arayanlar online manav arıyor. Web siteniz yoksa sizi bulamıyorlar."
Özel: Günlük taze ürün vurgusu, sipariş/teslimat CTA
```

#### Şablon 25: Kuruyemişçiler
```
Renk: #713F12 (fındık) + altın + krem
Font: Playfair Display (başlık) + Lato
Estetik: Doğal, sıcak, lezzetli
Hero: "En taze kuruyemiş, en iyi fiyat — [FİRMA ADI]"
Alarm: "Toplu kuruyemiş siparişi verenler online fiyat araştırıyor. Web siteniz yoksa rakibinizden sipariş veriyorlar."
Özel: Toptan/perakende seçenekleri, ürün çeşitliliği
```

#### Şablon 26: Şarküteri / Delikatessen
```
Renk: #1C1917 + #F59E0B + kırmızı
Font: Libre Baskerville (başlık) + Karla
Estetik: Gurme, premium, ithal ürün
Hero: "Gurme lezzetler kapınıza geliyor"
Alarm: "İthal ürün arayanlar önce online buluyor. Web siteniz yoksa sizi bulamıyorlar."
Özel: Ürün kategorileri, teslimat bilgisi, sipariş CTA
```

#### Şablon 27: Su Bayileri
```
Renk: #0EA5E9 (su mavisi) + beyaz + açık mavi
Font: Poppins (başlık) + Inter
Estetik: Temiz, hijyen, güven
Hero: "Temiz su, güvenilir teslimat — [FİRMA ADI]"
Alarm: "Abonelik suyu arayanlar online sipariş veriyor. Web siteniz yoksa aramadan çıkıyorsunuz."
Özel: Abonelik planları, teslimat bölgesi, online sipariş
```

#### Şablon 28: Oteller
```
Renk: #0F172A (derin lacivert) + #D4AF37 (otel altını) + krem
Font: Cormorant Garamond (başlık) + Raleway
Estetik: Lüks otel, seyahat, davet edici
Hero: "[FİRMA ADI] — [ŞEHİR]'in kalbinde huzur ve konfor"
Alarm: "Otel arayanlar %93'ü booking.com'dan önce Google'da arıyor. Kendi siteniz yoksa aracıya komisyon ödüyorsunuz."
Özel: Doğrudan rezervasyon CTA (komisyonsuz), oda tipleri, konum avantajı
```

#### Şablon 29: Seyahat Acentesi
```
Renk: #0369A1 (gökyüzü mavisi) + turuncu + beyaz
Font: Rubik (başlık) + DM Sans
Estetik: Macera, keşif, dünyayı gezin
Hero: "Hayal ettiğiniz tatil bir tık uzakta"
Alarm: "Tur araştıranlar onlarca siteye bakıyor. Kendi web siteniz yoksa rakiplerinizle yarışamıyorsunuz."
Özel: Tur paketleri, erken rezervasyon indirimi, destinasyon galerisi
```

#### Şablon 30: Özel Okullar + Etüt + Dil + Sürücü Kursları
```
Renk: #1E40AF (mavi) + #FCD34D (sarı) + beyaz
Font: Nunito (başlık) + Hind
Estetik: Modern eğitim, profesyonel, güven
Hero: "Geleceğinizi şekillendirin — [FİRMA ADI]"
Alarm: "Kurs araştıran aileler önce online araştırıyor. Web siteniz yoksa 'ciddi bir kurum' olarak görülmüyorsunuz."
Özel: Başarı istatistikleri, öğretmen kadrosu, ücretsiz deneme dersi CTA
```

---

### SPRINT 5 — EĞİTİM (devamı) + SPOR + OTOMOTİV (1/2)

#### Şablon 31: Kreşler
```
Renk: #FEF08A (sarı) + #86EFAC (yeşil) + #FCA5A5 (pembe) + beyaz
Font: Nunito (başlık, yuvarlak) + Quicksand
Estetik: Renkli, çocuk dostu, güvenli
Hero: "[FİRMA ADI] — Minikleriniz için güvenli, mutlu bir dünya"
Alarm: "Kreş araştıran ebeveynler en az 5-6 kreşi karşılaştırıyor. Web siteniz yoksa listede yoksunuz."
Özel: Güvenlik vurgusu, eğitim programı, fotoğraf galerisi, velilere mesaj
```

#### Şablon 32: Müzik Kursları
```
Renk: #1C1917 (siyah) + #F59E0B (altın nota) + kırmızı
Font: Abril Fatface (başlık) + Lato
Estetik: Sanatsal, nota, müzik tutku
Hero: "Müziği seviyorsanız, doğru yere geldiniz"
Alarm: "Müzik dersi araştıranlar önce hangi enstrümanları öğrettiğinizi, hoca kadrosunu online arıyor."
Özel: Enstrüman listesi, hoca profilleri, ücretsiz deneme dersi
```

#### Şablon 33: Spor Salonları
```
Renk: #0A0A0A (siyah) + #F97316 (turuncu) + gri
Font: Barlow Condensed (başlık, bold) + Barlow
Estetik: Güçlü, dinamik, motivasyon
Hero: "Daha güçlü bir sen için — [FİRMA ADI]"
Alarm: "Spor salonu arayanlar önce ekipman, hoca kadrosu, fiyat listesi arıyor. Web siteniz yoksa bulamazlar."
Özel: Üyelik paketleri, ekipman listesi, ücretsiz deneme CTA
```

#### Şablon 34: Pilates / Yoga
```
Renk: #FAFAF9 (beyaz) + #A8A29E (taş gri) + #84CC16 (doğal yeşil)
Font: Josefin Sans (başlık) + Lato
Estetik: Minimal, huzurlu, nefes alan
Hero: "Bedeninizi dinleyin — [FİRMA ADI]"
Alarm: "Pilates/yoga arayanlar studio atmosferini önce fotoğraftan anlıyor. Fotoğrafınız ve web siteniz yoksa gelme cesareti bulamıyorlar."
Özel: Ders programı, eğitmen profili, ilk ders ücretsiz
```

#### Şablon 35: Oto Galeri
```
Renk: #0A0A0A (siyah) + #DC2626 (kırmızı) + gümüş
Font: Rajdhani (başlık) + Roboto
Estetik: Premium otomotiv, araç odaklı, heyecan
Hero: "Hayalinizdeki araç [FİRMA ADI]'da sizi bekliyor"
Alarm: "Araç arayanların %87'si önce online inceliyor. Stoğunuz online değilse rakibinize gidiyorlar."
Özel: Araç stok grid, filtre (marka, fiyat, yıl), test sürüşü CTA
```

#### Şablon 36: Oto Servis + Elektrik + Egzoz + Kaporta + Cam + Motosiklet
```
Renk: #1E293B (lacivert) + #F97316 (turuncu) + gri
Font: Rajdhani (başlık) + Source Sans Pro
Estetik: Endüstriyel, güvenilir, usta işi
Hero: "Aracınız bizimle güvende — [FİRMA ADI]"
Alarm: "Arıza yapan araçlar için Google'da 'oto tamir [şehir]' arayan yüzlerce kişi var. Web siteniz yoksa aramadan çıkıyorsunuz."
Özel: Hizmet listesi (yağ, fren, egzoz, kaporta), acil servis vurgusu, fiyat şeffaflığı
```

#### Şablon 37: Lastikçi + Yıkama + Yedek Parça + Aksesuar
```
Renk: #171717 (siyah) + #EF4444 (kırmızı) + sarı
Font: Bebas Neue (başlık) + Open Sans
Estetik: Hızlı, pratik, güçlü
Hero: "Hızlı servis, kaliteli ürün — [FİRMA ADI]"
Alarm: "Lastik değiştirmek isteyenler fiyat ve stok sorgulamak için arıyor. Web siteniz yoksa telefonla ulaşmaya çalışıyorlar — yarısı vazgeçiyor."
Özel: Stok/marka bilgisi, randevu al, fiyat listesi
```

---

### SPRINT 6 — OTOMOTİV (2/2) + İNŞAAT (1/3)

#### Şablon 38: Oto Egzoz (Ayrı Şablon)
```
Renk: #1C1917 + #DC2626 + gümüş
Estetik: Teknik, güçlü, performans
Hero: "Egzoz sorunlarınız için uzman adres"
Özel: Marka uyumluluğu, muayene süresi vurgusu
```

#### Şablon 39: Oto Kaporta & Boya
```
Renk: #0F172A + beyaz + metalik gri
Font: Rajdhani + Lato
Estetik: Mükemmeliyetçi, temiz boya, estetik
Hero: "Aracınız kaza öncesi gibi olacak — garanti ediyoruz"
Özel: Sigorta anlaşmaları, öncesi/sonrası galeri, süre garantisi
```

#### Şablon 40: Oto Cam
```
Renk: #0C4A6E + şeffaf cam efekti + beyaz
Estetik: Temiz, net, cam gibi
Hero: "Kırık cam sürüşünüzü tehlikeye atıyor — hemen geliriz"
Özel: Mobil servis (eve gelir), sigorta kapsamı bilgisi
```

#### Şablon 41: Motosiklet Servisi
```
Renk: #0A0A0A + #F97316 + krom gri
Font: Barlow Condensed + Barlow
Estetik: Özgürlük, yol, motosiklet ruhu
Hero: "Motorunuz için en iyi bakım — [FİRMA ADI]"
Özel: Marka uzmanlıkları (Honda, Yamaha, BMW), sezon bakımı paketi
```

#### Şablon 42: İnşaat Firmaları + Prefabrik Yapı
```
Renk: #1E3A5F (lacivert) + #D97706 (turuncu) + beton gri
Font: Oswald (başlık) + Source Sans Pro
Estetik: Güçlü, kurumsal, inşaat
Hero: "Sağlam temeller, kalıcı yapılar — [FİRMA ADI]"
Alarm: "İnşaat işi verenler referans ve proje geçmişi arıyor. Portföyünüz online değilse güvenemiyorlar."
Özel: Tamamlanan projeler galerisi, sertifikalar, referanslar
```

#### Şablon 43: Mimarlık + Tadilat + Dekorasyon
```
Renk: #FAFAF9 + #171717 (minimal siyah) + altın
Font: Cormorant Garamond (başlık) + Jost
Estetik: Tasarım odaklı, minimal, şık
Hero: "Mekanınızı yeniden hayal edin — [FİRMA ADI]"
Alarm: "Ev tadilatı araştıranlar önce portfolyo inceliyor. Projeleriniz online değilse işi alamıyorsunuz."
Özel: Proje galerisi (önce/sonra), tasarım stilleri, ücretsiz keşif CTA
```

#### Şablon 44: PVC + Alüminyum Doğrama + Cam Balkon
```
Renk: #F8FAFC + #0F172A + mavi-gri metalik
Font: Raleway (başlık) + Open Sans
Estetik: Modern bina, cam/metal, temiz
Hero: "Evinizi dönüştürecek pencereler [FİRMA ADI]'da"
Alarm: "Pencere-kapı yaptırmak isteyenler önce fiyat teklifi almak için birden fazla firmayı arıyor. Web siteniz yoksa teklife dahil edilmiyorsunuz."
Özel: Ürün galerisi (farklı renkler/modeller), ücretsiz ölçüm ve keşif, ısı yalıtım vurgusu
```

---

### SPRINT 7 — İNŞAAT (2/3)

#### Şablon 45: Isı Yalıtım / Mantolama
```
Renk: #78350F (turuncu-kahve) + #FDE68A + beyaz
Font: Oswald + Lato
Estetik: Enerji tasarrufu, güvenli ev, sıcak
Hero: "Faturalarınızı yarıya indirin — [FİRMA ADI] mantolama"
Alarm: "Mantolamayı düşünenler enerji tasarruf hesabı ve fiyat araştırıyor. Web siteniz yoksa hesap yapamıyorlar."
Özel: Enerji tasarruf hesaplayıcı (etkileşimli olabilir), amortisman süresi, referans projeler
```

#### Şablon 46: Dış Cephe Kaplama
```
Renk: #374151 (gri) + #F59E0B + beyaz
Estetik: Modern bina, profesyonel, güçlü
Hero: "Binanızın dış yüzü kalıcı ve güzel olsun"
Özel: Malzeme çeşitleri, proje referansları
```

#### Şablon 47: Çatı Sistemleri
```
Renk: #1E293B + #DC2626 + gri
Font: Oswald + Source Sans Pro
Estetik: Güçlü, dayanıklı, güvenilir çatı
Hero: "Çatınız yıllar boyu sizi korusun"
Alarm: "Çatı tamir/yenileme arayanlar acil çözüm istiyor. Web siteniz yoksa güven veremiyorsunuz."
Özel: Acil servis vurgusu, 10 yıl garanti, farklı çatı sistemleri
```

#### Şablon 48: Fayans / Seramik Döşeme
```
Renk: #F8F5F2 (krem) + #92400E (toprak) + gri
Font: Playfair Display + Karla
Estetik: Ev dekorasyonu, güzellik, el işçiliği
Hero: "Her karo bir seçim — doğru seçim [FİRMA ADI]"
Özel: Model galerisi, ücretsiz keşif CTA, referans işler
```

#### Şablon 49: Asma Tavan / Alçıpan
```
Renk: #F1F5F9 + #0F172A + gümüş
Estetik: Modern iç mimari, temiz çizgiler
Hero: "Mekanınıza yeni bir boyut katın"
Özel: İş galerisi, hızlı teslimat vurgusu, fiyat teklifleri
```

#### Şablon 50: Boya Badana Ustası
```
Renk: #FEF9F0 (beyaz/krem) + gökkuşağı renk paleti + gri
Font: Nunito + Open Sans
Estetik: Temiz, renkli, dönüşüm
Hero: "Eviniz yeniden doğsun — [FİRMA ADI] boya"
Alarm: "Ev boyatmak isteyenler usta arıyor. Web siteniz yoksa güvenilir usta bulamıyor diye vazgeçiyorlar."
Özel: Öncesi/sonrası galeri, renk danışmanlığı, ücretsiz keşif
```

#### Şablon 51: Elektrikçi
```
Renk: #1C1917 (siyah) + #FCD34D (sarı) + kırmızı
Font: Barlow Condensed + Barlow
Estetik: Güçlü, elektrik, hızlı müdahale
Hero: "Elektrik sorununuz var mı? [FİRMA ADI] hemen geliyor"
Alarm: "Elektrik arızasında insanlar acil usta arıyor. Web siteniz yoksa telefon defterinden arıyorlar — ve bulduklarına gidiyorlar."
Özel: 7/24 acil servis vurgusu (büyük), hizmet bölgesi, güvenlik sertifikaları
```

#### Şablon 52: Tesisatçı
```
Renk: #1E3A5F + #0EA5E9 (su) + krom gri
Font: Poppins + Source Sans Pro
Estetik: Su, temizlik, güvenilir tesisat
Hero: "Su kaçağı, tıkanıklık, montaj — [FİRMA ADI] çözer"
Alarm: "Tesisat arızasında insanlar hemen çözüm arıyor. Web siteniz yoksa güven veremiyorsunuz."
Özel: Acil servis, 24 saat, şehir içi hızlı ulaşım vurgusu
```

---

### SPRINT 8 — İNŞAAT (3/3) + ATÖLYE (1/2)

#### Şablon 53: Mermer & Granit
```
Renk: #F8F5F2 + siyah + altın
Font: Cormorant Garamond + Raleway
Estetik: Lüks, doğal taş, premium
Hero: "Doğanın güzelliğini evinize taşıyın"
Özel: Taş çeşitleri galerisi, mutfak tezgahı, merdiven, zemin örnekleri
```

#### Şablon 54: Parke & Zemin Döşeme
```
Renk: #92400E (ahşap) + krem + gri
Font: Lora + Source Sans Pro
Estetik: Doğal, sıcak, ahşap dokusu
Hero: "Her adımda kalite — [FİRMA ADI] parke"
Özel: Parke çeşitleri, ısıtmalı zemin seçeneği, referans iş galerisi
```

#### Şablon 55: Döşemeci / Koltuk Tamircisi
```
Renk: #713F12 + #FDE68A + deri tonu
Font: Playfair Display + Karla
Estetik: El işçiliği, değer, geleneksel sanat
Hero: "Eski mobilyanız yeni gibi olacak — söz veriyoruz"
Alarm: "Koltuk yaptırmak isteyenler fiyat ve malzeme seçenekleri arıyor. Web siteniz yoksa güvenemiyorlar."
Özel: Kumaş/deri seçenekleri, öncesi/sonrası galeri, evde servis
```

#### Şablon 56: Marangoz / Ahşap Atölyesi
```
Renk: #78350F (ahşap) + krem + demir gri
Font: Libre Baskerville + Lato
Estetik: El yapımı, zanaat, sıcak
Hero: "Sipariş üzerine üretilen ahşap işler — [FİRMA ADI]"
Alarm: "Özel ahşap iş arayanlar portfolyo inceliyor. Siteniz yoksa işi kimler yapıyor bilmiyorlar."
Özel: Proje galerisi, sipariş akışı, malzeme bilgisi
```

#### Şablon 57: Çadır & Tente İmalatı
```
Renk: #166534 (orman yeşili) + krem + gri
Font: Oswald + Open Sans
Estetik: Dayanıklı, dış mekan, güneş/yağmur koruması
Hero: "Güneşin altında bile serin kalın — [FİRMA ADI] tente"
Alarm: "Tente yaptırmak isteyenler ölçü ve fiyat teklifi için dolaşıyor. Web siteniz yoksa aramadan düşüyorsunuz."
Özel: Ürün çeşitleri, ölçü al CTA, referans projeler
```

#### Şablon 58: Branda İmalatı
```
Renk: #1E3A5F + #F59E0B + gri
Estetik: Endüstriyel, B2B, güçlü malzeme
Hero: "Endüstriyel branda ihtiyaçlarınız için tek adres"
Özel: Minimum sipariş bilgisi, baskılı branda seçeneği, teslimat
```

#### Şablon 59: Kaynak & Demir Atölyesi
```
Renk: #0A0A0A + #F97316 + demir gri metalik
Font: Barlow Condensed + Barlow
Estetik: Endüstriyel, güçlü, ateş-demir
Hero: "Demir işleme ve kaynak — [FİRMA ADI] kalitesi"
Alarm: "Demir kapı, korkuluk, çelik konstrüksiyon arayanlar referans ve fiyat arıyor."
Özel: İşe örnekler (demir kapı, korkuluk, çatı taşıyıcısı), fiyat teklifi CTA
```

#### Şablon 60: Bobinaj
```
Renk: #1E293B + #F59E0B + endüstriyel gri
Estetik: Teknik, imalat, B2B
Hero: "Motor ve transformatör sarım işleri — [FİRMA ADI]"
Özel: Hizmet listesi (motor sarım, tamir), kurumsal müşteri vurgusu, hızlı servis
```

---

### SPRINT 9 — ATÖLYE (2/2) + HİZMET

#### Şablon 61: Matbaalar
```
Renk: #1C1917 + #DC2626 + krem
Font: Oswald + DM Sans
Estetik: Baskı, renkli, yaratıcı
Hero: "Fikirlerinizi kağıda döküyoruz — [FİRMA ADI]"
Alarm: "Kurumsal baskı arayanlar fiyat ve süre bilgisi istiyor. Web siteniz yoksa teklif alamıyorlar."
Özel: Ürün kategorileri (kartvizit, broşür, afiş), anında teklif CTA
```

#### Şablon 62: Ambalaj İmalatı
```
Renk: #374151 + #F59E0B + krem
Estetik: Endüstriyel, B2B, güvenilir
Hero: "Ürünlerinizi en iyi şekilde paketleyin"
Özel: Minimum sipariş, özel baskı, hızlı üretim
```

#### Şablon 63: Plastik İmalat
```
Renk: #0369A1 + endüstriyel gri + beyaz
Estetik: Modern imalat, B2B
Hero: "Plastik ürün ihtiyaçlarınız için tek kaynak"
Özel: Ürün çeşitleri, kalıp üretim, teknik spesifikasyonlar
```

#### Şablon 64: Terzi / Dikiş Atölyesi
```
Renk: #4C1D95 (mor) + altın + krem
Font: Cormorant Garamond + Lato
Estetik: El işçiliği, moda, özel üretim
Hero: "Sizin için özel dikilen kıyafetler — [FİRMA ADI]"
Alarm: "Özel dikim arayanlar terzi arıyor. Portföyünüz yoksa güven veremiyorsunuz."
Özel: Kumaş çeşitleri, ölçü alma servisi, örnek çalışmalar
```

#### Şablon 65: Tabela & Reklam
```
Renk: #0A0A0A + #F97316 + neon efektli
Font: Barlow Condensed + Barlow
Estetik: Dikkat çekici, reklam enerjisi
Hero: "İşletmenizi görünür kılın — [FİRMA ADI] tabela"
Özel: Ürün çeşitleri (LED, totem, araç giydirme), kurumsal referanslar
```

#### Şablon 66: Hukuk Büroları
```
Renk: #1E3A5F (lacivert) + #D4AF37 (altın) + beyaz
Font: Playfair Display (başlık) + Source Serif Pro
Estetik: Otorite, güven, kurumsal
Hero: "Hukuki süreçlerinizde yanınızdayız — [FİRMA ADI]"
Alarm: "Hukuki yardım arayanlar avukat uzmanlığını online araştırıyor. Web siteniz yoksa uzmanlığınızı bilemiyorlar."
Özel: Uzmanlık alanları, avukat profilleri, gizlilik güvencesi, ilk danışma ücretsiz
```

#### Şablon 67: Muhasebe Büroları
```
Renk: #166534 (yeşil) + #1E3A5F (lacivert) + beyaz
Font: Raleway + Open Sans
Estetik: Güven, profesyonellik, düzen
Hero: "Mali işlerinizi güvenle yönetin — [FİRMA ADI]"
Alarm: "Muhasebe hizmeti arayanlar deneyim ve referans arıyor. Web siteniz yoksa güven veremiyorsunuz."
Özel: Hizmet paketi fiyatları, ücretsiz ilk görüşme, sertifikalar
```

#### Şablon 68: Sigorta Acenteleri
```
Renk: #0F766E + beyaz + mavi
Font: Poppins + Hind
Estetik: Güvenli, koruma, huzur
Hero: "Her riske karşı doğru güvence — [FİRMA ADI]"
Özel: Sigorta türleri, online teklif formu, acil destek hattı
```

---

### SPRINT 10 — HİZMET (devamı) + PERAKENDEv

#### Şablon 69: Emlak Ofisleri
```
Renk: #0F172A + #D4AF37 (altın) + beyaz
Font: Cormorant Garamond + Raleway
Estetik: Premium mülk, prestij, güven
Hero: "Hayalinizdeki ev [FİRMA ADI]'da sizi bekliyor"
Alarm: "Ev arayanların %89'u önce online inceliyor. İlanlarınız kendi sitenizde yoksa sadece sahibinden.com'a bağımlısınız."
Özel: Aktif ilan grid, bölge filtreleme, WhatsApp CTA, değerleme servisi
```

#### Şablon 70: Mobilya Mağazaları
```
Renk: #FAFAF9 + #292524 + doğal ahşap tonu
Font: Cormorant Garamond + Karla
Estetik: Ev dekorasyonu, yaşam tarzı, sofistike
Hero: "Evinizi yansıtan mobilyalar — [FİRMA ADI]"
Alarm: "Mobilya arayanlar önce online katalog geziyor. Ürünleriniz online değilse mağazanıza gelme motivasyonu yok."
Özel: Ürün grid (kategoriye göre), ücretsiz keşif/ölçüm, taksit bilgisi
```

#### Şablon 71: Elektronik Mağazaları
```
Renk: #0F172A + #3B82F6 (elektrik mavisi) + beyaz
Font: Poppins + Inter
Estetik: Tech, modern, ürün odaklı
Hero: "En iyi fiyat, en hızlı servis — [FİRMA ADI]"
Alarm: "Elektronik ürün arayanlar önce fiyat karşılaştırıyor. Stoğunuz ve fiyatlarınız online değilse rakibiniz satıyor."
Özel: Ürün kategorileri, garanti bilgisi, servis merkezi vurgusu
```

#### Şablon 72: Kırtasiyeler
```
Renk: #FEF3C7 + #1E40AF + kırmızı
Font: Nunito + Open Sans
Estetik: Renkli, çocuk dostu ama profesyonel
Hero: "Okul, ofis, sanat — hepsi [FİRMA ADI]'da"
Özel: Toplu sipariş indirimi, okula dönüş paketi, teslimat
```

#### Şablon 73: Pet Shop
```
Renk: #ECFDF5 (yumuşak yeşil) + #F59E0B + kahverengi
Font: Nunito + Quicksand
Estetik: Sevimli, hayvan sevgisi, güvenilir
Hero: "Dostunuz için en iyisi — [FİRMA ADI]"
Alarm: "Evcil hayvan sahipleri ürün araştırıyor. Web siteniz yoksa sizi bulmak zorlaşıyor."
Özel: Ürün kategorileri (mama, oyuncak, bakım), veteriner işbirliği vurgusu
```

#### Şablon 74: Çiçekçiler
```
Renk: #FDF2F8 + #BE185D + yeşil
Font: Pacifico veya Dancing Script (başlık) + Nunito
Estetik: Renkli, taze, romantik
Hero: "Her duygu için doğru çiçek — [FİRMA ADI]"
Alarm: "Çiçek siparişi verenler hızlı teslimat arıyor. Web siteniz yoksa online sipariş veremiyorlar."
Özel: Teslimat bilgisi, özel buket tasarımı, sezon çiçekleri
```

#### Şablon 75: Kuyumcular
```
Renk: #0A0A0A + #D4AF37 (altın) + krem
Font: Cormorant Garamond (başlık, şık) + Jost
Estetik: Lüks, altın parlaklığı, premium
Hero: "En değerli anlar için en özel takılar — [FİRMA ADI]"
Alarm: "Nişan yüzüğü arayanlar online katalog inceliyor. Koleksiyonunuz online değilse mağazaya gelme motivasyonu yok."
Özel: Koleksiyon galerisi, özel sipariş (el yapımı), ayar/tamir servisi
```

#### Şablon 76: Tekstil / Giyim Mağazası
```
Renk: #1C1917 + #F59E0B + krem
Font: Tenor Sans + Karla
Estetik: Fashion, trend, mağaza vitrini
Hero: "Tarzınızı yansıtın — [FİRMA ADI]"
Özel: Koleksiyon galerisi, beden tablosu, WhatsApp sipariş
```

---

### SPRINT 11 — PERAKENDEv (devamı) + TEKNİK SERVİS (1/2)

#### Şablon 77: Spor Malzemeleri Mağazası
```
Renk: #0A0A0A + #F97316 + gri
Font: Barlow Condensed + Barlow
Estetik: Dinamik, enerji, sporcu
Hero: "Performansınızı artıracak ekipmanlar burada"
Özel: Spor dalı kategorileri, marka çeşitliliği, uzman öneri CTA
```

#### Şablon 78: Klima Servisi
```
Renk: #0EA5E9 (soğuk mavi) + beyaz + gri
Font: Poppins + Inter
Estetik: Serin, temiz, teknoloji
Hero: "Klimanız her zaman hazır — [FİRMA ADI]"
Alarm: "Yaz gelince herkes klima servisi arıyor. Web siteniz yoksa o kalabalıkta kayboluyorsunuz."
Özel: Marka uyumluluğu listesi, yıllık bakım paketi, acil servis vurgusu
```

#### Şablon 79: Kombi Servisi
```
Renk: #F97316 + #1E3A5F + beyaz
Font: Oswald + Source Sans Pro
Estetik: Sıcak, güvenilir, acil servis
Hero: "Kışın kombiniz soğuk mu? Hemen çözüyoruz"
Alarm: "Kombi arızasında insanlar acil yetkili servis arıyor. İlk sırada olmazsanız rakibinizi arıyorlar."
Özel: Acil servis vurgusu, marka uzmanlıkları, yıllık bakım
```

#### Şablon 80: Beyaz Eşya Tamircisi
```
Renk: #F1F5F9 + #0F172A + kırmızı
Font: Poppins + Inter
Estetik: Temiz, ev, güvenilir tamir
Hero: "Çamaşır makineniz arıza mı yaptı? Biz geliriz"
Özel: Marka listesi, eve gelir servis, parça garantisi
```

#### Şablon 81: Asansör Bakım
```
Renk: #1E293B + gümüş + kırmızı
Estetik: Kurumsal, güvenlik, teknik
Hero: "Asansörünüzün güvenliği bizim sorumluluğumuz"
Özel: Periyodik bakım planları, acil arıza servisi, TSE belgesi vurgusu
```

#### Şablon 82: Jeneratör Servisi
```
Renk: #0A0A0A + #FCD34D (enerji sarısı) + gri
Estetik: Endüstriyel, güç, kesintisiz enerji
Hero: "Kesintisiz güç için [FİRMA ADI]"
Özel: Güç kapasitesi seçenekleri, kiralama/satın alma, periyodik bakım
```

#### Şablon 83: Güvenlik Sistemleri
```
Renk: #1E3A5F + #DC2626 + beyaz
Font: Rajdhani + Source Sans Pro
Estetik: Güvenlik, gözetim, teknoloji
Hero: "İşletmeniz ve eviniz güvende — [FİRMA ADI]"
Özel: Sistem çeşitleri (kamera, alarm, kartlı geçiş), ücretsiz keşif CTA
```

#### Şablon 84: Çilingir
```
Renk: #1C1917 + #F59E0B + gri
Font: Barlow Condensed + Barlow
Estetik: Hızlı, 7/24, güvenilir
Hero: "Kapınız kilitli mi? 15 dakikada geliyoruz"
Alarm: "Kapısına kilitli kalan herkes acil çilingir arıyor. İlk sıraya gelmek için web siteniz olmalı."
Özel: 7/24 vurgusu (büyük), hizmet bölgesi, fiyat şeffaflığı, araç çilingirlik
```

---

### SPRINT 12 — TEKNİK SERVİS (2/2) + DİĞER HİZMETLER (1/2)

#### Şablon 85: Su Arıtma Servisi
```
Renk: #0EA5E9 + beyaz + açık mavi
Estetik: Temizlik, sağlık, su
Hero: "Temiz su içme hakkınız — [FİRMA ADI] arıtma"
Özel: Sistem karşılaştırması, bakım sözleşmesi, ücretsiz su testi CTA
```

#### Şablon 86: Fotoğraf Stüdyoları
```
Renk: #0A0A0A + beyaz + altın
Font: Cormorant Garamond + Raleway
Estetik: Sanatsal, profesyonel, ışık-gölge
Hero: "Her an bir hikaye — [FİRMA ADI] fotoğraf"
Alarm: "Düğün fotoğrafçısı arayanlar portfolyo inceliyor. Siteniz yoksa değerlendirmeye alamıyorlar."
Özel: Portfolyo galerisi (düğün, bebek, kurumsal), paket fiyatlar
```

#### Şablon 87: Temizlik Şirketleri
```
Renk: #ECFDF5 (temiz yeşil) + #0F766E + beyaz
Font: Poppins + Nunito
Estetik: Temizlik, hijyen, güvenilir
Hero: "Tertemiz mekanlar için profesyonel hizmet"
Alarm: "Ofis ve ev temizliği arayanlar referans ve fiyat arıyor. Web siteniz yoksa görünmüyorsunuz."
Özel: Hizmet kategorileri (ev, ofis, sonrası inşaat), periyodik kontrat, referanslar
```

#### Şablon 88: Kuru Temizleme
```
Renk: #E0F2FE + #0369A1 + beyaz
Font: Nunito + Open Sans
Estetik: Temizlik, bakım, güven
Hero: "Kıyafetleriniz en iyi bakımı hak ediyor"
Özel: Ekspres servis, özel kumaşlar (deri, kadife), eve teslim seçeneği
```

#### Şablon 89: Halı Yıkama
```
Renk: #78350F + #FDE68A + beyaz
Font: Lora + Source Sans Pro
Estetik: Temiz, güvenilir, ev konforu
Hero: "Halılarınız fabrika gibi temizleniyor — [FİRMA ADI]"
Özel: Eve alma/teslim servisi, fiyat hesaplayıcı (m² bazlı), hızlı kurutma vurgusu
```

#### Şablon 90: Nakliyat Firmaları
```
Renk: #1E3A5F + #F97316 + gri
Font: Oswald + Source Sans Pro
Estetik: Güç, hareket, güven
Hero: "Taşınma stressiz olabilir — [FİRMA ADI] ile"
Alarm: "Taşınma planlayanlar fiyat teklifi ve referans arıyor. Web siteniz yoksa rakibinizden teklif alıyorlar."
Özel: Online fiyat teklifi formu, paketleme hizmeti, sigortalı taşıma vurgusu
```

#### Şablon 91: Organizasyon Şirketleri
```
Renk: #1C1917 + #D4AF37 + beyaz
Font: Cormorant Garamond + Jost
Estetik: Etkinlik, şıklık, özel anlar
Hero: "Unutulmaz etkinlikler için doğru adres"
Özel: Etkinlik kategorileri (düğün, kurumsal, kına), referans fotoğrafları, ücretsiz planlama görüşmesi
```

#### Şablon 92: Tabela & Reklam (Detaylı Versiyon)
```
Renk: #0A0A0A + LED neon efektleri + kırmızı
Font: Barlow Condensed + Barlow
Estetik: Dikkat çekici, parlak, reklam gücü
Hero: "Rakiplerinizden daha görünür olun — [FİRMA ADI]"
Özel: Ürün kategorileri (LED tabela, araç kaplama, vinil baskı), kurumsal referanslar
```

---

### SPRINT 13 — ESNAF & ÖZEL SEKTÖRLER

#### Şablon 93: İnşaat (Alt Usta) — Elektrikçi Detaylı
*Sprint 7'dekinin genişletilmiş versiyonu — farklı görsel kimlik*

#### Şablon 94: Pet Shop + Veteriner Kombinasyonu
*Pet shop + vet hizmet birlikte sunan işletmeler için*

#### Şablon 95: Özel Kreş + Anaokulu Kombinasyonu
*Yarı gündüz + tam gündüz + anaokulu için*

#### Şablon 96: Online Eğitim Merkezi
```
Renk: #4F46E5 (indigo) + yeşil + beyaz
Estetik: Modern, dijital eğitim, teknoloji
Hero: "Nerede olursanız olun öğrenin"
Özel: Kurs kategorileri, online platform vurgusu, ücretsiz deneme
```

#### Şablon 97: Butik Otel / Pansiyon
```
Renk: #F8F5F0 + #92400E (sıcak) + yeşil
Font: Playfair Display + Lato
Estetik: Küçük, samimi, konforlu konaklama
Hero: "Büyük otellerin soğukluğu yok — sadece sıcaklık"
Özel: Oda tipleri, kahvaltı vurgusu, doğrudan rezervasyon CTA
```

#### Şablon 98: Kamp Alanı / Bungalov
```
Renk: #14532D (orman) + #92400E + gökyüzü mavisi
Estetik: Doğa, özgürlük, macera
Hero: "Doğayla baş başa — [FİRMA ADI] kamp"
Özel: Kapasite bilgisi, aktiviteler, rezervasyon takvimi
```

#### Şablon 99: Catering (Kurumsal Özel Versiyon)
*Büyük hacimli kurumsal catering için ayrı şablon*

#### Şablon 100: Güzellik Merkezleri (Kombine — tüm hizmetler)
*Saç + cilt + lazer + spa hepsini sunan büyük merkezler için*

---

### SPRINT 14 — TAMAMLAMA + KALİTE KONTROLÜ

#### Şablon 101-107: Kalan sektörler için şablon tamamlama
Bu sprintte eksik kalan sektörler tamamlanır:
- Sürücü Kursları (detaylı versiyon)
- Müzik Kursları (enstrüman bazlı)
- Oto Yıkama (önce/sonra galeri odaklı)
- Oto Yedek Parça (arama/filtreleme odaklı)
- Oto Aksesuar (ürün grid odaklı)
- Prefabrik Yapı (kurumsal B2B)
- Ambalaj + Plastik (B2B katalog)

---

## ŞABLON DOSYA YAPISI

```typescript
// lib/templates/[sector-key].tsx
// Her şablon bu interface'i implement eder

interface TemplateProps {
  firma: {
    name: string
    address: string
    phone: string
    sector: string
    city: string
    googleRating?: number
    googleReviews?: number
    hasWebsite: boolean
    score: number
    slug: string
  }
}

// Örnek kullanım:
// lib/templates/diş-klinikleri.tsx
export default function DisTempate({ firma }: TemplateProps) {
  // ...
}
```

## ŞABLON SEÇİM MANTIĞI

```typescript
// lib/template-selector.ts
export function selectTemplate(sector: string): string {
  const templateMap: Record<string, string> = {
    'Diş Klinikleri': 'dis-klinikleri',
    'Fırınlar': 'firinlar',
    // ...107 sektör
  }
  return templateMap[sector] ?? 'genel'
}
```

---

## SPRINT BAŞLATMA KOMUTU (Claude Code'a verilecek)

```
PROSPECT FUNNEL PLAN.md ve WA_SABLON_PLAN.md dosyalarını oku.

Sprint [N]'i uygula:

Önce şu skill'leri oku (sırayla):
1. /mnt/skills/public/frontend-design/SKILL.md
2. /mnt/skills/user/ui-ux-pro-max/SKILL.md
3. /mnt/skills/user/landing-page/SKILL.md
4. /mnt/skills/user/color-palette/SKILL.md
5. .claude/skills/page-cro/SKILL.md
6. .claude/skills/copywriting/SKILL.md
7. /mnt/skills/user/vorte-nextjs-stack/SKILL.md

Sonra bu sprintteki şablonları kodla:
- lib/templates/ altında her şablon ayrı dosya
- app/p/[slug]/page.tsx şablon seçimini yap
- Her şablon kendi renk paleti, tipografi, animasyonu ile tam olarak yazılacak
- Türkçe metinler copywriting skill'ine göre ikna edici yazılacak
- Firma bilgileri dinamik dolar (props ile)
- Responsive, mobil öncelikli
- Tracking: sayfa yüklenince /api/track'e PAGE_VIEW gönderir

Sprint tamamlandığında:
- Kaç şablon yapıldı
- Hangi dosyalar oluştu
- Test talimatları

Push et.
ONAY BEKLE sonraki sprint için.
```

---

## DOĞRULAMA (Her Sprint Sonrası)

- [ ] /p/test-[sektor]-slug açılıyor mu?
- [ ] Firma bilgileri doğru mu?
- [ ] Mobilde görünüm düzgün mü?
- [ ] CTA butonları çalışıyor mu?
- [ ] Tracking kaydediliyor mu?
- [ ] Sayfa yüklenme < 2 saniye mi?
