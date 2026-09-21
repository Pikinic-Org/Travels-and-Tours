import { describePassengers } from "@/lib/checkout-form";
import { formatNaira } from "@/lib/utils";
import type { FlightPricingResult, SelectedFlight } from "@/types";

export const FlightSummary = ({
  selected,
  pricing,
  secondsLeft,
}: {
  selected: SelectedFlight;
  pricing: FlightPricingResult | null;
  secondsLeft: number | null;
}) => {
  const segments = selected.flight.segments[0];
  const first = segments[0];
  const last = segments[segments.length - 1];
  const airlines = Array.from(new Set(segments.map((segment) => segment.airline))).join(", ");

  return (
    <div className="h-fit rounded-[2px] border border-border-primary bg-surface-primary p-6">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-text-tertiary">Flight Summary</h2>
      <p className="mt-3 text-lg font-bold text-text-primary">
        {first.departure_city} ({first.departure_code}) → {last.arrival_city} ({last.arrival_code})
      </p>
      <p className="mt-1 text-sm text-text-secondary">
        {airlines} · {first.flight_no} · {first.departure_time}–{last.arrival_time}
      </p>
      <p className="mt-3 text-xs uppercase tracking-widest text-text-tertiary">
        {describePassengers(selected.passengers)}
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
  );
};
