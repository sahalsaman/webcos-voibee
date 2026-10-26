export const dynamic = "force-dynamic";
import { requireRole } from "@/lib/session";
import { Navbar } from "@/components/site/navbar";
import { TravelerShell } from "@/components/traveler/traveler-shell";

export default async function TravelerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole(["traveler"]);
  return (
    <>
      <div className="hidden md:block">
        <Navbar showMobileNavigation={false} />
      </div>
      <TravelerShell user={{ name: user.name, email: user.email, image: user.image }}>
        {children}
      </TravelerShell>
    </>
  );
}
