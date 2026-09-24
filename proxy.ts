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
  if (pathname === "/api" || pathname.startsWith("/api/")) {
    const base = process.env.PORTAL_API_URL;
    const slug = process.env.PORTAL_BUSINESS_SLUG;
    if (!base || !slug) return NextResponse.json({ message: "Portal connection is not configured" }, { status: 503 });
    const target = new URL(pathname + req.nextUrl.search, base);
    const forwarded = new Headers(req.headers);
    forwarded.set("x-business-slug", slug);
    return NextResponse.rewrite(target, { request: { headers: forwarded } });
  }
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const portal = process.env.NEXT_PUBLIC_PORTAL_URL;
    if (!portal) return new NextResponse("Portal URL is not configured", { status: 503 });
    return NextResponse.redirect(new URL(pathname + req.nextUrl.search, portal));
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
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
