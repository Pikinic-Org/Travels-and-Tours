import { DeepGreenBackdrop } from "@/components/ui/brand-pattern";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { partnershipPoints } from "@/lib/constants";

// 24px line icons, one per partnership point.
const icons = {
  tag: (
    <>
      <path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9-9-9Z" />
      <circle cx="7.5" cy="7.5" r="1.5" />
    </>
  ),
  passport: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <circle cx="12" cy="10" r="3" />
      <path d="M9 17h6" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="5" r="2" />
      <path d="M8 19h8a3.5 3.5 0 0 0 0-7H8a3.5 3.5 0 0 1 0-7h8" />
    </>
  ),
};

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

          <ScrollReveal delay={100} className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
            {partnershipPoints.map((point) => (
              <div key={point.heading} className="flex flex-col gap-4">
                <span className="flex size-12 items-center justify-center rounded-full bg-green-500/15 text-green-500">
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-6"
                  >
                    {icons[point.icon]}
                  </svg>
                </span>
                <h3 className="text-xl font-semibold leading-tight tracking-tight">{point.heading}</h3>
                <p className="max-w-sm text-sm leading-relaxed text-neutral-0/70 sm:text-base">{point.body}</p>
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
