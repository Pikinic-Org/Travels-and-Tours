import type { FlightSearchResult, FlightSegment } from "@/types";

export type FlightLeg = FlightSegment[];
export type DepartureWindow = "early_morning" | "morning" | "afternoon" | "evening";

// "06:45 am" / "1:35 PM" / "18:20" → minutes after midnight.
export const parseClock = (time: string | undefined): number | null => {
  const match = time?.trim().match(/^(\d{1,2}):(\d{2})\s*(am|pm)?$/i);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3]?.toLowerCase();
  if (meridiem === "pm" && hours < 12) hours += 12;
  if (meridiem === "am" && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

// "10-11-2026" (dd-mm-yyyy) → whole days since the epoch, timezone-free.
const parseDay = (date: string | undefined): number | null => {
  const match = date?.trim().match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (!match) return null;
  return Math.floor(Date.UTC(Number(match[3]), Number(match[2]) - 1, Number(match[1])) / 86_400_000);
};

// "10h 5m" / "2h" / "45m" → minutes.
export const parseDurationMinutes = (duration: string | undefined): number | null => {
  if (!duration) return null;
  const hours = duration.match(/(\d+)\s*h/i);
  const minutes = duration.match(/(\d+)\s*m/i);
  if (!hours && !minutes) return null;
  return (hours ? Number(hours[1]) * 60 : 0) + (minutes ? Number(minutes[1]) : 0);
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "24-09-2026" (dd-mm-yyyy) → "24 Sep 2026". Null when SkyLink gave no date.
export const formatFlightDate = (date: string | undefined): string | null => {
  const match = date?.trim().match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (!match) return null;
  const month = MONTHS[Number(match[2]) - 1];
  return month ? `${Number(match[1])} ${month} ${match[3]}` : null;
};

export const formatDuration = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
};

const absoluteMinutes = (date: string | undefined, time: string | undefined): number | null => {
  const day = parseDay(date);
  const clock = parseClock(time);
  return day === null || clock === null ? null : day * 1440 + clock;
};

export const legStops = (leg: FlightLeg): number => leg.length - 1;

export const legDurationMinutes = (leg: FlightLeg): number | null =>
  parseDurationMinutes(leg[0]?.total_duration) ?? parseDurationMinutes(leg[0]?.duration_time);

export const flightDurationMinutes = (flight: FlightSearchResult): number => {
  const legs = flight.segments.map(legDurationMinutes);
  return legs.every((minutes) => minutes !== null)
    ? (legs as number[]).reduce((sum, minutes) => sum + minutes, 0)
    : Number.MAX_SAFE_INTEGER; // unknown durations sort last under "Fastest"
};

// How long the wait is between two consecutive segments of one leg.
export const layoverMinutes = (arriving: FlightSegment, departing: FlightSegment): number | null => {
  const arrival = absoluteMinutes(arriving.arrival_date, arriving.arrival_time);
  const departure = absoluteMinutes(departing.departure_date, departing.departure_time);
  if (arrival === null || departure === null || departure < arrival) return null;
  return departure - arrival;
};

// 1 when a leg lands the day after it took off ("+1"), 0 for same day.
export const arrivalDayOffset = (leg: FlightLeg): number => {
  const first = leg[0];
  const last = leg[leg.length - 1];
  const start = parseDay(first?.departure_date);
  const end = parseDay(last?.arrival_date);
  return start === null || end === null ? 0 : Math.max(0, end - start);
};

export const departureWindow = (leg: FlightLeg): DepartureWindow | null => {
  const minutes = parseClock(leg[0]?.departure_time);
  if (minutes === null) return null;
  if (minutes < 6 * 60) return "early_morning";
  if (minutes < 12 * 60) return "morning";
  if (minutes < 18 * 60) return "afternoon";
  return "evening";
};

// True when any segment's flight number contains the search text, ignoring
// case and spaces — "tk 626", "TK626" and "626" all match TK626.
export const matchesFlightNumber = (flight: FlightSearchResult, search: string): boolean => {
  const needle = search.replace(/\s+/g, "").toLowerCase();
  if (!needle) return true;
  return flight.segments.flat().some((segment) => segment.flight_no.replace(/\s+/g, "").toLowerCase().includes(needle));
};

export const earliestDepartureMinutes = (flight: FlightSearchResult): number =>
  parseClock(flight.segments[0]?.[0]?.departure_time) ?? Number.MAX_SAFE_INTEGER;

const allSegments = (flight: FlightSearchResult): FlightSegment[] => flight.segments.flat();

export const flightAirlines = (flight: FlightSearchResult): string[] =>
  Array.from(new Set(allSegments(flight).map((segment) => segment.airline)));

export const maxStops = (flight: FlightSearchResult): number =>
  Math.max(...flight.segments.map(legStops));

// Baggage strings come straight from the airline ("1 PC", "23 KG", "0 PC",
// "NIL"). Anything containing a non-zero number counts as included; null
// means the supplier said nothing, which the UI shows as "not specified".
const allowanceIncluded = (value: string | undefined): boolean | null => {
  if (!value) return null;
  return /[1-9]/.test(value);
};

export const checkedBagText = (flight: FlightSearchResult): string | null =>
  flight.baggage_allowance?.checked ?? flight.segments[0]?.[0]?.baggage ?? null;

export const cabinBagText = (flight: FlightSearchResult): string | null =>
  flight.baggage_allowance?.cabin ?? flight.segments[0]?.[0]?.cabin_baggage ?? null;

export const hasCheckedBag = (flight: FlightSearchResult): boolean | null =>
  allowanceIncluded(checkedBagText(flight) ?? undefined);

export const isRefundable = (flight: FlightSearchResult): boolean | null => {
  const flags = allSegments(flight).map((segment) => segment.refundable);
  if (flags.every((flag) => flag === undefined)) return null;
  return flags.every((flag) => flag === true || flag === 1);
};

export const fareName = (flight: FlightSearchResult): string | null =>
  flight.segments[0]?.[0]?.branded_fare ?? null;
