import { useQuery } from "@tanstack/react-query";
import type { AttributeKind } from "@repo/types";
import { getAttributeListByType } from "@repo/api";
import { attributeKeys } from "./attribute.keys";

export function useAttributeList(type: AttributeKind) {
  return useQuery({
    queryKey: attributeKeys.listByType(type),
    queryFn: () => getAttributeListByType(type),
  });
}
