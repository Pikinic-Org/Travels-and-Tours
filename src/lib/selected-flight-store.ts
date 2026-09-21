import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { FlightSearchResult } from "@/lib/pikinic-api";

export type SelectedFlight = {
  flight: FlightSearchResult;
  tripType: "oneway" | "roundtrip" | "multicity";
  fromCode: string;
  toCode: string;
  departureDate: string;
  returnDate?: string;
  passengers: { adults: number; children: number; infants: number };
};

type SelectedFlightState = {
  selected: SelectedFlight | null;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  select: (flight: SelectedFlight) => void;
  clear: () => void;
};

// Deliberately a single slot, not a list — picking a new flight replaces
// whatever was selected before, matching how Wakanow/247Travels both work
// (confirmed by direct research, not assumed). sessionStorage rather than
// localStorage: this is a live-in-progress checkout intent, not something
// that should quietly resurface on an unrelated visit days later.
export const useSelectedFlightStore = create<SelectedFlightState>()(
  persist(
    (set) => ({
      selected: null,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      select: (flight) => set({ selected: flight }),
      clear: () => set({ selected: null }),
    }),
    {
      name: "pikinic-tt-selected-flight",
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
