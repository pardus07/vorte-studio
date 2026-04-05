import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname === "/login";
  const isPortalRoute = req.nextUrl.pathname.startsWith("/portal");
  const isPortalLogin = req.nextUrl.pathname === "/portal/giris";

  // Admin koruması
  if (isAdminRoute && (!isLoggedIn || role !== "admin")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (isLoginPage && isLoggedIn && role === "admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  // Portal koruması
  if (isPortalRoute && !isPortalLogin) {
    if (!isLoggedIn || role !== "portal") {
      return NextResponse.redirect(new URL("/portal/giris", req.url));
    }
  }
  if (isPortalLogin && isLoggedIn && role === "portal") {
    return NextResponse.redirect(new URL("/portal/dashboard", req.url));
  }
});

export const config = {
  matcher: ["/admin/:path*", "/login", "/portal/:path*"],
};
