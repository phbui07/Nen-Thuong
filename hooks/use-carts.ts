import { create } from "zustand";

import { persist, createJSONStorage } from "zustand/middleware";

import { Products } from "@/types-db";

export const MAX_QUANTITY = 99;

const clampQuantity = (qty: number) => Math.min(MAX_QUANTITY, Math.max(1, Math.round(qty) || 1));

// The store stays silent; components show (translated) toasts for these actions.
interface CartStore {
  items: Products[];
  addItem: (data: Products) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
  updateItemQuantity: (id: string, quantity: number) => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      addItem: (data: Products) => {
        const qty = clampQuantity(data.qty ?? 1);
        const existing = get().items.find((item) => item.id === data.id);
        if (existing) {
          set({
            items: get().items.map((item) =>
              item.id === data.id ? { ...item, qty: clampQuantity((item.qty ?? 1) + qty) } : item
            ),
          });
          return;
        }
        set({ items: [...get().items, { ...data, qty }] });
      },
      removeItem: (id: string) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },
      removeAll: () => set({ items: [] }),
      updateItemQuantity: (id: string, qty: number) => {
        const updatedItems = get().items.map((item) =>
          item.id === id ? { ...item, qty: clampQuantity(qty) } : item
        );
        set({ items: updatedItems });
      },
    }),
    {
      name: "cart-storage",
      // `window` is undefined during server rendering, so zustand skips
      // persistence there (Node 25+ defines its own, unusable localStorage).
      storage: createJSONStorage(() => window.localStorage),
    }
  )
);

export default useCart;
