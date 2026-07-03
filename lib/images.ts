/** Curated Unsplash imagery for popular destinations (stable photo URLs). */
const MAP: Record<string, string> = {
  Goa: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=70",
  Manali:
    "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=70",
  Kerala:
    "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=70",
  Ladakh:
    "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=900&q=70",
  Andaman:
    "https://images.unsplash.com/photo-1559494007-9f5847c49d94?auto=format&fit=crop&w=900&q=70",
  Rishikesh:
    "https://images.unsplash.com/photo-1591018653367-7c7c9f9a3a35?auto=format&fit=crop&w=900&q=70",
  Kashmir:
    "https://images.unsplash.com/photo-1566837497312-7be4ebbd7e62?auto=format&fit=crop&w=900&q=70",
  Meghalaya:
    "https://images.unsplash.com/photo-1626516666770-3d3e0a3b0f7c?auto=format&fit=crop&w=900&q=70",
  Spiti:
    "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=900&q=70",
  Coorg:
    "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=900&q=70",
};

const FALLBACK =
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=900&q=70";

export function destinationImage(name: string) {
  return MAP[name] ?? FALLBACK;
}
