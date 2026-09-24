"use client";

import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Generic centered overlay dialog — backdrop click + Escape close by default.
// Set dismissible={false} for a blocking state (e.g. a loading modal).
export function Modal({
  open,
  onClose,
  children,
  className,
  dismissible = true,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  dismissible?: boolean;
}) {
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && dismissible) onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, dismissible, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm"
        onClick={dismissible ? onClose : undefined}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative w-full max-w-md rounded-2xl border border-border-primary bg-surface-primary p-6 shadow-xl",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
