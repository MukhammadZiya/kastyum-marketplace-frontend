import type { OrderStatus } from "../enums";

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
  createdAt?: string;
  updatedAt?: string;
};
