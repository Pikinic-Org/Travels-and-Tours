import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { AlertCircleIcon, CheckCircleIcon, PlaneIcon } from "@/components/ui/search-icons";
import { formatIsoDate } from "@/lib/dates";
import { cn, formatNaira } from "@/lib/utils";
import { confirmBooking, getBooking } from "@/server/modules/bookings/bookings.service";
import type { FlightBooking } from "@/types";
import { AutoRefresh } from "@/components/flights/auto-refresh";
import { ClearSelectedFlight } from "@/components/flights/clear-selected-flight";

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
        "flex h-12 w-12 shrink-0 items-center justify-center rounded-[2px]",
        tone === "good" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      )}
    >
      {icon}
    </span>
    <div>
      <p
        className={cn(
          "text-xs font-semibold uppercase tracking-widest",
          tone === "good" ? "text-green-700" : "text-text-tertiary"
        )}
      >
        {eyebrow}
      </p>
      <h1 className="mt-1 text-3xl font-bold uppercase leading-[0.95] tracking-tight sm:text-4xl">
        {title} <span className="text-green-700">{accent}</span>
      </h1>
    </div>
  </div>
);

// Same bordered-grid-line technique the site uses for stats/value tiles
// elsewhere (border-l/border-t on the container, border-b/border-r per
// cell) — here holding the booking's actual details rather than numbers.
const DetailGrid = ({ items }: { items: { label: string; value: string }[] }) => (
  <div className="mt-8 grid grid-cols-1 border-l border-t border-border-primary sm:grid-cols-2">
    {items.map((item) => (
      <div key={item.label} className="border-b border-r border-border-primary p-5">
        <p className="text-xs uppercase tracking-widest text-text-tertiary">{item.label}</p>
        <p className="mt-1 text-lg font-bold text-text-primary">{item.value}</p>
      </div>
    ))}
  </div>
);

function StatusPanel({ booking }: { booking: FlightBooking }) {
  if (booking.status === "reserved") {
    const details = [
      { label: "Booking Reference", value: booking.bookingReference ?? "—" },
      { label: "PNR", value: booking.pnr ?? "—" },
      { label: "Amount Paid", value: formatNaira(booking.customerPrice) },
    ];
    if (booking.carrier) details.push({ label: "Airline", value: booking.carrier });
    const departure = formatBookingDate(booking.departureDate);
    if (departure) details.push({ label: "Departure", value: departure });
    const ticketBy = formatBookingDate(booking.ticketDeadline);
    if (ticketBy) details.push({ label: "Ticket By", value: ticketBy });

    return (
      <div className="rounded-[2px] border border-border-primary bg-surface-primary p-6 sm:p-8">
        <StatusHeader
          icon={<CheckCircleIcon className="h-6 w-6" />}
          tone="good"
          eyebrow="Booking Confirmed"
          title="You're All"
          accent="Set."
        />

        <div className="mt-6 flex items-center gap-3 rounded-[2px] border border-border-primary bg-neutral-900/[0.02] px-4 py-3">
          <PlaneIcon className="h-4 w-4 shrink-0 text-green-700" />
          <span className="text-sm font-bold uppercase tracking-widest text-text-primary">
            {booking.fromCode} → {booking.toCode}
          </span>
        </div>

        <DetailGrid items={details} />

        <p className="mt-6 text-sm text-text-secondary">
          Keep your booking reference and PNR safe — you&apos;ll need them to manage this booking or check in
          with the airline.
        </p>

        <div className="mt-6">
          <Button href="/flights" size="md" variant="secondary">
            Search More Flights
          </Button>
        </div>
      </div>
    );
  }

  if (booking.status === "failed") {
    return (
      <div className="rounded-[2px] border border-border-primary bg-surface-primary p-6 sm:p-8">
        <StatusHeader
          icon={<AlertCircleIcon className="h-6 w-6" />}
          tone="bad"
          eyebrow="Booking Failed"
          title="We Couldn't"
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
            Search Again
          </Button>
        </div>
      </div>
    );
  }

  if (booking.status === "paid") {
    return (
      <div className="rounded-[2px] border border-border-primary bg-surface-primary p-6 sm:p-8">
        <AutoRefresh />
        <div className="flex items-center gap-4">
          <span className="h-8 w-8 shrink-0 animate-spin rounded-full border-2 border-border-primary border-t-green-700" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">Payment Received</p>
            <h1 className="mt-1 text-2xl font-bold uppercase leading-[0.95] tracking-tight sm:text-3xl">
              Finishing Your <span className="text-green-700">Reservation.</span>
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
    <div className="rounded-[2px] border border-border-primary bg-surface-primary p-6 sm:p-8">
      <AutoRefresh />
      <StatusHeader
        icon={<AlertCircleIcon className="h-6 w-6" />}
        tone="bad"
        eyebrow="Payment Pending"
        title="We Haven't Received"
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
          <div className="rounded-[2px] border border-border-primary bg-surface-primary p-8 text-center">
            <h1 className="text-2xl font-bold uppercase leading-[0.95] tracking-tight">
              We Couldn&apos;t Find That <span className="text-green-700">Booking.</span>
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
