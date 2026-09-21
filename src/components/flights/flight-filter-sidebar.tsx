"use client";

import type { ReactNode } from "react";
import { AirlineLogo } from "@/components/flights/airline-logo";
import { PriceRangeSlider } from "@/components/ui/price-range-slider";
import type { DepartureWindow } from "@/lib/flight-format";
import { cn, formatNaira } from "@/lib/utils";

export type SortOrder = "cheapest" | "fastest" | "earliest";

// Stops are bucketed as 0 (nonstop), 1, and 2 (meaning "2 or more").
export type StopsBucket = 0 | 1 | 2;

export type FlightFilterState = {
  stops: StopsBucket[]; // empty = any
  airlines: string[]; // empty = all airlines
  priceRange: [number, number] | null; // null = full range of the current results
  windows: DepartureWindow[]; // empty = any time of day
  checkedBagOnly: boolean;
  refundableOnly: boolean;
  sort: SortOrder;
};

export const defaultFlightFilters: FlightFilterState = {
  stops: [],
  airlines: [],
  priceRange: null,
  windows: [],
  checkedBagOnly: false,
  refundableOnly: false,
  sort: "cheapest",
};

export const activeFilterCount = (filters: FlightFilterState): number =>
  filters.stops.length +
  filters.airlines.length +
  filters.windows.length +
  (filters.priceRange ? 1 : 0) +
  (filters.checkedBagOnly ? 1 : 0) +
  (filters.refundableOnly ? 1 : 0);

export type AirlineFacet = { name: string; code: string; count: number; minPrice: number };

export type FlightFacets = {
  airlines: AirlineFacet[];
  stopCounts: Record<StopsBucket, number>;
  windowCounts: Record<DepartureWindow, number>;
  minPrice: number;
  maxPrice: number;
  bagKnown: boolean; // any result told us its baggage allowance
  refundKnown: boolean;
};

const stopLabels: Record<StopsBucket, string> = { 0: "Nonstop", 1: "1 stop", 2: "2+ stops" };

const windowLabels: Record<DepartureWindow, string> = {
  morning: "Morning · before 12:00",
  afternoon: "Afternoon · 12:00–18:00",
  evening: "Evening · after 18:00",
};

const toggle = <T,>(list: T[], item: T): T[] =>
  list.includes(item) ? list.filter((entry) => entry !== item) : [...list, item];

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="border-t border-border-primary py-5 first:border-t-0 first:pt-0">
    <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-tertiary">{title}</p>
    {children}
  </div>
);

const CheckRow = ({
  checked,
  onChange,
  disabled,
  children,
  detail,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  children: ReactNode;
  detail?: ReactNode;
}) => (
  <label
    className={cn(
      "flex cursor-pointer items-center gap-3 py-1.5 text-sm",
      disabled ? "cursor-not-allowed opacity-45" : "hover:text-text-primary"
    )}
  >
    <input
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={onChange}
      className="h-4 w-4 shrink-0 accent-green-700"
    />
    <span className="flex min-w-0 flex-1 items-center gap-2 font-medium text-text-secondary">{children}</span>
    {detail && <span className="shrink-0 text-xs text-text-tertiary">{detail}</span>}
  </label>
);

export const FlightFilterSidebar = ({
  facets,
  value,
  onChange,
  className,
}: {
  facets: FlightFacets;
  value: FlightFilterState;
  onChange: (value: FlightFilterState) => void;
  className?: string;
}) => {
  const active = activeFilterCount(value);
  const update = (patch: Partial<FlightFilterState>) => onChange({ ...value, ...patch });

  return (
    <aside
      aria-label="Filter flights"
      className={cn(
        "rounded-[2px] border border-border-primary bg-surface-primary p-5 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto",
        className
      )}
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-widest text-text-primary">Filters</h2>
        {active > 0 && (
          <button
            type="button"
            onClick={() => onChange({ ...defaultFlightFilters, sort: value.sort })}
            className="text-xs font-semibold uppercase tracking-widest text-green-700 transition-colors hover:text-green-800"
          >
            Clear all
          </button>
        )}
      </div>

      <Section title="Stops">
        {([0, 1, 2] as StopsBucket[]).map((bucket) => (
          <CheckRow
            key={bucket}
            checked={value.stops.includes(bucket)}
            disabled={facets.stopCounts[bucket] === 0 && !value.stops.includes(bucket)}
            onChange={() => update({ stops: toggle(value.stops, bucket) })}
            detail={facets.stopCounts[bucket]}
          >
            {stopLabels[bucket]}
          </CheckRow>
        ))}
      </Section>

      {facets.maxPrice > facets.minPrice && (
        <Section title="Price">
          <PriceRangeSlider
            min={facets.minPrice}
            max={facets.maxPrice}
            value={value.priceRange ?? [facets.minPrice, facets.maxPrice]}
            onChange={(priceRange) => update({ priceRange })}
          />
        </Section>
      )}

      <Section title="Departure time">
        {(Object.keys(windowLabels) as DepartureWindow[]).map((window) => (
          <CheckRow
            key={window}
            checked={value.windows.includes(window)}
            disabled={facets.windowCounts[window] === 0 && !value.windows.includes(window)}
            onChange={() => update({ windows: toggle(value.windows, window) })}
            detail={facets.windowCounts[window]}
          >
            {windowLabels[window]}
          </CheckRow>
        ))}
      </Section>

      {(facets.bagKnown || facets.refundKnown) && (
        <Section title="Baggage & fare">
          {facets.bagKnown && (
            <CheckRow checked={value.checkedBagOnly} onChange={() => update({ checkedBagOnly: !value.checkedBagOnly })}>
              Checked bag included
            </CheckRow>
          )}
          {facets.refundKnown && (
            <CheckRow checked={value.refundableOnly} onChange={() => update({ refundableOnly: !value.refundableOnly })}>
              Refundable
            </CheckRow>
          )}
        </Section>
      )}

      {facets.airlines.length > 1 && (
        <Section title="Airlines">
          {facets.airlines.map((airline) => (
            <CheckRow
              key={airline.name}
              checked={value.airlines.includes(airline.name)}
              onChange={() => update({ airlines: toggle(value.airlines, airline.name) })}
              detail={`from ${formatNaira(airline.minPrice)}`}
            >
              <AirlineLogo code={airline.code} name={airline.name} size={22} />
              <span className="truncate">{airline.name}</span>
            </CheckRow>
          ))}
        </Section>
      )}
    </aside>
  );
};
