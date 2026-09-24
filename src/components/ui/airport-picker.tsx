"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { airportLabel, extractAirportCode, type Airport } from "@/lib/airport-label";
import { cn } from "@/lib/utils";

// Shown when the field is focused but nothing has been typed yet.
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

// A plain text field: click it, type a city, airport or code, and matching
// airports appear underneath. The value is the "City (CODE)" label the search
// bar already stores; onChange hands back the newly chosen label.
export const AirportPicker = ({
  label,
  value,
  onChange,
  icon,
  inputClassName,
  panelClassName,
  wrapperClassName = "w-full",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon?: ReactNode; // shown inside the field, before the text
  inputClassName?: string;
  panelClassName?: string;
  wrapperClassName?: string;
}) => {
  const listId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [text, setText] = useState(value);
  const [typing, setTyping] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Until the visitor starts typing, the field shows the chosen airport and the
  // list shows popular ones; typing switches to live search.
  const query = typing ? text : "";
  const searching = query.trim() !== "";
  const { airports, loading } = useAirportSearch(query);
  const options = searching ? airports : POPULAR_AIRPORTS;
  const selectedCode = extractAirportCode(value);
  const optionId = (index: number) => `${listId}-${index}`;

  useEffect(() => {
    if (!open) return;
    document.getElementById(`${listId}-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex, listId]);

  const close = () => {
    setOpen(false);
    setTyping(false);
  };

  // Empties the field and leaves it ready to type into. Focus is (re)applied
  // on the next frame so onFocus sees the already-cleared value.
  const clear = () => {
    onChange("");
    setText("");
    setTyping(true);
    setActiveIndex(0);
    setOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const showClear = open ? text !== "" : value !== "";

  const choose = (airport: Airport) => {
    onChange(airportLabel(airport));
    close();
    inputRef.current?.blur();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => Math.min(index + 1, options.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      // Never submit a surrounding form / trigger a search from here.
      event.preventDefault();
      const airport = options[activeIndex];
      if (open && airport) choose(airport);
    } else if (event.key === "Escape") {
      close();
      inputRef.current?.blur();
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={cn("relative", wrapperClassName)}
      onBlur={(event) => {
        // Focus moving to something outside this field closes it and puts
        // back the last chosen airport.
        if (!wrapperRef.current?.contains(event.relatedTarget as Node | null)) close();
      }}
    >
      {icon && (
        <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-text-tertiary">
          {icon}
        </span>
      )}
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        aria-label={`${label} — type a city, airport or code`}
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && options[activeIndex] ? optionId(activeIndex) : undefined}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        placeholder="City or airport"
        value={open ? text : value}
        onFocus={(event) => {
          setText(value);
          setTyping(false);
          setActiveIndex(0);
          setOpen(true);
          // Select everything so typing replaces the current airport.
          event.currentTarget.select();
        }}
        onChange={(event) => {
          setText(event.target.value);
          setTyping(true);
          setActiveIndex(0);
          setOpen(true);
        }}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full truncate bg-transparent p-0 text-left outline-none placeholder:font-normal placeholder:text-text-tertiary",
          icon && "pl-7",
          "pr-9",
          inputClassName
        )}
      />

      <div className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center gap-2">
        {open && loading && (
          <span
            aria-hidden
            className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-border-primary border-t-green-700"
          />
        )}
        {showClear && (
          <button
            type="button"
            aria-label={`Clear ${label}`}
            // Keep the input focused (and the list open) while clearing.
            onMouseDown={(event) => event.preventDefault()}
            onClick={clear}
            className="flex h-4 w-4 items-center justify-center rounded-full text-text-tertiary transition-colors hover:text-text-primary"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              className="h-3.5 w-3.5"
              aria-hidden
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}
      </div>

      {open && (
        <div
          // Keep focus in the input while the list is clicked or scrolled.
          onMouseDown={(event) => event.preventDefault()}
          className={cn(
            "absolute left-0 top-full z-30 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-lg border border-border-primary bg-surface-primary shadow-lg",
            panelClassName
          )}
        >
          <ul id={listId} role="listbox" aria-label={label} className="max-h-72 overflow-auto p-1">
            {!searching && (
              <li
                role="presentation"
                className="px-3 pb-1 pt-2 text-[10px] font-semibold text-text-tertiary"
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
                onClick={() => choose(airport)}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-md px-3 py-2",
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
                <span className="min-w-0 flex-1 text-left">
                  <span className="block truncate text-sm font-semibold text-text-primary">{airport.city}</span>
                  <span className="block truncate text-xs text-text-tertiary">
                    {airport.name} · {airport.country}
                  </span>
                </span>
              </li>
            ))}

            {searching && options.length === 0 && (
              <li role="presentation" className="px-3 py-4 text-left text-sm text-text-tertiary">
                {loading ? "Searching…" : `No airports found for “${query.trim()}”.`}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
