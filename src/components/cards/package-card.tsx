"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { packageToCartItem, type Package } from "@/lib/data/packages";
import { useCartStore } from "@/lib/cart-store";
import { cn, formatNaira } from "@/lib/utils";
import { BrandPattern } from "@/components/ui/brand-pattern";

// Route-agnostic: used on the homepage packages rail today, and by the
// /packages listing page — takes a Package record, renders one card.
//
// Same image-card treatment as FlightOfferCard: dark gradient overlay so
// text stays legible, a frosted glass chip, everything sitting on the image
// rather than a separate white panel below it. Package has no photo field
// from pikinic-site's API either, so this is the same honest placeholder
// (the brand pattern on deep green), ready to swap for pkg.imageUrl the
// moment the API sends one.
export function PackageCard({ pkg, className }: { pkg: Package; className?: string }) {
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();

  function handleBook(event: React.MouseEvent) {
    // The whole card is a Link to the package page — stop the click from
    // bubbling there so Book now can add-to-cart-and-checkout directly
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
        "group relative isolate flex aspect-[3/4] w-full flex-col justify-end overflow-hidden rounded-2xl",
        className
      )}
    >
      <div className="absolute inset-0 -z-10 transition-transform duration-700 ease-out group-hover:scale-105 bg-green-900">
            <BrandPattern />
          </div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-neutral-900/90 via-neutral-900/25 to-transparent" />

      <span className="absolute left-4 top-4 rounded-md border border-neutral-0/20 bg-neutral-0/15 px-2 py-1 text-[10px] font-semibold text-neutral-0 backdrop-blur-sm">
        {pkg.duration}
      </span>

      <div className="relative p-5">
        <p className="text-sm font-semibold text-neutral-0/70">{pkg.country}</p>
        <h3 className="mt-1 text-lg font-semibold tracking-tight text-neutral-0">{pkg.name}</h3>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] text-neutral-0/70">From</p>
            <p className="text-xl font-bold text-neutral-0">{formatNaira(pkg.priceFrom)}</p>
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
    </Link>
  );
}
