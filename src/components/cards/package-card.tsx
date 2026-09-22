"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { packageToCartItem, type Package } from "@/lib/data/packages";
import { useCartStore } from "@/lib/cart-store";
import { cn, formatNaira } from "@/lib/utils";

// Route-agnostic: used on the homepage packages rail today, and by the
// /packages listing page — takes a Package record, renders one card.
//
// Same image-card treatment as FlightOfferCard: dark gradient overlay so
// text stays legible, a frosted glass chip, everything sitting on the image
// rather than a separate white panel below it. Package has no photo field
// from pikinic-site's API either, so this is the same honest placeholder
// (mesh-gradient + square-frame motif), ready to swap for pkg.imageUrl the
// moment the API sends one.
export function PackageCard({ pkg, className }: { pkg: Package; className?: string }) {
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();

  function handleBook(event: React.MouseEvent) {
    // The whole card is a Link to the package page — stop the click from
    // bubbling there so Book Now can add-to-cart-and-checkout directly
    // instead of navigating first.
    event.preventDefault();
    event.stopPropagation();
    addItem(packageToCartItem(pkg));
    router.push("/cart");
  }

  return (
    <Link
      href={`/packages/${pkg.slug}`}
      className={cn(
        "group relative isolate flex aspect-[3/4] w-full flex-col justify-end overflow-hidden rounded-[2px] border border-border-primary",
        className
      )}
    >
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

      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-neutral-900/90 via-neutral-900/25 to-transparent" />

      <span className="absolute left-4 top-4 rounded-sm border border-neutral-0/20 bg-neutral-0/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-neutral-0 backdrop-blur-sm">
        {pkg.duration}
      </span>

      <div className="relative p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-0/70">{pkg.country}</p>
        <h3 className="mt-1 text-lg font-bold uppercase tracking-tight text-neutral-0">{pkg.name}</h3>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-neutral-0/70">From</p>
            <p className="text-xl font-bold text-neutral-0">{formatNaira(pkg.priceFrom)}</p>
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
    </Link>
  );
}
