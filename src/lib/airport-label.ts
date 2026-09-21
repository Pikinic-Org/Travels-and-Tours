// Kept separate from airports.ts on purpose: that file imports the full
// airport dataset (~870 KB), which must stay on the server. Client components
// import only from here.

export type Airport = {
  code: string;
  name: string;
  city: string;
  country: string;
};

// The label the search bar shows and stores, e.g. "Lagos (LOS)".
export const airportLabel = (airport: Airport): string => `${airport.city} (${airport.code})`;

// Reads the IATA code back out of a label. Takes the LAST bracketed group so a
// city that itself contains brackets still resolves; a bare code passes through.
export const extractAirportCode = (label: string): string =>
  label.match(/\(([A-Za-z0-9]{3})\)\s*$/)?.[1].toUpperCase() ?? label.trim().toUpperCase();
