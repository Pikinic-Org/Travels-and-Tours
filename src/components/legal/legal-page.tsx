import type { ReactNode } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";

export type LegalSection = { heading: string; body: ReactNode };

// Shared layout for the terms, refund and privacy pages: a title, the date the
// text last changed, and numbered sections in a readable measure.
export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: ReactNode;
  sections: LegalSection[];
}) {
  return (
    <section className="pb-24 pt-24 md:pb-32 md:pt-32">
      <Container>
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-text-primary sm:text-5xl md:text-6xl">
            {title}
          </h1>
          <p className="mt-4 text-sm text-text-tertiary">Last updated {updated}</p>
          <div className="mt-8 space-y-4 text-lg leading-relaxed text-text-secondary">{intro}</div>

          <ol className="mt-12 space-y-10 border-t border-border-primary pt-10">
            {sections.map((section, i) => (
              <li key={section.heading}>
                <h2 className="text-xl font-semibold text-text-primary">
                  {i + 1}. {section.heading}
                </h2>
                <div className="mt-3 space-y-3 leading-relaxed text-text-secondary [&_a]:text-green-700 [&_a]:underline [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
                  {section.body}
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-12 border-t border-border-primary pt-8 text-sm text-text-tertiary">
            See also our <Link href="/terms" className="text-green-700 underline">Terms &amp; Conditions</Link>,{" "}
            <Link href="/refund-policy" className="text-green-700 underline">Refund &amp; Cancellation Policy</Link> and{" "}
            <Link href="/privacy-policy" className="text-green-700 underline">Privacy Policy</Link>.
          </p>
        </div>
      </Container>
    </section>
  );
}
