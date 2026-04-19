export type SellerPageCopyKey = "productsManage";

export const SELLER_PAGE_COPY_KEYS: Record<
  SellerPageCopyKey,
  { titleKey: string; descriptionKey: string }
> = {
  productsManage: {
    titleKey: "common.sellerPageProductsManageTitle",
    descriptionKey: "common.sellerPageProductsManageDesc",
  },
};
