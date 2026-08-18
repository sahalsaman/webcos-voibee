import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import "@/models";
import Trip from "@/models/Trip";
import PartnerTrip from "@/models/PartnerTrip";
import Partner from "@/models/Partner";
import Destination from "@/models/Destination";
import { slugify } from "@/lib/utils";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.voibee.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: appUrl, changeFrequency: "daily", priority: 1 },
    { url: `${appUrl}/trips`, changeFrequency: "daily", priority: 0.9 },
    { url: `${appUrl}/strangers-camps`, changeFrequency: "daily", priority: 0.85 },
    { url: `${appUrl}/destinations`, changeFrequency: "daily", priority: 0.85 },
    { url: `${appUrl}/events`, changeFrequency: "daily", priority: 0.75 },
    { url: `${appUrl}/register`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${appUrl}/login`, changeFrequency: "monthly", priority: 0.3 },
  ];

  try {
    await connectDB();
    const [trips, destinations, partnerTrips, approvedPartners] = await Promise.all([
      Trip.find({ status: "active" }).select("slug images updatedAt").lean(),
      Destination.find({ status: "active" }).select("title images updatedAt").lean(),
      PartnerTrip.find({ active: true }).select("partnerSlug tripSlug updatedAt").lean(),
      Partner.find({ status: "approved" }).select("slug updatedAt").lean(),
    ]);

    const tripRoutes: MetadataRoute.Sitemap = trips.map((t) => ({
      url: `${appUrl}/trips/${t.slug}`,
      lastModified: t.updatedAt as Date,
      changeFrequency: "weekly",
      priority: 0.8,
      images: (t.images as string[]).map((image: string) => image.startsWith("http") ? image : `${appUrl}${image.startsWith("/") ? "" : "/"}${image}`),
    }));

    const destinationRoutes: MetadataRoute.Sitemap = destinations.map((destination) => ({
      url: `${appUrl}/destinations/${slugify(destination.title)}`,
      lastModified: destination.updatedAt as Date,
      changeFrequency: "weekly",
      priority: 0.85,
      images: (destination.images as string[]).map((image: string) => image.startsWith("http") ? image : `${appUrl}${image.startsWith("/") ? "" : "/"}${image}`),
    }));

    const activePartnerSlugs = new Set(partnerTrips.map((p) => p.partnerSlug));

    const partnerRoutes: MetadataRoute.Sitemap = approvedPartners
      .filter((partner) => activePartnerSlugs.has(partner.slug))
      .map((partner) => ({
        url: `${appUrl}/p/${partner.slug}`,
        lastModified: partner.updatedAt as Date,
        changeFrequency: "weekly",
        priority: 0.65,
      }));

    const wlRoutes: MetadataRoute.Sitemap = partnerTrips.map((p) => ({
      url: `${appUrl}/p/${p.partnerSlug}/${p.tripSlug}`,
      lastModified: p.updatedAt as Date,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    return [...staticRoutes, ...destinationRoutes, ...tripRoutes, ...partnerRoutes, ...wlRoutes];
  } catch {
    return staticRoutes;
  }
}
