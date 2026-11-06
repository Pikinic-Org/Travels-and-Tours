"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { tourEnquiryHref } from "@/lib/constants";
import { cn } from "@/lib/utils";

// "What we do" banner under the hero (user, 2026-11-06). References from Behance: the numbered
// tab row from Phenomenon Studio's Effortless redesign, and poster-sized type set on the photo
// from NordWayTours. One photo, one line and one button per service, each to the right place.
// The photos are stand-ins until real ones are chosen.
const slides = [
  {
    label: "Flights",
    title: ["Search, compare and ", "book", " your flight."],
    text: "Search fares, pick your flight and book it in one place.",
    cta: "Search flights",
    href: "/flights",
    image: { src: "/images/banner-flights.png", alt: "A traveller with a suitcase and passport walking through an airport" },
  },
  {
    label: "Packages",
    title: ["Holidays ", "planned", " from start to finish."],
    text: "Ready-made trips, with the details handled for you.",
    cta: "View packages",
    href: "/packages",
    image: { src: "/images/travel-tours.jpg", alt: "A group of friends cheering together outdoors" },
  },
  {
    label: "Tours",
    title: ["Tell us where you want to ", "go", "."],
    text: "Ask us on WhatsApp about a tour, and we'll plan it with you.",
    cta: "Make an enquiry",
    href: tourEnquiryHref,
    image: { src: "/images/banner-tours.jpg", alt: "A historic stone building with a tall tower" },
  },
];

export function WhatWeDo() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = slides[active];

  return (
    <section aria-label="What we do" className="py-16 md:py-24">
      <Container>
        <div
          className={cn(
            "relative isolate flex min-h-[560px] flex-col justify-between overflow-hidden rounded-2xl text-neutral-0 md:min-h-[600px]",
            paused && "banner-paused"
          )}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {slides.map((s, i) => (
            <Image
              key={s.label}
              src={s.image.src}
              alt={i === active ? s.image.alt : ""}
              fill
              sizes="(min-width: 1280px) 1200px, 100vw"
              className={cn(
                "-z-10 object-cover transition-opacity duration-700 ease-out",
                i === active ? "opacity-100" : "opacity-0"
              )}
            />
          ))}
          {/* Keeps the tabs and the type legible on any photo. */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-neutral-900/85 via-neutral-900/35 to-neutral-900/50" />

          <div role="tablist" aria-label="Our services" className="grid grid-cols-3 gap-3 p-5 md:gap-6 md:p-8">
            {slides.map((s, i) => (
              <button
                key={s.label}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className="group flex flex-col gap-3 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-500"
              >
                <span className="relative h-px w-full overflow-hidden bg-neutral-0/30">
                  {i === active && (
                    <span
                      key={active}
                      className="banner-progress absolute inset-0 bg-green-500"
                      onAnimationEnd={() => setActive((active + 1) % slides.length)}
                    />
                  )}
                </span>
                <span
                  className={cn(
                    "text-sm font-medium transition-colors md:text-base",
                    i === active ? "text-neutral-0" : "text-neutral-0/60 group-hover:text-neutral-0"
                  )}
                >
                  {i + 1}. {s.label}
                </span>
              </button>
            ))}
          </div>

          <div key={slide.label} role="tabpanel" className="reveal flex flex-col gap-6 p-5 md:max-w-3xl md:p-10">
            <h2 className="text-4xl font-semibold leading-[1.02] tracking-tight sm:text-5xl md:text-7xl">
              {slide.title[0]}
              <span className="text-green-500">{slide.title[1]}</span>
              {slide.title[2]}
            </h2>
            <p className="max-w-md text-base text-neutral-0/80 md:text-lg">{slide.text}</p>
            <Button href={slide.href} size="lg">
              {slide.cta}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
