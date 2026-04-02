import type {
  CreateOrderBody,
  Order,
  OrderListQuery,
  OrderListRow,
  PaginatedResult,
  UpdateOrderStatusBody,
} from "@repo/types";
import { apiClient } from "./client";

export async function postOrderCreate(body: CreateOrderBody): Promise<Order> {
  const { data } = await apiClient.post<Order>("/order/create", body);
  return data;
}

export async function getMyOrders(
  params?: OrderListQuery,
): Promise<PaginatedResult<OrderListRow>> {
  const { data } = await apiClient.get<PaginatedResult<OrderListRow>>(
    "/order/my-list",
    { params },
  );
  return data;
}

export async function getSellerOrders(
  params?: OrderListQuery,
): Promise<PaginatedResult<OrderListRow>> {
  const { data } = await apiClient.get<PaginatedResult<OrderListRow>>(
    "/order/seller-list",
    { params },
  );
  return data;
}

export async function postOrderUpdateStatus(
  orderId: string,
  body: UpdateOrderStatusBody,
): Promise<void> {
  await apiClient.post(`/order/update-status/${orderId}`, body);
}
