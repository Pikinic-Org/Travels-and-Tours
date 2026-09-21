"use client";

import { AirlineLogo } from "@/components/flights/airline-logo";
import type { AirlineFacet, StopsBucket } from "@/components/flights/flight-filter-sidebar";
import { cn, formatNaira } from "@/lib/utils";

// Cheapest fare for each airline at each number of stops, e.g.
// { "Turkish Airlines": { 1: 2903394, 2: 3200000 } }.
export type PriceGridCells = Record<string, Partial<Record<StopsBucket, number>>>;

const rowLabels: Record<StopsBucket, string> = { 0: "Direct", 1: "1 Stop", 2: "2+ Stops" };
const buckets: StopsBucket[] = [0, 1, 2];

// A quick overview above the list: which airline is cheapest, and what a
// nonstop costs compared with a connection. Picking a price filters the list
// below to that airline and number of stops; picking it again clears it.
export const FlightPriceGrid = ({
  airlines,
  cells,
  activeAirlines,
  activeStops,
  onPick,
}: {
  airlines: AirlineFacet[];
  cells: PriceGridCells;
  activeAirlines: string[];
  activeStops: StopsBucket[];
  onPick: (airline: string, bucket: StopsBucket) => void;
}) => {
  const visibleBuckets = buckets.filter((bucket) => airlines.some((airline) => cells[airline.name]?.[bucket] !== undefined));

  const allPrices = airlines.flatMap((airline) =>
    buckets.map((bucket) => cells[airline.name]?.[bucket]).filter((price): price is number => price !== undefined)
  );
  const cheapest = allPrices.length > 0 ? Math.min(...allPrices) : null;

  const isActive = (airline: string, bucket: StopsBucket) =>
    activeAirlines.length === 1 &&
    activeAirlines[0] === airline &&
    activeStops.length === 1 &&
    activeStops[0] === bucket;

  return (
    <section aria-label="Cheapest fares by airline and stops" className="overflow-x-auto border border-border-primary bg-surface-primary">
      <table className="w-full min-w-max border-collapse text-sm">
        <thead>
          <tr>
            <th
              scope="col"
              className="sticky left-0 z-10 bg-surface-primary px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-text-tertiary"
            >
              Cheapest fares
            </th>
            {airlines.map((airline) => (
              <th key={airline.name} scope="col" className="px-4 py-3 text-left font-normal">
                <span className="flex items-center gap-2">
                  <AirlineLogo code={airline.code} name={airline.name} size={24} />
                  <span className="max-w-32 truncate text-xs font-semibold text-text-primary">{airline.name}</span>
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleBuckets.map((bucket) => (
            <tr key={bucket} className="border-t border-border-primary">
              <th
                scope="row"
                className="sticky left-0 z-10 bg-surface-primary px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-text-secondary"
              >
                {rowLabels[bucket]}
              </th>
              {airlines.map((airline) => {
                const price = cells[airline.name]?.[bucket];

                if (price === undefined) {
                  return (
                    <td key={airline.name} className="px-4 py-3 text-text-tertiary">
                      <span aria-label="No flights">—</span>
                    </td>
                  );
                }

                const active = isActive(airline.name, bucket);
                return (
                  <td key={airline.name} className="p-0">
                    <button
                      type="button"
                      onClick={() => onPick(airline.name, bucket)}
                      aria-pressed={active}
                      title={active ? "Show all flights" : `Show ${airline.name}, ${rowLabels[bucket].toLowerCase()}`}
                      className={cn(
                        "w-full px-4 py-3 text-left font-bold transition-colors",
                        active ? "bg-green-100 text-green-800" : "hover:bg-neutral-900/[0.04]",
                        !active && price === cheapest ? "text-green-700" : !active && "text-text-primary"
                      )}
                    >
                      {formatNaira(price)}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};
