import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  // Overrides the default diagonal-arrow icon chip — use sparingly, only when
  // the arrow doesn't fit the action (e.g. a search button gets a magnifying
  // glass instead). Every other button keeps the standard arrow.
  icon?: ReactNode;
};

// Simple diagonal "go" arrow — same 21x21 fixed size and span placement as
// what it replaces, just a clean shaft+head instead of the old glyph (which
// read more like a pin/paperclip than an arrow at this size).
const defaultArrow = (
  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6 15L15 6M15 6H8M15 6V13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-green-700 text-neutral-0 hover:bg-green-800 active:bg-green-900",
  secondary:
    "bg-transparent text-green-700 border border-green-700 hover:bg-green-700 hover:text-neutral-0",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 text-[14px]",
  md: "h-[40px] pl-[8px] pr-[4px] text-[14px]",
  lg: "h-[48px] pl-[8px] pr-[4px] text-[14px]",
};

const spanClasses:Record<ButtonVariant, string> = {
  primary:"bg-white text-green-700 ",
  secondary:"bg-green-700 text-white group-hover:bg-white group-hover:text-green-700"
}

const spanSizeClasses: Record<ButtonSize, string> = {
  sm:"h-[24px] w-[24px] ",
    md:"h-[32px] w-[32px]  text-[15px]",
    lg:"h-[40px] w-[40px]",
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", href, icon, children, ...props }, ref) => {
    const classes = cn(
      "group flex items-center justify-between  gap-[28px]  rounded-[2px] font-semibold uppercase tracking-wide transition-colors disabled:opacity-50 disabled:pointer-events-none",
      variantClasses[variant],
      sizeClasses[size],
      className
    );

    const spanClass = cn(
      "flex items-center justify-center rounded-[4px] transition-colors",
      spanClasses[variant],
      spanSizeClasses[size]
    );

    if (href) {
      return (
        <Link href={href} className={classes}>
          {children}  <span className={spanClass}>{icon ?? defaultArrow}</span>
        </Link>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children} <span className={spanClass}>{icon ?? defaultArrow}</span>
      </button>
    );
  }
);
Button.displayName = "Button";
