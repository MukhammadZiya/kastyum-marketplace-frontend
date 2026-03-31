import { createContext, useContext } from "react";

type AdminMobileNavContextValue = {
  openMobileNav: () => void;
};

export const AdminMobileNavContext =
  createContext<AdminMobileNavContextValue | null>(null);

export function useAdminMobileNav(): AdminMobileNavContextValue | null {
  return useContext(AdminMobileNavContext);
}
