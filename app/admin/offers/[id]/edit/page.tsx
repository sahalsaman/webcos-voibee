import { notFound } from "next/navigation";
import { OfferCardForm } from "@/components/admin/offer-card-form";
import { getAdminOfferCardById } from "@/lib/dashboard";
import type { OfferCardDTO } from "@/types";

export default async function EditOfferPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const offer = (await getAdminOfferCardById(id)) as OfferCardDTO | null;
  if (!offer) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Offer Card</h1>
        <p className="text-muted-foreground">{offer.title}</p>
      </div>
      <OfferCardForm offer={offer} />
    </div>
  );
}
