"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PathwayMark } from "@/components/ui/pathway-mark";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { siblingLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";

// Every sibling except this one — a card linking to the site you're already
// on doesn't belong in a "more from Pikinic" slider.
const otherSiblings = siblingLinks.filter(
  (sibling): sibling is typeof sibling & { description: string } =>
    sibling.label !== "Travel & Tours" && sibling.description !== undefined
);

const AUTO_ADVANCE_MS = 6000;

export function Ecosystem() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((current) => (current + 1) % otherSiblings.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 md:py-28">
      <Container>
        <ScrollReveal>
          <p className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">The Ecosystem</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-bold uppercase leading-[0.95] tracking-tight text-text-primary sm:text-5xl">
            More Than <span className="text-green-700">Flights.</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={100} className="mt-12 lg:w-[65%]">
          <div className="relative overflow-hidden rounded-[2px] bg-green-900 p-8 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-10">
              <div>
                <div className="relative min-h-[170px] sm:min-h-[150px]">
                  {otherSiblings.map((sibling, index) => (
                    <div
                      key={sibling.label}
                      aria-hidden={index !== active}
                      className={cn(
                        "transition-all duration-500 motion-reduce:transition-none",
                        index === active
                          ? "relative opacity-100"
                          : "pointer-events-none absolute inset-0 opacity-0 translate-y-2"
                      )}
                    >
                      <span className="text-sm font-bold tracking-widest text-green-400">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-3 text-2xl font-bold uppercase leading-[0.95] tracking-tight text-neutral-0 sm:text-3xl">
                        {sibling.label}
                      </h3>
                      <p className="mt-3 max-w-md text-neutral-300">{sibling.description}</p>
                      <Link
                        href={sibling.href}
                        className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-green-400"
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
                </div>

                <div className="mt-6 flex gap-2">
                  {otherSiblings.map((sibling, index) => (
                    <button
                      key={sibling.label}
                      type="button"
                      onClick={() => setActive(index)}
                      aria-label={`Show ${sibling.label}`}
                      className={cn(
                        "h-1.5 rounded-[2px] transition-all duration-300",
                        index === active ? "w-8 bg-neutral-0" : "w-4 bg-neutral-0/25 hover:bg-neutral-0/50"
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* No real illustration exists per sibling yet, so the pathway
                  brand mark stands in for each slide — same motif used
                  elsewhere on the site, not a stock image pretending to
                  represent the ecosystem. No background box, just the mark. */}
              <div className="relative hidden h-40 items-center justify-center lg:flex">
                {otherSiblings.map((sibling, index) => (
                  <PathwayMark
                    key={sibling.label}
                    aria-hidden="true"
                    className={cn(
                      "float-slow absolute h-40 w-40 text-neutral-0/10 transition-opacity duration-500 motion-reduce:transition-none",
                      index === active ? "opacity-100" : "opacity-0"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
