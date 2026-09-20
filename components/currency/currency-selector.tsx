"use client";

import { Coins } from "lucide-react";
import { useCurrency } from "@/components/currency/currency-provider";
import { SUPPORTED_CURRENCIES, type CurrencyCode } from "@/lib/currency";
import { cn } from "@/lib/utils";

export function CurrencySelector({ className }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();

  return (
    <label className={cn("flex items-center gap-2", className)}>
      <Coins className="size-4 shrink-0 text-white" aria-hidden="true" />
      <span className="sr-only">Display currency</span>
      <select
        value={currency}
        onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
        aria-label="Display currency"
        className="h-8 cursor-pointer rounded-sm border border-border bg-background px-2 text-sm font-semibold text-foreground outline-none transition-colors hover:border-primary/50 focus:border-none focus:ring-2 focus:ring-primary/15"
      >
        {SUPPORTED_CURRENCIES.map((item) => (
          <option key={item.code} value={item.code}>
            {item.symbol}
          </option>
        ))}
      </select>
    </label>
  );
}
