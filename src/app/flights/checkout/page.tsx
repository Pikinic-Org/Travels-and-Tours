"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useSelectedFlightStore } from "@/lib/selected-flight-store";
import { formatNaira } from "@/lib/utils";
import { priceSelectedFlight, submitCheckout } from "@/app/flights/checkout/actions";
import type { FlightPricingResult } from "@/lib/pikinic-api";

type TravellerFormState = {
  title: string;
  first_name: string;
  last_name: string;
  other_name: string;
  country_code: string;
  dob: string;
  gender: string;
  passport_number: string;
  passport_expiry: string;
  passport_issue_date: string;
  nationality: string;
};

const emptyTraveller: TravellerFormState = {
  title: "Mr",
  first_name: "",
  last_name: "",
  other_name: "",
  country_code: "234",
  dob: "",
  gender: "male",
  passport_number: "",
  passport_expiry: "",
  passport_issue_date: "",
  nationality: "NG",
};

// Same field set for every passenger type — SkyLink requires full passport
// details regardless of whether the traveller is an adult, child, or
// infant (confirmed against skylink.schema.ts's travellerFields, and
// matches how Wakanow's own checkout treats every passenger the same way).
type PassengerSlot = { key: string; label: string };

function buildPassengerSlots(passengers: { adults: number; children: number; infants: number }): PassengerSlot[] {
  const slots: PassengerSlot[] = [];
  for (let i = 0; i < passengers.adults; i++) {
    slots.push({ key: `adult_${i}`, label: i === 0 ? "Lead Traveller" : `Adult ${i + 1}` });
  }
  for (let i = 0; i < passengers.children; i++) {
    slots.push({ key: `child_${i}`, label: `Child ${i + 1}` });
  }
  for (let i = 0; i < passengers.infants; i++) {
    slots.push({ key: `infant_${i}`, label: `Infant ${i + 1}` });
  }
  return slots;
}

