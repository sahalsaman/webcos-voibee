import { CalendarCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { BookingStatusSelect } from "@/components/admin/booking-status-select";
import { listAdminBookings } from "@/lib/dashboard";
import { formatINR, formatDate } from "@/lib/utils";

interface Row {
  _id: string;
  bookingNumber: string;
  trip?: { title: string; destination: string };
  traveler?: { name: string; email: string };
  partner?: { businessName: string } | null;
  travelerDetails: { mobile: string };
  seats: number;
  totalAmount: number;
  partnerEarnings: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export default async function AdminBookingsPage() {
  const bookings = (await listAdminBookings()) as Row[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bookings</h1>
        <p className="text-muted-foreground">{bookings.length} total</p>
      </div>

      {bookings.length ? (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="p-4 font-medium">Booking</th>
                  <th className="p-4 font-medium">Trip</th>
                  <th className="p-4 font-medium">Traveler</th>
                  <th className="p-4 font-medium">Source</th>
                  <th className="p-4 font-medium">Seats</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Payment</th>
                  <th className="p-4 font-medium">Status</th>
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
