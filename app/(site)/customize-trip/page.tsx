import type { Metadata } from "next";
import { WandSparkles } from "lucide-react";
import { ComingSoonPage } from "@/components/site/coming-soon-page";

export const metadata: Metadata = {
  title: "Customize Trip - Coming Soon",
  description: "Personalized trip planning is coming soon to Voibee Holidays.",
};

export default function CustomizeTripPage() {
  return (
    <ComingSoonPage
      icon={WandSparkles}
      eyebrow="Customized Trips"
      title="Your tailor-made holiday experience is almost here."
      description="Soon you will be able to share your dates, interests, budget, and travel style while our experts create a personalized journey for you."
    />
  );
}
