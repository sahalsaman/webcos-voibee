import { CalendarCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { requireRole } from "@/lib/session";
import { getPartnerByUser, getPartnerBookings } from "@/lib/dashboard";
import { formatINR, formatDate } from "@/lib/utils";

interface Row {
  _id: string;
  bookingNumber: string;
  trip?: { title: string };
  traveler?: { name: string };
  travelerDetails: { mobile: string; email: string };
  seats: number;
  totalAmount: number;
  partnerEarnings: number;
  status: string;
  createdAt: string;
}

export default async function PartnerBookingsPage() {
  const user = await requireRole(["partner"]);
  const partner = (await getPartnerByUser(user.id)) as { _id: string } | null;
  if (!partner) return <EmptyState icon={CalendarCheck} title="Partner profile not found" />;

  const bookings = (await getPartnerBookings(partner._id)) as Row[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bookings</h1>
        <p className="text-muted-foreground">Bookings made through your links</p>
      </div>

      {bookings.length ? (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="p-4 font-medium">Booking</th>
                  <th className="p-4 font-medium">Trip</th>
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Seats</th>
                  <th className="p-4 font-medium">Sale</th>
                  <th className="p-4 font-medium">You earn</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} className="border-b border-border/50 hover:bg-secondary/40">
                    <td className="p-4">
                      <p className="font-mono text-xs">{b.bookingNumber}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(b.createdAt)}</p>
                    </td>
                    <td className="p-4">{b.trip?.title ?? "—"}</td>
                    <td className="p-4">
                      <p className="font-medium">{b.traveler?.name}</p>
                      <p className="text-xs text-muted-foreground">{b.travelerDetails?.mobile}</p>
                    </td>
                    <td className="p-4">{b.seats}</td>
                    <td className="p-4">{formatINR(b.totalAmount)}</td>
                    <td className="p-4 font-semibold text-primary">{formatINR(b.partnerEarnings)}</td>
                    <td className="p-4"><StatusBadge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : (
        <EmptyState icon={CalendarCheck} title="No bookings yet" description="Share your links to start earning." />
      )}
    </div>
  );
}
