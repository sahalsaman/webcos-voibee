"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowUpDown, Filter, Grid2X2, List, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";


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
  basePath = "/packages",
}: {
  initialFilters: TripFilterValues;
  basePath?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();

  const [startDate, setStartDate] = useState(initialFilters.startDate);
  const [endDate, setEndDate] = useState(initialFilters.endDate);
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice);
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice);
  const [sort, setSort] = useState(initialFilters.sort);
  const [view, setView] = useState(initialFilters.view || "grid");
  const [compare, setCompare] = useState(initialFilters.compare === "1");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  function apply(overrides: Partial<TripFilterValues> = {}) {
    const next = new URLSearchParams();
    const values = { ...initialFilters, startDate, endDate, minPrice, maxPrice, sort, view, compare: compare ? "1" : "", ...overrides };
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
    router.push(`${basePath}?${next.toString()}`);
  }

  return (
    <div className="mb-8">
    

      <div className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="hidden space-y-1.5 sm:block">
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

      <div className="hidden space-y-1.5 sm:block">
        <Label>Budget (INR)</Label>
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

      <div className="flex items-center  gap-2 sm:col-span-2 lg:col-span-2 lg:flex-nowrap lg:justify-end">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(true)}
          className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-primary shadow-sm sm:hidden"
          aria-label="Open package filters"
        >
          <Filter className="size-4" />
        </button>
        <label className=" cursor-pointer items-center gap-2 whitespace-nowrap text-sm font-semibold hidden lg:flex" aria-label="Compare packages">
          <input
            type="checkbox"
            checked={compare}
            onChange={(event) => { setCompare(event.target.checked); apply({ compare: event.target.checked ? "1" : "" }); }}
            className="size-5 rounded border-border accent-primary"
          />
          Compare
        </label>
        <div className="hidden h-8 w-px bg-border lg:block" />
        <div className="hidden sm:flex sm:min-w-[280px] flex-1 items-center gap-2 lg:max-w-[280px] bg-card rounded-xl border border-border p-1 shadow-sm pl-2" aria-label="Package sort">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ArrowUpDown className="size-4" />
          </span>
          <Label htmlFor="package-sort" className="whitespace-nowrap font-bold hidden sm:block">Sort by:</Label>
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

      {mobileFiltersOpen ? (
        <div className="fixed inset-0 z-[100] bg-slate-950/45 sm:hidden" role="dialog" aria-modal="true" aria-label="Package filters">
          <button type="button" className="absolute inset-0 cursor-default" aria-label="Dismiss package filters" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 rounded-t-[28px] bg-white px-5 pb-[max(env(safe-area-inset-bottom),1.25rem)] pt-5 shadow-2xl">
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-slate-200" />
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold">Filter packages</h2>
              <button type="button" onClick={() => setMobileFiltersOpen(false)} className="flex size-10 items-center justify-center rounded-full bg-secondary" aria-label="Close package filters"><X className="size-5" /></button>
            </div>
            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <Label>Travel dates</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} aria-label="Start date" />
                  <Input type="date" value={endDate} min={startDate || undefined} onChange={(event) => setEndDate(event.target.value)} aria-label="End date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Budget (INR)</Label>
                <div className="flex items-center gap-3">
                  <Input type="number" min={0} value={minPrice} onChange={(event) => setMinPrice(event.target.value)} placeholder="Minimum" />
                  <span className="text-muted-foreground">–</span>
                  <Input type="number" min={0} value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder="Maximum" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile-package-sort">Sort by</Label>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-1 pl-2 shadow-sm">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground"><ArrowUpDown className="size-4" /></span>
                  <Select id="mobile-package-sort" value={sort} onChange={(event) => setSort(event.target.value)} className="min-w-0 flex-1 border-0 bg-transparent pl-1 shadow-none focus-visible:ring-0">
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Top rated</option>
                  </Select>
                </div>
              </div>
              <button type="button" onClick={() => { apply(); setMobileFiltersOpen(false); }} className="h-12 w-full rounded-xl bg-primary px-5 font-bold text-primary-foreground shadow-sm">Show packages</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
