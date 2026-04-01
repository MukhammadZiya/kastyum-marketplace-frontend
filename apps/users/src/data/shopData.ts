import type { Product } from "../types/product";

export type ShopProduct = Product & {
  category: string;
  colors: readonly string[];
  sizes: readonly string[];
  /** Matches header catalog dropdown (desktop, laptop, …). Empty = only “All categories”. */
  storeTypes: readonly string[];
};

export { HEADER_CATALOG_OPTIONS } from "./headerCatalogOptions";

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

export const PRICE_FILTER_OPTIONS = [
  { id: "under-50", label: "Under $50" },
  { id: "50-100", label: "$50 – $100" },
  { id: "100-500", label: "$100 – $500" },
  { id: "500-plus", label: "$500+" },
] as const;

export type PriceFilterId = (typeof PRICE_FILTER_OPTIONS)[number]["id"];

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
    title: "Havit HV-G69 USB Gamepad",
    reviews: 15,
    price: 59.0,
    discountedPrice: 29.0,
    id: 1,
    category: "Accessories",
    colors: ["Black"],
    sizes: ["One size"],
    storeTypes: [],
    imgs: {
      thumbnails: ["/images/products/product-1-sm-1.png", "/images/products/product-1-sm-2.png"],
      previews: ["/images/products/product-1-bg-1.png", "/images/products/product-1-bg-2.png"],
    },
  },
  {
    title: "iPhone 14 Plus , 6/128GB",
    reviews: 5,
    price: 899.0,
    discountedPrice: 99.0,
    id: 2,
    category: "Electronics",
    colors: ["Black", "Silver"],
    sizes: ["128GB"],
    storeTypes: ["phone"],
    imgs: {
      thumbnails: ["/images/products/product-2-sm-1.png", "/images/products/product-2-sm-2.png"],
      previews: ["/images/products/product-2-bg-1.png", "/images/products/product-2-bg-2.png"],
    },
  },
  {
    title: "Apple iMac M1 24-inch 2021",
    reviews: 5,
    price: 59.0,
    discountedPrice: 29.0,
    id: 3,
    category: "Computers",
    colors: ["Blue", "Silver"],
    sizes: ['24"'],
    storeTypes: ["desktop", "monitor"],
    imgs: {
      thumbnails: ["/images/products/product-3-sm-1.png", "/images/products/product-3-sm-2.png"],
      previews: ["/images/products/product-3-bg-1.png", "/images/products/product-3-bg-2.png"],
    },
  },
  {
    title: "MacBook Air M1 chip, 8/256GB",
    reviews: 6,
    price: 59.0,
    discountedPrice: 29.0,
    id: 4,
    category: "Computers",
    colors: ["Space Gray"],
    sizes: ['13"', "256GB"],
    storeTypes: ["laptop"],
    imgs: {
      thumbnails: ["/images/products/product-4-sm-1.png", "/images/products/product-4-sm-2.png"],
      previews: ["/images/products/product-4-bg-1.png", "/images/products/product-4-bg-2.png"],
    },
  },
  {
    title: "Apple Watch Ultra",
    reviews: 3,
    price: 99.0,
    discountedPrice: 29.0,
    id: 5,
    category: "Wearables",
    colors: ["Titanium"],
    sizes: ["One size"],
    storeTypes: ["watch"],
    imgs: {
      thumbnails: ["/images/products/product-5-sm-1.png", "/images/products/product-5-sm-2.png"],
      previews: ["/images/products/product-5-bg-1.png", "/images/products/product-5-bg-2.png"],
    },
  },
  {
    title: "Logitech MX Master 3 Mouse",
    reviews: 15,
    price: 59.0,
    discountedPrice: 29.0,
    id: 6,
    category: "Accessories",
    colors: ["Black"],
    sizes: ["One size"],
    storeTypes: ["mouse"],
    imgs: {
      thumbnails: ["/images/products/product-6-sm-1.png", "/images/products/product-6-sm-2.png"],
      previews: ["/images/products/product-6-bg-1.png", "/images/products/product-6-bg-2.png"],
    },
  },
  {
    title: "Apple iPad Air 5th Gen - 64GB",
    reviews: 15,
    price: 59.0,
    discountedPrice: 29.0,
    id: 7,
    category: "Electronics",
    colors: ["Blue"],
    sizes: ["64GB"],
    storeTypes: ["tablet"],
    imgs: {
      thumbnails: ["/images/products/product-7-sm-1.png", "/images/products/product-7-sm-2.png"],
      previews: ["/images/products/product-7-bg-1.png", "/images/products/product-7-bg-2.png"],
    },
  },
  {
    title: "Asus RT Dual Band Router",
    reviews: 15,
    price: 59.0,
    discountedPrice: 29.0,
    id: 8,
    category: "Networking",
    colors: ["Black"],
    sizes: ["One size"],
    storeTypes: [],
    imgs: {
      thumbnails: ["/images/products/product-8-sm-1.png", "/images/products/product-8-sm-2.png"],
      previews: ["/images/products/product-8-bg-1.png", "/images/products/product-8-bg-1.png"],
    },
  },
];
