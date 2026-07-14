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
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Rishikesh-Lakshman_Jhula_by_Kaustubh_Nayyar.jpg/330px-Rishikesh-Lakshman_Jhula_by_Kaustubh_Nayyar.jpg",
  Kashmir:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Gulmarg_Gondola%2C_Cable_Car.JPG/250px-Gulmarg_Gondola%2C_Cable_Car.JPG",
  Meghalaya:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Living_root_bridges%2C_Nongriat_village%2C_Meghalaya.jpg/330px-Living_root_bridges%2C_Nongriat_village%2C_Meghalaya.jpg",
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
