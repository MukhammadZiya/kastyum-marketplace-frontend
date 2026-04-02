import { useQuery } from "@tanstack/react-query";
import { getAllAttributes } from "@repo/api";
import { attributeKeys } from "./attribute.keys";

export function useAllAttributes() {
  return useQuery({
    queryKey: attributeKeys.bundle(),
    queryFn: getAllAttributes,
  });
}
