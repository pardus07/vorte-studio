import type { Metadata } from "next";
import LegalLayout from "@/components/site/LegalLayout";

/**
 * KVKK Aydınlatma Metni — 6698 sayılı Kanun m.10 kapsamında.
 *
 * KVKK 18/02/2026 tarihli 2026/347 sayılı ilke kararı uyarınca:
 * - Aydınlatma metni ve açık rıza AYRI düzenlenmiştir.
 * - Bu metin SADECE bilgilendirmedir, "kabul ediyorum" checkbox'ı YOKTUR.
 * - İfade olarak "okudum ve anladım" beyanı yeterlidir.
 */

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni | Vorte Studio",
  description:
    "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında Vorte Studio aydınlatma metni. Veri sorumlusu kimliği, işleme amaçları, kişisel veri kategorileri ve ilgili kişi hakları.",
  robots: { index: true, follow: true },
};

export default function KvkkPage() {
  return (
    <LegalLayout title="KVKK Aydınlatma Metni" lastUpdated="7 Nisan 2026">
      <p>
        6698 sayılı Kişisel Verilerin Korunması Kanunu&apos;nun (&quot;KVKK&quot;) 10. maddesi
        uyarınca, kişisel verilerinizin işlenmesine ilişkin olarak sizi bilgilendirmek
        amacıyla işbu aydınlatma metni hazırlanmıştır.
      </p>

      <div className="callout">
        <strong>Önemli:</strong> Bu metin yalnızca bilgilendirme amaçlıdır. KVKK&apos;nın
        18/02/2026 tarih ve 2026/347 sayılı ilke kararı gereği, aydınlatma metni ve
        açık rıza beyanları ayrı ayrı düzenlenmektedir. Bu metni okumanız herhangi bir
        rıza anlamına gelmez.
      </div>

      <h2>1. Veri Sorumlusu Kimliği</h2>
      <p>
        6698 sayılı Kanun uyarınca veri sorumlusu sıfatıyla aşağıdaki gerçek kişi
        hareket etmektedir:
      </p>
      <table>
        <tbody>
          <tr>
            <th>Ticari Ünvan</th>
            <td>İbrahim Yaşar — Vorte Studio (Şahıs Şirketi)</td>
          </tr>
          <tr>
            <th>T.C. Kimlik No</th>
            <td>46594013798</td>
          </tr>
          <tr>
            <th>Adres</th>
            <td>
              Dumlupınar Mah., Kayabaşı Sk., Özge Sitesi B Blok No: 17 B/H,
              16285 Nilüfer / Bursa
            </td>
          </tr>
          <tr>
            <th>E-posta</th>
            <td>
              <a href="mailto:studio@vorte.com.tr">studio@vorte.com.tr</a>
            </td>
          </tr>
          <tr>
            <th>Telefon</th>
            <td>0543 188 34 25</td>
          </tr>
          <tr>
            <th>Web Sitesi</th>
            <td>https://vortestudio.com</td>
          </tr>
        </tbody>
      </table>

      <h2>2. İşlenen Kişisel Veri Kategorileri</h2>
      <p>
        Vorte Studio tarafından sunulan web tasarım, yazılım geliştirme ve hosting
        hizmetleri kapsamında aşağıdaki kişisel veri kategorileri işlenmektedir:
      </p>
      <ul>
        <li>
          <strong>Kimlik bilgileri:</strong> Ad, soyad, unvan (kurumsal
          müşteriler için firma adı)
        </li>
        <li>
          <strong>İletişim bilgileri:</strong> E-posta adresi, telefon numarası,
          adres (sözleşme gerekli ise)
        </li>
        <li>
          <strong>Müşteri işlem bilgileri:</strong> Teklif talebi, paket
          seçimi, proje gereksinimleri, sözleşme bilgileri
        </li>
        <li>
          <strong>İşlem güvenliği bilgileri:</strong> IP adresi, tarayıcı
          bilgileri, oturum çerezleri, portal giriş kayıtları
        </li>
        <li>
          <strong>Finansal bilgiler:</strong> Fatura bilgileri, ödeme dekontları
          (IBAN havale/EFT aracılığıyla)
        </li>
        <li>
          <strong>İletişim içeriği:</strong> Portal üzerinden gönderdiğiniz
          mesajlar, e-posta yazışmaları, chatbot görüşme kayıtları
        </li>
      </ul>

      <h2>3. Kişisel Verilerin İşlenme Amaçları</h2>
      <p>Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
      <ul>
        <li>Talep ettiğiniz teklifin hazırlanması ve sunulması</li>
        <li>Hizmet sözleşmesinin kurulması ve ifa edilmesi</li>
        <li>Ödemelerin alınması ve faturalandırma</li>
        <li>Proje gereksinimlerinin karşılanması ve teslimat</li>
        <li>
          Sizinle iletişim kurulması (e-posta, telefon, portal mesajlaşma)
        </li>
        <li>Hosting, domain ve bakım hizmetlerinin sunulması</li>
        <li>
          Yasal yükümlülüklerimizin yerine getirilmesi (vergi, e-fatura,
          ETBİS vb.)
        </li>
        <li>
          Hizmet kalitemizi geliştirmek ve olası uyuşmazlıklarda kanıt sağlamak
        </li>
      </ul>

      <h2>4. Kişisel Verilerin İşlenmesinin Hukuki Sebebi</h2>
      <p>
        Kişisel verileriniz, KVKK&apos;nın 5. maddesinde düzenlenen aşağıdaki hukuki
        sebeplere dayanılarak işlenmektedir:
      </p>
      <ul>
        <li>
          <strong>m.5/2-c:</strong> Bir sözleşmenin kurulması veya ifasıyla
          doğrudan doğruya ilgili olması kaydıyla, sözleşmenin taraflarına ait
          kişisel verilerin işlenmesinin gerekli olması
        </li>
        <li>
          <strong>m.5/2-ç:</strong> Veri sorumlusunun hukuki yükümlülüğünü
          yerine getirebilmesi için zorunlu olması (vergi mevzuatı, ETBİS vb.)
        </li>
        <li>
          <strong>m.5/2-e:</strong> Bir hakkın tesisi, kullanılması veya
          korunması için veri işlemenin zorunlu olması
        </li>
        <li>
          <strong>m.5/2-f:</strong> İlgili kişinin temel hak ve özgürlüklerine
          zarar vermemek kaydıyla, veri sorumlusunun meşru menfaatleri için
          veri işlenmesinin zorunlu olması
        </li>
      </ul>

      <h2>5. Kişisel Verilerin Aktarıldığı Taraflar</h2>
      <p>
        Kişisel verileriniz, hizmetin sunulabilmesi için zorunlu olduğu ölçüde
        aşağıdaki taraflarla paylaşılmaktadır:
      </p>
      <ul>
        <li>
          <strong>Hosting sağlayıcısı:</strong> Türkiye&apos;de yerleşik VDS
          hizmet sağlayıcısı (hostingdunyam.com.tr). Veriler Türkiye
          sınırları içinde tutulur.
        </li>
        <li>
          <strong>E-posta sunucusu:</strong> Vorte Studio kontrolündeki
          kendi kurulumu mail sunucu (Türkiye).
        </li>
        <li>
          <strong>Yetkili kamu kurumları:</strong> Yasal düzenlemeler
          gereği talep edilmesi halinde (Gelir İdaresi, mahkemeler vb.).
        </li>
        <li>
          <strong>Muhasebe programı:</strong> Dia CRM üzerinden e-fatura ve
          muhasebe işlemleri (Türkiye).
        </li>
      </ul>
      <p>
        Kişisel verileriniz yurt dışına aktarılmamaktadır. Vorte Studio
        altyapısının tamamı Türkiye&apos;de yerleşiktir.
      </p>

      <h2>6. Kişisel Veri Toplama Yöntemi</h2>
      <p>Kişisel verileriniz aşağıdaki yöntemlerle toplanmaktadır:</p>
      <ul>
        <li>Web sitesindeki teklif talep formu ve chatbot görüşmeleri</li>
        <li>
          E-posta, telefon veya WhatsApp üzerinden yapılan doğrudan iletişim
        </li>
        <li>Müşteri portalı üzerinden iletilen mesajlar ve dosyalar</li>
        <li>Sözleşme imzalama sürecinde sağlanan bilgiler</li>
        <li>
          Otomatik yollarla (çerezler, IP kayıtları, oturum bilgileri)
        </li>
      </ul>

      <h2>7. Kişisel Verilerin Saklanma Süresi</h2>
      <p>
        Kişisel verileriniz, işleme amacının gerektirdiği süre boyunca ve ilgili
        mevzuatta öngörülen zamanaşımı süreleri (kural olarak 10 yıl) boyunca
        saklanır. Bu sürelerin sonunda silinir, yok edilir veya anonim hale
        getirilir.
      </p>

      <h2>8. İlgili Kişinin Hakları (KVKK m.11)</h2>
      <p>
        KVKK&apos;nın 11. maddesi uyarınca kişisel veri sahibi olarak aşağıdaki
        haklara sahipsiniz:
      </p>
      <ul>
        <li>Kişisel verinizin işlenip işlenmediğini öğrenme</li>
        <li>Kişisel veriniz işlenmişse buna ilişkin bilgi talep etme</li>
        <li>
          Kişisel verinizin işlenme amacını ve amaca uygun kullanılıp
          kullanılmadığını öğrenme
        </li>
        <li>
          Yurt içinde veya yurt dışında kişisel verinizin aktarıldığı üçüncü
          kişileri bilme
        </li>
        <li>
          Kişisel verinizin eksik veya yanlış işlenmiş olması halinde
          düzeltilmesini isteme
        </li>
        <li>
          KVKK&apos;da öngörülen şartlar çerçevesinde kişisel verinizin
          silinmesini veya yok edilmesini isteme
        </li>
        <li>
          Düzeltme, silme veya yok etme işlemlerinin kişisel verinizin
          aktarıldığı üçüncü kişilere bildirilmesini isteme
        </li>
        <li>
          İşlenen verilerin münhasıran otomatik sistemlerle analiz edilmesi
          suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme
        </li>
        <li>
          Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle
          zarara uğramanız halinde zararın giderilmesini talep etme
        </li>
      </ul>

      <h2>9. Başvuru Yolu</h2>
      <p>
        Yukarıda sayılan haklarınızı kullanmak için taleplerinizi Veri
        Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ&apos;e uygun olarak
        aşağıdaki kanallardan biriyle tarafımıza iletebilirsiniz:
      </p>
      <ul>
        <li>
          E-posta:{" "}
          <a href="mailto:studio@vorte.com.tr">studio@vorte.com.tr</a>
        </li>
        <li>
          Posta: Dumlupınar Mah., Kayabaşı Sk., Özge Sitesi B Blok No: 17 B/H,
          16285 Nilüfer / Bursa
        </li>
      </ul>
      <p>
        Başvurularınızda ad-soyad, T.C. kimlik numarası veya yabancılar için
        pasaport numarası, tebligat adresi, varsa e-posta adresi, telefon ve
        talep konunuzun açıkça belirtilmesi gerekmektedir. Talebiniz en geç
        30 gün içinde sonuçlandırılacaktır.
      </p>

      <h2>10. Değişiklikler</h2>
      <p>
        Vorte Studio, işbu aydınlatma metnini mevzuat değişiklikleri veya
        hizmet güncellemeleri doğrultusunda gerektiğinde güncelleyebilir.
        Güncel metin her zaman bu sayfada yayımlanır. Son güncelleme tarihi
        sayfa başında belirtilmektedir.
      </p>

      <div className="callout">
        Bu aydınlatma metnini okudum ve anladım.
      </div>
    </LegalLayout>
  );
}
