import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import "@/models";
import Trip from "@/models/Trip";
import PartnerTrip from "@/models/PartnerTrip";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.voibee.com/";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: appUrl, changeFrequency: "daily", priority: 1 },
    { url: `${appUrl}/trips`, changeFrequency: "daily", priority: 0.9 },
    { url: `${appUrl}/register`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${appUrl}/login`, changeFrequency: "monthly", priority: 0.3 },
  ];

  try {
    await connectDB();
    const [trips, partnerTrips] = await Promise.all([
      Trip.find({ status: "active" }).select("slug updatedAt").lean(),
      PartnerTrip.find({ active: true }).select("partnerSlug tripSlug updatedAt").lean(),
    ]);

    const tripRoutes: MetadataRoute.Sitemap = trips.map((t) => ({
      url: `${appUrl}/trips/${t.slug}`,
      lastModified: t.updatedAt as Date,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const wlRoutes: MetadataRoute.Sitemap = partnerTrips.map((p) => ({
      url: `${appUrl}/p/${p.partnerSlug}/${p.tripSlug}`,
      lastModified: p.updatedAt as Date,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    return [...staticRoutes, ...tripRoutes, ...wlRoutes];
  } catch {
    return staticRoutes;
  }
}
