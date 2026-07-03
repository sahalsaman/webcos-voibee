import { requireRole } from "@/lib/session";
import { RoleShell } from "@/components/dashboard/role-shell";

export default async function TravelerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole(["traveler"]);
  return (
    <RoleShell role="traveler" user={{ name: user.name, email: user.email, image: user.image }}>
      {children}
    </RoleShell>
  );
}
