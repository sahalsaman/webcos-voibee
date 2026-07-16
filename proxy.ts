import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js 16 Proxy (formerly Middleware). Optimistic auth gate only — it just
 * checks for the presence of an Auth.js session cookie and redirects guests
 * away from protected areas. Authoritative role checks live in each dashboard
 * layout via `requireRole()` (see lib/session.ts).
 */
const PROTECTED = [/^\/admin(?:\/|$)/, /^\/partner(?:\/|$)/, /^\/traveler(?:\/|$)/];
const COUNTRY_HEADERS = [
  "x-vercel-ip-country",
  "cf-ipcountry",
  "cloudfront-viewer-country",
  "x-country-code",
];
const PUBLIC_FILE = /\.(?:.*)$/;

function hasSessionCookie(req: NextRequest) {
  return (
    req.cookies.has("authjs.session-token") ||
    req.cookies.has("__Secure-authjs.session-token")
  );
}

function countryCode(req: NextRequest) {
  for (const header of COUNTRY_HEADERS) {
    const value = req.headers.get(header)?.trim().toUpperCase();
    if (value && /^[A-Z]{2}$/.test(value)) return value;
  }

  return "IN";
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    req.method === "GET" &&
    !req.nextUrl.searchParams.has("c") &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/_next") &&
    !PUBLIC_FILE.test(pathname)
  ) {
    const url = req.nextUrl.clone();
    url.searchParams.set("c", countryCode(req));
    return NextResponse.redirect(url);
  }

  const isProtected = PROTECTED.some((re) => re.test(pathname));

  if (isProtected && !hasSessionCookie(req)) {
    const url = new URL("/login", req.url);
    url.searchParams.set("c", req.nextUrl.searchParams.get("c") ?? countryCode(req));
    url.searchParams.set("callbackUrl", `${pathname}${req.nextUrl.search}`);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
