import type {
  PaginatedResult,
  ProductSellerListItem,
  ProductWithRelations,
  ProductsQueryParams,
} from "@repo/types";
import { apiClient } from "./client";

export async function getProductList(
  params?: ProductsQueryParams,
): Promise<PaginatedResult<ProductWithRelations>> {
  const { data } = await apiClient.get<PaginatedResult<ProductWithRelations>>(
    "/product/list",
    { params },
  );
  return data;
}

export async function getProductDetail(
  id: string,
): Promise<ProductWithRelations> {
  const { data } = await apiClient.get<ProductWithRelations>(
    `/product/detail/${id}`,
  );
  return data;
}

export async function getSellerProductList(
  params?: ProductsQueryParams,
): Promise<PaginatedResult<ProductSellerListItem>> {
  const { data } = await apiClient.get<PaginatedResult<ProductSellerListItem>>(
    "/product/seller-list",
    { params },
  );
  return data;
}
