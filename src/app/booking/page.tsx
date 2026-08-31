"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { useCartStore, useCartSubtotal } from "@/lib/cart-store";
import { bookingFormSchema, getFieldErrors, type BookingFormValues } from "@/lib/validation";
import { formatNaira } from "@/lib/utils";

const initialForm: BookingFormValues = { fullName: "", email: "", phone: "", notes: "" };

export default function BookingPage() {
  const items = useCartStore((s) => s.items);
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const clear = useCartStore((s) => s.clear);
  const subtotal = useCartSubtotal();

  const [form, setForm] = useState<BookingFormValues>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fieldErrors = getFieldErrors(bookingFormSchema, form);
    if (fieldErrors) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitted(true);
    clear();
  }

  if (!hasHydrated) return null;

  if (submitted) {
    return (
      <section className="py-20 md:py-28">
        <Container className="mx-auto max-w-xl text-center">
          <h1 className="text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl">
            Booking <span className="text-green-700">Received.</span>
          </h1>
          <p className="mt-4 text-text-secondary">
            Thanks{form.fullName ? `, ${form.fullName.split(" ")[0]}` : ""}. Our team will reach out
            {form.email ? ` to ${form.email}` : ""} within one business day to confirm the details
            and next steps.
          </p>
          <Button href="/" variant="secondary" size="md" className="mt-8">
            Back to Home
          </Button>
        </Container>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="py-20 md:py-28">
        <Container className="text-center">
          <h1 className="text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl">
            Nothing to <span className="text-green-700">Book</span> Yet.
          </h1>
          <p className="mt-4 text-text-secondary">
            Add a flight or package to your cart first.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button href="/flights" variant="secondary" size="md">
              Browse Flights
            </Button>
            <Button href="/packages" variant="secondary" size="md">
              Browse Packages
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-28">
      <Container>
        <h1 className="text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl">
          Complete Your <span className="text-green-700">Booking</span>
        </h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <TextField
                label="Full name"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Adaeze Okafor"
                error={errors.fullName}
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                error={errors.email}
              />
              <TextField
                label="Phone number"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+234 800 000 0000"
                error={errors.phone}
              />
            </div>

            <div>
              <label
                htmlFor="notes"
                className="text-xs font-semibold uppercase tracking-widest text-text-tertiary"
              >
                Notes (optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Passport details, seat preference, special requests…"
                className="mt-2 w-full rounded-[2px] border border-border-primary bg-transparent px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
              />
            </div>

            <Button type="submit" size="lg" variant="primary" className="w-full sm:w-auto">
              Confirm Booking
            </Button>
          </form>

          <div className="h-fit rounded-[2px] border border-border-primary bg-surface-primary p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-text-tertiary">
              Order Summary
            </h2>
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
          </div>
        </div>
      </Container>
    </section>
  );
}
