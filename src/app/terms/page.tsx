import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms that apply when you search for, book and pay for travel with Pikinic Travel & Tours.",
};

const sections: LegalSection[] = [
  {
    heading: "Who we are",
    body: (
      <p>
        Pikinic Travel &amp; Tours is part of Pikinic, a Nigerian travel management company with its office at{" "}
        {siteConfig.address}. In these terms, &ldquo;Pikinic&rdquo;, &ldquo;we&rdquo; and &ldquo;us&rdquo; mean
        Pikinic, and &ldquo;you&rdquo; means anyone who uses this website or books through it.
      </p>
    ),
  },
  {
    heading: "Accepting these terms",
    body: (
      <p>
        By using this website or making a booking, you agree to these terms, our{" "}
        <Link href="/refund-policy">Refund &amp; Cancellation Policy</Link> and our{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>. If you book for other travellers, you confirm that they
        have agreed to these terms and that you are authorised to share their details with us. You must be at least
        18 years old to make a booking.
      </p>
    ),
  },
  {
    heading: "Our role as your booking agent",
    body: (
      <>
        <p>
          We arrange flights and travel services on your behalf through our partners, including airlines and flight
          booking providers. We are not an airline. Your flight is operated by the airline named on your booking, and
          that airline&rsquo;s conditions of carriage and fare rules apply to your journey, including baggage
          allowances, changes, cancellations, refunds, check-in and boarding.
        </p>
        <p>
          We show the key fare rules (such as baggage and whether a fare is refundable) before you pay. Where the
          airline&rsquo;s rules and these terms differ on anything to do with the flight itself, the airline&rsquo;s
          rules apply.
        </p>
      </>
    ),
  },
  {
    heading: "Prices and fare availability",
    body: (
      <ul>
        <li>All prices are in Nigerian Naira (₦) and include our service fee unless we say otherwise.</li>
        <li>
          Airfares change constantly. The price shown in search results is confirmed with the airline when you select
          a flight, and may change at that point. You will always see the confirmed price before you pay.
        </li>
        <li>
          Once confirmed, a price is held for a limited time, shown on the checkout page. If the hold runs out before
          payment, the fare must be confirmed again and may change.
        </li>
        <li>
          If we display a price that is obviously wrong because of a technical error, we may cancel the booking and
          refund you in full.
        </li>
      </ul>
    ),
  },
  {
    heading: "Payment and ticketing",
    body: (
      <>
        <p>
          Full payment is required before your booking is made with the airline. Payments are processed securely by
          our payment partner, Monnify; we never see or store your card details.
        </p>
        <p>
          Your booking is only confirmed once payment has been received and the airline has issued your booking
          reference. If payment succeeds but the booking cannot be completed (for example, because the seat is no
          longer available), we will offer you an alternative or refund your payment in full.
        </p>
      </>
    ),
  },
  {
    heading: "Traveller details",
    body: (
      <ul>
        <li>
          Names must be entered exactly as they appear on each traveller&rsquo;s passport or government ID. Airlines
          may refuse boarding, or charge to correct a name, if they don&rsquo;t match.
        </li>
        <li>
          You are responsible for the accuracy of all details you give us, including dates of birth, nationality,
          email and phone number. We use your email and phone to send your confirmation and any schedule changes.
        </li>
        <li>Check your confirmation as soon as you receive it and tell us straight away if anything is wrong.</li>
      </ul>
    ),
  },
  {
    heading: "Passports, visas and health requirements",
    body: (
      <p>
        You are responsible for holding a valid passport, any visas, transit visas and entry permits, and meeting any
        health or vaccination requirements for every country on your itinerary, including countries you only transit
        through. Many countries require a passport valid for at least six months after your travel date. We are not
        responsible if you are refused boarding or entry because of missing or invalid documents.
      </p>
    ),
  },
  {
    heading: "Changes and cancellations",
    body: (
      <p>
        Changes and cancellations are subject to the airline&rsquo;s fare rules and our{" "}
        <Link href="/refund-policy">Refund &amp; Cancellation Policy</Link>. Airlines sometimes change schedules or
        cancel flights. If this happens, we will let you know as soon as we are told and help you with the options
        the airline offers.
      </p>
    ),
  },
  {
    heading: "Using this website",
    body: (
      <>
        <p>You agree not to:</p>
        <ul>
          <li>make speculative, false or fraudulent bookings;</li>
          <li>use automated tools to search, scrape or copy content from the website;</li>
          <li>interfere with the website&rsquo;s security or place an unreasonable load on it;</li>
          <li>copy or reuse our content, branding or design without permission.</li>
        </ul>
        <p>We may cancel bookings or restrict access where we reasonably suspect fraud or misuse.</p>
      </>
    ),
  },
  {
    heading: "Our liability",
    body: (
      <>
        <p>
          We will arrange your booking with reasonable care and skill. We are not liable for the acts or omissions of
          airlines or other travel providers, including delays, cancellations, overbooking, lost or damaged baggage,
          or injury during travel. Claims about these should be made to the airline under its conditions of carriage,
          and we will help where we can.
        </p>
        <p>
          We are not liable for losses caused by events outside our reasonable control, such as severe weather,
          strikes, government action or system outages at our partners. Where we are liable, our liability is limited
          to the amount you paid us for the booking concerned. Nothing in these terms limits liability that cannot be
          limited under Nigerian law.
        </p>
      </>
    ),
  },
  {
    heading: "Changes to these terms",
    body: (
      <p>
        We may update these terms from time to time. The version on this page when you make a booking applies to
        that booking.
      </p>
    ),
  },
  {
    heading: "Governing law and disputes",
    body: (
      <p>
        These terms are governed by the laws of the Federal Republic of Nigeria. If you have a complaint, please
        contact us first so we can try to resolve it. Any dispute we cannot resolve together will be handled by the
        courts of Lagos State, Nigeria.
      </p>
    ),
  },
  {
    heading: "Contact us",
    body: (
      <p>
        Questions about these terms or a booking? <Link href="/contact">Send us a message</Link>, email{" "}
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> or call {siteConfig.phones[0]}.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      updated="29 September 2026"
      intro={
        <p>
          These terms explain how booking with Pikinic Travel &amp; Tours works: what we do, what the airline does,
          and what we each need from the other. Please read them before you book.
        </p>
      }
      sections={sections}
    />
  );
}
