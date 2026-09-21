import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { formatNaira } from "@/lib/utils";
import { confirmBooking, getBooking } from "@/server/modules/bookings/bookings.service";
import type { FlightBooking } from "@/types";
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

function StatusPanel({ booking }: { booking: FlightBooking }) {
  if (booking.status === "reserved") {
    return (
      <div className="rounded-[2px] border border-border-primary bg-surface-primary p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-green-700">Booking Confirmed</p>
        <h1 className="mt-3 text-3xl font-bold uppercase leading-[0.95] tracking-tight sm:text-4xl">
          You&apos;re All <span className="text-green-700">Set.</span>
        </h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-widest text-text-tertiary">Booking Reference</p>
            <p className="mt-1 text-lg font-bold text-text-primary">{booking.bookingReference ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-text-tertiary">PNR</p>
            <p className="mt-1 text-lg font-bold text-text-primary">{booking.pnr ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-text-tertiary">Route</p>
            <p className="mt-1 text-sm text-text-secondary">
              {booking.fromCode} → {booking.toCode}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-text-tertiary">Amount Paid</p>
            <p className="mt-1 text-sm text-text-secondary">{formatNaira(booking.customerPrice)}</p>
          </div>
        </div>
        <p className="mt-6 text-sm text-text-secondary">
          A confirmation with your ticket details will follow shortly.
        </p>
      </div>
    );
  }

  if (booking.status === "failed") {
    return (
      <div className="rounded-[2px] border border-border-primary bg-surface-primary p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">Booking Failed</p>
        <h1 className="mt-3 text-3xl font-bold uppercase leading-[0.95] tracking-tight sm:text-4xl">
          We Couldn&apos;t <span className="text-green-700">Reserve This Fare.</span>
        </h1>
        <p className="mt-4 max-w-md text-text-secondary">
          Your payment of {formatNaira(booking.customerPrice)} could not be turned into a confirmed booking.
          {booking.refundStatus
            ? ` A refund has been ${booking.refundStatus === "completed" ? "processed" : "initiated"} back to your original payment method.`
            : " We're initiating a refund back to your original payment method."}
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
      <div className="rounded-[2px] border border-border-primary bg-surface-primary p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">Payment Received</p>
        <h1 className="mt-3 text-3xl font-bold uppercase leading-[0.95] tracking-tight sm:text-4xl">
          Finishing Your <span className="text-green-700">Reservation.</span>
        </h1>
        <p className="mt-4 max-w-md text-text-secondary">
          Your payment went through — we&apos;re finalizing the booking now. Refresh in a few seconds.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[2px] border border-border-primary bg-surface-primary p-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">Payment Pending</p>
      <h1 className="mt-3 text-3xl font-bold uppercase leading-[0.95] tracking-tight sm:text-4xl">
        We Haven&apos;t Received <span className="text-green-700">Your Payment.</span>
      </h1>
      <p className="mt-4 max-w-md text-text-secondary">
        If you completed payment, this can take a moment to reflect. Otherwise, your booking wasn&apos;t charged.
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
