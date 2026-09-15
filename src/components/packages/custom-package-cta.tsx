"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Modal } from "@/components/ui/modal";
import { PathwayMark } from "@/components/ui/pathway-mark";
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
    <section className="relative isolate overflow-hidden bg-green-900 py-20 text-neutral-0 md:py-28">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full text-neutral-0/[0.06]"
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
      <PathwayMark className="float-slow pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 text-neutral-0/[0.06]" />

      <Container className="relative flex flex-col items-center text-center">
        <h2 className="w-full max-w-none text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl">
          Don&rsquo;t See What You <span className="text-green-400">Want?</span>
        </h2>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-green-100/80 sm:text-lg">
          We don&rsquo;t have a matching package right now, but we can build one for you. Tell us
          where you want to go and we&rsquo;ll put something together.
        </p>
        <Button
          type="button"
          onClick={() => setOpen(true)}
          size="lg"
          variant="primary"
          className="mt-8 bg-neutral-0 text-green-800 hover:bg-green-50"
        >
          Request a Custom Package
        </Button>
      </Container>

      <Modal open={open} onClose={handleClose}>
        {!featureFlags.customPackageRequest ? (
          <div className="text-center">
            <h3 className="text-lg font-bold uppercase tracking-tight text-text-primary">
              Temporarily Unavailable
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
            <h3 className="text-lg font-bold uppercase tracking-tight text-text-primary">
              Request Received.
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
            <h3 className="text-lg font-bold uppercase tracking-tight text-text-primary">
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
                  className="text-xs font-semibold uppercase tracking-widest text-text-tertiary"
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
                    "mt-2 w-full rounded-[2px] border bg-transparent px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600",
                    errors.destination ? "border-red-500" : "border-border-primary"
                  )}
                />
                {errors.destination && (
                  <p className="mt-1.5 text-xs text-red-600">{errors.destination}</p>
                )}
              </div>
              <Button type="submit" size="md" variant="primary" className="w-full justify-center">
                Send Request
              </Button>
            </form>
          </>
        )}
      </Modal>
    </section>
  );
}
