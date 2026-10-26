import { NextResponse } from "next/server";

async function proxy(request: Request, context: { params: Promise<{ path: string[] }> }) {
  const portalUrl = process.env.PORTAL_API_URL;
  const business = process.env.PORTAL_BUSINESS_SLUG;
  if (!portalUrl || !business) return NextResponse.json({ success: false, message: "Authentication service is not configured" }, { status: 503 });

  const { path } = await context.params;
  const url = new URL(`/api/auth/${path.map(encodeURIComponent).join("/")}`, `${portalUrl.replace(/\/$/, "")}/`);
  url.search = new URL(request.url).search;
  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  const cookie = request.headers.get("cookie");
  if (contentType) headers.set("content-type", contentType);
  if (cookie) headers.set("cookie", cookie);
  headers.set("x-business-slug", business);
  headers.set("x-portal-client", "tenant-website");

  const response = await fetch(url, {
    method: request.method,
    headers,
    body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.arrayBuffer(),
    redirect: "manual",
    cache: "no-store",
  });

  return new NextResponse(response.body, { status: response.status, headers: response.headers });
}

export const GET = proxy;
export const POST = proxy;
