import { notFound } from "next/navigation";
import { TripForm } from "@/components/admin/trip-form";
import { getAdminTripById, listAdminDestinations } from "@/lib/dashboard";
import type { DestinationDTO, TripDTO } from "@/types";

export default async function EditTripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trip = (await getAdminTripById(id)) as TripDTO | null;
  const destinations = (await listAdminDestinations()) as DestinationDTO[];
  if (!trip) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Trip</h1>
        <p className="text-muted-foreground">{trip.title}</p>
      </div>
      <TripForm trip={trip} destinations={destinations} />
    </div>
  );
}
