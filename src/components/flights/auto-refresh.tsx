"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Polls by re-running this Server Component page — used only on the
// transitional states (payment received but not yet reserved, or payment
// not yet seen), where the real status can change server-side with nothing
// for the visitor to click. Stops after a handful of tries so a genuinely
// stuck booking doesn't poll forever.
export const AutoRefresh = ({ intervalMs = 4000, maxAttempts = 15 }: { intervalMs?: number; maxAttempts?: number }) => {
  const router = useRouter();

  useEffect(() => {
    let attempts = 0;
    const id = setInterval(() => {
      attempts += 1;
      if (attempts > maxAttempts) {
        clearInterval(id);
        return;
      }
      router.refresh();
    }, intervalMs);
    return () => clearInterval(id);
  }, [router, intervalMs, maxAttempts]);

  return null;
};
