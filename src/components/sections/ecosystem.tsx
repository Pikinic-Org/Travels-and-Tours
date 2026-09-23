import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PathwayMark } from "@/components/ui/pathway-mark";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { siblingLinks } from "@/lib/constants";

// Every sibling except this one — a card linking to the site you're already
// on doesn't belong in a "more from Pikinic" slider.
const otherSiblings = siblingLinks.filter(
  (sibling): sibling is typeof sibling & { description: string } =>
    sibling.label !== "Travel & Tours" && sibling.description !== undefined
);

export function Ecosystem() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <ScrollReveal className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">The Ecosystem</p>
            <h2 className="mt-3 max-w-2xl text-4xl font-bold uppercase leading-[0.95] tracking-tight text-text-primary sm:text-5xl">
              More Than <span className="text-green-700">Flights.</span>
            </h2>
            <p className="mt-4 max-w-md text-text-secondary">
              Travel & Tours is one arm of the Pikinic ecosystem — study abroad, stays and rides, and travel
              finance are handled by the same team.
            </p>
          </div>
          {/* No real illustration exists for this yet, so the pathway brand
              mark stands in — same motif used elsewhere on the site, not a
              stock image pretending to represent the ecosystem. */}
          <div className="hidden items-center justify-center lg:flex">
            <PathwayMark className="float-slow h-64 w-64 text-green-700/10" />
          </div>
        </ScrollReveal>

        <ScrollReveal
          delay={100}
          className="scroll-snap-row mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:snap-none md:overflow-visible"
        >
          {otherSiblings.map((sibling, index) => (
            <div
              key={sibling.label}
              className="w-[80%] shrink-0 snap-start rounded-[2px] border border-border-primary bg-surface-primary p-6 sm:w-[45%] sm:p-8 md:w-full"
            >
              <span className="text-sm font-bold tracking-widest text-green-700">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-lg font-bold uppercase leading-tight tracking-tight sm:text-xl">
                {sibling.label}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{sibling.description}</p>
              <Link
                href={sibling.href}
                className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-green-700"
              >
                Visit Site
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
          ))}
        </ScrollReveal>
      </Container>
    </section>
  );
}
