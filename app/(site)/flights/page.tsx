import type { Metadata } from "next";
import { Plane } from "lucide-react";
import { ComingSoonPage } from "@/components/site/coming-soon-page";

export const metadata: Metadata = {
  title: "Flights - Coming Soon",
  description: "Flight search and booking is coming soon to Voibee Holidays.",
};

export default function FlightsPage() {
  return (
    <ComingSoonPage
      icon={Plane}
      eyebrow="Voibee Flights"
      title="A smoother way to book your flights is on the way."
      description="We are preparing convenient flight search and booking so you can organize your complete journey with Voibee in one place."
    />
  );
}
