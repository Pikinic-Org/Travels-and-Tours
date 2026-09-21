import { FormField, inputClass } from "@/components/checkout/form-field";
import { alphanumericUpper, countryCodes, travellerTitles } from "@/lib/checkout-form";
import type { TravellerFormState } from "@/types";

export const TravellerFields = ({
  value,
  onChange,
}: {
  value: TravellerFormState;
  onChange: <K extends keyof TravellerFormState>(field: K, value: TravellerFormState[K]) => void;
}) => (
  <div className="grid gap-4 sm:grid-cols-2">
    <FormField label="Title">
      <select value={value.title} onChange={(e) => onChange("title", e.target.value)} className={inputClass}>
        {travellerTitles.map((title) => (
          <option key={title} value={title}>
            {title}
          </option>
        ))}
      </select>
    </FormField>
    <FormField label="Gender">
      <select value={value.gender} onChange={(e) => onChange("gender", e.target.value)} className={inputClass}>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
    </FormField>
    <FormField label="First Name">
      <input
        required
        value={value.first_name}
        onChange={(e) => onChange("first_name", e.target.value)}
        className={inputClass}
      />
    </FormField>
    <FormField label="Last Name">
      <input
        required
        value={value.last_name}
        onChange={(e) => onChange("last_name", e.target.value)}
        className={inputClass}
      />
    </FormField>
    <FormField label="Other Name (optional)">
      <input
        value={value.other_name}
        onChange={(e) => onChange("other_name", e.target.value)}
        className={inputClass}
      />
    </FormField>
    <FormField label="Phone Country Code">
      <select
        required
        value={value.country_code}
        onChange={(e) => onChange("country_code", e.target.value)}
        className={inputClass}
      >
        {countryCodes.map((country) => (
          <option key={country.code} value={country.code}>
            {country.label}
          </option>
        ))}
      </select>
    </FormField>
    <FormField label="Date of Birth">
      <input
        required
        type="date"
        value={value.dob}
        onChange={(e) => onChange("dob", e.target.value)}
        className={inputClass}
      />
    </FormField>
    <FormField label="Nationality (ISO code)">
      <input
        required
        maxLength={2}
        value={value.nationality}
        onChange={(e) => onChange("nationality", e.target.value.toUpperCase())}
        className={inputClass}
      />
    </FormField>
    <FormField label="Passport Number">
      <input
        required
        value={value.passport_number}
        onChange={(e) => onChange("passport_number", alphanumericUpper(e.target.value))}
        minLength={6}
        maxLength={9}
        autoCapitalize="characters"
        className={inputClass}
      />
    </FormField>
    <FormField label="Passport Issue Date">
      <input
        required
        type="date"
        value={value.passport_issue_date}
        onChange={(e) => onChange("passport_issue_date", e.target.value)}
        className={inputClass}
      />
    </FormField>
    <FormField label="Passport Expiry">
      <input
        required
        type="date"
        value={value.passport_expiry}
        onChange={(e) => onChange("passport_expiry", e.target.value)}
        className={inputClass}
      />
    </FormField>
  </div>
);
