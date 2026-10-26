"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { CurrencyProvider } from "@/components/currency/currency-provider";
import { MobileAppGate } from "@/components/site/mobile-app-gate";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        <CurrencyProvider>
          <MobileAppGate>{children}</MobileAppGate>
          <Toaster richColors position="top-center" closeButton />
        </CurrencyProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
