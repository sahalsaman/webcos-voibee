"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight, Grid2X2, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { TRIP_CATEGORIES } from "@/lib/constants";

interface TripFilterValues {
  q: string;
  destination: string;
  category: string;
  startDate: string;
  endDate: string;
  minPrice: string;
  maxPrice: string;
  sort: string;
  view: string;
  compare: string;
}

export function TripFilters({
  initialFilters,
  categoryCounts,
  totalCount,
}: {
  initialFilters: TripFilterValues;
  categoryCounts: Record<string, number>;
  totalCount: number;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const categoryRef = useRef<HTMLDivElement>(null);

  const [category, setCategory] = useState(initialFilters.category);
  const [startDate, setStartDate] = useState(initialFilters.startDate);
  const [endDate, setEndDate] = useState(initialFilters.endDate);
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice);
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice);
  const [sort, setSort] = useState(initialFilters.sort);
  const [view, setView] = useState(initialFilters.view || "grid");
  const [compare, setCompare] = useState(initialFilters.compare === "1");

  function scrollCategories(direction: -1 | 1) {
    categoryRef.current?.scrollBy({
      left: direction * Math.max(240, categoryRef.current.clientWidth * 0.7),
      behavior: "smooth",
    });
  }

  function apply(overrides: Partial<TripFilterValues> = {}) {
    const next = new URLSearchParams();
    const values = { ...initialFilters, category, startDate, endDate, minPrice, maxPrice, sort, view, compare: compare ? "1" : "", ...overrides };
    if (values.q) next.set("q", values.q);
    if (values.destination) next.set("destination", values.destination);
    if (values.category) next.set("category", values.category);
    if (values.startDate) next.set("startDate", values.startDate);
    if (values.endDate) next.set("endDate", values.endDate);
    if (values.minPrice) next.set("minPrice", values.minPrice);
    if (values.maxPrice) next.set("maxPrice", values.maxPrice);
    const country = params.get("c");
    if (country) next.set("c", country);
    if (values.sort && values.sort !== "newest") next.set("sort", values.sort);
    if (values.view === "list") next.set("view", "list");
    if (values.compare === "1") next.set("compare", "1");
    router.push(`/packages?${next.toString()}`);
  }

  return (
    <div className="mb-8 ">
    

      <div className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="space-y-1.5">
        <Label>Travel dates</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); apply({ startDate: e.target.value }); }}
            aria-label="Start date"
          />
          <Input
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={(e) => { setEndDate(e.target.value); apply({ endDate: e.target.value }); }}
            aria-label="End date"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Budget (₹)</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={0}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onBlur={() => apply({ minPrice })}
            placeholder="Min"
          />
          <span className="text-muted-foreground">–</span>
          <Input
            type="number"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onBlur={() => apply({ maxPrice })}
            placeholder="Max"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:col-span-2 lg:col-span-2 lg:flex-nowrap lg:justify-end">
        <label className="flex cursor-pointer items-center gap-2 whitespace-nowrap text-sm font-semibold">
          <input
            type="checkbox"
            checked={compare}
            onChange={(event) => { setCompare(event.target.checked); apply({ compare: event.target.checked ? "1" : "" }); }}
            className="size-5 rounded border-border accent-primary"
          />
          Compare
        </label>
        <div className="hidden h-8 w-px bg-border lg:block" />
        <div className="flex min-w-[280px] flex-1 items-center gap-2 lg:max-w-[280px] bg-card rounded-xl border border-border p-1 shadow-sm pl-2" aria-label="Package sort">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ArrowUpDown className="size-4" />
          </span>
          <Label htmlFor="package-sort" className="whitespace-nowrap font-bold">Sort by:</Label>
          <Select
            id="package-sort"
            value={sort}
            onChange={(event) => { setSort(event.target.value); apply({ sort: event.target.value }); }}
            className="min-w-[150px] border-0 bg-transparent pl-1 pr-9 shadow-none focus-visible:ring-0"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top rated</option>
          </Select>
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1 shadow-sm" aria-label="Package layout">
          <button
            type="button"
            onClick={() => { setView("grid"); apply({ view: "grid" }); }}
            aria-label="Grid view"
            aria-pressed={view === "grid"}
            className={`flex size-9 items-center justify-center rounded-lg transition ${view === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
          >
            <Grid2X2 className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => { setView("list"); apply({ view: "list" }); }}
            aria-label="List view"
            aria-pressed={view === "list"}
            className={`flex size-9 items-center justify-center rounded-lg transition ${view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
          >
            <List className="size-4" />
          </button>
        </div>
      </div>
      </div>

      <div className="relative mt-5 overflow-hidden rounded-2xl border border-border/70 bg-secondary/35 shadow-sm">
        <button
          type="button"
          onClick={() => scrollCategories(-1)}
          aria-label="Previous package types"
          className="absolute left-1 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background shadow-md transition hover:bg-secondary"
        >
          <ChevronLeft className="size-4" />
        </button>
        <div ref={categoryRef} className="mx-12 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex min-w-max items-center gap-1">
          <button
            type="button"
            onClick={() => { setCategory(""); apply({ category: "" }); }}
            className={`relative px-4 py-4 text-sm font-bold transition-colors ${category === "" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            All Packages ({totalCount})
            {category === "" ? <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-primary" /> : null}
          </button>
          {TRIP_CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => { setCategory(item); apply({ category: item }); }}
              className={`relative px-4 py-4 text-sm font-bold transition-colors ${category === item ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              {item} ({categoryCounts[item] ?? 0})
              {category === item ? <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-primary" /> : null}
            </button>
          ))}
        </div>
        </div>
        <button
          type="button"
          onClick={() => scrollCategories(1)}
          aria-label="Next package types"
          className="absolute right-1 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background shadow-md transition hover:bg-secondary"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

    </div>
  );
}
