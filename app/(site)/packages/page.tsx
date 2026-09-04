import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Compass } from "lucide-react";
import { TripCard } from "@/components/trip/trip-card";
import { TripFilters } from "@/components/trip/trip-filters";
import { SearchBar } from "@/components/home/search-bar";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { getDestinations, getTripCategoryCounts, getTrips } from "@/lib/data";
import { destinationImage } from "@/lib/images";

export const metadata: Metadata = {
  title: "Holiday Packages",
  description:
    "Browse curated travel packages across India and beyond. Filter by destination, budget and package type.",
  alternates: { canonical: "/packages" },
  openGraph: {
    title: "Holiday Packages | Voibee Holidays",
    description: "Browse curated travel packages across India and beyond, including Goa packages, family holidays and group trips.",
    url: "/packages",
  },
};

type SP = Record<string, string | string[] | undefined>;

function str(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
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
  const tripFilters = {
    q: str(sp.q),
    destination: str(sp.destination),
    country: str(sp.country),
    category: str(sp.category),
    startDate: str(sp.startDate),
    endDate: str(sp.endDate),
    minPrice: str(sp.minPrice) ? Number(str(sp.minPrice)) : undefined,
    maxPrice: str(sp.maxPrice) ? Number(str(sp.maxPrice)) : undefined,
  };
  const [result, destinations, categoryCounts] = await Promise.all([
    getTrips({
    ...tripFilters,
    sort: (str(sp.sort) as "newest") || "newest",
    page,
    pageSize: 9,
  }),
    getDestinations(country),
    getTripCategoryCounts(tripFilters),
  ]);

  const selectedDestination = selectedDestinationName
    ? destinations.find((destination) => destination.title.toLowerCase() === selectedDestinationName.toLowerCase())
    : undefined;
  const heroTitle = "Tour Packages";
  const heroImage = selectedDestination
    ? selectedDestination.images[0] || destinationImage(selectedDestination.title)
    : destinationImage("Goa");
  // Flatten current filters into a clean param map for pagination links.
  const linkParams: Record<string, string> = {};
  for (const k of ["q", "destination", "country", "category", "startDate", "endDate", "minPrice", "maxPrice", "sort", "view", "compare", "c"]) {
    const v = str(sp[k]);
    if (v) linkParams[k] = v;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="relative mb-8 overflow-hidden rounded-[28px] bg-slate-950 px-6 py-16 text-white shadow-xl sm:px-10 lg:px-12">
        <Image
          src={heroImage}
          alt={heroTitle}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/60" />
        <div className="relative mx-auto max-w-3xl text-center">
          <h1 className="mt-3 text-4xl font-extrabold leading-tight sm:text-5xl">{heroTitle}</h1>
       
          <div className="mt-7 text-left">
            <SearchBar />
          </div>
          
        </div>
      </header>

      <TripFilters
        key={JSON.stringify(linkParams)}
        initialFilters={{
          q: str(sp.q) ?? "",
          destination: str(sp.destination) ?? "",
          category: str(sp.category) ?? "",
          startDate: str(sp.startDate) ?? "",
          endDate: str(sp.endDate) ?? "",
          minPrice: str(sp.minPrice) ?? "",
          maxPrice: str(sp.maxPrice) ?? "",
          sort: str(sp.sort) ?? "newest",
          view: str(sp.view) ?? "grid",
          compare: str(sp.compare) ?? "",
        }}
        categoryCounts={categoryCounts}
        totalCount={Object.values(categoryCounts).reduce((sum, count) => sum + count, 0)}
      />

      <div>
          {result.items.length > 0 ? (
            <>
              <div className={str(sp.view) === "list" ? "grid gap-6" : "grid gap-6 sm:grid-cols-2 xl:grid-cols-3"}>
                {result.items.map((trip) => (
                  <TripCard key={trip._id} trip={trip} view={str(sp.view) === "list" ? "list" : "grid"} />
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
  );
}
