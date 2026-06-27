import type { ProductStatus, TargetAudience } from "../enums";
import type { Brand, Category, Color, Material, Size, Style } from "./attributes";
import type { Member } from "./member";

export type I18nText = {
  uz?: string;
  ru?: string;
  en?: string;
  kk?: string;
};

export type GuaranteeInfo = {
  duration?: string;
  terms?: I18nText;
};

export type ProductDimensions = {
  length?: number;
  width?: number;
  height?: number;
};

export type CustomAttributeLine = {
  key: string;
  value: string;
};

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
  titleI18n?: I18nText;
  modelNumber: string;
  barcode?: string;
  audience: TargetAudience;
  category?: string;
  storeTypes?: string[];
  departmentCategory?: string;
  description: string;
  descriptionI18n?: I18nText;
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
  careInstructions?: I18nText;
  guarantee?: GuaranteeInfo;
  weight?: number;
  dimensions?: ProductDimensions;
  customAttributes?: CustomAttributeLine[];
  createdAt?: string;
  updatedAt?: string;
};

export type ProductWithRelations = Omit<
  ProductDocument,
  "sellerId" | "colors" | "sizes" | "brand" | "material" | "style" | "category"
> & {
  sellerId: Member;
  colors: Color[];
  sizes: Size[];
  brand?: Brand;
  material?: Material;
  style?: Style;
  category?: Category;
};

export type ProductSellerListItem = Omit<
  ProductDocument,
  "sellerId" | "colors" | "sizes" | "brand" | "material" | "style" | "category"
> & {
  sellerId: string;
  colors: Color[];
  sizes: Size[];
  brand?: Brand;
  material?: Material;
  style?: Style;
  category?: Category;
  soldCount?: number;
};

export type ProductAdminListItem = Omit<
  ProductDocument,
  "sellerId" | "colors" | "sizes" | "brand" | "material" | "style" | "category"
> & {
  sellerId: Member;
  colors: Color[];
  sizes: Size[];
  brand?: Brand;
  material?: string;
  style?: string;
  category?: Category;
};
