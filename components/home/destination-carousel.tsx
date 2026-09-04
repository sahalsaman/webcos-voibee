"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { destinationImage } from "@/lib/images";
import { formatCurrencyForCountry } from "@/lib/utils";
import type { DestinationDTO } from "@/types";

function withCountry(path: string, country?: string) {
  return country ? `${path}${path.includes("?") ? "&" : "?"}c=${encodeURIComponent(country)}` : path;
}

export function DestinationCarousel({ title, destinations, country, hideTitle = false }: { title: string; destinations: DestinationDTO[]; country?: string; hideTitle?: boolean }) {
  const carouselRef = useRef<HTMLDivElement>(null);

  function scroll(direction: -1 | 1) {
    carouselRef.current?.scrollBy({ left: direction * carouselRef.current.clientWidth * 0.9, behavior: "smooth" });
  }

  return (
    <div>
      {!hideTitle ? <h3 className="mb-4 text-lg font-semibold">{title}</h3> : null}

      <div className="relative">
        <Button type="button" variant="outline" size="icon" className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background shadow-lg" onClick={() => scroll(-1)} aria-label={`Previous ${title}`}><ChevronLeft /></Button>
        <div
          ref={carouselRef}
          className="mx-12 grid snap-x snap-mandatory auto-cols-[calc(66.666%-0.5rem)] grid-flow-col gap-4 overflow-x-auto pb-3 scroll-smooth md:auto-cols-[calc(25%-0.75rem)] lg:auto-cols-[calc(16.666%-0.834rem)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
        {destinations.map((destination) => (
          <Link
            key={destination._id}
            href={withCountry(`/packages?destination=${encodeURIComponent(destination.title)}`, country)}
            className="group relative aspect-[2/3] snap-start overflow-hidden rounded-2xl bg-secondary shadow-sm ring-1 ring-border/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <Image
              src={destination.images[0] || destinationImage(destination.title)}
              alt={destination.title}
              fill
              sizes="(max-width: 767px) 67vw, (max-width: 1023px) 25vw, 17vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-white">
              <span className="block text-base font-bold leading-tight">{destination.title}</span>
              <span className="mt-1.5 block text-xs font-medium text-white/80">From {formatCurrencyForCountry(destination.basePrice, country)}</span>
            </div>
          </Link>
        ))}
        </div>
        <Button type="button" variant="outline" size="icon" className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background shadow-lg" onClick={() => scroll(1)} aria-label={`Next ${title}`}><ChevronRight /></Button>
      </div>

      <div className="mt-5 flex justify-center">
        <Button asChild variant="outline" size="lg" className="min-w-44 px-8 text-base"><Link href={withCountry("/packages", country)}>Explore <ArrowRight /></Link></Button>
      </div>
    </div>
  );
}
