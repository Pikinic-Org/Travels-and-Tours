"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Modal } from "@/components/ui/modal";
import { TextField } from "@/components/ui/text-field";
import { customPackageSchema, getFieldErrors, type CustomPackageValues } from "@/lib/validation";
import { featureFlags } from "@/lib/feature-flags";
import { cn } from "@/lib/utils";

const initialForm: CustomPackageValues = { fullName: "", email: "", destination: "" };

export function CustomPackageCta() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CustomPackageValues>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fieldErrors = getFieldErrors(customPackageSchema, form);
    if (fieldErrors) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitted(true);
  }

  function handleClose() {
    setOpen(false);
    setSubmitted(false);
    setErrors({});
    setForm(initialForm);
  }

  return (
    <section className="px-3 pb-3 md:px-4 md:pb-4">
      <div className="relative isolate overflow-hidden rounded-2xl bg-green-900 py-20 text-neutral-0 md:py-28">
      <Container className="relative flex flex-col items-center text-center">
        <h2 className="w-full max-w-none text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
          Don&rsquo;t see what you <span className="text-green-500">want?</span>
        </h2>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-neutral-0/70 sm:text-lg">
          We don&rsquo;t have a matching package right now, but we can build one for you. Tell us
          where you want to go and we&rsquo;ll put something together.
        </p>
        <Button
          type="button"
          onClick={() => setOpen(true)}
          size="lg"
          className="mt-8"
        >
          Request a custom package
        </Button>
      </Container>
      </div>

      <Modal open={open} onClose={handleClose}>
        {!featureFlags.customPackageRequest ? (
          <div className="text-center">
            <h3 className="text-lg font-semibold tracking-tight text-text-primary">
              Temporarily unavailable
            </h3>
            <p className="mt-3 text-sm text-text-secondary">
              Custom package requests are paused right now — check back soon.
            </p>
            <Button type="button" onClick={handleClose} size="md" variant="secondary" className="mt-6">
              Close
            </Button>
          </div>
        ) : submitted ? (
          <div className="text-center">
            <h3 className="text-lg font-semibold tracking-tight text-text-primary">
              Request received.
            </h3>
            <p className="mt-3 text-sm text-text-secondary">
              Thanks{form.fullName ? `, ${form.fullName.split(" ")[0]}` : ""}. Our team will reach
              out{form.email ? ` to ${form.email}` : ""} with some options.
            </p>
            <Button type="button" onClick={handleClose} size="md" variant="secondary" className="mt-6">
              Close
            </Button>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold tracking-tight text-text-primary">
              Request a Custom Package
            </h3>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
              <div>
                <label
                  htmlFor="destination"
                  className="text-sm font-semibold text-text-tertiary"
                >
                  Where do you want to go?
                </label>
                <textarea
                  id="destination"
                  name="destination"
                  value={form.destination}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Destination, rough dates, number of travellers…"
                  className={cn(
                    "mt-2 w-full rounded-lg border bg-transparent px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600",
                    errors.destination ? "border-red-500" : "border-border-primary"
                  )}
                />
                {errors.destination && (
                  <p className="mt-1.5 text-xs text-red-600">{errors.destination}</p>
                )}
              </div>
              <Button type="submit" size="md" variant="primary" className="w-full justify-center">
                Send request
              </Button>
            </form>
          </>
        )}
      </Modal>
    </section>
  );
}
