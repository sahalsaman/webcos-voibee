import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Heart, Star, Users } from "lucide-react";
import { CurrencyPrice } from "@/components/currency/currency-price";
import { isCustomDateTripCategory } from "@/lib/constants";
import { formatDate, tripDuration } from "@/lib/utils";
import type { TripDTO } from "@/types";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=70";

export function VibeCircleCard({ trip }: { trip: TripDTO }) {
  const image = trip.images?.[0] || FALLBACK_IMAGE;
  const customDate = trip.holidayPackage ?? isCustomDateTripCategory(trip.category);
  const soldOut = !customDate && trip.availableSeats <= 0;
  const { label: duration } = tripDuration(trip.startDate, trip.endDate, trip.durationDays || trip.itinerary?.length);
  const schedule = customDate ? duration : `${formatDate(trip.startDate)} · ${duration}`;

  return (
    <Link href={`/vibe-circles/${trip.slug}`} className="group block min-w-0">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-slate-100">
        <Image
          src={image}
          alt={trip.title}
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">{trip.destination}</span>
          <span className="flex items-center gap-1 rounded-full bg-slate-950/45 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">
            <Heart className="size-3.5" /> Vibe
          </span>
        </div>
        <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
          <span className="flex size-10 items-center justify-center rounded-full border-2 border-white bg-primary text-sm font-black text-primary-foreground shadow-md">V</span>
          <span className="flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-slate-800 shadow-sm backdrop-blur">
            <Star className="size-3.5 fill-warning text-warning" /> {trip.rating > 0 ? trip.rating.toFixed(1) : "New"}
          </span>
        </div>
      </div>

      <div className="px-1 pt-3">
        <div className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-600">
          <span>with Voibee Circle</span>
          {trip.rating > 0 ? <span className="flex items-center gap-1"><Star className="size-3.5 fill-slate-900 text-slate-900" /> {trip.rating.toFixed(1)}</span> : null}
        </div>
        <h3 className="mt-2 line-clamp-2 text-base font-extrabold leading-6 text-slate-950 transition-colors group-hover:text-primary">{trip.title}</h3>
        <p className="mt-3 flex items-center gap-1.5 text-sm text-slate-600"><CalendarDays className="size-4 text-primary" /> {schedule}</p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-lg font-extrabold text-slate-950"><CurrencyPrice amount={trip.basePrice} /><span className="text-xs font-medium text-slate-500"> /person</span></p>
          {!customDate ? <span className={`flex items-center gap-1 text-xs font-semibold ${soldOut ? "text-rose-600" : "text-emerald-600"}`}><Users className="size-4" />{soldOut ? "Sold out" : `${trip.availableSeats} spots left`}</span> : null}
        </div>
      </div>
    </Link>
  );
}
