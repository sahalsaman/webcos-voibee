import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Compass, Link2, MapPin } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { TripCard } from "@/components/trip/trip-card";
import { ThemeToggle } from "@/components/theme-toggle";
import { getPartnerStorefront } from "@/lib/data";
import { appConfig } from "@/app/app,config";

const BANNER_FALLBACK =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=70";

type Props = {
  params: Promise<{ partner: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function str(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function hrefWithCountry(path: string, country?: string) {
  return country ? `${path}${path.includes("?") ? "&" : "?"}c=${encodeURIComponent(country)}` : path;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { partner } = await params;
  const storefront = await getPartnerStorefront(partner);
  if (!storefront) return { title: "Partner not found" };

  const title = `${storefront.partner.businessName} trips`;
  const description = `Browse selected trips from ${storefront.partner.businessName} on ${appConfig.appName}.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: storefront.partner.bannerImage ? [{ url: storefront.partner.bannerImage }] : undefined,
    },
  };
}

export default async function PartnerStorefrontPage({ params, searchParams }: Props) {
  const [{ partner }, sp] = await Promise.all([params, searchParams]);
  const country = str(sp.c)?.toUpperCase();
  const storefront = await getPartnerStorefront(partner);
  if (!storefront) notFound();

  const { partner: biz, links } = storefront;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 glass border-b border-border/70 bg-card/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {biz.logo || biz.profileImage ? (
              <Avatar src={biz.logo || biz.profileImage} name={biz.businessName} size={40} />
            ) : (
              <span className="flex size-10 items-center justify-center rounded-xl bg-brand-gradient font-bold text-white">
                {biz.businessName.charAt(0)}
              </span>
            )}
            <div>
              <p className="font-bold leading-tight">{biz.businessName}</p>
              <p className="text-xs text-muted-foreground">{biz.partnerType}</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="relative h-52 w-full sm:h-64">
        <Image
          src={biz.bannerImage || BANNER_FALLBACK}
          alt={biz.businessName}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/20" />
      </div>

      <main className="mx-auto -mt-14 w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8">
        <section className="mt-5 py-10">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Our Packages</h2>
              {/* <p className="text-sm text-muted-foreground">Trips available from {biz.businessName}</p> */}
            </div>
          </div>

          {links.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {links.map((link) => {
                const trip = link.trip!;
                const price = link.sellingPrice || trip.basePrice + link.commission;
                return (
                  <div key={link._id} className="relative">
                    <TripCard
                      trip={trip}
                      href={hrefWithCountry(`/p/${partner}/${link.tripSlug}`, country)}
                      priceOverride={price}
                      priceLabel="Partner price"
                    />
                    <div className="pointer-events-none absolute right-3 top-3 z-10 flex flex-col items-end gap-2">
                      <span className="rounded-full border border-white/25 bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                        <MapPin className="mr-1 inline size-3" /> {trip.destination}
                      </span>
                      {!link.active ? (
                        <span className="rounded-full border border-amber-200/40 bg-amber-500/90 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                          Link inactive
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={Link2}
              title="No selected trips yet"
              description={`${biz.businessName} has not published active trip links yet.`}
            />
          )}
        </section>
      </main>

      <footer className="mt-auto border-t border-border bg-card py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} {biz.businessName}</p>
          <Link href={hrefWithCountry("/", country)} className="flex items-center gap-1.5 font-medium hover:text-foreground">
            <Compass className="size-4 text-primary" /> Powered by {appConfig.appName}
          </Link>
        </div>
      </footer>
    </div>
  );
}
