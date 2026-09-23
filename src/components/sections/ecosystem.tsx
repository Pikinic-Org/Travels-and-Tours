"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { siblingLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";

// Generated line-art matches the brand's flat, thin-stroke blueprint style
// (see design.md's pathway/square-frame motifs) rather than a photo — no
// real product photography exists for these sibling sites either.
const images: Record<string, string> = {
  "Study Abroad": "/ecosystem/study-abroad.png",
  "Stay & Ride": "/ecosystem/stay-and-ride.png",
  Finance: "/ecosystem/finance.png",
};

// Every sibling except this one — a card linking to the site you're already
// on doesn't belong in a "more from Pikinic" slider.
const otherSiblings = siblingLinks.filter(
  (sibling): sibling is typeof sibling & { description: string } =>
    sibling.label !== "Travel & Tours" && sibling.description !== undefined
);

// Ad-style copy per sibling — kept local to this carousel rather than on
// siblingLinks, since the footer just needs the plain label/description.
const adCopy: Record<string, { kicker: string; accent: string; body: string; cta: string }> = {
  "Study Abroad": {
    kicker: "We Can Help You",
    accent: "Study Abroad.",
    body: "Applications, visas, and the paperwork sorted — start your journey now.",
    cta: "Start Your Journey",
  },
  "Stay & Ride": {
    kicker: "We've Got Your",
    accent: "Stay & Rides Sorted.",
    body: "Accommodation and local rides, arranged before you land.",
    cta: "Sort My Stay",
  },
  Finance: {
    kicker: "We Can Handle Your",
    accent: "Travel Finance.",
    body: "Proof of funds and the financial documentation your journey needs.",
    cta: "Get Funded",
  },
};

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
        <ScrollReveal className="lg:mx-auto lg:w-[65%]">
          <div className="relative overflow-hidden rounded-[2px] bg-green-900 p-8 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-10">
              <div className="relative hidden h-48 items-center justify-center lg:flex">
                {otherSiblings.map((sibling, index) => (
                  <Image
                    key={sibling.label}
                    src={images[sibling.label]}
                    alt=""
                    aria-hidden="true"
                    width={280}
                    height={280}
                    className={cn(
                      "float-slow absolute h-48 w-48 object-contain transition-opacity duration-500 motion-reduce:transition-none",
                      index === active ? "opacity-100" : "opacity-0"
                    )}
                  />
                ))}
              </div>

              <div>
                <div className="relative min-h-[190px] sm:min-h-[170px]">
                  {otherSiblings.map((sibling, index) => {
                    const copy = adCopy[sibling.label];
                    return (
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
                        <h3 className="text-2xl font-bold uppercase leading-[0.95] tracking-tight text-neutral-0 sm:text-3xl">
                          {copy.kicker} <span className="text-green-400">{copy.accent}</span>
                        </h3>
                        <p className="mt-3 max-w-md text-neutral-300">{copy.body}</p>
                        <Button
                          href={sibling.href}
                          size="sm"
                          variant="primary"
                          className="mt-5 bg-neutral-0 text-green-800 hover:bg-green-50"
                        >
                          {copy.cta}
                        </Button>
                      </div>
                    );
                  })}
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
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
