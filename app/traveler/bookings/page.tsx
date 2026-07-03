import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ShoppingBag, Calendar, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { requireRole } from "@/lib/session";
import { getTravelerBookings } from "@/lib/dashboard";
import { formatINR, formatDate } from "@/lib/utils";

const FALLBACK = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=300&q=60";

interface Booking {
  _id: string;
  bookingNumber: string;
  trip?: { title: string; destination: string; images: string[]; slug: string; startDate: string; endDate: string };
  seats: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export default async function TravelerBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const user = await requireRole(["traveler"]);
  const { success } = await searchParams;
  const bookings = (await getTravelerBookings(user.id)) as Booking[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <p className="text-muted-foreground">{bookings.length} booking(s)</p>
      </div>

      {success ? (
        <Card className="border-success/40 bg-success/5">
          <CardContent className="flex items-center gap-3 p-4">
            <CheckCircle2 className="size-5 text-success" />
            <p className="text-sm">
              Booking <span className="font-mono font-semibold">{success}</span> confirmed.
              A confirmation has been sent to your email.
            </p>
          </CardContent>
        </Card>
      ) : null}

      {bookings.length ? (
        <div className="space-y-4">
          {bookings.map((b) => (
            <Card key={b._id}>
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <Image
                  src={b.trip?.images?.[0] || FALLBACK}
                  alt=""
                  width={120}
                  height={90}
                  className="h-24 w-full rounded-lg object-cover sm:w-32"
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{b.trip?.title ?? "Trip"}</h3>
                    <StatusBadge status={b.status} />
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="size-3.5" /> {b.trip?.destination}</span>
                    <span className="flex items-center gap-1"><Calendar className="size-3.5" /> {b.trip ? formatDate(b.trip.startDate) : "—"}</span>
                    <span>{b.seats} seat(s)</span>
                    <span className="font-mono">{b.bookingNumber}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <span className="text-lg font-bold">{formatINR(b.totalAmount)}</span>
                  {b.trip ? (
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/trips/${b.trip.slug}`}>View trip</Link>
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ShoppingBag}
          title="No bookings yet"
          description="Your booked trips will show up here."
          action={
            <Button asChild variant="gradient">
              <Link href="/trips">Explore trips</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
