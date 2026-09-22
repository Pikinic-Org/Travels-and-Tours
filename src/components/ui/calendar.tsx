"use client";

import { useState } from "react";
import { DayPicker, type Matcher, type MonthCaptionProps } from "react-day-picker";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/search-icons";
import { cn } from "@/lib/utils";

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
};

// Same bordered-square-tile grid pattern used for stats/value tiles elsewhere
// on the site — reused here for the year/month picker grids instead of a
// native <select>.
const tileGrid = "grid grid-cols-4 border-l border-t border-border-primary";
const tile =
  "aspect-square border-b border-r border-border-primary text-sm font-bold uppercase tracking-widest text-text-primary transition-colors hover:bg-neutral-900/[0.03] disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-green-700";
const tileActive = "bg-green-700 text-neutral-0 hover:bg-green-700";
const navButton =
  "inline-flex h-8 w-8 items-center justify-center rounded-[2px] border border-border-primary text-text-secondary transition-colors hover:bg-neutral-900/[0.06] disabled:pointer-events-none disabled:opacity-40";

const GridHeader = ({
  label,
  onLabelClick,
  onPrev,
  onNext,
  prevDisabled,
  nextDisabled,
}: {
  label: string;
  onLabelClick?: () => void;
  onPrev: () => void;
  onNext: () => void;
  prevDisabled: boolean;
  nextDisabled: boolean;
}) => (
  <div className="mb-3 flex h-8 items-center justify-between">
    <button type="button" onClick={onPrev} disabled={prevDisabled} className={navButton} aria-label="Previous">
      <ChevronLeftIcon className="h-4 w-4" />
    </button>
    {onLabelClick ? (
      <button
        type="button"
        onClick={onLabelClick}
        className="text-sm font-bold uppercase tracking-widest text-text-primary transition-colors hover:text-green-700"
      >
        {label}
      </button>
    ) : (
      <span className="text-sm font-bold uppercase tracking-widest text-text-primary">{label}</span>
    )}
    <button type="button" onClick={onNext} disabled={nextDisabled} className={navButton} aria-label="Next">
      <ChevronRightIcon className="h-4 w-4" />
    </button>
  </div>
);

