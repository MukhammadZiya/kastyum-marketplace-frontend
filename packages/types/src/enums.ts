export type MemberType = "ADMIN" | "SELLER" | "USER";

export type MemberStatus = "ACTIVE" | "PENDING" | "BLOCK" | "DELETE";

export type ProductStatus = "ACTIVE" | "INACTIVE" | "DELETE";

export type TargetAudience = "MEN" | "WOMEN" | "KIDS";

export type OrderStatus =
  | "PENDING"
  | "ACCEPTED"
  | "SHIPPED"
  | "CANCELLED";

export type NotificationType =
  | "ORDER_NEW"
  | "ORDER_UPDATE"
  | "SYSTEM";
