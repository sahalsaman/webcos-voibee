"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { destinationImage } from "@/lib/images";
import type { DestinationDTO } from "@/types";

const NAV_LINKS = [
  { href: "/trips", label: "Holidays" },
  { href: "/strangers-camps", label: "Strangers Camps" },
  { href: "/events", label: "Events" },
];

function dashboardPath(role?: string) {
  if (role === "admin" || role === "employee") return "/admin";
  if (role === "partner") return "/partner";
  return "/traveler";
}

const appLogo = "/voibee-logo-with-name.png";

export function Navbar() {
  const { data: session } = useSession();
  const [country, setCountry] = useState<string | undefined>();
  const [open, setOpen] = useState(false);
  const [destinations, setDestinations] = useState<DestinationDTO[]>([]);
  const user = session?.user;
  const withCountry = (href: string) =>
    country ? `${href}${href.includes("?") ? "&" : "?"}c=${encodeURIComponent(country)}` : href;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCountry(new URLSearchParams(window.location.search).get("c")?.toUpperCase() || undefined);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const qs = country ? `?c=${encodeURIComponent(country)}` : "";

    fetch(`/api/destinations${qs}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        if (payload?.success && Array.isArray(payload.data)) {
          setDestinations(payload.data.slice(0, 24));
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") setDestinations([]);
      });

    return () => controller.abort();
  }, [country]);

  return (
    <header className="sticky top-0 z-50">
      <div className="glass border-b border-border/70 bg-card/90">
        <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-extrabold text-2xl text-[#1261e0]">
            <Image src={appLogo} alt="Voibee" width={112} height={40} />
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((l) => (
              l.href === "/trips" ? (
                <div key={`${l.href}-${l.label}`} className="group flex h-18 items-center">
                  <Link
                    href={withCountry(l.href)}
                    className="rounded-md px-3 py-2 text-base text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                  <div className="invisible fixed left-1/2 top-[56px] z-50 w-[min(1120px,calc(100vw-48px))] -translate-x-1/2 pt-4 opacity-0 transition duration-200 group-hover:visible group-hover:opacity-100">
                    <div className="rounded-[28px] border border-border/70 bg-background/95 p-6 shadow-2xl shadow-slate-900/12 backdrop-blur-xl">
                      {destinations.length > 0 ? (
                        <div className="grid max-h-[calc(100vh-120px)] grid-cols-3 gap-x-12 gap-y-6 overflow-y-auto pr-2">
                          {destinations.map((destination) => (
                            <Link
                              key={destination._id}
                              href={withCountry(`/trips?destination=${encodeURIComponent(destination.title)}`)}
                              className="group/item grid grid-cols-[64px_minmax(0,1fr)] items-center  rounded-2xl p-2 transition hover:bg-secondary/80"
                            >
                              <Image
                                src={destination.images[0] || destinationImage(destination.title)}
                                alt={destination.title}
                                width={54}
                                height={54}
                                className="size-12 rounded-2xl object-cover shadow-sm"
                              />
                              <span className="min-w-0">
                                <span className="block truncate text-base font-bold leading-tight text-foreground group-hover/item:text-primary">
                                  {destination.title}
                                </span>
                                <span className="mt-1 block truncate text-sm leading-tight text-muted-foreground">
                                  {destination.description || destination.country}
                                </span>
                              </span>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-2xl bg-secondary/70 px-5 py-8 text-center text-sm text-muted-foreground">
                          Destinations added from admin will appear here.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={`${l.href}-${l.label}`}
                  href={withCountry(l.href)}
                  className="rounded-md px-3 py-2 text-base text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l.label}
                </Link>
              )
            ))}
          </div>

          <div className="flex items-center gap-2">
            {user && ( <ThemeToggle />)}
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
                <Button asChild variant="gradient" size="default">
                  <Link href="/register">Join Our Community</Link>
                </Button>
                <Button asChild variant="ghost" size="default">
                  <Link href="/login">Log in</Link>
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
              <Button asChild variant="gradient" className="mt-1">
                <Link href="/register" onClick={() => setOpen(false)}>
                  Join Our Community
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
