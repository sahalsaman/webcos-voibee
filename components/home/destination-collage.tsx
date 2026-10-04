import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { destinationImage } from "@/lib/images";
import { withCountryParam } from "@/lib/utils";
import type { DestinationDTO } from "@/types";

const TILE_LAYOUT = [
  "col-span-1 row-span-2 sm:row-span-1 lg:col-span-1 lg:row-span-2",
  "col-span-1 lg:col-span-2",
  "col-span-1 lg:col-span-1 lg:row-span-2",
  "col-span-2 sm:col-span-1 lg:col-span-2",
  "col-span-1 lg:col-span-2",
  "col-span-1 lg:col-span-2",
] as const;

export function DestinationCollage({ destinations, country }: { destinations: DestinationDTO[]; country?: string }) {
  return (
    <div className="grid grid-cols-2 grid-rows-[140px_140px_165px_140px] gap-3 sm:grid-rows-none sm:gap-4 lg:grid-cols-4 lg:grid-rows-[210px_210px_210px]">
      {destinations.slice(0, 6).map((destination, index) => (
        <Link
          key={destination._id}
          href={withCountryParam(`/packages?destination=${encodeURIComponent(destination.title)}`, country)}
          className={`group relative min-h-0 overflow-hidden rounded-[20px] bg-slate-100 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:min-h-64 sm:rounded-[24px] lg:min-h-0 ${TILE_LAYOUT[index] ?? ""}`}
        >
          <Image
            src={destination.images[0] || destinationImage(destination.title)}
            alt={`Explore ${destination.title}`}
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3 text-white sm:p-6">
            <div>
              <p className="text-base font-extrabold leading-tight sm:text-2xl">{destination.title}</p>
              <p className="mt-1 text-xs font-medium text-white/80 sm:text-sm">Explore curated holidays</p>
            </div>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/90 text-primary opacity-0 transition group-hover:opacity-100">
              <ArrowUpRight className="size-4" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
