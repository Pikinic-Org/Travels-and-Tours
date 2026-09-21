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
        <div className="pointer-events-none absolute left-1/2 top-0 bottom-0 z-0 w-[95%] -translate-x-1/2 overflow-hidden rounded-[2px]">
          <Image src="/hero-sky.png" alt="" fill priority className="object-cover object-top" />
        </div>

        <svg
          className="pointer-events-none absolute left-1/2 top-0 z-0 w-[90%] -translate-x-1/2 text-neutral-300/60"
          viewBox="0 0 1282 579"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.25 0.25H1281.25M640.75 0.25V578.25M640.75 0.25H480.625M640.75 0.25H800.875M640.75 578.25H480.625M640.75 578.25H800.875M961 0.25V578.25M961 0.25H800.875M961 0.25H1121.12M961 578.25H800.875M961 578.25H1121.12M320.5 0.25V578.25M320.5 0.25H480.625M320.5 0.25H160.375M320.5 578.25H480.625M320.5 578.25H160.375M0.25 289.25H1281.25M0.25 289.25V144.75M0.25 289.25V433.75M1281.25 289.25V144.75M1281.25 289.25V433.75M1281.25 144.75V0.25H1121.12M1281.25 144.75H0.25M0.25 144.75V0.25H160.375M0.25 433.75V578.25H160.375M0.25 433.75H1281.25M1281.25 433.75V578.25H1121.12M480.625 0.25V578.25M800.875 0.25V578.25M1121.12 0.25V578.25M160.375 0.25V578.25"
            stroke="currentColor"
            strokeWidth="0.5"
          />
        </svg>

        <h1 className="relative z-10 w-full max-w-none text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          <span className="reveal block text-neutral-0" style={{ animationDelay: "0.1s" }}>
            Fly Further.
          </span>
          <span className="reveal block text-neutral-0" style={{ animationDelay: "0.25s" }}>
            <span className="relative inline-block text-green-700">
              Travel Smarter.
              <svg
                className="absolute -bottom-1 left-0 w-full sm:-bottom-2"
                viewBox="0 0 400 20"
                fill="none"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 14C60 6 140 4 200 8C260 12 340 14 398 6"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="draw-underline"
                  style={{ animationDelay: "0.9s" }}
                />
              </svg>
            </span>{" "}
            Book Easier.
          </span>
        </h1>

        <p
          className="reveal relative z-10 mt-6 max-w-2xl text-base text-neutral-0 sm:text-lg"
          style={{ animationDelay: "0.4s" }}
        >
          Flights, vacation packages, and travel planning for Nigerians going
          places. We handle the search, the booking, and the details so you
          can focus on the journey.
        </p>

        <div
          id="flights"
          className="reveal mt-12 w-full max-w-5xl scroll-mt-24"
          style={{ animationDelay: "0.55s" }}
        >
          <FlightSearchBar />
        </div>
      </Container>
    </section>
  );
}
