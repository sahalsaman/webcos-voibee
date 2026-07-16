"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
}

export function TripFilters({
  destinations,
  initialFilters,
}: {
  destinations: string[];
  initialFilters: TripFilterValues;
}) {
  const router = useRouter();
  const params = useSearchParams();

  const [q, setQ] = useState(initialFilters.q);
  const [destination, setDestination] = useState(initialFilters.destination);
  const [category, setCategory] = useState(initialFilters.category);
  const [startDate, setStartDate] = useState(initialFilters.startDate);
  const [endDate, setEndDate] = useState(initialFilters.endDate);
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice);
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice);
  const [sort, setSort] = useState(initialFilters.sort);

  function apply(e?: React.FormEvent) {
    e?.preventDefault();
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    if (destination) next.set("destination", destination);
    if (category) next.set("category", category);
    if (startDate) next.set("startDate", startDate);
    if (endDate) next.set("endDate", endDate);
    if (minPrice) next.set("minPrice", minPrice);
    if (maxPrice) next.set("maxPrice", maxPrice);
    const country = params.get("c");
    if (country) next.set("c", country);
    if (sort && sort !== "newest") next.set("sort", sort);
    router.push(`/trips?${next.toString()}`);
  }

  function reset() {
    const country = params.get("c");
    router.push(country ? `/trips?c=${encodeURIComponent(country)}` : "/trips");
  }

  const hasFilters =
    q || destination || category || startDate || endDate || minPrice || maxPrice || sort !== "newest";

  return (
    <form
      onSubmit={apply}
      className="sticky top-20 space-y-5 rounded-xl border border-border bg-card p-5"
    >
      <div className="flex items-center gap-2 font-semibold">
        <SlidersHorizontal className="size-4 text-primary" /> Filters
      </div>

      <div className="space-y-1.5">
        <Label>Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Keyword"
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Destination</Label>
        <Select value={destination} onChange={(e) => setDestination(e.target.value)}>
          <option value="">Anywhere</option>
          {destinations.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Trip theme</Label>
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Any type</option>
          {TRIP_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Travel dates</Label>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            aria-label="Start date"
          />
          <Input
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={(e) => setEndDate(e.target.value)}
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
            placeholder="Min"
          />
          <span className="text-muted-foreground">–</span>
          <Input
            type="number"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Sort by</Label>
        <Select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top rated</option>
        </Select>
      </div>

      <div className="flex gap-2 pt-1">
        <Button type="submit" variant="gradient" className="flex-1">
          Apply
        </Button>
        {hasFilters ? (
          <Button type="button" variant="outline" size="icon" onClick={reset} aria-label="Clear">
            <X className="size-4" />
          </Button>
        ) : null}
      </div>
    </form>
  );
}
