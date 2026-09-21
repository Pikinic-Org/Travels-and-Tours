"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ListSelect } from "@/components/ui/list-select";
import { PassengersSelect, type PassengerCounts } from "@/components/ui/passengers-select";
import { cn } from "@/lib/utils";

const cities = [
  "Lagos (LOS)",
  "Abuja (ABV)",
  "Port Harcourt (PHC)",
  "Dubai (DXB)",
  "London (LHR)",
  "Accra (ACC)",
  "Johannesburg (JNB)",
];

const cabinClasses = ["Economy", "Premium Economy", "Business", "First"];
const cabinClassValues: Record<string, string> = {
  Economy: "economy",
  "Premium Economy": "premium_economy",
  Business: "business",
  First: "first",
};

const tripTypes = ["Round trip", "One way", "Multi-city"] as const;
type TripType = (typeof tripTypes)[number];
const flightTypeValues: Record<TripType, string> = {
  "Round trip": "roundtrip",
  "One way": "oneway",
  "Multi-city": "multicity",
};

// City options are labeled "City (CODE)" for the picker; only the IATA
// code is meaningful to the search API.
function extractCode(cityLabel: string): string {
  return cityLabel.match(/\(([^)]+)\)/)?.[1] ?? cityLabel;
}

type Segment = { from: string; to: string; date: string };

const MAX_SEGMENTS = 5;

function CalendarIcon({ className }: { className?: string }) {
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
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </svg>
  );
}

