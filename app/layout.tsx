import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Voibee — Discover & Resell Unforgettable Trips",
    template: "%s · Voibee",
  },
  description:
    "Voibee is a travel marketplace where operators publish trips and partners resell them with white-label links to earn commissions.",
  keywords: [
    "travel",
    "trips",
    "tour packages",
    "travel marketplace",
    "white label travel",
    "reseller",
    "India tours",
  ],
  openGraph: {
    type: "website",
    siteName: "Voibee",
    title: "Voibee — Discover & Resell Unforgettable Trips",
    description:
      "Book curated trips or become a partner and earn by reselling travel packages.",
    url: appUrl,
  },
  twitter: { card: "summary_large_image" },
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
