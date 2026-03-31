export type SellerPageCopyKey =
  | "dashboard"
  | "productsOverview"
  | "productsList"
  | "productsNew"
  | "ordersOverview"
  | "ordersList"
  | "storeOverview"
  | "storeEdit";

export const SELLER_PAGE_COPY: Record<
  SellerPageCopyKey,
  { title: string; description: string }
> = {
  dashboard: {
    title: "Dashboard",
    description:
      "Overview of store health: products, orders, and sales highlights.",
  },
  productsOverview: {
    title: "Products",
    description:
      "Manage product catalog, update pricing, stock, and publication status.",
  },
  productsList: {
    title: "All products",
    description: "Browse and edit listings. Wire search and filters with your API.",
  },
  productsNew: {
    title: "Add product",
    description: "Create a new listing — connect media upload and variants next.",
  },
  ordersOverview: {
    title: "Orders",
    description: "Track and update order fulfillment status for your store.",
  },
  ordersList: {
    title: "All orders",
    description: "Operational list — statuses and shipping updates map here.",
  },
  storeOverview: {
    title: "Store profile",
    description: "Configure store identity, contact details, and shop policies.",
  },
  storeEdit: {
    title: "Edit store",
    description: "Update branding, policies, and contact information.",
  },
};
