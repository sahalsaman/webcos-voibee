import Link from "next/link";
import { Heart } from "lucide-react";
import { TripCard } from "@/components/trip/trip-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/session";
import { getTravelerWishlist } from "@/lib/dashboard";
import type { TripDTO } from "@/types";

export default async function TravelerWishlistPage() {
  const user = await requireRole(["traveler"]);
  const wishlist = (await getTravelerWishlist(user.id)) as TripDTO[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Wishlist</h1>
        <p className="text-muted-foreground">{wishlist.length} saved trip(s)</p>
      </div>

      {wishlist.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((t) => (
            <TripCard key={t._id} trip={t} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save trips you love to find them here later."
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
