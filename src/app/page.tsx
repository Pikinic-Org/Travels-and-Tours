import { Hero } from "@/components/sections/hero";
import { Ecosystem } from "@/components/sections/ecosystem";
import { Packages } from "@/components/sections/packages";
import { FlightOffers } from "@/components/sections/flight-offers";
import { Cta } from "@/components/sections/cta";

export default function Home() {
  return (
    <>
      <Hero />
      <Ecosystem />
      <Packages />
      <FlightOffers />
      <Cta />
    </>
  );
}
