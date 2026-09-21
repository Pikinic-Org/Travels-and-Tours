"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Popover } from "@/components/ui/popover";
import { airportLabel, extractAirportCode, type Airport } from "@/lib/airport-label";
import { cn } from "@/lib/utils";

// Shown before the visitor types anything.
const POPULAR_AIRPORTS: Airport[] = [
  { code: "LOS", city: "Lagos", name: "Murtala Muhammed International Airport", country: "Nigeria" },
  { code: "ABV", city: "Abuja", name: "Nnamdi Azikiwe International Airport", country: "Nigeria" },
  { code: "PHC", city: "Port Harcourt", name: "Port Harcourt International Airport", country: "Nigeria" },
  { code: "LHR", city: "London", name: "London Heathrow Airport", country: "United Kingdom" },
  { code: "DXB", city: "Dubai", name: "Dubai International Airport", country: "United Arab Emirates" },
  { code: "ACC", city: "Accra", name: "Kotoka International Airport", country: "Ghana" },
  { code: "JNB", city: "Johannesburg", name: "O.R. Tambo International Airport", country: "South Africa" },
  { code: "JFK", city: "New York", name: "John F. Kennedy International Airport", country: "United States" },
];

const SEARCH_DELAY_MS = 150;

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

// Debounced lookup against /api/airports. Results are stored together with the
// query they answer, so "still loading" is just "results are for an older
// query" — no synchronous state updates inside the effect.
const useAirportSearch = (query: string) => {
  const [answer, setAnswer] = useState<{ query: string; airports: Airport[] }>({ query: "", airports: [] });
  const trimmed = query.trim();

  useEffect(() => {
    if (!trimmed) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/airports?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        if (response.ok) setAnswer({ query: trimmed, airports: await response.json() });
      } catch {
        // Aborted by a newer keystroke, or offline — keep whatever is showing.
      }
    }, SEARCH_DELAY_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmed]);

  return {
    airports: trimmed ? answer.airports : [],
    loading: trimmed !== "" && answer.query !== trimmed,
  };
};

const AirportPanel = ({
  label,
  selectedCode,
  onSelect,
  panelClassName,
}: {
  label: string;
  selectedCode: string;
  onSelect: (airport: Airport) => void;
  panelClassName?: string;
}) => {
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const { airports, loading } = useAirportSearch(query);

  const searching = query.trim() !== "";
  const options = searching ? airports : POPULAR_AIRPORTS;
  const optionId = (index: number) => `${listId}-${index}`;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    document.getElementById(`${listId}-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, listId]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, options.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const airport = options[activeIndex];
      if (airport) onSelect(airport);
    }
  };

  return (
    <div
      className={cn(
        "w-80 max-w-[calc(100vw-2rem)] rounded-[2px] border border-border-primary bg-surface-primary shadow-lg",
        panelClassName
      )}
    >
      <div className="border-b border-border-primary p-2">
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded
          aria-controls={listId}
          aria-activedescendant={options[activeIndex] ? optionId(activeIndex) : undefined}
          aria-label={`${label} — search by city, airport or code`}
          autoComplete="off"
          spellCheck={false}
          placeholder="City, airport or code"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={handleKeyDown}
          className="w-full rounded-sm border border-border-primary bg-surface-primary px-3 py-2 text-sm font-semibold text-text-primary placeholder:font-normal placeholder:text-text-tertiary focus:border-green-700 focus:outline-none"
        />
      </div>

      <ul id={listId} role="listbox" aria-label={label} className="max-h-72 overflow-auto p-1">
        {!searching && (
          <li
            role="presentation"
            className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-widest text-text-tertiary"
          >
            Popular
          </li>
        )}

        {options.map((airport, index) => (
          <li
            key={airport.code}
            id={optionId(index)}
            role="option"
            aria-selected={airport.code === selectedCode}
            onMouseEnter={() => setActiveIndex(index)}
            onClick={() => onSelect(airport)}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2",
              index === activeIndex && "bg-neutral-900/[0.06]"
            )}
          >
            <span
              className={cn(
                "w-9 shrink-0 text-sm font-bold tracking-wide",
                airport.code === selectedCode ? "text-green-700" : "text-text-primary"
              )}
            >
              {airport.code}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-text-primary">{airport.city}</span>
              <span className="block truncate text-xs text-text-tertiary">
                {airport.name} · {airport.country}
              </span>
            </span>
          </li>
        ))}

        {searching && options.length === 0 && (
          <li role="presentation" className="px-3 py-4 text-sm text-text-tertiary">
            {loading ? "Searching…" : `No airports found for “${query.trim()}”.`}
          </li>
        )}
      </ul>
    </div>
  );
};

// Type-to-search airport / city picker. The value is the "City (CODE)" label
// the search bar already stores; onChange hands back the new label.
export const AirportPicker = ({
  label,
  value,
  onChange,
  triggerClassName,
  panelClassName,
  wrapperClassName = "w-full",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  triggerClassName?: string;
  panelClassName?: string;
  wrapperClassName?: string;
}) => (
  <Popover
    className={wrapperClassName}
    mobileAlign="center"
    trigger={({ toggle, open }) => (
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn("flex w-full items-center gap-2 text-left", triggerClassName)}
      >
        <span className="sr-only">{label}</span>
        <span className="flex-1 truncate">{value}</span>
        <ChevronIcon
          className={cn(
            "h-4 w-4 shrink-0 text-text-tertiary transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
    )}
  >
    {({ close }) => (
      <AirportPanel
        label={label}
        selectedCode={extractAirportCode(value)}
        panelClassName={panelClassName}
        onSelect={(airport) => {
          onChange(airportLabel(airport));
          close();
        }}
      />
    )}
  </Popover>
);