const YEAR_PAGE_SIZE = 12;
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const YearGrid = ({
  pageStart,
  activeYear,
  minYear,
  maxYear,
  onPage,
  onPick,
}: {
  pageStart: number;
  activeYear: number;
  minYear?: number;
  maxYear?: number;
  onPage: (nextPageStart: number) => void;
  onPick: (year: number) => void;
}) => {
  const years = Array.from({ length: YEAR_PAGE_SIZE }, (_, i) => pageStart + i);

  return (
    <div>
      <GridHeader
        label={`${pageStart} – ${pageStart + YEAR_PAGE_SIZE - 1}`}
        onPrev={() => onPage(pageStart - YEAR_PAGE_SIZE)}
        onNext={() => onPage(pageStart + YEAR_PAGE_SIZE)}
        prevDisabled={minYear !== undefined && pageStart <= minYear}
        nextDisabled={maxYear !== undefined && pageStart + YEAR_PAGE_SIZE > maxYear}
      />
      <div className={tileGrid}>
        {years.map((year) => {
          const disabled = (minYear !== undefined && year < minYear) || (maxYear !== undefined && year > maxYear);
          return (
            <button
              key={year}
              type="button"
              disabled={disabled}
              onClick={() => onPick(year)}
              className={cn(tile, year === activeYear && tileActive)}
            >
              {year}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const MonthGrid = ({
  year,
  activeYear,
  activeMonth,
  minYear,
  maxYear,
  startMonth,
  endMonth,
  onYearClick,
  onPrevYear,
  onNextYear,
  onPick,
}: {
  year: number;
  activeYear: number;
  activeMonth: number;
  minYear?: number;
  maxYear?: number;
  startMonth?: Date;
  endMonth?: Date;
  onYearClick: () => void;
  onPrevYear: () => void;
  onNextYear: () => void;
  onPick: (monthIndex: number) => void;
}) => (
  <div>
    <GridHeader
      label={String(year)}
      onLabelClick={onYearClick}
      onPrev={onPrevYear}
      onNext={onNextYear}
      prevDisabled={minYear !== undefined && year <= minYear}
      nextDisabled={maxYear !== undefined && year >= maxYear}
    />
    <div className={tileGrid}>
      {MONTH_LABELS.map((label, index) => {
        const beforeMin =
          startMonth !== undefined &&
          (year < startMonth.getFullYear() || (year === startMonth.getFullYear() && index < startMonth.getMonth()));
        const afterMax =
          endMonth !== undefined &&
          (year > endMonth.getFullYear() || (year === endMonth.getFullYear() && index > endMonth.getMonth()));
        const active = year === activeYear && index === activeMonth;
        return (
          <button
            key={label}
            type="button"
            disabled={beforeMin || afterMax}
            onClick={() => onPick(index)}
            className={cn(tile, active && tileActive)}
          >
            {label}
          </button>
        );
      })}
    </div>
  </div>
);

type View = "days" | "months" | "years";

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
  // A click-through year grid then month grid instead of prev/next-only
  // navigation — for a date that can be decades away (birth date, passport
  // dates), not just a few months out like a flight departure. No native
  // <select> involved anywhere, unlike react-day-picker's own dropdown mode.
  withYearNav?: boolean;
}) => {
  const initial = defaultMonth ?? selected ?? new Date();
  const [view, setView] = useState<View>("days");
  const [month, setMonth] = useState(initial);
  const [yearPageStart, setYearPageStart] = useState(
    () => Math.floor(initial.getFullYear() / YEAR_PAGE_SIZE) * YEAR_PAGE_SIZE
  );

  const minYear = startMonth?.getFullYear();
  const maxYear = endMonth?.getFullYear();

  if (withYearNav && view === "years") {
    return (
      <YearGrid
        pageStart={yearPageStart}
        activeYear={month.getFullYear()}
        minYear={minYear}
        maxYear={maxYear}
        onPage={setYearPageStart}
        onPick={(year) => {
          setMonth(new Date(year, month.getMonth(), 1));
          setView("months");
        }}
      />
    );
  }

  if (withYearNav && view === "months") {
    const year = month.getFullYear();
    return (
      <MonthGrid
        year={year}
        activeYear={month.getFullYear()}
        activeMonth={month.getMonth()}
        minYear={minYear}
        maxYear={maxYear}
        startMonth={startMonth}
        endMonth={endMonth}
        onYearClick={() => {
          setYearPageStart(Math.floor(year / YEAR_PAGE_SIZE) * YEAR_PAGE_SIZE);
          setView("years");
        }}
        onPrevYear={() => setMonth(new Date(year - 1, month.getMonth(), 1))}
        onNextYear={() => setMonth(new Date(year + 1, month.getMonth(), 1))}
        onPick={(monthIndex) => {
          setMonth(new Date(year, monthIndex, 1));
          setView("days");
        }}
      />
    );
  }

  return (
    <DayPicker
      mode="single"
      required
      selected={selected}
      onSelect={onSelect}
      disabled={disabled}
      numberOfMonths={1}
      month={month}
      onMonthChange={setMonth}
      weekStartsOn={0}
      showOutsideDays={false}
      modifiers={modifiers}
      modifiersClassNames={modifiersClassNames}
      classNames={classNames}
      startMonth={startMonth}
      endMonth={endMonth}
      components={
        withYearNav
          ? {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars -- must be excluded from `rest`, which is spread onto a <div>
              MonthCaption: ({ calendarMonth, displayIndex, className, children, ...rest }: MonthCaptionProps) => (
                <div className={className} {...rest}>
                  <button
                    type="button"
                    onClick={() => {
                      const year = calendarMonth.date.getFullYear();
                      setYearPageStart(Math.floor(year / YEAR_PAGE_SIZE) * YEAR_PAGE_SIZE);
                      setView("years");
                    }}
                    className="text-sm font-bold uppercase tracking-widest text-text-primary transition-colors hover:text-green-700"
                  >
                    {children}
                  </button>
                </div>
              ),
            }
          : undefined
      }
    />
  );
};
