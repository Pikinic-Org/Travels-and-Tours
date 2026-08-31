import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function TextField({ label, id, className, error, ...props }: TextFieldProps) {
  const inputId = id ?? props.name;
  return (
    <div>
      <label
        htmlFor={inputId}
        className="text-xs font-semibold uppercase tracking-widest text-text-tertiary"
      >
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={!!error}
        className={cn(
          "mt-2 w-full rounded-[2px] border bg-transparent px-4 py-3 text-sm font-semibold text-text-primary placeholder:font-normal placeholder:text-text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600",
          error ? "border-red-500" : "border-border-primary",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
