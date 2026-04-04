import type {
  ProductAdminListItem,
  ProductDocument,
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
  /** When set, UI uses `t(titleKey)` for display (demo catalog). */
  titleKey?: string;
  reviews: number;
  price: number;
  discountedPrice: number;
  imgs: ProductImages;
};

export type Product = StorefrontProduct;

export type {
  ProductAdminListItem,
  ProductDocument,
  ProductWithRelations,
};
