import Link from "next/link";
import Image from "next/image";
import { Plus, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { TripRowActions } from "@/components/admin/trip-row-actions";
import { listAdminTrips } from "@/lib/dashboard";
import { formatINR, formatDate } from "@/lib/utils";
import type { TripDTO } from "@/types";

const FALLBACK = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=200&q=60";

export default async function AdminTripsPage() {
  const trips = (await listAdminTrips()) as TripDTO[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Trips</h1>
          <p className="text-muted-foreground">{trips.length} total</p>
        </div>
        <Button asChild variant="gradient">
          <Link href="/admin/trips/new"><Plus className="size-4" /> New Trip</Link>
        </Button>
      </div>

      {trips.length ? (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="p-4 font-medium">Trip</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Seats</th>
                  <th className="p-4 font-medium">Dates</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((t) => (
                  <tr key={t._id} className="border-b border-border/50 hover:bg-secondary/40">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={t.images?.[0] || FALLBACK}
                          alt=""
                          width={48}
                          height={48}
                          className="size-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium">{t.title}</p>
                          <p className="text-xs text-muted-foreground">{t.destination} · {t.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-medium">{formatINR(t.basePrice)}</td>
                    <td className="p-4">{t.availableSeats}/{t.totalSeats}</td>
                    <td className="p-4 text-muted-foreground">{formatDate(t.startDate)}</td>
                    <td className="p-4"><StatusBadge status={t.status} /></td>
                    <td className="p-4"><TripRowActions id={t._id} slug={t.slug} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : (
        <EmptyState
          icon={Plane}
          title="No trips yet"
          description="Create your first travel package to start selling."
          action={
            <Button asChild variant="gradient">
              <Link href="/admin/trips/new"><Plus className="size-4" /> New Trip</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
