import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Globe2, MapPin, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getHomeDestinations, isIndiaCountry } from "@/lib/data";
import { destinationImage } from "@/lib/images";
import { formatCurrencyForCountry, slugify, withCountryParam as hrefWithCountry } from "@/lib/utils";
import type { DestinationDTO } from "@/types";
import { DestinationSwitcher } from "@/components/site/destination-switcher";

export const metadata: Metadata = {
  title: "Destinations",
  description: "Explore Voibee domestic and international destinations with curated travel packages and transparent starting prices.",
};

type SP = Record<string, string | string[] | undefined>;

function str(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function DestinationsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const country = str(sp.c)?.toUpperCase();
  const showDomestic = isIndiaCountry(country);
  const homeDestinations = await getHomeDestinations(country);
  const total = homeDestinations.domestic.length + homeDestinations.international.length;

  return (
    <main>
      <section className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge variant="glass" className="mb-4">
              <Globe2 className="size-3.5" /> Explore destinations
            </Badge>
            <h1 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl">Destinations</h1>
            <p className="mt-3 text-muted-foreground sm:text-lg">
              {showDomestic
                ? "Browse India favorites and international getaways available on Voibee."
                : "Browse international getaways curated for your location."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <Badge variant="secondary">{total} active destinations</Badge>
              {showDomestic ? <Badge variant="secondary">Domestic and international</Badge> : <Badge variant="secondary">International only</Badge>}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
        <DestinationSwitcher
          hasIndia={showDomestic && homeDestinations.domestic.length > 0}
          india={<DestinationSection title="India destinations" subtitle="Popular places across India for quick holidays, family packages and group escapes." destinations={homeDestinations.domestic} country={country} />}
          global={<DestinationSection title="Global Escapes" subtitle="International escapes with curated packages and transparent starting prices." destinations={homeDestinations.international} country={country} />}
        />

        {total === 0 ? (
          <EmptyState
            icon={MapPin}
            title="No destinations available"
            description="Active destinations added from admin will appear here."
          />
        ) : null}
      </section>
    </main>
  );
}

function DestinationSection({
  title,
  subtitle,
  destinations,
  country,
}: {
  title: string;
  subtitle: string;
  destinations: DestinationDTO[];
  country?: string;
}) {
  if (!destinations.length) return null;

  return (
    <section>
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={hrefWithCountry("/packages", country)}>
            View packages <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {destinations.map((destination) => (
          <DestinationCard key={destination._id} destination={destination} country={country} />
        ))}
      </div>
    </section>
  );
}

function DestinationCard({ destination, country }: { destination: DestinationDTO; country?: string }) {
  return (
    <Link
      href={hrefWithCountry(`/destinations/${slugify(destination.title)}`, country)}
      className="group overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[5/4] overflow-hidden">
        <Image
          src={destination.images[0] || destinationImage(destination.title)}
          alt={destination.title}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/5 transition-colors group-hover:from-black/75" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {destination.featured ? <Badge className="border-white/20 bg-white/90 text-foreground shadow-sm"><Sparkles className="size-3 text-primary" /> Featured</Badge> : null}
          {destination.popular ? <Badge className="border-white/15 bg-primary text-primary-foreground shadow-sm">Popular</Badge> : null}
        </div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-white/80">
            <MapPin className="size-3.5 text-primary-foreground" /> {destination.country}
          </p>
          <h3 className="text-xl font-extrabold leading-tight tracking-tight">{destination.title}</h3>
        </div>
      </div>
      <div className="p-4">
        {destination.tags.length ? (
          <div className="mb-4 flex min-h-6 flex-wrap gap-1.5">
            {destination.tags.slice(0, 2).map((tag) => <Badge key={tag} variant="secondary" className="font-medium">{tag}</Badge>)}
            {destination.tags.length > 2 ? <Badge variant="outline">+{destination.tags.length - 2}</Badge> : null}
          </div>
        ) : null}
        <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Packages from</p>
            <p className="mt-0.5 text-lg font-extrabold text-foreground">{formatCurrencyForCountry(destination.basePrice, country)}</p>
          </div>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            <span className="sr-only">View {destination.title} packages</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
