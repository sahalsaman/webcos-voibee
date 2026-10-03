import Image from "next/image";
import { BedDouble, BusFront, MapPin, Sparkles, Utensils } from "lucide-react";
import type { ItineraryItem } from "@/types";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=75";

/**
 * A calm, package-first itinerary for regular holidays. Vibe Circle trips use
 * the richer DetailedItinerary component with moment highlights and schedules.
 */
export function HolidayItinerary({ days }: { days: ItineraryItem[] }) {
  return (
    <section>
      <div className="mb-6"><p className="text-sm font-semibold text-primary">Your journey</p><h2 className="mt-1 text-2xl font-bold">Holiday plan</h2></div>
      <div className="space-y-4">
        {days.map((day, index) => <HolidayDay key={`${day.day}-${index}`} day={day} index={index} />)}
      </div>
    </section>
  );
}

function HolidayDay({ day, index }: { day: ItineraryItem; index: number }) {
  const places = [
    ...(day.sightseeing ?? []).map((item) => ({ ...item, kind: "Sightseeing" as const })),
    ...(day.activity ?? []).map((item) => ({ ...item, kind: "Experience" as const })),
  ];

  return <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
    <div className="flex items-start gap-4 border-b border-border bg-secondary/25 p-4 sm:p-5">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary font-extrabold text-primary-foreground">{index + 1}</span>
      <div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Day {index + 1}</p><h3 className="mt-1 text-lg font-bold text-slate-950 sm:text-xl">{day.title}</h3>{day.description ? <p className="mt-2 leading-6 text-muted-foreground">{day.description}</p> : null}</div>
    </div>

    <div className="space-y-4 p-4 sm:p-5">
      {day.hotels?.length || day.transports?.length || day.meals?.length ? <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold">
        {day.hotels?.map((hotel, hotelIndex) => <span key={`hotel-${hotelIndex}`} className="flex items-center gap-2"><BedDouble className="size-4 text-primary" />{assetName(hotel.hotel_id, hotel.name, "Hotel stay")}</span>)}
        {day.transports?.map((transport, transportIndex) => <span key={`transport-${transportIndex}`} className="flex items-center gap-2"><BusFront className="size-4 text-primary" />{assetName(transport.vehicle_id, transport.title, "Transport")}</span>)}
        {day.meals?.length ? <span className="flex items-center gap-2 capitalize"><Utensils className="size-4 text-primary" />{day.meals.join(", ")}</span> : null}
      </div> : null}

      {places.length ? <div className="grid gap-3 sm:grid-cols-2">{places.map((place, placeIndex) => <div key={`${place.kind}-${placeIndex}`} className="flex min-w-0 gap-3 rounded-xl border border-border bg-background p-3"><div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-secondary"><Image src={place.image || FALLBACK_IMAGE} alt={place.name} fill sizes="64px" className="object-cover" /></div><div className="min-w-0"><p className="flex items-center gap-1.5 font-bold"><span className="text-primary">{place.kind === "Sightseeing" ? <MapPin className="size-4" /> : <Sparkles className="size-4" />}</span>{place.name}</p>{place.description ? <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">{place.description}</p> : null}</div></div>)}</div> : null}
    </div>
  </article>;
}

function assetName(asset: unknown, fallback: string | undefined, empty: string) {
  return typeof asset === "object" && asset !== null && "name" in asset && typeof asset.name === "string" ? asset.name : fallback || empty;
}
