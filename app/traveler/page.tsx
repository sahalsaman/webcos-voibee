import Link from "next/link";
import { Plane, CheckCircle2, Heart, Compass } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { TripCard } from "@/components/trip/trip-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { requireRole } from "@/lib/session";
import { getTravelerBookings, getTravelerWishlist } from "@/lib/dashboard";
import { formatINR, formatDate } from "@/lib/utils";
import type { TripDTO } from "@/types";

interface Booking {
  _id: string;
  bookingNumber: string;
  trip?: { title: string; destination: string; startDate: string; endDate: string };
  seats: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default async function TravelerDashboard() {
  const user = await requireRole(["traveler"]);
  const [bookings, wishlist] = await Promise.all([
    getTravelerBookings(user.id),
    getTravelerWishlist(user.id),
  ]);
  const list = bookings as Booking[];
  const now = new Date().getTime();

  const upcoming = list.filter(
    (b) => b.status !== "cancelled" && b.trip && new Date(b.trip.endDate).getTime() >= now,
  );
  const completed = list.filter(
    (b) => b.status === "completed" || (b.trip && new Date(b.trip.endDate).getTime() < now),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Hi {user.name?.split(" ")[0] ?? "traveler"} 👋</h1>
        <p className="text-muted-foreground">Your journeys, all in one place</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Upcoming Trips" value={upcoming.length} icon={Plane} accent="primary" />
        <StatCard label="Completed Trips" value={completed.length} icon={CheckCircle2} accent="success" />
        <StatCard label="Wishlist" value={(wishlist as unknown[]).length} icon={Heart} accent="accent" />
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Recent bookings</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/traveler/bookings">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {list.length ? (
            <div className="space-y-3">
              {list.slice(0, 5).map((b) => (
                <div key={b._id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3">
                  <div>
                    <p className="font-medium">{b.trip?.title ?? "Trip"}</p>
                    <p className="text-xs text-muted-foreground">
                      {b.bookingNumber} · {b.seats} seat(s) · {b.trip ? formatDate(b.trip.startDate) : "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{formatINR(b.totalAmount)}</span>
                    <StatusBadge status={b.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Compass}
              title="No bookings yet"
              description="Start exploring and book your first adventure!"
              action={
                <Button asChild variant="gradient">
                  <Link href="/trips">Explore trips</Link>
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>

      {wishlist && (wishlist as TripDTO[]).length ? (
        <div>
          <h2 className="mb-4 text-xl font-bold">From your wishlist</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(wishlist as TripDTO[]).slice(0, 3).map((t) => (
              <TripCard key={t._id} trip={t} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
