import { Badge } from "@/components/ui/badge";

type Variant = "default" | "accent" | "secondary" | "success" | "warning" | "destructive" | "outline";

const MAP: Record<string, Variant> = {
  active: "success",
  inactive: "secondary",
  // bookings
  pending: "warning",
  confirmed: "success",
  completed: "default",
  cancelled: "destructive",
  // payments
  created: "secondary",
  paid: "success",
  failed: "destructive",
  refunded: "outline",
  // partners
  approved: "success",
  suspended: "destructive",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={MAP[status] ?? "secondary"} className="capitalize">
      {status}
    </Badge>
  );
}
