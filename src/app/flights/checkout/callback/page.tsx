import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { AlertCircleIcon, CheckCircleIcon, PlaneIcon } from "@/components/ui/search-icons";
import { formatIsoDate } from "@/lib/dates";
import { cn, formatNaira } from "@/lib/utils";
import { confirmBooking, getBooking } from "@/server/modules/bookings/bookings.service";
import { getAirportByCode } from "@/server/modules/airports/airports.service";
import type { FlightBooking } from "@/types";
import { AutoRefresh } from "@/components/flights/auto-refresh";
import { ClearSelectedFlight } from "@/components/flights/clear-selected-flight";
import { PrintTicketButton } from "@/components/flights/print-ticket-button";

type SearchParams = { [key: string]: string | string[] | undefined };

async function resolveBooking(bookingId: string): Promise<FlightBooking | null> {
  try {
    // Belt-and-braces: confirm triggers the payment-check+reserve step in
    // case Monnify's webhook hasn't landed yet (e.g. local dev has no public
    // tunnel for it to reach). Safe to call even if the webhook already did
    // this — it's driven off the booking's current status either way.
    return await confirmBooking(bookingId);
  } catch {
    try {
      return await getBooking(bookingId);
    } catch {
      return null;
    }
  }
}

// A booking's date fields arrive as full ISO datetimes ("2026-11-20T00:00:00.000Z")
// once they've crossed the HTTP boundary — formatIsoDate only accepts the
// plain "YYYY-MM-DD" it was built for, so the time portion is trimmed first.
const formatBookingDate = (iso: string | null): string | null => (iso ? formatIsoDate(iso.slice(0, 10)) : null);

const StatusHeader = ({
  icon,
  tone,
  eyebrow,
  title,
  accent,
}: {
  icon: ReactNode;
  tone: "good" | "bad";
  eyebrow: string;
  title: string;
  accent: string;
}) => (
  <div className="flex items-start gap-4">
    <span
      className={cn(
        "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg",
        tone === "good" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      )}
    >
      {icon}
    </span>
    <div>
      <p
        className={cn(
          "text-sm font-semibold",
          tone === "good" ? "text-green-700" : "text-text-tertiary"
        )}
      >
        {eyebrow}
      </p>
      <h1 className="mt-1 text-3xl font-semibold leading-[1.05] tracking-tight sm:text-4xl">
        {title} <span className="text-green-700">{accent}</span>
      </h1>
    </div>
  </div>
);

// Same bordered-grid-line technique the site uses for stats/value tiles
// elsewhere (border-l/border-t on the container, border-b/border-r per
// cell) — here holding the booking's actual details rather than numbers.
const DetailGrid = ({ items }: { items: { label: string; value: string }[] }) => (
  <div className="grid grid-cols-1 border-l border-t border-border-primary sm:grid-cols-2">
    {items.map((item) => (
      <div key={item.label} className="border-b border-r border-border-primary p-5">
        <p className="text-sm text-text-tertiary">{item.label}</p>
        <p className="mt-1 text-lg font-bold text-text-primary">{item.value}</p>
      </div>
    ))}
  </div>
);

// A boarding-pass-style ticket: route header, a "torn" perforation (dashed
// line + circular notches cut into the card's own edges, punched through
// with the page background), the detail grid, then a stub row with the
// booking reference set apart in wide tracking, the way a real ticket sets
// its code apart from the rest of the printout.
const BoardingPassTicket = ({ booking, details }: { booking: FlightBooking; details: { label: string; value: string }[] }) => {
  // Falls back to the bare code for any airport not in the dataset — never
  // fabricate a city name we don't actually have.
  const fromCity = getAirportByCode(booking.fromCode)?.city ?? booking.fromCode;
  const toCity = getAirportByCode(booking.toCode)?.city ?? booking.toCode;

  return (
    <div id="booking-ticket" className="relative mt-8 rounded-lg border border-border-primary bg-surface-primary">
      <div className="flex items-center justify-between gap-4 px-6 py-6 sm:px-8">
        <div>
          <p className="text-sm font-semibold text-text-tertiary">E-Ticket</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
            {fromCity} <span className="text-green-700">→</span> {toCity}
          </p>
          <p className="mt-1 text-sm font-semibold text-text-tertiary">
            {booking.fromCode} → {booking.toCode}
          </p>
        </div>
        <PlaneIcon className="h-8 w-8 shrink-0 text-green-700" />
      </div>

      <div className="relative border-t border-dashed border-border-secondary">
        <span className="absolute -left-[11px] top-1/2 h-[22px] w-[22px] -translate-y-1/2 rounded-full bg-background-primary" />
        <span className="absolute -right-[11px] top-1/2 h-[22px] w-[22px] -translate-y-1/2 rounded-full bg-background-primary" />
      </div>

      <DetailGrid items={details} />

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-primary px-6 py-4 sm:px-8">
        <span className="text-sm text-text-tertiary">Booking reference</span>
        <span className="font-mono text-lg font-bold tracking-[0.3em] text-text-primary">
          {booking.bookingReference ?? "—"}
        </span>
      </div>
    </div>
  );
};

