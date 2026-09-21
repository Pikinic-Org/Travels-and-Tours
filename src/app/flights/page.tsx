import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { PathwayMark } from "@/components/ui/pathway-mark";
import { FlightSearchBar } from "@/components/sections/flight-search-bar";
import { Cta } from "@/components/sections/cta";
import { FlightResultsSection } from "@/components/flights/flight-results-section";
import { ResultsSkeleton } from "@/components/flights/results-skeleton";
import { airportLabel, getAirportByCode } from "@/server/modules/airports/airports.service";
import type { FlightSearchParams } from "@/types";

type SearchParams = { [key: string]: string | string[] | undefined };

// The search bar stores "City (CODE)" labels; the URL only has codes. Resolve
// them here, on the server, so the ~9k-airport dataset never ships to the browser.
const resolveAirportLabels = (params: FlightSearchParams | null): Record<string, string> => {
  if (!params) return {};

  const codes =
    params.flight_type === "multicity" ? params.routes.flatMap((route) => [route.from, route.to]) : [params.from, params.to];

  return Object.fromEntries(
    codes.flatMap((code) => {
      const airport = getAirportByCode(code);
      return airport ? [[code, airportLabel(airport)]] : [];
    })
  );
};

function toSearchParams(query: SearchParams): FlightSearchParams | null {
  const flightType = query.flight_type;
  if (flightType !== "oneway" && flightType !== "roundtrip" && flightType !== "multicity") return null;

  const common = {
    search_mode: "external" as const,
    adults: Number(query.adults) || 1,
    children: Number(query.children) || 0,
    infants: Number(query.infants) || 0,
    class: (query.class as FlightSearchParams["class"]) || "economy",
    currency: "NGN",
  };

  if (flightType === "multicity") {
    if (typeof query.routes !== "string") return null;
    try {
      const routes = JSON.parse(query.routes);
      if (!Array.isArray(routes) || routes.length < 2) return null;
      return { ...common, flight_type: "multicity", routes };
    } catch {
      return null;
    }
  }

  const from = query.from;
  const to = query.to;
  const departureDate = query.flights_departure_date;
  if (typeof from !== "string" || typeof to !== "string" || typeof departureDate !== "string") return null;

  if (flightType === "roundtrip") {
    const returnDate = query.flights_return_date;
    if (typeof returnDate !== "string") return null;
    return {
      ...common,
      flight_type: "roundtrip",
      from,
      to,
      flights_departure_date: departureDate,
      flights_return_date: returnDate,
    };
  }

  return { ...common, flight_type: "oneway", from, to, flights_departure_date: departureDate };
}

export default async function FlightsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const query = await searchParams;
  const params = toSearchParams(query);

  return (
    <>
      {/* z-20 keeps the search dropdowns above the results below; overflow is
          clipped on the pathway mark's own wrapper (not this section) so the
          dropdown panels can extend past the section's bottom edge. */}
      <section className="relative isolate z-20 text-text-primary">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <PathwayMark className="float-slow absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 text-green-600/[0.08]" />
        </div>
        <Container className="relative flex flex-col items-center pb-16 pt-16 text-center md:pb-20 md:pt-24">
          <h1 className="relative z-10 w-full max-w-none text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl md:text-6xl">
            Every Route, <span className="text-green-700">Priced Honestly.</span>
          </h1>
          <p className="relative z-10 mt-6 max-w-2xl text-base text-text-secondary sm:text-lg">
            Search fares across the routes Nigerians fly most, compare, and lock in your seat once
            the price is right.
          </p>
          <div className="relative z-10 mt-12 w-full max-w-5xl">
            <FlightSearchBar
              key={JSON.stringify(query)}
              initialSearch={params}
              airportLabels={resolveAirportLabels(params)}
            />
          </div>
        </Container>
      </section>

      {params && (
        <section className="pb-20 md:pb-28">
          <Container>
            {/* The key restarts the placeholder for every new search; without it
                React would keep showing the old results while the new ones load. */}
            <Suspense key={JSON.stringify(query)} fallback={<ResultsSkeleton />}>
              <FlightResultsSection params={params} />
            </Suspense>
          </Container>
        </section>
      )}

      <Cta />
    </>
  );
}
