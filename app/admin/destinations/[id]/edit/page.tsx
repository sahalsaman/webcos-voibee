import { notFound } from "next/navigation";
import { DestinationForm } from "@/components/admin/destination-form";
import { getAdminDestinationById } from "@/lib/dashboard";
import type { DestinationDTO } from "@/types";

export default async function EditDestinationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const destination = (await getAdminDestinationById(id)) as DestinationDTO | null;
  if (!destination) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Destination</h1>
        <p className="text-muted-foreground">{destination.title}</p>
      </div>
      <DestinationForm destination={destination} />
    </div>
  );
}
