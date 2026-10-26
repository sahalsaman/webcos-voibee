"use client";

import { useSyncExternalStore } from "react";

/** Browser-safe helpers for the Capacitor Android and iOS shells. */
export function isNativeMobileApp() {
  if (typeof window === "undefined") return false;

  const capacitor = (window as Window & {
    Capacitor?: { isNativePlatform?: () => boolean };
  }).Capacitor;

  return capacitor?.isNativePlatform?.() === true || /\bCapacitor\b/i.test(navigator.userAgent);
}

const subscribe = () => () => {};

/** Hydration-safe native-app state: website SSR always starts as false. */
export function useNativeMobileApp() {
  return useSyncExternalStore(subscribe, isNativeMobileApp, () => false);
}
