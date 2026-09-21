import { getAuthenticatedJson, postJson } from "@/server/lib/pikinic-client";
import type { FlightBooking, StartCheckoutParams, StartCheckoutResult } from "@/types";

export const startCheckout = (params: StartCheckoutParams) =>
  postJson<StartCheckoutResult>("/api/bookings", params);

export const getBooking = (bookingId: string) =>
  getAuthenticatedJson<FlightBooking>(`/api/bookings/${encodeURIComponent(bookingId)}`);

// Manually triggers the payment-check-then-reserve step — used as a
// belt-and-braces call when the customer's browser returns from Monnify's
// checkout, in case the webhook hasn't landed yet (or can't reach us, e.g.
// local dev without a public tunnel).
export const confirmBooking = (bookingId: string) =>
  postJson<FlightBooking>(`/api/bookings/${encodeURIComponent(bookingId)}/confirm`, {});
