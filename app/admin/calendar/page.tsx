import { AdminTripCalendar } from "@/components/admin/trip-calendar";
import { listAdminTrips } from "@/lib/dashboard";

export default async function AdminCalendarPage() {
  const trips = await listAdminTrips();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p className="text-muted-foreground">Date wise packages with booked and total seats</p>
      </div>
      <AdminTripCalendar trips={trips as Parameters<typeof AdminTripCalendar>[0]["trips"]} />
    </div>
  );
}
