"use client";

import {
  LayoutDashboard,
  Plane,
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
} from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/dashboard/shell";

const NAVS: Record<string, { label: string; items: NavItem[] }> = {
  admin: {
    label: "Admin",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/trips", label: "Trips", icon: Plane },
      { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
      { href: "/admin/partners", label: "Partners", icon: Users },
      { href: "/admin/reports", label: "Reports", icon: FileBarChart },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
  partner: {
    label: "Partner",
    items: [
      { href: "/partner", label: "Dashboard", icon: LayoutDashboard },
      { href: "/partner/browse", label: "Browse Trips", icon: Compass },
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
}: {
  role: "admin" | "partner" | "traveler";
  user: { name?: string | null; email?: string | null; image?: string | null };
  children: React.ReactNode;
}) {
  const cfg = NAVS[role];
  return (
    <DashboardShell nav={cfg.items} roleLabel={cfg.label} user={user}>
      {children}
    </DashboardShell>
  );
}
