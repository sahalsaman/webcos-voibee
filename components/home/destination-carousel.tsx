"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { destinationImage } from "@/lib/images";
import { formatCurrencyForCountry, withCountryParam } from "@/lib/utils";
import type { DestinationDTO } from "@/types";

export function DestinationCarousel({ title, destinations, country, hideTitle = false }: { title: string; destinations: DestinationDTO[]; country?: string; hideTitle?: boolean }) {
  const carouselRef = useRef<HTMLDivElement>(null);

  function scroll(direction: -1 | 1) {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const firstCard = carousel.firstElementChild as HTMLElement | null;
    const step = (firstCard?.offsetWidth ?? carousel.clientWidth) + 16;
    const atEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - step / 2;
    const atStart = carousel.scrollLeft <= step / 2;

    carousel.scrollTo({
      left: direction === 1 && atEnd ? 0 : direction === -1 && atStart ? carousel.scrollWidth : carousel.scrollLeft + direction * step,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    if (destinations.length < 2) return;
    const timer = window.setInterval(() => scroll(1), 3500);
    return () => window.clearInterval(timer);
  }, [destinations.length]);

  return (
    <div>
      {!hideTitle ? <h3 className="mb-4 text-lg font-semibold">{title}</h3> : null}

      <div className="relative">
        <Button type="button" variant="outline" size="icon" className="absolute left-0 top-1/2 z-10 size-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-slate-200 bg-white text-slate-700 shadow-lg hover:border-primary hover:bg-white hover:text-primary" onClick={() => scroll(-1)} aria-label={`Previous ${title}`}><ChevronLeft className="size-6" /></Button>
        <div
          ref={carouselRef}
          className="grid snap-x snap-mandatory auto-cols-[calc(66.666%-0.5rem)] grid-flow-col gap-4 overflow-x-auto pb-3 scroll-smooth md:auto-cols-[calc(25%-0.75rem)] lg:auto-cols-[calc(16.666%-0.834rem)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
        {destinations.map((destination) => (
          <Link
            key={destination._id}
            href={withCountryParam(`/packages?destination=${encodeURIComponent(destination.title)}`, country)}
            className="group relative aspect-[2/4] snap-start overflow-hidden rounded-2xl bg-secondary shadow-sm ring-1 ring-border/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
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
              <span className="block text-xl font-bold leading-tight">{destination.title}</span>
              <span className="mt-1.5 block text-xs font-medium text-white/80">From {formatCurrencyForCountry(destination.basePrice, country)}</span>
            </div>
          </Link>
        ))}
        </div>
        <Button type="button" variant="outline" size="icon" className="absolute right-0 top-1/2 z-10 size-12 translate-x-1/2 -translate-y-1/2 rounded-full border-slate-200 bg-white text-slate-700 shadow-lg hover:border-primary hover:bg-white hover:text-primary" onClick={() => scroll(1)} aria-label={`Next ${title}`}><ChevronRight className="size-6" /></Button>
      </div>

      <div className="mt-5 flex justify-center">
        <Button asChild variant="outline" size="lg" className="min-w-44 px-8 text-base"><Link href={withCountryParam("/packages", country)}>Explore <ArrowRight /></Link></Button>
      </div>
    </div>
  );
}
