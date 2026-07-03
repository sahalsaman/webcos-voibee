import Image from "next/image";
import { Compass, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { CreateLink } from "@/components/partner/create-link";
import { requireRole } from "@/lib/session";
import { getPartnerByUser, getResellableTrips } from "@/lib/dashboard";
import { getSettings } from "@/models/Settings";
import { connectDB } from "@/lib/db";
import { formatINR } from "@/lib/utils";

const FALLBACK = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=60";

interface ResellTrip {
  _id: string;
  title: string;
  destination: string;
  category: string;
  basePrice: number;
  images: string[];
  existingCommission: number | null;
}

export default async function PartnerBrowsePage() {
  const user = await requireRole(["partner"]);
  const partner = (await getPartnerByUser(user.id)) as { _id: string } | null;
  if (!partner) return <EmptyState icon={Compass} title="Partner profile not found" />;

  const trips = (await getResellableTrips(partner._id)) as ResellTrip[];

  let defaultCommission = 1000;
  try {
    await connectDB();
    defaultCommission = (await getSettings()).defaultCommission;
  } catch {
    /* ignore */
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Browse Trips</h1>
        <p className="text-muted-foreground">
          Set your commission and generate a white-label link for any trip.
        </p>
      </div>

      {trips.length ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {trips.map((t) => (
            <Card key={t._id} className="flex flex-col overflow-hidden">
              <div className="relative aspect-[16/9]">
                <Image src={t.images?.[0] || FALLBACK} alt={t.title} fill sizes="33vw" className="object-cover" />
                {t.existingCommission != null ? (
                  <Badge variant="success" className="absolute right-2 top-2">Link active</Badge>
                ) : null}
              </div>
              <CardContent className="flex flex-1 flex-col p-4">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3.5 text-primary" /> {t.destination}
                </div>
                <h3 className="mt-1 line-clamp-1 font-semibold">{t.title}</h3>
                <p className="mt-1 text-sm">
                  Base price: <span className="font-semibold">{formatINR(t.basePrice)}</span>
                </p>
                <div className="mt-auto">
                  <CreateLink
                    tripId={t._id}
                    basePrice={t.basePrice}
                    defaultCommission={defaultCommission}
                    existingCommission={t.existingCommission}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Compass}
          title="No trips available to resell yet"
          description="Once the operator publishes active trips, you can create links here."
        />
      )}
    </div>
  );
}