const inputClass =
  "w-full rounded-[2px] border border-border-primary bg-surface-primary px-3 py-2.5 text-sm text-text-primary focus:border-green-700 focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function TravellerFields({
  value,
  onChange,
}: {
  value: TravellerFormState;
  onChange: <K extends keyof TravellerFormState>(key: K, value: TravellerFormState[K]) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Title">
        <select value={value.title} onChange={(e) => onChange("title", e.target.value)} className={inputClass}>
          {["Mr", "Mrs", "Ms", "Miss", "Dr", "Prof"].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Gender">
        <select value={value.gender} onChange={(e) => onChange("gender", e.target.value)} className={inputClass}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </Field>
      <Field label="First Name">
        <input
          required
          value={value.first_name}
          onChange={(e) => onChange("first_name", e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field label="Last Name">
        <input
          required
          value={value.last_name}
          onChange={(e) => onChange("last_name", e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field label="Other Name (optional)">
        <input
          value={value.other_name}
          onChange={(e) => onChange("other_name", e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field label="Phone Country Code">
        <input
          required
          value={value.country_code}
          onChange={(e) => onChange("country_code", e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field label="Date of Birth">
        <input
          required
          type="date"
          value={value.dob}
          onChange={(e) => onChange("dob", e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field label="Nationality (ISO code)">
        <input
          required
          maxLength={2}
          value={value.nationality}
          onChange={(e) => onChange("nationality", e.target.value.toUpperCase())}
          className={inputClass}
        />
      </Field>
      <Field label="Passport Number">
        <input
          required
          value={value.passport_number}
          onChange={(e) => onChange("passport_number", e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field label="Passport Issue Date">
        <input
          required
          type="date"
          value={value.passport_issue_date}
          onChange={(e) => onChange("passport_issue_date", e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field label="Passport Expiry">
        <input
          required
          type="date"
          value={value.passport_expiry}
          onChange={(e) => onChange("passport_expiry", e.target.value)}
          className={inputClass}
        />
      </Field>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const selected = useSelectedFlightStore((s) => s.selected);
  const hasHydrated = useSelectedFlightStore((s) => s.hasHydrated);

  const [pricing, setPricing] = useState<FlightPricingResult | null>(null);
  const [pricingError, setPricingError] = useState<string | null>(null);
  const [contact, setContact] = useState({ email: "", phone: "" });
  const [travellers, setTravellers] = useState<Record<string, TravellerFormState>>({});
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  const slots = useMemo(() => (selected ? buildPassengerSlots(selected.passengers) : []), [selected]);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!selected) {
      router.replace("/flights");
      return;
    }
    priceSelectedFlight(selected.flight.booking_token, selected.passengers)
      .then(setPricing)
      .catch((err) => setPricingError(err instanceof Error ? err.message : "Could not price this flight."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated, selected]);

  useEffect(() => {
    if (!selected) return;
    setTravellers((prev) => {
      const next: Record<string, TravellerFormState> = {};
      for (const slot of buildPassengerSlots(selected.passengers)) {
        next[slot.key] = prev[slot.key] ?? { ...emptyTraveller };
      }
      return next;
    });
  }, [selected]);

  useEffect(() => {
    if (!pricing) return;
    const expiresAt = new Date(pricing.expires_at.replace(" ", "T")).getTime();
    const tick = () => setSecondsLeft(Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [pricing]);

  if (!hasHydrated || !selected) return null;

  function updateTraveller<K extends keyof TravellerFormState>(slotKey: string, field: K, value: TravellerFormState[K]) {
    setTravellers((prev) => ({ ...prev, [slotKey]: { ...prev[slotKey], [field]: value } }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pricing || !selected) return;
    setSubmitError(null);

    const toTravellerData = (t: TravellerFormState) => ({
      title: t.title as "Mr" | "Mrs" | "Ms" | "Miss" | "Dr" | "Prof",
      first_name: t.first_name,
      last_name: t.last_name,
      other_name: t.other_name || undefined,
      country_code: t.country_code,
      dob: t.dob,
      gender: t.gender as "male" | "female",
      passport_number: t.passport_number,
      passport_expiry: t.passport_expiry,
      passport_issue_date: t.passport_issue_date,
      nationality: t.nationality,
    });

    const leadKey = slots[0]?.key ?? "adult_0";
    const travelersPayload: Record<string, ReturnType<typeof toTravellerData>> = {};
    for (const slot of slots) {
      travelersPayload[slot.key] = toTravellerData(travellers[slot.key] ?? emptyTraveller);
    }

    startTransition(async () => {
      try {
        const result = await submitCheckout({
          tripType: selected.tripType,
          fromCode: selected.fromCode,
          toCode: selected.toCode,
          departureDate: selected.departureDate,
          returnDate: selected.returnDate,
          bookingToken: pricing.booking_token,
          verifiedPrice: pricing.verified_price,
          customerPrice: pricing.customer_price,
          currency: pricing.currency,
          passengers: selected.passengers,
          travellers: {
            primary_guest: {
              ...toTravellerData(travellers[leadKey] ?? emptyTraveller),
              email: contact.email,
              phone: contact.phone,
            },
            travelers: travelersPayload,
          },
          redirectUrl: `${window.location.origin}/flights/checkout/callback`,
        });
        window.location.href = result.checkoutUrl;
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : "Could not start checkout.");
      }
    });
  }

  const segments = selected.flight.segments[0];
  const first = segments[0];
  const last = segments[segments.length - 1];
  const airlines = Array.from(new Set(segments.map((s) => s.airline))).join(", ");

  return (
    <section className="py-20 md:py-28">
      <Container>
        <h1 className="text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl">
          Complete Your <span className="text-green-700">Booking</span>
        </h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            {pricingError ? (
              <div className="rounded-[2px] border border-border-primary bg-surface-primary p-6 text-text-secondary">
                {pricingError}
              </div>
            ) : !pricing ? (
              <div className="flex items-center gap-3 text-text-secondary">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-border-primary border-t-green-700" />
                Confirming price…
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-4">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-text-tertiary">
                    Contact Information
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Email">
                      <input
                        required
                        type="email"
                        value={contact.email}
                        onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Phone">
                      <input
                        required
                        value={contact.phone}
                        onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                        className={inputClass}
                      />
                    </Field>
                  </div>
                </div>

                {slots.map((slot) => (
                  <div key={slot.key} className="space-y-4 border-t border-border-primary pt-8">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-text-tertiary">
                      {slot.label}
                    </h2>
                    <TravellerFields
                      value={travellers[slot.key] ?? emptyTraveller}
                      onChange={(field, value) => updateTraveller(slot.key, field, value)}
                    />
                  </div>
                ))}

                {submitError && <p className="text-sm text-red-700">{submitError}</p>}

                <Button type="submit" size="lg" variant="primary" disabled={isPending} className="w-full">
                  {isPending ? "Starting checkout…" : `Pay ${formatNaira(pricing.customer_price)}`}
                </Button>
              </form>
            )}
          </div>

          <div className="h-fit rounded-[2px] border border-border-primary bg-surface-primary p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-text-tertiary">Flight Summary</h2>
            <p className="mt-3 text-lg font-bold text-text-primary">
              {first.departure_city} ({first.departure_code}) → {last.arrival_city} ({last.arrival_code})
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              {airlines} · {first.flight_no} · {first.departure_time}–{last.arrival_time}
            </p>
            <p className="mt-3 text-xs uppercase tracking-widest text-text-tertiary">
              {selected.passengers.adults} Adult{selected.passengers.adults !== 1 ? "s" : ""}
              {selected.passengers.children > 0 ? `, ${selected.passengers.children} Child${selected.passengers.children !== 1 ? "ren" : ""}` : ""}
              {selected.passengers.infants > 0 ? `, ${selected.passengers.infants} Infant${selected.passengers.infants !== 1 ? "s" : ""}` : ""}
            </p>

            {pricing && (
              <>
                <div className="mt-6 border-t border-border-primary pt-4">
                  <p className="text-xs uppercase tracking-widest text-text-tertiary">Total</p>
                  <p className="text-2xl font-bold text-green-700">{formatNaira(pricing.customer_price)}</p>
                  {pricing.deal && (
                    <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-green-700">
                      {pricing.deal.label ?? `${pricing.deal.discountPercent}% Off`} applied
                    </p>
                  )}
                </div>
                {secondsLeft !== null && (
                  <p className="mt-3 text-sm font-semibold text-text-secondary">
                    Price held for {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
