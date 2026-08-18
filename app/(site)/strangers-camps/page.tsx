import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, UsersRound } from "lucide-react";
import { TripCard } from "@/components/trip/trip-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getTrips } from "@/lib/data";
import { destinationImage } from "@/lib/images";

type SP = Record<string, string | string[] | undefined>;

export const metadata: Metadata = {
  title: "Strangers Camps",
  description: "Explore Voibee Strangers category camps and group travel packages curated for meeting new travel buddies.",
};

function str(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function hrefWithCountry(path: string, country?: string) {
  const code = country?.toUpperCase();
  return code ? `${path}${path.includes("?") ? "&" : "?"}c=${encodeURIComponent(code)}` : path;
}

export default async function StrangersCampsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const country = str(sp.c)?.toUpperCase();
  const [strangersResult, legacySoloResult] = await Promise.all([
    getTrips({ category: "Strangers", sort: "newest", page: 1, pageSize: 60 }),
    getTrips({ category: "Solo", sort: "newest", page: 1, pageSize: 60 }),
  ]);
  const seenSlugs = new Set<string>();
  const packages = [...strangersResult.items, ...legacySoloResult.items].filter((trip) => {
    if (seenSlugs.has(trip.slug)) return false;
    seenSlugs.add(trip.slug);
    return true;
  });
  const total = packages.length;

  return (
    <main>
      <section className="relative overflow-hidden border-b border-border bg-slate-950 text-white">
        <Image
          src={destinationImage("Rishikesh")}
          alt="Strangers Camps"
          fill
          priority
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/92 via-slate-950/62 to-slate-950/20" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <Badge variant="glass" className="mb-4">
              <UsersRound className="size-3.5" /> Strangers category
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Strangers Camps</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-100 sm:text-lg">
              Join fixed-date camps and group packages designed for travelers who want to meet new people, share plans and start the trip together.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Badge variant="glass">{total} {total === 1 ? "package" : "packages"}</Badge>
              <Badge variant="glass">Fixed departures</Badge>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Strangers Camps</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Available camp packages</h2>
          </div>
          <Button asChild variant="outline">
            <Link href={hrefWithCountry("/trips?category=Strangers", country)}>
              View with filters <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        {packages.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((trip) => (
              <TripCard
                key={trip._id}
                trip={trip}
                href={hrefWithCountry(`/trips/${trip.slug}`, country)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Compass}
            title="No Strangers Camps available"
            description="Active packages with Strangers category added from admin will appear here."
            action={
              <Button asChild variant="gradient">
                <Link href={hrefWithCountry("/trips", country)}>Explore all packages</Link>
              </Button>
            }
          />
        )}
      </section>
    </main>
  );
}
