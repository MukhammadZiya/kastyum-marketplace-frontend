import type {
  AllAttributesBundle,
  AttributeEntity,
  AttributeKind,
} from "@repo/types";
import { apiClient } from "./client";

export async function getAllAttributes(): Promise<AllAttributesBundle> {
  const { data } = await apiClient.get<AllAttributesBundle>("/attribute/list");
  return data;
}

export async function getAttributeListByType(
  type: AttributeKind,
): Promise<AttributeEntity[]> {
  const { data } = await apiClient.get<AttributeEntity[]>(
    `/attribute/list/${type}`,
  );
  return data;
}

/** Sellers can add their own sizes/colors/brands/materials/styles to the shared catalog while creating a product. */
export async function createSellerAttribute(
  type: "size" | "color" | "brand" | "material" | "style",
  name: string,
): Promise<AttributeEntity> {
  const { data } = await apiClient.post<AttributeEntity>(
    `/attribute/seller/create/${type}`,
    { name },
  );
  return data;
}
