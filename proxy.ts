import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname === "/login";
  const isPortalRoute = req.nextUrl.pathname.startsWith("/portal");
  const isPortalLogin = req.nextUrl.pathname === "/portal/giris";

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

  // Portal koruması
  if (isPortalRoute && !isPortalLogin) {
    if (!isLoggedIn || role !== "portal") {
      return NextResponse.redirect(new URL("/portal/giris", base));
    }
  }
  if (isPortalLogin && isLoggedIn && role === "portal") {
    return NextResponse.redirect(new URL("/portal/dashboard", base));
  }
});

export const config = {
  matcher: ["/admin/:path*", "/login", "/portal/:path*"],
};
