import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.voibee.com";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Voibee Holidays | Discover & Book Unforgettable Tour Packages",
    template: "%s · Voibee Holidays",
  },
  description:
    "Explore curated holiday packages, custom family trips, and honeymoon tours with Voibee Holidays. Book your perfect getaway to Kerala, beautiful Indian destinations, and international hotspots at the best prices.",
  keywords: [
    "holiday packages",
    "book tour packages online",
    "Kerala tour packages",
    "family vacation packages",
    "honeymoon trips india",
    "best travel agency online",
    "customized trips india",
    "budget travel packages",
    "explore kerala tourism",
    "india tour planner",
  ],
  openGraph: {
    type: "website",
    siteName: "Voibee Holidays",
    title: "Voibee Holidays — Discover & Book Unforgettable Trips",
    description:
      "Your gateway to seamless travel. Discover handpicked holiday destinations, customized itineraries, and affordable family tour packages across India and Kerala.",
    url: appUrl,
    images: [
      {
        url: "/og-image.jpg", // Ensure you have a compelling banner image here
        width: 1200,
        height: 630,
        alt: "Voibee Holidays - Discover Beautiful Destinations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Voibee Holidays — Plan Your Next Dream Vacation",
    description: "Explore affordable, tailored tour packages for families, couples, and solo travelers. Start your next adventure with Voibee Holidays.",
    images: "/og-image.jpg"
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0060e6" },
    { media: "(prefers-color-scheme: dark)", color: "#000c1a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${jakarta.variable} h-full`}>
      <body className="min-h-full bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
