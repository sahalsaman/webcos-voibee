import { TRIP_CATEGORIES, tripThemeLabel } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function getTripThemeVisual(category?: string) {
  const normalized = category === "Solo" ? "Strangers" : category;
  const option = TRIP_CATEGORIES.find((item) => item.label === normalized);
  return {
    icon: option?.icon ?? "🧳",
    label: tripThemeLabel(category),
  };
}

export function TripThemeVisual({
  category,
  size = "md",
  showLabel = false,
  className,
}: {
  category?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}) {
  const theme = getTripThemeVisual(category);
  const sizes = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-5xl sm:text-6xl",
  };

  return (
    <span className={cn("inline-flex items-center gap-2", className)} title={theme.label} aria-label={theme.label}>
      <span className={cn("flex shrink-0 items-center justify-center leading-none drop-shadow-sm", sizes[size])} aria-hidden="true">
        {theme.icon}
      </span>
      {showLabel ? <span className="max-w-36 text-xs font-extrabold leading-tight text-slate-800">{theme.label}</span> : null}
    </span>
  );
}
