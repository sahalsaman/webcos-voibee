import Link from "next/link";
import { CalendarCheck, CalendarDays, List } from "lucide-react";
import { AdminTripCalendar } from "@/components/admin/trip-calendar";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { BookingStatusSelect } from "@/components/admin/booking-status-select";
import { EditBookingDrawer } from "@/components/admin/edit-booking-drawer";
import { ManualBookingDrawer } from "@/components/admin/manual-booking-drawer";
import { listAdminBookings, listAdminBookableTrips, listAdminTrips } from "@/lib/dashboard";
import { cn, formatINR, formatDate } from "@/lib/utils";

interface Row {
  _id: string;
  bookingNumber: string;
  trip?: { title: string; destination: string };
  traveler?: { name: string; email: string };
  partner?: { businessName: string } | null;
  travelerDetails: { name?: string; email?: string; mobile: string; travellers?: number; notes?: string };
  seats: number;
  totalAmount: number;
  partnerEarnings: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

type BookingsView = "list" | "calendar";

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string | string[]; view?: string | string[] }>;
}) {
  const params = await searchParams;
  const view: BookingsView = params.view === "calendar" ? "calendar" : "list";
  const country = typeof params.c === "string" ? params.c : undefined;
  const viewHref = (nextView: BookingsView) => ({
    pathname: "/admin/bookings",
    query: { ...(country ? { c: country } : {}), view: nextView },
  });

  const [bookings, bookableTrips, trips] = await Promise.all([
    listAdminBookings() as Promise<Row[]>,
    listAdminBookableTrips(),
    listAdminTrips(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Bookings</h1>
          <p className="text-muted-foreground">{bookings.length} total</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg border border-border bg-muted/50 p-1" aria-label="Bookings view">
            <Link
              href={viewHref("list")}
              aria-current={view === "list" ? "page" : undefined}
              className={cn(
                "inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors",
                view === "list" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <List className="size-4" />
              List
            </Link>
            <Link
              href={viewHref("calendar")}
              aria-current={view === "calendar" ? "page" : undefined}
              className={cn(
                "inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors",
                view === "calendar" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <CalendarDays className="size-4" />
              Calendar
            </Link>
          </div>
          <ManualBookingDrawer trips={bookableTrips as Parameters<typeof ManualBookingDrawer>[0]["trips"]} />
        </div>
      </div>

      {view === "calendar" ? (
        <AdminTripCalendar trips={trips as Parameters<typeof AdminTripCalendar>[0]["trips"]} />
      ) : bookings.length ? (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="p-4 font-medium">Booking</th>
                  <th className="p-4 font-medium">Package</th>
                  <th className="p-4 font-medium">Traveler</th>
                  <th className="p-4 font-medium">Source</th>
                  <th className="p-4 font-medium">Seats</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Payment</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} className="border-b border-border/50 align-top hover:bg-secondary/40">
                    <td className="p-4">
                      <p className="font-mono text-xs">{b.bookingNumber}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(b.createdAt)}</p>
                    </td>
                    <td className="p-4">{b.trip?.title ?? "—"}</td>
                    <td className="p-4">
                      <p className="font-medium">{b.traveler?.name}</p>
                      <p className="text-xs text-muted-foreground">{b.travelerDetails?.mobile}</p>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {b.partner?.businessName ?? "Direct"}
                      {b.partner && b.partnerEarnings ? (
                        <p className="text-xs">Comm: {formatINR(b.partnerEarnings)}</p>
                      ) : null}
                    </td>
                    <td className="p-4">{b.seats}</td>
                    <td className="p-4 font-medium">{formatINR(b.totalAmount)}</td>
                    <td className="p-4"><StatusBadge status={b.paymentStatus} /></td>
                    <td className="p-4"><BookingStatusSelect id={b._id} status={b.status} /></td>
                    <td className="p-4 text-right"><EditBookingDrawer booking={b} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : (
        <EmptyState icon={CalendarCheck} title="No bookings yet" />
      )}
    </div>
  );
}
