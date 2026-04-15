import type {
  CreateProductBody,
  HomeShowcasePublicResponse,
  PaginatedResult,
  ProductDocument,
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

/** Public home sections: new arrivals & most purchased, with optional custom slot images. */
export async function getProductHomeShowcase(): Promise<HomeShowcasePublicResponse> {
  const { data } = await apiClient.get<HomeShowcasePublicResponse>(
    "/product/home-showcase",
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

/**
 * Seller creates a product with 1–5 images. Files are stored under `uploads/products/`.
 * Other product fields are sent as form fields (multipart).
 */
export async function postProductCreate(
  body: CreateProductBody,
  imageFiles: File[],
): Promise<ProductDocument> {
  const fd = new FormData();
  fd.append("title", body.title);
  fd.append("description", body.description);
  fd.append("modelNumber", body.modelNumber);
  fd.append("audience", body.audience);
  fd.append("price", String(body.price));
  fd.append("stockCount", String(body.stockCount));
  if (body.status != null) {
    fd.append("status", body.status);
  }
  for (const file of imageFiles) {
    fd.append("images", file, file.name);
  }
  const { data } = await apiClient.post<ProductDocument>(
    "/product/create",
    fd,
  );
  return data;
}
