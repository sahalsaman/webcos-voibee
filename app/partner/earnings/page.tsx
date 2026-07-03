import { Wallet, Clock, CheckCircle2, Banknote } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { AreaTrendChart } from "@/components/dashboard/charts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/session";
import {
  getPartnerByUser,
  getPartnerStats,
  getPartnerEarningsChart,
  getPartnerCommissions,
} from "@/lib/dashboard";
import { formatINR, formatDate } from "@/lib/utils";

interface Commission {
  _id: string;
  amount: number;
  status: string;
  createdAt: string;
  trip?: { title: string };
  booking?: { bookingNumber: string };
}

export default async function PartnerEarningsPage() {
  const user = await requireRole(["partner"]);
  const partner = (await getPartnerByUser(user.id)) as { _id: string } | null;
  if (!partner) return <EmptyState icon={Wallet} title="Partner profile not found" />;

  const [stats, chart, commissions] = await Promise.all([
    getPartnerStats(partner._id),
    getPartnerEarningsChart(partner._id),
    getPartnerCommissions(partner._id),
  ]);
  const ledger = commissions as Commission[];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Earnings</h1>
          <p className="text-muted-foreground">Track your commissions & payouts</p>
        </div>
        <Button variant="gradient" disabled={stats.pendingEarnings <= 0}>
          <Banknote className="size-4" /> Request payout
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Earnings" value={formatINR(stats.totalEarnings)} icon={Wallet} accent="success" />
        <StatCard label="Pending" value={formatINR(stats.pendingEarnings)} icon={Clock} accent="warning" />
        <StatCard label="Paid Out" value={formatINR(stats.paidEarnings)} icon={CheckCircle2} accent="primary" />
      </div>

      <AreaTrendChart title="Monthly Earnings" data={chart} xKey="month" yKey="earnings" currency />

      <Card>
        <CardHeader><CardTitle>Commission ledger</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          {ledger.length ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="p-2 font-medium">Booking</th>
                  <th className="p-2 font-medium">Trip</th>
                  <th className="p-2 font-medium">Amount</th>
                  <th className="p-2 font-medium">Status</th>
                  <th className="p-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {ledger.map((c) => (
                  <tr key={c._id} className="border-b border-border/50">
                    <td className="p-2 font-mono text-xs">{c.booking?.bookingNumber ?? "—"}</td>
                    <td className="p-2">{c.trip?.title ?? "—"}</td>
                    <td className="p-2 font-semibold text-primary">{formatINR(c.amount)}</td>
                    <td className="p-2"><StatusBadge status={c.status} /></td>
                    <td className="p-2 text-muted-foreground">{formatDate(c.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState icon={Wallet} title="No commissions yet" description="Earnings appear here after your first booking." />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
