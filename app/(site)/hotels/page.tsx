import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, BedDouble, MapPin, Search, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getTrips } from "@/lib/data";
import { destinationImage } from "@/lib/images";
import { withCountryParam } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Verified Hotels & Stays",
  description: "Discover SafeStay verified hotels included in Voibee holiday packages across India and international destinations.",
};

type SP = Record<string, string | string[] | undefined>;
function one(value: string | string[] | undefined) { return Array.isArray(value) ? value[0] : value; }

export default async function HotelsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const params = await searchParams;
  const query = one(params.q)?.trim() ?? "";
  const country = one(params.c)?.toUpperCase();
  const result = await getTrips({ page: 1, pageSize: 100, sort: "rating" });
  const seen = new Set<string>();
  const properties = result.items.flatMap((trip) => trip.itinerary.flatMap((day) => (day.hotels ?? []).map((hotel) => ({
    ...hotel,
    destination: trip.destination,
    country: trip.country,
    packageTitle: trip.title,
    packageSlug: trip.slug,
  })))).filter((hotel) => {
    const key = `${hotel.name}|${hotel.destination}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    if (!query) return true;
    return `${hotel.name} ${hotel.destination} ${hotel.country} ${hotel.description}`.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-20">
        <Image src="/hero-experience.webp" alt="Verified hotel stays" fill priority sizes="100vw" className="object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-blue-950/45" />
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-blue-200"><ShieldCheck className="size-4" />SafeStay™ by Voibee</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Verified stays for better journeys</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">Explore properties included in active Voibee packages, with clear stay details and support throughout your trip.</p>
          </div>
          <form className="mt-8 flex max-w-3xl flex-col gap-3 rounded-2xl bg-white p-3 shadow-2xl sm:flex-row" action="/hotels">
            {country ? <input type="hidden" name="c" value={country} /> : null}
            <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-slate-50 px-4 text-slate-900"><MapPin className="size-5 shrink-0 text-primary" /><span className="sr-only">Search property or destination</span><input name="q" defaultValue={query} placeholder="Search hotel or destination" className="h-12 w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400" /></label>
            <Button type="submit" size="lg" className="h-12 rounded-xl px-6"><Search className="size-4" />Search stays</Button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">SafeStay collection</p><h2 className="mt-2 text-3xl font-extrabold">{query ? `Stays matching “${query}”` : "Hotels in our packages"}</h2><p className="mt-2 text-muted-foreground">{properties.length} {properties.length === 1 ? "property" : "properties"} found</p></div>{query ? <Button asChild variant="outline"><Link href={withCountryParam("/hotels", country)}>Clear search</Link></Button> : null}</div>

        {properties.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{properties.map((hotel) => <article key={`${hotel.name}-${hotel.destination}`} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><div className="relative aspect-[16/10] overflow-hidden bg-secondary"><Image src={hotel.image || destinationImage(hotel.destination)} alt={hotel.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />{hotel.verified !== false ? <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-extrabold text-primary shadow-md"><BadgeCheck className="size-4" />Voibee Verified</span> : null}</div><div className="p-5"><p className="flex items-center gap-1.5 text-sm font-semibold text-primary"><MapPin className="size-4" />{hotel.destination}, {hotel.country}</p><h3 className="mt-2 text-xl font-extrabold">{hotel.name}</h3>{hotel.description ? <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{hotel.description}</p> : null}<div className="mt-5 border-t pt-4"><p className="text-xs text-muted-foreground">Included in</p><p className="mt-1 truncate text-sm font-bold">{hotel.packageTitle}</p><Button asChild variant="outline" className="mt-4 w-full"><Link href={withCountryParam(`/packages/${hotel.packageSlug}`, country)}>View package</Link></Button></div></div></article>)}</div> : <EmptyState icon={BedDouble} title="No matching stays" description="Try another hotel name or destination, or browse all active packages." action={<Button asChild variant="gradient"><Link href={withCountryParam("/packages", country)}>Explore packages</Link></Button>} />}
      </section>

      <section className="border-y border-border bg-slate-50 px-4 py-12 sm:px-6 lg:px-8"><div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3"><div><ShieldCheck className="size-7 text-primary" /><h2 className="mt-3 text-xl font-extrabold">SafeStay™ reviewed</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Property identity and package stay details are reviewed before they receive the verified badge.</p></div><div><Sparkles className="size-7 text-primary" /><h2 className="mt-3 text-xl font-extrabold">Clear stay details</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">See the property, room or meal information supplied with each package itinerary.</p></div><div><BadgeCheck className="size-7 text-primary" /><h2 className="mt-3 text-xl font-extrabold">Voibee support</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Our team helps resolve confirmed-stay differences during your journey.</p></div></div></section>
    </main>
  );
}
