"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, MapPin, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const MONTH_OPTION_COUNT = 18;

type SearchResult = {
  id: string;
  title: string;
  destination: string;
  country: string;
  countryCode: string;
  flag: string;
  image?: string;
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

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const visitorCountry = searchParams.get("c") ?? "IN";
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestRef = useRef(0);

  const [destination, setDestination] = useState("");
  const [selectedMonth] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const monthOptions = buildMonthOptions();
  const selectedMonthOption = monthOptions.find((option) => option.value === selectedMonth);
  const showResults = results.length > 0 || loading || destination.trim().length >= 2;

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  async function openSearch() {
    setOpen(true);
    if (results.length || destination.trim().length >= 2) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/destinations?c=${encodeURIComponent(visitorCountry)}`);
      const payload = await response.json();
      const items = Array.isArray(payload.data) ? payload.data.slice(0, 10) : [];
      setResults(items.map((item: { _id: string; title: string; country: string; countryCode: string; images?: string[] }) => ({
        id: `destination-${item._id}`,
        title: item.title,
        destination: item.title,
        country: item.country,
        countryCode: item.countryCode,
        flag: "",
        image: item.images?.[0] ?? "",
        href: `/packages?destination=${encodeURIComponent(item.title)}&c=${encodeURIComponent(visitorCountry)}`,
      })));
      setActiveIndex(-1);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

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
    setDestination(item.destination);
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

    router.push(`/packages?${params.toString()}`);
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
    <>
      <button
        type="button"
        onClick={openSearch}
        className="glass mx-auto grid w-full max-w-3xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl p-3 text-left shadow-xl shadow-slate-950/10 dark:shadow-xl"
      >
        <span className="flex min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm">
          <MapPin className="size-4 shrink-0 text-slate-500" />
          <span className="h-10 flex-1 py-2 text-sm text-slate-500">{destination || "Search destinations"}</span>
        </span>
        <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Search className="size-5" />
        </span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-slate-950/70 px-4 pb-8 pt-[10vh] backdrop-blur-sm" onMouseDown={() => setOpen(false)}>
          <form
            onSubmit={submit}
            onMouseDown={(event) => event.stopPropagation()}
            className="w-full max-w-4xl overflow-hidden rounded-[28px] bg-white text-slate-900 shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 sm:px-7">
              <Search className="size-6 shrink-0 text-primary" />
              <label className="flex min-w-0 flex-1 items-center">
        <MapPin className="size-4 shrink-0 text-slate-500" />
        <span className="sr-only">Destination</span>
        <Input
          value={destination}
          onChange={(e) => onDestinationChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search your destination"
          autoComplete="off"
          autoFocus
          className="h-12 border-0 bg-transparent px-3 text-lg font-semibold text-slate-900 caret-slate-900 shadow-none placeholder:text-slate-500 focus-visible:ring-0"
        />
              </label>
              <Button type="button" variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close search">
                <X className="size-5" />
              </Button>
            </div>

            <div className="max-h-[65vh] overflow-y-auto p-5 sm:p-7">
              <h3 className="mb-4 text-base font-bold text-slate-900">
                {destination.trim().length >= 2 ? "Matching destinations" : "Popular destinations"}
              </h3>
            {loading ? (
              <div className="flex items-center gap-2 py-10 text-sm text-slate-500">
                <Loader2 className="size-4 animate-spin" /> Searching
              </div>
            ) : results.length ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {results.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => goToResult(item)}
                    className={cn(
                      "grid w-full grid-cols-[52px_minmax(0,1fr)] items-center gap-3 rounded-2xl border border-slate-200 p-2.5 text-left transition hover:border-primary/35 hover:bg-primary/5",
                      activeIndex === index && "border-primary/40 bg-primary/5",
                    )}
                  >
                    <span className="relative flex size-13 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-xl shadow-sm">
                      {item.image ? <Image src={item.image} alt="" fill sizes="52px" className="object-cover" /> : item.flag || <MapPin className="size-5 text-primary" />}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold leading-5 text-slate-900">{item.title}</span>
                      <span className="mt-1 block truncate text-xs font-semibold text-primary">
                        View packages · {item.country}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center text-sm text-slate-500">No matching destinations</div>
            )}
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
