import { DatePartsSelect } from "@/components/checkout/date-parts-select";
import { FormField, inputClass } from "@/components/checkout/form-field";
import { alphanumericUpper, countryCodes, digitsOnly, travellerTitles } from "@/lib/checkout-form";
import type { ContactFormState, TravellerFormState } from "@/types";

const CURRENT_YEAR = new Date().getFullYear();

type TravellerFieldsProps = {
  value: TravellerFormState;
  onChange: <K extends keyof TravellerFormState>(field: K, value: TravellerFormState[K]) => void;
} & (
  | {
      isLead: true;
      contact: ContactFormState;
      onContactChange: <K extends keyof ContactFormState>(field: K, value: ContactFormState[K]) => void;
    }
  | { isLead?: false; contact?: undefined; onContactChange?: undefined }
);

// SkyLink only requires email + phone on primary_guest (the lead traveller) —
// every other traveller skips them entirely, matching 247Travels' own booking
// form, which shows contact fields on "Lead Traveler" only.
export const TravellerFields = (props: TravellerFieldsProps) => {
  const { value, onChange } = props;

  return (
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

      {props.isLead && (
        <FormField label="Contact Email">
          <input
            required
            type="email"
            value={props.contact.email}
            onChange={(e) => props.onContactChange("email", e.target.value)}
            className={inputClass}
          />
        </FormField>
      )}

      <FormField label="Country Code">
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

      {props.isLead && (
        <FormField label="Contact Phone">
          <input
            required
            type="tel"
            inputMode="numeric"
            maxLength={15}
            value={props.contact.phone}
            onChange={(e) => props.onContactChange("phone", digitsOnly(e.target.value))}
            className={inputClass}
          />
        </FormField>
      )}

      <DatePartsSelect
        label="Date of Birth"
        value={value.dob}
        onChange={(v) => onChange("dob", v)}
        minYear={CURRENT_YEAR - 100}
        maxYear={CURRENT_YEAR}
      />

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

      <DatePartsSelect
        label="Passport Issue Date"
        value={value.passport_issue_date}
        onChange={(v) => onChange("passport_issue_date", v)}
        minYear={CURRENT_YEAR - 15}
        maxYear={CURRENT_YEAR}
      />

      <DatePartsSelect
        label="Passport Expiry"
        value={value.passport_expiry}
        onChange={(v) => onChange("passport_expiry", v)}
        minYear={CURRENT_YEAR}
        maxYear={CURRENT_YEAR + 15}
      />
    </div>
  );
};
