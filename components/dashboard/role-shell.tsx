"use client";

import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Settings,
  FileBarChart,
  Wallet,
  Link2,
  Compass,
  Heart,
  UserCircle,
  ShoppingBag,
  Megaphone,
  ContactRound,
  Boxes,
  Star,
  BriefcaseBusiness,
} from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/dashboard/shell";
import type { AdminPortalPageKey } from "@/lib/constants";

const NAVS: Record<string, { label: string; items: NavItem[] }> = {
  partner: {
    label: "Partner",
    items: [
      { href: "/partner", label: "Dashboard", icon: LayoutDashboard },
      { href: "/partner/browse", label: "Browse Packages", icon: Compass },
      { href: "/partner/links", label: "My Links", icon: Link2 },
      { href: "/partner/bookings", label: "Bookings", icon: CalendarCheck },
      { href: "/partner/earnings", label: "Earnings", icon: Wallet },
      { href: "/partner/profile", label: "Profile", icon: UserCircle },
    ],
  },
  traveler: {
    label: "Traveler",
    items: [
      { href: "/traveler", label: "Dashboard", icon: LayoutDashboard },
      { href: "/traveler/bookings", label: "My Bookings", icon: ShoppingBag },
      { href: "/traveler/wishlist", label: "Wishlist", icon: Heart },
    ],
  },
};

export function RoleShell({
  role,
  user,
  children,
  accessPages,
  roleLabel,
}: {
  role:  "partner" | "traveler";
  user: { name?: string | null; email?: string | null; image?: string | null };
  children: React.ReactNode;
  accessPages?: AdminPortalPageKey[];
  roleLabel?: string;
}) {
  const cfg =  NAVS[role];
  const allowed = accessPages ? new Set(accessPages) : null;
  const items = allowed
    ? cfg.items.filter((item) => !item.accessKey || allowed.has(item.accessKey as AdminPortalPageKey))
    : cfg.items;

  return (
    <DashboardShell nav={items} roleLabel={roleLabel || cfg.label} user={user}>
      {children}
    </DashboardShell>
  );
}
