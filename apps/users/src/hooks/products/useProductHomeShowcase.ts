import { useQuery } from "@tanstack/react-query";
import type { HomeShowcasePublicResponse } from "@repo/types";
import { getProductHomeShowcase } from "@repo/api";
import { productKeys } from "./product.keys";

export function useProductHomeShowcase() {
  return useQuery<HomeShowcasePublicResponse>({
    queryKey: productKeys.homeShowcase(),
    queryFn: () => getProductHomeShowcase(),
    staleTime: 60_000,
  });
}
