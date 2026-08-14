import { Clock } from "lucide-react";
import { cn, formatINR } from "@/lib/utils";
import type { PackageOption } from "@/types";

export function PackageOptionsList({
  options,
  priceOffset = 0,
  compact = false,
  className,
}: {
  options?: PackageOption[];
  priceOffset?: number;
  compact?: boolean;
  className?: string;
}) {
  const list = (options ?? []).filter((option) => option.label && Number.isFinite(option.price));
  if (!list.length) return null;

  return (
    <div className={cn("space-y-2", className)}>
      {list.map((option, index) => (
        <div
          key={`${option.label}-${option.price}-${index}`}
          className={cn(
            "flex items-center justify-between gap-3 rounded-md border border-border bg-secondary/35 px-3 py-2 text-sm",
            compact && "px-2.5 py-1.5 text-xs",
          )}
        >
          <span className="flex min-w-0 items-center gap-1.5 font-medium">
            <Clock className={cn("shrink-0 text-primary", compact ? "size-3.5" : "size-4")} />
            <span className="truncate">{option.label}</span>
          </span>
          <span className="shrink-0 font-bold">{formatINR(option.price + priceOffset)}</span>
        </div>
      ))}
    </div>
  );
}
