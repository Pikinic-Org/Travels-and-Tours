"use client";

import { formatNaira } from "@/lib/utils";

// Two overlapping native range inputs, each only clickable at its own thumb
// (pointer-events disabled on the track, re-enabled on ::-webkit/-moz-range-thumb)
// — the standard technique for a dual-handle slider without a drag library.
const thumbClasses =
  "pointer-events-none absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent " +
  "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 " +
  "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 " +
  "[&::-webkit-slider-thumb]:border-green-700 [&::-webkit-slider-thumb]:bg-neutral-0 [&::-webkit-slider-thumb]:shadow " +
  "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 " +
  "[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 " +
  "[&::-moz-range-thumb]:border-green-700 [&::-moz-range-thumb]:bg-neutral-0 [&::-moz-range-thumb]:cursor-pointer";

export function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}) {
  const [lo, hi] = value;
  const span = max - min || 1;
  const loPercent = ((lo - min) / span) * 100;
  const hiPercent = ((hi - min) / span) * 100;

  // Give whichever thumb is further from its own edge the higher z-index,
  // so it stays grabbable even when the two thumbs sit close together.
  const loOnTop = lo - min > max - hi;

  return (
    <div>
      <div className="flex items-center justify-between text-sm font-semibold text-text-primary">
        <span>{formatNaira(lo)}</span>
        <span>{formatNaira(hi)}</span>
      </div>

      <div className="relative mt-4 h-4">
        <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-[2px] bg-neutral-200" />
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-[2px] bg-green-700"
          style={{ left: `${loPercent}%`, right: `${100 - hiPercent}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={lo}
          onChange={(e) => onChange([Math.min(Number(e.target.value), hi), hi])}
          className={thumbClasses}
          style={{ zIndex: loOnTop ? 2 : 1 }}
          aria-label="Minimum price"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={hi}
          onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo)])}
          className={thumbClasses}
          style={{ zIndex: loOnTop ? 1 : 2 }}
          aria-label="Maximum price"
        />
      </div>
    </div>
  );
}
