import type {
  MemberStatus,
  MemberType,
  OrderStatus,
  ProductStatus,
  TargetAudience,
} from "../enums";

export type MemberSignupBody = {
  nick: string;
  email: string;
  password: string;
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

export type CreateOrderItemBody = {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
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
