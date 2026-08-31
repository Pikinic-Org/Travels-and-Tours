"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PathwayMark } from "@/components/ui/pathway-mark";
import { useCartCount } from "@/lib/cart-store";
import { cn } from "@/lib/utils";
import { navLinks, siteConfig } from "@/lib/constants";

function CartIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 4h2l2.2 11.4A2 2 0 0 0 9.16 17h8.2a2 2 0 0 0 1.96-1.6L20.5 8H6" />
      <circle cx="9.5" cy="20.5" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="20.5" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Mark({ className }: { className?: string }) {
  return (
    <svg
      width="32"
      height="24"
      viewBox="0 0 62 47"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M42.5978 0C42.3793 0 41.7808 0.0221622 41.4419 0.0348263L41.4103 0.0379923H41.3849L11.9539 1.84579L16.1086 10.7297L41.86 9.14664C41.9866 9.14348 42.4521 9.12131 42.5978 9.12131C47.9843 9.12131 52.3733 13.5031 52.3733 18.8917C52.3733 24.2771 47.9843 28.6588 42.5978 28.6588C42.4268 28.6588 42.2653 28.6588 42.1323 28.6525L32.7273 28.0826L26.8974 37.4604H11.2192L15.6367 26.9809L6.32353 26.4015L0.52218 38.7965C-1.17516 42.4215 1.47218 46.5849 5.47803 46.5849H28.7911C30.5676 46.5849 32.2333 45.7237 33.2593 44.2705L38.0156 37.5395L41.6003 37.7612H41.6383C41.822 37.7707 42.0151 37.777 42.221 37.7802C51.36 37.9416 59.3812 31.6381 61.1292 22.6687C63.482 10.6062 54.2575 0 42.5978 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const count = useCartCount();
  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-colors duration-300",
          open
            ? "border-b border-transparent bg-transparent"
            : "border-b border-border-primary/60 bg-background-primary/85 backdrop-blur-md"
        )}
      >
        <Container className="flex h-20 items-center justify-between">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2 text-text-primary transition-opacity hover:opacity-80",
              open && "pointer-events-none opacity-0"
            )}
          >
            <Mark className="text-green-700" />
            <span className="text-sm font-bold uppercase tracking-tight sm:text-base">
              {siteConfig.name}
            </span>
          </Link>

          {/* Desktop nav — centered */}
          <div className="hidden flex-1 md:flex md:justify-center">
            <div className="flex items-center gap-2 rounded-[2px] border border-border-primary bg-neutral-900/[0.04] p-2">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={cn(
                      "rounded-sm px-3 py-2.5 text-sm font-semibold uppercase tracking-wide transition-colors",
                      active
                        ? "bg-green-200 text-green-900"
                        : "text-text-primary hover:bg-neutral-900/[0.06]"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right-side actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              aria-label={`Cart${count > 0 ? `, ${count} item${count === 1 ? "" : "s"}` : ""}`}
              className={cn(
                "relative flex h-10 w-10 items-center justify-center rounded-sm border border-border-primary text-text-primary transition-colors hover:bg-neutral-900/[0.06]",
                open && "pointer-events-none opacity-0"
              )}
            >
              <CartIcon className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-green-700 px-1 text-[10px] font-bold text-neutral-0">
                  {count}
                </span>
              )}
            </Link>

            <div className="hidden items-center gap-3 md:flex">
              <Button href="/contact" size="md" variant="secondary">
                Contact Us
              </Button>
            </div>

            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className={cn(
                "relative z-50 flex h-10 w-10 items-center justify-center rounded-sm transition-colors md:hidden",
                open ? "text-neutral-0" : "text-text-primary"
              )}
            >
              <span className="relative block h-4 w-5">
                <span
                  className={cn(
                    "absolute left-0 top-0 h-[2px] w-full bg-current transition-transform duration-300",
                    open && "translate-y-[7px] rotate-45"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-[7px] h-[2px] w-full bg-current transition-opacity duration-200",
                    open && "opacity-0"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-[14px] h-[2px] w-full bg-current transition-transform duration-300",
                    open && "-translate-y-[7px] -rotate-45"
                  )}
                />
              </span>
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile panel — rendered outside <header> so backdrop-blur there
          doesn't turn it into the containing block for this fixed overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 flex flex-col overflow-hidden bg-green-900 text-neutral-0 transition-opacity duration-300 md:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden text-neutral-0/20"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 1282 579"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.25 0.25H1281.25M640.75 0.25V578.25M640.75 0.25H480.625M640.75 0.25H800.875M640.75 578.25H480.625M640.75 578.25H800.875M961 0.25V578.25M961 0.25H800.875M961 0.25H1121.12M961 578.25H800.875M961 578.25H1121.12M320.5 0.25V578.25M320.5 0.25H480.625M320.5 0.25H160.375M320.5 578.25H480.625M320.5 578.25H160.375M0.25 289.25H1281.25M0.25 289.25V144.75M0.25 289.25V433.75M1281.25 289.25V144.75M1281.25 289.25V433.75M1281.25 144.75V0.25H1121.12M1281.25 144.75H0.25M0.25 144.75V0.25H160.375M0.25 433.75V578.25H160.375M0.25 433.75H1281.25M1281.25 433.75V578.25H1121.12M480.625 0.25V578.25M800.875 0.25V578.25M1121.12 0.25V578.25M160.375 0.25V578.25"
            stroke="currentColor"
            strokeWidth="0.5"
          />
        </svg>
        <PathwayMark className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 text-neutral-0/10" />

        <nav className="relative flex flex-1 flex-col items-start justify-center gap-2 px-8">
          {navLinks.map((link, i) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn("text-4xl font-bold uppercase tracking-tight", open && "reveal")}
              style={open ? { animationDelay: `${0.1 + i * 0.07}s` } : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div
          className={cn("px-8 py-8", open && "reveal")}
          style={open ? { animationDelay: `${0.1 + navLinks.length * 0.07}s` } : undefined}
        >
          <Button
            href="/contact"
            size="lg"
            variant="primary"
            className="w-full justify-center bg-neutral-0 text-green-800 hover:bg-green-50"
          >
            Contact Us
          </Button>
        </div>
        <div
          className={cn("flex items-center justify-center gap-2 pb-8", open && "reveal")}
          style={open ? { animationDelay: `${0.2 + navLinks.length * 0.07}s` } : undefined}
        >
          <Mark className="text-neutral-0" />
          <span className="text-center text-xs font-bold uppercase tracking-widest text-neutral-0 sm:text-sm">
            {siteConfig.name}
          </span>
        </div>
      </div>
    </>
  );
}
