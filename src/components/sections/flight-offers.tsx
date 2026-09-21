import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { FlightOfferCard } from "@/components/cards/flight-offer-card";
import { getFlightOffers } from "@/server/modules/content/content.service";

export async function FlightOffers() {
  const flightOffers = await getFlightOffers();

  return (
    <section className="bg-background-secondary py-20 md:py-28">
      <Container>
        <ScrollReveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl font-bold uppercase leading-[0.95] tracking-tight text-text-primary sm:text-5xl">
                Fares Worth <span className="text-green-700">Booking</span> Today.
              </h2>
            </div>
            <Link
              href="/flights"
              className="group hidden shrink-0 items-center gap-2 text-sm font-semibold uppercase tracking-wide text-text-primary sm:flex"
            >
              View all flights
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal
          delay={100}
          className="mt-12 grid grid-cols-1 border-l border-t border-border-primary bg-surface-primary sm:grid-cols-2"
        >
          {flightOffers.slice(0, 4).map((offer) => (
            <FlightOfferCard key={offer.id} offer={offer} />
          ))}
        </ScrollReveal>
      </Container>
    </section>
  );
}