function formatDateDisplay(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${month}/${day}/${year}`;
}

// Native <input type="date"> renders its text inconsistently across mobile
// browsers (iOS Safari shows nothing at all until tapped; forcing its text
// visible via CSS just doubles up with any custom overlay text, which reads
// as blurry — two slightly misaligned text layers on top of each other).
// So the native input is fully transparent here and only handles the tap
// interaction (opening the OS date picker); every visible pixel — the
// placeholder, the picked value, the calendar glyph — is our own text,
// exactly like the From/To/Economy fields.
function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative flex items-center justify-between gap-2">
      <span
        className={cn(
          "pointer-events-none text-base font-bold",
          value ? "text-text-primary" : "text-text-tertiary"
        )}
      >
        {value ? formatDateDisplay(value) : "mm/dd/yyyy"}
      </span>
      <CalendarIcon className="pointer-events-none h-4 w-4 shrink-0 text-text-tertiary" />
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </div>
  );
}

function SwapIcon({ className }: { className?: string }) {
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
      <path d="M7 8h13M17 4l3 4-3 4" />
      <path d="M17 16H4M7 20l-3-4 3-4" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
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
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function FlightSearchBar() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [tripType, setTripType] = useState<TripType>("Round trip");
  const [cabinClass, setCabinClass] = useState(cabinClasses[0]);
  const [passengers, setPassengers] = useState<PassengerCounts>({
    adults: 1,
    children: 0,
    infants: 0,
  });

  const [from, setFrom] = useState(cities[0]);
  const [to, setTo] = useState(cities[3]);
  const [depart, setDepart] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const [segments, setSegments] = useState<Segment[]>([
    { from: cities[0], to: cities[3], date: "" },
    { from: cities[3], to: cities[0], date: "" },
  ]);

  function swap() {
    setFrom(to);
    setTo(from);
  }

  function updateSegment(index: number, key: keyof Segment, value: string) {
    setSegments((prev) => prev.map((seg, i) => (i === index ? { ...seg, [key]: value } : seg)));
  }

  function addSegment() {
    setSegments((prev) => [...prev, { from: cities[0], to: cities[3], date: "" }]);
  }

  function removeSegment(index: number) {
    setSegments((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSearch() {
    const params = new URLSearchParams();
    params.set("flight_type", flightTypeValues[tripType]);
    params.set("class", cabinClassValues[cabinClass]);
    params.set("adults", String(passengers.adults));
    params.set("children", String(passengers.children));
    params.set("infants", String(passengers.infants));

    if (tripType === "Multi-city") {
      params.set(
        "routes",
        JSON.stringify(segments.map((s) => ({ from: extractCode(s.from), to: extractCode(s.to), date: s.date })))
      );
    } else {
      params.set("from", extractCode(from));
      params.set("to", extractCode(to));
      params.set("flights_departure_date", depart);
      if (tripType === "Round trip") {
        params.set("flights_return_date", returnDate);
      }
    }

    startTransition(() => {
      router.push(`/flights?${params.toString()}`);
    });
  }

  return (
    <>
    <div className="relative z-10 w-full rounded-[2px] border border-border-primary bg-surface-primary text-left shadow-xl shadow-neutral-900/5">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-primary px-5 py-4 sm:px-6">
        <div className="flex items-center gap-1 rounded-[2px] border border-border-primary p-1">
          {tripTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setTripType(type)}
              className={cn(
                "rounded-sm px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
                tripType === type
                  ? "bg-green-700 text-neutral-0"
                  : "text-text-secondary hover:bg-neutral-900/[0.06]"
              )}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ListSelect
            label="Cabin class"
            options={cabinClasses}
            value={cabinClass}
            onChange={setCabinClass}
            align="right"
            wrapperClassName="w-auto"
            panelClassName="w-48"
            triggerClassName="w-auto rounded-sm border border-border-primary px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-text-primary hover:bg-neutral-900/[0.06]"
          />
          <PassengersSelect value={passengers} onChange={setPassengers} />
        </div>
      </div>

      {tripType !== "Multi-city" ? (
        <div
          className={cn(
            "grid grid-cols-1 border-l border-t border-border-primary sm:grid-cols-2",
            tripType === "Round trip" ? "lg:grid-cols-5" : "lg:grid-cols-4"
          )}
        >
          <div className="relative flex flex-col justify-center gap-1 border-b border-r border-border-primary px-5 py-4 sm:px-6">
            <ListSelect
              label="From"
              options={cities}
              value={from}
              onChange={setFrom}
              panelClassName="w-64"
              triggerClassName="text-base font-bold text-text-primary"
            />
            <button
              type="button"
              onClick={swap}
              aria-label="Swap origin and destination"
              className="absolute -right-4 top-1/2 z-20 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border-primary bg-surface-primary text-text-secondary transition-colors hover:border-green-700 hover:text-green-700 sm:flex"
            >
              <SwapIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-col justify-center gap-1 border-b border-r border-border-primary px-5 py-4 sm:px-6">
            <ListSelect
              label="To"
              options={cities}
              value={to}
              onChange={setTo}
              panelClassName="w-64"
              triggerClassName="text-base font-bold text-text-primary"
            />
          </div>

          <div className="flex flex-col justify-center gap-1 border-b border-r border-border-primary px-5 py-4 sm:px-6">
            <DateField label="Depart" value={depart} onChange={setDepart} />
          </div>

          {tripType === "Round trip" && (
            <div className="flex flex-col justify-center gap-1 border-b border-r border-border-primary px-5 py-4 sm:px-6">
              <DateField label="Return" value={returnDate} onChange={setReturnDate} />
            </div>
          )}

          <div className="flex items-center border-b border-r border-border-primary p-3">
            <Button
              type="button"
              onClick={handleSearch}
              disabled={isPending}
              size="lg"
              variant="primary"
              className="w-full"
            >
              {isPending ? "Searching…" : "Search"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-5 sm:p-6">
          <div className="space-y-4">
            {segments.map((segment, index) => (
              <div
                key={index}
                className="flex flex-col rounded-[2px] border border-border-primary sm:flex-row"
              >
                <div className="border-b border-border-primary px-5 py-4 sm:flex-1 sm:border-b-0 sm:border-r">
                  <ListSelect
                    label={`Flight ${index + 1} from`}
                    options={cities}
                    value={segment.from}
                    onChange={(value) => updateSegment(index, "from", value)}
                    panelClassName="w-64"
                    triggerClassName="text-base font-bold text-text-primary"
                  />
                </div>
                <div className="border-b border-border-primary px-5 py-4 sm:flex-1 sm:border-b-0 sm:border-r">
                  <ListSelect
                    label={`Flight ${index + 1} to`}
                    options={cities}
                    value={segment.to}
                    onChange={(value) => updateSegment(index, "to", value)}
                    panelClassName="w-64"
                    triggerClassName="text-base font-bold text-text-primary"
                  />
                </div>
                <div className="flex flex-col justify-center border-b border-border-primary px-5 py-4 sm:flex-1 sm:border-b-0 sm:border-r">
                  <DateField
                    label={`Flight ${index + 1} date`}
                    value={segment.date}
                    onChange={(value) => updateSegment(index, "date", value)}
                  />
                </div>
                <div className="flex items-center justify-center px-3 py-2 sm:w-14 sm:shrink-0 sm:py-0">
                  {segments.length > 2 ? (
                    <button
                      type="button"
                      onClick={() => removeSegment(index)}
                      aria-label={`Remove flight ${index + 1}`}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-text-tertiary transition-colors hover:bg-neutral-900/[0.06] hover:text-text-primary"
                    >
                      <CloseIcon className="h-4 w-4" />
                    </button>
                  ) : (
                    <span className="hidden h-8 w-8 sm:block" aria-hidden />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            {segments.length < MAX_SEGMENTS ? (
              <button
                type="button"
                onClick={addSegment}
                className="text-sm font-semibold uppercase tracking-wide text-green-700 transition-colors hover:text-green-800"
              >
                + Add another flight
              </button>
            ) : (
              <span />
            )}
            <Button
              type="button"
              onClick={handleSearch}
              disabled={isPending}
              size="lg"
              variant="primary"
              className="w-full sm:w-auto"
            >
              {isPending ? "Searching…" : "Search"}
            </Button>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
