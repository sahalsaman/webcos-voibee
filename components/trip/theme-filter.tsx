"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import Image from "next/image";
import { TRIP_CATEGORIES, type TripCategoryOption } from "@/lib/constants";

const FILTER_IMAGES: Record<string, string> = {
  "Holiday Package": "/filter-holiday-package.png",
  Honeymoon: "/filter-honeymoon.png",
  Family: "/filter-family.png",
  "Group Trip": "/filter-group-trip.png",
  "Voibee Circles": "/filter-voibee-circles.png",
  Wellness: "/filter-wellness.png",
  Spiritual: "/filter-spiritual.png",
  Festival: "/filter-festival.png",
  "Work Escape": "/filter-work-escape.png",
  "Golden Horizons (Senior Care)": "/filter-senior-care.png",
  "Limitless Access (Mobility Support)": "/filter-mobility-support.png",
  "Bespoke Private Journeys": "/filter-bespoke-private.png",
};

export function ThemeFilter({
  selectedCategory,
  categoryCounts,
  totalCount,
  categories = TRIP_CATEGORIES,
  basePath = "/packages",
  fitContent = false,
}: {
  selectedCategory: string;
  categoryCounts: Record<string, number>;
  totalCount: number;
  categories?: readonly TripCategoryOption[];
  basePath?: string;
  fitContent?: boolean;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const categoryRef = useRef<HTMLDivElement>(null);

  function applyCategory(category: string) {
    const next = new URLSearchParams(params.toString());
    if (category) next.set("category", category);
    else next.delete("category");
    next.delete("page");
    const query = next.toString();
    router.push(`${basePath}${query ? `?${query}` : ""}`);
  }

  return (
    <div className={`mx-auto max-w-full overflow-hidden rounded-2xl bg-white/95 p-2 shadow-md backdrop-blur-sm ${fitContent ? "w-fit" : "w-full"}`}>
      <div ref={categoryRef} className="overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className={`grid w-max auto-cols-[92px] grid-flow-col items-stretch gap-2 sm:auto-cols-[108px] sm:gap-3 ${fitContent ? "" : "min-w-full justify-center"}`}>
          <button
            type="button"
            onClick={() => applyCategory("")}
            aria-pressed={!selectedCategory}
            title="All packages"
            className={`group flex min-h-[84px] flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-center transition ${!selectedCategory ? "bg-secondary text-primary" : "bg-transparent text-slate-700 hover:bg-secondary/40"}`}
          >
            <Image src="/filter-all-packages.png" alt="" width={48} height={48} className="size-10 object-contain transition-transform group-hover:scale-105 sm:size-11" />
            <span className="text-[11px] font-extrabold leading-tight text-slate-800">All packages</span>
            <span className="sr-only">{totalCount} packages</span>
          </button>
          {categories.map((item) => {
            const active = selectedCategory === item.label;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => applyCategory(item.label)}
                aria-pressed={active}
                title={`${item.label} · ${categoryCounts[item.label] ?? 0} packages`}
                className={`group flex min-h-[84px] flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-center transition ${active ? "bg-secondary text-primary" : "bg-transparent text-slate-700 hover:bg-secondary/40"}`}
              >
                <Image src={FILTER_IMAGES[item.label] ?? "/filter-all-packages.png"} alt="" width={56} height={56} className="size-10 object-contain transition-transform group-hover:scale-105 sm:size-13" />
                <span className="line-clamp-2 text-[11px] font-extrabold leading-tight text-slate-800">{item.label}</span>
                <span className="sr-only">{categoryCounts[item.label] ?? 0} packages</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
