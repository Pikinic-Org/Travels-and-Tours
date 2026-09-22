"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FlightPriceGrid, type PriceGridCells } from "@/components/flights/flight-price-grid";
import { FlightResultCard } from "@/components/flights/flight-result-card";
import {
  FlightFilterSidebar,
  activeFilterCount,
  defaultFlightFilters,
  type AirlineFacet,
  type FlightFacets,
  type FlightFilterState,
  type SortOrder,
  type StopsBucket,
} from "@/components/flights/flight-filter-sidebar";
import {
  departureWindow,
  earliestDepartureMinutes,
  flightAirlines,
  flightDurationMinutes,
  formatDuration,
  hasCheckedBag,
  isRefundable,
  matchesFlightNumber,
  maxStops,
} from "@/lib/flight-format";
import { useSelectedFlightStore } from "@/lib/selected-flight-store";
import type { FlightSearchParams, FlightSearchResult } from "@/types";
import { cn, formatNaira } from "@/lib/utils";

// The route/date/passenger context search was run with — not part of a
// FlightSearchResult itself, needed again at checkout to re-price correctly.
const routeContext = (searchParams: FlightSearchParams) => {
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
};

const stopBucket = (flight: FlightSearchResult): StopsBucket => Math.min(maxStops(flight), 2) as StopsBucket;

const buildFacets = (results: FlightSearchResult[]): FlightFacets => {
  const airlines = new Map<string, AirlineFacet>();
  const stopCounts: Record<StopsBucket, number> = { 0: 0, 1: 0, 2: 0 };
  const windowCounts = { early_morning: 0, morning: 0, afternoon: 0, evening: 0 };

  for (const flight of results) {
    stopCounts[stopBucket(flight)]++;

    const window = departureWindow(flight.segments[0]);
    if (window) windowCounts[window]++;

    const segments = flight.segments.flat();
    for (const name of flightAirlines(flight)) {
      const existing = airlines.get(name);
      if (existing) {
        existing.count++;
        existing.minPrice = Math.min(existing.minPrice, flight.price);
      } else {
        airlines.set(name, {
          name,
          code: segments.find((segment) => segment.airline === name)?.img ?? "",
          count: 1,
          minPrice: flight.price,
        });
      }
    }
  }

  const prices = results.map((flight) => flight.price);
  return {
    airlines: [...airlines.values()].sort((a, b) => a.minPrice - b.minPrice),
    stopCounts,
    windowCounts,
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
    bagKnown: results.some((flight) => hasCheckedBag(flight) !== null),
    refundKnown: results.some((flight) => isRefundable(flight) !== null),
  };
};

// Cheapest fare for every airline at every number of stops — the numbers in the
// grid above the list. A flight with several airlines counts under each.
const buildPriceCells = (results: FlightSearchResult[]): PriceGridCells => {
  const cells: PriceGridCells = {};

  for (const flight of results) {
    const bucket = stopBucket(flight);
    for (const airline of flightAirlines(flight)) {
      const row = (cells[airline] ??= {});
      row[bucket] = Math.min(row[bucket] ?? Number.POSITIVE_INFINITY, flight.price);
    }
  }

  return cells;
};

const matchesFilters = (
  flight: FlightSearchResult,
  filters: FlightFilterState,
  [priceLow, priceHigh]: [number, number]
): boolean => {
  if (filters.stops.length > 0 && !filters.stops.includes(stopBucket(flight))) return false;
  if (filters.airlines.length > 0 && !flightAirlines(flight).some((name) => filters.airlines.includes(name))) {
    return false;
  }
  if (flight.price < priceLow || flight.price > priceHigh) return false;
  if (!matchesFlightNumber(flight, filters.flightNumber)) return false;

  if (filters.windows.length > 0) {
    const window = departureWindow(flight.segments[0]);
    if (!window || !filters.windows.includes(window)) return false;
  }
  if (filters.checkedBagOnly && hasCheckedBag(flight) !== true) return false;
  if (filters.refundableOnly && isRefundable(flight) !== true) return false;
  return true;
};

const sorters: Record<SortOrder, (a: FlightSearchResult, b: FlightSearchResult) => number> = {
  cheapest: (a, b) => a.price - b.price,
  fastest: (a, b) => flightDurationMinutes(a) - flightDurationMinutes(b) || a.price - b.price,
  earliest: (a, b) => earliestDepartureMinutes(a) - earliestDepartureMinutes(b) || a.price - b.price,
};

const FilterIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 6h16M7 12h10M10 18h4" />
  </svg>
);

