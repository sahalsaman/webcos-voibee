"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type CalendarTrip = {
  _id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  totalSeats: number;
  availableSeats: number;
  status?: string;
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
  const [month, setMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const today = startOfDay(new Date());
  const days = useMemo(() => calendarDays(month), [month]);
  const tripsByDate = useMemo(() => {
    const map = new Map<string, CalendarTrip[]>();
    trips.forEach((trip) => {
      if (!trip.startDate) return;
      const key = dateKey(trip.startDate);
      map.set(key, [...(map.get(key) ?? []), trip]);
    });
    return map;
  }, [trips]);

  function moveMonth(delta: number) {
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
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
        <div className="mb-4 flex flex-wrap gap-2">
          {legend.map((item) => (
            <span key={item.state} className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium", stateStyles[item.state])}>
              {item.label}
            </span>
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
                const inMonth = day.getMonth() === month.getMonth();
                const isToday = dateKey(day) === dateKey(today);

                return (
                  <div key={key} className={cn("min-h-36 border-b border-r border-border p-2", !inMonth && "bg-secondary/30 text-muted-foreground", isToday && "bg-primary/5")}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className={cn("flex size-7 items-center justify-center rounded-full text-xs font-semibold", isToday && "bg-primary text-primary-foreground")}>
                        {day.getDate()}
                      </span>
                      {dayTrips.length ? <span className="text-[11px] text-muted-foreground">{dayTrips.length} package{dayTrips.length > 1 ? "s" : ""}</span> : null}
                    </div>
                    <div className="space-y-1.5">
                      {dayTrips.slice(0, 3).map((trip) => {
                        const totalSeats = Number(trip.totalSeats || 0);
                        const bookedSeats = Math.max(0, totalSeats - Number(trip.availableSeats || 0));
                        const state = tripState(trip, today);
                        return (
                          <Link
                            key={trip._id}
                            href={`/admin/packages/${trip._id}/edit`}
                            className={cn("block rounded-md border px-2 py-1.5 text-xs transition hover:brightness-95", stateStyles[state])}
                          >
                            <span className="block truncate font-semibold">{trip.title}</span>
                            <span className="block truncate opacity-85">{trip.destination}</span>
                            <span className="mt-1 block font-medium">{bookedSeats}/{totalSeats} seats booked</span>
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

        {!trips.length ? (
          <div className="mt-4 rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Packages added from admin will appear in this calendar.
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
