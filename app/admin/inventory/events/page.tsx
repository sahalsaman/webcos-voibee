import { CalendarDays } from "lucide-react";
import { EventDrawer } from "@/components/admin/event-drawer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { listAdminEvents } from "@/lib/dashboard";
import { formatDate } from "@/lib/utils";
import type { EventDTO } from "@/types";

export default async function EventsInventoryPage() {
  const events = await listAdminEvents() as EventDTO[];
  return <div className="space-y-5"><Card><CardHeader className="flex-row items-center justify-between"><div><CardTitle className="flex items-center gap-2"><CalendarDays className="size-5" />Events</CardTitle><p className="mt-1 text-sm text-muted-foreground">Major and time-sensitive travel events.</p></div><EventDrawer /></CardHeader><CardContent className="space-y-2">{events.length ? events.map((item) => <div key={item._id} className="flex items-center justify-between gap-3 rounded-lg border p-3"><div><p className="font-medium">{item.title}</p><p className="text-xs text-muted-foreground">{item.city} · {formatDate(item.startDate)}</p></div><div className="flex items-center gap-2"><StatusBadge status={item.status} /><EventDrawer event={item} /></div></div>) : <p className="text-sm text-muted-foreground">No events configured.</p>}</CardContent></Card></div>;
}
