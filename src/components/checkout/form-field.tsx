import type { ReactNode } from "react";

export const inputClass =
  "w-full rounded-[2px] border border-border-primary bg-surface-primary px-3 py-2.5 text-sm text-text-primary focus:border-green-700 focus:outline-none";

export const FormField = ({ label, children }: { label: string; children: ReactNode }) => (
  <label className="block">
    <span className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">{label}</span>
    <div className="mt-1.5">{children}</div>
  </label>
);
