import type { ResolvedPricing, VehicleRule } from "@/data/toursData";

// Pure pricing maths shared by the booking form (live preview), the booking API and the emails.
// No server-only imports, so it is safe in client components. The server always recalculates:
// a total sent by the browser is never trusted.

export interface PriceQuote {
  /** Guests entered by the visitor. */
  guests: number;
  /** Guests actually billed. Can be higher than `guests` when a minimum group size applies. */
  billedGuests: number;
  /** Vehicles needed, or null for tours that are not vehicle based (classic per-adult tours). */
  vehicles: number | null;
  /** Human text such as "2 tuk tuks", or null when `vehicles` is null. */
  vehicleText: string | null;
  total: number;
}

/** 1 vehicle up to its capacity, then one more for every extra `capacity` guests. */
export function vehiclesNeeded(guests: number, rule: VehicleRule): number {
  return Math.max(1, Math.ceil(guests / rule.capacity));
}

/** "1 tuk tuk", "2 tuk tuks". */
export function vehicleCountText(count: number, rule: VehicleRule): string {
  return `${count} ${count === 1 ? rule.singular : rule.plural}`;
}

/** One-line explanation shown next to the guest field and in the price box. */
export function vehicleNote(rule: VehicleRule): string {
  return `Each ${rule.singular} takes up to ${rule.capacity} guests. For bigger groups we add ${rule.plural} automatically.`;
}

/**
 * - "per-person": price x guests (at least `minTravellers`). If the tour has a vehicle rule, the
 *   number of vehicles is worked out too, but the price stays per person.
 * - "per-vehicle": price x vehicles, where vehicles = ceil(guests / capacity).
 */
export function quotePrice(price: number, pricing: ResolvedPricing, guests: number): PriceQuote {
  const safeGuests = Math.max(1, Math.floor(guests));
  const billedGuests = Math.max(safeGuests, pricing.minTravellers);
  const rule = pricing.vehicle;
  const vehicles = rule ? vehiclesNeeded(safeGuests, rule) : null;

  const total = pricing.model === "per-vehicle" && vehicles !== null ? price * vehicles : price * billedGuests;

  return {
    guests: safeGuests,
    billedGuests,
    vehicles,
    vehicleText: rule && vehicles !== null ? vehicleCountText(vehicles, rule) : null,
    total,
  };
}
