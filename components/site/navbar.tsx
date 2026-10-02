"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  UserCircle,
  Headset,
  House,
  Luggage,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { NotificationMenu } from "@/components/site/notification-menu";
import { CurrencySelector } from "@/components/currency/currency-selector";
import { appConfig } from "@/app/app,config";

const NAV_LINKS = [
  { href: "/packages", label: "Holidays" },
  { href: "/flights", label: "Flights" },
  { href: "/hotels", label: "Hotels" },
  { href: "/vibe-circles", label: "Voibee Circles" },
  // { href: "/customize-trip", label: "Customize trip" },
  { href: "/activities", label: "Activities" },
];

function dashboardPath(role?: string) {
  if (role === "admin" || role === "vendor" || role === "employee" || role === "vendor_employee") return "/admin";
  if (role === "partner" || role === "vendor_partner") return "/partner";
  return "/traveler";
}

const appLogo = "/voibee-global-travel-experts.png";
const supportNumber = appConfig.mobile.replace(/\D/g, "");

function MobileBottomNavigation({
  country,
  profileHref,
}: {
  country?: string;
  profileHref: string;
}) {
  const pathname = usePathname();
  const withCountry = (href: string) =>
    country ? `${href}${href.includes("?") ? "&" : "?"}c=${encodeURIComponent(country)}` : href;
  const links = [
    { href: "/", label: "Home", icon: House },
    { href: "/packages", label: "Holiday", icon: Luggage },
    { href: "/vibe-circles", label: "Voibee Circle", icon: UsersRound },
    { href: profileHref, label: "Profile", icon: UserCircle },
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-border/80 bg-white/95 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 shadow-[0_-8px_24px_rgba(15,23,42,0.1)] backdrop-blur md:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-4">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <Link
              key={label}
              href={label === "Profile" ? href : withCountry(href)}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 text-center text-[10px] font-semibold transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <span className={cn("flex size-7 items-center justify-center rounded-lg", isActive && "bg-primary/10")}>
                <Icon className="size-5" strokeWidth={isActive ? 2.5 : 2} />
              </span>
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function Navbar() {
  const { data: session } = useSession();
  const [country, setCountry] = useState<string | undefined>();
  const [open, setOpen] = useState(false);
  const user = session?.user;
  const withCountry = (href: string) =>
    country ? `${href}${href.includes("?") ? "&" : "?"}c=${encodeURIComponent(country)}` : href;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCountry(new URLSearchParams(window.location.search).get("c")?.toUpperCase() || undefined);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
    <header className="sticky top-0 z-50 shadow-[0_1px_12px_rgba(15,23,42,0.05)]">
      <div className="bg-white text-black/80">
        <div className=" mx-auto flex h-10 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <a
            href={`tel:+${supportNumber}`}
            className="group inline-flex min-w-0 items-center gap-2 text-xs font-semibold text-slate-600 transition-colors "
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-black">
              <Headset className="size-3.5" />
            </span>
            <span className="hidden  sm:inline text-black">Need help?</span>
            <span className="truncate text-primary underline">Contact us</span>
          </a>
          <div className="flex items-center gap-2">
            <CurrencySelector className="gap-1.5 [&>select]:h-8 [&>select]:rounded-full  [&>select]:bg-white/80 [&>select]:px-3 [&>select]:text-xs " />
          </div>
        </div>
      </div>
      <div className="glass border-b border-border/70 bg-card/95">
        <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-extrabold text-2xl text-primary">
            <Image src={appLogo} alt="Voibee Global Travel Experts" width={174} height={84} loading="eager" className="h-12 w-auto" />
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((l) => (
              <Link
                key={`${l.href}-${l.label}`}
                href={withCountry(l.href)}
                className="rounded-md px-3 py-2 text-base text-muted-foreground transition-colors hover:text-foreground hover:font-semibold"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {user ? <NotificationMenu /> : null}
            {/* <Button asChild variant="ghost" size="default">
                <Link href="/saved">
                  <HeartIcon className="size-4 text-pink-500" /> Saved
                </Link>
              </Button> */}
            {user ? (
              <div className="hidden items-center gap-2 md:flex">
                <Button asChild variant="ghost" size="default">
                  <Link href={dashboardPath(user.role)}>
                    <LayoutDashboard className="size-4" /> Dashboard
                  </Link>
                </Button>
                <Avatar src={user.image} name={user.name ?? "User"} size={36} />
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Sign out"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="size-4" />
                </Button>
              </div>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                {/* <Button asChild variant="default" size="default">
                  <Link href="/register">Join Our Community</Link>
                </Button> */}
            
                <Button asChild variant="default" size="default" className="rounded-full px-6">
                  <Link href="/login">Log in <LogOut className="size-4" /></Link>
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "glass overflow-hidden border-b border-border/70 bg-card/95 md:hidden",
          open ? "max-h-96" : "max-h-0 border-b-0",
          "transition-all duration-300",
        )}
      >
        <div className="flex flex-col gap-1 px-4 py-3">
          {NAV_LINKS.map((l) => (
            <Link
              key={`${l.href}-${l.label}`}
              href={withCountry(l.href)}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary"
            >
              {l.label}
            </Link>
          ))}
          <div className="my-2 h-px bg-border" />
          {user ? (
            <>
              <Link
                href={dashboardPath(user.role)}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary"
              >
                <LayoutDashboard className="size-4" /> Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium hover:bg-secondary"
              >
                <LogOut className="size-4" /> Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary"
              >
                <UserCircle className="size-4" /> Log in
              </Link>
              <Button asChild variant="default" className="mt-1">
                <Link href="/register" onClick={() => setOpen(false)}>
                  Join Our Community
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
    <MobileBottomNavigation country={country} profileHref={user ? dashboardPath(user.role) : "/login"} />
    </>
  );
}
