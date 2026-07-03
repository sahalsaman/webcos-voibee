import { requireRole } from "@/lib/session";
import { RoleShell } from "@/components/dashboard/role-shell";

export default async function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole(["partner"]);
  return (
    <RoleShell role="partner" user={{ name: user.name, email: user.email, image: user.image }}>
      {children}
    </RoleShell>
  );
}
