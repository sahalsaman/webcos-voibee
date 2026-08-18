import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-brand-gradient text-white">
        <Compass className="size-8" />
      </span>
      <h1 className="mt-6 text-5xl font-extrabold">404</h1>
      <p className="mt-2 text-lg font-semibold">This trail leads nowhere</p>
      <p className="mt-1 max-w-sm text-muted-foreground">
        The page you&apos;re looking for has wandered off the map.
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild variant="gradient">
          <Link href="/">
            <ArrowLeft className="size-4" /> Back home
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/trips">Explore trips</Link>
        </Button>
      </div>
    </div>
  );
}
