import Image from "next/image";
import { Binoculars, BusFront, Check, Hotel, MapPin, Utensils } from "lucide-react";
import type { ItineraryItem } from "@/types";

const FALLBACK_PLACE = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=75";

export function DetailedItinerary({ days }: { days: ItineraryItem[] }) {
  return (
    <section>
      <div className="mb-6"><p className="text-sm font-semibold text-primary">Day by day</p><h2 className="mt-1 text-2xl font-bold">Detailed itinerary</h2></div>
      <div className="space-y-6">
        {days.map((day, index) => <ItineraryDay key={`${day.day}-${index}`} day={day} index={index} />)}
      </div>
    </section>
  );
}

function ItineraryDay({ day, index }: { day: ItineraryItem; index: number }) {
  const hasStructuredContent = Boolean(day.transports?.length || day.hotels?.length || day.meals?.length || day.sightseeing?.length);
  return (
    <article className="relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
      <header className="flex items-center gap-4 bg-brand-gradient px-5 py-4 text-white sm:px-6">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white font-extrabold text-primary shadow-sm">{index + 1}</span>
        <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/75">Day {index + 1}</p><h3 className="mt-0.5 text-lg font-bold sm:text-xl">{day.title}</h3></div>
      </header>
      <div className="space-y-4 p-4 sm:p-6">
        {day.description ? <p className="leading-7 text-muted-foreground">{day.description}</p> : null}

        {day.transports?.length ? <ContentBlock icon={BusFront} title="Transport"><div className="space-y-3">{day.transports.map((item, itemIndex) => <div key={itemIndex}><p className="font-semibold">{item.title}</p>{item.description ? <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p> : null}</div>)}</div></ContentBlock> : null}

        {day.hotels?.length ? <ContentBlock icon={Hotel} title="Hotels"><div className="grid gap-4 sm:grid-cols-2">{day.hotels.map((hotel, hotelIndex) => <div key={hotelIndex} className="overflow-hidden rounded-xl border border-border bg-background">{hotel.image ? <div className="relative aspect-[16/9]"><Image src={hotel.image} alt={hotel.name} fill sizes="(max-width: 640px) 100vw, 360px" className="object-cover" /></div> : null}<div className="p-3"><p className="font-semibold">{hotel.name}</p>{hotel.description ? <p className="mt-1 text-sm leading-5 text-muted-foreground">{hotel.description}</p> : null}</div></div>)}</div></ContentBlock> : null}

        {day.meals?.length ? <ContentBlock icon={Utensils} title="Meals"><div className="flex flex-wrap gap-2">{day.meals.map((meal) => <span key={meal} className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 text-sm font-semibold capitalize text-success"><Check className="size-3.5" />{meal}</span>)}</div></ContentBlock> : null}

        {day.sightseeing?.length ? <ContentBlock icon={Binoculars} title="Sightseeing"><div className="space-y-4">{day.sightseeing.map((place, placeIndex) => <div key={placeIndex} className="grid gap-4 rounded-xl border border-border bg-background p-3 sm:grid-cols-[180px_1fr] sm:items-center"><div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-secondary"><Image src={place.image || FALLBACK_PLACE} alt={place.name} fill sizes="(max-width: 640px) 100vw, 180px" className="object-cover" /></div><div><p className="flex items-center gap-2 font-bold"><MapPin className="size-4 shrink-0 text-primary" />{place.name}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{place.description}</p></div></div>)}</div></ContentBlock> : null}

        {!hasStructuredContent && !day.description ? <p className="text-sm text-muted-foreground">Day details will be updated soon.</p> : null}
      </div>
    </article>
  );
}

function ContentBlock({ icon: Icon, title, children }: { icon: typeof BusFront; title: string; children: React.ReactNode }) {
  return <section className="rounded-xl bg-secondary/35 p-4"><div className="mb-3 flex items-center gap-2"><span className="flex size-9 items-center justify-center rounded-lg bg-card text-primary shadow-sm"><Icon className="size-4" /></span><h4 className="font-bold">{title}</h4></div>{children}</section>;
}
