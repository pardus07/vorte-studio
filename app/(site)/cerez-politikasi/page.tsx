import type { Metadata } from "next";
import LegalLayout from "@/components/site/LegalLayout";

/**
 * Çerez Politikası — KVKK 2022/1358 kararı ve Çerez Uygulamaları Rehberi
 * esas alınarak hazırlanmıştır.
 *
 * Vorte Studio yalnızca zorunlu çerezler kullanır (oturum, CSRF, tema).
 * Analitik veya reklam çerezi kullanılmamaktadır, dolayısıyla rıza bannerı
 * yasal olarak zorunlu değildir.
 */

export const metadata: Metadata = {
  title: "Çerez Politikası | Vorte Studio",
  description:
    "Vorte Studio çerez politikası. Web sitemizde kullanılan çerez türleri, kullanım amaçları ve çerez yönetimi hakkında bilgiler.",
  robots: { index: true, follow: true },
};

export default function CerezPolitikasiPage() {
  return (
    <LegalLayout title="Çerez Politikası" lastUpdated="7 Nisan 2026">
      <p>
        İşbu Çerez Politikası, İbrahim Yaşar — Vorte Studio tarafından işletilen
        vortestudio.com web sitesinde kullanılan çerezler hakkında bilgi vermek
        amacıyla hazırlanmıştır. Çerez kullanımımız, 6698 sayılı Kişisel Verilerin
        Korunması Kanunu (&quot;KVKK&quot;) ve KVKK Çerez Uygulamaları Hakkında Rehber
        ile uyumludur.
      </p>

      <h2>1. Çerez Nedir?</h2>
      <p>
        Çerez (cookie), bir web sitesini ziyaret ettiğinizde tarayıcınız
        aracılığıyla bilgisayarınıza veya mobil cihazınıza yerleştirilen küçük
        metin dosyalarıdır. Çerezler, web sitesinin düzgün çalışmasını sağlamak,
        tercihlerinizi hatırlamak ve güvenlik önlemlerini uygulamak için
        kullanılır.
      </p>

      <h2>2. Vorte Studio Hangi Çerezleri Kullanır?</h2>
      <p>
        Vorte Studio, hizmetlerinin temel işlevselliğini sağlamak için yalnızca{" "}
        <strong>zorunlu çerezler</strong> kullanır. Analitik, reklam veya
        pazarlama amaçlı çerez <strong>kullanılmamaktadır</strong>. Bu nedenle
        ek bir çerez rıza bannerı gösterilmemektedir.
      </p>

      <h3>2.1. Zorunlu Çerezler</h3>
      <p>
        Bu çerezler web sitesinin düzgün çalışması için zorunludur ve KVKK
        uyarınca açık rıza gerektirmez (meşru menfaat kapsamındadır).
      </p>
      <table>
        <thead>
          <tr>
            <th>Çerez Adı</th>
            <th>Amaç</th>
            <th>Süre</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>authjs.session-token</code>
            </td>
            <td>
              Kullanıcı oturum yönetimi. Admin paneline ve müşteri portalına
              giriş yapıldığında oturumu takip eder.
            </td>
            <td>30 gün</td>
          </tr>
          <tr>
            <td>
              <code>authjs.csrf-token</code>
            </td>
            <td>
              CSRF (Cross-Site Request Forgery) saldırılarına karşı güvenlik
              koruması sağlar.
            </td>
            <td>Oturum</td>
          </tr>
          <tr>
            <td>
              <code>authjs.callback-url</code>
            </td>
            <td>
              Giriş sonrası yönlendirme URL&apos;ini hatırlamak için kullanılır.
            </td>
            <td>Oturum</td>
          </tr>
          <tr>
            <td>
              <code>__Host-*</code>
            </td>
            <td>
              HTTPS zorunluluğu ile güvenli oturum çerezleri için Next.js
              tarafından kullanılır.
            </td>
            <td>Oturum</td>
          </tr>
        </tbody>
      </table>

      <h3>2.2. Kullanılmayan Çerez Türleri</h3>
      <p>Vorte Studio aşağıdaki çerez türlerini <strong>kullanmamaktadır</strong>:</p>
      <ul>
        <li>
          <strong>Analitik çerezler:</strong> Google Analytics, Hotjar, Matomo
          gibi araçlar kullanılmaz.
        </li>
        <li>
          <strong>Reklam çerezleri:</strong> Google Ads, Facebook Pixel veya
          herhangi bir reklam ağı çerezi yerleştirilmez.
        </li>
        <li>
          <strong>Üçüncü taraf pazarlama çerezleri:</strong> Sosyal medya
          takip pikselleri kullanılmaz.
        </li>
        <li>
          <strong>Fingerprinting:</strong> Parmak izi oluşturma veya cihaz
          takibi yapılmaz.
        </li>
      </ul>

      <h2>3. Çerezleri Nasıl Yönetebilirsiniz?</h2>
      <p>
        Çerezleri tarayıcınız üzerinden kontrol edebilir, silebilir veya
        engelleyebilirsiniz. Ancak <strong>zorunlu çerezleri engellemeniz
        halinde web sitesinin bazı özellikleri (özellikle giriş gerektiren
        müşteri portalı) çalışmayacaktır.</strong>
      </p>

      <h3>3.1. Tarayıcı Ayarları</h3>
      <ul>
        <li>
          <strong>Google Chrome:</strong> Ayarlar → Gizlilik ve güvenlik →
          Çerezler ve diğer site verileri
        </li>
        <li>
          <strong>Mozilla Firefox:</strong> Ayarlar → Gizlilik ve Güvenlik →
          Çerezler ve Site Verileri
        </li>
        <li>
          <strong>Safari:</strong> Tercihler → Gizlilik → Çerezler ve web
          sitesi verileri
        </li>
        <li>
          <strong>Microsoft Edge:</strong> Ayarlar → Çerezler ve site
          izinleri → Çerezleri ve site verilerini yönet
        </li>
      </ul>

      <h3>3.2. Mobil Cihazlar</h3>
      <p>
        iOS ve Android cihazlarda tarayıcı ayarlarından çerezleri yönetebilir,
        veya cihazınızın gizlilik ayarlarından reklam takibini kapatabilirsiniz.
      </p>

      <h2>4. Veri Aktarımı</h2>
      <p>
        Çerezler aracılığıyla toplanan veriler yalnızca Vorte Studio&apos;nun
        Türkiye&apos;de yerleşik altyapısında işlenir. <strong>Hiçbir çerez verisi
        yurt dışına aktarılmaz.</strong>
      </p>

      <h2>5. Politika Değişiklikleri</h2>
      <p>
        İşbu Çerez Politikası, yeni özellikler eklendiğinde veya mevzuat
        değiştiğinde güncellenebilir. Analitik veya reklam çerezi kullanımına
        başlanması halinde, sizden öncelikle açık rıza alınacak ve bu sayfa
        güncellenecektir. Güncel metin her zaman bu sayfada yayımlanır.
      </p>

      <h2>6. İletişim</h2>
      <p>
        Çerez politikamız hakkında sorularınız için:{" "}
        <a href="mailto:studio@vorte.com.tr">studio@vorte.com.tr</a>
      </p>

      <div className="callout">
        <strong>Bilgilendirme:</strong> Vorte Studio olarak gizliliğinize
        saygı duyuyoruz. Size reklam göstermiyoruz, davranışınızı takip
        etmiyoruz ve verilerinizi üçüncü taraflara satmıyoruz. Kullandığımız
        tek çerezler, oturumunuzu güvende tutan zorunlu teknik çerezlerdir.
      </div>
    </LegalLayout>
  );
}
