"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { siblingLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";

// Banner under the hero showing Pikinic's other businesses (user, 2026-11-06). References from
// Behance: the numbered tab row from Phenomenon Studio's Effortless redesign, and poster-sized
// type set on the photo from NordWayTours. Links come from siblingLinks, so they match the footer:
// Study Abroad goes to its site, Stay and Ride and Finance to WhatsApp on 0806 579 4790.
// Photos: Unsplash (free licence) for Study Abroad and Stay and Ride; Finance is the main site's.
const hrefFor = (label: string) => siblingLinks.find((link) => link.label === label)?.href ?? "https://www.pikinic.ng";

const slides = [
  {
    label: "Study abroad",
    title: ["Study abroad with ", "no", " agent fees."],
    text: "School placement, university applications and visa support, at no cost to you.",
    cta: "Visit Study Abroad",
    href: hrefFor("Study Abroad"),
    image: {
      src: "/images/banner-study-abroad.jpg",
      alt: "Two graduates in gowns smiling and raising their caps",
      position: "object-[center_30%]",
    },
  },
  {
    label: "Stay and ride",
    title: ["A place to ", "stay", " and a car to get around."],
    text: "Short-stay apartments and rental cars, sorted before you land.",
    cta: "Enquire on WhatsApp",
    href: hrefFor("Stay & Ride"),
    image: { src: "/images/banner-stay-ride.jpg", alt: "A man at the wheel of a car", position: "object-center" },
  },
  {
    label: "Finance",
    title: ["The ", "money", " side of moving abroad."],
    text: "Proof of funds, school fee and visa fee payments, and study loans.",
    cta: "Enquire on WhatsApp",
    href: hrefFor("Finance"),
    image: {
      src: "/images/banner-finance.jpg",
      alt: "A man reading a document at a desk with a laptop and calculator",
      position: "object-[center_20%]",
    },
  },
];

export function WhatWeDo() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = slides[active];

  return (
    <section aria-label="More from Pikinic" className="py-16 md:py-24">
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
                s.image.position,
                i === active ? "opacity-100" : "opacity-0"
              )}
            />
          ))}
          {/* Keeps the tabs and the type legible on any photo. */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-neutral-900/85 via-neutral-900/35 to-neutral-900/50" />

          <div role="tablist" aria-label="Pikinic services" className="grid grid-cols-3 gap-3 p-5 md:gap-6 md:p-8">
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
