"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ListSelect } from "@/components/ui/list-select";
import { Modal } from "@/components/ui/modal";
import { PriceRangeSlider } from "@/components/ui/price-range-slider";
import { cn } from "@/lib/utils";

export type SortOrder = "price-asc" | "price-desc";
export type StopsFilter = "any" | "nonstop" | "1-stop";

export type LiveFlightFilterState = {
  stops: StopsFilter;
  airlines: string[]; // empty = all airlines
  priceRange: [number, number] | null; // null = full range of current results
  sort: SortOrder;
};

export const defaultLiveFlightFilters: LiveFlightFilterState = {
  stops: "any",
  airlines: [],
  priceRange: null,
  sort: "price-asc",
};

const sortLabels: Record<SortOrder, string> = {
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
};

const stopsOptions: { label: string; value: StopsFilter }[] = [
  { label: "Any", value: "any" },
  { label: "Nonstop", value: "nonstop" },
  { label: "1 Stop", value: "1-stop" },
];

function FilterIcon({ className }: { className?: string }) {
  return (
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
}

export function LiveFlightFilters({
  airlines,
  minPrice,
  maxPrice,
  value,
  onChange,
}: {
  airlines: string[];
  minPrice: number;
  maxPrice: number;
  value: LiveFlightFilterState;
  onChange: (value: LiveFlightFilterState) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);

  const isActive =
    value.stops !== defaultLiveFlightFilters.stops || value.airlines.length > 0 || value.priceRange !== null;

  function openModal() {
    setDraft(value);
    setOpen(true);
  }

  function apply() {
    onChange(draft);
    setOpen(false);
  }

  function clear() {
    setDraft(defaultLiveFlightFilters);
  }

  function toggleAirline(airline: string) {
    setDraft((d) => ({
      ...d,
      airlines: d.airlines.includes(airline)
        ? d.airlines.filter((a) => a !== airline)
        : [...d.airlines, airline],
    }));
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="relative flex items-center gap-2 rounded-[2px] border border-border-primary px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-text-primary transition-colors hover:bg-neutral-900/[0.06]"
      >
        <FilterIcon className="h-4 w-4" />
        Filters
        {isActive && (
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-green-600" aria-hidden />
        )}
      </button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <h2 className="text-lg font-bold uppercase tracking-tight text-text-primary">Filter Flights</h2>

        <div className="mt-6 space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">Stops</p>
            <div className="mt-2 flex gap-2">
              {stopsOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDraft((d) => ({ ...d, stops: opt.value }))}
                  className={cn(
                    "rounded-sm border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
                    draft.stops === opt.value
                      ? "border-green-700 bg-green-700 text-neutral-0"
                      : "border-border-primary text-text-secondary hover:bg-neutral-900/[0.06]"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {airlines.length > 1 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">Airline</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {airlines.map((airline) => (
                  <button
                    key={airline}
                    type="button"
                    onClick={() => toggleAirline(airline)}
                    className={cn(
                      "rounded-sm border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
                      draft.airlines.includes(airline)
                        ? "border-green-700 bg-green-700 text-neutral-0"
                        : "border-border-primary text-text-secondary hover:bg-neutral-900/[0.06]"
                    )}
                  >
                    {airline}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">Price Range</p>
            <div className="mt-2">
              <PriceRangeSlider
                min={minPrice}
                max={maxPrice}
                value={draft.priceRange ?? [minPrice, maxPrice]}
                onChange={(priceRange) => setDraft((d) => ({ ...d, priceRange }))}
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">Sort By</p>
            <ListSelect
              label="Sort by"
              options={Object.values(sortLabels)}
              value={sortLabels[draft.sort]}
              onChange={(label) => {
                const entry = (Object.entries(sortLabels) as [SortOrder, string][]).find(
                  ([, l]) => l === label
                );
                if (entry) setDraft((d) => ({ ...d, sort: entry[0] }));
              }}
              wrapperClassName="mt-2 w-full"
              triggerClassName="w-full rounded-sm border border-border-primary px-3 py-2 text-sm font-semibold text-text-primary"
              panelClassName="w-full"
            />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={clear}
            className="text-sm font-semibold uppercase tracking-wide text-text-secondary transition-colors hover:text-text-primary"
          >
            Clear all
          </button>
          <Button type="button" size="md" variant="primary" onClick={apply}>
            Apply Filters
          </Button>
        </div>
      </Modal>
    </>
  );
}
