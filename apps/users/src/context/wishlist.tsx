import React, { createContext, useContext, useMemo, useState } from "react";
import type { Product } from "../types/product";

const WishlistContext = createContext<
  | {
      items: Product[];
      addItem: (item: Product) => void;
      removeItem: (id: number) => void;
      clear: () => void;
    }
  | undefined
>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);

  const value = useMemo(
    () => ({
      items,
      addItem: (item: Product) =>
        setItems((prev) => (prev.some((x) => x.id === item.id) ? prev : [...prev, item])),
      removeItem: (id: number) => setItems((prev) => prev.filter((x) => x.id !== id)),
      clear: () => setItems([]),
    }),
    [items]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within provider");
  return ctx;
}

