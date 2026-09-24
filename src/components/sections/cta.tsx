import { DeepGreenBackdrop } from "@/components/ui/brand-pattern";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { partnershipPoints } from "@/lib/constants";

export function Cta() {
  return (
    <section className="px-3 pb-3 md:px-4 md:pb-4">
      <div className="relative isolate overflow-hidden rounded-2xl bg-green-900 py-20 text-neutral-0 md:py-28">
        <DeepGreenBackdrop />
        <Container>
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              More than a booking. A <span className="text-green-500">partnership.</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={100} className="mt-14 grid gap-4 md:grid-cols-3 md:gap-6">
            {partnershipPoints.map((point) => (
              <div key={point.heading} className="relative isolate flex flex-col gap-3 overflow-hidden rounded-2xl p-6 md:p-8">
                <DeepGreenBackdrop />
                <h3 className="text-xl font-semibold leading-tight tracking-tight">{point.heading}</h3>
                <p className="text-sm leading-relaxed text-neutral-0/70 sm:text-base">{point.body}</p>
              </div>
            ))}
          </ScrollReveal>

          <ScrollReveal delay={150} className="mt-14 flex flex-wrap items-center justify-center gap-3">
            <Button href="/packages" size="lg">
              Explore packages
            </Button>
            <Button href="/contact" size="lg" variant="inverse">
              Contact us
            </Button>
          </ScrollReveal>
        </Container>
      </div>
    </section>
  );
}
