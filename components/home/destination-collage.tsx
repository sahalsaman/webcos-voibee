import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { destinationImage } from "@/lib/images";
import { withCountryParam } from "@/lib/utils";
import type { DestinationDTO } from "@/types";

const TILE_LAYOUT = [
  "lg:col-span-1 lg:row-span-2",
  "lg:col-span-2",
  "lg:col-span-1 lg:row-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
] as const;

export function DestinationCollage({ destinations, country }: { destinations: DestinationDTO[]; country?: string }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[210px_210px_210px]">
      {destinations.slice(0, 6).map((destination, index) => (
        <Link
          key={destination._id}
          href={withCountryParam(`/packages?destination=${encodeURIComponent(destination.title)}`, country)}
          className={`group relative min-h-64 overflow-hidden rounded-[24px] bg-slate-100 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl lg:min-h-0 ${TILE_LAYOUT[index] ?? ""}`}
        >
          <Image
            src={destination.images[0] || destinationImage(destination.title)}
            alt={`Explore ${destination.title}`}
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white sm:p-6">
            <div>
              <p className="text-xl font-extrabold leading-tight sm:text-2xl">{destination.title}</p>
              <p className="mt-1 text-sm font-medium text-white/80">Explore curated holidays</p>
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
