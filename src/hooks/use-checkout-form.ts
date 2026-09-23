"use client";

import { useEffect, useMemo, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { priceSelectedFlight, submitCheckout } from "@/server/modules/checkout/checkout.controller";
import { buildCheckoutParams, buildPassengerSlots, emptyTraveller, secondsUntil } from "@/lib/checkout-form";
import { useSelectedFlightStore } from "@/lib/selected-flight-store";
import type { ContactFormState, FlightPricingResult, TravellerFormState } from "@/types";

// Everything the checkout page needs: the price confirmation, the form state,
// the countdown, and the submit flow. The page and its components stay
// presentational and just render what this returns.
export const useCheckoutForm = () => {
  const router = useRouter();
  const selected = useSelectedFlightStore((state) => state.selected);
  const hasHydrated = useSelectedFlightStore((state) => state.hasHydrated);
  const clearSelected = useSelectedFlightStore((state) => state.clear);

  const [pricing, setPricing] = useState<FlightPricingResult | null>(null);
  const [pricingError, setPricingError] = useState<string | null>(null);
  const [contact, setContact] = useState<ContactFormState>({ email: "", phone: "" });
  const [travellers, setTravellers] = useState<Record<string, TravellerFormState>>({});
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  const slots = useMemo(() => (selected ? buildPassengerSlots(selected.passengers) : []), [selected]);

  // Nothing selected (e.g. the page was opened directly) → back to search.
  // Otherwise ask SkyLink to re-confirm the price before showing the form.
  useEffect(() => {
    if (!hasHydrated) return;
    if (!selected) {
      router.replace("/flights");
      return;
    }
    priceSelectedFlight(selected.flight.booking_token, selected.passengers)
      .then(setPricing)
      .catch(() => {
        // A stale/expired booking_token can't be re-priced — there's no
        // recovery for this flight, so send them back to search instead of
        // leaving them on a dead error box. (Also avoids a rare crash: a
        // failed re-price on an already-expired token has been seen coming
        // back as an uncaught Server Action error rather than a normal
        // rejection, which reload would then hit again.)
        setPricingError("This fare is no longer available. Taking you back to search…");
        clearSelected();
        router.replace("/flights");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated, selected]);

  // One form entry per passenger slot, keeping anything already typed.
  useEffect(() => {
    if (!selected) return;
    setTravellers((previous) => {
      const next: Record<string, TravellerFormState> = {};
      for (const slot of buildPassengerSlots(selected.passengers)) {
        next[slot.key] = previous[slot.key] ?? { ...emptyTraveller };
      }
      return next;
    });
  }, [selected]);

  // "Price held for m:ss" countdown.
  useEffect(() => {
    if (!pricing) return;
    const tick = () => setSecondsLeft(secondsUntil(pricing.expires_at));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [pricing]);

  // The hold expired while they were sitting on this page — send them back
  // to search rather than leaving a dead "0:00" screen up. Submitting (or
  // reloading into a fresh re-price attempt) against an expired token isn't
  // recoverable, so there's nothing useful left to do here.
  useEffect(() => {
    if (secondsLeft !== 0) return;
    clearSelected();
    router.replace("/flights");
  }, [secondsLeft, clearSelected, router]);

  const updateContact = <K extends keyof ContactFormState>(field: K, value: ContactFormState[K]) =>
    setContact((previous) => ({ ...previous, [field]: value }));

  const updateTraveller = <K extends keyof TravellerFormState>(
    slotKey: string,
    field: K,
    value: TravellerFormState[K]
  ) => setTravellers((previous) => ({ ...previous, [slotKey]: { ...previous[slotKey], [field]: value } }));

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!pricing || !selected) return;
    setSubmitError(null);

    startTransition(async () => {
      try {
        const result = await submitCheckout(
          buildCheckoutParams({
            selected,
            pricing,
            contact,
            slots,
            travellers,
            redirectUrl: `${window.location.origin}/flights/checkout/callback`,
          })
        );
        window.location.href = result.checkoutUrl;
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : "Could not start checkout.");
      }
    });
  };

  return {
    ready: hasHydrated && selected !== null,
    selected,
    pricing,
    pricingError,
    contact,
    travellers,
    slots,
    isPending,
    submitError,
    secondsLeft,
    updateContact,
    updateTraveller,
    handleSubmit,
  };
};

export type CheckoutForm = ReturnType<typeof useCheckoutForm>;
