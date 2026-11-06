import { getTourBySlug, getTourPricing, isDayTour, type ResolvedPricing, type Tour } from "@/data/toursData";
import { quotePrice, type PriceQuote } from "@/lib/pricing";
import {
  earliestAllowedDate,
  isEmail,
  isIsoDate,
  isPhone,
  multiLine,
  oneLine,
  type ValidationResult,
} from "@/lib/validation";

// Server-side helpers for the tour booking API. Client components only import types from here.

export interface BookingInput {
  packageId: string;
  fullName: string;
  email: string;
  phone: string;
  travelDate: string; // YYYY-MM-DD
  adults: number;
  /** Required for day tours, empty for multi-day tours. */
  pickupLocation: string;
  /** Optional. */
  notes: string;
}

/**
 * Technical safety cap on the number of guests in one booking. It is not a business limit: tours
 * with vehicles (tuk tuk, jeep) scale the vehicles and the price for any group up to this size.
 * Larger groups are asked to message us on WhatsApp.
 */
export const MAX_BOOKING_ADULTS = 100;

/**
 * Total is always calculated on the server from the listed price. A total sent by the browser is
 * ignored, so nobody can book a tour at a price they made up.
 * - Classic tours: price x adults.
 * - Per-person vehicle tours (tuk tuk): price x guests (minimum applies). Vehicles scale automatically.
 * - Per-vehicle tours (jeep): price x number of jeeps, where one jeep takes up to its capacity.
 */
export function quoteBooking(target: Pick<BookingTarget, "price" | "pricing">, guests: number): PriceQuote {
  return quotePrice(target.price, target.pricing, guests);
}

export function calculateTotal(target: Pick<BookingTarget, "price" | "pricing">, guests: number): number {
  return quoteBooking(target, guests).total;
}

export type BookingField = keyof BookingInput;

export interface BookingTarget {
  id: string;
  type: Tour["type"];
  title: string;
  duration: string;
  price: number;
  originalPrice: number;
  path: string;
  /** Day tours ask the guest for a pickup location. */
  requiresPickup: boolean;
  /** Pricing model, minimum group, vehicle rule and labels. See getTourPricing. */
  pricing: ResolvedPricing;
}

/** Looks the package up on the server so the client can never set its own title or price. */
export function resolveBookingTarget(id: string): BookingTarget | null {
  const tour = getTourBySlug(id);
  if (!tour) return null;
  return {
    id: tour.id,
    type: tour.type,
    title: tour.title,
    duration: tour.duration,
    price: tour.price,
    originalPrice: tour.originalPrice,
    path: `/packages/${tour.id}`,
    requiresPickup: isDayTour(tour),
    pricing: getTourPricing(tour),
  };
}

export function validateBooking(
  raw: unknown,
  target: Pick<BookingTarget, "id" | "requiresPickup" | "pricing">
): ValidationResult<BookingInput, BookingField> {
  const body = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const errors: Partial<Record<BookingField, string>> = {};

  const fullName = oneLine(body.fullName, 100);
  const email = oneLine(body.email, 254);
  const phone = oneLine(body.phone, 30);
  const travelDate = oneLine(body.travelDate, 10);
  const adults = Number(body.adults);
  const pickupLocation = target.requiresPickup ? oneLine(body.pickupLocation, 200) : "";
  const notes = multiLine(body.notes, 2000);

  if (fullName.length < 2) errors.fullName = "Please enter your full name.";
  if (!isEmail(email)) errors.email = "Please enter a valid email address.";
  if (!isPhone(phone)) errors.phone = "Please enter a valid phone number, including your country code.";

  if (!isIsoDate(travelDate)) errors.travelDate = "Please choose your preferred travel date.";
  else if (travelDate < earliestAllowedDate()) errors.travelDate = "Travel date cannot be in the past.";

  const minGuests = target.pricing.minTravellers;
  if (!Number.isInteger(adults) || adults < 1 || adults > MAX_BOOKING_ADULTS) {
    errors.adults =
      adults > MAX_BOOKING_ADULTS
        ? `For groups of more than ${MAX_BOOKING_ADULTS} guests, please message us on WhatsApp.`
        : `Number of guests must be a whole number between 1 and ${MAX_BOOKING_ADULTS}.`;
  } else if (adults < minGuests) {
    errors.adults = `This tour needs at least ${minGuests} people.`;
  }

  if (target.requiresPickup && pickupLocation.length < 2) {
    errors.pickupLocation = "Please tell us where we should pick you up.";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    data: { packageId: target.id, fullName, email, phone, travelDate, adults, pickupLocation, notes },
  };
}