import type {
  CreateProductBody,
  CreateProductReviewBody,
  HomeShowcasePublicResponse,
  PaginatedResult,
  ProductDocument,
  ProductReview,
  ProductReviewEligibility,
  ProductReviewListResponse,
  ProductSellerListItem,
  ProductStatus,
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

export async function getProductReviews(
  productId: string,
): Promise<ProductReviewListResponse> {
  const { data } = await apiClient.get<ProductReviewListResponse>(
    `/product/reviews/${productId}`,
  );
  return data;
}

export async function getProductReviewEligibility(
  productId: string,
): Promise<ProductReviewEligibility> {
  const { data } = await apiClient.get<ProductReviewEligibility>(
    `/product/reviews/${productId}/me`,
  );
  return data;
}

export async function postProductReview(
  productId: string,
  body: CreateProductReviewBody,
): Promise<ProductReview> {
  const { data } = await apiClient.post<ProductReview>(
    `/product/reviews/${productId}`,
    body,
  );
  return data;
}

export async function postProductUpdateStatus(
  id: string,
  status: ProductStatus,
): Promise<ProductDocument> {
  const fd = new FormData();
  fd.append("status", status);
  const { data } = await apiClient.post<ProductDocument>(
    `/product/update/${id}`,
    fd,
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

export async function getSellerProductDetail(
  id: string,
): Promise<ProductSellerListItem> {
  const { data } = await apiClient.get<ProductSellerListItem>(
    `/product/seller-product/${id}`,
  );
  return data;
}

/**
 * Seller creates a product with 1–5 images. Files are stored under `uploads/products/`.
 * Other product fields are sent as form fields (multipart).
 */
function appendProductFields(fd: FormData, body: CreateProductBody) {
  fd.append("title", body.title);
  fd.append("description", body.description);
  if (body.modelNumber?.trim()) fd.append("modelNumber", body.modelNumber.trim());
  fd.append("audience", body.audience);
  fd.append("price", String(body.price));
  fd.append("stockCount", String(body.stockCount ?? 0));
  if (body.listPrice != null && body.listPrice > 0) fd.append("listPrice", String(body.listPrice));
  if (body.status != null) fd.append("status", body.status);
  if (body.brand?.trim()) fd.append("brand", body.brand.trim());
  if (body.material?.trim()) fd.append("material", body.material.trim());
  if (body.style?.trim()) fd.append("style", body.style.trim());
  if (body.category?.trim()) fd.append("category", body.category.trim());
  if (body.colors?.length) fd.append("colors", JSON.stringify(body.colors));
  if (body.sizes?.length) fd.append("sizes", JSON.stringify(body.sizes));
  if (body.variantStock?.length) {
    const normalized = body.variantStock.map((row) => {
      const n = Number(row.quantity);
      const quantity = Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0;
      return {
        ...(row.sizeId ? { sizeId: row.sizeId } : {}),
        ...(row.colorId ? { colorId: row.colorId } : {}),
        quantity,
      };
    });
    fd.append("variantStock", JSON.stringify(normalized));
  }
  if (body.titleI18n) fd.append("titleI18n", JSON.stringify(body.titleI18n));
  if (body.descriptionI18n) fd.append("descriptionI18n", JSON.stringify(body.descriptionI18n));
  if (body.careInstructions) fd.append("careInstructions", JSON.stringify(body.careInstructions));
  if (body.guarantee) fd.append("guarantee", JSON.stringify(body.guarantee));
  if (body.weight != null) fd.append("weight", String(body.weight));
  if (body.dimensions) fd.append("dimensions", JSON.stringify(body.dimensions));
  if (body.customAttributes?.length) fd.append("customAttributes", JSON.stringify(body.customAttributes));
}

export async function postProductCreate(
  body: CreateProductBody,
  imageFiles: File[],
): Promise<ProductDocument> {
  const fd = new FormData();
  appendProductFields(fd, body);
  for (const file of imageFiles) {
    fd.append("images", file, file.name);
  }
  const { data } = await apiClient.post<ProductDocument>("/product/create", fd);
  return data;
}

export async function postSellerProductUpdate(
  id: string,
  body: Partial<CreateProductBody>,
  imageFiles?: File[],
): Promise<ProductDocument> {
  const fd = new FormData();
  appendProductFields(fd, body as CreateProductBody);
  if (imageFiles?.length) {
    for (const file of imageFiles) {
      fd.append("images", file, file.name);
    }
  }
  const { data } = await apiClient.post<ProductDocument>(`/product/update/${id}`, fd);
  return data;
}
