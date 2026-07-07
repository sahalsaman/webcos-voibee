"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarDays, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const MONTH_OPTION_COUNT = 18;

function toDateInputValue(date: Date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 10);
}

function buildMonthOptions() {
  const now = new Date();
  const firstMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthFormatter = new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
  });

  return Array.from({ length: MONTH_OPTION_COUNT }, (_, index) => {
    const monthStart = new Date(firstMonth.getFullYear(), firstMonth.getMonth() + index, 1);
    const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);

    return {
      label: monthFormatter.format(monthStart),
      value: toDateInputValue(monthStart),
      startDate: toDateInputValue(monthStart),
      endDate: toDateInputValue(monthEnd),
    };
  });
}

export function SearchBar() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const monthOptions = buildMonthOptions();
  const selectedMonthOption = monthOptions.find((option) => option.value === selectedMonth);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    const trimmedDestination = destination.trim();

    if (trimmedDestination) params.set("destination", trimmedDestination);
    if (selectedMonthOption) {
      params.set("startDate", selectedMonthOption.startDate);
      params.set("endDate", selectedMonthOption.endDate);
    }

    router.push(`/trips?${params.toString()}`);
  }

  return (
    <form
      onSubmit={submit}
      className="glass mx-auto grid w-full max-w-3xl gap-3 rounded-2xl p-3 shadow-xl md:grid-cols-[minmax(0,1fr)_220px_auto] md:items-center"
    >
      <label className="flex min-w-0 items-center gap-2 rounded-xl bg-background/70 px-3 py-2">
        <MapPin className="size-4 shrink-0 text-muted-foreground" />
        <span className="sr-only">Destination</span>
        <Input
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Destination"
          className="h-10 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
        />
      </label>

      <label className="flex min-w-0 items-center gap-2 rounded-xl bg-background/70 px-3 py-2">
        <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
        <span className="sr-only">Time</span>
        <Select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          aria-label="Time"
          className="h-10 border-0 bg-transparent shadow-none focus-visible:ring-0 md:w-[188px]"
        >
          <option value="">Any time</option>
          {monthOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </label>

      <Button type="submit" variant="gradient" size="lg" className="h-12 md:px-6">
        <Search className="size-4" /> Search
      </Button>
    </form>
  );
}
