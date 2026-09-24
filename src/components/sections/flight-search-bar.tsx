"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AirportPicker } from "@/components/ui/airport-picker";
import { Button } from "@/components/ui/button";
import { DatePickerField, DateRangePickerField } from "@/components/ui/date-picker";
import { ListSelect } from "@/components/ui/list-select";
import { PassengersSelect, type PassengerCounts } from "@/components/ui/passengers-select";
import { PlaneIcon, SearchGlassIcon, SeatIcon, TripTypeIcon, UsersIcon } from "@/components/ui/search-icons";
import { extractAirportCode } from "@/lib/airport-label";
import { cn } from "@/lib/utils";
import type { FlightSearchParams } from "@/types";

// Starting route before the visitor picks anything — any airport in the world
// can be searched through the picker.
const DEFAULT_FROM = "Lagos (LOS)";
const DEFAULT_TO = "Dubai (DXB)";

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

type Segment = { from: string; to: string; date: string };

const MAX_SEGMENTS = 5;

// Small caption shown above the trip type, class and passengers controls.
const controlLabelClass =
  "mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold text-text-tertiary";

// Icon before the text in the From / To fields: a plane taking off, and one
// pointing down for landing.
const takeoffIcon = <PlaneIcon className="h-4 w-4" />;
const landingIcon = <PlaneIcon className="h-4 w-4 rotate-90" />;

const tripTypeFromFlightType = (flightType: string): TripType =>
  tripTypes.find((type) => flightTypeValues[type] === flightType) ?? "Round trip";

const cabinClassFromValue = (value: string | undefined): string =>
  cabinClasses.find((label) => cabinClassValues[label] === value) ?? cabinClasses[0];

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

