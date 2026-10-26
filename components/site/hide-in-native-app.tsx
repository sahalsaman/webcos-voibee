"use client";

import { useNativeMobileApp } from "@/lib/native-app";

/** Keeps web-only marketing sections out of the installed mobile app. */
export function HideInNativeApp({ children }: { children: React.ReactNode }) {
  const nativeApp = useNativeMobileApp();

  return nativeApp ? null : <>{children}</>;
}
