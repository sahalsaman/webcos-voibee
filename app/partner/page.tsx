import Link from "next/link";
import {
  Wallet,
  CalendarCheck,
  Link2,
  TrendingUp,
  Clock,
  AlertCircle,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { AreaTrendChart } from "@/components/dashboard/charts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { requireRole } from "@/lib/session";
import {
  getPartnerByUser,
  getPartnerStats,
  getPartnerEarningsChart,
} from "@/lib/dashboard";
import { formatINR } from "@/lib/utils";

export default async function PartnerDashboard() {
  const user = await requireRole(["partner"]);
  const partner = (await getPartnerByUser(user.id)) as
    | { _id: string; businessName: string; status: string; slug: string }
    | null;

  if (!partner) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Partner profile not found"
        description="Your partner profile is missing. Please contact support."
      />
    );
  }

  const [stats, chart] = await Promise.all([
    getPartnerStats(partner._id),
    getPartnerEarningsChart(partner._id),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {partner.businessName}</h1>
          <p className="text-muted-foreground">Your reselling performance at a glance</p>
        </div>
        <Button asChild variant="gradient">
          <Link href="/partner/browse">
            <Link2 className="size-4" /> Create white-label link
          </Link>
        </Button>
      </div>

      {partner.status !== "approved" ? (
        <Card className="border-warning/40 bg-warning/5">
          <CardContent className="flex items-center gap-3 p-4">
            <Clock className="size-5 text-warning" />
            <div>
              <p className="font-medium">Account {partner.status}</p>
              <p className="text-sm text-muted-foreground">
                Your white-label links go live once an admin approves your account.
              </p>
            </div>
            <Badge variant="warning" className="ml-auto capitalize">{partner.status}</Badge>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Bookings" value={stats.bookings} icon={CalendarCheck} accent="accent" />
        <StatCard label="Total Earnings" value={formatINR(stats.totalEarnings)} icon={Wallet} accent="success" hint={`${formatINR(stats.pendingEarnings)} pending`} />
        <StatCard label="Active Links" value={stats.activeLinks} icon={Link2} />
        <StatCard label="Conversion Rate" value={`${stats.conversion}%`} icon={TrendingUp} accent="warning" hint={`${stats.clicks} link clicks`} />
      </div>

      <AreaTrendChart title="Monthly Earnings" data={chart} xKey="month" yKey="earnings" currency />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Quick actions</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            <Button asChild variant="outline" className="justify-start">
              <Link href="/partner/browse"><Link2 className="size-4" /> Browse & create links</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/partner/bookings"><CalendarCheck className="size-4" /> View bookings</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/partner/earnings"><Wallet className="size-4" /> Earnings & payouts</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Your storefront</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Your white-label namespace:</p>
            <p className="mt-1 font-mono text-sm">/p/{partner.slug}/&lt;trip&gt;</p>
            <p className="mt-4 text-sm text-muted-foreground">
              Share trip links with your audience. Every booking earns you commission
              automatically.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
