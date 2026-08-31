"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { packageToCartItem, type Package } from "@/lib/data/packages";
import { useCartStore } from "@/lib/cart-store";

export function BookPackageButton({ pkg, className }: { pkg: Package; className?: string }) {
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();

  function handleBook() {
    addItem(packageToCartItem(pkg));
    router.push("/cart");
  }

  return (
    <Button type="button" onClick={handleBook} size="lg" variant="primary" className={className}>
      Book Now
    </Button>
  );
}
