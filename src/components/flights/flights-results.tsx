"use client";

import { useMemo, useState } from "react";
import { FlightOfferCard } from "@/components/cards/flight-offer-card";
import {
  FlightFilters,
  defaultFlightFilters,
  ALL_DESTINATIONS,
  type FlightFilterState,
} from "@/components/flights/flight-filters";
import type { FlightOffer } from "@/lib/data/flights";

export function FlightsResults({ offers }: { offers: FlightOffer[] }) {
  const [filters, setFilters] = useState<FlightFilterState>(defaultFlightFilters);

  const destinations = useMemo(() => Array.from(new Set(offers.map((offer) => offer.to))), [offers]);

  const results = useMemo(() => {
    const filtered = offers.filter((offer) => {
      if (filters.destination !== ALL_DESTINATIONS && offer.to !== filters.destination) return false;
      if (filters.stops === "nonstop" && offer.stops !== 0) return false;
      if (filters.stops === "1-stop" && offer.stops !== 1) return false;
      return true;
    });
    return [...filtered].sort((a, b) =>
      filters.sort === "price-asc" ? a.price - b.price : b.price - a.price
    );
  }, [filters, offers]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-primary pb-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-text-tertiary">
          {results.length} {results.length === 1 ? "Flight" : "Flights"} Found
        </p>
        <FlightFilters destinations={destinations} value={filters} onChange={setFilters} />
      </div>

      {results.length === 0 ? (
        <div className="mt-10 rounded-[2px] border border-border-primary bg-surface-primary p-10 text-center text-text-secondary">
          No flights match those filters. Try widening your search.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 border-l border-t border-border-primary bg-surface-primary sm:grid-cols-2">
          {results.map((offer) => (
            <FlightOfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}
    </>
  );
}
