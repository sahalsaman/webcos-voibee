import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js 16 Proxy (formerly Middleware). Optimistic auth gate only — it just
 * checks for the presence of an Auth.js session cookie and redirects guests
 * away from protected areas. Authoritative role checks live in each dashboard
 * layout via `requireRole()` (see lib/session.ts).
 */
const PROTECTED = [/^\/admin(?:\/|$)/, /^\/partner(?:\/|$)/, /^\/traveler(?:\/|$)/];

function hasSessionCookie(req: NextRequest) {
  return (
    req.cookies.has("authjs.session-token") ||
    req.cookies.has("__Secure-authjs.session-token")
  );
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED.some((re) => re.test(pathname));

  if (isProtected && !hasSessionCookie(req)) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/partner/:path*", "/traveler/:path*"],
};
