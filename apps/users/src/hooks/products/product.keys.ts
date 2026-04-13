import type { ProductsQueryParams } from "@repo/types";

export const productKeys = {
  all: ["product"] as const,
  homeShowcase: () => [...productKeys.all, "home-showcase"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: ProductsQueryParams | undefined) =>
    [...productKeys.lists(), filters ?? {}] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};
