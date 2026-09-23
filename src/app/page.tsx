import { Hero } from "@/components/sections/hero";
import { Packages } from "@/components/sections/packages";
import { FlightOffers } from "@/components/sections/flight-offers";
import { Cta } from "@/components/sections/cta";

export default function Home() {
  return (
    <>
      <Hero />
      <Packages />
      <FlightOffers />
      <Cta />
    </>
  );
}
