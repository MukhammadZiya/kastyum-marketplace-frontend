import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nProvider } from "../i18n";
import { CartProvider } from "./cart";
import { CartSidebarModalProvider } from "./cartSidebarModal";
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
      <I18nProvider>
        <WishlistProvider>
          <CartProvider>
            <CartSidebarModalProvider>{children}</CartSidebarModalProvider>
          </CartProvider>
        </WishlistProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}
