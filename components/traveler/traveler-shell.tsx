"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Heart, Luggage, UserCircle, ArrowLeft } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/traveler/bookings", label: "My Bookings", icon: Luggage },
  { href: "/traveler/wishlist", label: "Wishlist", icon: Heart },
  { href: "/traveler", label: "Profile", icon: UserCircle },
];

export function TravelerShell({
  user,
  children,
}: {
  user: { name?: string | null; email?: string | null; image?: string | null };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const returnHome = () => {
    window.sessionStorage.setItem("voibee-skip-next-splash", "true");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-secondary/30 pb-24 md:pb-0">
      <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur md:hidden">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-4">
          <Button variant="ghost" size="icon" onClick={returnHome} aria-label="Back to home">
            <ArrowLeft className="size-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">Traveler profile</p>
            <p className="truncate text-xs text-muted-foreground">{user.name || user.email || "Your Voibee account"}</p>
          </div>
          <Avatar src={user.image} name={user.name ?? "Traveler"} size={34} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl p-4 sm:p-6 lg:p-8">{children}</main>

      <nav
        aria-label="Traveler navigation"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-white/95 px-3 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 shadow-[0_-8px_24px_rgba(15,23,42,0.1)] backdrop-blur md:hidden"
      >
        <div className="mx-auto grid max-w-md grid-cols-3 gap-1">
          {tabs.map(({ href, label, icon: Icon }) => {
            const active = href === "/traveler" ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center rounded-xl px-2 text-xs font-semibold transition-colors",
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <Icon className="size-5" strokeWidth={active ? 2.5 : 2} />
                <span className="mt-0.5">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
