import type {
  AttributeEntity,
  AttributeKind,
  CreateAttributeBody,
  CreateProductBody,
  Member,
  MemberAdminUpdateBody,
  MemberListQuery,
  OrderListQuery,
  OrderListRow,
  PaginatedResult,
  ProductAdminListItem,
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
): Promise<ProductWithRelations> {
  const { data } = await apiClient.post<ProductWithRelations>(
    `/admin/product/update/${id}`,
    body,
  );
  return data;
}

export async function postAdminProductDelete(id: string): Promise<void> {
  await apiClient.post(`/admin/product/delete/${id}`);
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
