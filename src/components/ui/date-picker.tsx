"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "@/components/ui/search-icons";
import { formatIsoDate, fromIsoDate, startOfToday, toIsoDate } from "@/lib/dates";
import { cn } from "@/lib/utils";

// Closes on a click outside the element or on Escape.
const useDismiss = (ref: RefObject<HTMLElement | null>, active: boolean, dismiss: () => void) => {
  useEffect(() => {
    if (!active) return;

    const onPointerDown = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) dismiss();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [ref, active, dismiss]);
};

const DateTrigger = ({
  label,
  value,
  placeholder,
  open,
  onClick,
}: {
  label: string;
  value: string;
  placeholder: string;
  open: boolean;
  onClick: () => void;
}) => {
  const display = formatIsoDate(value);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-label={`${label}: ${display ?? "not chosen"}`}
      className="flex w-full items-center justify-between gap-2 text-left"
    >
      <span className={cn("truncate text-base font-bold", display ? "text-text-primary" : "text-text-tertiary")}>
        {display ?? placeholder}
      </span>
      <CalendarIcon className="h-4 w-4 shrink-0 text-text-tertiary" />
    </button>
  );
};

const CalendarPanel = ({ title, children }: { title: string; children: ReactNode }) => (
  <div
    role="dialog"
    aria-label={title}
    className="absolute right-0 top-full z-30 mt-2 max-w-[calc(100vw-2rem)] rounded-[2px] border border-border-primary bg-surface-primary p-4 shadow-lg"
  >
    <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-text-tertiary">{title}</p>
    {children}
  </div>
);

// One date: one-way trips and each leg of a multi-city trip. `min` (an ISO
// date) blocks anything earlier — a leg can't start before the one before it.
export const DatePickerField = ({
  label,
  value,
  onChange,
  min,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  useDismiss(ref, open, () => setOpen(false));

  const earliest = (min ? fromIsoDate(min) : undefined) ?? startOfToday();

  return (
    <div ref={ref} className="relative">
      <DateTrigger label={label} value={value} placeholder="Select date" open={open} onClick={() => setOpen((v) => !v)} />
      {open && (
        <CalendarPanel title={label}>
          <Calendar
            selected={fromIsoDate(value)}
            disabled={{ before: earliest }}
            onSelect={(date) => {
              onChange(toIsoDate(date));
              setOpen(false);
            }}
          />
        </CalendarPanel>
      )}
    </div>
  );
};

type RangeValue = { depart: string; return: string };

const RANGE_EDGE = "[&>button]:bg-green-700 [&>button]:text-neutral-0 [&>button:hover]:bg-green-700";

// Round trip: departure and return sit side by side and share one calendar.
// Picking the departure moves straight on to the return date; the days
// between the two are tinted, and the return can't be before the departure.
export const DateRangePickerField = ({
  depart,
  returnDate,
  onChange,
}: {
  depart: string;
  returnDate: string;
  onChange: (value: RangeValue) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [picking, setPicking] = useState<"depart" | "return" | null>(null);
  useDismiss(ref, picking !== null, () => setPicking(null));

  const departDate = fromIsoDate(depart);
  const returnDay = fromIsoDate(returnDate);
  const today = startOfToday();

  const handleSelect = (date: Date) => {
    if (picking === "depart") {
      // A return earlier than the new departure no longer makes sense.
      const keepReturn = returnDay !== undefined && returnDay >= date;
      onChange({ depart: toIsoDate(date), return: keepReturn ? returnDate : "" });
      setPicking("return");
    } else {
      onChange({ depart, return: toIsoDate(date) });
      setPicking(null);
    }
  };

  const toggle = (which: "depart" | "return") => setPicking((current) => (current === which ? null : which));
  const cell = "flex flex-col justify-center gap-1 px-5 py-4 sm:px-6";

  return (
    <div
      ref={ref}
      className="relative grid grid-cols-2 border-b border-r border-border-primary sm:col-span-2 lg:col-span-2"
    >
      <div className={cn(cell, "border-r border-border-primary")}>
        <DateTrigger
          label="Depart"
          value={depart}
          placeholder="Depart"
          open={picking === "depart"}
          onClick={() => toggle("depart")}
        />
      </div>
      <div className={cell}>
        <DateTrigger
          label="Return"
          value={returnDate}
          placeholder="Return"
          open={picking === "return"}
          onClick={() => toggle("return")}
        />
      </div>

      {picking && (
        <CalendarPanel title={picking === "depart" ? "Departure date" : "Return date"}>
          <Calendar
            selected={picking === "depart" ? departDate : returnDay}
            defaultMonth={picking === "return" ? (returnDay ?? departDate) : departDate}
            disabled={{ before: picking === "return" && departDate ? departDate : today }}
            modifiers={{
              rangeStart: departDate ?? false,
              rangeEnd: returnDay ?? false,
              inRange: departDate && returnDay ? { after: departDate, before: returnDay } : false,
            }}
            modifiersClassNames={{ rangeStart: RANGE_EDGE, rangeEnd: RANGE_EDGE, inRange: "bg-green-100" }}
            onSelect={handleSelect}
          />
        </CalendarPanel>
      )}
    </div>
  );
};
