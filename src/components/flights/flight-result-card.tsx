"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AirlineLogo } from "@/components/flights/airline-logo";
import {
  arrivalDayOffset,
  cabinBagText,
  checkedBagText,
  fareName,
  flightAirlines,
  formatDuration,
  formatFlightDate,
  hasCheckedBag,
  isRefundable,
  layoverMinutes,
  legDurationMinutes,
  legStops,
  type FlightLeg,
} from "@/lib/flight-format";
import { formatIsoDate } from "@/lib/dates";
import type { FlightAmenity, FlightSearchResult, FlightSegment } from "@/types";
import { cn, formatNaira } from "@/lib/utils";

type TripType = "oneway" | "roundtrip" | "multicity";

const LOW_SEATS_THRESHOLD = 5;

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const BagIcon = ({ className }: { className?: string }) => (
  <svg {...iconProps} className={className}>
    <rect x="5" y="8" width="14" height="13" rx="2" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);

const CabinBagIcon = ({ className }: { className?: string }) => (
  <svg {...iconProps} className={className}>
    <rect x="7" y="9" width="10" height="11" rx="2" />
    <path d="M10 9V7a2 2 0 0 1 4 0v2" />
  </svg>
);

const RefundIcon = ({ className }: { className?: string }) => (
  <svg {...iconProps} className={className}>
    <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" />
  </svg>
);

const ChevronIcon = ({ className }: { className?: string }) => (
  <svg {...iconProps} strokeWidth={2} className={className}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const Chip = ({
  icon,
  tone = "neutral",
  children,
}: {
  icon?: ReactNode;
  tone?: "neutral" | "good" | "warn";
  children: ReactNode;
}) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-[11px] font-semibold uppercase tracking-widest",
      tone === "good" && "bg-green-100 text-green-800",
      tone === "warn" && "bg-red-100 text-red-700",
      tone === "neutral" && "bg-neutral-900/[0.06] text-text-secondary"
    )}
  >
    {icon}
    {children}
  </span>
);

const clock = (time: string) => time.toUpperCase();

const legLabel = (tripType: TripType, index: number): string | null => {
  if (tripType === "roundtrip") return index === 0 ? "Outbound" : "Return";
  if (tripType === "multicity") return `Flight ${index + 1}`;
  return null;
};

