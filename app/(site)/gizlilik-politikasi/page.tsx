import type { Metadata } from "next";
import LegalLayout from "@/components/site/LegalLayout";

/**
 * Gizlilik Politikası — KVKK Aydınlatma Metni'ni tamamlayıcı nitelikte,
 * teknik güvenlik önlemleri ve uygulamaları açıklayan belge.
 */

export const metadata: Metadata = {
  title: "Gizlilik Politikası | Vorte Studio",
  description:
    "Vorte Studio gizlilik politikası. Kişisel verilerinizin güvenliği, kullanımı, paylaşımı ve haklarınız hakkında detaylı bilgiler.",
  robots: { index: true, follow: true },
};

export default function GizlilikPolitikasiPage() {
  return (
    <LegalLayout title="Gizlilik Politikası" lastUpdated="7 Nisan 2026">
      <p>
        İbrahim Yaşar — Vorte Studio (&quot;Vorte Studio&quot;, &quot;biz&quot;) olarak
        kişisel verilerinizin güvenliği bizim için önemlidir. İşbu Gizlilik
        Politikası, vortestudio.com web sitesini ziyaret ettiğinizde veya
        hizmetlerimizden yararlandığınızda toplanan bilgilerin nasıl
        kullanıldığını açıklamaktadır.
      </p>

      <p>
        Bu politika, KVKK Aydınlatma Metnimizi tamamlayıcı niteliktedir.
        Detaylı yasal bilgilendirme için{" "}
        <a href="/kvkk">KVKK Aydınlatma Metni</a> sayfamızı inceleyebilirsiniz.
      </p>

      <h2>1. Topladığımız Bilgiler</h2>
      <h3>1.1. Doğrudan Sağladığınız Bilgiler</h3>
      <ul>
        <li>Teklif talep formunda girdiğiniz ad, e-posta, telefon, firma adı</li>
        <li>Chatbot üzerinden paylaştığınız proje detayları ve tercihleriniz</li>
        <li>Müşteri portalı üzerinden gönderdiğiniz mesaj ve dosyalar</li>
        <li>Sözleşme kurulumu sırasında sağlanan fatura bilgileri</li>
      </ul>

      <h3>1.2. Otomatik Olarak Toplanan Bilgiler</h3>
      <ul>
        <li>IP adresi ve yaklaşık coğrafi konum</li>
        <li>Tarayıcı türü, işletim sistemi, cihaz bilgileri</li>
        <li>Ziyaret edilen sayfalar ve site üzerindeki etkileşim süresi</li>
        <li>Oturum çerezleri (zorunlu güvenlik ve oturum yönetimi için)</li>
      </ul>

      <h2>2. Bilgilerinizi Nasıl Kullanıyoruz?</h2>
      <ul>
        <li>Size özel teklifi hazırlamak ve sunmak</li>
        <li>Sözleşme sürecini yönetmek ve hizmeti ifa etmek</li>
        <li>Müşteri portalı üzerinden proje takibini sağlamak</li>
        <li>Ödemeleri tahsil etmek ve faturalandırmak</li>
        <li>Hosting, domain ve bakım hizmetlerini sunmak</li>
        <li>Yasal yükümlülüklerimizi yerine getirmek</li>
        <li>Hizmet kalitemizi ölçmek ve geliştirmek</li>
      </ul>

      <h2>3. Bilgilerin Paylaşımı</h2>
      <p>
        Vorte Studio, kişisel verilerinizi <strong>satmaz, kiralamaz veya
        pazarlama amaçlı üçüncü taraflara aktarmaz</strong>. Bilgileriniz yalnızca
        aşağıdaki durumlarda paylaşılır:
      </p>
      <ul>
        <li>Hizmeti sunmak için zorunlu teknik sağlayıcılar (hosting, e-posta sunucusu)</li>
        <li>Muhasebe ve e-fatura işlemleri için Dia CRM sistemi</li>
        <li>Yasal talep halinde yetkili kamu kurumları</li>
        <li>Sizin açık rızanızın bulunduğu diğer özel durumlar</li>
      </ul>
      <p>
        Tüm veri işleme süreçleri <strong>Türkiye sınırları içinde</strong>{" "}
        gerçekleştirilmektedir. Yurt dışına veri aktarımı yapılmamaktadır.
      </p>

      <h2>4. Güvenlik Önlemleri</h2>
      <p>
        Kişisel verilerinizi korumak için aşağıdaki teknik ve idari önlemleri
        uyguluyoruz:
      </p>
      <ul>
        <li>
          <strong>Şifreli iletişim:</strong> Tüm site trafiği HTTPS (TLS 1.3) ile
          şifrelenmektedir.
        </li>
        <li>
          <strong>Güçlü şifreleme:</strong> Parolalar bcrypt algoritması ile
          tek yönlü şifrelenerek saklanır. Düz metin parola asla kaydedilmez.
        </li>
        <li>
          <strong>Güvenli oturum:</strong> JWT tabanlı oturum yönetimi,
          HttpOnly + Secure + SameSite cookie ayarları.
        </li>
        <li>
          <strong>Güvenlik başlıkları:</strong> CSP, X-Frame-Options,
          X-Content-Type-Options gibi modern güvenlik başlıkları aktif.
        </li>
        <li>
          <strong>Girdi doğrulama:</strong> Tüm form girdileri Zod
          şemalarıyla doğrulanır ve XSS&apos;e karşı sanitize edilir.
        </li>
        <li>
          <strong>Erişim kontrolü:</strong> Admin paneli çift faktörlü
          kimlik doğrulama ve IP kısıtlaması ile korunur.
        </li>
        <li>
          <strong>Yedekleme:</strong> Veritabanı düzenli olarak yedeklenir,
          yedekler şifrelenmiş olarak saklanır.
        </li>
      </ul>

      <h2>5. Veri Saklama Süresi</h2>
      <p>
        Kişisel verileriniz, hizmet ilişkisi devam ettiği süre boyunca ve
        ilgili yasal zamanaşımı süreleri (kural olarak 10 yıl — Vergi Usul
        Kanunu ve Türk Ticaret Kanunu uyarınca) boyunca saklanır. Sürelerin
        sonunda veriler silinir veya anonim hale getirilir.
      </p>
      <p>
        Teklif talebinizin reddedilmesi veya sözleşme kurulmaması halinde,
        iletişim bilgileriniz 6 ay içinde silinir.
      </p>

      <h2>6. Çocukların Gizliliği</h2>
      <p>
        Vorte Studio hizmetleri 18 yaş altındaki kişilere yönelik değildir.
        Bilerek 18 yaş altı kişilerden kişisel veri toplamayız. 18 yaş altı
        bir çocuğun bize bilgi verdiğini fark ederseniz, lütfen derhal bizimle
        iletişime geçin.
      </p>

      <h2>7. Üçüncü Taraf Bağlantılar</h2>
      <p>
        Web sitemizde üçüncü taraf sitelere bağlantılar bulunabilir. Bu
        sitelerin gizlilik uygulamalarından Vorte Studio sorumlu değildir.
        Üçüncü taraf sitelerini ziyaret ederken kendi gizlilik politikalarını
        incelemenizi tavsiye ederiz.
      </p>

      <h2>8. Haklarınız</h2>
      <p>
        KVKK&apos;nın 11. maddesi kapsamındaki tüm haklarınızı{" "}
        <a href="/kvkk">KVKK Aydınlatma Metni</a> sayfamızda detaylı olarak
        inceleyebilir ve{" "}
        <a href="mailto:info@vortestudio.com">info@vortestudio.com</a> adresine
        başvurarak kullanabilirsiniz.
      </p>

      <h2>9. Politika Değişiklikleri</h2>
      <p>
        İşbu Gizlilik Politikası, mevzuat değişiklikleri veya hizmet
        güncellemeleri doğrultusunda zaman zaman güncellenebilir. Önemli
        değişiklikler, portal kullanıcılarımıza e-posta ile bildirilecektir.
        Güncel metin her zaman bu sayfada yayımlanır.
      </p>

      <h2>10. İletişim</h2>
      <p>
        Gizlilik politikamız hakkında sorularınız için bizimle iletişime
        geçebilirsiniz:
      </p>
      <ul>
        <li>
          E-posta:{" "}
          <a href="mailto:info@vortestudio.com">info@vortestudio.com</a>
        </li>
        <li>Telefon: 0543 188 34 25</li>
        <li>
          Adres: Mansuroğlu Mah., Ankara Caddesi No:81/012, Bayraklı Tower,
          35030 Bayraklı / İzmir
        </li>
      </ul>
    </LegalLayout>
  );
}
