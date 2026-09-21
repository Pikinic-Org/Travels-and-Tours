"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSelectedFlightStore } from "@/lib/selected-flight-store";
import { formatNaira } from "@/lib/utils";
import {
  LiveFlightFilters,
  defaultLiveFlightFilters,
  type LiveFlightFilterState,
} from "@/components/flights/live-flight-filters";
import type { FlightSearchParams, FlightSearchResult } from "@/lib/pikinic-api";

// A flight's first leg (index 0 covers oneway/roundtrip's outbound; results
// display one leg per card today, matching what search currently renders).
function leg(flight: FlightSearchResult) {
  return flight.segments[0];
}

function stopsCount(flight: FlightSearchResult): number {
  return leg(flight).length - 1;
}

function airlineNames(flight: FlightSearchResult): string[] {
  return Array.from(new Set(leg(flight).map((s) => s.airline)));
}

// The route/date/passenger context search was run with — not part of a
// FlightSearchResult itself, needed again at checkout to re-price correctly.
function routeContext(searchParams: FlightSearchParams) {
  const passengers = {
    adults: searchParams.adults,
    children: searchParams.children ?? 0,
    infants: searchParams.infants ?? 0,
  };

  if (searchParams.flight_type === "multicity") {
    const routes = searchParams.routes;
    return {
      tripType: "multicity" as const,
      fromCode: routes[0].from,
      toCode: routes[routes.length - 1].to,
      departureDate: routes[0].date,
      passengers,
    };
  }

  return {
    tripType: searchParams.flight_type,
    fromCode: searchParams.from,
    toCode: searchParams.to,
    departureDate: searchParams.flights_departure_date,
    returnDate: searchParams.flight_type === "roundtrip" ? searchParams.flights_return_date : undefined,
    passengers,
  };
}

// SkyLink doesn't provide a logo, only a 2-letter carrier code — looked up
// against Kiwi.com's public airline-logo CDN instead. Not every carrier is
// guaranteed to be in their database, so a failed load just hides the image
// rather than showing a broken-image icon.
function AirlineLogo({ code, name }: { code: string; name: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    <Image
      src={`https://images.kiwi.com/airlines/64x64/${code}.png`}
      alt={name}
      width={18}
      height={18}
      className="h-[18px] w-[18px] shrink-0 rounded-sm object-contain"
      onError={() => setFailed(true)}
    />
  );
}

function LiveFlightResultCard({
  flight,
  searchParams,
}: {
  flight: FlightSearchResult;
  searchParams: FlightSearchParams;
}) {
  const select = useSelectedFlightStore((s) => s.select);
  const router = useRouter();

  const segments = leg(flight);
  const first = segments[0];
  const last = segments[segments.length - 1];
  const stops = stopsCount(flight);

  function handleSelect() {
    select({ flight, ...routeContext(searchParams) });
    router.push("/flights/checkout");
  }

  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-r border-border-primary p-5 transition-colors hover:bg-neutral-900/[0.03] sm:grid-cols-[1fr_auto_auto]">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-bold uppercase tracking-widest text-text-primary">
          {first.departure_city} ({first.departure_code})
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 shrink-0 text-green-700"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
        <span className="text-sm font-bold uppercase tracking-widest text-text-primary">
          {last.arrival_city} ({last.arrival_code})
        </span>
        <span className="hidden items-center gap-1.5 text-xs uppercase tracking-widest text-text-tertiary sm:flex">
          <AirlineLogo code={first.img} name={first.airline} />
          {airlineNames(flight).join(", ")} · {first.flight_no}
        </span>
        <span className="rounded-sm bg-neutral-900/[0.06] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-text-tertiary">
          {first.departure_time} – {last.arrival_time} · {first.duration_time}
        </span>
        <span className="rounded-sm bg-neutral-900/[0.06] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-text-tertiary">
          {stops === 0 ? "Nonstop" : `${stops} Stop`}
        </span>
        {flight.deal && (
          <span className="rounded-sm bg-green-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-green-800">
            {flight.deal.label ?? `${flight.deal.discountPercent}% Off`}
          </span>
        )}
      </div>

      <div className="text-right sm:text-left">
        <p className="text-xs uppercase tracking-widest text-text-tertiary">From</p>
        <p className="text-lg font-bold text-green-700">{formatNaira(flight.price)}</p>
      </div>

      <Button
        type="button"
        onClick={handleSelect}
        size="md"
        variant="secondary"
        className="col-span-2 sm:col-span-1"
      >
        Select Flight
      </Button>
    </div>
  );
}

export function LiveFlightResults({
  results,
  searchParams,
}: {
  results: FlightSearchResult[];
  searchParams: FlightSearchParams;
}) {
  const [filters, setFilters] = useState<LiveFlightFilterState>(defaultLiveFlightFilters);

  const airlines = useMemo(
    () => Array.from(new Set(results.flatMap(airlineNames))).sort(),
    [results]
  );

  const [minPrice, maxPrice] = useMemo(() => {
    if (results.length === 0) return [0, 0];
    const prices = results.map((f) => f.price);
    return [Math.min(...prices), Math.max(...prices)];
  }, [results]);

  const filtered = useMemo(() => {
    const [rangeLo, rangeHi] = filters.priceRange ?? [minPrice, maxPrice];
    const matches = results.filter((flight) => {
      const stops = stopsCount(flight);
      if (filters.stops === "nonstop" && stops !== 0) return false;
      if (filters.stops === "1-stop" && stops !== 1) return false;
      if (filters.airlines.length > 0 && !airlineNames(flight).some((a) => filters.airlines.includes(a))) {
        return false;
      }
      if (flight.price < rangeLo || flight.price > rangeHi) return false;
      return true;
    });
    return [...matches].sort((a, b) =>
      filters.sort === "price-asc" ? a.price - b.price : b.price - a.price
    );
  }, [filters, results, minPrice, maxPrice]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-primary pb-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-text-tertiary">
          {filtered.length} {filtered.length === 1 ? "Flight" : "Flights"} Found
        </p>
        {results.length > 0 && (
          <LiveFlightFilters
            airlines={airlines}
            minPrice={minPrice}
            maxPrice={maxPrice}
            value={filters}
            onChange={setFilters}
          />
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-[2px] border border-border-primary bg-surface-primary p-10 text-center text-text-secondary">
          {results.length === 0
            ? "No flights found for that search. Try a different date or route."
            : "No flights match those filters. Try widening your search."}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 border-l border-t border-border-primary bg-surface-primary sm:grid-cols-2">
          {filtered.map((flight) => (
            <LiveFlightResultCard key={flight.booking_token} flight={flight} searchParams={searchParams} />
          ))}
        </div>
      )}
    </>
  );
}
