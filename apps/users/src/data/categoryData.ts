import { primaryImageForGroup } from "./lightWebpImages";

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
    img: primaryImageForGroup(1),
    shopSearchQuery: "iMac",
  },
  {
    title: "Laptop & PC",
    id: 2,
    img: primaryImageForGroup(2),
    shopSearchQuery: "MacBook",
  },
  {
    title: "Mobile & Tablets",
    id: 3,
    img: primaryImageForGroup(3),
    shopSearchQuery: "iPhone",
  },
  {
    title: "Games & Videos",
    id: 4,
    img: primaryImageForGroup(4),
    shopSearchQuery: "Gamepad",
  },
  {
    title: "Home Appliances",
    id: 5,
    img: primaryImageForGroup(5),
    shopSearchQuery: "Router",
  },
  {
    title: "Health & Sports",
    id: 6,
    img: primaryImageForGroup(6),
    shopSearchQuery: "Watch",
  },
  {
    title: "Televisions",
    id: 8,
    img: primaryImageForGroup(4),
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
