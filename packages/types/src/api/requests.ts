import type {
  MemberStatus,
  MemberType,
  OrderStatus,
  ProductStatus,
  TargetAudience,
} from "../enums";
import type { ProductVariantStockLine } from "../entities/product";

/** Mirrors `MemberInput` (signup). */
export type MemberSignupBody = {
  nick: string;
  email: string;
  password?: string;
  phone?: string;
  image?: string;
  type?: MemberType;
};

export type MemberLoginBody = {
  email: string;
  password: string;
};

export type MemberUpdateBody = {
  nick?: string;
  phone?: string;
  image?: string;
  password?: string;
};

export type MemberAdminUpdateBody = {
  type?: MemberType;
  status?: MemberStatus;
  nick?: string;
  phone?: string;
  image?: string;
};

export type MemberListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  type?: MemberType;
};

export type ProductsQueryParams = {
  page?: number;
  limit?: number;
  brand?: string;
  material?: string;
  fit?: string;
  color?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
};

export type CreateProductBody = {
  title: string;
  description: string;
  modelNumber: string;
  audience: TargetAudience;
  price: number;
  /** Optional “was” price; storefront shows as strikethrough when greater than `price`. */
  listPrice?: number;
  colors?: string[];
  sizes?: string[];
  brand?: string;
  material?: string;
  fit?: string;
  style?: string;
  images?: string[];
  stockCount: number;
  status?: ProductStatus;
};

/** Admin multipart create (`POST /admin/product/create`). */
export type AdminCreateProductPayload = {
  sellerId: string;
  title: string;
  description: string;
  modelNumber?: string;
  audience: TargetAudience;
  price: number;
  listPrice?: number;
  stockCount: number;
  colorIds?: string[];
  sizeIds?: string[];
  brand?: string;
  material?: string;
  fit?: string;
  style?: string;
  status?: ProductStatus;
  /** Append to storefront home “new arrivals” after create (if room; skips duplicate). */
  homeShowcaseNewArrivals?: boolean;
  /** Append to home “most purchased / favorites” block. */
  homeShowcaseMostPurchased?: boolean;
  /** Required when `sizeIds` and/or `colorIds` are set: one row per size, or per size×color. */
  variantStock?: ProductVariantStockLine[];
};

export type CreateOrderItemBody = {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
  sizeId?: string;
  colorId?: string;
};

export type CreateOrderBody = {
  items: CreateOrderItemBody[];
  shippingAddress?: string;
};

export type UpdateOrderStatusBody = {
  status: OrderStatus;
};

export type CreateAttributeBody = {
  name: string;
  hexCode?: string;
  logoUrl?: string;
  code?: string;
};

export type OrderListQuery = {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  memberId?: string;
  sellerId?: string;
};

/** Matches `NotificationInquiryDto` (used for user and admin notification list). */
export type NotificationListQuery = {
  page?: number;
  limit?: number;
  isRead?: "true" | "false";
  receiverId?: string;
};
