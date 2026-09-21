"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const frame =
  "flex shrink-0 items-center justify-center overflow-hidden rounded-[2px] border border-border-primary bg-neutral-0";

// SkyLink only gives a 2-letter carrier code, so the logo comes from Kiwi.com's
// public airline-logo CDN. Not every carrier is in their set — when one
// isn't, show the carrier code in a square tile rather than a broken image.
export const AirlineLogo = ({
  code,
  name,
  size = 40,
  className,
}: {
  code: string;
  name: string;
  size?: number;
  className?: string;
}) => {
  const [failed, setFailed] = useState(false);
  const dimensions = { width: size, height: size };

  if (failed) {
    return (
      <span
        role="img"
        aria-label={name}
        style={dimensions}
        className={cn(frame, "text-[11px] font-bold tracking-wide text-text-secondary", className)}
      >
        {code}
      </span>
    );
  }

  return (
    <span style={dimensions} className={cn(frame, className)}>
      <Image
        src={`https://images.kiwi.com/airlines/64x64/${code}.png`}
        alt={name}
        width={size}
        height={size}
        className="h-full w-full object-contain p-1"
        onError={() => setFailed(true)}
      />
    </span>
  );
};
