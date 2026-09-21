import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Star } from "lucide-react";
import { CurrencyPrice } from "@/components/currency/currency-price";
import type { ActivityDTO } from "@/types";

const fallback = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80";

export function ActivityCard({ activity }: { activity: ActivityDTO }) {
  const saving = activity.originalPrice > activity.basePrice ? Math.round((1 - activity.basePrice / activity.originalPrice) * 100) : 0;
  return <Link href={`/activities/${activity.slug}`} className="group block min-w-0">
    <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary">
      <Image src={activity.images[0] || fallback} alt={activity.title} fill sizes="(max-width: 768px) 84vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
      <span className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full bg-black/15 text-white backdrop-blur-sm"><Heart className="size-5" /></span>
      <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
        {saving ? <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">Save {saving}%</span> : <span />}
        {activity.rating ? <span className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-900"><Star className="size-3.5 fill-amber-400 text-amber-400" />{activity.rating.toFixed(1)}</span> : <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold">New</span>}
      </div>
    </div>
    <p className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary"><MapPin className="size-3.5" />{activity.destination}</p>
    <h3 className="mt-1 line-clamp-2 text-lg font-extrabold leading-snug text-slate-950 group-hover:text-primary">{activity.title}</h3>
    <p className="mt-2 text-sm text-muted-foreground">From {activity.originalPrice > activity.basePrice ? <span className="mr-2 line-through"><CurrencyPrice amount={activity.originalPrice} /></span> : null}<strong className="text-base text-foreground"><CurrencyPrice amount={activity.basePrice} /></strong></p>
  </Link>;
}
