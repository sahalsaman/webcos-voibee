import type { Metadata } from "next";
import { Compass } from "lucide-react";
import { TripCard } from "@/components/trip/trip-card";
import { TripFilters } from "@/components/trip/trip-filters";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { getTrips } from "@/lib/data";

export const metadata: Metadata = {
  title: "Explore Trips",
  description:
    "Browse curated travel packages across India and beyond. Filter by destination, budget and trip type.",
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

  const result = await getTrips({
    q: str(sp.q),
    destination: str(sp.destination),
    category: str(sp.category),
    minPrice: str(sp.minPrice) ? Number(str(sp.minPrice)) : undefined,
    maxPrice: str(sp.maxPrice) ? Number(str(sp.maxPrice)) : undefined,
    sort: (str(sp.sort) as "newest") || "newest",
    page,
    pageSize: 9,
  });

  // Flatten current filters into a clean param map for pagination links.
  const linkParams: Record<string, string> = {};
  for (const k of ["q", "destination", "category", "minPrice", "maxPrice", "sort"]) {
    const v = str(sp[k]);
    if (v) linkParams[k] = v;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Explore Trips</h1>
        <p className="mt-1 text-muted-foreground">
          {result.total} {result.total === 1 ? "trip" : "trips"} ready to book
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside>
          <TripFilters />
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
                base="/trips"
                params={linkParams}
                page={result.page}
                totalPages={result.totalPages}
              />
            </>
          ) : (
            <EmptyState
              icon={Compass}
              title="No trips match your filters"
              description="Try widening your budget or clearing some filters to see more results."
              action={
                <Button asChild variant="gradient">
                  <a href="/trips">Clear filters</a>
                </Button>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
