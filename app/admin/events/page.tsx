import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EventRowActions } from "@/components/admin/event-row-actions";
import { listAdminEvents } from "@/lib/dashboard";
import { destinationImage } from "@/lib/images";
import { formatDate } from "@/lib/utils";
import type { EventDTO } from "@/types";

export default async function AdminEventsPage() {
  const events = (await listAdminEvents()) as EventDTO[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Major Events</h1>
          <p className="text-muted-foreground">Manage public events shown on the website</p>
        </div>
        <Button asChild variant="gradient">
          <Link href="/admin/events/new"><Plus className="size-4" /> New Event</Link>
        </Button>
      </div>

      {events.length ? (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="p-4 font-medium">Event</th>
                  <th className="p-4 font-medium">Location</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event._id} className="border-b border-border/50 hover:bg-secondary/40">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={event.images?.[0] || destinationImage(event.city || event.title)}
                          alt=""
                          width={72}
                          height={48}
                          className="h-12 w-20 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="line-clamp-1 text-xs text-muted-foreground">{event.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" /> {event.city}, {event.countryCode}</span>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><CalendarDays className="size-3.5" /> {formatDate(event.startDate)}</span>
                    </td>
                    <td className="p-4"><StatusBadge status={event.status} /></td>
                    <td className="p-4"><EventRowActions id={event._id} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : (
        <EmptyState
          icon={CalendarDays}
          title="No events yet"
          description="Create major events and they will appear on the public Events page."
          action={
            <Button asChild variant="gradient">
              <Link href="/admin/events/new"><Plus className="size-4" /> New Event</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
