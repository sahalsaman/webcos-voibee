import Image from "next/image";
import Link from "next/link";
import { Globe2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { DestinationRowActions } from "@/components/admin/destination-row-actions";
import { listAdminDestinations } from "@/lib/dashboard";
import { formatINR } from "@/lib/utils";
import type { DestinationDTO } from "@/types";

const FALLBACK = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=200&q=60";

export default async function AdminDestinationsPage() {
  const destinations = (await listAdminDestinations()) as DestinationDTO[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Destinations</h1>
          <p className="text-muted-foreground">{destinations.length} total destinations</p>
        </div>
        <Button asChild variant="gradient">
          <Link href="/admin/destinations/new"><Plus className="size-4" /> New Destination</Link>
        </Button>
      </div>

      {destinations.length ? (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="p-4 font-medium">Destination</th>
                  <th className="p-4 font-medium">Country</th>
                  <th className="p-4 font-medium">Base price</th>
                  <th className="p-4 font-medium">Highlight</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {destinations.map((destination) => (
                  <tr key={destination._id} className="border-b border-border/50 hover:bg-secondary/40">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Image src={destination.images?.[0] || FALLBACK} alt="" width={56} height={44} className="h-11 w-16 rounded-lg object-cover" />
                        <div>
                          <p className="font-medium">{destination.title}</p>
                          <p className="line-clamp-1 text-xs text-muted-foreground">{destination.tags?.join(", ") || "No tags"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{destination.country} ({destination.countryCode})</td>
                    <td className="p-4 font-medium">{formatINR(destination.basePrice)}</td>
                    <td className="p-4">{destination.featured ? "Yes" : "No"}</td>
                    <td className="p-4"><StatusBadge status={destination.status} /></td>
                    <td className="p-4"><DestinationRowActions id={destination._id} status={destination.status} featured={destination.featured} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : (
        <EmptyState
          icon={Globe2}
          title="No destinations yet"
          description="Add domestic and international destinations for website filters and trip forms."
          action={<Button asChild variant="gradient"><Link href="/admin/destinations/new"><Plus className="size-4" /> New Destination</Link></Button>}
        />
      )}
    </div>
  );
}
