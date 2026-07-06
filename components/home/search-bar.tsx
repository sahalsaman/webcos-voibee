"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { POPULAR_DESTINATIONS, TRIP_CATEGORIES } from "@/lib/constants";

export function SearchBar() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [category, setCategory] = useState("");
  const [q, setQ] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (destination) params.set("destination", destination);
    if (category) params.set("category", category);
    router.push(`/trips?${params.toString()}`);
  }

  return (
    <form
      onSubmit={submit}
      className="glass mx-auto flex w-full max-w-3xl flex-col gap-3 rounded-2xl p-3 shadow-xl sm:flex-row sm:items-center"
    >
      <div className="flex flex-1 items-center gap-2 rounded-xl bg-background/70 px-3">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search destination, e.g. Manali backpacking"
          className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      {/* <div className="flex items-center gap-2 rounded-xl bg-background/70 px-2 sm:w-44">
        <MapPin className="size-4 shrink-0 text-muted-foreground" />
        <Select
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="border-0 bg-transparent shadow-none focus-visible:ring-0"
        >
          <option value="">Anywhere</option>
          {POPULAR_DESTINATIONS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </Select>
      </div> */}
      <Select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="bg-background/70 sm:w-40"
      >
        <option value="">Anytime</option>
        {TRIP_CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </Select>
      <Button type="submit" variant="gradient" size="lg" className="sm:px-6">
        <Search className="size-4" /> Search
      </Button>
    </form>
  );
}
