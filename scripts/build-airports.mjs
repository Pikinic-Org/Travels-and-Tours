// Builds src/server/modules/airports/airports.data.json from the open OurAirports dataset
// (https://ourairports.com/data/ — public domain).
//
// Run with: node scripts/build-airports.mjs
// Keeps only airports with an IATA code (the code flight search uses) and
// drops heliports, seaplane bases, balloon ports and closed airfields.

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const BASE = "https://davidmegginson.github.io/ourairports-data";
const OUTPUT = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "server", "modules", "airports", "airports.data.json");

const KEPT_TYPES = new Set(["large_airport", "medium_airport", "small_airport"]);
const TYPE_RANK = { large_airport: 3, medium_airport: 2, small_airport: 1 };

// Minimal CSV parser — handles quoted fields, commas and "" escapes inside
// quotes, which the airport names use.
const parseCsv = (text) => {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') inQuotes = true;
    else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
};

const toObjects = (rows) => {
  const [header, ...body] = rows;
  return body.map((values) => Object.fromEntries(header.map((key, index) => [key, values[index] ?? ""])));
};

const download = async (file) => {
  const response = await fetch(`${BASE}/${file}`);
  if (!response.ok) throw new Error(`Could not download ${file}: ${response.status}`);
  return toObjects(parseCsv(await response.text()));
};

const [airportRows, countryRows] = await Promise.all([download("airports.csv"), download("countries.csv")]);
const countryNames = Object.fromEntries(countryRows.map((country) => [country.code, country.name]));

// Some municipalities carry a suburb in brackets, e.g. "Paris (Roissy-en-France,
// Val-d'Oise)" — drop it so a city label stays a clean "City (CODE)".
const cleanCity = (value) => value.replace(/\s*\([^)]*\)/g, "").trim();

const airports = airportRows
  .filter((airport) => airport.iata_code && KEPT_TYPES.has(airport.type))
  .map((airport) => ({
    code: airport.iata_code.toUpperCase(),
    name: airport.name,
    city: cleanCity(airport.municipality) || airport.name,
    country: countryNames[airport.iso_country] ?? airport.iso_country,
    // Higher = shown first when several airports match equally well.
    rank: TYPE_RANK[airport.type] * 2 + (airport.scheduled_service === "yes" ? 1 : 0),
  }));

// An IATA code should be unique; if the source repeats one, keep the more
// significant airport.
const byCode = new Map();
for (const airport of airports) {
  const existing = byCode.get(airport.code);
  if (!existing || airport.rank > existing.rank) byCode.set(airport.code, airport);
}

const result = [...byCode.values()].sort((a, b) => b.rank - a.rank || a.code.localeCompare(b.code));

writeFileSync(OUTPUT, JSON.stringify(result));
console.log(`Wrote ${result.length} airports to ${OUTPUT}`);
