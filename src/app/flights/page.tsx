import { Container } from "@/components/ui/container";
import { PathwayMark } from "@/components/ui/pathway-mark";
import { FlightSearchBar } from "@/components/sections/flight-search-bar";
import { Cta } from "@/components/sections/cta";
import { FlightsResults } from "@/components/flights/flights-results";
import { getFlightOffers } from "@/lib/pikinic-api";

export default async function FlightsPage() {
  const flightOffers = await getFlightOffers();

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

      <section className="pb-20 md:pb-28">
        <Container>
          <FlightsResults offers={flightOffers} />
        </Container>
      </section>

      <Cta />
    </>
  );
}
