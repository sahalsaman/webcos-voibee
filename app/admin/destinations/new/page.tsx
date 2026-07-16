import { DestinationForm } from "@/components/admin/destination-form";

export default function NewDestinationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">New Destination</h1>
        <p className="text-muted-foreground">Add a place for website and admin trip selection</p>
      </div>
      <DestinationForm />
    </div>
  );
}
