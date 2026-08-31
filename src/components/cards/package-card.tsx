"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { packageToCartItem, type Package } from "@/lib/data/packages";
import { useCartStore } from "@/lib/cart-store";
import { cn, formatNaira } from "@/lib/utils";

// Route-agnostic: used on the homepage packages rail today, and by the
// /packages listing page — takes a Package record, renders one card.
export function PackageCard({ pkg, className }: { pkg: Package; className?: string }) {
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();

  function handleBook() {
    addItem(packageToCartItem(pkg));
    router.push("/cart");
  }

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-[2px] border border-border-primary bg-surface-primary",
        className
      )}
    >
      <Link
        href={`/packages/${pkg.slug}`}
        className="group relative aspect-[4/3] w-full overflow-hidden border-b border-border-primary"
      >
        <div className="mesh-gradient absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105" />
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full text-neutral-0/25"
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
        <span className="absolute bottom-3 left-4 text-2xl font-bold uppercase tracking-tight text-neutral-0">
          {pkg.destination}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">
          {pkg.country}
        </p>
        <h3 className="mt-1 text-lg font-bold uppercase tracking-tight text-text-primary">
          {pkg.name}
        </h3>

        <div className="mt-4 flex items-baseline justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-text-tertiary">From</p>
            <p className="text-xl font-bold text-green-700">{formatNaira(pkg.priceFrom)}</p>
          </div>
          <p className="text-sm font-semibold text-text-secondary">{pkg.duration}</p>
        </div>

        <Button
          type="button"
          onClick={handleBook}
          size="md"
          variant="secondary"
          className="mt-6 self-start"
        >
          Book Now
        </Button>
      </div>
    </div>
  );
}
