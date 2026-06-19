import { useMutation } from "@tanstack/react-query";
import { createSellerAttribute } from "@repo/api";

export function useSellerAttributeCreate() {
  return useMutation({
    mutationFn: ({
      type,
      name,
    }: {
      type: "size" | "color" | "brand" | "material" | "style";
      name: string;
    }) => createSellerAttribute(type, name),
  });
}
