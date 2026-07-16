"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, Loader2, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const MONTH_OPTION_COUNT = 18;

type SearchResult = {
  id: string;
  type: "destination" | "trip" | "country";
  title: string;
  destination: string;
  country: string;
  countryCode: string;
  flag: string;
  href: string;
};

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

function resultLabel(type: SearchResult["type"]) {
  if (type === "trip") return "Trip";
  if (type === "country") return "Country";
  return "Destination";
}

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const visitorCountry = searchParams.get("c") ?? "IN";
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestRef = useRef(0);

  const [destination, setDestination] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const monthOptions = buildMonthOptions();
  const selectedMonthOption = monthOptions.find((option) => option.value === selectedMonth);
  const showResults = open && (results.length > 0 || loading || destination.trim().length >= 2);

  function withMonth(href: string) {
    const [path, query = ""] = href.split("?");
    const params = new URLSearchParams(query);
    if (selectedMonthOption) {
      params.set("startDate", selectedMonthOption.startDate);
      params.set("endDate", selectedMonthOption.endDate);
    }
    const nextQuery = params.toString();
    return nextQuery ? `${path}?${nextQuery}` : path;
  }

  function goToResult(item: SearchResult) {
    setDestination(item.type === "country" ? item.country : item.destination);
    setOpen(false);
    setActiveIndex(-1);
    router.push(withMonth(item.href));
  }

  function fetchResults(value: string) {
    const q = value.trim();
    if (timerRef.current) clearTimeout(timerRef.current);
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      setActiveIndex(-1);
      return;
    }

    setLoading(true);
    const requestId = requestRef.current + 1;
    requestRef.current = requestId;
    timerRef.current = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ q, c: visitorCountry });
        const res = await fetch(`/api/search?${params.toString()}`);
        const data = await res.json();
        if (requestRef.current !== requestId) return;
        setResults(data.success ? data.data : []);
        setActiveIndex(data.success && data.data.length ? 0 : -1);
      } catch {
        if (requestRef.current === requestId) setResults([]);
      } finally {
        if (requestRef.current === requestId) setLoading(false);
      }
    }, 180);
  }

  function onDestinationChange(value: string) {
    setDestination(value);
    setOpen(true);
    fetchResults(value);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (open && activeIndex >= 0 && results[activeIndex]) {
      goToResult(results[activeIndex]);
      return;
    }

    const params = new URLSearchParams();
    const trimmedDestination = destination.trim();

    if (trimmedDestination) params.set("destination", trimmedDestination);
    if (visitorCountry) params.set("c", visitorCountry);
    if (selectedMonthOption) {
      params.set("startDate", selectedMonthOption.startDate);
      params.set("endDate", selectedMonthOption.endDate);
    }

    router.push(`/trips?${params.toString()}`);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showResults || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((current) => (current + 1) % results.length);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((current) => (current <= 0 ? results.length - 1 : current - 1));
    }
    if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="glass relative mx-auto grid w-full max-w-3xl gap-3 rounded-2xl p-3 shadow-xl md:grid-cols-[minmax(0,1fr)_220px_auto] md:items-center"
    >
      <label className="flex min-w-0 items-center gap-2 rounded-xl bg-background/80 px-3 py-2">
        <MapPin className="size-4 shrink-0 text-muted-foreground" />
        <span className="sr-only">Destination</span>
        <Input
          value={destination}
          onChange={(e) => onDestinationChange(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={onKeyDown}
          placeholder="Search destination, trip or country"
          autoComplete="off"
          className="h-10 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
        />
      </label>

      <label className="flex min-w-0 items-center gap-2 rounded-xl bg-background/80 px-3 py-2">
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

      {showResults ? (
        <div className="md:col-span-3">
          <div className="overflow-hidden rounded-xl border border-white/15 bg-background/95 text-foreground shadow-2xl backdrop-blur-xl">
            {loading ? (
              <div className="flex items-center gap-2 px-4 py-4 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Searching
              </div>
            ) : results.length ? (
              <div className="max-h-72 overflow-y-auto py-1">
                {results.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => goToResult(item)}
                    className={cn(
                      "grid w-full grid-cols-[42px_minmax(0,1fr)_auto] items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-primary/10",
                      index > 0 && "border-t border-border/60",
                      activeIndex === index && "bg-primary/10",
                    )}
                  >
                    <span className="flex size-10 items-center justify-center rounded-full bg-secondary text-xl shadow-sm">
                      {item.flag || "•"}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold leading-5">{item.title}</span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                        {item.destination} · {item.country}
                      </span>
                    </span>
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                      {resultLabel(item.type)}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-4 text-sm text-muted-foreground">No matched destinations or trips</div>
            )}
          </div>
        </div>
      ) : null}
    </form>
  );
}
