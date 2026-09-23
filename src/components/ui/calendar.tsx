"use client";

import { useEffect, useRef, useState } from "react";
import { DayPicker, type Matcher, type MonthCaptionProps } from "react-day-picker";
import { ChevronRightIcon } from "@/components/ui/search-icons";
import { useDismiss } from "@/lib/use-dismiss";
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
  // Full-width + absolute so the two arrow buttons can sit at opposite
  // edges — but that means its (invisible) middle would otherwise overlap
  // and swallow clicks meant for the caption's dropdown buttons underneath.
  // pointer-events-none on the row + pointer-events-auto on each button
  // lets clicks pass through everywhere except the actual arrows.
  nav: "absolute inset-x-0 top-0 z-10 flex items-center justify-between pointer-events-none",
  button_previous:
    "pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-[2px] border border-border-primary text-text-secondary transition-colors hover:bg-neutral-900/[0.06] disabled:pointer-events-none disabled:opacity-40",
  button_next:
    "pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-[2px] border border-border-primary text-text-secondary transition-colors hover:bg-neutral-900/[0.06] disabled:pointer-events-none disabled:opacity-40",
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

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type DropdownItem = {
  key: string | number;
  label: string;
  active: boolean;
  disabled?: boolean;
  onPick: () => void;
};

// A compact button + custom-rendered list — same visual idea as shadcn's
// month/year dropdowns, but no native <select> anywhere (that read as a
// browser form control dropped into an otherwise fully custom calendar).
const DropdownButton = ({ label, open, onClick }: { label: string; open: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    aria-haspopup="listbox"
    aria-expanded={open}
    className="inline-flex items-center gap-1 rounded-[2px] border border-border-primary bg-surface-primary px-2.5 py-1 text-sm font-bold uppercase tracking-widest text-text-primary transition-colors hover:border-neutral-400 hover:text-green-700"
  >
    {label}
    <ChevronRightIcon className="h-3 w-3 rotate-90" />
  </button>
);

const DropdownList = ({ items }: { items: DropdownItem[] }) => {
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "center" });
  }, []);

  return (
    <div
      role="listbox"
      className="absolute left-1/2 top-full z-20 mt-1 max-h-52 w-24 -translate-x-1/2 overflow-y-auto rounded-[2px] border border-border-primary bg-surface-primary py-1 shadow-lg"
    >
      {items.map((item) => (
        <button
          key={item.key}
          ref={item.active ? activeRef : undefined}
          type="button"
          role="option"
          aria-selected={item.active}
          disabled={item.disabled}
          onClick={item.onPick}
          className={cn(
            "block w-full px-3 py-1.5 text-left text-sm font-semibold text-text-primary transition-colors hover:bg-neutral-900/[0.06] disabled:pointer-events-none disabled:opacity-40",
            item.active && "bg-green-700 text-neutral-0 hover:bg-green-700"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
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
  // Month + year dropdown buttons in the caption instead of prev/next-only
  // navigation — for a date that can be decades away (birth date, passport
  // dates), not just a few months out like a flight departure. No native
  // <select> involved, unlike react-day-picker's own dropdown mode.
  withYearNav?: boolean;
}) => {
  const initial = defaultMonth ?? selected ?? new Date();
  const [month, setMonth] = useState(initial);
  const [openDropdown, setOpenDropdown] = useState<"month" | "year" | null>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  useDismiss(captionRef, openDropdown !== null, () => setOpenDropdown(null));

  const minYear = startMonth?.getFullYear();
  const maxYear = endMonth?.getFullYear();
  const activeYear = month.getFullYear();
  const activeMonthIndex = month.getMonth();

  const monthItems: DropdownItem[] = MONTH_LABELS.map((label, index) => {
    const beforeMin =
      startMonth !== undefined &&
      (activeYear < startMonth.getFullYear() || (activeYear === startMonth.getFullYear() && index < startMonth.getMonth()));
    const afterMax =
      endMonth !== undefined &&
      (activeYear > endMonth.getFullYear() || (activeYear === endMonth.getFullYear() && index > endMonth.getMonth()));
    return {
      key: index,
      label,
      active: index === activeMonthIndex,
      disabled: beforeMin || afterMax,
      onPick: () => {
        setMonth(new Date(activeYear, index, 1));
        setOpenDropdown(null);
      },
    };
  });

  const yearItems: DropdownItem[] =
    minYear !== undefined && maxYear !== undefined
      ? Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i).map((year) => ({
          key: year,
          label: String(year),
          active: year === activeYear,
          onPick: () => {
            setMonth(new Date(year, activeMonthIndex, 1));
            setOpenDropdown(null);
          },
        }))
      : [];

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
              // eslint-disable-next-line @typescript-eslint/no-unused-vars -- calendarMonth/displayIndex must be excluded from `rest`, which is spread onto a <div>
              MonthCaption: ({ calendarMonth, displayIndex, className, children: _children, ...rest }: MonthCaptionProps) => (
                <div className={className} {...rest}>
                  <div ref={captionRef} className="flex items-center gap-2">
                    <div className="relative">
                      <DropdownButton
                        label={MONTH_LABELS[activeMonthIndex]}
                        open={openDropdown === "month"}
                        onClick={() => setOpenDropdown((v) => (v === "month" ? null : "month"))}
                      />
                      {openDropdown === "month" && <DropdownList items={monthItems} />}
                    </div>
                    <div className="relative">
                      <DropdownButton
                        label={String(activeYear)}
                        open={openDropdown === "year"}
                        onClick={() => setOpenDropdown((v) => (v === "year" ? null : "year"))}
                      />
                      {openDropdown === "year" && <DropdownList items={yearItems} />}
                    </div>
                  </div>
                </div>
              ),
            }
          : undefined
      }
    />
  );
};
