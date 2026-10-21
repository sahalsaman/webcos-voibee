import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Voibee Holidays",
    short_name: "Voibee",
    description: "Discover and book unforgettable travel experiences with Voibee Holidays.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffdf7",
    theme_color: "#0d4884",
    icons: [
      { src: "/icon?v=2", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon?v=2", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
