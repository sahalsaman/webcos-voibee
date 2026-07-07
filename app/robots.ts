import type { MetadataRoute } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.voibee.com/";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/partner", "/traveler", "/api"],
    },
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
