import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Globe2, MapPin, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getHomeDestinations, isIndiaCountry } from "@/lib/data";
import { destinationImage } from "@/lib/images";
import { formatCurrencyForCountry } from "@/lib/utils";
import type { DestinationDTO } from "@/types";

export const metadata: Metadata = {
  title: "Destinations",
  description: "Explore Voibee domestic and international destinations with curated travel packages and transparent starting prices.",
};

type SP = Record<string, string | string[] | undefined>;

function str(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function hrefWithCountry(path: string, country?: string) {
  const code = country?.toUpperCase();
  return code ? `${path}${path.includes("?") ? "&" : "?"}c=${encodeURIComponent(code)}` : path;
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
        {showDomestic ? (
          <DestinationSection
            title="Domestic destinations"
            subtitle="Popular places across India for quick holidays, family trips and group escapes."
            destinations={homeDestinations.domestic}
            country={country}
          />
        ) : null}

        <DestinationSection
          title="International destinations"
          subtitle="Easy international escapes with curated packages and transparent starting prices."
          destinations={homeDestinations.international}
          country={country}
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
          <Link href={hrefWithCountry("/trips", country)}>
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
      href={hrefWithCountry(`/trips?destination=${encodeURIComponent(destination.title)}`, country)}
      className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={destination.images[0] || destinationImage(destination.title)}
          alt={destination.title}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {destination.featured ? <Badge variant="accent"><Sparkles className="size-3" /> Highlight</Badge> : null}
          {destination.popular ? <Badge variant="glass">Popular</Badge> : null}
        </div>
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="text-lg font-bold leading-tight">{destination.title}</h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-white/85">
            <MapPin className="size-3.5" /> {destination.country} ({destination.countryCode})
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 p-4">
        <div>
          <p className="text-xs text-muted-foreground">Starting from</p>
          <p className="text-lg font-bold">{formatCurrencyForCountry(destination.basePrice, country)}</p>
        </div>
        <span className="text-sm font-semibold text-primary">View trips</span>
      </div>
    </Link>
  );
}
