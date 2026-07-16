import Image from "next/image";
import Link from "next/link";
import { Megaphone, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { OfferCardRowActions } from "@/components/admin/offer-card-row-actions";
import { listAdminOfferCards } from "@/lib/dashboard";
import type { OfferCardDTO } from "@/types";

const FALLBACK = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=200&q=60";

export default async function AdminOffersPage() {
  const offers = (await listAdminOfferCards()) as OfferCardDTO[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Offer Cards</h1>
          <p className="text-muted-foreground">Manage homepage carousel banners</p>
        </div>
        <Button asChild variant="gradient">
          <Link href="/admin/offers/new"><Plus className="size-4" /> New Offer</Link>
        </Button>
      </div>

      {offers.length ? (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="p-4 font-medium">Offer</th>
                  <th className="p-4 font-medium">Target</th>
                  <th className="p-4 font-medium">Order</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <tr key={offer._id} className="border-b border-border/50 hover:bg-secondary/40">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={offer.images?.[0] || FALLBACK}
                          alt=""
                          width={72}
                          height={48}
                          className="h-12 w-20 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium">{offer.title}</p>
                          <p className="line-clamp-1 text-xs text-muted-foreground">{offer.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{offer.countryCode} · {offer.href}</td>
                    <td className="p-4">{offer.sortOrder}</td>
                    <td className="p-4"><StatusBadge status={offer.status} /></td>
                    <td className="p-4"><OfferCardRowActions id={offer._id} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : (
        <EmptyState
          icon={Megaphone}
          title="No offer cards yet"
          description="Create up to four active banners for the homepage carousel."
          action={
            <Button asChild variant="gradient">
              <Link href="/admin/offers/new"><Plus className="size-4" /> New Offer</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
