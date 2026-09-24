import { AirlineLogo } from "@/components/flights/airline-logo";
import { PlaneIcon, TicketIcon, UsersIcon } from "@/components/ui/search-icons";
import { describePassengers } from "@/lib/checkout-form";
import {
  formatDuration,
  formatFlightDate,
  layoverMinutes,
  legDurationMinutes,
  legLabel,
  legStops,
  type FlightLeg,
} from "@/lib/flight-format";
import { formatNaira } from "@/lib/utils";
import type { FlightPricingResult, SelectedFlight } from "@/types";

// "Economy (O)" — same cabin + booking-class pairing the result cards show.
const cabinLabel = (leg: FlightLeg): string | null => {
  const cabin = leg[0]?.class;
  if (!cabin) return null;
  const letters = Array.from(new Set(leg.map((segment) => segment.class_letter).filter(Boolean)));
  return letters.length > 0 ? `${cabin} (${letters.join("/")})` : cabin;
};

const LegItinerary = ({ leg, label }: { leg: FlightLeg; label: string | null }) => {
  const duration = legDurationMinutes(leg);
  const cabin = cabinLabel(leg);

  return (
    <div>
      {label && (
        <p className="mb-2 text-[10px] font-semibold text-text-tertiary">{label}</p>
      )}
      {leg.map((segment, index) => {
        const wait = index > 0 ? layoverMinutes(leg[index - 1], segment) : null;
        return (
          <div key={`${segment.flight_no}-${index}`}>
            {index > 0 && (
              <p className="my-2 rounded-md bg-neutral-900/[0.06] px-2.5 py-1.5 text-xs font-semibold text-text-secondary">
                {wait !== null ? `${formatDuration(wait)} layover` : "Layover"} in {segment.departure_city} (
                {segment.departure_code})
              </p>
            )}
            <div className="flex items-start gap-3">
              <AirlineLogo code={segment.img} name={segment.airline} size={28} />
              <div className="min-w-0 flex-1 text-sm">
                <p className="font-semibold text-text-primary">
                  {segment.airline} · {segment.flight_no}
                  {index === 0 && cabin && <span className="ml-1.5 font-normal text-text-tertiary">· {cabin}</span>}
                </p>
                <p className="mt-0.5 text-text-secondary">
                  {segment.departure_time.toUpperCase()} {segment.departure_city} ({segment.departure_code})
                  {formatFlightDate(segment.departure_date) && (
                    <span className="text-text-tertiary"> · {formatFlightDate(segment.departure_date)}</span>
                  )}
                </p>
                <p className="text-text-secondary">
                  {segment.arrival_time.toUpperCase()} {segment.arrival_city} ({segment.arrival_code})
                  {formatFlightDate(segment.arrival_date) && (
                    <span className="text-text-tertiary"> · {formatFlightDate(segment.arrival_date)}</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        );
      })}
      <p className="mt-2 text-xs text-text-tertiary">
        Total {duration !== null ? formatDuration(duration) : leg[0]?.duration_time}
        {legStops(leg) > 0 && ` · ${legStops(leg)} ${legStops(leg) === 1 ? "stop" : "stops"}`}
      </p>
    </div>
  );
};

export const FlightSummary = ({
  selected,
  pricing,
  secondsLeft,
}: {
  selected: SelectedFlight;
  pricing: FlightPricingResult | null;
  secondsLeft: number | null;
}) => {
  const firstLeg = selected.flight.segments[0];
  const lastLeg = selected.flight.segments[selected.flight.segments.length - 1];

  return (
    <div className="no-scrollbar h-fit rounded-lg border border-border-primary bg-surface-primary lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
      <div className="flex items-center justify-between border-b border-border-primary p-6 pb-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-text-tertiary">
          <TicketIcon className="h-4 w-4" />
          Booking summary
        </h2>
        <span className="flex items-center gap-1 text-xs font-semibold text-text-tertiary">
          <UsersIcon className="h-3.5 w-3.5" />
          {describePassengers(selected.passengers)}
        </span>
      </div>

      <div className="space-y-5 p-6">
        <p className="flex items-center gap-2 text-base font-bold text-text-primary">
          <PlaneIcon className="h-4 w-4 text-green-700" />
          {firstLeg[0].departure_code} → {lastLeg[lastLeg.length - 1].arrival_code}
        </p>

        {selected.flight.segments.map((leg, index) => (
          <LegItinerary key={index} leg={leg} label={legLabel(selected.tripType, index)} />
        ))}
      </div>

      {pricing && (
        <div className="border-t border-border-primary p-6 pt-4">
          <p className="text-sm text-text-tertiary">Total</p>
          <p className="text-2xl font-bold text-green-700">{formatNaira(pricing.customer_price)}</p>
          {pricing.deal && (
            <p className="mt-1 text-sm font-semibold text-green-700">
              {pricing.deal.label ?? `${pricing.deal.discountPercent}% Off`} applied
            </p>
          )}
          {secondsLeft !== null && (
            <p className="mt-3 text-sm font-semibold text-text-secondary">
              Price held for {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
