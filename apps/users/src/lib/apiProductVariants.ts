import type { ProductWithRelations } from "@repo/types";

export type VariantOption = {
  id: string;
  label: string;
  hex?: string;
};

export function variantSizesFromApiProduct(
  p: ProductWithRelations,
): VariantOption[] {
  const sizes = p.sizes ?? [];
  return sizes.map((s, i) => {
    if (typeof s === "object" && s && "name" in s) {
      return { id: s._id ?? `s-${i}`, label: s.name };
    }
    return { id: `s-${i}`, label: String(s) };
  });
}

export function variantColorsFromApiProduct(
  p: ProductWithRelations,
): VariantOption[] {
  const colors = p.colors ?? [];
  return colors.map((c, i) => {
    if (typeof c === "object" && c && "name" in c) {
      return {
        id: c._id ?? `c-${i}`,
        label: c.name,
        hex: "hexCode" in c && c.hexCode ? c.hexCode : undefined,
      };
    }
    return { id: `c-${i}`, label: String(c) };
  });
}
