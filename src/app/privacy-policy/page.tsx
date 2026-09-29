import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Pikinic Travel & Tours collects, uses and protects your personal data.",
};

const sections: LegalSection[] = [
  {
    heading: "Who is responsible for your data",
    body: (
      <p>
        Pikinic, {siteConfig.address}, is the data controller for personal data collected through this website. We
        process personal data in line with the Nigeria Data Protection Act 2023 (NDPA) and related regulations. You
        can reach us about privacy at <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
      </p>
    ),
  },
  {
    heading: "What we collect",
    body: (
      <ul>
        <li>
          <strong>Booking details:</strong> each traveller&rsquo;s title, name, gender, date of birth and nationality,
          and the lead traveller&rsquo;s email address and phone number.
        </li>
        <li>
          <strong>Trip details:</strong> the flights and packages you search for and book, and your booking history
          with us.
        </li>
        <li>
          <strong>Payment information:</strong> payment status and references. Card and bank details are entered
          directly with our payment partner, Monnify; we never see or store them.
        </li>
        <li>
          <strong>Enquiries:</strong> your name, email, WhatsApp number and message when you contact us.
        </li>
        <li>
          <strong>Technical data:</strong> information such as your IP address, browser and device type, used to keep
          the website secure and working.
        </li>
      </ul>
    ),
  },
  {
    heading: "How we use it, and why we're allowed to",
    body: (
      <ul>
        <li>
          <strong>To make and manage your booking</strong>, including sending confirmations and schedule changes.
          This is necessary to perform our contract with you.
        </li>
        <li>
          <strong>To take payment and prevent fraud.</strong> This is necessary for the contract and in our
          legitimate interest.
        </li>
        <li>
          <strong>To answer your enquiries and support your trip.</strong> This is in our legitimate interest and at
          your request.
        </li>
        <li>
          <strong>To meet legal obligations</strong>, such as keeping financial records and responding to lawful
          requests from authorities.
        </li>
        <li>
          <strong>To send travel offers and news</strong>, only where you have agreed. You can opt out at any time
          using the link in any email or by contacting us.
        </li>
        <li>
          <strong>To understand how the website is used and improve it</strong>, based on your consent where
          analytics cookies are involved.
        </li>
      </ul>
    ),
  },
  {
    heading: "Who we share it with",
    body: (
      <>
        <p>We do not sell your personal data. We share it only as needed to provide our services:</p>
        <ul>
          <li>
            <strong>Airlines and our flight booking partner</strong> (247 Travels), who need traveller details to
            issue tickets. Airlines may pass data to border and security authorities as required by law.
          </li>
          <li>
            <strong>Monnify</strong>, to process payments.
          </li>
          <li>
            <strong>Zoho</strong>, which we use to manage customer enquiries and communications.
          </li>
          <li>
            <strong>Our hosting and technology providers</strong>, who run the website and store data on our behalf.
          </li>
          <li>
            <strong>Authorities</strong>, where the law requires it.
          </li>
        </ul>
        <p>
          Some of these providers process data outside Nigeria. Where that happens, we rely on the safeguards the NDPA
          requires to keep your data protected.
        </p>
      </>
    ),
  },
  {
    heading: "Cookies and similar technologies",
    body: (
      <>
        <p>
          We use your browser&rsquo;s storage to remember your cart and the flight you are checking out. This is
          needed for the website to work and does not track you across other sites.
        </p>
        <p>
          We may also use analytics tools, such as Google Analytics, which set cookies to help us understand how
          visitors use the website. These are only used with your consent, and you can block or delete cookies in
          your browser settings at any time.
        </p>
      </>
    ),
  },
  {
    heading: "How long we keep it",
    body: (
      <p>
        We keep booking and payment records for as long as needed to provide the service and to meet our legal,
        tax and accounting obligations, generally up to six years after your trip. Enquiries are kept for as long as
        needed to help you and follow up. When data is no longer needed, we delete or anonymise it.
      </p>
    ),
  },
  {
    heading: "How we protect it",
    body: (
      <p>
        All data sent to and from this website is encrypted in transit (HTTPS). Access to personal data is limited
        to the people and providers who need it, and our partners are chosen for their security standards. No system
        is perfectly secure, but if a breach affecting your data occurs, we will notify you and the Nigeria Data
        Protection Commission as the law requires.
      </p>
    ),
  },
  {
    heading: "Your rights",
    body: (
      <>
        <p>Under the NDPA, you have the right to:</p>
        <ul>
          <li>ask for a copy of the personal data we hold about you;</li>
          <li>ask us to correct inaccurate data;</li>
          <li>ask us to delete your data, where we don&rsquo;t need to keep it by law;</li>
          <li>object to or restrict how we use your data, and withdraw consent at any time;</li>
          <li>ask us to transfer your data to you or another organisation.</li>
        </ul>
        <p>
          To use any of these rights, <Link href="/contact">contact us</Link>. We will respond within the time the law
          allows. If you are unhappy with how we handle your data, you can also complain to the Nigeria Data
          Protection Commission.
        </p>
      </>
    ),
  },
  {
    heading: "Children",
    body: (
      <p>
        Bookings must be made by adults. We only process children&rsquo;s details when a parent or guardian provides
        them as part of a booking.
      </p>
    ),
  },
  {
    heading: "Changes to this policy",
    body: (
      <p>
        We may update this policy from time to time, for example when we add new tools or services. The date at the
        top of this page shows when it last changed.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="29 September 2026"
      intro={
        <p>
          To book your travel, we need some personal details about you and the people you travel with. This policy
          explains what we collect, why, who we share it with and the choices you have.
        </p>
      }
      sections={sections}
    />
  );
}
