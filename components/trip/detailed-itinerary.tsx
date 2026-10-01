import Image from "next/image";
import { BedDouble, Binoculars, BusFront, Check, ChevronDown, Clock3, Coffee, Cross, Droplets, Flame, ForkKnife, GlassWater, Hotel, ImageIcon, Luggage, MapPin, Soup, UserRound, Utensils } from "lucide-react";
import type { ItineraryHighlightType, ItineraryIconHighlight, ItineraryItem } from "@/types";

const FALLBACK_PLACE = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=75";

const DAY_HIGHLIGHT_VISUALS: Record<ItineraryHighlightType, { label: string; icon: typeof BusFront }> = {
  hotel: { label: "Hotel", icon: Hotel },
  resort: { label: "Resort", icon: BedDouble },
  activity: { label: "Activity", icon: Binoculars },
  vibes: { label: "Vibes", icon: Utensils },
  other: { label: "Highlight", icon: ImageIcon },
};

const ICON_HIGHLIGHT_VISUALS: Record<ItineraryIconHighlight, { label: string; icon: typeof BusFront }> = {
  "ac-bus": { label: "AC Bus", icon: BusFront }, "non-ac-bus": { label: "Non-AC Bus", icon: BusFront }, car: { label: "Car", icon: BusFront }, xuv: { label: "XUV", icon: BusFront }, "tempo-traveller": { label: "Tempo Traveller", icon: BusFront }, train: { label: "Train", icon: BusFront }, flight: { label: "Flight", icon: BusFront }, boat: { label: "Boat", icon: BusFront }, transport: { label: "Transport", icon: BusFront }, breakfast: { label: "Breakfast", icon: Coffee }, lunch: { label: "Lunch", icon: Soup }, dinner: { label: "Dinner", icon: Utensils }, "mineral-water": { label: "Mineral water", icon: Droplets }, "first-aid": { label: "First aid", icon: Cross }, "welcome-drink": { label: "Welcome drink", icon: GlassWater }, "tour-manager": { label: "Tour manager", icon: UserRound }, campfire: { label: "Campfire", icon: Flame }, "luggage-assistance": { label: "Luggage assistance", icon: Luggage },
};

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
  const hasStructuredContent = Boolean(day.iconHighlights?.length || day.highlights?.length || day.schedule?.length || day.transports?.length || day.hotels?.length || day.meals?.length || day.sightseeing?.length);
  return (
    <details open={index === 0} className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
      <summary className="flex cursor-pointer list-none items-center gap-4 bg-primary px-5 py-4 text-white select-none sm:px-6 [&::-webkit-details-marker]:hidden">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white font-extrabold text-primary shadow-sm">{index + 1}</span>
        <div className="min-w-0 flex-1"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/75">Day {index + 1}</p><h3 className="mt-0.5 truncate text-lg font-bold sm:text-xl">{day.title}</h3></div>
        <ChevronDown className="size-5 shrink-0 transition-transform duration-300 group-open:rotate-180" />
      </summary>
      <div className="space-y-4 p-4 sm:p-6">
        {day.iconHighlights?.length ? <ContentBlock icon={Check} title="Day highlights"><div className="flex flex-wrap gap-2">{day.iconHighlights.map((highlight) => <IconHighlight key={highlight} type={highlight} />)}</div></ContentBlock> : null}

        {day.highlights?.length ? <ContentBlock icon={Check} title="Day highlight images"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{day.highlights.map((highlight, highlightIndex) => <DayHighlight key={`${highlight.type}-${highlightIndex}`} type={highlight.type} label={highlight.label} image={highlight.image} />)}</div></ContentBlock> : null}

        {day.description ? <p className="leading-7 text-muted-foreground">{day.description}</p> : null}

        {day.specials?.length ? <div className="flex flex-wrap gap-2">{day.specials.map((item) => <span key={item} className="rounded-full bg-secondary px-3 py-1.5 text-sm font-semibold text-primary">{item}</span>)}</div> : null}

        {day.hotels?.length ? <div className="space-y-2">{day.hotels.map((hotel, hotelIndex) => <div key={hotelIndex} className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-border/70  last:border-b-0"><Hotel className="size-8 rounded-md shrink-0 text-primary bg-secondary/35 p-2" /><p className="font-semibold">{hotel.name}</p>{hotel.description ? <p className="text-sm text-muted-foreground">{hotel.description}</p> : null}</div>)}</div> : null}

        {day.meals?.length ? <div className="flex flex-wrap items-center gap-y-2 py-1 text-sm font-medium capitalize"><ForkKnife className="size-8 rounded-md shrink-0 text-primary bg-secondary/35 p-2 mr-2" />{day.meals.map((meal) => <span key={meal} className="font-bold pl-1"> {meal},</span>)}</div> : null}

        {day.transports?.length ? <div className="space-y-2">{day.transports.map((item, itemIndex) => <div key={itemIndex} className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-border/70  last:border-b-0"><BusFront className="size-8 rounded-md shrink-0 text-primary bg-secondary/35 p-2" /><p className="font-semibold">{item.title}</p>{item.description ? <p className="text-sm text-muted-foreground">{item.description}</p> : null}</div>)}</div> : null}

        {day.sightseeing?.length ? <ContentBlock icon={Binoculars} title="Sightseeing"><div className="space-y-4">{day.sightseeing.map((place, placeIndex) => <div key={placeIndex} className="grid gap-4 rounded-xl border border-border bg-background p-3 sm:grid-cols-[180px_1fr] sm:items-center"><div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-secondary"><Image src={place.image || FALLBACK_PLACE} alt={place.name} fill sizes="(max-width: 640px) 100vw, 180px" className="object-cover" /></div><div><p className="flex items-center gap-2 font-bold"><MapPin className="size-4 shrink-0 text-primary" />{place.name}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{place.description}</p></div></div>)}</div></ContentBlock> : null}

        {day.schedule?.length ? <ContentBlock icon={Clock3} title="Time-wise schedule"><div className="relative ml-2 space-y-4 border-l-2 border-primary/20 pl-5">{day.schedule.map((item, itemIndex) => <div key={itemIndex} className="relative"><span className="absolute -left-[26px] top-1.5 size-3 rounded-full border-2 border-primary bg-card" /><div className="flex flex-wrap items-baseline gap-x-3 gap-y-1"><time className="text-sm font-extrabold text-primary">{item.time}</time><p className="font-semibold">{item.title}</p></div>{item.description ? <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p> : null}</div>)}</div></ContentBlock> : null}

        {!hasStructuredContent && !day.description ? <p className="text-sm text-muted-foreground">Day details will be updated soon.</p> : null}
      </div>
    </details>
  );
}

function IconHighlight({ type }: { type: ItineraryIconHighlight }) {
  const visual = ICON_HIGHLIGHT_VISUALS[type];
  const Icon = visual.icon;
  return <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold"><Icon className="size-4 text-primary" />{visual.label}</span>;
}

function DayHighlight({ type, label, image }: { type: ItineraryHighlightType; label: string; image?: string }) {
  const visual = DAY_HIGHLIGHT_VISUALS[type];
  const Icon = visual.icon;
  return <div className="overflow-hidden rounded-xl border border-border bg-background">{image ? <div className="relative aspect-[16/7] bg-secondary"><Image src={image} alt={label} fill sizes="(max-width: 640px) 100vw, 260px" className="object-cover" /></div> : null}<div className="flex items-center gap-3 p-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="size-5" /></span><div><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{visual.label}</p><p className="font-bold">{label}</p></div></div></div>;
}

function ContentBlock({ icon: Icon, title, children }: { icon: typeof BusFront; title: string; children: React.ReactNode }) {
  return <section className="rounded-xl bg-secondary/35 p-4"><div className="mb-3 flex items-center gap-2"><span className="flex size-9 items-center justify-center rounded-lg bg-card text-primary shadow-sm"><Icon className="size-4" /></span><h4 className="font-bold">{title}</h4></div>{children}</section>;
}
