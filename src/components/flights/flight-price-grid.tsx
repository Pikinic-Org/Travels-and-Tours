"use client";

import { useRef, useState, type UIEvent } from "react";
import { AirlineLogo } from "@/components/flights/airline-logo";
import type { AirlineFacet, StopsBucket } from "@/components/flights/flight-filter-sidebar";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/search-icons";
import { cn, formatNaira } from "@/lib/utils";

// Cheapest fare for each airline at each number of stops, e.g.
// { "Turkish Airlines": { 1: 2903394, 2: 3200000 } }.
export type PriceGridCells = Record<string, Partial<Record<StopsBucket, number>>>;

const rowLabels: Record<StopsBucket, string> = { 0: "Direct", 1: "1 Stop", 2: "2+ Stops" };
const buckets: StopsBucket[] = [0, 1, 2];

type ScrollState = { atStart: boolean; atEnd: boolean; canScroll: boolean; thumbLeft: number; thumbWidth: number };

const fullScrollState: ScrollState = { atStart: true, atEnd: true, canScroll: false, thumbLeft: 0, thumbWidth: 100 };

const readScrollState = (el: HTMLElement): ScrollState => {
  const { scrollLeft, scrollWidth, clientWidth } = el;
  const maxScroll = scrollWidth - clientWidth;
  if (maxScroll <= 1) return fullScrollState;

  return {
    atStart: scrollLeft <= 1,
    atEnd: scrollLeft >= maxScroll - 1,
    canScroll: true,
    thumbWidth: (clientWidth / scrollWidth) * 100,
    thumbLeft: (scrollLeft / scrollWidth) * 100,
  };
};

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
  const scrollRef = useRef<HTMLElement>(null);
  const [scroll, setScroll] = useState<ScrollState>(fullScrollState);

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

  // Measures overflow right after the table paints with its real column
  // widths — a ref callback fires once the node is attached/sized, which a
  // plain useEffect on mount can beat if fonts/logos are still loading.
  const measure = (el: HTMLElement | null) => {
    scrollRef.current = el;
    if (el) setScroll(readScrollState(el));
  };

  const onScroll = (event: UIEvent<HTMLElement>) => setScroll(readScrollState(event.currentTarget));

  const scrollByPage = (direction: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <div className="border border-border-primary bg-surface-primary">
      <div className="flex items-center justify-between gap-3 border-b border-border-primary px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-text-tertiary">
          Cheapest fares by airline &amp; stops
        </p>
        {scroll.canScroll && (
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => scrollByPage(-1)}
              disabled={scroll.atStart}
              aria-label="Scroll fares left"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-border-primary text-text-secondary transition-colors hover:bg-neutral-900/[0.06] disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByPage(1)}
              disabled={scroll.atEnd}
              aria-label="Scroll fares right"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-border-primary text-text-secondary transition-colors hover:bg-neutral-900/[0.06] disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <section
        ref={measure}
        onScroll={onScroll}
        aria-label="Cheapest fares by airline and stops"
        className="no-scrollbar overflow-x-auto"
      >
        <table className="w-full min-w-max border-collapse text-sm">
          <thead>
            <tr>
              <th scope="col" className="sticky left-0 z-10 w-0 bg-surface-primary px-4 py-3" aria-hidden />
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

      {/* Real scroll position, not decoration — width/position mirror exactly
          how much of the table is visible and where, like a slim scrollbar. */}
      {scroll.canScroll && (
        <div className="relative mx-4 mb-3 h-1 overflow-hidden rounded-full bg-neutral-900/[0.08]" aria-hidden>
          <div
            className="absolute inset-y-0 rounded-full bg-green-700 transition-[left,width] duration-150"
            style={{ left: `${scroll.thumbLeft}%`, width: `${scroll.thumbWidth}%` }}
          />
        </div>
      )}
    </div>
  );
};