// "PRE RESERVATION SEAT ASSIGNMEN" → "Pre reservation seat assignmen" —
// SkyLink sends these shouting and single-spaced-inconsistently.
const tidyAmenity = (description: string) => {
  const text = description.replace(/\s+/g, " ").trim().toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const uniqueAmenities = (amenities: FlightAmenity[] | undefined): FlightAmenity[] => {
  const seen = new Set<string>();
  return (amenities ?? []).filter((amenity) => {
    const key = tidyAmenity(amenity.description);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

// "Economy (O)" — the cabin plus the airline's booking-class letter(s).
const cabinLabel = (leg: FlightLeg): string | null => {
  const cabin = leg[0]?.class;
  if (!cabin) return null;
  const letters = Array.from(new Set(leg.map((segment) => segment.class_letter).filter(Boolean)));
  return letters.length > 0 ? `${cabin} (${letters.join("/")})` : cabin;
};

const LegSummary = ({ leg, label }: { leg: FlightLeg; label: string | null }) => {
  const first = leg[0];
  const last = leg[leg.length - 1];
  const stops = legStops(leg);
  const duration = legDurationMinutes(leg);
  const dayOffset = arrivalDayOffset(leg);
  const airlines = Array.from(new Set(leg.map((segment) => segment.airline)));
  const via = leg.slice(0, -1).map((segment) => segment.arrival_code).join(", ");

  return (
    <div>
      {label && (
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-text-tertiary">{label}</p>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex items-center gap-3 sm:w-48 sm:shrink-0">
          <AirlineLogo code={first.img} name={first.airline} size={40} />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-text-primary">{airlines.join(", ")}</p>
            <p className="truncate text-xs text-text-tertiary">{leg.map((segment) => segment.flight_no).join(" · ")}</p>
          </div>
        </div>

        <div className="flex flex-1 items-center gap-4">
          <div>
            <p className="text-xl font-bold leading-none text-text-primary">{clock(first.departure_time)}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-text-primary">
              {first.departure_code}
            </p>
            <p className="text-[11px] uppercase tracking-wide text-text-tertiary">{first.departure_city}</p>
            {formatFlightDate(first.departure_date) && (
              <p className="text-[11px] text-text-tertiary">{formatFlightDate(first.departure_date)}</p>
            )}
          </div>

          <div className="min-w-0 flex-1 text-center">
            {cabinLabel(leg) && (
              <span className="mb-1 inline-block rounded-sm bg-green-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-green-800">
                {cabinLabel(leg)}
              </span>
            )}
            <p className="text-xs text-text-tertiary">{duration !== null ? formatDuration(duration) : first.duration_time}</p>
            <div className="relative my-1.5 h-px bg-border-secondary">
              {Array.from({ length: stops }, (_, index) => (
                <span
                  key={index}
                  style={{ left: `${((index + 1) / (stops + 1)) * 100}%` }}
                  className="absolute top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-text-tertiary"
                />
              ))}
            </div>
            <p className={cn("truncate text-xs font-semibold", stops === 0 ? "text-green-700" : "text-text-secondary")}>
              {stops === 0 ? "Nonstop" : `${stops} ${stops === 1 ? "stop" : "stops"} · ${via}`}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xl font-bold leading-none text-text-primary">
              {clock(last.arrival_time)}
              {dayOffset > 0 && <sup className="ml-0.5 text-[10px] font-semibold text-text-tertiary">+{dayOffset}</sup>}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-text-primary">
              {last.arrival_code}
            </p>
            <p className="text-[11px] uppercase tracking-wide text-text-tertiary">{last.arrival_city}</p>
            {formatFlightDate(last.arrival_date) && (
              <p className="text-[11px] text-text-tertiary">{formatFlightDate(last.arrival_date)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SegmentDetail = ({ segment }: { segment: FlightSegment }) => (
  <div className="flex gap-3">
    <AirlineLogo code={segment.img} name={segment.airline} size={28} />
    <div className="min-w-0 flex-1 text-sm">
      <p className="font-semibold text-text-primary">
        {segment.airline} · {segment.flight_no}
      </p>
      <p className="text-xs text-text-tertiary">
        {[
          segment.class,
          segment.branded_fare,
          segment.equipment && `Aircraft ${segment.equipment}`,
          segment.seg_duration,
        ]
          .filter(Boolean)
          .join(" · ")}
      </p>
      <p className="mt-2 text-text-secondary">
        <span className="font-semibold text-text-primary">{clock(segment.departure_time)}</span> {segment.departure_city} (
        {segment.departure_code})
        {segment.departure_terminal && ` · Terminal ${segment.departure_terminal}`}
        {segment.departure_airport && <span className="block text-xs text-text-tertiary">{segment.departure_airport}</span>}
      </p>
      <p className="mt-1.5 text-text-secondary">
        <span className="font-semibold text-text-primary">{clock(segment.arrival_time)}</span> {segment.arrival_city} (
        {segment.arrival_code})
        {segment.arrival_terminal && ` · Terminal ${segment.arrival_terminal}`}
        {segment.arrival_airport && <span className="block text-xs text-text-tertiary">{segment.arrival_airport}</span>}
      </p>
      <p className="mt-2 text-xs text-text-tertiary">
        Checked bag: {segment.baggage ?? "not specified"} · Cabin bag: {segment.cabin_baggage ?? "not specified"}
      </p>
    </div>
  </div>
);

type DetailsTab = "details" | "baggage" | "fare";

const detailTabs: { key: DetailsTab; label: string }[] = [
  { key: "details", label: "Flight Details" },
  { key: "baggage", label: "Baggage" },
  { key: "fare", label: "Fare Rules" },
];

const eyebrowClass = "mb-3 text-[10px] font-semibold uppercase tracking-widest text-text-tertiary";

// "1 PC" / "23 KG" as sent; "0 PC" means none; nothing sent means unknown.
const describeBag = (value: string | undefined): string => {
  if (!value) return "Not specified";
  return /[1-9]/.test(value) ? value : "Not included";
};

const ItineraryTab = ({ flight, tripType }: { flight: FlightSearchResult; tripType: TripType }) => (
  <div className="space-y-6">
    {flight.segments.map((leg, legIndex) => (
      <div key={legIndex}>
        {legLabel(tripType, legIndex) && <p className={eyebrowClass}>{legLabel(tripType, legIndex)}</p>}
        <div className="space-y-4">
          {leg.map((segment, index) => {
            const wait = index > 0 ? layoverMinutes(leg[index - 1], segment) : null;
            return (
              <div key={`${segment.flight_no}-${index}`} className="space-y-4">
                {index > 0 && (
                  <p className="rounded-sm bg-neutral-900/[0.06] px-3 py-2 text-xs font-semibold uppercase tracking-widest text-text-secondary">
                    {wait !== null ? `Layover ${formatDuration(wait)}` : "Layover"} in {segment.departure_city} (
                    {segment.departure_code})
                  </p>
                )}
                <SegmentDetail segment={segment} />
              </div>
            );
          })}
        </div>
      </div>
    ))}
  </div>
);

const BaggageTab = ({ flight, tripType }: { flight: FlightSearchResult; tripType: TripType }) => {
  const usesPieces = flight.segments
    .flat()
    .some((segment) => /PC/i.test(`${segment.baggage ?? ""} ${segment.cabin_baggage ?? ""}`));

  return (
    <div className="space-y-6">
      {flight.segments.map((leg, legIndex) => (
        <div key={legIndex}>
          {legLabel(tripType, legIndex) && <p className={eyebrowClass}>{legLabel(tripType, legIndex)}</p>}
          <div className="overflow-x-auto border border-border-primary bg-surface-primary">
            <table className="w-full min-w-max border-collapse text-sm">
              <thead>
                <tr>
                  {["Flight", "Route", "Checked bag", "Cabin bag"].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="bg-neutral-900/[0.03] px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-text-tertiary"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leg.map((segment, index) => (
                  <tr key={`${segment.flight_no}-${index}`} className="border-t border-border-primary">
                    <td className="px-4 py-3 text-text-secondary">
                      {segment.airline} · {segment.flight_no}
                    </td>
                    <td className="px-4 py-3 font-semibold text-text-primary">
                      {segment.departure_code} → {segment.arrival_code}
                    </td>
                    <td className="px-4 py-3 font-semibold text-text-primary">{describeBag(segment.baggage)}</td>
                    <td className="px-4 py-3 font-semibold text-text-primary">{describeBag(segment.cabin_baggage)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      {usesPieces && <p className="text-xs text-text-tertiary">PC = pieces of baggage.</p>}
    </div>
  );
};

// Only what the search actually returned — SkyLink doesn't send the airline's
// full change and cancellation terms, so none are shown or implied.
const FareTab = ({ flight }: { flight: FlightSearchResult }) => {
  const refundable = isRefundable(flight);
  const ticketBy = flight.last_ticketing_date ? formatIsoDate(flight.last_ticketing_date) : null;
  const amenities = uniqueAmenities(flight.amenities);

  const rows: [string, string][] = [
    ["Fare", fareName(flight) ?? "Not specified"],
    ["Cabin", cabinLabel(flight.segments[0]) ?? "Not specified"],
    ["Refundable", refundable === null ? "Not specified" : refundable ? "Yes" : "No"],
    ["Ticket by", ticketBy ?? "Not specified"],
    ["Seats left", flight.seats_left > 0 ? String(flight.seats_left) : "Not specified"],
  ];

  return (
    <div className="space-y-6">
      <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
        {rows.map(([term, description]) => (
          <div key={term} className="flex items-baseline justify-between gap-4 border-b border-border-primary pb-2">
            <dt className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">{term}</dt>
            <dd className="text-right font-semibold text-text-primary">{description}</dd>
          </div>
        ))}
      </dl>

      {amenities.length > 0 && (
        <div>
          <p className={eyebrowClass}>Fare includes</p>
          <ul className="grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
            {amenities.map((amenity) => (
              <li key={amenity.description} className="flex items-center justify-between gap-3">
                <span className="text-text-secondary">{tidyAmenity(amenity.description)}</span>
                <span
                  className={cn(
                    "shrink-0 text-[10px] font-semibold uppercase tracking-widest",
                    amenity.chargeable ? "text-text-tertiary" : "text-green-700"
                  )}
                >
                  {amenity.chargeable ? "Extra cost" : "Included"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const FlightDetails = ({ flight, tripType }: { flight: FlightSearchResult; tripType: TripType }) => {
  const [tab, setTab] = useState<DetailsTab>("details");

  return (
    <div className="border-t border-border-primary bg-neutral-900/[0.02]">
      <div role="tablist" aria-label="Flight information" className="flex gap-6 overflow-x-auto border-b border-border-primary px-5">
        {detailTabs.map((entry) => (
          <button
            key={entry.key}
            type="button"
            role="tab"
            aria-selected={tab === entry.key}
            onClick={() => setTab(entry.key)}
            className={cn(
              "-mb-px shrink-0 border-b-2 py-3 text-xs font-semibold uppercase tracking-widest transition-colors",
              tab === entry.key
                ? "border-green-700 text-green-700"
                : "border-transparent text-text-tertiary hover:text-text-primary"
            )}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="p-5">
        {tab === "details" && <ItineraryTab flight={flight} tripType={tripType} />}
        {tab === "baggage" && <BaggageTab flight={flight} tripType={tripType} />}
        {tab === "fare" && <FareTab flight={flight} />}
      </div>
    </div>
  );
};

export const FlightResultCard = ({
  flight,
  tripType,
  onSelect,
}: {
  flight: FlightSearchResult;
  tripType: TripType;
  onSelect: () => void;
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const checked = checkedBagText(flight);
  const cabin = cabinBagText(flight);
  const bagIncluded = hasCheckedBag(flight);
  const refundable = isRefundable(flight);
  const fare = fareName(flight);
  const lowSeats = flight.seats_left > 0 && flight.seats_left <= LOW_SEATS_THRESHOLD;

  return (
    <article className="border border-border-primary bg-surface-primary transition-colors hover:border-neutral-300">
      <div className="grid gap-5 p-5 md:grid-cols-[1fr_auto]">
        <div className="space-y-5">
          {flight.segments.map((leg, index) => (
            <LegSummary key={index} leg={leg} label={legLabel(tripType, index)} />
          ))}
        </div>

        <div className="flex flex-row items-end justify-between gap-3 border-t border-border-primary pt-4 md:min-w-44 md:flex-col md:items-end md:justify-center md:border-l md:border-t-0 md:pl-6 md:pt-0">
          <div className="md:text-right">
            {flight.deal && (
              <span className="mb-1.5 inline-block rounded-sm bg-green-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-green-800">
                {flight.deal.label ?? `${flight.deal.discountPercent}% Off`}
              </span>
            )}
            <p className="text-xs uppercase tracking-widest text-text-tertiary">From</p>
            <p className="text-2xl font-bold text-green-700">{formatNaira(flight.price)}</p>
          </div>
          <Button type="button" onClick={onSelect} size="md" variant="primary">
            Select
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-border-primary px-5 py-3">
        {bagIncluded !== null && (
          <Chip icon={<BagIcon className="h-3.5 w-3.5" />} tone={bagIncluded ? "good" : "neutral"}>
            {bagIncluded ? `Checked bag · ${checked}` : "No checked bag"}
          </Chip>
        )}
        {cabin && (
          <Chip icon={<CabinBagIcon className="h-3.5 w-3.5" />}>Cabin bag · {cabin}</Chip>
        )}
        {refundable !== null && (
          <Chip icon={<RefundIcon className="h-3.5 w-3.5" />} tone={refundable ? "good" : "neutral"}>
            {refundable ? "Refundable" : "Non-refundable"}
          </Chip>
        )}
        {fare && <Chip>{fare}</Chip>}
        {lowSeats && <Chip tone="warn">Only {flight.seats_left} left</Chip>}
        {flightAirlines(flight).length > 1 && <Chip>Multiple airlines</Chip>}

        <button
          type="button"
          onClick={() => setShowDetails((open) => !open)}
          aria-expanded={showDetails}
          className="ml-auto flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-green-700 transition-colors hover:text-green-800"
        >
          Flight details
          <ChevronIcon className={cn("h-4 w-4 transition-transform duration-200", showDetails && "rotate-180")} />
        </button>
      </div>

      {showDetails && <FlightDetails flight={flight} tripType={tripType} />}
    </article>
  );
};
