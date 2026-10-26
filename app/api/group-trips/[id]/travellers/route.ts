import { NextResponse } from "next/server";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Context) {
  const portalUrl = process.env.PORTAL_API_URL;
  const business = process.env.PORTAL_BUSINESS_SLUG;
  if (!portalUrl || !business) return NextResponse.json({ success: false, message: "Travel service is not configured" }, { status: 503 });

  const { id } = await params;
  const headers = new Headers({ "x-business-slug": business, "x-portal-client": "tenant-website" });
  const cookie = request.headers.get("cookie");
  if (cookie) headers.set("cookie", cookie);
  const response = await fetch(new URL(`/api/storefront/group-trips/${encodeURIComponent(id)}/travellers`, `${portalUrl.replace(/\/$/, "")}/`), {
    headers,
    cache: "no-store",
  });
  return new NextResponse(response.body, { status: response.status, headers: response.headers });
}
