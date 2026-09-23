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
    cta: "Start Now",
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
          <div className="relative isolate aspect-[16/10] w-full overflow-hidden rounded-[2px] bg-green-900 sm:aspect-[21/9]">
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full text-neutral-0/[0.08]"
              preserveAspectRatio="xMidYMid slice"
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

            {otherSiblings.map((sibling, index) => {
              const copy = adCopy[sibling.label];
              return (
                <div
                  key={sibling.label}
                  aria-hidden={index !== active}
                  className={cn(
                    "absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none",
                    index === active ? "opacity-100" : "pointer-events-none opacity-0"
                  )}
                >
                  <Image src={images[sibling.label]} alt="" fill className="object-contain" />

                  {/* Dark overlay so the glass panel's text stays legible over
                      the image, same treatment as the package cards. */}
                  <div className="absolute inset-0 bg-gradient-to-t from-green-950/95 via-green-950/40 to-transparent" />

                  <span className="absolute left-5 top-5 rounded-sm border border-neutral-0/20 bg-neutral-0/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-neutral-0 backdrop-blur-sm">
                    {sibling.label}
                  </span>

                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
                    <div className="max-w-xl rounded-[2px] border border-neutral-0/15 bg-neutral-0/10 p-5 backdrop-blur-md sm:p-6">
                      <h3 className="text-2xl font-bold uppercase leading-[0.95] tracking-tight text-neutral-0 sm:text-4xl">
                        {copy.kicker} <span className="text-green-400">{copy.accent}</span>
                      </h3>
                      <p className="mt-3 max-w-md text-sm text-neutral-200 sm:text-base">{copy.body}</p>
                      <Button
                        href={sibling.href}
                        size="sm"
                        variant="secondary"
                        className="mt-5 border-neutral-0/40 text-neutral-0 hover:bg-neutral-0/10"
                      >
                        {copy.cta}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="absolute bottom-5 right-5 z-10 flex gap-2 sm:bottom-8 sm:right-8">
              {otherSiblings.map((sibling, index) => (
                <button
                  key={sibling.label}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Show ${sibling.label}`}
                  className={cn(
                    "h-1.5 rounded-[2px] transition-all duration-300",
                    index === active ? "w-8 bg-neutral-0" : "w-4 bg-neutral-0/30 hover:bg-neutral-0/60"
                  )}
                />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
