import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, Calendar, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatINR, tripDuration, formatDate } from "@/lib/utils";
import type { TripDTO } from "@/types";

interface TripCardProps {
  trip: TripDTO;
  href?: string;
  /** Override the displayed "from" price (e.g. partner selling price). */
  priceOverride?: number;
  priceLabel?: string;
}

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=70";

export function TripCard({ trip, href, priceOverride, priceLabel }: TripCardProps) {
  const link = href ?? `/trips/${trip.slug}`;
  const img = trip.images?.[0] || FALLBACK_IMG;
  const { label: duration } = tripDuration(trip.startDate, trip.endDate);
  const price = priceOverride ?? trip.basePrice;
  const soldOut = trip.availableSeats <= 0;

  return (
    <Link
      href={link}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={img}
          alt={trip.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge variant="glass">{trip.category}</Badge>
          {trip.featured ? <Badge variant="accent">Featured</Badge> : null}
        </div>
        {soldOut ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Badge variant="destructive" className="text-sm">Sold Out</Badge>
          </div>
        ) : null}
        <div className="absolute bottom-3 right-3">
          <Badge variant="glass" className="font-semibold">
            <Star className="size-3 fill-warning text-warning" />
            {trip.rating > 0 ? trip.rating.toFixed(1) : "New"}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3.5 text-primary" />
          {trip.destination}
        </div>
        <h3 className="mt-1 line-clamp-2 font-semibold leading-snug group-hover:text-primary">
          {trip.title}
        </h3>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="size-3.5" /> {duration}
          </span>
          <span className="flex items-center gap-1">
            <Users className="size-3.5" />
            {soldOut ? "Waitlist" : `${trip.availableSeats} seats left`}
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-border pt-3">
          <div>
            <p className="text-[11px] text-muted-foreground">
              {priceLabel ?? "Starting from"}
            </p>
            <p className="text-lg font-bold">
              {formatINR(price)}
              <span className="text-xs font-normal text-muted-foreground"> /person</span>
            </p>
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            {formatDate(trip.startDate)}
          </span>
        </div>
      </div>
    </Link>
  );
}
