"use client";

import { Popover } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type PassengerCounts = {
  adults: number;
  children: number;
  infants: number;
};

function formatPassengers({ adults, children, infants }: PassengerCounts) {
  const parts = [`${adults} ${adults === 1 ? "Adult" : "Adults"}`];
  if (children > 0) parts.push(`${children} ${children === 1 ? "Child" : "Children"}`);
  if (infants > 0) parts.push(`${infants} ${infants === 1 ? "Infant" : "Infants"}`);
  return parts.join(", ");
}

function CounterRow({
  label,
  sublabel,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  sublabel: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-3">
      <div>
        <p className="text-sm font-semibold text-text-primary">{label}</p>
        <p className="text-xs text-text-tertiary">{sublabel}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-border-primary text-text-secondary transition-colors hover:border-green-700 hover:text-green-700 disabled:pointer-events-none disabled:opacity-30"
        >
          −
        </button>
        <span className="w-4 text-center text-sm font-bold text-text-primary">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-border-primary text-text-secondary transition-colors hover:border-green-700 hover:text-green-700 disabled:pointer-events-none disabled:opacity-30"
        >
          +
        </button>
      </div>
    </div>
  );
}

export function PassengersSelect({
  value,
  onChange,
  className,
}: {
  value: PassengerCounts;
  onChange: (value: PassengerCounts) => void;
  className?: string;
}) {
  return (
    <Popover
      align="right"
      mobileAlign="center"
      className={className}
      trigger={({ toggle, open }) => (
        <button
          type="button"
          onClick={toggle}
          aria-haspopup="dialog"
          aria-expanded={open}
          className="flex items-center gap-2 rounded-sm border border-border-primary px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-text-primary transition-colors hover:bg-neutral-900/[0.06]"
        >
          {formatPassengers(value)}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("h-3 w-3 transition-transform duration-200", open && "rotate-180")}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      )}
    >
      {({ close }) => (
        <div className="w-[85vw] max-w-72 rounded-[2px] border border-border-primary bg-surface-primary p-4 shadow-lg">
          <div className="divide-y divide-border-primary">
            <CounterRow
              label="Adults"
              sublabel="12+ years"
              value={value.adults}
              min={1}
              max={9}
              onChange={(adults) =>
                onChange({ ...value, adults, infants: Math.min(value.infants, adults) })
              }
            />
            <CounterRow
              label="Children"
              sublabel="2–11 years"
              value={value.children}
              min={0}
              max={8}
              onChange={(children) => onChange({ ...value, children })}
            />
            <CounterRow
              label="Infants"
              sublabel="Under 2"
              value={value.infants}
              min={0}
              max={value.adults}
              onChange={(infants) => onChange({ ...value, infants })}
            />
          </div>
          <button
            type="button"
            onClick={close}
            className="mt-3 w-full rounded-sm bg-green-700 py-2 text-sm font-semibold uppercase tracking-wide text-neutral-0 transition-colors hover:bg-green-800"
          >
            Done
          </button>
        </div>
      )}
    </Popover>
  );
}
