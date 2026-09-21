"use server";

import { priceFlight, startCheckout, type StartCheckoutParams } from "@/lib/pikinic-api";

export async function priceSelectedFlight(
  bookingToken: string,
  passengers: { adults: number; children: number; infants: number }
) {
  return priceFlight({
    booking_token: bookingToken,
    passengers,
    currency: "NGN",
    class: "economy",
  });
}

export async function submitCheckout(params: StartCheckoutParams) {
  return startCheckout(params);
}
