import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const inputClass =
  "w-full rounded-[2px] border border-border-primary bg-surface-primary px-3 py-3 text-sm text-text-primary focus:border-green-700 focus:outline-none";

// Same box, but extra room on the right so the browser's native dropdown
// arrow isn't sitting flush against the border — was using the same
// symmetric padding as text inputs, which reads cramped once a select is
// narrow (Title, Country Code).
export const selectClass =
  "w-full rounded-[2px] border border-border-primary bg-surface-primary py-3 pl-3 pr-8 text-sm text-text-primary focus:border-green-700 focus:outline-none";

// `className` sets this field's own width (e.g. "w-36") — fields sit in a
// flex-wrap row and take only the width their content needs (matching how
// Wakanow's booking form sizes Title/DOB/Passport fields), instead of every
// field stretching to fill an equal grid column regardless of what it holds.
export const FormField = ({ label, className, children }: { label: string; className?: string; children: ReactNode }) => (
  <label className={cn("block", className)}>
    <span className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">{label}</span>
    <div className="mt-1.5">{children}</div>
  </label>
);
