import React from "react";
import { CartProvider } from "./cart";
import { CartSidebarModalProvider } from "./cartSidebarModal";
import { QuickViewModalProvider } from "./quickViewModal";
import { WishlistProvider } from "./wishlist";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <WishlistProvider>
      <CartProvider>
        <CartSidebarModalProvider>
          <QuickViewModalProvider>{children}</QuickViewModalProvider>
        </CartSidebarModalProvider>
      </CartProvider>
    </WishlistProvider>
  );
}

