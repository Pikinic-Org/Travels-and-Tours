import { cn } from "@/lib/utils";

// A grey placeholder block. Pulsing stops for people who prefer reduced motion.
const Block = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse rounded-lg bg-neutral-900/[0.07] motion-reduce:animate-none", className)} />
);

const CardSkeleton = () => (
  <div className="border border-border-primary bg-surface-primary p-5">
    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 items-center gap-5">
        <Block className="h-10 w-10 shrink-0" />
        <div className="flex flex-1 items-center gap-4">
          <div className="space-y-2">
            <Block className="h-5 w-16" />
            <Block className="h-3 w-10" />
          </div>
          <Block className="h-1 flex-1" />
          <div className="space-y-2">
            <Block className="h-5 w-16" />
            <Block className="h-3 w-10" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 md:flex-col md:items-end">
        <Block className="h-6 w-28" />
        <Block className="h-10 w-24" />
      </div>
    </div>
    <div className="mt-4 flex gap-2 border-t border-border-primary pt-3">
      <Block className="h-6 w-28" />
      <Block className="h-6 w-24" />
      <Block className="h-6 w-28" />
    </div>
  </div>
);

// Shown in place of the results while a search is running: same layout as the
// real thing (filter sidebar on the left, flight cards on the right), so the
// page doesn't jump when results arrive. No progress numbers — the search comes
// back in one piece, so there's nothing honest to count.
export const ResultsSkeleton = () => (
  <div role="status" aria-live="polite">
    <p className="mb-6 flex items-center gap-3 text-sm font-semibold text-text-tertiary">
      <span
        aria-hidden
        className="h-4 w-4 animate-spin rounded-full border-2 border-border-primary border-t-green-700 motion-reduce:animate-none"
      />
      Searching flights — checking fares across our partner airlines
    </p>

    <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:items-start">
      <div aria-hidden className="hidden space-y-6 rounded-2xl border border-border-primary bg-surface-primary p-5 lg:block">
        <Block className="h-4 w-20" />
        {[0, 1, 2, 3].map((section) => (
          <div key={section} className="space-y-3 border-t border-border-primary pt-5 first:border-t-0 first:pt-0">
            <Block className="h-3 w-24" />
            <Block className="h-4 w-full" />
            <Block className="h-4 w-4/5" />
            <Block className="h-4 w-3/5" />
          </div>
        ))}
      </div>

      <div aria-hidden className="space-y-4">
        {[0, 1, 2, 3].map((card) => (
          <CardSkeleton key={card} />
        ))}
      </div>
    </div>
  </div>
);
