"use client";

import Link from "next/link";
import { TRIP_CATEGORIES } from "@/lib/constants";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { DestinationDTO } from "@/types";

const app_logo = "/voibee-logo.png"

export function Footer() {
  const params = useSearchParams();
  const country = params.get("c")?.toUpperCase();
  const [destinations, setDestinations] = useState<DestinationDTO[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const qs = country ? `?c=${encodeURIComponent(country)}` : "";

    fetch(`/api/destinations${qs}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        if (payload?.success && Array.isArray(payload.data)) {
          setDestinations(payload.data.slice(0, 8));
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") setDestinations([]);
      });

    return () => controller.abort();
  }, [country]);
  const withCountry = (href: string) =>
    country ? `${href}${href.includes("?") ? "&" : "?"}c=${encodeURIComponent(country)}` : href;

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Image src={app_logo} alt="Logo" width={32} height={32} />
            Voibee
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Curated trips for explorers who want clear plans, verified stays and
            smooth support.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Trip themes</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link className="hover:text-foreground" href={withCountry("/trips")}>All trips</Link></li>
            {TRIP_CATEGORIES.slice(0, 4).map((theme) => (
              <li key={theme}>
                <Link className="hover:text-foreground" href={withCountry(`/trips?category=${encodeURIComponent(theme)}`)}>
                  {theme}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Destinations</h4>
          <ul className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            {destinations.map((d) => (
              <li key={d._id}>
                <Link className="hover:text-foreground" href={withCountry(`/trips?destination=${encodeURIComponent(d.title)}`)}>
                  {d.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link className="hover:text-foreground" href="/#why">Why Voibee</Link></li>
            <li><Link className="hover:text-foreground" href="/visa">Visa Assistance</Link></li>
            <li><Link className="hover:text-foreground" href="/login">Traveler Login</Link></li>
            <li><Link className="hover:text-foreground" href="/register">Create Account</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Voibee. All rights reserved.</p>
          <p>Made for explorers · Powered by Voibee</p>
        </div>
      </div>
    </footer>
  );
}
