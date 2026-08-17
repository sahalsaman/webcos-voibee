import Link from "next/link";
import { Pencil, Plus, Route } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { listAdminTrips } from "@/lib/dashboard";
import { destinationImage } from "@/lib/images";
import { cn, formatDate, formatINR } from "@/lib/utils";
import type { TripDTO } from "@/types";

type ScheduleFilter = "scheduled" | "non-scheduled";

export default async function ItineraryInventoryPage({ searchParams }: { searchParams: Promise<{ schedule?: string; c?: string }> }) {
  const params = await searchParams;
  const schedule: ScheduleFilter = params.schedule === "scheduled" ? "scheduled" : "non-scheduled";
  const allTrips = await listAdminTrips() as TripDTO[];
  const scheduledCount = allTrips.filter((trip) => !(trip.holidayPackage ?? false)).length;
  const nonScheduledCount = allTrips.length - scheduledCount;
  const trips = allTrips.filter((trip) => schedule === "scheduled" ? !(trip.holidayPackage ?? false) : (trip.holidayPackage ?? false));
  const filters = [{ value: "non-scheduled", label: "Non-scheduled", count: nonScheduledCount }, { value: "scheduled", label: "Scheduled", count: scheduledCount }] as const;

  return <div className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-bold">Itinerary</h2><p className="text-sm text-muted-foreground">Travel plans and their day-by-day itineraries.</p></div><div className="flex items-center gap-3"><div className="inline-flex rounded-lg border border-border bg-muted/50 p-1" aria-label="Schedule filter">{filters.map((item) => <Link key={item.value} href={{ pathname: "/admin/inventory/itinerary", query: { ...(params.c ? { c: params.c } : {}), ...(item.value === "scheduled" ? { schedule: item.value } : {}) } }} aria-current={schedule === item.value ? "page" : undefined} className={cn("inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors", schedule === item.value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>{item.label}<span className="rounded-full bg-secondary px-1.5 py-0.5 text-[11px]">{item.count}</span></Link>)}</div><Button asChild variant="gradient"><Link href="/admin/inventory/itinerary/new"><Plus className="size-4" />Add Itinerary</Link></Button></div></div>
    {trips.length ? <Card><CardContent className="overflow-x-auto p-0"><table className="w-full min-w-[1020px] text-sm"><thead><tr className="border-b text-left text-muted-foreground"><th className="p-4">Itinerary</th><th className="p-4">Destination / Type</th><th className="p-4">Schedule</th><th className="p-4">Days</th><th className="p-4">Seats</th><th className="p-4">Price</th><th className="p-4">Status</th><th className="p-4 text-right">Action</th></tr></thead><tbody>{trips.map((trip) => { const customDate = trip.holidayPackage ?? false; return <tr key={trip._id} className="border-b border-border/50 align-top hover:bg-secondary/30"><td className="p-4"><div className="flex w-72 gap-3"><div className="h-12 w-18 shrink-0 rounded-md bg-cover bg-center" style={{ backgroundImage: `url(${JSON.stringify(trip.images?.[0] || destinationImage(trip.destination)).slice(1, -1)})` }} /><div className="min-w-0"><p className="truncate font-semibold">{trip.title}</p>{trip.featured ? <Badge variant="warning" className="mt-1">Featured</Badge> : null}<Badge variant="secondary" className="mt-1">{trip.category}</Badge></div></div></td><td className="p-4"><p className="font-medium">{trip.destination}</p><span className="text-xs text-muted-foreground">{trip.country}</span></td><td className="p-4 text-xs">{customDate ? <><p className="font-medium">Customer selected</p><p className="text-muted-foreground">Flexible departure</p></> : <><p>{formatDate(trip.startDate)}</p><p className="text-muted-foreground">to {formatDate(trip.endDate)}</p></>}</td><td className="p-4"><p className="font-semibold">{trip.itinerary?.length ?? 0} days</p></td><td className="p-4">{customDate ? <span className="text-xs text-muted-foreground">On request</span> : <p className="font-semibold">{trip.availableSeats}/{trip.totalSeats}</p>}</td><td className="p-4"><p className="font-semibold text-primary">{formatINR(trip.basePrice)}</p></td><td className="p-4"><StatusBadge status={trip.status} /></td><td className="p-4 text-right"><Button asChild variant="outline" size="sm"><Link href={`/admin/inventory/itinerary/${trip._id}/edit`}><Pencil className="size-3.5" />Edit</Link></Button></td></tr>; })}</tbody></table></CardContent></Card> : <EmptyState icon={Route} title="No itineraries" action={<Button asChild variant="gradient"><Link href="/admin/inventory/itinerary/new"><Plus className="size-4" />Add Itinerary</Link></Button>} />}
  </div>;
}
