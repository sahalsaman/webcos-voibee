import { portalCall } from "@/lib/portal-client";
import type { MetadataRoute } from "next";
import { slugify } from "@/lib/utils";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.voibee.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: appUrl, changeFrequency: "daily", priority: 1 },
    { url: `${appUrl}/packages`, changeFrequency: "daily", priority: 0.9 },
    { url: `${appUrl}/vibe-circles`, changeFrequency: "daily", priority: 0.85 },
    { url: `${appUrl}/destinations`, changeFrequency: "daily", priority: 0.85 },
    { url: `${appUrl}/register`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${appUrl}/login`, changeFrequency: "monthly", priority: 0.3 },
  ];

  try {
    const { trips, destinations, partnerTrips, approvedPartners } = await portalCall<{
      trips: { slug: string; images: string[]; updatedAt: string }[];
      destinations: { title: string; images: string[]; updatedAt: string }[];
      partnerTrips: { partnerSlug: string; tripSlug: string; updatedAt: string }[];
      approvedPartners: { slug: string; updatedAt: string }[];
    }>("getSitemapRecords");

    const tripRoutes: MetadataRoute.Sitemap = trips.map((t) => ({
      url: `${appUrl}/packages/${t.slug}`,
      lastModified: t.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
      images: (t.images as string[]).map((image: string) => image.startsWith("http") ? image : `${appUrl}${image.startsWith("/") ? "" : "/"}${image}`),
    }));

    const destinationRoutes: MetadataRoute.Sitemap = destinations.map((destination) => ({
      url: `${appUrl}/destinations/${slugify(destination.title)}`,
      lastModified: destination.updatedAt,
      changeFrequency: "weekly",
      priority: 0.85,
      images: (destination.images as string[]).map((image: string) => image.startsWith("http") ? image : `${appUrl}${image.startsWith("/") ? "" : "/"}${image}`),
    }));

    const activePartnerSlugs = new Set(partnerTrips.map((p) => p.partnerSlug));

    const partnerRoutes: MetadataRoute.Sitemap = approvedPartners
      .filter((partner) => activePartnerSlugs.has(partner.slug))
      .map((partner) => ({
        url: `${appUrl}/p/${partner.slug}`,
        lastModified: partner.updatedAt,
        changeFrequency: "weekly",
        priority: 0.65,
      }));

    const wlRoutes: MetadataRoute.Sitemap = partnerTrips.map((p) => ({
      url: `${appUrl}/p/${p.partnerSlug}/${p.tripSlug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    return [...staticRoutes, ...destinationRoutes, ...tripRoutes, ...partnerRoutes, ...wlRoutes];
  } catch {
    return staticRoutes;
  }
}
