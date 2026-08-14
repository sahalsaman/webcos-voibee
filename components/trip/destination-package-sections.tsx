"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";
import type { TripDTO } from "@/types";

type DestinationPackageSection = {
  destination: string;
  packages: TripDTO[];
};

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=70";

function withCountry(href: string, country?: string) {
  return country ? href + (href.includes("?") ? "&" : "?") + "c=" + encodeURIComponent(country) : href;
}

export function DestinationPackageSections({
  sections,
  country,
}: {
  sections: DestinationPackageSection[];
  country?: string;
}) {
  return (
    <div className="space-y-14">
      {sections.map((section) => (
        <DestinationPackageRow key={section.destination} section={section} country={country} />
      ))}
    </div>
  );
}

function DestinationPackageRow({
  section,
  country,
}: {
  section: DestinationPackageSection;
  country?: string;
}) {
  const rowRef = useRef<HTMLDivElement>(null);

  function scrollBy(direction: -1 | 1) {
    rowRef.current?.scrollBy({ left: direction * 340, behavior: "smooth" });
  }

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          {section.destination} Holiday Packages
        </h2>
        <div className="hidden items-center gap-2 sm:flex">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full bg-card shadow-lg shadow-slate-900/8"
            aria-label={"Scroll " + section.destination + " packages left"}
            onClick={() => scrollBy(-1)}
          >
            <ChevronLeft className="size-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full bg-card shadow-lg shadow-slate-900/8"
            aria-label={"Scroll " + section.destination + " packages right"}
            onClick={() => scrollBy(1)}
          >
            <ChevronRight className="size-5" />
          </Button>
        </div>
      </div>

      <div
        ref={rowRef}
        className="flex snap-x gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {section.packages.map((item) => (
          <Link
            key={item._id}
            href={withCountry("/packages/" + item.slug, country)}
            className="group min-w-[260px] max-w-[260px] snap-start sm:min-w-[300px] sm:max-w-[300px] lg:min-w-[310px] lg:max-w-[310px]"
          >
            <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-secondary">
              <Image
                src={item.images?.[0] || FALLBACK_IMG}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 260px, 310px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-black/10 text-white ring-1 ring-white/60 backdrop-blur-sm">
                <Heart className="size-5" />
              </span>
            </div>
            <div className="pt-4">
              <h3 className="line-clamp-2 min-h-[3.25rem] text-lg font-extrabold leading-snug text-foreground group-hover:text-primary">
                {item.title}
              </h3>
              <p className="mt-2 text-sm font-medium text-muted-foreground">from</p>
              <p className="text-xl font-extrabold text-foreground">{formatINR(item.basePrice)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
