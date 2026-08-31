import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PathwayMark } from "@/components/ui/pathway-mark";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { partnershipPoints } from "@/lib/constants";

export function Cta() {
  return (
    <section className="relative isolate overflow-hidden bg-green-900 py-20 text-neutral-0 md:py-28">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full text-neutral-0/[0.06]"
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
      <PathwayMark className="float-slow pointer-events-none absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 text-neutral-0/[0.06]" />

      <Container className="relative">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <h2 className="w-full max-w-none text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl md:text-6xl">
            More Than a Booking.
            <br />
            A <span className="text-green-400">Partnership.</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal
          delay={100}
          className="mt-16 grid gap-10 border-t border-neutral-0/10 pt-12 md:grid-cols-3 md:gap-8"
        >
          {partnershipPoints.map((point) => (
            <div key={point.number}>
              <span className="text-sm font-bold tracking-widest text-green-400">
                {point.number}
              </span>
              <h3 className="mt-3 text-lg font-bold uppercase leading-tight tracking-tight sm:text-xl">
                {point.heading}
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-300 sm:text-base">
                {point.body}
              </p>
            </div>
          ))}
        </ScrollReveal>

        <ScrollReveal delay={150} className="mt-16 flex flex-wrap items-center justify-center gap-5">
          <Button
            href="/packages"
            size="lg"
            variant="primary"
            className="bg-neutral-0 text-green-800 hover:bg-green-50"
          >
            Explore Packages
          </Button>
          <Button
            href="/contact"
            size="lg"
            variant="secondary"
            className="border-neutral-0/40 text-neutral-0 hover:bg-neutral-0/10"
          >
            Contact Us
          </Button>
        </ScrollReveal>
      </Container>
    </section>
  );
}
