"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { TripCategory } from "@/lib/constants";
import { withCountryParam } from "@/lib/utils";

type Theme = {
  name: TripCategory;
  image: string;
  description: string;
};

export function ThemeCarousel({ themes, country }: { themes: Theme[]; country?: string }) {
  const carouselRef = useRef<HTMLDivElement>(null);

  function move(direction: -1 | 1) {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const firstCard = carousel.firstElementChild as HTMLElement | null;
    const step = (firstCard?.offsetWidth ?? carousel.clientWidth) + 20;
    const atEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - step / 2;
    const atStart = carousel.scrollLeft <= step / 2;

    carousel.scrollTo({
      left: direction === 1 && atEnd ? 0 : direction === -1 && atStart ? carousel.scrollWidth : carousel.scrollLeft + direction * step,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    const timer = window.setInterval(() => move(1), 3500);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="relative">
      <button type="button" onClick={() => move(-1)} aria-label="Previous trip themes" className="absolute left-1 top-[38%] z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition hover:border-primary hover:text-primary sm:-left-5">
        <ChevronLeft className="size-5" />
      </button>

      <div ref={carouselRef} className="grid snap-x snap-mandatory auto-cols-[calc(66.667%-0.5rem)] grid-flow-col gap-3 overflow-x-auto px-1 pb-2 scroll-smooth [scrollbar-width:none] sm:auto-cols-[calc(33.333%-0.834rem)] sm:gap-5 lg:auto-cols-[calc(16.667%-1.042rem)] [&::-webkit-scrollbar]:hidden">
        {themes.map((theme) => (
          <Link key={theme.name} href={withCountryParam(`/packages?category=${encodeURIComponent(theme.name)}`, country)} className="group relative block snap-start pb-10 sm:pb-10">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] sm:rounded-[34px]">
              <Image src={theme.image} alt={`${theme.name} tour packages`} fill sizes="(max-width: 640px) 67vw, (max-width: 1024px) 33vw, 17vw" className="object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent" />
            </div>
            <div className="absolute inset-x-2 bottom-0 mx-auto flex min-h-24 max-w-[88%] flex-col items-center justify-center rounded-t-[999px] bg-white px-2 pb-2 pt-3 text-center shadow-[0_-8px_24px_rgba(15,23,42,0.08)] sm:min-h-28 sm:px-3 sm:pt-5">
            
              <h3 className=" text-sm font-extrabold tracking-tight text-slate-950 transition-colors group-hover:text-primary sm:text-base">{theme.name}</h3>
              <span className="mt-1 inline-flex items-center gap-1 text-[9px] font-semibold text-slate-500 sm:text-[10px]">Explore <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" /></span>
            </div>
          </Link>
        ))}
      </div>

      <button type="button" onClick={() => move(1)} aria-label="Next trip themes" className="absolute right-1 top-[38%] z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition hover:border-primary hover:text-primary sm:-right-5">
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}
