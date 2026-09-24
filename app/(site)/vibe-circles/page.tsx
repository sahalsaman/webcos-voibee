import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Compass } from "lucide-react";
import { TripCard } from "@/components/trip/trip-card";
import { TripFilters } from "@/components/trip/trip-filters";
import { ThemeFilter } from "@/components/trip/theme-filter";
import { SearchBar } from "@/components/home/search-bar";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { getTripCategoryCounts, getTrips } from "@/lib/data";
import { destinationImage } from "@/lib/images";
import { VIBE_CIRCLE_TRIP_CATEGORIES, VIBE_CIRCLE_TRIP_CATEGORY_LABELS } from "@/lib/constants";

type SP = Record<string, string | string[] | undefined>;

export const metadata: Metadata = {
  title: "Voibee Vibe Circles",
  description: "Discover work escape, senior-care journeys, accessible holidays and bespoke private travel packages.",
};

function str(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function VibeCirclesPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(str(sp.page)) || 1);
  const requestedCategory = str(sp.category);
  const selectedCategory = VIBE_CIRCLE_TRIP_CATEGORY_LABELS.includes(requestedCategory as (typeof VIBE_CIRCLE_TRIP_CATEGORY_LABELS)[number])
    ? requestedCategory
    : undefined;
  const tripFilters = {
    q: str(sp.q),
    destination: str(sp.destination),
    country: str(sp.country),
    category: selectedCategory,
    categories: VIBE_CIRCLE_TRIP_CATEGORY_LABELS,
    startDate: str(sp.startDate),
    endDate: str(sp.endDate),
    minPrice: str(sp.minPrice) ? Number(str(sp.minPrice)) : undefined,
    maxPrice: str(sp.maxPrice) ? Number(str(sp.maxPrice)) : undefined,
  };
  const [result, categoryCounts] = await Promise.all([
    getTrips({
      ...tripFilters,
      sort: (str(sp.sort) as "newest" | "price-asc" | "price-desc" | "rating") || "newest",
      page,
      pageSize: 9,
    }),
    getTripCategoryCounts(tripFilters),
  ]);

  const linkParams: Record<string, string> = {};
  for (const key of ["q", "destination", "country", "category", "startDate", "endDate", "minPrice", "maxPrice", "sort", "view", "compare", "c"]) {
    const value = key === "category" ? selectedCategory : str(sp[key]);
    if (value) linkParams[key] = value;
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="relative mb-8 overflow-hidden rounded-[28px] bg-slate-950 px-6 py-16 text-white shadow-xl sm:px-10 lg:px-12">
          <Image src={destinationImage("Rishikesh")} alt="Voibee Vibe Circles" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-slate-950/65" />
          <div className="relative mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">Voibee Vibe Circles</h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/85 sm:text-base">
              Community, senior-care, accessible and bespoke private journeys designed around the way you want to travel.
            </p>
            <div className="mt-7 text-left"><SearchBar basePath="/vibe-circles" /></div>
            <div className="mt-5 text-left">
              <ThemeFilter
                basePath="/vibe-circles"
                selectedCategory={selectedCategory ?? ""}
                categoryCounts={categoryCounts}
                totalCount={Object.values(categoryCounts).reduce((sum, count) => sum + count, 0)}
                categories={VIBE_CIRCLE_TRIP_CATEGORIES}
              />
            </div>
          </div>
        </header>

        <TripFilters
          key={JSON.stringify(linkParams)}
          basePath="/vibe-circles"
          initialFilters={{
            q: str(sp.q) ?? "",
            destination: str(sp.destination) ?? "",
            category: selectedCategory ?? "",
            startDate: str(sp.startDate) ?? "",
            endDate: str(sp.endDate) ?? "",
            minPrice: str(sp.minPrice) ?? "",
            maxPrice: str(sp.maxPrice) ?? "",
            sort: str(sp.sort) ?? "newest",
            view: str(sp.view) ?? "grid",
            compare: str(sp.compare) ?? "",
          }}
        />

        {result.items.length ? (
          <>
            <div className={str(sp.view) === "list" ? "grid gap-6" : "grid gap-6 sm:grid-cols-2 xl:grid-cols-3"}>
              {result.items.map((trip) => <TripCard key={trip._id} trip={trip} view={str(sp.view) === "list" ? "list" : "grid"} />)}
            </div>
            <Pagination base="/vibe-circles" params={linkParams} page={result.page} totalPages={result.totalPages} />
          </>
        ) : (
          <EmptyState
            icon={Compass}
            title="No Vibe Circle packages match your filters"
            description="Try another destination, travel date or budget."
            action={<Button asChild variant="gradient"><Link href="/vibe-circles">Clear filters</Link></Button>}
          />
        )}
      </div>
    </main>
  );
}
