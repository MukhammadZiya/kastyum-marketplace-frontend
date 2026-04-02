import type {
  Member,
  Order,
  PaginatedResult,
  ProductWithRelations,
} from "@repo/types";

export type SellerProductListResponse = PaginatedResult<ProductWithRelations>;

export type SellerOrderListResponse = PaginatedResult<Order>;

export type { Member, Order, ProductWithRelations };