export const LiveFlightResults = ({
  results,
  searchParams,
}: {
  results: FlightSearchResult[];
  searchParams: FlightSearchParams;
}) => {
  const router = useRouter();
  const select = useSelectedFlightStore((state) => state.select);
  const [filters, setFilters] = useState<FlightFilterState>(defaultFlightFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const facets = useMemo(() => (results.length > 0 ? buildFacets(results) : null), [results]);
  // Built from every result, not the filtered list, so the grid stays put
  // while you narrow things down with it.
  const priceCells = useMemo(() => buildPriceCells(results), [results]);

  const filtered = useMemo(() => {
    if (!facets) return [];
    const range = filters.priceRange ?? [facets.minPrice, facets.maxPrice];
    return results.filter((flight) => matchesFilters(flight, filters, range)).sort(sorters[filters.sort]);
  }, [results, facets, filters]);

  // Headline value shown under each sort tab, computed from what's currently
  // visible so it always matches the list below.
  const sortTabs = useMemo(() => {
    const cheapest = filtered.length ? Math.min(...filtered.map((flight) => flight.price)) : null;
    const fastestMinutes = filtered.length ? Math.min(...filtered.map(flightDurationMinutes)) : null;
    const earliestMinutes = filtered.length ? Math.min(...filtered.map(earliestDepartureMinutes)) : null;
    const earliestFlight = filtered.find((flight) => earliestDepartureMinutes(flight) === earliestMinutes);

    return [
      { key: "cheapest" as const, label: "Cheapest", detail: cheapest !== null ? formatNaira(cheapest) : "—" },
      {
        key: "fastest" as const,
        label: "Fastest",
        detail:
          fastestMinutes !== null && fastestMinutes !== Number.MAX_SAFE_INTEGER ? formatDuration(fastestMinutes) : "—",
      },
      {
        key: "earliest" as const,
        label: "Earliest",
        detail: earliestFlight?.segments[0]?.[0]?.departure_time.toUpperCase() ?? "—",
      },
    ];
  }, [filtered]);

  if (!facets) {
    return (
      <div className="rounded-[2px] border border-border-primary bg-surface-primary p-10 text-center text-text-secondary">
        No flights found for that search. Try a different date or route.
      </div>
    );
  }

  const activeCount = activeFilterCount(filters);

  const handleSelect = (flight: FlightSearchResult) => {
    select({ flight, ...routeContext(searchParams) });
    router.push("/flights/checkout");
  };

  // Picking a price narrows the list to that airline and number of stops;
  // picking the same one again clears both.
  const handlePricePick = (airline: string, bucket: StopsBucket) =>
    setFilters((current) => {
      const alreadyPicked =
        current.airlines.length === 1 &&
        current.airlines[0] === airline &&
        current.stops.length === 1 &&
        current.stops[0] === bucket;
      return alreadyPicked
        ? { ...current, airlines: [], stops: [] }
        : { ...current, airlines: [airline], stops: [bucket] };
    });

  // With a single airline there's nothing to compare.
  const showPriceGrid = facets.airlines.length > 1;

  return (
    <>
      {showPriceGrid && (
        // Same width as the search form above (max-w-5xl) rather than the
        // full results column — also means it overflows (and shows the
        // swipe arrows) at a realistic airline count, instead of a
        // full-bleed box wide enough to fit every column without scrolling.
        <div className="mb-8 max-w-5xl mx-auto">
          <FlightPriceGrid
            airlines={facets.airlines}
            cells={priceCells}
            activeAirlines={filters.airlines}
            activeStops={filters.stops}
            onPick={handlePricePick}
          />
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:items-start">
        <FlightFilterSidebar
          facets={facets}
          value={filters}
          onChange={setFilters}
          className={cn(filtersOpen ? "block" : "hidden", "lg:block")}
        />

        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold uppercase tracking-widest text-text-tertiary">
              {filtered.length} {filtered.length === 1 ? "Flight" : "Flights"} Found
            </p>
            <button
              type="button"
              onClick={() => setFiltersOpen((open) => !open)}
              aria-expanded={filtersOpen}
              className="relative flex items-center gap-2 rounded-[2px] border border-border-primary px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-text-primary transition-colors hover:bg-neutral-900/[0.06] lg:hidden"
            >
              <FilterIcon className="h-4 w-4" />
              {filtersOpen ? "Hide filters" : "Filters"}
              {activeCount > 0 && (
                <span className="rounded-full bg-green-700 px-1.5 text-[10px] font-bold text-neutral-0">{activeCount}</span>
              )}
            </button>
          </div>

          <div role="tablist" aria-label="Sort flights" className="mb-5 grid grid-cols-3 border border-border-primary">
            {sortTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={filters.sort === tab.key}
                onClick={() => setFilters((current) => ({ ...current, sort: tab.key }))}
                className={cn(
                  "border-b-2 px-3 py-3 text-left transition-colors sm:px-5",
                  "border-r border-r-border-primary last:border-r-0",
                  filters.sort === tab.key
                    ? "border-b-green-700 bg-green-50"
                    : "border-b-transparent hover:bg-neutral-900/[0.03]"
                )}
              >
                <span className="block text-xs font-semibold uppercase tracking-widest text-text-tertiary">
                  {tab.label}
                </span>
                <span
                  className={cn(
                    "mt-0.5 block truncate text-sm font-bold sm:text-base",
                    filters.sort === tab.key ? "text-green-700" : "text-text-primary"
                  )}
                >
                  {tab.detail}
                </span>
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-[2px] border border-border-primary bg-surface-primary p-10 text-center text-text-secondary">
              No flights match those filters. Try widening your search.
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((flight) => (
                <FlightResultCard
                  key={flight.booking_token}
                  flight={flight}
                  tripType={searchParams.flight_type}
                  onSelect={() => handleSelect(flight)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
