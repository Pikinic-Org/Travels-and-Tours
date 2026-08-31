"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/ui/container";
import { PathwayMark } from "@/components/ui/pathway-mark";
import { FlightSearchBar } from "@/components/sections/flight-search-bar";
import { Cta } from "@/components/sections/cta";
import { FlightOfferCard } from "@/components/cards/flight-offer-card";
import {
  FlightFilters,
  defaultFlightFilters,
  ALL_DESTINATIONS,
  type FlightFilterState,
} from "@/components/flights/flight-filters";
import { flightOffers } from "@/lib/data/flights";

export default function FlightsPage() {
  const [filters, setFilters] = useState<FlightFilterState>(defaultFlightFilters);

  const destinations = useMemo(
    () => Array.from(new Set(flightOffers.map((offer) => offer.to))),
    []
  );

  const results = useMemo(() => {
    const filtered = flightOffers.filter((offer) => {
      if (filters.destination !== ALL_DESTINATIONS && offer.to !== filters.destination) return false;
      if (filters.stops === "nonstop" && offer.stops !== 0) return false;
      if (filters.stops === "1-stop" && offer.stops !== 1) return false;
      return true;
    });
    return [...filtered].sort((a, b) =>
      filters.sort === "price-asc" ? a.price - b.price : b.price - a.price
    );
  }, [filters]);

  return (
    <>
      <section className="relative isolate overflow-hidden text-text-primary">
        <Container className="relative flex flex-col items-center pb-16 pt-16 text-center md:pb-20 md:pt-24">
          <PathwayMark className="float-slow pointer-events-none absolute left-1/2 top-0 z-0 h-[520px] w-[520px] -translate-x-1/2 text-green-600/[0.08]" />
          <h1 className="relative z-10 w-full max-w-none text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl md:text-6xl">
            Every Route, <span className="text-green-700">Priced Honestly.</span>
          </h1>
          <p className="relative z-10 mt-6 max-w-2xl text-base text-text-secondary sm:text-lg">
            Search fares across the routes Nigerians fly most, compare, and lock in your seat once
            the price is right.
          </p>
          <div className="relative z-10 mt-12 w-full max-w-5xl">
            <FlightSearchBar />
          </div>
        </Container>
      </section>

      <section className="pb-20 md:pb-28">
        <Container>
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
        </Container>
      </section>

      <Cta />
    </>
  );
}
