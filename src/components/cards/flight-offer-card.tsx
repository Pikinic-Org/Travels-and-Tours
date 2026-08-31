"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { flightOfferToCartItem, type FlightOffer } from "@/lib/data/flights";
import { useCartStore } from "@/lib/cart-store";
import { cn, formatNaira } from "@/lib/utils";

// Route-agnostic: one row of the homepage flight-deals table today, reused
// as-is for the /flights listing page.
export function FlightOfferCard({ offer, className }: { offer: FlightOffer; className?: string }) {
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();

  function handleBook() {
    addItem(flightOfferToCartItem(offer));
    router.push("/cart");
  }

  return (
    <div
      className={cn(
        "grid grid-cols-[1fr_auto] items-center gap-4 border-b border-r border-border-primary p-5 transition-colors hover:bg-neutral-900/[0.03] sm:grid-cols-[1fr_auto_auto]",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-bold uppercase tracking-widest text-text-primary">
          {offer.fromCode}
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 shrink-0 text-green-700"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
        <span className="text-sm font-bold uppercase tracking-widest text-text-primary">
          {offer.toCode}
        </span>
        <span className="hidden text-xs uppercase tracking-widest text-text-tertiary sm:inline">
          {offer.from} — {offer.to}
        </span>
        <span className="rounded-sm bg-neutral-900/[0.06] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-text-tertiary">
          {offer.stops === 0 ? "Nonstop" : `${offer.stops} Stop`}
        </span>
      </div>

      <div className="text-right sm:text-left">
        <p className="text-xs uppercase tracking-widest text-text-tertiary">
          {offer.tripType} from
        </p>
        <p className="text-lg font-bold text-green-700">{formatNaira(offer.price)}</p>
      </div>

      <Button
        type="button"
        onClick={handleBook}
        size="md"
        variant="secondary"
        className="col-span-2 sm:col-span-1"
      >
        Book Now
      </Button>
    </div>
  );
}
