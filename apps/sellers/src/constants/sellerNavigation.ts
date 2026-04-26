export type SellerPageCopyKey = "productsManage" | "inventoryPage" | "ordersList";

export const SELLER_PAGE_COPY_KEYS: Record<
  SellerPageCopyKey,
  { titleKey: string; descriptionKey: string }
> = {
  productsManage: {
    titleKey: "common.sellerPageProductsManageTitle",
    descriptionKey: "common.sellerPageProductsManageDesc",
  },
  inventoryPage: {
    titleKey: "common.sellerPageInventoryTitle",
    descriptionKey: "common.sellerPageInventoryDesc",
  },
  ordersList: {
    titleKey: "common.sellerPageOrdersListTitle",
    descriptionKey: "common.sellerPageOrdersListDesc",
  },
};
