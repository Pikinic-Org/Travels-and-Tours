"use client";

import { Popover } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

// Custom "select" — a Popover trigger showing the current value plus a
// scrollable option list, in place of a native <select>.
export function ListSelect({
  label,
  options,
  value,
  onChange,
  triggerClassName,
  panelClassName,
  wrapperClassName = "w-full",
  align = "left",
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  triggerClassName?: string;
  panelClassName?: string;
  wrapperClassName?: string;
  align?: "left" | "right";
}) {
  return (
    <Popover
      align={align}
      className={wrapperClassName}
      trigger={({ toggle, open }) => (
        <button
          type="button"
          onClick={toggle}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={cn("flex w-full items-center gap-2 text-left", triggerClassName)}
        >
          <span className="sr-only">{label}</span>
          <span className="flex-1 truncate">{value}</span>
          <ChevronIcon
            className={cn(
              "h-4 w-4 shrink-0 text-text-tertiary transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </button>
      )}
    >
      {({ close }) => (
        <div
          role="listbox"
          className={cn(
            "max-h-72 w-56 overflow-auto rounded-lg border border-border-primary bg-surface-primary p-2 shadow-lg",
            panelClassName
          )}
        >
          {options.map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={option === value}
              onClick={() => {
                onChange(option);
                close();
              }}
              className={cn(
                "flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm font-semibold transition-colors hover:bg-neutral-900/[0.06]",
                option === value ? "text-green-700" : "text-text-primary"
              )}
            >
              {option}
              {option === value && <CheckIcon className="h-4 w-4 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </Popover>
  );
}
