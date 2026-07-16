import { Users } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { TravelerDetailDrawer } from "@/components/admin/traveler-detail-drawer";
import { listAdminTravelers } from "@/lib/dashboard";

export default async function AdminTravelersPage() {
  const travelers = await listAdminTravelers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Travelers</h1>
        <p className="text-muted-foreground">Customer list with booking history</p>
      </div>
      {travelers.length ? <TravelerDetailDrawer travelers={travelers as never} /> : (
        <EmptyState icon={Users} title="No travelers yet" description="Registered traveler accounts will appear here." />
      )}
    </div>
  );
}
