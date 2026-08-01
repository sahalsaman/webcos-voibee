import { notFound } from "next/navigation";
import { EventForm } from "@/components/admin/event-form";
import { getAdminEventById } from "@/lib/dashboard";
import type { EventDTO } from "@/types";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = (await getAdminEventById(id)) as EventDTO | null;
  if (!event) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Event</h1>
        <p className="text-muted-foreground">{event.title}</p>
      </div>
      <EventForm event={event} />
    </div>
  );
}
