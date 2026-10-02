import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Bookmark, CalendarDays, MapPin, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PackageServiceIcons } from "@/components/trip/package-service-icons";
import { isCustomDateTripCategory } from "@/lib/constants";
import { tripDuration, formatDate } from "@/lib/utils";
import { CurrencyPrice } from "@/components/currency/currency-price";
import type { TripDTO } from "@/types";
import { cn } from "@/lib/utils";

interface TripCardProps {
  trip: TripDTO;
  href?: string;
  /** Override the displayed "from" price (e.g. partner selling price). */
  priceOverride?: number;
  priceLabel?: string;
  view?: "grid" | "list";
}

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=70";

export function TripCard({ trip, href, priceOverride, priceLabel, view = "grid" }: TripCardProps) {
  const link = href ?? `/packages/${trip.slug}`;
  const img = trip.images?.[0] || FALLBACK_IMG;
  const customDate = trip.holidayPackage ?? isCustomDateTripCategory(trip.category);
  const { label: duration } = tripDuration(trip.startDate, trip.endDate, trip.durationDays || trip.itinerary?.length);
  const price = priceOverride ?? trip.basePrice;
  const soldOut = customDate ? false : trip.availableSeats <= 0;

  return (
    <Link
      href={link}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[30px] border border-slate-200 bg-white p-3 shadow-[0_12px_34px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_20px_44px_rgba(13,72,132,0.16)]",
        view === "list" && "sm:grid sm:grid-cols-[minmax(280px,0.78fr)_minmax(0,1.22fr)] sm:gap-0",
      )}
    >
      <div className={cn("relative aspect-[4/3] overflow-hidden rounded-[23px]", view === "list" && "sm:aspect-auto sm:min-h-full")}>
        <Image
          src={img}
          alt={trip.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-700 shadow-sm backdrop-blur">{trip.category}</span>
          <span className="flex size-10 items-center justify-center rounded-full border border-white/50 bg-slate-950/45 text-white backdrop-blur"><Bookmark className="size-4" /></span>
        </div>
        {soldOut ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Badge variant="destructive" className="text-sm">Sold Out</Badge>
          </div>
        ) : null}
        <div className="absolute bottom-3 right-3">
          <span className="flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-slate-800 shadow-sm backdrop-blur">
            <Star className="size-3 fill-warning text-warning" />
            {trip.rating > 0 ? trip.rating.toFixed(1) : "New"}
          </span>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col px-2 pb-2 pt-4 sm:px-3 sm:pb-3">
        <div className="flex items-center justify-between gap-3 text-xs font-semibold text-slate-500">
          <span className="flex min-w-0 items-center gap-1.5 truncate"><MapPin className="size-3.5 shrink-0 text-primary" /> {trip.destination}</span>
          {trip.featured ? <Badge variant="accent" className="shrink-0">Featured</Badge> : <span className="shrink-0">{trip.packageType ?? "Standard"}</span>}
        </div>
        <h3 className="mt-2 line-clamp-2 text-xl font-extrabold leading-7 text-slate-950 transition-colors group-hover:text-primary">{trip.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-600">{trip.description || `A curated ${trip.destination} experience by Voibee.`}</p>

        <div className="mt-3 min-h-8">
          <PackageServiceIcons includedServices={trip.includedServices} inclusions={trip.inclusions} compact />
        </div>

        <div className="mt-4 grid grid-cols-3 divide-x divide-slate-200 border-y border-slate-200 py-3 text-center">
          <div className="px-1"><p className="text-sm font-extrabold text-slate-950"><Star className="mr-0.5 inline size-3.5 fill-warning text-warning" />{trip.rating > 0 ? trip.rating.toFixed(1) : "New"}</p><p className="mt-0.5 text-[10px] font-medium text-slate-500">Rating</p></div>
          <div className="px-1"><p className="text-sm font-extrabold text-slate-950">{duration}</p></div>
          <div className="px-1"><p className="text-sm font-extrabold text-slate-950"><CurrencyPrice amount={price} /></p><p className="mt-0.5 text-[10px] font-medium text-slate-500">{priceLabel ?? "From / person"}</p></div>
        </div>

        <div className="mt-3 flex min-h-5 items-center justify-between gap-2 text-xs font-medium text-slate-500">
          <span className="flex items-center gap-1"><CalendarDays className="size-3.5 text-primary" /> {customDate ? "Flexible dates" : formatDate(trip.startDate)}</span>
          {!customDate ? <span className={`flex items-center gap-1 ${soldOut ? "text-rose-600" : "text-emerald-600"}`}><Users className="size-3.5" /> {soldOut ? "Sold out" : `${trip.availableSeats} spots left`}</span> : null}
        </div>
        <span className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-bold text-white transition-all group-hover:bg-primary group-hover:shadow-lg group-hover:shadow-primary/20">
          View package
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
