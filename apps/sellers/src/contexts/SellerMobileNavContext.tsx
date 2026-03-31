import { createContext, useContext } from "react";

type SellerMobileNavContextValue = {
  openMobileNav: () => void;
};

export const SellerMobileNavContext =
  createContext<SellerMobileNavContextValue | null>(null);

export function useSellerMobileNav(): SellerMobileNavContextValue | null {
  return useContext(SellerMobileNavContext);
}
