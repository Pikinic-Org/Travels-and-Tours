import { DatePartsSelect } from "@/components/checkout/date-parts-select";
import { FormField, inputClass, selectClass } from "@/components/checkout/form-field";
import { alphanumericUpper, countryCodes, digitsOnly, travellerTitles } from "@/lib/checkout-form";
import { countries } from "@/lib/countries";
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
//
// Fields sit in a wrapping row, each sized to what it actually holds (a Title
// select doesn't need to be as wide as a Passport Number box) — checked
// against Wakanow's own booking form, which does the same: Title, DOB day/
// month/year, and Gender are all narrow and share a row; nothing stretches
// to fill space just because its grid cell happens to be wide.
export const TravellerFields = (props: TravellerFieldsProps) => {
  const { value, onChange } = props;

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-6">
      <FormField label="Title" className="w-28">
        <select value={value.title} onChange={(e) => onChange("title", e.target.value)} className={selectClass}>
          {travellerTitles.map((title) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))}
        </select>
      </FormField>
      <FormField label="Gender" className="w-32">
        <select value={value.gender} onChange={(e) => onChange("gender", e.target.value)} className={selectClass}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </FormField>
      <FormField label="First Name" className="w-48">
        <input
          required
          value={value.first_name}
          onChange={(e) => onChange("first_name", e.target.value)}
          className={inputClass}
        />
      </FormField>
      <FormField label="Last Name" className="w-48">
        <input
          required
          value={value.last_name}
          onChange={(e) => onChange("last_name", e.target.value)}
          className={inputClass}
        />
      </FormField>
      <FormField label="Other Name (optional)" className="w-48">
        <input
          value={value.other_name}
          onChange={(e) => onChange("other_name", e.target.value)}
          className={inputClass}
        />
      </FormField>

      {props.isLead && (
        <>
          <div className="w-full">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-text-primary">
              Contact Information
            </h3>
            <p className="mt-1 text-xs text-text-secondary">Booking confirmation will be sent to this email.</p>
          </div>
          <FormField label="Contact Email" className="w-64">
            <input
              required
              type="email"
              value={props.contact.email}
              onChange={(e) => props.onContactChange("email", e.target.value)}
              className={inputClass}
            />
          </FormField>
        </>
      )}

      <FormField label="Country Code" className="w-44">
        <select
          required
          value={value.country_code}
          onChange={(e) => onChange("country_code", e.target.value)}
          className={selectClass}
        >
          {countryCodes.map((country) => (
            <option key={country.code} value={country.code}>
              {country.label}
            </option>
          ))}
        </select>
      </FormField>

      {props.isLead && (
        <FormField label="Contact Phone" className="w-44">
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
        className="w-64"
      />

      <FormField label="Nationality" className="w-56">
        <select
          required
          value={value.nationality}
          onChange={(e) => onChange("nationality", e.target.value)}
          className={selectClass}
        >
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Passport Number" className="w-44">
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
        className="w-64"
      />

      <DatePartsSelect
        label="Passport Expiry"
        value={value.passport_expiry}
        onChange={(v) => onChange("passport_expiry", v)}
        minYear={CURRENT_YEAR}
        maxYear={CURRENT_YEAR + 15}
        className="w-64"
      />
    </div>
  );
};
