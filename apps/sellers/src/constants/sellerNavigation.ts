export type SellerSection =
  | "Dashboard"
  | "Products"
  | "Orders"
  | "Store Profile"
  | "Analytics"
  | "Settings";

export const SELLER_NAV_ITEMS: SellerSection[] = [
  "Dashboard",
  "Products",
  "Orders",
  "Store Profile",
  "Analytics",
  "Settings",
];

export const SELLER_SECTION_DESCRIPTIONS: Record<SellerSection, string> = {
  Dashboard:
    "Overview of store health: products, orders, and sales highlights.",
  Products:
    "Manage product catalog, update pricing, stock, and publication status.",
  Orders:
    "Track and update order fulfillment status for your store.",
  "Store Profile":
    "Configure store identity, contact details, and shop policies.",
  Analytics:
    "Review core performance metrics and product-level trends.",
  Settings:
    "Seller account settings, preferences, and security controls.",
};

