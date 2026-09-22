"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { flightOfferToCartItem, type FlightOffer } from "@/lib/data/flights";
import { useCartStore } from "@/lib/cart-store";
import { cn, formatNaira } from "@/lib/utils";

// Route-agnostic: one card of the homepage flight-deals rail today, reused
// as-is for the /flights listing page.
//
// FlightOffer has no per-route photo (pikinic-site's admin API doesn't send
// one) — showing a stock photo as if it were the real route would break the
// "never fabricate" content rule, so this uses the same honest placeholder
// treatment as PackageCard (mesh-gradient + the square-frame motif) rather
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
        "group relative isolate flex aspect-[3/4] w-full flex-col justify-end overflow-hidden rounded-[2px] border border-border-primary",
        className
      )}
    >
      {/* Placeholder backdrop — swap for a real photo (offer.imageUrl) once
          pikinic-site's API provides one; nothing here claims to be a real
          route photo. */}
      <div className="mesh-gradient absolute inset-0 -z-10 transition-transform duration-700 ease-out group-hover:scale-105" />
      <svg
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full text-neutral-0/25"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1282 579"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.25 0.25H1281.25M640.75 0.25V578.25M640.75 0.25H480.625M640.75 0.25H800.875M640.75 578.25H480.625M640.75 578.25H800.875M961 0.25V578.25M961 0.25H800.875M961 0.25H1121.12M961 578.25H800.875M961 578.25H1121.12M320.5 0.25V578.25M320.5 0.25H480.625M320.5 0.25H160.375M320.5 578.25H480.625M320.5 578.25H160.375M0.25 289.25H1281.25M0.25 289.25V144.75M0.25 289.25V433.75M1281.25 289.25V144.75M1281.25 289.25V433.75M1281.25 144.75V0.25H1121.12M1281.25 144.75H0.25M0.25 144.75V0.25H160.375M0.25 433.75V578.25H160.375M0.25 433.75H1281.25M1281.25 433.75V578.25H1121.12M480.625 0.25V578.25M800.875 0.25V578.25M1121.12 0.25V578.25M160.375 0.25V578.25"
          stroke="currentColor"
          strokeWidth="0.5"
        />
      </svg>

      {/* Black overlay — a bottom-up gradient so the image (or, today, the
          placeholder) stays visible up top while the text at the bottom
          stays legible regardless of what's behind it. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-neutral-900/90 via-neutral-900/25 to-transparent" />

      {/* Glass chip — frosted, not solid, so it reads as an overlay on the
          image rather than a flat label. */}
      <span className="absolute left-4 top-4 rounded-sm border border-neutral-0/20 bg-neutral-0/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-neutral-0 backdrop-blur-sm">
        {offer.stops === 0 ? "Nonstop" : `${offer.stops} Stop`}
      </span>

      <div className="relative p-5">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold uppercase tracking-widest text-neutral-0">{offer.fromCode}</span>
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
          <span className="text-lg font-bold uppercase tracking-widest text-neutral-0">{offer.toCode}</span>
        </div>
        <p className="mt-1 text-xs uppercase tracking-widest text-neutral-0/70">
          {offer.from} — {offer.to}
        </p>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-neutral-0/70">{offer.tripType} from</p>
            <p className="text-xl font-bold text-neutral-0">{formatNaira(offer.price)}</p>
          </div>
          <Button
            type="button"
            onClick={handleBook}
            size="sm"
            variant="secondary"
            className="shrink-0 border-neutral-0/40 text-neutral-0 hover:bg-neutral-0/10"
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
}
