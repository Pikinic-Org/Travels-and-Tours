import { ButtonHTMLAttributes, forwardRef } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
};

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
  ({ className, variant = "primary", size = "md", href, children, ...props }, ref) => {
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
          {children}  <span className={spanClass}>
          <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.4499 8.55483L0.00345457 12.2505L8.16842 20.4155L11.8641 9.96905L10.4499 8.55483ZM11.3147 9.10424C13.3975 11.187 16.7744 11.187 18.8572 9.10424C20.94 7.02145 20.94 3.64457 18.8572 1.56177C16.7744 -0.521025 13.3975 -0.521024 11.3147 1.56177C9.2319 3.64457 9.2319 7.02145 11.3147 9.10424ZM10.4499 9.96905L11.157 10.6762L15.793 6.04012L15.0859 5.33301L14.3788 4.6259L9.74279 9.26194L10.4499 9.96905Z" fill="currentColor"/>
</svg>
        </span>
        </Link>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children} <span className={spanClass}>
          <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.4499 8.55483L0.00345457 12.2505L8.16842 20.4155L11.8641 9.96905L10.4499 8.55483ZM11.3147 9.10424C13.3975 11.187 16.7744 11.187 18.8572 9.10424C20.94 7.02145 20.94 3.64457 18.8572 1.56177C16.7744 -0.521025 13.3975 -0.521024 11.3147 1.56177C9.2319 3.64457 9.2319 7.02145 11.3147 9.10424ZM10.4499 9.96905L11.157 10.6762L15.793 6.04012L15.0859 5.33301L14.3788 4.6259L9.74279 9.26194L10.4499 9.96905Z" fill="currentColor"/>
</svg>

        </span>
      </button> 
    );
  }
);
Button.displayName = "Button";
