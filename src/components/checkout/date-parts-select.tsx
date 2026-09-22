import { FormField, inputClass } from "@/components/checkout/form-field";

const MONTHS = [
  ["01", "Jan"], ["02", "Feb"], ["03", "Mar"], ["04", "Apr"],
  ["05", "May"], ["06", "Jun"], ["07", "Jul"], ["08", "Aug"],
  ["09", "Sep"], ["10", "Oct"], ["11", "Nov"], ["12", "Dec"],
] as const;

const pad = (value: number): string => String(value).padStart(2, "0");
const days = Array.from({ length: 31 }, (_, i) => pad(i + 1));

// Descending so the most likely years (closest to maxYear) sit at the top of
// the list — nicer for scrolling to a recent passport-issue year, and for a
// birth year that's usually well before today but not centuries back either.
const yearsDescending = (minYear: number, maxYear: number): string[] =>
  Array.from({ length: maxYear - minYear + 1 }, (_, i) => String(maxYear - i));

// Same field SkyLink wants (dob / passport_issue_date / passport_expiry are
// all plain "YYYY-MM-DD" strings) — three plain <select>s instead of a native
// date input, matching how 247Travels' own booking form takes a birth date.
// The value only changes once all three parts are picked, so a half-filled
// date is never sent as a malformed string.
export const DatePartsSelect = ({
  label,
  value,
  onChange,
  minYear,
  maxYear,
}: {
  label: string;
  value: string; // "" or "YYYY-MM-DD"
  onChange: (value: string) => void;
  minYear: number;
  maxYear: number;
}) => {
  const [year = "", month = "", day = ""] = value ? value.split("-") : [];
  const years = yearsDescending(minYear, maxYear);

  const set = (next: { day?: string; month?: string; year?: string }) => {
    const nextDay = next.day ?? day;
    const nextMonth = next.month ?? month;
    const nextYear = next.year ?? year;
    onChange(nextDay && nextMonth && nextYear ? `${nextYear}-${nextMonth}-${nextDay}` : "");
  };

  return (
    <FormField label={label}>
      <div className="grid grid-cols-3 gap-2">
        <select
          required
          aria-label={`${label} — day`}
          value={day}
          onChange={(event) => set({ day: event.target.value })}
          className={inputClass}
        >
          <option value="">Day</option>
          {days.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select
          required
          aria-label={`${label} — month`}
          value={month}
          onChange={(event) => set({ month: event.target.value })}
          className={inputClass}
        >
          <option value="">Month</option>
          {MONTHS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          required
          aria-label={`${label} — year`}
          value={year}
          onChange={(event) => set({ year: event.target.value })}
          className={inputClass}
        >
          <option value="">Year</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </FormField>
  );
};
