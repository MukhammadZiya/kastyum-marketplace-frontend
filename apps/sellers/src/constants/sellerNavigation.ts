export type SellerPageCopyKey =
  | "dashboard"
  | "productsOverview"
  | "productsList"
  | "productsNew"
  | "ordersOverview"
  | "ordersList"
  | "storeOverview"
  | "storeEdit";

export const SELLER_PAGE_COPY_KEYS: Record<
  SellerPageCopyKey,
  { titleKey: string; descriptionKey: string }
> = {
  dashboard: {
    titleKey: "common.sellerPageDashboardTitle",
    descriptionKey: "common.sellerPageDashboardDesc",
  },
  productsOverview: {
    titleKey: "common.sellerPageProductsOverviewTitle",
    descriptionKey: "common.sellerPageProductsOverviewDesc",
  },
  productsList: {
    titleKey: "common.sellerPageProductsListTitle",
    descriptionKey: "common.sellerPageProductsListDesc",
  },
  productsNew: {
    titleKey: "common.sellerPageProductsNewTitle",
    descriptionKey: "common.sellerPageProductsNewDesc",
  },
  ordersOverview: {
    titleKey: "common.sellerPageOrdersOverviewTitle",
    descriptionKey: "common.sellerPageOrdersOverviewDesc",
  },
  ordersList: {
    titleKey: "common.sellerPageOrdersListTitle",
    descriptionKey: "common.sellerPageOrdersListDesc",
  },
  storeOverview: {
    titleKey: "common.sellerPageStoreOverviewTitle",
    descriptionKey: "common.sellerPageStoreOverviewDesc",
  },
  storeEdit: {
    titleKey: "common.sellerPageStoreEditTitle",
    descriptionKey: "common.sellerPageStoreEditDesc",
  },
};
