"use client";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useCartStore, useCartCount, useCartSubtotal } from "@/lib/cart-store";
import { formatNaira } from "@/lib/utils";

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const removeItem = useCartStore((s) => s.removeItem);
  const count = useCartCount();
  const subtotal = useCartSubtotal();

  if (!hasHydrated) return null;

  return (
    <section className="py-20 md:py-28">
      <Container>
        <h1 className="text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl">
          Your <span className="text-green-700">Cart</span>
        </h1>

        {items.length === 0 ? (
          <div className="mt-10 rounded-[2px] border border-border-primary bg-surface-primary p-10 text-center">
            <p className="text-text-secondary">Your cart is empty.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Button href="/flights" variant="secondary" size="md">
                Browse Flights
              </Button>
              <Button href="/packages" variant="secondary" size="md">
                Browse Packages
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
            <div className="divide-y divide-border-primary border-y border-border-primary">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 py-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">
                      {item.type}
                    </p>
                    <p className="text-lg font-bold text-text-primary">{item.title}</p>
                    {item.subtitle && (
                      <p className="text-sm text-text-secondary">{item.subtitle}</p>
                    )}
                    {item.quantity > 1 && (
                      <p className="mt-1 text-xs text-text-tertiary">Qty {item.quantity}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-bold text-green-700">
                      {formatNaira(item.price * item.quantity)}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.title}`}
                      className="text-text-tertiary transition-colors hover:text-text-primary"
                    >
                      <CloseIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-fit rounded-[2px] border border-border-primary bg-surface-primary p-6">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-text-tertiary">
                Order Summary
              </h2>
              <div className="mt-4 flex items-center justify-between border-t border-border-primary pt-4">
                <span className="text-sm font-semibold text-text-secondary">
                  Subtotal ({count} {count === 1 ? "item" : "items"})
                </span>
                <span className="text-xl font-bold text-text-primary">{formatNaira(subtotal)}</span>
              </div>
              <Button href="/booking" size="lg" variant="primary" className="mt-6 w-full justify-center">
                Proceed to Booking
              </Button>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
