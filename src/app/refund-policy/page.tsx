import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description: "How cancellations, changes and refunds work for flights booked with Pikinic Travel & Tours.",
};

const sections: LegalSection[] = [
  {
    heading: "Airline fare rules come first",
    body: (
      <>
        <p>
          Whether you can cancel, change or get money back on a flight is set by the airline&rsquo;s fare rules for
          the ticket you bought, not by us. Before you pay, we show whether a fare is refundable or non-refundable.
        </p>
        <ul>
          <li>
            <strong>Non-refundable fares</strong> usually cannot be refunded if you cancel. Some airlines return part
            of the taxes on an unused ticket.
          </li>
          <li>
            <strong>Refundable fares</strong> can be refunded, often minus an airline cancellation penalty.
          </li>
          <li>
            <strong>Changes</strong> to dates, times or routes are usually possible for a change fee plus any
            difference in fare.
          </li>
        </ul>
      </>
    ),
  },
  {
    heading: "Our service fee",
    body: (
      <p>
        Our service fee covers the work of searching, booking and supporting your trip, and is not refundable once
        your ticket has been issued, unless we or the airline cancel the booking. Payment processing charges are also
        non-refundable in the same way.
      </p>
    ),
  },
  {
    heading: "If you want to cancel or change",
    body: (
      <>
        <p>
          <Link href="/contact">Contact us</Link> as early as possible, and before the flight departs, with your
          booking reference and the lead traveller&rsquo;s name. We will:
        </p>
        <ul>
          <li>check your fare rules and tell you what the airline allows;</li>
          <li>confirm any penalties, change fees or fare difference before we do anything;</li>
          <li>make the change or cancellation only once you agree.</li>
        </ul>
        <p>
          Please don&rsquo;t simply skip your flight. Airlines often cancel the rest of the booking (including the
          return flight) if a traveller doesn&rsquo;t show, and a no-show usually loses any refund.
        </p>
      </>
    ),
  },
  {
    heading: "If the airline cancels or changes your flight",
    body: (
      <p>
        If the airline cancels your flight or makes a significant schedule change, you are normally entitled to
        choose between an alternative flight offered by the airline and a refund. We will contact you with the
        options as soon as we are told, and handle the request with the airline for you. In this case, our service
        fee is refunded too.
      </p>
    ),
  },
  {
    heading: "If we can't complete your booking",
    body: (
      <p>
        If your payment goes through but we cannot issue your ticket, for example because the fare is no longer
        available, we will offer you an alternative or refund everything you paid, including our service fee.
      </p>
    ),
  },
  {
    heading: "How and when refunds are paid",
    body: (
      <ul>
        <li>Refunds are paid to the original payment method, or to a bank account in your name if that isn&rsquo;t possible.</li>
        <li>
          We request the refund from the airline once your cancellation is confirmed. Airlines typically take between
          2 and 12 weeks to process refunds; we pass the money on to you within 5 business days of receiving it.
        </li>
        <li>
          Refunds are for the amount the airline returns, minus any airline penalties and our non-refundable service
          fee, as explained above.
        </li>
      </ul>
    ),
  },
  {
    heading: "Vacation packages",
    body: (
      <p>
        Packages combine several services, such as flights, hotels and tours, each with its own cancellation terms.
        The terms for a package are shared with you before you pay; if anything is unclear, ask us before booking.
      </p>
    ),
  },
  {
    heading: "Contact us",
    body: (
      <p>
        To request a change, cancellation or refund, <Link href="/contact">send us a message</Link>, email{" "}
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> or call {siteConfig.phones[0]}.
      </p>
    ),
  },
];

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund & Cancellation Policy"
      updated="29 September 2026"
      intro={
        <p>
          Plans change. This policy explains what happens if you need to cancel or change a booking, or if the
          airline changes it for you, and how refunds reach you.
        </p>
      }
      sections={sections}
    />
  );
}
