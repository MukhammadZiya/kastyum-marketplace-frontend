import type {
  Member,
  Order,
  PaginatedResult,
  ProductAdminListItem,
} from "@repo/types";

export type AdminProductListResponse = PaginatedResult<ProductAdminListItem>;

export type AdminMemberListResponse = PaginatedResult<Member>;

export type AdminOrderListResponse = PaginatedResult<Order>;

export type { Member, Order, ProductAdminListItem };
