import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  type: "flight" | "package";
  title: string;
  subtitle?: string;
  price: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      addItem: (item) => {
        const items = get().items;
        const existing = items.find((i) => i.id === item.id);
        set({
          items: existing
            ? items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
            : [...items, { ...item, quantity: 1 }],
        });
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      clear: () => set({ items: [] }),
    }),
    {
      name: "pikinic-tt-cart",
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export function useCartCount() {
  return useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
}

export function useCartSubtotal() {
  return useCartStore((s) => s.items.reduce((sum, i) => sum + i.price * i.quantity, 0));
}
