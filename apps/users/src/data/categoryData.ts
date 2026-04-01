export type CategoryItem = {
  id: number;
  title: string;
  img: string;
  /** Passed as `?q=` on shop so results match this category (title substring search). */
  shopSearchQuery: string;
};

export const categoryData: CategoryItem[] = [
  {
    title: "Televisions",
    id: 1,
    img: "/images/categories/categories-01.png",
    shopSearchQuery: "iMac",
  },
  {
    title: "Laptop & PC",
    id: 2,
    img: "/images/categories/categories-02.png",
    shopSearchQuery: "MacBook",
  },
  {
    title: "Mobile & Tablets",
    id: 3,
    img: "/images/categories/categories-03.png",
    shopSearchQuery: "iPhone",
  },
  {
    title: "Games & Videos",
    id: 4,
    img: "/images/categories/categories-04.png",
    shopSearchQuery: "Gamepad",
  },
  {
    title: "Home Appliances",
    id: 5,
    img: "/images/categories/categories-05.png",
    shopSearchQuery: "Router",
  },
  {
    title: "Health & Sports",
    id: 6,
    img: "/images/categories/categories-06.png",
    shopSearchQuery: "Watch",
  },
  {
    title: "Televisions",
    id: 8,
    img: "/images/categories/categories-04.png",
    shopSearchQuery: "iMac",
  },
];

/** Unique titles for nav (carousel may repeat the same category). */
export function categoryDataUniqueForNav(): CategoryItem[] {
  const seen = new Set<string>();
  return categoryData.filter((c) => {
    if (seen.has(c.title)) return false;
    seen.add(c.title);
    return true;
  });
}
