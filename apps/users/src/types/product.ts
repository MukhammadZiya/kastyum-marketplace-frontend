import type {
  ProductAdminListItem,
  ProductDocument,
  ProductSellerListItem,
  ProductWithRelations,
} from "@repo/types";

export type ProductImages = {
  thumbnails: string[];
  previews: string[];
};

export type StorefrontProduct = {
  id: number;
  mongoId?: string;
  title: string;
  brandName?: string;
  sellerName?: string;
  categoryLabel?: string;
  /** When set, UI uses `t(titleKey)` for display (demo catalog). */
  titleKey?: string;
  reviews: number;
  price: number;
  discountedPrice: number;
  imgs: ProductImages;
  hasSizes?: boolean;
  hasColors?: boolean;
};

export type Product = StorefrontProduct;

export type {
  ProductAdminListItem,
  ProductDocument,
  ProductSellerListItem,
  ProductWithRelations,
};
