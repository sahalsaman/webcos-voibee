"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TRIP_CATEGORIES, tripThemeLabel, type TripCategoryOption } from "@/lib/constants";

export function ThemeFilter({
  selectedCategory,
  categoryCounts,
  totalCount,
  categories = TRIP_CATEGORIES,
  basePath = "/packages",
}: {
  selectedCategory: string;
  categoryCounts: Record<string, number>;
  totalCount: number;
  categories?: readonly TripCategoryOption[];
  basePath?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const categoryRef = useRef<HTMLDivElement>(null);

  function scrollCategories(direction: -1 | 1) {
    categoryRef.current?.scrollBy({
      left: direction * Math.max(240, categoryRef.current.clientWidth * 0.7),
      behavior: "smooth",
    });
  }

  function applyCategory(category: string) {
    const next = new URLSearchParams(params.toString());
    if (category) next.set("category", category);
    else next.delete("category");
    next.delete("page");
    const query = next.toString();
    router.push(`${basePath}${query ? `?${query}` : ""}`);
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-black/20 px-8 py-3 backdrop-blur-sm">
      <button
        type="button"
        onClick={() => scrollCategories(-1)}
        aria-label="Previous package themes"
        className="absolute left-1 top-1/2 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/95 text-slate-700 shadow-md transition hover:bg-white"
      >
        <ChevronLeft className="size-4" />
      </button>
      <div ref={categoryRef} className="overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="grid auto-cols-[92px] grid-flow-col items-stretch gap-2 sm:auto-cols-[108px] sm:gap-3">
          <button
            type="button"
            onClick={() => applyCategory("")}
            aria-pressed={!selectedCategory}
            className={`flex min-h-[70px] flex-col items-center justify-center gap-1 rounded-xl border px-2 py-1.5 text-center transition ${!selectedCategory ? "border-white bg-white text-primary shadow-md" : "border-white/15 bg-white/90 text-slate-700 hover:bg-white"}`}
          >
            <span className="text-xl leading-none">🌐</span>
            <span className="text-[11px] font-extrabold leading-tight">All packages</span>
            <span className="text-[10px] font-semibold text-slate-400">{totalCount}</span>
          </button>
          {categories.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => applyCategory(item.label)}
              aria-pressed={selectedCategory === item.label}
              className={`flex min-h-[70px] flex-col items-center justify-center gap-1 rounded-xl border px-2 py-1.5 text-center transition ${selectedCategory === item.label ? "border-white bg-white text-primary shadow-md" : "border-white/15 bg-white/90 text-slate-700 hover:bg-white"}`}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span className="line-clamp-2 text-[11px] font-extrabold leading-tight">{tripThemeLabel(item.label)}</span>
              <span className="text-[10px] font-semibold text-slate-400">{categoryCounts[item.label] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => scrollCategories(1)}
        aria-label="Next package themes"
        className="absolute right-1 top-1/2 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/95 text-slate-700 shadow-md transition hover:bg-white"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
