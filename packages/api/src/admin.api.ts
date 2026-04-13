import type {
  AdminCreateProductPayload,
  AttributeEntity,
  AttributeKind,
  CreateAttributeBody,
  CreateProductBody,
  HomeShowcaseAdminConfig,
  HomeShowcaseUpdateBody,
  Member,
  MemberAdminUpdateBody,
  MemberListQuery,
  NotificationAdminListItem,
  NotificationListQuery,
  OrderListQuery,
  OrderListRow,
  PaginatedResult,
  ProductAdminListItem,
  ProductDocument,
  ProductWithRelations,
  ProductsQueryParams,
} from "@repo/types";
import { apiClient } from "./client";

export async function getAdminMemberList(
  params?: MemberListQuery,
): Promise<PaginatedResult<Member>> {
  const { data } = await apiClient.get<PaginatedResult<Member>>(
    "/admin/member/list",
    { params },
  );
  return data;
}

export async function getAdminMemberDetail(id: string): Promise<Member> {
  const { data } = await apiClient.get<Member>(`/admin/member/detail/${id}`);
  return data;
}

export async function postAdminMemberUpdate(
  id: string,
  body: MemberAdminUpdateBody,
): Promise<Member> {
  const { data } = await apiClient.post<Member>(
    `/admin/member/update/${id}`,
    body,
  );
  return data;
}

export async function getAdminProductList(
  params?: ProductsQueryParams,
): Promise<PaginatedResult<ProductAdminListItem>> {
  const { data } = await apiClient.get<PaginatedResult<ProductAdminListItem>>(
    "/admin/product/list",
    { params },
  );
  return data;
}

export async function getAdminProductDetail(
  id: string,
): Promise<ProductWithRelations> {
  const { data } = await apiClient.get<ProductWithRelations>(
    `/admin/product/detail/${id}`,
  );
  return data;
}

export async function postAdminProductUpdate(
  id: string,
  body: Partial<CreateProductBody>,
): Promise<ProductDocument> {
  const { data } = await apiClient.post<ProductDocument>(
    `/admin/product/update/${id}`,
    body,
  );
  return data;
}

export async function postAdminProductDelete(id: string): Promise<void> {
  await apiClient.post(`/admin/product/delete/${id}`);
}

/**
 * Admin creates a catalog product for a chosen seller. 1–5 images → `uploads/products/`.
 */
export async function postAdminProductCreate(
  payload: AdminCreateProductPayload,
  imageFiles: File[],
): Promise<ProductDocument> {
  if (imageFiles.length === 0) {
    throw new Error("At least one image is required.");
  }
  if (imageFiles.length > 5) {
    throw new Error("Maximum 5 images.");
  }
  const fd = new FormData();
  fd.append("sellerId", payload.sellerId);
  fd.append("title", payload.title);
  fd.append("description", payload.description);
  if (payload.modelNumber?.trim()) {
    fd.append("modelNumber", payload.modelNumber.trim());
  }
  fd.append("audience", payload.audience);
  fd.append("price", String(payload.price));
  if (payload.listPrice != null && payload.listPrice > 0) {
    fd.append("listPrice", String(payload.listPrice));
  }
  fd.append("stockCount", String(payload.stockCount));
  if (payload.colorIds?.length) {
    fd.append("colorIds", JSON.stringify(payload.colorIds));
  }
  if (payload.sizeIds?.length) {
    fd.append("sizeIds", JSON.stringify(payload.sizeIds));
  }
  if (payload.brand) fd.append("brand", payload.brand);
  if (payload.material) fd.append("material", payload.material);
  if (payload.fit) fd.append("fit", payload.fit);
  if (payload.style) fd.append("style", payload.style);
  if (payload.status) fd.append("status", payload.status);
  if (payload.homeShowcaseNewArrivals) {
    fd.append("homeShowcaseNewArrivals", "true");
  }
  if (payload.homeShowcaseMostPurchased) {
    fd.append("homeShowcaseMostPurchased", "true");
  }
  if (payload.variantStock?.length) {
    fd.append("variantStock", JSON.stringify(payload.variantStock));
  }
  for (const file of imageFiles) {
    fd.append("images", file, file.name);
  }
  const { data } = await apiClient.post<ProductDocument>(
    "/admin/product/create",
    fd,
  );
  return data;
}

export async function getAdminOrderList(
  params?: OrderListQuery,
): Promise<PaginatedResult<OrderListRow>> {
  const { data } = await apiClient.get<PaginatedResult<OrderListRow>>(
    "/admin/order/list",
    { params },
  );
  return data;
}

export async function getAdminNotificationList(
  params?: NotificationListQuery,
): Promise<PaginatedResult<NotificationAdminListItem>> {
  const { data } = await apiClient.get<
    PaginatedResult<NotificationAdminListItem>
  >("/admin/notification/list", { params });
  return data;
}

export async function postAdminAttributeCreate(
  type: AttributeKind,
  body: CreateAttributeBody,
): Promise<AttributeEntity> {
  const { data } = await apiClient.post<AttributeEntity>(
    `/admin/attribute/create/${type}`,
    body,
  );
  return data;
}

export async function postAdminAttributeDelete(
  type: AttributeKind,
  id: string,
): Promise<void> {
  await apiClient.post(`/admin/attribute/delete/${type}/${id}`);
}

export async function getAdminHomeShowcase(): Promise<HomeShowcaseAdminConfig> {
  const { data } = await apiClient.get<HomeShowcaseAdminConfig>(
    "/admin/home-showcase",
  );
  return data;
}

export async function postAdminHomeShowcase(
  body: HomeShowcaseUpdateBody,
): Promise<HomeShowcaseAdminConfig> {
  const { data } = await apiClient.post<HomeShowcaseAdminConfig>(
    "/admin/home-showcase",
    body,
  );
  return data;
}

export type HomeShowcaseSection = "newArrivals" | "mostPurchased";

export async function postAdminHomeShowcaseSlotImage(
  section: HomeShowcaseSection,
  index: number,
  imageFile: File,
): Promise<{ path: string }> {
  const fd = new FormData();
  fd.append("section", section);
  fd.append("index", String(index));
  fd.append("image", imageFile, imageFile.name);
  const { data } = await apiClient.post<{ path: string }>(
    "/admin/home-showcase/upload-image",
    fd,
  );
  return data;
}