function StatusPanel({ booking }: { booking: FlightBooking }) {
  if (booking.status === "reserved") {
    const details = [
      { label: "PNR", value: booking.pnr ?? "—" },
      { label: "Amount paid", value: formatNaira(booking.customerPrice) },
    ];
    if (booking.carrier) details.push({ label: "Airline", value: booking.carrier });
    const departure = formatBookingDate(booking.departureDate);
    if (departure) details.push({ label: "Departure", value: departure });
    const ticketBy = formatBookingDate(booking.ticketDeadline);
    if (ticketBy) details.push({ label: "Ticket by", value: ticketBy });

    return (
      <div>
        <StatusHeader
          icon={<CheckCircleIcon className="h-6 w-6" />}
          tone="good"
          eyebrow="Booking confirmed"
          title="You're All"
          accent="Set."
        />

        <BoardingPassTicket booking={booking} details={details} />

        <p className="mt-6 text-sm text-text-secondary">
          Keep your booking reference and PNR safe — you&apos;ll need them to manage this booking or check in
          with the airline.
        </p>

        <div className="no-print mt-6 flex flex-wrap gap-3">
          <Button href="/flights" size="md" variant="secondary">
            Search more flights
          </Button>
          <PrintTicketButton />
        </div>
      </div>
    );
  }

  if (booking.status === "failed") {
    return (
      <div className="rounded-2xl border border-border-primary bg-surface-primary p-6 sm:p-8">
        <StatusHeader
          icon={<AlertCircleIcon className="h-6 w-6" />}
          tone="bad"
          eyebrow="Booking failed"
          title="We couldn't"
          accent="Reserve This Fare."
        />
        <p className="mt-6 max-w-md text-text-secondary">
          Your payment of {formatNaira(booking.customerPrice)} could not be turned into a confirmed booking.
          {booking.refundStatus
            ? ` Refund status: ${booking.refundStatus}.`
            : " We're arranging a refund back to your original payment method."}
        </p>
        <div className="mt-6">
          <Button href="/flights" size="md" variant="primary">
            Search again
          </Button>
        </div>
      </div>
    );
  }

  if (booking.status === "paid") {
    return (
      <div className="rounded-2xl border border-border-primary bg-surface-primary p-6 sm:p-8">
        <AutoRefresh />
        <div className="flex items-center gap-4">
          <span className="h-8 w-8 shrink-0 animate-spin rounded-full border-2 border-border-primary border-t-green-700" />
          <div>
            <p className="text-sm font-semibold text-text-tertiary">Payment received</p>
            <h1 className="mt-1 text-2xl font-semibold leading-[1.05] tracking-tight sm:text-3xl">
              Finishing your <span className="text-green-700">reservation.</span>
            </h1>
          </div>
        </div>
        <p className="mt-4 max-w-md text-text-secondary">
          Your payment went through — we&apos;re finalizing the booking now. This page will update on its own.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border-primary bg-surface-primary p-6 sm:p-8">
      <AutoRefresh />
      <StatusHeader
        icon={<AlertCircleIcon className="h-6 w-6" />}
        tone="bad"
        eyebrow="Payment pending"
        title="We haven't received"
        accent="Your Payment."
      />
      <p className="mt-6 max-w-md text-text-secondary">
        If you completed payment, this can take a moment to reflect. Otherwise, your booking wasn&apos;t
        charged.
      </p>
      <div className="mt-6">
        <Button href="/flights" size="md" variant="primary">
          Back to Flights
        </Button>
      </div>
    </div>
  );
}

export default async function CheckoutCallbackPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const query = await searchParams;
  // Monnify appends its own "?paymentReference=…" to the redirect URL even when
  // one query string already exists, so a value can arrive as
  // "<id>?paymentReference=<id>". The booking id is also Monnify's
  // paymentReference, so use either one and drop anything after a stray "?".
  const rawBookingId =
    typeof query.bookingId === "string"
      ? query.bookingId
      : typeof query.paymentReference === "string"
        ? query.paymentReference
        : null;
  const bookingId = rawBookingId ? rawBookingId.split("?")[0] : null;

  const booking = bookingId ? await resolveBooking(bookingId) : null;

  return (
    <section className="py-20 md:py-28">
      <Container className="mx-auto max-w-2xl">
        {booking ? (
          <>
            <ClearSelectedFlight />
            <StatusPanel booking={booking} />
          </>
        ) : (
          <div className="rounded-2xl border border-border-primary bg-surface-primary p-8 text-center">
            <h1 className="text-2xl font-semibold leading-[1.05] tracking-tight">
              We couldn&apos;t find that <span className="text-green-700">booking.</span>
            </h1>
            <p className="mt-4 text-text-secondary">
              Something went wrong loading your booking status.
            </p>
            <div className="mt-6 flex justify-center">
              <Button href="/flights" size="md" variant="primary">
                Back to Flights
              </Button>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
