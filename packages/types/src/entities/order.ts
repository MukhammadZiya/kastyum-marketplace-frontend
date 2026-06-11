import type { OrderStatus, PaymentStatus } from "../enums";
import type { Member } from "./member";

export type OrderItem = {
  productId: string;
  productTitle: string;
  productImage: string;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
};

export type Order = {
  _id: string;
  memberId: string;
  sellerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress?: string;
  paymentStatus: PaymentStatus;
  currency: string;
  createdAt?: string;
  updatedAt?: string;
};

export type OrderListRow = Omit<Order, "memberId" | "sellerId"> & {
  memberId: Member;
  sellerId: Member;
};
