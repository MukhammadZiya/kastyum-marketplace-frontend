import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "./cart";
import { CartSidebarModalProvider } from "./cartSidebarModal";
import { QuickViewModalProvider } from "./quickViewModal";
import { WishlistProvider } from "./wishlist";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
    },
  },
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WishlistProvider>
        <CartProvider>
          <CartSidebarModalProvider>
            <QuickViewModalProvider>{children}</QuickViewModalProvider>
          </CartSidebarModalProvider>
        </CartProvider>
      </WishlistProvider>
    </QueryClientProvider>
  );
}

