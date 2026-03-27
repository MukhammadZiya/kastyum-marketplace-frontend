import React, { createContext, useContext, useMemo, useState } from "react";

const CartSidebarModalContext = createContext<
  | {
      isCartModalOpen: boolean;
      openCartModal: () => void;
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

  const value = useMemo(
    () => ({
      isCartModalOpen,
      openCartModal: () => setIsCartModalOpen(true),
      closeCartModal: () => setIsCartModalOpen(false),
    }),
    [isCartModalOpen]
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

