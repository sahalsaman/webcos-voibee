import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { PartnerActions } from "@/components/admin/partner-actions";
import { listAdminPartners } from "@/lib/dashboard";
import { formatINR } from "@/lib/utils";

interface Row {
  _id: string;
  businessName: string;
  slug: string;
  partnerType: string;
  status: string;
  totalEarnings: number;
  pendingEarnings: number;
  user?: { name: string; email: string };
}

export default async function AdminPartnersPage() {
  const partners = (await listAdminPartners()) as Row[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Partners</h1>
        <p className="text-muted-foreground">{partners.length} registered</p>
      </div>

      {partners.length ? (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="p-4 font-medium">Business</th>
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium">Slug</th>
                  <th className="p-4 font-medium">Earnings</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {partners.map((p) => (
                  <tr key={p._id} className="border-b border-border/50 hover:bg-secondary/40">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={p.businessName} size={38} />
                        <div>
                          <p className="font-medium">{p.businessName}</p>
                          <p className="text-xs text-muted-foreground">{p.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{p.partnerType}</td>
                    <td className="p-4 font-mono text-xs">/p/{p.slug}</td>
                    <td className="p-4">
                      <p className="font-medium">{formatINR(p.totalEarnings)}</p>
                      <p className="text-xs text-muted-foreground">{formatINR(p.pendingEarnings)} pending</p>
                    </td>
                    <td className="p-4"><StatusBadge status={p.status} /></td>
                    <td className="p-4"><PartnerActions id={p._id} status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : (
        <EmptyState icon={Users} title="No partners yet" description="Approved partners will appear here." />
      )}
    </div>
  );
}
