import type { ProductStatus, TargetAudience } from "../enums";
import type { Brand, Color, Material, Size, Style } from "./attributes";
import type { Member } from "./member";

/** Per size, or per size+color when both are set on the product. */
export type ProductVariantStockLine = {
  sizeId?: string;
  colorId?: string;
  quantity: number;
};

export type ProductDocument = {
  _id: string;
  sellerId: string;
  title: string;
  modelNumber: string;
  audience: TargetAudience;
  /** Catalog slugs for header device filter (men, suits, …). */
  storeTypes?: string[];
  /** Sidebar department label (e.g. Formal wear). */
  departmentCategory?: string;
  description: string;
  price: number;
  listPrice?: number;
  colors: string[];
  sizes: string[];
  brand?: string;
  material?: string;
  style?: string;
  images: string[];
  stockCount: number;
  variantStock?: ProductVariantStockLine[];
  inStock: boolean;
  status: ProductStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductWithRelations = Omit<
  ProductDocument,
  "sellerId" | "colors" | "sizes" | "brand" | "material" | "style"
> & {
  sellerId: Member;
  colors: Color[];
  sizes: Size[];
  brand?: Brand;
  material?: Material;
  style?: Style;
};


export type ProductSellerListItem = Omit<
  ProductDocument,
  "sellerId" | "colors" | "sizes" | "brand" | "material" | "style"
> & {
  sellerId: string;
  colors: Color[];
  sizes: Size[];
  brand?: Brand;
  material?: Material;
  style?: Style;
  soldCount?: number;
};

export type ProductAdminListItem = Omit<
  ProductDocument,
  "sellerId" | "colors" | "sizes" | "brand" | "material" | "style"
> & {
  sellerId: Member;
  colors: Color[];
  sizes: Size[];
  brand?: Brand;
  material?: string;
  style?: string;
};
