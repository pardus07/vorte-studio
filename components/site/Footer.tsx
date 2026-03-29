export default function Footer() {
  return (
    <footer className="border-t border-border px-6 py-12 md:px-12">
      <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-between">
        {/* Branding */}
        <div className="text-center md:text-left">
          <div className="font-[family-name:var(--font-syne)] text-base font-extrabold text-white">
            VORTE<span className="text-accent">.</span>STUDIO
          </div>
          <p className="mt-2 max-w-xs text-xs leading-relaxed text-muted2">
            Next.js, Kotlin ve modern teknolojilerle dijital çözümler üreten yazılım stüdyosu.
          </p>
        </div>

        {/* Navigation */}
        <nav aria-label="Footer menüsü">
          <ul className="flex list-none gap-6 text-xs text-muted2">
            <li><a href="#hizmetler" className="transition-colors hover:text-white">Hizmetler</a></li>
            <li><a href="#portfolyo" className="transition-colors hover:text-white">Portfolyo</a></li>
            <li><a href="#surec" className="transition-colors hover:text-white">Süreç</a></li>
            <li><a href="#contact" className="transition-colors hover:text-white">İletişim</a></li>
          </ul>
        </nav>

        {/* Contact */}
        <address className="flex flex-col items-center gap-1.5 not-italic text-xs text-muted2 md:items-end">
          <a href="mailto:studio@vorte.com.tr" className="transition-colors hover:text-white">
            studio@vorte.com.tr
          </a>
          <span>Türkiye geneli &middot; Uzaktan hizmet</span>
        </address>
      </div>

      <div className="mt-8 border-t border-border pt-6 text-center text-[11px] text-muted2">
        &copy; {new Date().getFullYear()} Vorte Studio. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
