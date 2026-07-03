import { Link2, MousePointerClick } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LinkActions } from "@/components/partner/link-actions";
import { requireRole } from "@/lib/session";
import { getPartnerByUser, getPartnerLinks } from "@/lib/dashboard";
import { formatINR, whiteLabelUrl } from "@/lib/utils";
import Link from "next/link";

interface Row {
  _id: string;
  partnerSlug: string;
  tripSlug: string;
  commission: number;
  sellingPrice: number;
  active: boolean;
  clicks: number;
  bookings: number;
  trip?: { title: string; destination: string; basePrice: number };
}

export default async function PartnerLinksPage() {
  const user = await requireRole(["partner"]);
  const partner = (await getPartnerByUser(user.id)) as { _id: string } | null;
  if (!partner) return <EmptyState icon={Link2} title="Partner profile not found" />;

  const links = (await getPartnerLinks(partner._id)) as Row[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Links</h1>
          <p className="text-muted-foreground">{links.length} white-label link(s)</p>
        </div>
        <Button asChild variant="gradient">
          <Link href="/partner/browse"><Link2 className="size-4" /> New link</Link>
        </Button>
      </div>

      {links.length ? (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="p-4 font-medium">Trip</th>
                  <th className="p-4 font-medium">Commission</th>
                  <th className="p-4 font-medium">Selling price</th>
                  <th className="p-4 font-medium">Clicks</th>
                  <th className="p-4 font-medium">Bookings</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {links.map((l) => (
                  <tr key={l._id} className="border-b border-border/50 hover:bg-secondary/40">
                    <td className="p-4">
                      <p className="font-medium">{l.trip?.title ?? l.tripSlug}</p>
                      <p className="font-mono text-xs text-muted-foreground">/p/{l.partnerSlug}/{l.tripSlug}</p>
                    </td>
                    <td className="p-4 font-medium text-primary">{formatINR(l.commission)}</td>
                    <td className="p-4">{formatINR(l.sellingPrice)}</td>
                    <td className="p-4">
                      <span className="flex items-center gap-1">
                        <MousePointerClick className="size-3.5 text-muted-foreground" />{l.clicks}
                      </span>
                    </td>
                    <td className="p-4">{l.bookings}</td>
                    <td className="p-4">
                      <Badge variant={l.active ? "success" : "secondary"}>
                        {l.active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <LinkActions
                        id={l._id}
                        url={whiteLabelUrl(l.partnerSlug, l.tripSlug)}
                        active={l.active}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : (
        <EmptyState
          icon={Link2}
          title="No links yet"
          description="Create your first white-label link to start earning commissions."
          action={
            <Button asChild variant="gradient">
              <Link href="/partner/browse">Browse trips</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
