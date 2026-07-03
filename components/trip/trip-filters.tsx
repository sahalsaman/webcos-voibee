"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { TRIP_CATEGORIES, POPULAR_DESTINATIONS } from "@/lib/constants";

export function TripFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const [q, setQ] = useState(params.get("q") ?? "");
  const [destination, setDestination] = useState(params.get("destination") ?? "");
  const [category, setCategory] = useState(params.get("category") ?? "");
  const [minPrice, setMinPrice] = useState(params.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(params.get("maxPrice") ?? "");
  const [sort, setSort] = useState(params.get("sort") ?? "newest");

  // Keep local state in sync when the URL changes (e.g. back button).
  useEffect(() => {
    setQ(params.get("q") ?? "");
    setDestination(params.get("destination") ?? "");
    setCategory(params.get("category") ?? "");
    setMinPrice(params.get("minPrice") ?? "");
    setMaxPrice(params.get("maxPrice") ?? "");
    setSort(params.get("sort") ?? "newest");
  }, [params]);

  function apply(e?: React.FormEvent) {
    e?.preventDefault();
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    if (destination) next.set("destination", destination);
    if (category) next.set("category", category);
    if (minPrice) next.set("minPrice", minPrice);
    if (maxPrice) next.set("maxPrice", maxPrice);
    if (sort && sort !== "newest") next.set("sort", sort);
    router.push(`/trips?${next.toString()}`);
  }

  function reset() {
    router.push("/trips");
  }

  const hasFilters =
    q || destination || category || minPrice || maxPrice || sort !== "newest";

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
          {POPULAR_DESTINATIONS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Trip type</Label>
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Any type</option>
          {TRIP_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
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
