"use client";

import { useState } from "react";
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

type Parts = { day: string; month: string; year: string };

const partsFromValue = (value: string): Parts => {
  const [year = "", month = "", day = ""] = value ? value.split("-") : [];
  return { day, month, year };
};

// Same field SkyLink wants (dob / passport_issue_date / passport_expiry are
// all plain "YYYY-MM-DD" strings) — three plain <select>s instead of a native
// date input, matching how 247Travels' own booking form takes a birth date.
//
// Keeps its own day/month/year state rather than deriving it from `value`:
// the parent only receives a value once all three parts are chosen, so if the
// three selects read straight from `value` each partial pick (e.g. just the
// day) would render as "" again on the next keystroke — the selection visibly
// not sticking. Local state remembers each part as it's picked; `value` is
// only ever the fully-resolved date once complete.
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
  const [parts, setParts] = useState<Parts>(() => partsFromValue(value));
  // Tracks the last `value` we've seen, so an external change (e.g. the form
  // resetting this field) can be told apart from render to render — adjusted
  // during render itself, not in an effect, per React's guidance for syncing
  // local state to a changed prop.
  const [lastSeenValue, setLastSeenValue] = useState(value);
  const years = yearsDescending(minYear, maxYear);

  if (value !== lastSeenValue) {
    setLastSeenValue(value);
    // A reset to "" while a part is already picked is *our own* onChange
    // firing below (still-incomplete date), not an external reset — ignore
    // it, or the part the visitor just picked would visibly disappear.
    if (!(value === "" && (parts.day || parts.month || parts.year))) {
      setParts(partsFromValue(value));
    }
  }

  const set = (patch: Partial<Parts>) => {
    const next = { ...parts, ...patch };
    setParts(next);
    onChange(next.day && next.month && next.year ? `${next.year}-${next.month}-${next.day}` : "");
  };

  return (
    <FormField label={label}>
      <div className="grid grid-cols-3 gap-2">
        <select
          required
          aria-label={`${label} — day`}
          value={parts.day}
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
          value={parts.month}
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
          value={parts.year}
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