// `initialSearch` is the search already in the URL (on /flights), so the bar
// shows what was actually searched instead of resetting to its defaults.
// `airportLabels` maps the codes in that search to "City (CODE)" labels,
// resolved on the server so the airport dataset never ships to the browser.
export function FlightSearchBar({
  initialSearch,
  airportLabels = {},
}: {
  initialSearch?: FlightSearchParams | null;
  airportLabels?: Record<string, string>;
}) {
  const labelFor = (code: string) => airportLabels[code] ?? code;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [tripType, setTripType] = useState<TripType>(
    initialSearch ? tripTypeFromFlightType(initialSearch.flight_type) : "Round trip"
  );
  const [cabinClass, setCabinClass] = useState(cabinClassFromValue(initialSearch?.class));
  const [passengers, setPassengers] = useState<PassengerCounts>({
    adults: initialSearch?.adults ?? 1,
    children: initialSearch?.children ?? 0,
    infants: initialSearch?.infants ?? 0,
  });

  const singleTrip = initialSearch && initialSearch.flight_type !== "multicity" ? initialSearch : null;
  const [from, setFrom] = useState(singleTrip ? labelFor(singleTrip.from) : DEFAULT_FROM);
  const [to, setTo] = useState(singleTrip ? labelFor(singleTrip.to) : DEFAULT_TO);
  const [depart, setDepart] = useState(singleTrip?.flights_departure_date ?? "");
  const [returnDate, setReturnDate] = useState(
    singleTrip?.flight_type === "roundtrip" ? singleTrip.flights_return_date : ""
  );

  const [segments, setSegments] = useState<Segment[]>(
    initialSearch?.flight_type === "multicity"
      ? initialSearch.routes.map((route) => ({
          from: labelFor(route.from),
          to: labelFor(route.to),
          date: route.date,
        }))
      : [
          { from: DEFAULT_FROM, to: DEFAULT_TO, date: "" },
          { from: DEFAULT_TO, to: DEFAULT_FROM, date: "" },
        ]
  );

  function swap() {
    setFrom(to);
    setTo(from);
  }

  function updateSegment(index: number, key: keyof Segment, value: string) {
    setSegments((prev) => prev.map((seg, i) => (i === index ? { ...seg, [key]: value } : seg)));
  }

  function addSegment() {
    // A new leg naturally starts where the previous one ended.
    setSegments((prev) => [...prev, { from: prev[prev.length - 1]?.to ?? DEFAULT_FROM, to: DEFAULT_TO, date: "" }]);
  }

  function removeSegment(index: number) {
    setSegments((prev) => prev.filter((_, i) => i !== index));
  }

  // Clearing an airport field leaves it empty, so both ends must be chosen
  // again before a search makes sense.
  const airportsChosen =
    tripType === "Multi-city"
      ? segments.every((s) => extractAirportCode(s.from) !== "" && extractAirportCode(s.to) !== "")
      : extractAirportCode(from) !== "" && extractAirportCode(to) !== "";

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
        JSON.stringify(
          segments.map((s) => ({ from: extractAirportCode(s.from), to: extractAirportCode(s.to), date: s.date }))
        )
      );
    } else {
      params.set("from", extractAirportCode(from));
      params.set("to", extractAirportCode(to));
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
    <div className="relative z-10 w-full rounded-lg border border-border-primary bg-surface-primary text-left shadow-xl shadow-neutral-900/5">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border-primary px-5 py-4 sm:px-6">
        <div>
          <span className={controlLabelClass}>
            <TripTypeIcon className="h-3.5 w-3.5" />
            Flight type
          </span>
          <div className="flex items-center gap-1 rounded-lg border border-border-primary p-1">
            {tripTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setTripType(type)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-semibold transition-colors",
                  tripType === type
                    ? "bg-green-700 text-neutral-0"
                    : "text-text-secondary hover:bg-neutral-900/[0.06]"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div>
            <span className={controlLabelClass}>
              <SeatIcon className="h-3.5 w-3.5" />
              Class
            </span>
            <ListSelect
              label="Cabin class"
              options={cabinClasses}
              value={cabinClass}
              onChange={setCabinClass}
              align="right"
              wrapperClassName="w-auto"
              panelClassName="w-48"
              triggerClassName="w-auto rounded-md border border-border-primary px-3 py-1.5 text-sm font-semibold text-text-primary hover:bg-neutral-900/[0.06]"
            />
          </div>
          <div>
            <span className={controlLabelClass}>
              <UsersIcon className="h-3.5 w-3.5" />
              Passengers
            </span>
            <PassengersSelect value={passengers} onChange={setPassengers} />
          </div>
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
            <AirportPicker
              label="From"
              icon={takeoffIcon}
              value={from}
              onChange={setFrom}
              inputClassName="text-base font-bold text-text-primary"
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
            <AirportPicker
              label="To"
              icon={landingIcon}
              value={to}
              onChange={setTo}
              inputClassName="text-base font-bold text-text-primary"
            />
          </div>

          {tripType === "Round trip" ? (
            <DateRangePickerField
              depart={depart}
              returnDate={returnDate}
              onChange={(range) => {
                setDepart(range.depart);
                setReturnDate(range.return);
              }}
            />
          ) : (
            <div className="flex flex-col justify-center gap-1 border-b border-r border-border-primary px-5 py-4 sm:px-6">
              <DatePickerField label="Depart" value={depart} onChange={setDepart} />
            </div>
          )}

          <div
            className={cn(
              "flex items-center border-b border-r border-border-primary p-3",
              tripType === "Round trip" && "sm:col-span-2 lg:col-span-1"
            )}
          >
            <Button
              type="button"
              onClick={handleSearch}
              disabled={isPending || !airportsChosen}
              size="lg"
              variant="primary"
              icon={<SearchGlassIcon className="h-5 w-5" />}
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
                className="flex flex-col rounded-lg border border-border-primary sm:flex-row"
              >
                <div className="border-b border-border-primary px-5 py-4 sm:flex-1 sm:border-b-0 sm:border-r">
                  <AirportPicker
                    label={`Flight ${index + 1} from`}
                    icon={takeoffIcon}
                    value={segment.from}
                    onChange={(value) => updateSegment(index, "from", value)}
                    inputClassName="text-base font-bold text-text-primary"
                  />
                </div>
                <div className="border-b border-border-primary px-5 py-4 sm:flex-1 sm:border-b-0 sm:border-r">
                  <AirportPicker
                    label={`Flight ${index + 1} to`}
                    icon={landingIcon}
                    value={segment.to}
                    onChange={(value) => updateSegment(index, "to", value)}
                    inputClassName="text-base font-bold text-text-primary"
                  />
                </div>
                <div className="flex flex-col justify-center border-b border-border-primary px-5 py-4 sm:flex-1 sm:border-b-0 sm:border-r">
                  <DatePickerField
                    label={`Flight ${index + 1} date`}
                    value={segment.date}
                    min={index > 0 ? segments[index - 1].date : undefined}
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
                className="text-sm font-semibold text-green-700 transition-colors hover:text-green-800"
              >
                + Add another flight
              </button>
            ) : (
              <span />
            )}
            <Button
              type="button"
              onClick={handleSearch}
              disabled={isPending || !airportsChosen}
              size="lg"
              variant="primary"
              icon={<SearchGlassIcon className="h-5 w-5" />}
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
