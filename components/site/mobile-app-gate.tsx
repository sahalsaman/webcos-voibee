"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useNativeMobileApp } from "@/lib/native-app";

const PUBLIC_AUTH_ROUTES = new Set(["/login", "/register"]);
// Matches the initial splash animation before the app presents the sign-in screen.
const SPLASH_DURATION_MS = 2_050;

/** Enforces sign-in in the installed Android/iOS app without changing website access. */
export function MobileAppGate({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const nativeApp = useNativeMobileApp();

  useEffect(() => {
    if (!nativeApp || status === "loading" || PUBLIC_AUTH_ROUTES.has(pathname)) return;

    const timer = window.setTimeout(() => {
      if (status === "unauthenticated") {
        router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      }
    }, SPLASH_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [nativeApp, pathname, router, status]);

  return <>{children}</>;
}
