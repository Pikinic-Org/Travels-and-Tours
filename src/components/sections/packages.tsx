import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { PackageCard } from "@/components/cards/package-card";
import { packages } from "@/lib/data/packages";

export function Packages() {
  return (
    <section id="packages" className="scroll-mt-24 py-20 md:py-28">
      <Container>
        <ScrollReveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl font-bold uppercase leading-[0.95] tracking-tight text-text-primary sm:text-5xl">
                Packages Built for <span className="text-green-700">Nigerians</span> Going Places.
              </h2>
            </div>
            <Link
              href="/packages"
              className="group hidden shrink-0 items-center gap-2 text-sm font-semibold uppercase tracking-wide text-text-primary sm:flex"
            >
              View all packages
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
          className="scroll-snap-row mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:snap-none md:overflow-visible lg:grid-cols-4"
        >
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.slug}
              pkg={pkg}
              className="w-[80%] shrink-0 snap-start sm:w-[45%] md:w-full"
            />
          ))}
        </ScrollReveal>

        <Link
          href="/packages"
          className="group mt-8 flex w-fit items-center gap-2 text-sm font-semibold uppercase tracking-wide text-text-primary sm:hidden"
        >
          View all packages
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
      </Container>
    </section>
  );
}
