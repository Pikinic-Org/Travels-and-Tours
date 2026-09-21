import airportData from "@/lib/data/airports.json";
import { airportLabel, type Airport } from "@/lib/airport-label";

export { airportLabel, type Airport };

type StoredAirport = Airport & { rank: number };

type SearchableAirport = {
  airport: Airport;
  rank: number;
  code: string;
  city: string;
  name: string;
  country: string;
};

const normalize = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

// Built once per server instance; the dataset is ~9k airports so scanning it
// per keystroke is cheap.
const searchable: SearchableAirport[] = (airportData as StoredAirport[]).map(({ rank, ...airport }) => ({
  airport,
  rank,
  code: airport.code.toLowerCase(),
  city: normalize(airport.city),
  name: normalize(airport.name),
  country: normalize(airport.country),
}));

const byCode = new Map(searchable.map((entry) => [entry.airport.code, entry.airport]));

const startsWithWord = (text: string, query: string): boolean =>
  text.startsWith(query) || text.includes(` ${query}`);

// Higher = better match. Exact code beats everything so typing "LOS" or "LHR"
// always puts that airport first; then city, airport name, and country.
const scoreMatch = (entry: SearchableAirport, query: string): number => {
  if (entry.code === query) return 1000;
  if (entry.code.startsWith(query)) return 800;
  if (entry.city === query) return 700;
  if (entry.city.startsWith(query)) return 600;
  if (startsWithWord(entry.city, query)) return 500;
  if (startsWithWord(entry.name, query)) return 400;
  if (entry.city.includes(query) || entry.name.includes(query)) return 300;
  if (entry.country.startsWith(query)) return 200;
  return 0;
};

export const searchAirports = (input: string, limit = 8): Airport[] => {
  const query = normalize(input);
  if (!query) return [];

  const scored: { entry: SearchableAirport; score: number }[] = [];
  for (const entry of searchable) {
    const score = scoreMatch(entry, query);
    if (score > 0) scored.push({ entry, score });
  }

  return scored
    .sort((a, b) => b.score - a.score || b.entry.rank - a.entry.rank)
    .slice(0, limit)
    .map(({ entry }) => entry.airport);
};

export const getAirportByCode = (code: string): Airport | null => byCode.get(code.toUpperCase()) ?? null;
