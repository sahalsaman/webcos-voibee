import Image from "next/image";
import { cn } from "@/lib/utils";
import { PACKAGE_SERVICES, PACKAGE_SERVICE_LABELS, type PackageService } from "@/lib/constants";

const SERVICE_DETAILS: Record<PackageService, { label: string; image: string; pattern: RegExp }> = {
  flights: { label: PACKAGE_SERVICE_LABELS.flights, image: "/package-flights.png", pattern: /\b(flights?|airfare|air tickets?)\b/i },
  hotels: { label: PACKAGE_SERVICE_LABELS.hotels, image: "/package-hotel-resort.png", pattern: /\b(hotels?|hotel|resort|accommodation|stays?)\b/i },
  sightseeing: { label: PACKAGE_SERVICE_LABELS.sightseeing, image: "/package-sightseeing.png", pattern: /\b(sightseeing|excursions?|attractions?)\b/i },
  visa: { label: PACKAGE_SERVICE_LABELS.visa, image: "/package-visa.png", pattern: /\bvisa\b/i },
  meals: { label: PACKAGE_SERVICE_LABELS.meals, image: "/package-meals.png", pattern: /\b(meals?|breakfast|lunch|dinner)\b/i },
  "tour-manager": { label: PACKAGE_SERVICE_LABELS["tour-manager"], image: "/package-tour-manager.png", pattern: /\b(tour manager|trip captain|tour guide|guide|coordinator)\b/i },
  // transfers: { label: PACKAGE_SERVICE_LABELS.transfers, image: "/package-transfers.png", pattern: /\b(transfers?|airport shuttle|pickup|drop)\b/i },
  "travel-insurance": { label: PACKAGE_SERVICE_LABELS["travel-insurance"], image: "/package-travel-insurance.png", pattern: /\b(travel insurance|insurance)\b/i },
  "ac-premium-transportation": { label: PACKAGE_SERVICE_LABELS["ac-premium-transportation"], image: "/package-ac-premium-transportation.png", pattern: /\b(ac premium transportation)\b/i },
  transportation: { label: PACKAGE_SERVICE_LABELS.transportation, image: "/package-transportation.png", pattern: /\btransportation\b/i },
  "cam-fire": { label: PACKAGE_SERVICE_LABELS["cam-fire"], image: "/package-campfire.png", pattern: /\b(campfire|camp fire|bonfire)\b/i },
  "swimming-pool": { label: PACKAGE_SERVICE_LABELS["swimming-pool"], image: "/package-swimming-pool.png", pattern: /\b(swimming pool|pool)\b/i },
  activities: { label: PACKAGE_SERVICE_LABELS.activities, image: "/package-activities.png", pattern: /\b(activities|games|ice-breaking|social games|team challenges)\b/i },
  photography: { label: PACKAGE_SERVICE_LABELS.photography, image: "/package-photography.png", pattern: /\b(photography|photograph|photo|reel|videography)\b/i },
  "first-aid": { label: PACKAGE_SERVICE_LABELS["first-aid"], image: "/package-first-aid.png", pattern: /\b(first[- ]aid)\b/i },
  "drinking-water": { label: PACKAGE_SERVICE_LABELS["drinking-water"], image: "/package-drinking-water.png", pattern: /\bdrinking water\b/i },
  "luggage-assistance": { label: PACKAGE_SERVICE_LABELS["luggage-assistance"], image: "/package-luggage-assistance.png", pattern: /\b(luggage|baggage)\b/i },
  "welcome-drink": { label: PACKAGE_SERVICE_LABELS["welcome-drink"], image: "/package-welcome-drink.png", pattern: /\b(welcome drink|mocktail)\b/i },
};

export function resolveIncludedServices(includedServices: PackageService[] | undefined, inclusions: string[] = []) {
  // A saved checkbox selection is authoritative, including an intentionally empty
  // selection. Only packages created before this field existed use text inference.
  if (includedServices !== undefined) {
    const selected = new Set<PackageService>(includedServices);
    return PACKAGE_SERVICES.filter((service) => selected.has(service));
  }

  const selected = new Set<PackageService>();
  const inclusionText = inclusions.join(" ");
  for (const service of PACKAGE_SERVICES) {
    if (SERVICE_DETAILS[service].pattern.test(inclusionText)) selected.add(service);
  }
  return PACKAGE_SERVICES.filter((service) => selected.has(service));
}

export function PackageServiceIcons({
  includedServices,
  inclusions,
  compact = false,
  showcase = false,
  className,
}: {
  includedServices?: PackageService[];
  inclusions?: string[];
  compact?: boolean;
  showcase?: boolean;
  className?: string;
}) {
  const services = resolveIncludedServices(includedServices, inclusions);
  if (!services.length) return null;
  const visible = compact ? services.slice(0, 6) : services;

  return (
    <div className={cn(compact ? "flex flex-wrap gap-2" : showcase ? "grid grid-cols-6 gap-x-2 gap-y-4 md:grid-cols-8 md:gap-x-4" : "grid grid-cols-2 gap-3 sm:grid-cols-10", className)}>
      {visible.map((service) => {
        const { label, image } = SERVICE_DETAILS[service];
        return compact ? (
          <span key={service} title={label} aria-label={label} className="flex size-8 items-center justify-center">
            <Image src={image} alt="" width={36} height={36} className="size-8 object-contain drop-shadow-sm" />
          </span>
        ) : showcase ? (
          <div key={service} className="flex min-w-0 flex-col items-center gap-1.5 text-center">
            <Image src={image} alt="" width={56} height={56} className="size-11 object-contain drop-shadow-sm sm:size-14" />
            <span className="line-clamp-2 text-[9px] font-bold leading-3 text-slate-700 sm:text-[11px]">{label}</span>
          </div>
        ) : (
          <div key={service} className="flex items-center gap-3 rounded-xl border border-border/70 bg-card p-3 shadow-sm">
            <Image src={image} alt="" width={48} height={48} className="size-8 shrink-0 object-contain drop-shadow-sm" />
            <span className="text-sm font-semibold">{label}</span>
          </div>
        );
      })}
      {compact && services.length > visible.length ? <span className="flex h-8 items-center rounded-lg bg-secondary px-2 text-xs font-semibold">+{services.length - visible.length}</span> : null}
    </div>
  );
}
