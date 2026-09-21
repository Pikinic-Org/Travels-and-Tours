import { FormField, inputClass } from "@/components/checkout/form-field";
import { digitsOnly } from "@/lib/checkout-form";
import type { ContactFormState } from "@/types";

export const ContactFields = ({
  value,
  onChange,
}: {
  value: ContactFormState;
  onChange: <K extends keyof ContactFormState>(field: K, value: ContactFormState[K]) => void;
}) => (
  <div className="space-y-4">
    <h2 className="text-sm font-semibold uppercase tracking-widest text-text-tertiary">Contact Information</h2>
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField label="Email">
        <input
          required
          type="email"
          value={value.email}
          onChange={(event) => onChange("email", event.target.value)}
          className={inputClass}
        />
      </FormField>
      <FormField label="Phone">
        <input
          required
          type="tel"
          inputMode="numeric"
          maxLength={15}
          value={value.phone}
          onChange={(event) => onChange("phone", digitsOnly(event.target.value))}
          className={inputClass}
        />
      </FormField>
    </div>
  </div>
);
