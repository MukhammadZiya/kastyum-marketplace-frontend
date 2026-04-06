import type {
  Member,
  Order,
  PaginatedResult,
  ProductSellerListItem,
} from "@repo/types";

export type SellerProductListResponse = PaginatedResult<ProductSellerListItem>;

export type SellerOrderListResponse = PaginatedResult<Order>;

export type { Member, Order, ProductSellerListItem };
