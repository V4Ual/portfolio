import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_dev_32_characters_long_min";
const secretKey = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME = "portfolio_admin_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only intercept /admin routes
  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";
    const token = request.cookies.get(COOKIE_NAME)?.value;

    let isAuthenticated = false;

    if (token) {
      try {
        await jwtVerify(token, secretKey);
        isAuthenticated = true;
      } catch {
        isAuthenticated = false;
      }
    }

    // If trying to access login page while already logged in -> redirect to /admin
    if (isLoginPage) {
      if (isAuthenticated) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    // If trying to access protected admin page while not logged in -> redirect to /admin/login
    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
