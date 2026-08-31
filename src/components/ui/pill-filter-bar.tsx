"use client";

import { cn } from "@/lib/utils";

// Generic single-select pill row — used for /packages category filters and
// /blogs category filters alike, so a new filterable listing just supplies
// its own options array instead of a new filter-bar component.
export function PillFilterBar<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="scroll-snap-row flex gap-2 overflow-x-auto pb-1">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "shrink-0 rounded-[2px] border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors",
            value === option
              ? "border-green-700 bg-green-700 text-neutral-0"
              : "border-border-primary text-text-secondary hover:bg-neutral-900/[0.06]"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
