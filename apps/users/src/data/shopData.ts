import type { Product } from "../types/product";
import { productLightWebImgs } from "./lightWebpImages";

export type ShopProduct = Product & {
  category: string;
  colors: readonly string[];
  sizes: readonly string[];
  /** Matches header catalog dropdown. Empty = only “All categories”. */
  storeTypes: readonly string[];
};

export function filterByHeaderCatalog(
  products: readonly ShopProduct[],
  device: string | null,
): ShopProduct[] {
  if (!device || device === "all" || device === "0") return [...products];
  return products.filter((p) => p.storeTypes.includes(device));
}

export function filterByTitleSearch(
  products: readonly ShopProduct[],
  q: string,
): ShopProduct[] {
  const t = q.trim().toLowerCase();
  if (!t) return [...products];
  return products.filter((p) => p.title.toLowerCase().includes(t));
}

/** Sale price used for display and price-range filtering */
export function productEffectivePrice(p: Product): number {
  return p.discountedPrice;
}

export const PRICE_FILTER_SPECS = [
  { id: "under-50", labelKey: "shopPriceUnder50" },
  { id: "50-100", labelKey: "shopPrice50to100" },
  { id: "100-500", labelKey: "shopPrice100to500" },
  { id: "500-plus", labelKey: "shopPrice500Plus" },
] as const;

export type PriceFilterId = (typeof PRICE_FILTER_SPECS)[number]["id"];

function priceMatchesBucket(price: number, id: PriceFilterId): boolean {
  if (id === "under-50") return price < 50;
  if (id === "50-100") return price >= 50 && price < 100;
  if (id === "100-500") return price >= 100 && price < 500;
  return price >= 500;
}

export type ShopFilterState = {
  categories: Set<string>;
  priceBuckets: Set<PriceFilterId>;
  colors: Set<string>;
  sizes: Set<string>;
};

export function emptyShopFilterState(): ShopFilterState {
  return {
    categories: new Set(),
    priceBuckets: new Set(),
    colors: new Set(),
    sizes: new Set(),
  };
}

export function filterShopProducts(
  products: readonly ShopProduct[],
  filters: ShopFilterState,
): ShopProduct[] {
  return products.filter((p) => {
    const price = productEffectivePrice(p);

    if (filters.categories.size > 0 && !filters.categories.has(p.category)) {
      return false;
    }

    if (filters.priceBuckets.size > 0) {
      const ok = [...filters.priceBuckets].some((id) =>
        priceMatchesBucket(price, id),
      );
      if (!ok) return false;
    }

    if (filters.colors.size > 0) {
      const hasColor = p.colors.some((c) => filters.colors.has(c));
      if (!hasColor) return false;
    }

    if (filters.sizes.size > 0) {
      const hasSize = p.sizes.some((s) => filters.sizes.has(s));
      if (!hasSize) return false;
    }

    return true;
  });
}

export function shopFilterOptionLists(products: readonly ShopProduct[]) {
  const categories = [...new Set(products.map((p) => p.category))].sort();
  const colors = [...new Set(products.flatMap((p) => [...p.colors]))].sort();
  const sizes = [...new Set(products.flatMap((p) => [...p.sizes]))].sort();
  return { categories, colors, sizes };
}

export const shopData: ShopProduct[] = [
  {
    title: "Navy Double-Breasted Wool Suit",
    titleKey: "demoProdTitle1",
    reviews: 15,
    price: 599.0,
    discountedPrice: 429.0,
    id: 1,
    category: "Men's tailoring",
    colors: ["Navy"],
    sizes: ["38R", "40R", "42R"],
    storeTypes: ["men", "suits"],
    imgs: productLightWebImgs(1),
  },
  {
    title: "Charcoal Slim Fit Two-Piece Suit",
    titleKey: "demoProdTitle2",
    reviews: 12,
    price: 549.0,
    discountedPrice: 389.0,
    id: 2,
    category: "Men's tailoring",
    colors: ["Charcoal"],
    sizes: ["38R", "40R", "42R", "44R"],
    storeTypes: ["men", "suits"],
    imgs: productLightWebImgs(2),
  },
  {
    title: "Beige Classic Fit Two-Piece Suit",
    titleKey: "demoProdTitle3",
    reviews: 9,
    price: 519.0,
    discountedPrice: 359.0,
    id: 3,
    category: "Men's tailoring",
    colors: ["Beige"],
    sizes: ["40R", "42R"],
    storeTypes: ["men", "suits", "shirts"],
    imgs: productLightWebImgs(3),
  },
  {
    title: "Black Peak Lapel Tuxedo",
    titleKey: "demoProdTitle4",
    reviews: 11,
    price: 689.0,
    discountedPrice: 499.0,
    id: 4,
    category: "Formal wear",
    colors: ["Black"],
    sizes: ["38R", "40R", "42R"],
    storeTypes: ["men", "suits"],
    imgs: productLightWebImgs(4),
  },
  {
    title: "Emerald Textured Wool Suit",
    titleKey: "demoProdTitle5",
    reviews: 8,
    price: 579.0,
    discountedPrice: 419.0,
    id: 5,
    category: "Men's tailoring",
    colors: ["Green"],
    sizes: ["40R", "42R"],
    storeTypes: ["men", "suits"],
    imgs: productLightWebImgs(5),
  },
  {
    title: "Ivory Tailored Blazer & Trousers",
    titleKey: "demoProdTitle6",
    reviews: 14,
    price: 499.0,
    discountedPrice: 339.0,
    id: 6,
    category: "Seasonal",
    colors: ["Ivory"],
    sizes: ["38R", "40R", "42R"],
    storeTypes: ["men", "suits", "outerwear"],
    imgs: productLightWebImgs(6),
  },
  {
    title: "Brown Three-Piece Suit",
    titleKey: "demoProdTitle7",
    reviews: 10,
    price: 629.0,
    discountedPrice: 449.0,
    id: 7,
    category: "Men's tailoring",
    colors: ["Brown"],
    sizes: ["40R", "42R", "44R"],
    storeTypes: ["men", "suits"],
    imgs: productLightWebImgs(7),
  },
  {
    title: "Midnight Blue Evening Suit",
    titleKey: "demoProdTitle8",
    reviews: 13,
    price: 649.0,
    discountedPrice: 469.0,
    id: 8,
    category: "Formal wear",
    colors: ["Blue"],
    sizes: ["38R", "40R", "42R", "44R"],
    storeTypes: ["men", "suits"],
    imgs: productLightWebImgs(8),
  },
];
