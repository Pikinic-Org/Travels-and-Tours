"use client";

import { useRef, useState, type FocusEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { inputClass, selectClass } from "@/components/checkout/form-field";
import { cn } from "@/lib/utils";
import { sendContactEnquiry } from "@/server/modules/contact/contact.controller";

const topics = [
  "Booking a flight",
  "A booking I've already made",
  "Vacation packages",
  "Group or corporate travel",
  "Something else",
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+\-\s()]+$/;

type FieldKey = "name" | "email" | "whatsapp" | "topic" | "message";
type FieldErrors = Partial<Record<FieldKey, string>>;
type Status = "idle" | "submitting" | "success" | "error";

function validate(data: Record<string, FormDataEntryValue>): FieldErrors {
  const errors: FieldErrors = {};

  const name = String(data.name ?? "").trim();
  const email = String(data.email ?? "").trim();
  const whatsapp = String(data.whatsapp ?? "").trim();
  const topic = String(data.topic ?? "").trim();
  const message = String(data.message ?? "").trim();

  if (!name) errors.name = "Full name is required.";

  if (!email) errors.email = "Email address is required.";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address.";

  if (!whatsapp) errors.whatsapp = "WhatsApp number is required.";
  else if (!PHONE_PATTERN.test(whatsapp) || whatsapp.replace(/\D/g, "").length < 7) {
    errors.whatsapp = "Numbers only — enter a valid phone number.";
  }

  if (!topic) errors.topic = "Select what your question is about.";
  if (!message) errors.message = "Message is required.";

  return errors;
}

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});

  function revalidate() {
    if (!formRef.current) return {};
    const errors = validate(Object.fromEntries(new FormData(formRef.current).entries()));
    setFieldErrors(errors);
    return errors;
  }

  function handleBlur(e: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const field = e.currentTarget.name as FieldKey;
    setTouched((prev) => ({ ...prev, [field]: true }));
    revalidate();
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");
    setTouched({ name: true, email: true, whatsapp: true, topic: true, message: true });

    if (Object.keys(revalidate()).length > 0) return;

    setStatus("submitting");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    // pikinic-site files every enquiry under a service, so prefix the topic
    // with this site's to keep travel questions together in the CRM.
    const result = await sendContactEnquiry({
      name: String(data.name).trim(),
      email: String(data.email).trim(),
      whatsapp: String(data.whatsapp).trim(),
      service: `Travel and Tours: ${data.topic}`,
      message: String(data.message).trim(),
    });

    if (!result.ok) {
      setStatus("error");
      setErrorMessage(result.error);
      return;
    }

    setStatus("success");
    form.reset();
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-surface-primary p-8 text-center">
        <p className="text-lg font-semibold text-text-primary">Message sent.</p>
        <p className="mt-2 text-sm text-text-secondary">
          Our travel team will get back to you on WhatsApp or email shortly.
        </p>
      </div>
    );
  }

  const errorFor = (field: FieldKey) => (touched[field] ? fieldErrors[field] : undefined);

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5">
      <TextField label="Full name" name="name" type="text" autoComplete="name" onBlur={handleBlur} error={errorFor("name")} />
      <TextField
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        onBlur={handleBlur}
        error={errorFor("email")}
      />
      <TextField
        label="WhatsApp number"
        name="whatsapp"
        type="tel"
        autoComplete="tel"
        placeholder="+234 800 000 0000"
        onBlur={handleBlur}
        error={errorFor("whatsapp")}
      />

      <div>
        <label htmlFor="topic" className="text-sm font-semibold text-text-tertiary">
          What&rsquo;s your question about?
        </label>
        <select
          id="topic"
          name="topic"
          defaultValue=""
          onBlur={handleBlur}
          aria-invalid={!!errorFor("topic")}
          className={cn("mt-2", selectClass, errorFor("topic") && "border-red-500")}
        >
          <option value="" disabled>
            Choose one
          </option>
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
        {errorFor("topic") && <p className="mt-1.5 text-xs text-red-600">{errorFor("topic")}</p>}
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-semibold text-text-tertiary">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Where are you headed, when, and how can we help?"
          onBlur={handleBlur}
          aria-invalid={!!errorFor("message")}
          className={cn("mt-2 resize-y", inputClass, errorFor("message") && "border-red-500")}
        />
        {errorFor("message") && <p className="mt-1.5 text-xs text-red-600">{errorFor("message")}</p>}
      </div>

      {status === "error" && <p className="text-sm text-red-600">{errorMessage}</p>}

      <Button type="submit" size="lg" arrow={false} className="w-full sm:w-auto" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send your message"}
      </Button>
    </form>
  );
}
