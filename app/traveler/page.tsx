import { requireRole } from "@/lib/session";
import { TravelerProfile } from "@/components/traveler/traveler-profile";

export default async function TravelerProfilePage() {
  const user = await requireRole(["traveler"]);
  return <TravelerProfile user={{ name: user.name, email: user.email, image: user.image }} />;
}
