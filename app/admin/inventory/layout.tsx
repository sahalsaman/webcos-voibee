import { AdminSectionNav } from "@/components/admin/admin-section-nav";

export default function InventoryLayout({ children }: { children: React.ReactNode }) {
  return <div className="space-y-5"><AdminSectionNav items={[{ href: "/admin/inventory/itinerary", label: "Itinerary" }, { href: "/admin/inventory/destinations", label: "Destinations" }, { href: "/admin/inventory/events", label: "Events" }, { href: "/admin/inventory/hotels", label: "Hotels" }, { href: "/admin/inventory/vehicles", label: "Vehicles" }]} />{children}</div>;
}
