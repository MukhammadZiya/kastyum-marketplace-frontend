import React, { createContext, useContext, useMemo, useState } from "react";

type CartAnchorRect = Pick<DOMRect, "top" | "right" | "bottom" | "left">;

const CartSidebarModalContext = createContext<
  | {
      isCartModalOpen: boolean;
      anchorRect: CartAnchorRect | null;
      openCartModal: (anchorRect?: CartAnchorRect) => void;
      closeCartModal: () => void;
    }
  | undefined
>(undefined);

export function CartSidebarModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<CartAnchorRect | null>(null);

  const value = useMemo(
    () => ({
      isCartModalOpen,
      anchorRect,
      openCartModal: (rect?: CartAnchorRect) => {
        if (rect) setAnchorRect(rect);
        setIsCartModalOpen(true);
      },
      closeCartModal: () => setIsCartModalOpen(false),
    }),
    [isCartModalOpen, anchorRect]
  );

  return (
    <CartSidebarModalContext.Provider value={value}>
      {children}
    </CartSidebarModalContext.Provider>
  );
}

export function useCartModal() {
  const ctx = useContext(CartSidebarModalContext);
  if (!ctx) throw new Error("useCartModal must be used within provider");
  return ctx;
}
