"use client";

import { FlightSummary } from "@/components/checkout/flight-summary";
import { TravellerFields } from "@/components/checkout/traveller-fields";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { UserIcon } from "@/components/ui/search-icons";
import { useCheckoutForm } from "@/hooks/use-checkout-form";
import { emptyTraveller } from "@/lib/checkout-form";
import { formatNaira } from "@/lib/utils";

export const CheckoutView = () => {
  const checkout = useCheckoutForm();
  const { selected, pricing } = checkout;

  if (!checkout.ready || !selected) return null;

  return (
    <section className="py-20 md:py-28">
      <Container>
        <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
          Complete Your <span className="text-green-700">Booking</span>
        </h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
          <div>
            {checkout.pricingError ? (
              <div className="rounded-2xl border border-border-primary bg-surface-primary p-6 text-text-secondary">
                {checkout.pricingError}
              </div>
            ) : !pricing ? (
              <div className="flex items-center gap-3 text-text-secondary">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-border-primary border-t-green-700" />
                Confirming price…
              </div>
            ) : (
              <form onSubmit={checkout.handleSubmit} className="space-y-8">
                {checkout.slots.map((slot, index) => {
                  const isLead = index === 0;
                  return (
                    <div key={slot.key} className="rounded-2xl border border-border-primary bg-surface-primary p-6 sm:p-8">
                      <h2 className="mb-6 flex items-center gap-2 text-sm font-semibold text-text-primary">
                        <UserIcon className="h-4 w-4 text-green-700" />
                        {slot.label}
                      </h2>
                      {isLead ? (
                        <TravellerFields
                          isLead
                          value={checkout.travellers[slot.key] ?? emptyTraveller}
                          onChange={(field, value) => checkout.updateTraveller(slot.key, field, value)}
                          contact={checkout.contact}
                          onContactChange={checkout.updateContact}
                        />
                      ) : (
                        <TravellerFields
                          value={checkout.travellers[slot.key] ?? emptyTraveller}
                          onChange={(field, value) => checkout.updateTraveller(slot.key, field, value)}
                        />
                      )}
                    </div>
                  );
                })}

                {checkout.submitError && <p className="text-sm text-red-700">{checkout.submitError}</p>}

                <Button type="submit" size="lg" variant="primary" disabled={checkout.isPending} className="w-full">
                  {checkout.isPending ? "Starting checkout…" : `Pay ${formatNaira(pricing.customer_price)}`}
                </Button>
              </form>
            )}
          </div>

          <FlightSummary selected={selected} pricing={pricing} secondsLeft={checkout.secondsLeft} />
        </div>
      </Container>
    </section>
  );
};
