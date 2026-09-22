"use client";

import { DayPicker, type Matcher } from "react-day-picker";

// react-day-picker's own stylesheet isn't used: it's unlayered CSS, so it would
// beat Tailwind utilities. Every part is styled here with the site's tokens
// instead — sharp 2px corners, green-700 for the chosen days.
const classNames = {
  root: "relative",
  months: "relative flex flex-col",
  month: "flex flex-col gap-3",
  month_caption: "flex h-8 items-center justify-center",
  caption_label: "text-sm font-bold uppercase tracking-widest text-text-primary",
  nav: "absolute inset-x-0 top-0 z-10 flex items-center justify-between",
  button_previous:
    "inline-flex h-8 w-8 items-center justify-center rounded-[2px] border border-border-primary text-text-secondary transition-colors hover:bg-neutral-900/[0.06] disabled:pointer-events-none disabled:opacity-40",
  button_next:
    "inline-flex h-8 w-8 items-center justify-center rounded-[2px] border border-border-primary text-text-secondary transition-colors hover:bg-neutral-900/[0.06] disabled:pointer-events-none disabled:opacity-40",
  chevron: "h-4 w-4 fill-current",
  month_grid: "w-full border-collapse",
  weekday: "h-9 w-10 text-center text-[11px] font-semibold uppercase tracking-widest text-text-tertiary",
  day: "h-10 w-10 p-0 text-center text-sm",
  day_button:
    "flex h-10 w-10 items-center justify-center rounded-[2px] font-medium text-text-primary transition-colors hover:bg-neutral-900/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700",
  selected: "[&>button]:bg-green-700 [&>button]:text-neutral-0 [&>button:hover]:bg-green-700",
  today: "[&>button]:font-bold [&>button]:text-green-700",
  disabled: "[&>button]:pointer-events-none [&>button]:text-text-tertiary [&>button]:opacity-40",
  outside: "opacity-40",
  hidden: "invisible",
  // Only rendered when captionLayout is "dropdown" — jumping straight to a
  // year (e.g. picking a birth date decades back) instead of clicking
  // "previous month" hundreds of times. Styled as plain visible selects
  // (not the usual invisible-overlay-on-styled-label trick) so it's
  // guaranteed to render correctly without needing to match react-day-
  // picker's exact internal markup.
  dropdowns: "flex items-center gap-1.5",
  months_dropdown:
    "rounded-[2px] border border-border-primary bg-surface-primary px-2 py-1 text-sm font-bold uppercase tracking-widest text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700",
  years_dropdown:
    "rounded-[2px] border border-border-primary bg-surface-primary px-2 py-1 text-sm font-bold uppercase tracking-widest text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700",
};

// Single-date calendar. Callers that need more (like the round-trip range
// highlight) pass modifiers + modifiersClassNames.
export const Calendar = ({
  selected,
  onSelect,
  disabled,
  defaultMonth,
  modifiers,
  modifiersClassNames,
  startMonth,
  endMonth,
  withYearNav = false,
}: {
  selected?: Date;
  onSelect: (date: Date) => void;
  disabled?: Matcher | Matcher[];
  defaultMonth?: Date;
  modifiers?: Record<string, Matcher | Matcher[]>;
  modifiersClassNames?: Record<string, string>;
  startMonth?: Date;
  endMonth?: Date;
  // Month/year dropdowns instead of prev/next-only navigation — for a date
  // that can be decades away (birth date, passport dates), not just a few
  // months out like a flight departure.
  withYearNav?: boolean;
}) => {
  return (
    <DayPicker
      mode="single"
      required
      selected={selected}
      onSelect={onSelect}
      disabled={disabled}
      numberOfMonths={1}
      defaultMonth={defaultMonth ?? selected}
      weekStartsOn={0}
      showOutsideDays={false}
      modifiers={modifiers}
      modifiersClassNames={modifiersClassNames}
      classNames={classNames}
      captionLayout={withYearNav ? "dropdown" : "label"}
      startMonth={startMonth}
      endMonth={endMonth}
    />
  );
};
