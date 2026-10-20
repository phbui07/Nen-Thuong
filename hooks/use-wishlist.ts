import { create } from "zustand";

import { persist, createJSONStorage } from "zustand/middleware";

interface WishlistStore {
  ids: string[];
  toggle: (id: string) => void;
}

const useWishlist = create(
  persist<WishlistStore>(
    (set, get) => ({
      ids: [],
      toggle: (id: string) => {
        const ids = get().ids;
        set({ ids: ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id] });
      },
    }),
    {
      name: "wishlist-storage",
      storage: createJSONStorage(() => window.localStorage),
    }
  )
);

export default useWishlist;
