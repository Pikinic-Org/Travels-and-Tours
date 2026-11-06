import { Container } from "@/components/ui/container";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { DeepGreenBackdrop } from "@/components/ui/brand-pattern";
import { placesToVisit } from "@/lib/constants";

// Replaced the homepage flight deals (user, 2026-11-06). Each card opens a WhatsApp enquiry
// about that tour on 0806 579 4790, in a new tab so the visitor keeps the site.
export function PlacesToVisit() {
  return (
    <section className="bg-background-secondary py-20 md:py-28">
      <Container>
        <ScrollReveal>
          <h2 className="max-w-xl text-4xl font-semibold leading-[1.05] tracking-tight text-text-primary sm:text-5xl">
            Places worth the <span className="text-green-700">trip</span>.
          </h2>
        </ScrollReveal>

        <ScrollReveal
          delay={100}
          className="scroll-snap-row mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:snap-none md:overflow-visible lg:grid-cols-4"
        >
          {placesToVisit.map((place) => (
            <a
              key={place.name}
              href={place.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`Make an enquiry on WhatsApp about a tour to ${place.name}, ${place.country}`}
              className="group relative isolate flex aspect-[3/4] w-[80%] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-2xl sm:w-[45%] md:w-full"
            >
              {/* Placeholder until real photos of each place are added. */}
              <DeepGreenBackdrop className="transition-transform duration-700 ease-out group-hover:scale-105" />

              <div className="relative p-5">
                <p className="text-sm font-semibold text-neutral-0/70">{place.country}</p>
                <h3 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-0">{place.name}</h3>
                <span className="mt-4 inline-flex h-8 items-center gap-1.5 rounded-md border border-neutral-0/40 px-3 text-sm font-medium text-neutral-0 transition-colors group-hover:bg-neutral-0/10">
                  Make an enquiry
                  <svg
                    aria-hidden
                    viewBox="0 0 16 16"
                    fill="none"
                    className="size-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:scale-125"
                  >
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </ScrollReveal>
      </Container>
    </section>
  );
}
