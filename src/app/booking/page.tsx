"use client";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useCartStore, useCartSubtotal } from "@/lib/cart-store";
import { siteConfig } from "@/lib/constants";
import { formatNaira } from "@/lib/utils";

export default function BookingPage() {
  const items = useCartStore((s) => s.items);
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const subtotal = useCartSubtotal();

  if (!hasHydrated) return null;

  return (
    <section className="py-20 md:py-28">
      <Container>
        <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
          Online booking, <span className="text-green-700">coming soon.</span>
        </h1>
        <p className="mt-4 max-w-xl text-text-secondary">
          We&rsquo;re connecting this checkout to real-time ticketing. It&rsquo;s not live yet, so
          nothing here gets booked automatically — but your cart is saved, and our team can lock in
          these prices for you directly in the meantime.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="rounded-2xl border border-border-primary bg-surface-primary p-8">
            <h2 className="text-sm font-semibold text-text-tertiary">
              Book with us directly
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              Reach out with what&rsquo;s in your cart and we&rsquo;ll take it from there.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={`mailto:${siteConfig.email}`} variant="primary" size="md">
                Email {siteConfig.email}
              </Button>
              <Button href={`tel:${siteConfig.phones[0]}`} variant="secondary" size="md">
                Call {siteConfig.phones[0]}
              </Button>
            </div>
          </div>

          <div className="h-fit rounded-2xl border border-border-primary bg-surface-primary p-6">
            <h2 className="text-sm font-semibold text-text-tertiary">
              Order summary
            </h2>
            {items.length === 0 ? (
              <p className="mt-4 border-t border-border-primary pt-4 text-sm text-text-secondary">
                Your cart is empty.
              </p>
            ) : (
              <>
                <div className="mt-4 space-y-3 border-t border-border-primary pt-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-text-secondary">
                        {item.title}
                        {item.quantity > 1 ? ` × ${item.quantity}` : ""}
                      </span>
                      <span className="font-semibold text-text-primary">
                        {formatNaira(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border-primary pt-4">
                  <span className="text-sm font-semibold text-text-secondary">Total</span>
                  <span className="text-xl font-bold text-green-700">{formatNaira(subtotal)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
