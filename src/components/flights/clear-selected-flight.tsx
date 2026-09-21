"use client";

import { useEffect } from "react";
import { useSelectedFlightStore } from "@/lib/selected-flight-store";

// Checkout is done (booking succeeded or failed) — the in-progress flight
// selection in sessionStorage is stale now, so drop it.
export function ClearSelectedFlight() {
  const clear = useSelectedFlightStore((s) => s.clear);

  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
