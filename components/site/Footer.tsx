export default function Footer() {
  return (
    <footer className="flex flex-col items-center justify-between gap-4 border-t border-border px-6 py-10 md:flex-row md:px-12">
      <div className="font-[family-name:var(--font-syne)] text-base font-extrabold text-white">
        VORTE<span className="text-accent">.</span>STUDIO
      </div>
      <div className="text-xs text-muted2">
        &copy; 2026 Vorte Studio &middot; studio.vorte.com.tr
      </div>
      <div className="text-xs text-muted2">
        Türkiye geneli &middot; Uzaktan hizmet
      </div>
    </footer>
  );
}
