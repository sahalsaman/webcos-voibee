import { CreditCard, Landmark, ReceiptText, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { getAdminFinanceSummary } from "@/lib/dashboard";
import { formatINR } from "@/lib/utils";

export default async function AdminFinancePage() {
  const finance = await getAdminFinanceSummary();
  const totals = finance.totals;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Financial Management</h1>
        <p className="text-muted-foreground">Revenue, payments, partner earnings and commission ledger</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Paid Revenue" value={formatINR(totals.paidRevenue)} icon={Wallet} />
        <StatCard label="Admin Earnings" value={formatINR(totals.adminEarnings)} icon={Landmark} />
        <StatCard label="Partner Earnings" value={formatINR(totals.partnerEarnings)} icon={ReceiptText} />
        <StatCard label="Total Bookings" value={totals.bookings.toLocaleString()} icon={CreditCard} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Payments by status</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {finance.paymentsByStatus.length ? finance.paymentsByStatus.map((item: { _id: string; amount: number; count: number }) => (
              <div key={item._id} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
                <div><Badge variant="secondary">{item._id}</Badge><p className="mt-1 text-xs text-muted-foreground">{item.count} payments</p></div>
                <p className="font-semibold">{formatINR(item.amount)}</p>
              </div>
            )) : <p className="text-sm text-muted-foreground">No payment records yet.</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Commissions by status</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {finance.commissionsByStatus.length ? finance.commissionsByStatus.map((item: { _id: string; amount: number; platformFee: number; count: number }) => (
              <div key={item._id} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
                <div><Badge variant="secondary">{item._id}</Badge><p className="mt-1 text-xs text-muted-foreground">{item.count} commissions · fee {formatINR(item.platformFee)}</p></div>
                <p className="font-semibold">{formatINR(item.amount)}</p>
              </div>
            )) : <p className="text-sm text-muted-foreground">No commission records yet.</p>}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Recent payments</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-left text-muted-foreground"><th className="p-4 font-medium">Payment</th><th className="p-4 font-medium">Booking</th><th className="p-4 font-medium">Amount</th><th className="p-4 font-medium">Status</th></tr></thead>
            <tbody>
              {finance.recentPayments.map((payment: { _id: string; razorpayPaymentId?: string; booking?: { bookingNumber?: string; travelerDetails?: { name?: string } }; amount: number; currency: string; status: string }) => (
                <tr key={payment._id} className="border-b border-border/50">
                  <td className="p-4"><p className="font-medium">{payment.razorpayPaymentId || payment._id}</p></td>
                  <td className="p-4 text-muted-foreground">{payment.booking?.bookingNumber || "-"} · {payment.booking?.travelerDetails?.name || "-"}</td>
                  <td className="p-4 font-medium">{formatINR(payment.amount)}</td>
                  <td className="p-4"><Badge variant="secondary">{payment.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
