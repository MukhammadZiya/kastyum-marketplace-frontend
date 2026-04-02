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
