"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TripCard } from "@/components/trip/trip-card";
import type { TripDTO } from "@/types";

type DestinationPackageSection = {
  destination: string;
  packages: TripDTO[];
};

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
          <div key={item._id} className="min-w-[280px] max-w-[280px] snap-start sm:min-w-[320px] sm:max-w-[320px] lg:min-w-[340px] lg:max-w-[340px]">
            <TripCard trip={item} href={withCountry("/packages/" + item.slug, country)} />
          </div>
        ))}
      </div>
    </section>
  );
}
