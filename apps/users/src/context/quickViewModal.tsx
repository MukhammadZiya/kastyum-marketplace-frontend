import React, { createContext, useContext, useMemo, useState } from "react";
import type { Product } from "../types/product";

const QuickViewModalContext = createContext<
  | {
      isOpen: boolean;
      product: Product | null;
      open: (product: Product) => void;
      close: () => void;
    }
  | undefined
>(undefined);

export function QuickViewModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  const value = useMemo(
    () => ({
      isOpen,
      product,
      open: (nextProduct: Product) => {
        setProduct(nextProduct);
        setIsOpen(true);
      },
      close: () => setIsOpen(false),
    }),
    [isOpen, product]
  );

  return (
    <QuickViewModalContext.Provider value={value}>
      {children}
    </QuickViewModalContext.Provider>
  );
}

export function useQuickViewModal() {
  const ctx = useContext(QuickViewModalContext);
  if (!ctx) throw new Error("useQuickViewModal must be used within provider");
  return ctx;
}

