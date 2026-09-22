import { DatePickerField } from "@/components/ui/date-picker";
import { FormField, inputClass, selectClass } from "@/components/checkout/form-field";
import { alphanumericUpper, countryCodes, digitsOnly, travellerTitles } from "@/lib/checkout-form";
import { countries } from "@/lib/countries";
import { toIsoDate } from "@/lib/dates";
import type { ContactFormState, TravellerFormState } from "@/types";

const today = new Date();
const isoToday = toIsoDate(today);
const isoYearsAgo = (years: number) => toIsoDate(new Date(today.getFullYear() - years, today.getMonth(), today.getDate()));
const isoYearsFromNow = (years: number) =>
  toIsoDate(new Date(today.getFullYear() + years, today.getMonth(), today.getDate()));

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
// Row layout: Title/Gender/First/Last/Other Name share one row, five equal
// columns. Contact Email sits alone (half width). Country Code, Nationality
// and Contact Phone share the next row. Date of Birth and Passport Number
// each sit alone (half width). Passport Issue/Expiry share the final row.
export const TravellerFields = (props: TravellerFieldsProps) => {
  const { value, onChange } = props;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <FormField label="Title">
          <select value={value.title} onChange={(e) => onChange("title", e.target.value)} className={selectClass}>
            {travellerTitles.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Gender">
          <select value={value.gender} onChange={(e) => onChange("gender", e.target.value)} className={selectClass}>
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
      </div>

      {props.isLead && (
        <>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-text-primary">
              Contact Information
            </h3>
            <p className="mt-1 text-xs text-text-secondary">Booking confirmation will be sent to this email.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Contact Email">
              <input
                required
                type="email"
                value={props.contact.email}
                onChange={(e) => props.onContactChange("email", e.target.value)}
                className={inputClass}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormField label="Country Code">
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
            <FormField label="Nationality">
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
          </div>
        </>
      )}

      {!props.isLead && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Country Code">
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
          <FormField label="Nationality">
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
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <DatePickerField
          label="Date of Birth"
          value={value.dob}
          onChange={(v) => onChange("dob", v)}
          min={isoYearsAgo(100)}
          max={isoToday}
          withYearNav
          boxed
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
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
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DatePickerField
          label="Passport Issue Date"
          value={value.passport_issue_date}
          onChange={(v) => onChange("passport_issue_date", v)}
          min={isoYearsAgo(15)}
          max={isoToday}
          withYearNav
          boxed
        />
        <DatePickerField
          label="Passport Expiry"
          value={value.passport_expiry}
          onChange={(v) => onChange("passport_expiry", v)}
          min={isoToday}
          max={isoYearsFromNow(15)}
          withYearNav
          boxed
        />
      </div>
    </div>
  );
};
