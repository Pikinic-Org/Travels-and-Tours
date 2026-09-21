import { Container } from "@/components/ui/container";
import { PathwayMark } from "@/components/ui/pathway-mark";
import { FlightSearchBar } from "@/components/sections/flight-search-bar";
import { Cta } from "@/components/sections/cta";
import { LiveFlightResults } from "@/components/flights/live-flight-results";
import { searchFlights, type FlightSearchParams, type FlightSearchResult } from "@/lib/pikinic-api";

type SearchParams = { [key: string]: string | string[] | undefined };

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

  let liveResults: FlightSearchResult[] | null = null;
  let liveSearchError = false;

  if (params) {
    try {
      const { flights } = await searchFlights(params);
      liveResults = flights;
    } catch (error) {
      console.error("[flights] live search failed:", error);
      liveSearchError = true;
    }
  }

  return (
    <>
      <section className="relative isolate overflow-hidden text-text-primary">
        <Container className="relative flex flex-col items-center pb-16 pt-16 text-center md:pb-20 md:pt-24">
          <PathwayMark className="float-slow pointer-events-none absolute left-1/2 top-0 z-0 h-[520px] w-[520px] -translate-x-1/2 text-green-600/[0.08]" />
          <h1 className="relative z-10 w-full max-w-none text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl md:text-6xl">
            Every Route, <span className="text-green-700">Priced Honestly.</span>
          </h1>
          <p className="relative z-10 mt-6 max-w-2xl text-base text-text-secondary sm:text-lg">
            Search fares across the routes Nigerians fly most, compare, and lock in your seat once
            the price is right.
          </p>
          <div className="relative z-10 mt-12 w-full max-w-5xl">
            <FlightSearchBar />
          </div>
        </Container>
      </section>

      {params && (
        <section className="pb-20 md:pb-28">
          <Container>
            {liveSearchError ? (
              <div className="rounded-[2px] border border-border-primary bg-surface-primary p-10 text-center text-text-secondary">
                Something went wrong searching those flights. Try again in a moment.
              </div>
            ) : (
              <LiveFlightResults results={liveResults ?? []} searchParams={params} />
            )}
          </Container>
        </section>
      )}

      <Cta />
    </>
  );
}
