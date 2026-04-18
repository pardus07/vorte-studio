import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const pathname = req.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/login";
  const isPortalRoute = pathname.startsWith("/portal");

  // Portal "public entry points" — unauthenticated kullanıcının erişmesi
  // GEREKEN sayfalar. Şifresini unutan kullanıcı zaten giriş yapamıyor,
  // middleware onu /portal/giris'e yönlendirirse sonsuz döngüye düşer.
  const isPortalPublic =
    pathname === "/portal/giris" ||
    pathname === "/portal/sifre-sifirla" ||
    pathname.startsWith("/portal/sifre/"); // token sayfası

  // NOT: redirect URL'lerinde `req.nextUrl`'yi base olarak kullanıyoruz.
  // `req.url` bazı Coolify/Traefik kurulumlarında internal origin'i (ya da
  // X-Forwarded-Host'u yanlış yorumlayıp www'yu düşürür) sızdırabiliyor.
  // `req.nextUrl` public host + protocol'ü koruyor.
  const base = req.nextUrl;

  // Admin koruması
  if (isAdminRoute && (!isLoggedIn || role !== "admin")) {
    return NextResponse.redirect(new URL("/login", base));
  }
  if (isLoginPage && isLoggedIn && role === "admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", base));
  }

  // Portal koruması (sadece private portal sayfaları için)
  if (isPortalRoute && !isPortalPublic) {
    if (!isLoggedIn || role !== "portal") {
      return NextResponse.redirect(new URL("/portal/giris", base));
    }
  }
  // Login sayfasındayken zaten portal role'üyle login'liyse dashboard'a at
  if (pathname === "/portal/giris" && isLoggedIn && role === "portal") {
    return NextResponse.redirect(new URL("/portal/dashboard", base));
  }
});

export const config = {
  matcher: ["/admin/:path*", "/login", "/portal/:path*"],
};
