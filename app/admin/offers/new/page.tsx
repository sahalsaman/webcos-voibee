import { OfferCardForm } from "@/components/admin/offer-card-form";

export default function NewOfferPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">New Offer Card</h1>
        <p className="text-muted-foreground">Create a homepage carousel banner</p>
      </div>
      <OfferCardForm />
    </div>
  );
}
