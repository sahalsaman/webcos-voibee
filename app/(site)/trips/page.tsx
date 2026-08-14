import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Compass } from "lucide-react";
import { DestinationPackageSections } from "@/components/trip/destination-package-sections";
import { TripCard } from "@/components/trip/trip-card";
import { TripFilters } from "@/components/trip/trip-filters";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { getDestinations, getTrips } from "@/lib/data";
import { destinationImage } from "@/lib/images";
import type { DestinationDTO, TripDTO } from "@/types";

export const metadata: Metadata = {
  title: "Explore Packages",
  description:
    "Browse curated travel packages across India and beyond. Filter by destination, budget and package type.",
};

type SP = Record<string, string | string[] | undefined>;

function str(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

function groupPackagesByDestination(packages: TripDTO[], destinations: DestinationDTO[]) {
  const destinationNames = new Map(destinations.map((destination) => [destination.title.toLowerCase(), destination.title]));
  const groups = new Map<string, TripDTO[]>();

  for (const item of packages) {
    const destination = destinationNames.get(item.destination.toLowerCase()) ?? item.destination;
    groups.set(destination, [...(groups.get(destination) ?? []), item]);
  }

  const orderedDestinations = [
    ...destinations.map((destination) => destination.title),
    ...Array.from(groups.keys()),
  ];
  const seen = new Set<string>();

  return orderedDestinations
    .filter((destination) => {
      const key = destination.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((destination) => ({ destination, packages: groups.get(destination) ?? [] }))
    .filter((section) => section.packages.length > 0);
}

export default async function TripsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(str(sp.page)) || 1);
  const country = str(sp.c);
  const selectedDestinationName = str(sp.destination);
  const hasActiveFilters = Boolean(
    str(sp.q) ||
      selectedDestinationName ||
      str(sp.country) ||
      str(sp.category) ||
      str(sp.startDate) ||
      str(sp.endDate) ||
      str(sp.minPrice) ||
      str(sp.maxPrice) ||
      (str(sp.sort) && str(sp.sort) !== "newest"),
  );
  const showGroupedPackages = !hasActiveFilters;

  const [result, destinations] = await Promise.all([
    getTrips({
    q: str(sp.q),
    destination: str(sp.destination),
    country: str(sp.country),
    category: str(sp.category),
    startDate: str(sp.startDate),
    endDate: str(sp.endDate),
    minPrice: str(sp.minPrice) ? Number(str(sp.minPrice)) : undefined,
    maxPrice: str(sp.maxPrice) ? Number(str(sp.maxPrice)) : undefined,
    sort: (str(sp.sort) as "newest") || "newest",
    page,
    pageSize: showGroupedPackages ? 80 : 9,
  }),
    getDestinations(country),
  ]);

  const selectedDestination = selectedDestinationName
    ? destinations.find((destination) => destination.title.toLowerCase() === selectedDestinationName.toLowerCase())
    : undefined;
  const heroTitle = selectedDestinationName ? `${selectedDestination?.title ?? selectedDestinationName} Packages` : "Explore Packages";
  const heroImage = selectedDestination
    ? selectedDestination.images[0] || destinationImage(selectedDestination.title)
    : destinationImage("Goa");
  const heroDescription = selectedDestinationName
    ? selectedDestination?.description || `Explore curated holiday packages for ${selectedDestination?.title ?? selectedDestinationName}.`
    : "Browse curated travel packages across India and beyond. Filter by destination, budget and package type.";
  const destinationSections = showGroupedPackages ? groupPackagesByDestination(result.items, destinations) : [];

  // Flatten current filters into a clean param map for pagination links.
  const linkParams: Record<string, string> = {};
  for (const k of ["q", "destination", "country", "category", "startDate", "endDate", "minPrice", "maxPrice", "sort", "c"]) {
    const v = str(sp[k]);
    if (v) linkParams[k] = v;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {showGroupedPackages ? (
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Holiday Packages</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Explore curated packages grouped by destination.
          </p>
        </header>
      ) : (
      <header className="relative mb-8 overflow-hidden rounded-[28px] bg-slate-950 px-6 py-16 text-white shadow-xl sm:px-10 lg:px-12">
        <Image
          src={heroImage}
          alt={heroTitle}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/86 via-slate-950/48 to-slate-950/12" />
        <div className="relative max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sky-200">Holiday Packages</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight sm:text-5xl">{heroTitle}</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-100 sm:text-lg">
            {heroDescription}
          </p>
          <p className="mt-5 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/25 backdrop-blur">
            {result.total} {result.total === 1 ? "package" : "packages"} ready to book
          </p>
        </div>
      </header>
      )}

      {showGroupedPackages ? (
        destinationSections.length > 0 ? (
          <DestinationPackageSections sections={destinationSections} country={country} />
        ) : (
          <EmptyState
            icon={Compass}
            title="No packages available"
            description="Active packages added from admin will appear here by destination."
            action={
              <Button asChild variant="gradient">
                <Link href="/destinations">Explore destinations</Link>
              </Button>
            }
          />
        )
      ) : (
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside>
          <TripFilters
            key={JSON.stringify(linkParams)}
            destinations={destinations.map((d) => d.title)}
            initialFilters={{
              q: str(sp.q) ?? "",
              destination: str(sp.destination) ?? "",
              category: str(sp.category) ?? "",
              startDate: str(sp.startDate) ?? "",
              endDate: str(sp.endDate) ?? "",
              minPrice: str(sp.minPrice) ?? "",
              maxPrice: str(sp.maxPrice) ?? "",
              sort: str(sp.sort) ?? "newest",
            }}
          />
        </aside>

        <div>
          {result.items.length > 0 ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {result.items.map((trip) => (
                  <TripCard key={trip._id} trip={trip} />
                ))}
              </div>
              <Pagination
                base="/packages"
                params={linkParams}
                page={result.page}
                totalPages={result.totalPages}
              />
            </>
          ) : (
            <EmptyState
              icon={Compass}
              title="No packages match your filters"
              description="Try widening your budget or clearing some filters to see more results."
              action={
                <Button asChild variant="gradient">
                  <Link href="/packages">Clear filters</Link>
                </Button>
              }
            />
          )}
        </div>
      </div>
      )}
    </div>
  );
}
