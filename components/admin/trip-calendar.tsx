"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type CalendarTrip = {
  _id: string;
  packageId: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  totalSeats: number;
  availableSeats: number;
  status?: string;
  source: "package" | "booking";
  bookingNumber?: string;
  travelerName?: string;
};

type TripCalendarState = "upcoming-open" | "upcoming-full" | "started" | "completed";

const stateStyles: Record<TripCalendarState, string> = {
  "upcoming-open": "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200",
  "upcoming-full": "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-100",
  started: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-100",
  completed: "border-green-200 bg-green-50 text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-100",
};

const legend = [
  { state: "upcoming-open" as const, label: "Coming, seats pending" },
  { state: "upcoming-full" as const, label: "Coming, seats full" },
  { state: "started" as const, label: "Package started" },
  { state: "completed" as const, label: "Package completed" },
];

function startOfDay(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function dateKey(value: Date | string) {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function monthLabel(value: Date) {
  return value.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

function tripState(trip: CalendarTrip, today: Date): TripCalendarState {
  const start = startOfDay(new Date(trip.startDate));
  const end = startOfDay(new Date(trip.endDate || trip.startDate));
  const totalSeats = Number(trip.totalSeats || 0);
  const availableSeats = Number(trip.availableSeats || 0);
  const bookedSeats = Math.max(0, totalSeats - availableSeats);

  if (end < today) return "completed";
  if (start <= today && end >= today) return "started";
  return bookedSeats >= totalSeats && totalSeats > 0 ? "upcoming-full" : "upcoming-open";
}

function tripDuration(trip: CalendarTrip) {
  const start = startOfDay(new Date(trip.startDate));
  const end = startOfDay(new Date(trip.endDate || trip.startDate));
  const millisecondsPerDay = 86_400_000;
  const total = Math.max(1, Math.round((end.getTime() - start.getTime()) / millisecondsPerDay) + 1);
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  const startLabel = start.toLocaleDateString("en-IN", sameMonth ? { day: "numeric" } : { day: "numeric", month: "short" });
  const endLabel = end.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  return {
    total,
    range: total === 1 ? endLabel : `${startLabel}–${endLabel}`,
  };
}

function calendarDays(month: Date) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}

export function AdminTripCalendar({ trips }: { trips: CalendarTrip[] }) {
  const [selectedPackage, setSelectedPackage] = useState("all");
  const [visibleStates, setVisibleStates] = useState<Set<TripCalendarState>>(
    () => new Set(legend.map((item) => item.state)),
  );
  const [month, setMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const today = useMemo(() => startOfDay(new Date()), []);
  const days = useMemo(() => calendarDays(month), [month]);
  const packageOptions = useMemo(() => Array.from(
    new Map(trips.map((trip) => [trip.packageId, { id: trip.packageId, title: trip.title, destination: trip.destination }])).values(),
  ), [trips]);
  const filteredTrips = useMemo(() => trips.filter((trip) => {
    if (selectedPackage !== "all" && trip.packageId !== selectedPackage) return false;
    return visibleStates.has(tripState(trip, today));
  }), [selectedPackage, trips, today, visibleStates]);
  const tripsByDate = useMemo(() => {
    const map = new Map<string, CalendarTrip[]>();
    filteredTrips.forEach((trip) => {
      if (!trip.startDate) return;
      const key = dateKey(trip.startDate);
      map.set(key, [...(map.get(key) ?? []), trip]);
    });
    return map;
  }, [filteredTrips]);
  const activeTripsByDate = useMemo(() => {
    const map = new Map<string, CalendarTrip[]>();
    filteredTrips.forEach((trip) => {
      if (!trip.startDate) return;
      const start = startOfDay(new Date(trip.startDate));
      const end = startOfDay(new Date(trip.endDate || trip.startDate));
      const lastDay = end >= start ? end : start;
      const cursor = new Date(start);
      while (cursor <= lastDay) {
        const key = dateKey(cursor);
        map.set(key, [...(map.get(key) ?? []), trip]);
        cursor.setDate(cursor.getDate() + 1);
      }
    });
    return map;
  }, [filteredTrips]);

  function moveMonth(delta: number) {
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  }

  function toggleState(state: TripCalendarState) {
    setVisibleStates((current) => {
      const next = new Set(current);
      if (next.has(state)) next.delete(state);
      else next.add(state);
      return next;
    });
  }

  function resetFilters() {
    setSelectedPackage("all");
    setVisibleStates(new Set(legend.map((item) => item.state)));
  }

  return (
    <Card>
      <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Package Calendar</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">Date wise packages with booked and total seats</p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="icon" onClick={() => moveMonth(-1)} aria-label="Previous month">
            <ChevronLeft className="size-4" />
          </Button>
          <div className="min-w-36 text-center text-sm font-semibold">{monthLabel(month)}</div>
          <Button type="button" variant="outline" size="icon" onClick={() => moveMonth(1)} aria-label="Next month">
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col gap-3 rounded-xl border border-border bg-secondary/25 p-3 lg:flex-row lg:items-center">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground lg:mr-1">
            <Filter className="size-4 text-primary" />Filters
          </div>
          <div className="flex-1">
            <Select value={selectedPackage} onChange={(event) => setSelectedPackage(event.target.value)} aria-label="Filter calendar by package">
              <option value="all">All packages ({packageOptions.length})</option>
              {packageOptions.map((trip) => <option key={trip.id} value={trip.id}>{trip.title} — {trip.destination}</option>)}
            </Select>
          </div>
          {selectedPackage !== "all" || visibleStates.size !== legend.length ? (
            <Button type="button" variant="ghost" onClick={resetFilters}>
              <RotateCcw />Reset
            </Button>
          ) : null}
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {legend.map((item) => (
            <label key={item.state} className={cn("inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-opacity", stateStyles[item.state], !visibleStates.has(item.state) && "opacity-45 grayscale")}>
              <input
                type="checkbox"
                checked={visibleStates.has(item.state)}
                onChange={() => toggleState(item.state)}
                className="size-3.5 cursor-pointer accent-current"
              />
              {item.label}
            </label>
          ))}
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[980px] overflow-hidden rounded-lg border border-border">
            <div className="grid grid-cols-7 border-b border-border bg-secondary/60 text-xs font-semibold uppercase text-muted-foreground">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="px-3 py-2">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {days.map((day) => {
                const key = dateKey(day);
                const dayTrips = tripsByDate.get(key) ?? [];
                const activeTrips = activeTripsByDate.get(key) ?? [];
                const continuingTrips = activeTrips.filter((trip) => dateKey(trip.startDate) !== key);
                const inMonth = day.getMonth() === month.getMonth();
                const isToday = dateKey(day) === dateKey(today);

                return (
                  <div key={key} className={cn("min-h-36 border-b border-r border-border p-2", !inMonth && "bg-secondary/30 text-muted-foreground", isToday && "bg-primary/5", activeTrips.length && "bg-blue-50/55 dark:bg-blue-500/5")}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className={cn("flex size-7 items-center justify-center rounded-full text-xs font-semibold", isToday && "bg-primary text-primary-foreground")}>
                        {day.getDate()}
                      </span>
                      {dayTrips.length ? <span className="text-[11px] text-muted-foreground">{dayTrips.length} package{dayTrips.length > 1 ? "s" : ""}</span> : null}
                    </div>
                    {continuingTrips.length ? (
                      <div className="mb-1.5 space-y-1">
                        {continuingTrips.slice(0, 3).map((trip) => {
                          const duration = tripDuration(trip);
                          const isLastDay = dateKey(trip.endDate || trip.startDate) === key;
                          return (
                            <Link
                              key={`continuation-${trip._id}`}
                              href={trip.source === "booking" ? `/admin/bookings?view=list&q=${encodeURIComponent(trip.bookingNumber || "")}` : `/admin/inventory/packages/${trip.packageId}/edit`}
                              className="flex items-center gap-1.5 rounded-full bg-blue-600 px-2 py-1 text-[10px] font-semibold text-white shadow-sm"
                              title={`${trip.title}: ${duration.range}`}
                            >
                              <span className="size-1.5 shrink-0 rounded-full bg-white" />
                              <span className="truncate">{isLastDay ? "Ends" : "Continues"}: {trip.title}</span>
                            </Link>
                          );
                        })}
                      </div>
                    ) : null}
                    <div className="space-y-1.5">
                      {dayTrips.slice(0, 3).map((trip) => {
                        const totalSeats = Number(trip.totalSeats || 0);
                        const bookedSeats = Math.max(0, totalSeats - Number(trip.availableSeats || 0));
                        const state = tripState(trip, today);
                        const duration = tripDuration(trip);
                        return (
                          <Link
                            key={trip._id}
                            href={trip.source === "booking" ? `/admin/bookings?view=list&q=${encodeURIComponent(trip.bookingNumber || "")}` : `/admin/inventory/packages/${trip.packageId}/edit`}
                            className={cn("block rounded-md border px-2 py-1.5 text-xs transition hover:brightness-95", stateStyles[state])}
                          >
                            <span className="flex items-center justify-between gap-1 font-semibold">
                              <span className="truncate">{trip.title}</span>
                              <span className="shrink-0 rounded bg-white/55 px-1.5 py-0.5 text-[10px]">{duration.total} day{duration.total === 1 ? "" : "s"}</span>
                            </span>
                            <span className="block truncate opacity-85">{trip.destination}</span>
                            <span className="block truncate font-medium opacity-90">{duration.range}</span>
                            {trip.source === "booking" ? (
                              <>
                                <span className="block truncate opacity-85">{trip.travelerName || trip.bookingNumber}</span>
                                <span className="mt-1 block font-medium">{trip.totalSeats} traveler{trip.totalSeats === 1 ? "" : "s"} · Booked</span>
                              </>
                            ) : <span className="mt-1 block font-medium">{bookedSeats}/{totalSeats} seats booked</span>}
                          </Link>
                        );
                      })}
                      {dayTrips.length > 3 ? (
                        <div className="rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground">
                          +{dayTrips.length - 3} more packages
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {!filteredTrips.length ? (
          <div className="mt-4 rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            {trips.length ? "No packages or bookings match the selected filters." : "Fixed departures and flexible-package bookings will appear in this calendar."}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
