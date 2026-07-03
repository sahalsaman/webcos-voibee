import { UserCircle } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { ProfileForm } from "@/components/partner/profile-form";
import { requireRole } from "@/lib/session";
import { getPartnerByUser } from "@/lib/dashboard";

interface PartnerProfile {
  slug: string;
  businessName: string;
  partnerType: string;
  bio?: string;
  contactEmail?: string;
  contactPhone?: string;
  logo?: string;
  bannerImage?: string;
  profileImage?: string;
}

export default async function PartnerProfilePage() {
  const user = await requireRole(["partner"]);
  const partner = (await getPartnerByUser(user.id)) as PartnerProfile | null;
  if (!partner) return <EmptyState icon={UserCircle} title="Partner profile not found" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your business details & branding</p>
      </div>
      <ProfileForm profile={partner} slug={partner.slug} />
    </div>
  );
}
