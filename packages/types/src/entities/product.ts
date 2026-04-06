import type { ProductStatus, TargetAudience } from "../enums";
import type { Brand, Color, Fit, Material, Size, Style } from "./attributes";
import type { Member } from "./member";

export type ProductDocument = {
  _id: string;
  sellerId: string;
  title: string;
  modelNumber: string;
  audience: TargetAudience;
  description: string;
  price: number;
  colors: string[];
  sizes: string[];
  brand?: string;
  material?: string;
  style?: string;
  fit?: string;
  images: string[];
  stockCount: number;
  inStock: boolean;
  status: ProductStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductWithRelations = Omit<
  ProductDocument,
  "sellerId" | "colors" | "sizes" | "brand" | "material" | "fit" | "style"
> & {
  sellerId: Member;
  colors: Color[];
  sizes: Size[];
  brand?: Brand;
  material?: Material;
  fit?: Fit;
  style?: Style;
};


export type ProductSellerListItem = Omit<
  ProductDocument,
  "sellerId" | "colors" | "sizes" | "brand" | "material" | "fit" | "style"
> & {
  sellerId: string;
  colors: Color[];
  sizes: Size[];
  brand?: Brand;
  material?: Material;
  fit?: Fit;
  style?: Style;
};

export type ProductAdminListItem = Omit<
  ProductDocument,
  "sellerId" | "colors" | "sizes" | "brand" | "material" | "fit" | "style"
> & {
  sellerId: Member;
  colors: Color[];
  sizes: Size[];
  brand?: Brand;
  material?: string;
  fit?: string;
  style?: string;
};
