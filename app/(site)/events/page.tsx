import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getMajorEvents } from "@/lib/data";
import { destinationImage } from "@/lib/images";
import { formatDate } from "@/lib/utils";
import type { EventDTO } from "@/types";

export const metadata: Metadata = {
  title: "Major Events",
  description: "Explore major events, festivals, community trips and travel experiences curated by Voibee.",
};

type SP = Record<string, string | string[] | undefined>;

function str(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function hrefWithCountry(path: string, country?: string) {
  const code = country?.toUpperCase();
  return code ? `${path}${path.includes("?") ? "&" : "?"}c=${encodeURIComponent(code)}` : path;
}

function dateRange(event: EventDTO) {
  if (!event.endDate) return formatDate(event.startDate);
  const start = formatDate(event.startDate);
  const end = formatDate(event.endDate);
  return start === end ? start : `${start} - ${end}`;
}

export default async function EventsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const country = str(sp.c)?.toUpperCase();
  const events = await getMajorEvents(country);

  return (
    <main>
      <section className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge variant="glass" className="mb-4">
              <CalendarDays className="size-3.5" /> Upcoming experiences
            </Badge>
            <h1 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl">Major Events</h1>
            <p className="mt-3 text-muted-foreground sm:text-lg">
              Discover festivals, cultural gatherings and limited-season travel experiences curated for the Voibee community.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <Badge variant="secondary">{events.length} active events</Badge>
              <Badge variant="secondary">Curated by Voibee</Badge>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {events.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event._id} event={event} country={country} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={CalendarDays}
            title="No major events available"
            description="Active events added from admin will appear here."
          />
        )}
      </section>
    </main>
  );
}

function EventCard({ event, country }: { event: EventDTO; country?: string }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={event.images[0] || destinationImage(event.city || event.title)}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {event.featured ? <Badge variant="accent"><Sparkles className="size-3" /> Highlight</Badge> : null}
          {event.priceLabel ? <Badge variant="glass">{event.priceLabel}</Badge> : null}
        </div>
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h2 className="text-xl font-bold leading-tight">{event.title}</h2>
          <p className="mt-1 flex items-center gap-1 text-xs text-white/85">
            <MapPin className="size-3.5" /> {event.city}, {event.country}
          </p>
        </div>
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <CalendarDays className="size-4" /> {dateRange(event)}
        </div>
        {event.venue ? <p className="text-sm font-medium text-foreground">{event.venue}</p> : null}
        <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">{event.description}</p>
        <Button asChild variant="outline" className="w-full">
          <Link href={hrefWithCountry(event.href || "/trips", country)}>
            {event.ctaLabel || "Explore packages"} <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </article>
  );
}
