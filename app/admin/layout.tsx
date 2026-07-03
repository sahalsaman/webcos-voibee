import { requireRole } from "@/lib/session";
import { RoleShell } from "@/components/dashboard/role-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole(["admin"]);
  return (
    <RoleShell role="admin" user={{ name: user.name, email: user.email, image: user.image }}>
      {children}
    </RoleShell>
  );
}
