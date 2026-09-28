"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { TRIP_CATEGORIES, type TripCategoryOption } from "@/lib/constants";
import { getTripThemeVisual } from "@/components/trip/trip-theme-visual";

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

  function applyCategory(category: string) {
    const next = new URLSearchParams(params.toString());
    if (category) next.set("category", category);
    else next.delete("category");
    next.delete("page");
    const query = next.toString();
    router.push(`${basePath}${query ? `?${query}` : ""}`);
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white/95 p-2 shadow-md backdrop-blur-sm">
      <div ref={categoryRef} className="overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="grid auto-cols-[92px] grid-flow-col items-stretch gap-2 sm:auto-cols-[108px] sm:gap-3">
          <button
            type="button"
            onClick={() => applyCategory("")}
            aria-pressed={!selectedCategory}
            title="All packages"
            className={`group flex min-h-[84px] flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-center transition ${!selectedCategory ? "bg-sky-100 text-primary" : "bg-transparent text-slate-700 hover:bg-slate-50"}`}
          >
            <span className="text-[38px] leading-none transition-transform group-hover:scale-105" aria-hidden="true">🌐</span>
            <span className="text-[11px] font-extrabold leading-tight text-slate-800">All packages</span>
            <span className="sr-only">{totalCount} packages</span>
          </button>
          {categories.map((item) => {
            const theme = getTripThemeVisual(item.label);
            const active = selectedCategory === item.label;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => applyCategory(item.label)}
                aria-pressed={active}
                title={`${theme.label} · ${categoryCounts[item.label] ?? 0} packages`}
                className={`group flex min-h-[84px] flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-center transition ${active ? "bg-sky-100 text-primary" : "bg-transparent text-slate-700 hover:bg-slate-50"}`}
              >
                <span className="text-[38px] leading-none drop-shadow-sm transition-transform group-hover:scale-105" aria-hidden="true">{theme.icon}</span>
                <span className="line-clamp-2 text-[11px] font-extrabold leading-tight text-slate-800">{theme.label}</span>
                <span className="sr-only">{categoryCounts[item.label] ?? 0} packages</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
