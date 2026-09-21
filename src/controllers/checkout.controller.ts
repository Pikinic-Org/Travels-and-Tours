"use server";

// Server-side entry points the checkout UI calls. They run on the server so
// the proxy secret in the service layer never reaches the browser.

import { startCheckout } from "@/services/bookings.service";
import { priceFlight } from "@/services/flights.service";
import type { PassengerBreakdown, StartCheckoutParams } from "@/types";

export const priceSelectedFlight = async (bookingToken: string, passengers: PassengerBreakdown) =>
  priceFlight({
    booking_token: bookingToken,
    passengers,
    currency: "NGN",
    class: "economy",
  });

export const submitCheckout = async (params: StartCheckoutParams) => startCheckout(params);
