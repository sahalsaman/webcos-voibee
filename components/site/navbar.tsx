"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Compass,
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

const NAV_LINKS = [
  { href: "/trips", label: "Explore Trips" },
  { href: "/#why", label: "Why Voibee" },
  { href: "/#partner", label: "Partner Program" },
];

function dashboardPath(role?: string) {
  if (role === "admin") return "/admin";
  if (role === "partner") return "/partner";
  return "/traveler";
}

const app_logo = "/voibee-logo.png"

export function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const user = session?.user;

  return (
    <header className="sticky top-0 z-50">
      <div className="glass border-b border-border/60">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Image src={app_logo} alt="Logo" width={32} height={32} />
            <span>
              Voibee
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <div className="hidden items-center gap-2 md:flex">
                <Button asChild variant="ghost" size="sm">
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
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild variant="gradient" size="sm">
                  <Link href="/register">Get started</Link>
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
          "glass overflow-hidden border-b border-border/60 md:hidden",
          open ? "max-h-96" : "max-h-0 border-b-0",
          "transition-all duration-300",
        )}
      >
        <div className="flex flex-col gap-1 px-4 py-3">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
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
                  Get started
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
