"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { flightOfferToCartItem, type FlightOffer } from "@/lib/data/flights";
import { useCartStore } from "@/lib/cart-store";
import { cn, formatNaira } from "@/lib/utils";
import { BrandPattern } from "@/components/ui/brand-pattern";

// Route-agnostic: one card of the homepage flight-deals rail today, reused
// as-is for the /flights listing page.
//
// FlightOffer has no per-route photo (pikinic-site's admin API doesn't send
// one) — showing a stock photo as if it were the real route would break the
// "never fabricate" content rule, so this uses the same honest placeholder
// treatment as PackageCard (the brand pattern on deep green) rather
// than a fake image. The dark gradient + glass chip over it is real either
// way, ready for a genuine photo the moment pikinic-site's API sends one.
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
        "group relative isolate flex aspect-[3/4] w-full flex-col justify-end overflow-hidden rounded-2xl",
        className
      )}
    >
      {/* Placeholder backdrop — swap for a real photo (offer.imageUrl) once
          pikinic-site's API provides one; nothing here claims to be a real
          route photo. */}
      <div className="absolute inset-0 -z-10 transition-transform duration-700 ease-out group-hover:scale-105 bg-green-900">
            <BrandPattern />
          </div>

      {/* Black overlay — a bottom-up gradient so the image (or, today, the
          placeholder) stays visible up top while the text at the bottom
          stays legible regardless of what's behind it. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-neutral-900/90 via-neutral-900/25 to-transparent" />

      {/* Glass chip — frosted, not solid, so it reads as an overlay on the
          image rather than a flat label. */}
      <span className="absolute left-4 top-4 rounded-md border border-neutral-0/20 bg-neutral-0/15 px-2 py-1 text-[10px] font-semibold text-neutral-0 backdrop-blur-sm">
        {offer.stops === 0 ? "Nonstop" : `${offer.stops} stop${offer.stops > 1 ? "s" : ""}`}
      </span>

      <div className="relative p-5">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-neutral-0">{offer.fromCode}</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 shrink-0 text-neutral-0/70"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
          <span className="text-lg font-semibold text-neutral-0">{offer.toCode}</span>
        </div>
        <p className="mt-1 text-sm text-neutral-0/70">
          {offer.from} — {offer.to}
        </p>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] text-neutral-0/70">{offer.tripType} from</p>
            <p className="text-xl font-bold text-neutral-0">{formatNaira(offer.price)}</p>
          </div>
          <Button
            type="button"
            onClick={handleBook}
            size="sm"
            variant="secondary"
            className="shrink-0 border-neutral-0/40 text-neutral-0 hover:bg-neutral-0/10"
          >
            Book now
          </Button>
        </div>
      </div>
    </div>
  );
}
