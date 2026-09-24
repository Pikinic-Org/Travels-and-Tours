import Image from "next/image";
import { Container } from "@/components/ui/container";
import { FlightSearchBar } from "@/components/sections/flight-search-bar";

export function Hero() {
  return (
    // No overflow-hidden and z-20 on purpose: the airport suggestion lists
    // hang below the search bar and must sit on top of the hero image and the
    // section underneath. The image below clips itself in its own wrapper.
    <section className="relative isolate z-20 text-text-primary">
      <Container className="relative flex flex-col items-center pb-28 pt-16 text-center md:pb-36 md:pt-24">
        <div className="pointer-events-none absolute left-1/2 top-0 bottom-0 z-0 w-[calc(100%-24px)] -translate-x-1/2 overflow-hidden rounded-2xl md:w-[calc(100%-32px)]">
          <Image src="/hero-sky.png" alt="" fill priority className="object-cover object-top" />
        </div>


        <h1 className="relative z-10 w-full max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight text-neutral-0 sm:text-6xl md:text-7xl lg:text-8xl">
          <span className="reveal block" style={{ animationDelay: "0.1s" }}>
            Fly further.
          </span>
          <span className="reveal block text-orange-500" style={{ animationDelay: "0.25s" }}>
            Travel smarter.
          </span>
          <span className="reveal block" style={{ animationDelay: "0.4s" }}>
            Book easier.
          </span>
        </h1>

        <p
          className="reveal relative z-10 mt-6 max-w-2xl text-base text-neutral-0 sm:text-lg"
          style={{ animationDelay: "0.55s" }}
        >
          Flights, vacation packages, and travel planning for Nigerians going
          places. We handle the search, the booking, and the details so you
          can focus on the journey.
        </p>

        <div
          id="flights"
          className="reveal mt-12 w-full max-w-5xl scroll-mt-24"
          style={{ animationDelay: "0.7s" }}
        >
          <FlightSearchBar />
        </div>
      </Container>
    </section>
  );
}
