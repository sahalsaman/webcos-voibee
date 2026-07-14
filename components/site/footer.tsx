import Link from "next/link";
import { POPULAR_DESTINATIONS } from "@/lib/constants";
import Image from "next/image";

const app_logo = "/voibee-logo.png"

export function Footer() {
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
          <h4 className="mb-3 text-sm font-semibold">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link className="hover:text-foreground" href="/trips">All Trips</Link></li>
            <li><Link className="hover:text-foreground" href="/trips?category=Weekend">Weekend Getaways</Link></li>
            <li><Link className="hover:text-foreground" href="/trips?category=Group">Group Trips</Link></li>
            <li><Link className="hover:text-foreground" href="/trips?category=International">International</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Destinations</h4>
          <ul className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            {POPULAR_DESTINATIONS.slice(0, 8).map((d) => (
              <li key={d}>
                <Link className="hover:text-foreground" href={`/trips?destination=${d}`}>
                  {d}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link className="hover:text-foreground" href="/#why">Why Voibee</Link></li>
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
